import Application, { VALID_STAGES } from '../models/Application.js';
import Candidate from '../models/Candidate.js';
import Job from '../models/Job.js';
import { uploadFile } from '../config/cloudinary.js';
import { extractTextFromResume } from '../services/resumeService.js';
import { analyzeCandidateResume } from '../services/aiService.js';

// Strict Stage Transition Rules: Forward-only with Pass / Fail choices
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

// Public: Submit application with direct MongoDB PDF storage
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

    // Optional Cloudinary upload (safe fallback to empty string if not configured)
    let cloudUrl = '';
    let publicId = '';
    try {
      const uploadResult = await uploadFile(file);
      cloudUrl = uploadResult.url;
      publicId = uploadResult.publicId;
    } catch (uploadErr) {
      console.log('Cloudinary not configured, relying directly on MongoDB Atlas resume storage.');
    }

    // Extract text from resume for AI screening
    const resumeRawText = await extractTextFromResume(file);

    // Convert PDF/DOCX binary buffer to Base64 string for persistent MongoDB Atlas storage
    const resumeData = file.buffer.toString('base64');
    const resumeContentType = file.mimetype || 'application/pdf';
    const resumeFileName = file.originalname || 'resume.pdf';

    if (!candidate) {
      candidate = await Candidate.create({
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        resumeUrl: cloudUrl,
        resumePublicId: publicId,
        resumeRawText,
        resumeData,
        resumeContentType,
        resumeFileName,
      });
    } else {
      // Update candidate details and latest resume
      candidate.name = name.trim();
      candidate.phone = phone.trim();
      if (cloudUrl) candidate.resumeUrl = cloudUrl;
      candidate.resumePublicId = publicId;
      candidate.resumeRawText = resumeRawText;
      candidate.resumeData = resumeData;
      candidate.resumeContentType = resumeContentType;
      candidate.resumeFileName = resumeFileName;
      await candidate.save();
    }

    // Create Application with initial 'Applied' stage
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
        plagiarismScore: null,
        originalityScore: null,
        plagiarismFlags: [],
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
        console.log(`✨ AI Insights & Plagiarism score generated for application ${application._id}`);
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

// Stream Resume directly from MongoDB Atlas document
export const getApplicationResume = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('candidateId');
    if (!application || !application.candidateId) {
      return res.status(404).json({
        success: false,
        message: 'Application or candidate record not found',
      });
    }

    const candidate = application.candidateId;

    if (!candidate.resumeData) {
      // Legacy fallback: If external URL exists, redirect to it
      if (candidate.resumeUrl && candidate.resumeUrl.startsWith('http')) {
        return res.redirect(candidate.resumeUrl);
      }
      return res.status(404).json({
        success: false,
        message: 'Resume binary document is not stored in database.',
      });
    }

    const buffer = Buffer.from(candidate.resumeData, 'base64');
    const contentType = candidate.resumeContentType || 'application/pdf';
    const fileName = encodeURIComponent(candidate.resumeFileName || `${candidate.name}-Resume.pdf`);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

// Admin: Get all applications with search and filters
export const getApplications = async (req, res, next) => {
  try {
    const { jobId, stage, search } = req.query;
    const query = {};

    if (jobId && jobId !== 'all') query.jobId = jobId;
    if (stage && stage !== 'all') query.stage = stage;

    let applications = await Application.find(query)
      .populate('candidateId', 'name email phone resumeUrl resumeFileName')
      .populate('jobId', 'title location employmentType skills')
      .sort({ createdAt: -1 })
      .lean();

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

// Admin: Update application stage with strict workflow validation
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
        message: `Invalid stage transition from "${currentStage}" to "${stage}". Forward options allowed: ${
          allowed.length > 0 ? allowed.join(', ') : 'None (Terminal stage - Candidate cannot be advanced further)'
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
      message: 'AI Candidate Insights & Plagiarism Score generated successfully',
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
