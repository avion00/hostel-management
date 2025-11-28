import express from 'express';
import {
  getHostels,
  getHostel,
  createHostel,
  updateHostel,
  deleteHostel,
  getFeaturedHostels
} from '../controllers/hostelController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/featured', getFeaturedHostels);
router.get('/', getHostels);
router.get('/:id', getHostel);
router.post('/', protect, authorize('partner', 'admin'), createHostel);
router.put('/:id', protect, authorize('partner', 'admin'), updateHostel);
router.delete('/:id', protect, authorize('partner', 'admin'), deleteHostel);

export default router;
