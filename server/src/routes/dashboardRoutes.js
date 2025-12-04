import express from 'express';
import {
  getManagerDashboard,
  getAdminDashboard,
  getUserDashboard
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/manager', authorize('manager'), getManagerDashboard);
router.get('/admin', authorize('admin'), getAdminDashboard);
router.get('/user', authorize('student'), getUserDashboard);

export default router;
