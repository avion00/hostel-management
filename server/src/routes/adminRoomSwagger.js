/**
 * @swagger
 * tags:
 *   - name: Admin - Room Types
 *     description: Manage room types for properties/hostels
 *
 * /admin/rooms:
 *   post:
 *     tags: [Admin - Room Types]
 *     summary: Create new room type
 *     description: Create a new room type for a specific property/hostel (Admin only)
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
 *               - name
 *               - price_per_month
 *               - total_beds
 *             properties:
 *               property_id:
 *                 type: string
 *                 description: ID of the property/hostel
 *                 example: "d74a4f4c-1a4c-4826-8ea0-20dbb077c134"
 *               name:
 *                 type: string
 *                 description: Name of the room type
 *                 example: "2 Bed Sharing"
 *               description:
 *                 type: string
 *                 description: Description of the room type
 *                 example: "Two-bed sharing room with attached bathroom"
 *               price_per_month:
 *                 type: number
 *                 description: Monthly price for this room type
 *                 example: 8000
 *               price_per_week:
 *                 type: number
 *                 description: Weekly price (optional)
 *                 example: 2500
 *               price_per_day:
 *                 type: number
 *                 description: Daily price (optional)
 *                 example: 500
 *               total_beds:
 *                 type: integer
 *                 description: Total beds for this room type
 *                 example: 4
 *               beds_available:
 *                 type: integer
 *                 description: Currently available beds (defaults to total_beds if omitted)
 *                 example: 4
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Amenities for this room type
 *                 example: ["wifi", "attached_bathroom"]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Image URLs for the room type
 *     responses:
 *       201:
 *         description: Room type created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *
 *   get:
 *     tags: [Admin - Room Types]
 *     summary: Get all room types
 *     description: List room types with optional filters for property and availability (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: property_id
 *         schema:
 *           type: string
 *         description: Filter by property/hostel ID
 *       - in: query
 *         name: available
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: If "true", only return room types with beds_available > 0
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by room type name or property name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Room types retrieved successfully
 *       401:
 *         description: Not authorized
 */

export default {};
