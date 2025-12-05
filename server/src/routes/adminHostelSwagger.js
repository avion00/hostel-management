/**
 * @swagger
 * /admin/hostels:
 *   post:
 *     tags: [Admin - Hostels]
 *     summary: Create new hostel with image upload
 *     description: Create a new property/hostel with multiple image uploads (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - manager_id
 *               - name
 *               - address
 *               - city
 *               - state
 *               - pincode
 *               - total_rooms
 *               - price_starting
 *             properties:
 *               manager_id:
 *                 type: string
 *                 format: uuid
 *                 description: UUID of the manager
 *                 example: e127ba6d-27d5-458c-b5cc-5407bea64cec
 *               name:
 *                 type: string
 *                 description: Property name
 *                 example: Green Valley Student Hostel
 *               description:
 *                 type: string
 *                 description: Property description
 *                 example: Modern hostel with excellent facilities
 *               address:
 *                 type: string
 *                 description: Full address
 *                 example: Chowk Road, Near DU
 *               city:
 *                 type: string
 *                 description: City name
 *                 example: Dharan
 *               area:
 *                 type: string
 *                 description: Area/locality
 *                 example: Chowk
 *               state:
 *                 type: string
 *                 description: State/Province
 *                 example: Province 1
 *               pincode:
 *                 type: string
 *                 description: Postal code
 *                 example: "56700"
 *               latitude:
 *                 type: number
 *                 format: float
 *                 description: GPS latitude
 *                 example: 26.8124
 *               longitude:
 *                 type: number
 *                 format: float
 *                 description: GPS longitude
 *                 example: 87.2847
 *               near_college:
 *                 type: string
 *                 description: Nearby college/university
 *                 example: Dharan University
 *               established_year:
 *                 type: integer
 *                 description: Year established
 *                 example: 2020
 *               total_rooms:
 *                 type: integer
 *                 description: Total number of rooms
 *                 example: 15
 *               available_rooms:
 *                 type: integer
 *                 description: Available rooms
 *                 example: 10
 *               total_beds:
 *                 type: integer
 *                 description: Total beds
 *                 example: 30
 *               available_beds:
 *                 type: integer
 *                 description: Available beds
 *                 example: 20
 *               staff_count:
 *                 type: integer
 *                 description: Number of staff
 *                 example: 5
 *               price_starting:
 *                 type: number
 *                 description: Starting price in Rs.
 *                 example: 8500
 *               amenities:
 *                 type: string
 *                 description: JSON array of amenities as string
 *                 example: '["WiFi","AC","Parking","Gym"]'
 *               rules:
 *                 type: string
 *                 description: JSON array of rules as string
 *                 example: '["No smoking","No pets","Quiet hours 10PM-6AM"]'
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Property images (max 10, 5MB each)
 *     responses:
 *       201:
 *         description: Hostel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Hostel created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["/uploads/properties/property-id/image1_1733334123456.jpg"]
 *       400:
 *         description: Validation error or file upload error
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Manager not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /admin/hostels/{id}:
 *   patch:
 *     tags: [Admin - Hostels]
 *     summary: Update hostel with image upload
 *     description: Update hostel details and add new images (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price_starting:
 *                 type: number
 *               amenities:
 *                 type: string
 *                 description: JSON array as string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: New images to add (max 10, 5MB each)
 *     responses:
 *       200:
 *         description: Hostel updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Hostel not found
 *       500:
 *         description: Server error
 */

export default {};
