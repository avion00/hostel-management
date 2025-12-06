import db from '../config/database-uuid.js';
import { generateUUID } from '../utils/uuid.js';

/**
 * @desc    Create new room type
 * @route   POST /api/admin/rooms
 * @access  Private/Admin
 */
export const createRoomType = async (req, res) => {
  try {
    const body = req.body || {};

    const {
      property_id,
      name,
      description,
      price_per_month,
      price_per_week,
      price_per_day,
      total_beds,
      beds_available,
      amenities,
      images,
    } = body;

    // Validate property exists and check manager ownership for non-admins
    const property = db
      .prepare('SELECT id, manager_id FROM properties WHERE id = ?')
      .get(property_id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Only allow managers to manage room types for their own properties
    if (req.user && req.user.role === 'manager' && property.manager_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage room types for this property',
      });
    }

    // Convert arrays or JSON strings to JSON strings for storage
    let amenitiesStr = null;
    let parsedAmenities = [];
    if (amenities !== undefined && amenities !== null) {
      try {
        parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
        amenitiesStr = JSON.stringify(parsedAmenities);
      } catch (e) {
        // Fallback: store raw value as string
        amenitiesStr = JSON.stringify(amenities);
      }
    }

    let imagesStr = null;
    let parsedImages = [];
    if (images !== undefined && images !== null) {
      try {
        parsedImages = typeof images === 'string' ? JSON.parse(images) : images;
        imagesStr = JSON.stringify(parsedImages);
      } catch (e) {
        imagesStr = JSON.stringify(images);
      }
    }

    const roomTypeId = generateUUID();

    const result = db.prepare(`
      INSERT INTO room_types (
        id, property_id, name, description, price_per_month, price_per_week,
        price_per_day, total_beds, beds_available, amenities, images
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      roomTypeId, property_id, name, description, price_per_month, price_per_week,
      price_per_day, total_beds || 0, beds_available || total_beds || 0,
      amenitiesStr, imagesStr
    );

    // Update property total beds
    db.prepare(`
      UPDATE properties
      SET total_beds = total_beds + ?,
          available_beds = available_beds + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(total_beds || 0, beds_available || total_beds || 0, property_id);

    res.status(201).json({
      success: true,
      message: 'Room type created successfully',
      data: {
        id: roomTypeId,
        property_id,
        name,
        description,
        price_per_month,
        price_per_week,
        price_per_day,
        total_beds: total_beds || 0,
        beds_available: beds_available || total_beds || 0,
        amenities: parsedAmenities || [],
        images: parsedImages || [],
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating room type',
      error: error.message
    });
  }
};

/**
 * @desc    Get all room types with filters
 * @route   GET /api/admin/rooms
 * @access  Private/Admin
 */
export const getAllRoomTypes = async (req, res) => {
  try {
    const { property_id, available, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // If a manager is requesting, they must filter by a property they own
    if (req.user && req.user.role === 'manager') {
      if (!property_id) {
        return res.status(400).json({
          success: false,
          message: 'Managers must provide property_id to view room types',
        });
      }

      const property = db
        .prepare('SELECT manager_id FROM properties WHERE id = ?')
        .get(property_id);

      if (!property || property.manager_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view room types for this property',
        });
      }
    }

    let query = `
      SELECT rt.*, p.name as property_name, p.city
      FROM room_types rt
      JOIN properties p ON rt.property_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (property_id) {
      query += ' AND rt.property_id = ?';
      params.push(property_id);
    }

    if (available === 'true') {
      query += ' AND rt.beds_available > 0';
    }

    if (search) {
      query += ' AND (rt.name LIKE ? OR p.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const countQuery = query.replace(
      'SELECT rt.*, p.name as property_name, p.city FROM room_types rt',
      'SELECT COUNT(*) as total FROM room_types rt'
    );
    const countResult = db.prepare(countQuery).get(...params);
    const total = countResult?.total || 0;

    // Get paginated results
    query += ' ORDER BY rt.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const roomTypes = db.prepare(query).all(...params);

    // Parse JSON fields
    const parsedRoomTypes = roomTypes.map(rt => ({
      ...rt,
      amenities: rt.amenities ? JSON.parse(rt.amenities) : [],
      images: rt.images ? JSON.parse(rt.images) : []
    }));

    res.status(200).json({
      success: true,
      data: {
        roomTypes: parsedRoomTypes,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching room types',
      error: error.message
    });
  }
};

/**
 * @desc    Get single room type by ID
 * @route   GET /api/admin/rooms/:id
 * @access  Private/Admin
 */
export const getRoomTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    const roomType = db.prepare(`
      SELECT rt.*, p.name as property_name, p.city, p.address
      FROM room_types rt
      JOIN properties p ON rt.property_id = p.id
      WHERE rt.id = ?
    `).get(id);

    if (!roomType) {
      return res.status(404).json({
        success: false,
        message: 'Room type not found'
      });
    }

    // Get booking statistics
    const stats = {
      totalBookings: db.prepare('SELECT COUNT(*) as count FROM bookings WHERE room_type_id = ?').get(id)?.count || 0,
      activeBookings: db.prepare('SELECT COUNT(*) as count FROM bookings WHERE room_type_id = ? AND booking_status = "confirmed"').get(id)?.count || 0
    };

    res.status(200).json({
      success: true,
      data: {
        roomType: {
          ...roomType,
          amenities: roomType.amenities ? JSON.parse(roomType.amenities) : [],
          images: roomType.images ? JSON.parse(roomType.images) : []
        },
        stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching room type',
      error: error.message
    });
  }
};

/**
 * @desc    Update room type
 * @route   PATCH /api/admin/rooms/:id
 * @access  Private/Admin
 */
export const updateRoomType = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const roomType = db.prepare('SELECT * FROM room_types WHERE id = ?').get(id);
    if (!roomType) {
      return res.status(404).json({
        success: false,
        message: 'Room type not found'
      });
    }

    // Ensure managers can only update room types for their own properties
    if (req.user && req.user.role === 'manager') {
      const property = db
        .prepare('SELECT manager_id FROM properties WHERE id = ?')
        .get(roomType.property_id);

      if (!property || property.manager_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update room types for this property',
        });
      }
    }

    // Convert arrays to JSON strings if present
    if (updates.amenities) updates.amenities = JSON.stringify(updates.amenities);
    if (updates.images) updates.images = JSON.stringify(updates.images);

    // If beds are being updated, update property totals
    if (updates.total_beds !== undefined || updates.beds_available !== undefined) {
      const bedsDiff = (updates.total_beds || roomType.total_beds) - roomType.total_beds;
      const availableDiff = (updates.beds_available || roomType.beds_available) - roomType.beds_available;

      if (bedsDiff !== 0 || availableDiff !== 0) {
        db.prepare(`
          UPDATE properties
          SET total_beds = total_beds + ?,
              available_beds = available_beds + ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(bedsDiff, availableDiff, roomType.property_id);
      }
    }

    // Build dynamic update query
    const fields = Object.keys(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);

    db.prepare(`
      UPDATE room_types
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(...values, id);

    const updatedRoomType = db.prepare('SELECT * FROM room_types WHERE id = ?').get(id);

    res.status(200).json({
      success: true,
      message: 'Room type updated successfully',
      data: {
        ...updatedRoomType,
        amenities: updatedRoomType.amenities ? JSON.parse(updatedRoomType.amenities) : [],
        images: updatedRoomType.images ? JSON.parse(updatedRoomType.images) : []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating room type',
      error: error.message
    });
  }
};

/**
 * @desc    Delete room type
 * @route   DELETE /api/admin/rooms/:id
 * @access  Private/Admin
 */
export const deleteRoomType = async (req, res) => {
  try {
    const { id } = req.params;

    const roomType = db.prepare('SELECT * FROM room_types WHERE id = ?').get(id);
    if (!roomType) {
      return res.status(404).json({
        success: false,
        message: 'Room type not found'
      });
    }

    // Check for active bookings
    const activeBookings = db.prepare(`
      SELECT COUNT(*) as count FROM bookings
      WHERE room_type_id = ? AND booking_status IN ('pending', 'confirmed')
    `).get(id)?.count;

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete room type with ${activeBookings} active booking(s)`
      });
    }

    // Update property totals
    db.prepare(`
      UPDATE properties
      SET total_beds = total_beds - ?,
          available_beds = available_beds - ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(roomType.total_beds, roomType.beds_available, roomType.property_id);

    db.prepare('DELETE FROM room_types WHERE id = ?').run(id);

    res.status(200).json({
      success: true,
      message: 'Room type deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting room type',
      error: error.message
    });
  }
};
