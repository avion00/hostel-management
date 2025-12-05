import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats,
  resetUserPassword
} from '../controllers/userManagementController.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: User management endpoints (Admin only)
 */

/**
 * @swagger
 * /admin/users/stats:
 *   get:
 *     tags: [User Management]
 *     summary: Get user statistics
 *     description: Get statistics about users by role and status
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 */
router.get('/stats', getUserStats);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [User Management]
 *     summary: Get all users
 *     description: Get list of all users with filters and pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [all, admin, manager, student]
 *         description: Filter by user role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, active, inactive]
 *         description: Filter by user status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or phone
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     tags: [User Management]
 *     summary: Get user by ID
 *     description: Get detailed information about a specific user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /admin/users:
 *   post:
 *     tags: [User Management]
 *     summary: Create new user
 *     description: Create a new user account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               role:
 *                 type: string
 *                 enum: [admin, manager, student]
 *                 example: student
 *               is_active:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error or email already exists
 */
router.post('/', createUser);

/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     tags: [User Management]
 *     summary: Update user
 *     description: Update user information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, manager, student]
 *               is_active:
 *                 type: boolean
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/:id', updateUser);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     tags: [User Management]
 *     summary: Delete user
 *     description: Delete a user account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Cannot delete user with active data
 *       404:
 *         description: User not found
 */
router.delete('/:id', deleteUser);

/**
 * @swagger
 * /admin/users/{id}/toggle-status:
 *   patch:
 *     tags: [User Management]
 *     summary: Toggle user status
 *     description: Activate or deactivate a user account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User status toggled successfully
 *       404:
 *         description: User not found
 */
router.patch('/:id/toggle-status', toggleUserStatus);

/**
 * @swagger
 * /admin/users/{id}/reset-password:
 *   patch:
 *     tags: [User Management]
 *     summary: Reset user password
 *     description: Reset a user's password
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid password
 *       404:
 *         description: User not found
 */
router.patch('/:id/reset-password', resetUserPassword);

export default router;
