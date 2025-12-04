import express from 'express';
import {
  createBooking,
  getStudentBookings,
  getPropertyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', authorize('student'), createBooking);
router.get('/student', authorize('student'), getStudentBookings);
router.get('/property/:propertyId', authorize('manager', 'admin'), getPropertyBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', authorize('manager', 'admin'), updateBookingStatus);
router.delete('/:id', cancelBooking);

export default router;
