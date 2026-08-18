import Job from '../models/Job.js';
import Application from '../models/Application.js';

// Public: Get all active jobs for dropdown and public job board
export const getActiveJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// Public: Get single job details
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job opening not found',
      });
    }
    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all jobs with applicant counts
export const getAllJobsAdmin = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).lean();

    // Aggregate application counts for each job
    const jobIds = jobs.map((j) => j._id);
    const counts = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: '$jobId', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const jobsWithCounts = jobs.map((job) => ({
      ...job,
      applicationCount: countMap[job._id.toString()] || 0,
    }));

    res.json({
      success: true,
      count: jobsWithCounts.length,
      data: jobsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create new job
export const createJob = async (req, res, next) => {
  try {
    const { title, description, skills, location, employmentType, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Job title and description are required',
      });
    }

    const parsedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const job = await Job.create({
      title,
      description,
      skills: parsedSkills,
      location: location || 'Bangalore',
      employmentType: employmentType || 'Full-time',
      status: status || 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update job
export const updateJob = async (req, res, next) => {
  try {
    const { title, description, skills, location, employmentType, status } = req.body;

    const parsedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined;

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(parsedSkills !== undefined && { skills: parsedSkills }),
      ...(location && { location }),
      ...(employmentType && { employmentType }),
      ...(status && { status }),
    };

    const job = await Job.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete job
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
