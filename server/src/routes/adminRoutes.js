import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import uploadProperty from '../middleware/uploadProperty.js';

// Import all admin controllers
import * as adminController from '../controllers/adminController.js';
import * as adminHostelController from '../controllers/adminHostelController.js';
import * as adminRoomController from '../controllers/adminRoomController.js';
import * as adminBookingController from '../controllers/adminBookingController.js';
import * as adminPaymentController from '../controllers/adminPaymentController.js';
import * as adminSubscriptionController from '../controllers/adminSubscriptionController.js';
import * as adminDocumentController from '../controllers/adminDocumentController.js';
import * as adminCMSController from '../controllers/adminCMSController.js';

const router = express.Router();

// Protect all routes; authorization is applied per-route below
router.use(protect);

// ==================== USER MANAGEMENT ====================
/**
 * @route   GET /api/admin/users
 * @desc    Get all users with filters
 * @access  Private/Admin
 */
router.get('/users', authorize('admin'), adminController.getAllUsers);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get single user by ID
 * @access  Private/Admin
 */
router.get('/users/:id', authorize('admin'), adminController.getUserById);

/**
 * @route   PATCH /api/admin/users/:id/block
 * @desc    Block user
 * @access  Private/Admin
 */
router.patch('/users/:id/block', authorize('admin'), adminController.blockUser);

/**
 * @route   PATCH /api/admin/users/:id/unblock
 * @desc    Unblock user
 * @access  Private/Admin
 */
router.patch('/users/:id/unblock', authorize('admin'), adminController.unblockUser);

/**
 * @route   PATCH /api/admin/users/:id/change-role
 * @desc    Change user role
 * @access  Private/Admin
 */
router.patch('/users/:id/change-role', authorize('admin'), adminController.changeUserRole);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete('/users/:id', authorize('admin'), adminController.deleteUser);

// ==================== HOSTEL MANAGEMENT ====================
/**
 * @route   POST /api/admin/hostels
 * @desc    Create new hostel
 * @access  Private/Admin
 */
router.post('/hostels', authorize('admin'), uploadProperty.array('images', 10), adminHostelController.createHostel);

/**
 * @route   GET /api/admin/hostels
 * @desc    Get all hostels with filters
 * @access  Private/Admin
 */
router.get('/hostels', authorize('admin'), adminHostelController.getAllHostels);

/**
 * @route   GET /api/admin/hostels/:id
 * @desc    Get single hostel by ID
 * @access  Private/Admin
 */
router.get('/hostels/:id', authorize('admin'), adminHostelController.getHostelById);

/**
 * @route   PATCH /api/admin/hostels/:id
 * @desc    Update hostel
 * @access  Private/Admin
 */
router.patch('/hostels/:id', authorize('admin'), uploadProperty.array('images', 10), adminHostelController.updateHostel);

/**
 * @route   PATCH /api/admin/hostels/:id/approve
 * @desc    Approve hostel
 * @access  Private/Admin
 */
router.patch('/hostels/:id/approve', authorize('admin'), adminHostelController.approveHostel);

/**
 * @route   PATCH /api/admin/hostels/:id/reject
 * @desc    Reject hostel
 * @access  Private/Admin
 */
router.patch('/hostels/:id/reject', authorize('admin'), adminHostelController.rejectHostel);

/**
 * @route   DELETE /api/admin/hostels/:id
 * @desc    Delete hostel
 * @access  Private/Admin
 */
router.delete('/hostels/:id', authorize('admin'), adminHostelController.deleteHostel);

/**
 * @route   PATCH /api/admin/hostels/:id/suspend
 * @desc    Suspend hostel
 * @access  Private/Admin
 */
router.patch('/hostels/:id/suspend', authorize('admin'), adminHostelController.suspendHostel);

/**
 * @route   PATCH /api/admin/hostels/:id/reactivate
 * @desc    Reactivate hostel from suspended status
 * @access  Private/Admin
 */
router.patch('/hostels/:id/reactivate', authorize('admin'), adminHostelController.reactivateHostel);

// ==================== ROOM TYPE MANAGEMENT ====================
/**
 * @route   POST /api/admin/rooms
 * @desc    Create new room type
 * @access  Private/Admin
 */
router.post('/rooms', authorize('admin', 'manager'), adminRoomController.createRoomType);

/**
 * @route   GET /api/admin/rooms
 * @desc    Get all room types with filters
 * @access  Private (any authenticated user)
 */
router.get('/rooms', adminRoomController.getAllRoomTypes);

/**
 * @route   GET /api/admin/rooms/:id
 * @desc    Get single room type by ID
 * @access  Private/Admin
 */
router.get('/rooms/:id', authorize('admin', 'manager'), adminRoomController.getRoomTypeById);

/**
 * @route   PATCH /api/admin/rooms/:id
 * @desc    Update room type
 * @access  Private/Admin
 */
router.patch('/rooms/:id', authorize('admin', 'manager'), adminRoomController.updateRoomType);

/**
 * @route   DELETE /api/admin/rooms/:id
 * @desc    Delete room type
 * @access  Private/Admin
 */
router.delete('/rooms/:id', authorize('admin', 'manager'), adminRoomController.deleteRoomType);

// ==================== BOOKING MANAGEMENT ====================
/**
 * @route   GET /api/admin/bookings
 * @desc    Get all bookings with filters
 * @access  Private/Admin
 */
router.get('/bookings', authorize('admin'), adminBookingController.getAllBookings);

/**
 * @route   GET /api/admin/bookings/:id
 * @desc    Get single booking by ID
 * @access  Private/Admin
 */
router.get('/bookings/:id', authorize('admin'), adminBookingController.getBookingById);

/**
 * @route   PATCH /api/admin/bookings/:id/cancel
 * @desc    Cancel booking
 * @access  Private/Admin
 */
router.patch('/bookings/:id/cancel', authorize('admin'), adminBookingController.cancelBooking);

/**
 * @route   PATCH /api/admin/bookings/:id/confirm
 * @desc    Confirm booking
 * @access  Private/Admin
 */
router.patch('/bookings/:id/confirm', authorize('admin'), adminBookingController.confirmBooking);

/**
 * @route   DELETE /api/admin/bookings/:id
 * @desc    Delete booking
 * @access  Private/Admin
 */
router.delete('/bookings/:id', authorize('admin'), adminBookingController.deleteBooking);

// ==================== PAYMENT MANAGEMENT ====================
/**
 * @route   GET /api/admin/payments
 * @desc    Get all payments with filters
 * @access  Private/Admin
 */
router.get('/payments', authorize('admin'), adminPaymentController.getAllPayments);

/**
 * @route   GET /api/admin/payments/stats
 * @desc    Get payment statistics
 * @access  Private/Admin
 */
router.get('/payments/stats', authorize('admin'), adminPaymentController.getPaymentStats);

/**
 * @route   GET /api/admin/payments/:id
 * @desc    Get single payment by ID
 * @access  Private/Admin
 */
router.get('/payments/:id', authorize('admin'), adminPaymentController.getPaymentById);

/**
 * @route   PATCH /api/admin/payments/:id/refund
 * @desc    Refund payment
 * @access  Private/Admin
 */
router.patch('/payments/:id/refund', authorize('admin'), adminPaymentController.refundPayment);

// ==================== SUBSCRIPTION MANAGEMENT ====================
/**
 * @route   POST /api/admin/subscriptions
 * @desc    Create subscription plan
 * @access  Private/Admin
 */
router.post('/subscriptions', authorize('admin'), adminSubscriptionController.createPlan);

/**
 * @route   POST /api/admin/subscriptions/assign
 * @desc    Assign subscription plan to user
 * @access  Private/Admin
 */
router.post('/subscriptions/assign', authorize('admin'), adminSubscriptionController.assignPlanToUser);

/**
 * @route   GET /api/admin/subscriptions
 * @desc    Get all subscription plans
 * @access  Private/Admin
 */
router.get('/subscriptions', authorize('admin'), adminSubscriptionController.getAllPlans);

/**
 * @route   GET /api/admin/subscriptions/:id
 * @desc    Get single subscription plan by ID
 * @access  Private/Admin
 */
router.get('/subscriptions/:id', authorize('admin'), adminSubscriptionController.getPlanById);

/**
 * @route   PATCH /api/admin/subscriptions/:id
 * @desc    Update subscription plan
 * @access  Private/Admin
 */
router.patch('/subscriptions/:id', authorize('admin'), adminSubscriptionController.updatePlan);

/**
 * @route   DELETE /api/admin/subscriptions/:id
 * @desc    Delete subscription plan
 * @access  Private/Admin
 */
router.delete('/subscriptions/:id', authorize('admin'), adminSubscriptionController.deletePlan);

// ==================== DOCUMENT VERIFICATION ====================
/**
 * @route   GET /api/admin/documents
 * @desc    Get all documents with filters
 * @access  Private/Admin
 */
router.get('/documents', authorize('admin'), adminDocumentController.getAllDocuments);

/**
 * @route   GET /api/admin/documents/stats
 * @desc    Get document verification statistics
 * @access  Private/Admin
 */
router.get('/documents/stats', authorize('admin'), adminDocumentController.getDocumentStats);

/**
 * @route   GET /api/admin/documents/:id
 * @desc    Get single document by ID
 * @access  Private/Admin
 */
router.get('/documents/:id', authorize('admin'), adminDocumentController.getDocumentById);

/**
 * @route   PATCH /api/admin/documents/:id/approve
 * @desc    Approve document
 * @access  Private/Admin
 */
router.patch('/documents/:id/approve', authorize('admin'), adminDocumentController.approveDocument);

/**
 * @route   PATCH /api/admin/documents/:id/reject
 * @desc    Reject document
 * @access  Private/Admin
 */
router.patch('/documents/:id/reject', authorize('admin'), adminDocumentController.rejectDocument);

// ==================== CMS MANAGEMENT ====================
/**
 * @route   GET /api/admin/cms
 * @desc    Get CMS content
 * @access  Private/Admin
 */
router.get('/cms', authorize('admin'), adminCMSController.getCMS);

/**
 * @route   PATCH /api/admin/cms
 * @desc    Update CMS content
 * @access  Private/Admin
 */
router.patch('/cms', authorize('admin'), adminCMSController.updateCMS);

// ==================== ANALYTICS ====================
/**
 * @route   GET /api/admin/analytics/overview
 * @desc    Get platform analytics overview
 * @access  Private/Admin
 */
router.get('/analytics/overview', authorize('admin'), adminController.getAnalyticsOverview);

export default router;
