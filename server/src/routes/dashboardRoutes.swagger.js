/**
 * @swagger
 * /dashboard/user:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get student dashboard
 *     description: Get dashboard data for student (bookings, payments, stats)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         active_bookings:
 *                           type: integer
 *                           example: 1
 *                         total_bookings:
 *                           type: integer
 *                           example: 3
 *                         total_paid:
 *                           type: number
 *                           example: 25500
 *                         pending_payments:
 *                           type: number
 *                           example: 8500
 *                     currentBooking:
 *                       type: object
 *                     bookingHistory:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Not authorized
 * 
 * /dashboard/manager:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get manager dashboard
 *     description: Get dashboard data for hostel manager (properties, students, bookings, revenue)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total_properties:
 *                           type: integer
 *                           example: 3
 *                         total_students:
 *                           type: integer
 *                           example: 15
 *                         total_rooms:
 *                           type: integer
 *                           example: 50
 *                         occupied_rooms:
 *                           type: integer
 *                           example: 35
 *                         total_revenue:
 *                           type: number
 *                           example: 255000
 *                     students:
 *                       type: array
 *                       description: List of enrolled students with room assignments
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           property_name:
 *                             type: string
 *                           room_number:
 *                             type: string
 *                           check_in_date:
 *                             type: string
 *                           status:
 *                             type: string
 *                     properties:
 *                       type: array
 *                       items:
 *                         type: object
 *                     recentBookings:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (not a manager)
 * 
 * /dashboard/admin:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get admin dashboard
 *     description: Get complete system dashboard with all statistics and analytics (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       description: System-wide statistics
 *                     recentActivities:
 *                       type: object
 *                       description: Recent bookings, users, properties
 *                     analytics:
 *                       type: object
 *                       description: Monthly stats, top properties, top managers, payment stats
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (not an admin)
 */
