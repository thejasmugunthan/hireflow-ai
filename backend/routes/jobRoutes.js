import express from 'express';
import {
  getActiveJobs,
  getJobById,
  getAllJobsAdmin,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getActiveJobs);
router.get('/:id', getJobById);

// Admin protected routes
router.get('/admin/all', protectAdmin, getAllJobsAdmin);
router.post('/admin', protectAdmin, createJob);
router.put('/admin/:id', protectAdmin, updateJob);
router.delete('/admin/:id', protectAdmin, deleteJob);

export default router;
