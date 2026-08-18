import Application, { VALID_STAGES } from '../models/Application.js';
import Candidate from '../models/Candidate.js';
import Job from '../models/Job.js';
import { uploadFile } from '../config/cloudinary.js';
import { extractTextFromResume } from '../services/resumeService.js';
import { analyzeCandidateResume } from '../services/aiService.js';

// Stage Transition Rules
const ALLOWED_TRANSITIONS = {
  Applied: ['R1', 'Reject'],
  R1: ['R2', 'R1 Reject'],
  R2: ['R3', 'R2 Reject'],
  R3: ['Approved', 'R3 Reject'],
  Reject: [],
  'R1 Reject': [],
  'R2 Reject': [],
  'R3 Reject': [],
  Approved: [],
};

// Public: Submit application
export const submitApplication = async (req, res, next) => {
  try {
    const { name, phone, email, jobId, note } = req.body;
    const file = req.file;

    // Validation
    if (!name || !phone || !email || !jobId) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and target job are required.',
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required (PDF, DOC, or DOCX up to 5MB).',
      });
    }

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'The selected job position is no longer active or available.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if candidate exists
    let candidate = await Candidate.findOne({ email: cleanEmail });

    if (candidate) {
      // Check for duplicate application
      const existingApplication = await Application.findOne({
        candidateId: candidate._id,
        jobId: job._id,
      });

      if (existingApplication) {
        return res.status(409).json({
          success: false,
          message: 'You have already applied for this position.',
        });
      }
    }

    // Upload resume to Cloudinary or local fallback
    const uploadResult = await uploadFile(file);

    // Extract text from resume
    const resumeRawText = await extractTextFromResume(file);

    if (!candidate) {
      candidate = await Candidate.create({
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        resumeUrl: uploadResult.url,
        resumePublicId: uploadResult.publicId,
        resumeRawText,
      });
    } else {
      // Update candidate details and latest resume
      candidate.name = name.trim();
      candidate.phone = phone.trim();
      candidate.resumeUrl = uploadResult.url;
      candidate.resumePublicId = uploadResult.publicId;
      if (resumeRawText) candidate.resumeRawText = resumeRawText;
      await candidate.save();
    }

    // Create Application
    const application = await Application.create({
      candidateId: candidate._id,
      jobId: job._id,
      note: note ? note.trim() : '',
      stage: 'Applied',
      stageHistory: [
        {
          from: null,
          to: 'Applied',
          changedAt: new Date(),
          reason: 'Initial application submitted',
        },
      ],
      aiAnalysis: {
        status: 'pending',
        matchScore: null,
        summary: 'AI analysis in progress...',
        skills: [],
        matchedSkills: [],
        missingSkills: [],
        strengths: [],
        gaps: [],
      },
    });

    // Run AI analysis asynchronously (non-blocking)
    (async () => {
      try {
        const aiResult = await analyzeCandidateResume({
          resumeText: resumeRawText,
          job,
          candidateName: candidate.name,
        });

        await Application.findByIdAndUpdate(application._id, {
          aiAnalysis: aiResult,
        });
        console.log(`✨ AI Insights generated for application ${application._id}`);
      } catch (aiErr) {
        console.error('Async AI Analysis background error:', aiErr.message);
        await Application.findByIdAndUpdate(application._id, {
          'aiAnalysis.status': 'failed',
          'aiAnalysis.summary': 'AI analysis could not be completed automatically. You can trigger it manually.',
        });
      }
    })();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: {
        applicationId: application._id,
        candidateName: candidate.name,
        jobTitle: job.title,
        appliedAt: application.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this position.',
      });
    }
    next(error);
  }
};

// Admin: Get all applications with search and filters
export const getApplications = async (req, res, next) => {
  try {
    const { jobId, stage, search } = req.query;

    const query = {};

    if (jobId && jobId !== 'all') {
      query.jobId = jobId;
    }

    if (stage && stage !== 'all') {
      query.stage = stage;
    }

    // Populate candidate and job
    let applications = await Application.find(query)
      .populate('candidateId', 'name email phone resumeUrl')
      .populate('jobId', 'title location employmentType skills')
      .sort({ createdAt: -1 })
      .lean();

    // Client search filter by candidate name, email, or AI skills
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      applications = applications.filter((app) => {
        const nameMatch = app.candidateId?.name?.toLowerCase().includes(s);
        const emailMatch = app.candidateId?.email?.toLowerCase().includes(s);
        const jobMatch = app.jobId?.title?.toLowerCase().includes(s);
        const skillMatch = app.aiAnalysis?.skills?.some((sk) =>
          sk.toLowerCase().includes(s)
        );
        return nameMatch || emailMatch || jobMatch || skillMatch;
      });
    }

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get single application details
export const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('candidateId')
      .populate('jobId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update application stage with workflow validation
export const updateApplicationStage = async (req, res, next) => {
  try {
    const { stage, reason, force } = req.body;

    if (!stage || !VALID_STAGES.includes(stage)) {
      return res.status(400).json({
        success: false,
        message: `Invalid stage. Must be one of: ${VALID_STAGES.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const currentStage = application.stage;

    // Check if stage is actually changing
    if (currentStage === stage) {
      return res.json({
        success: true,
        message: 'Application is already in this stage',
        data: application,
      });
    }

    // Validate allowed workflow transition unless forced
    const allowed = ALLOWED_TRANSITIONS[currentStage] || [];
    if (!force && !allowed.includes(stage)) {
      return res.status(400).json({
        success: false,
        message: `Invalid stage transition from "${currentStage}" to "${stage}". Allowed next stages: ${
          allowed.length > 0 ? allowed.join(', ') : 'None (Terminal stage)'
        }`,
      });
    }

    // Record stage history
    application.stageHistory.push({
      from: currentStage,
      to: stage,
      changedAt: new Date(),
      reason: reason || `Moved from ${currentStage} to ${stage}`,
    });

    application.stage = stage;
    await application.save();

    res.json({
      success: true,
      message: `Candidate stage successfully updated to ${stage}`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Add interview note & rating
export const addInterviewNote = async (req, res, next) => {
  try {
    const { stage, rating, notes } = req.body;

    if (!stage || !rating || !notes) {
      return res.status(400).json({
        success: false,
        message: 'Stage, rating (1-5), and interview notes are required.',
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    application.interviewNotes.push({
      stage,
      rating: Number(rating),
      notes: notes.trim(),
      createdAt: new Date(),
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Interview note saved successfully',
      data: application.interviewNotes,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Trigger/Re-run AI Analysis
export const triggerAIAnalysis = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('candidateId')
      .populate('jobId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const resumeText =
      application.candidateId?.resumeRawText ||
      `Candidate ${application.candidateId?.name}, applied for ${application.jobId?.title}.`;

    const aiResult = await analyzeCandidateResume({
      resumeText,
      job: application.jobId,
      candidateName: application.candidateId?.name,
    });

    application.aiAnalysis = aiResult;
    await application.save();

    res.json({
      success: true,
      message: 'AI Candidate Insights generated successfully',
      data: aiResult,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Dashboard stats and analytics
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalJobs = await Job.countDocuments({ status: 'Active' });
    const totalApplications = await Application.countDocuments();
    const approvedCount = await Application.countDocuments({ stage: 'Approved' });
    const pendingCount = await Application.countDocuments({
      stage: { $in: ['Applied', 'R1', 'R2', 'R3'] },
    });

    // Stage breakdown aggregation
    const stageCounts = await Application.aggregate([
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 },
        },
      },
    ]);

    const stageBreakdown = {
      Applied: 0,
      R1: 0,
      R2: 0,
      R3: 0,
      Approved: 0,
      Reject: 0,
    };

    stageCounts.forEach((sc) => {
      const st = sc._id;
      if (st.includes('Reject')) {
        stageBreakdown.Reject += sc.count;
      } else if (stageBreakdown[st] !== undefined) {
        stageBreakdown[st] = sc.count;
      }
    });

    // Recent 5 applications
    const recentApplications = await Application.find()
      .populate('candidateId', 'name email')
      .populate('jobId', 'title')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: {
        totalJobs,
        totalApplications,
        pendingCount,
        approvedCount,
        stageBreakdown,
        recentApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};
