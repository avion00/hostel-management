import db from '../config/database.js';

// @desc    Get all properties (with search and filters)
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const { search, city, pincode, near_college, min_price, max_price, page = 1, limit = 10 } = req.query;
    
    let query = `
      SELECT p.*, u.name as manager_name, u.phone as manager_phone, u.email as manager_email,
      (SELECT COUNT(*) FROM reviews WHERE property_id = p.id) as review_count,
      (SELECT AVG(rating) FROM reviews WHERE property_id = p.id) as average_rating
      FROM properties p
      LEFT JOIN users u ON p.manager_id = u.id
      WHERE p.is_active = 1
    `;
    
    const params = [];
    
    // Search filter
    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.address LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // City filter
    if (city) {
      query += ` AND p.city LIKE ?`;
      params.push(`%${city}%`);
    }
    
    // Pincode filter
    if (pincode) {
      query += ` AND p.pincode = ?`;
      params.push(pincode);
    }
    
    // Near college filter
    if (near_college) {
      query += ` AND p.near_college LIKE ?`;
      params.push(`%${near_college}%`);
    }
    
    // Price range filter
    if (min_price) {
      query += ` AND p.price_per_month >= ?`;
      params.push(parseFloat(min_price));
    }
    
    if (max_price) {
      query += ` AND p.price_per_month <= ?`;
      params.push(parseFloat(max_price));
    }
    
    // Get total count
    const countQuery = query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM');
    const { total } = db.prepare(countQuery).get(...params);
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);
    
    const properties = db.prepare(query).all(...params);
    
    // Parse JSON fields
    properties.forEach(property => {
      property.amenities = property.amenities ? JSON.parse(property.amenities) : [];
      property.images = property.images ? JSON.parse(property.images) : [];
    });
    
    res.json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const property = db.prepare(`
      SELECT p.*, u.name as manager_name, u.phone as manager_phone, u.email as manager_email,
      (SELECT COUNT(*) FROM reviews WHERE property_id = p.id) as review_count,
      (SELECT AVG(rating) FROM reviews WHERE property_id = p.id) as average_rating
      FROM properties p
      LEFT JOIN users u ON p.manager_id = u.id
      WHERE p.id = ?
    `).get(id);
    
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }
    
    // Parse JSON fields
    property.amenities = property.amenities ? JSON.parse(property.amenities) : [];
    property.images = property.images ? JSON.parse(property.images) : [];
    
    // Get rooms for this property
    const rooms = db.prepare(`
      SELECT * FROM rooms WHERE property_id = ? ORDER BY room_number
    `).all(id);
    
    rooms.forEach(room => {
      room.amenities = room.amenities ? JSON.parse(room.amenities) : [];
    });
    
    // Get reviews
    const reviews = db.prepare(`
      SELECT r.*, u.name as student_name, u.avatar as student_avatar
      FROM reviews r
      LEFT JOIN users u ON r.student_id = u.id
      WHERE r.property_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `).all(id);
    
    res.json({
      success: true,
      data: {
        ...property,
        rooms,
        reviews
      }
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Manager, Admin)
export const createProperty = async (req, res) => {
  try {
    const {
      name, description, address, city, state, pincode,
      latitude, longitude, near_college, total_rooms,
      amenities, images, price_per_month
    } = req.body;
    
    // Validation
    if (!name || !address || !city || !state || !pincode || !total_rooms || !price_per_month) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }
    
    const manager_id = req.user.role === 'admin' ? req.body.manager_id : req.user.id;
    
    const stmt = db.prepare(`
      INSERT INTO properties (
        manager_id, name, description, address, city, state, pincode,
        latitude, longitude, near_college, total_rooms, available_rooms,
        amenities, images, price_per_month
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      manager_id,
      name,
      description || null,
      address,
      city,
      state,
      pincode,
      latitude || null,
      longitude || null,
      near_college || null,
      total_rooms,
      total_rooms, // Initially all rooms are available
      amenities ? JSON.stringify(amenities) : null,
      images ? JSON.stringify(images) : null,
      price_per_month
    );
    
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(result.lastInsertRowid);
    property.amenities = property.amenities ? JSON.parse(property.amenities) : [];
    property.images = property.images ? JSON.parse(property.images) : [];
    
    res.status(201).json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Manager/Owner, Admin)
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);
    
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && property.manager_id !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this property' 
      });
    }
    
    const {
      name, description, address, city, state, pincode,
      latitude, longitude, near_college, total_rooms,
      amenities, images, price_per_month, is_active
    } = req.body;
    
    const stmt = db.prepare(`
      UPDATE properties SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        address = COALESCE(?, address),
        city = COALESCE(?, city),
        state = COALESCE(?, state),
        pincode = COALESCE(?, pincode),
        latitude = COALESCE(?, latitude),
        longitude = COALESCE(?, longitude),
        near_college = COALESCE(?, near_college),
        total_rooms = COALESCE(?, total_rooms),
        amenities = COALESCE(?, amenities),
        images = COALESCE(?, images),
        price_per_month = COALESCE(?, price_per_month),
        is_active = COALESCE(?, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(
      name || null,
      description || null,
      address || null,
      city || null,
      state || null,
      pincode || null,
      latitude || null,
      longitude || null,
      near_college || null,
      total_rooms || null,
      amenities ? JSON.stringify(amenities) : null,
      images ? JSON.stringify(images) : null,
      price_per_month || null,
      is_active !== undefined ? is_active : null,
      id
    );
    
    const updatedProperty = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);
    updatedProperty.amenities = updatedProperty.amenities ? JSON.parse(updatedProperty.amenities) : [];
    updatedProperty.images = updatedProperty.images ? JSON.parse(updatedProperty.images) : [];
    
    res.json({
      success: true,
      data: updatedProperty
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Manager/Owner, Admin)
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);
    
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && property.manager_id !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this property' 
      });
    }
    
    db.prepare('DELETE FROM properties WHERE id = ?').run(id);
    
    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get properties by manager
// @route   GET /api/properties/manager/:managerId
// @access  Private
export const getPropertiesByManager = async (req, res) => {
  try {
    const { managerId } = req.params;
    
    // Check authorization
    if (req.user.role !== 'admin' && req.user.id !== parseInt(managerId)) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view these properties' 
      });
    }
    
    const properties = db.prepare(`
      SELECT p.*,
      (SELECT COUNT(*) FROM reviews WHERE property_id = p.id) as review_count,
      (SELECT AVG(rating) FROM reviews WHERE property_id = p.id) as average_rating,
      (SELECT COUNT(*) FROM bookings WHERE property_id = p.id AND status = 'active') as active_bookings
      FROM properties p
      WHERE p.manager_id = ?
      ORDER BY p.created_at DESC
    `).all(managerId);
    
    properties.forEach(property => {
      property.amenities = property.amenities ? JSON.parse(property.amenities) : [];
      property.images = property.images ? JSON.parse(property.images) : [];
    });
    
    res.json({
      success: true,
      data: properties
    });
  } catch (error) {
    console.error('Get properties by manager error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
