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
 *               - room_type_id
 *               - start_date
 *               - duration_type
 *               - duration_value
 *             properties:
 *               property_id:
 *                 type: string
 *                 description: ID of the property / apartment to book
 *                 example: "d74a4f4c-1a4c-4826-8ea0-20dbb077c134"
 *               room_type_id:
 *                 type: string
 *                 description: UUID of the room type within the property
 *                 example: "c8edbac5-45c6-450f-a135-0fc8760db8ab"
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Check-in date for the booking
 *                 example: "2024-12-15"
 *               duration_type:
 *                 type: string
 *                 description: Duration unit for the booking
 *                 enum: [daily, weekly, monthly]
 *                 example: "monthly"
 *               duration_value:
 *                 type: integer
 *                 description: Number of days / weeks / months based on duration_type
 *                 example: 6
 *               occupants:
 *                 type: integer
 *                 description: Number of occupants / beds for this booking
 *                 example: 1
 *               special_requests:
 *                 type: string
 *                 description: Optional special requests from the student
 *                 example: "Prefer a quiet room with balcony if available"
 *               preferred_floor:
 *                 type: string
 *                 description: Preferred floor for the room (e.g. ground, middle, top)
 *                 example: "top"
 *               check_in_time:
 *                 type: string
 *                 description: Approximate check-in time (HH:MM)
 *                 example: "15:00"
 *               sharing_preference:
 *                 type: string
 *                 description: Sharing preference (single, double, triple, any)
 *                 example: "double"
 *               payment_method:
 *                 type: string
 *                 description: Preferred payment method
 *                 example: "khalti"
 *               pay_mode:
 *                 type: string
 *                 description: Payment mode (full or partial)
 *                 example: "partial"
 *               discount_code:
 *                 type: string
 *                 description: Optional discount or promo code
 *                 example: "WELCOME10"
 *               emergency_contact_name:
 *                 type: string
 *                 description: Name of emergency contact person
 *                 example: "Father Name"
 *               emergency_contact_phone:
 *                 type: string
 *                 description: Phone number of emergency contact
 *                 example: "+977-98XXXXXXXX"
 *               emergency_contact_relation:
 *                 type: string
 *                 description: Relation with emergency contact
 *                 example: "father"
 *               id_document_type:
 *                 type: string
 *                 description: Type of ID document
 *                 example: "citizenship"
 *               id_document_number:
 *                 type: string
 *                 description: ID document number
 *                 example: "1234-5678-9012"
 *               heard_from:
 *                 type: string
 *                 description: How the student heard about this property
 *                 example: "college"
 *               notes_internal:
 *                 type: string
 *                 description: Internal notes visible only to admin/manager
 *                 example: "Student prefers quiet roommates"
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
 *           type: string
 *         description: Property ID (UUID)
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
 *           type: string
 *         description: Booking ID (UUID)
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
 *           type: string
 *         description: Booking ID (UUID)
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
