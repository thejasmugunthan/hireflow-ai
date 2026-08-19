import express from 'express';
import {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplicationStage,
  addInterviewNote,
  triggerAIAnalysis,
  getDashboardStats,
  getApplicationResume,
} from '../controllers/applicationController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public route: Candidate applies with resume upload
router.post('/', uploadResume.single('resume'), submitApplication);

// Public / Candidate / Admin: View and stream resume PDF directly from MongoDB
router.get('/:id/resume', getApplicationResume);

// Admin protected routes
router.get('/admin/stats', protectAdmin, getDashboardStats);
router.get('/admin', protectAdmin, getApplications);
router.get('/admin/:id', protectAdmin, getApplicationById);
router.get('/admin/:id/resume', protectAdmin, getApplicationResume);
router.patch('/admin/:id/stage', protectAdmin, updateApplicationStage);
router.post('/admin/:id/notes', protectAdmin, addInterviewNote);
router.post('/admin/:id/analyze', protectAdmin, triggerAIAnalysis);

export default router;
