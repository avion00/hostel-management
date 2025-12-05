import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByManager
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/auth.js';
import uploadProperty from '../middleware/uploadProperty.js';

const router = express.Router();

/**
 * @swagger
 * /properties:
 *   get:
 *     tags: [Properties]
 *     summary: Get all properties
 *     description: Get list of all properties with optional search and filters
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, description, address
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *         example: Kathmandu
 *       - in: query
 *         name: pincode
 *         schema:
 *           type: string
 *         description: Filter by pincode
 *         example: "44600"
 *       - in: query
 *         name: near_college
 *         schema:
 *           type: string
 *         description: Filter by nearby college
 *         example: Tribhuvan University
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *         description: Minimum price per month
 *         example: 5000
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *         description: Maximum price per month
 *         example: 15000
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
 *         description: Properties retrieved successfully
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
 *                     $ref: '#/components/schemas/Property'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     pages:
 *                       type: integer
 *                       example: 5
 */
router.get('/', getProperties);

/**
 * @swagger
 * /properties/{id}:
 *   get:
 *     tags: [Properties]
 *     summary: Get property by ID
 *     description: Get detailed information about a specific property including rooms and reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Property ID (UUID)
 *         example: "36b395b4-0930-4ef4-88db-d74bb9df5e8c"
 *     responses:
 *       200:
 *         description: Property details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Property'
 *                     - type: object
 *                       properties:
 *                         rooms:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Room'
 *                         reviews:
 *                           type: array
 *                           items:
 *                             type: object
 *       404:
 *         description: Property not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getPropertyById);

/**
 * @swagger
 * /properties:
 *   post:
 *     tags: [Properties]
 *     summary: Create new property with image upload
 *     description: Create a new property/hostel with multiple image uploads (Manager/Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - city
 *               - state
 *               - pincode
 *               - total_rooms
 *               - price_starting
 *             properties:
 *               name:
 *                 type: string
 *                 example: Green Valley Student Hostel
 *               description:
 *                 type: string
 *                 example: Modern hostel with excellent facilities
 *               address:
 *                 type: string
 *                 example: Chowk Road, Near DU
 *               city:
 *                 type: string
 *                 example: Dharan
 *               state:
 *                 type: string
 *                 example: Province 1
 *               pincode:
 *                 type: string
 *                 example: "56700"
 *               latitude:
 *                 type: number
 *                 example: 26.8124
 *               longitude:
 *                 type: number
 *                 example: 87.2847
 *               near_college:
 *                 type: string
 *                 example: Dharan University
 *               total_rooms:
 *                 type: integer
 *                 example: 15
 *               amenities:
 *                 type: string
 *                 description: JSON array as string
 *                 example: '["WiFi", "AC", "Parking"]'
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Property images (max 10, 5MB each)
 *               price_starting:
 *                 type: number
 *                 example: 8500
 *     responses:
 *       201:
 *         description: Property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden (not manager or admin)
 */
router.post('/', protect, authorize('manager', 'admin'), uploadProperty.array('images', 10), createProperty);

/**
 * @swagger
 * /properties/{id}:
 *   put:
 *     tags: [Properties]
 *     summary: Update property with image upload
 *     description: Update property details and add new images (Manager/Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Property ID (UUID)
 *         example: "36b395b4-0930-4ef4-88db-d74bb9df5e8c"
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
 *         description: Property updated successfully
 *       403:
 *         description: Not authorized to update this property
 *       404:
 *         description: Property not found
 */
router.put('/:id', protect, authorize('manager', 'admin'), uploadProperty.array('images', 10), updateProperty);

/**
 * @swagger
 * /properties/{id}:
 *   delete:
 *     tags: [Properties]
 *     summary: Delete property
 *     description: Delete a property (Manager/Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Property ID (UUID)
 *         example: "36b395b4-0930-4ef4-88db-d74bb9df5e8c"
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       403:
 *         description: Not authorized to delete this property
 *       404:
 *         description: Property not found
 */
router.delete('/:id', protect, authorize('manager', 'admin'), deleteProperty);

/**
 * @swagger
 * /properties/manager/{managerId}:
 *   get:
 *     tags: [Properties]
 *     summary: Get properties by manager
 *     description: Get all properties managed by a specific manager
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: managerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Manager ID (UUID)
 *         example: "e127ba6d-27d5-458c-b5cc-5407bea64cec"
 *     responses:
 *       200:
 *         description: Properties retrieved successfully
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
 *                     $ref: '#/components/schemas/Property'
 *       403:
 *         description: Not authorized to view these properties
 */
router.get('/manager/:managerId', protect, authorize('manager', 'admin'), getPropertiesByManager);

export default router;
