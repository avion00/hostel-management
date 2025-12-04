/**
 * @swagger
 * /bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Create new booking
 *     description: Create a new room booking (Student only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - property_id
 *               - room_id
 *               - check_in_date
 *               - months
 *             properties:
 *               property_id:
 *                 type: integer
 *                 example: 1
 *               room_id:
 *                 type: integer
 *                 example: 5
 *               check_in_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-15"
 *               months:
 *                 type: integer
 *                 example: 6
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Room not available or validation error
 *       401:
 *         description: Not authorized
 * 
 * /bookings/student:
 *   get:
 *     tags: [Bookings]
 *     summary: Get student bookings
 *     description: Get all bookings for the current student
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 * 
 * /bookings/property/{propertyId}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get property bookings
 *     description: Get all bookings for a specific property (Manager/Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *       403:
 *         description: Not authorized
 * 
 * /bookings/{id}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get booking by ID
 *     description: Get detailed booking information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details retrieved
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 *   delete:
 *     tags: [Bookings]
 *     summary: Cancel booking
 *     description: Cancel a booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 * 
 * /bookings/{id}/status:
 *   put:
 *     tags: [Bookings]
 *     summary: Update booking status
 *     description: Update the status of a booking (Manager/Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, active, completed, cancelled]
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Booking status updated
 *       400:
 *         description: Invalid status
 *       403:
 *         description: Not authorized
 */
