import db from '../config/database.js';
import { generateUUID } from '../utils/uuid.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Create new hostel (Super Admin)
 * @route   POST /api/admin/hostels
 * @access  Private/Admin
 */
export const createHostel = async (req, res) => {
  let hostelId = null;
  let tempFiles = [];

  try {
    const {
      manager_id,
      name,
      description,
      address,
      city,
      area,
      state,
      pincode,
      latitude,
      longitude,
      near_college,
      established_year,
      total_rooms,
      available_rooms,
      total_beds,
      available_beds,
      staff_count,
      price_starting,
      amenities,
      rules,
      status = 'approved' // Admin can directly approve
    } = req.body;

    // Validate manager exists
    const manager = db.prepare('SELECT id, role FROM users WHERE id = ? AND role = ?').get(manager_id, 'manager');
    if (!manager) {
      return res.status(404).json({
        success: false,
        message: 'Manager not found'
      });
    }

    // Generate UUID for new hostel
    hostelId = generateUUID();

    // Store temp files info
    if (req.files && req.files.length > 0) {
      tempFiles = req.files.map(file => ({
        tempPath: file.path,
        filename: file.filename
      }));
    }

    // Create property-specific directory
    const propertyDir = path.join(__dirname, '../../uploads/properties', hostelId);
    if (!fs.existsSync(propertyDir)) {
      fs.mkdirSync(propertyDir, { recursive: true });
    }

    // Move files from temp to property-specific folder and generate URLs
    let imageUrls = [];
    if (tempFiles.length > 0) {
      for (const fileInfo of tempFiles) {
        const newPath = path.join(propertyDir, fileInfo.filename);
        
        // Move file from temp to property folder
        if (fs.existsSync(fileInfo.tempPath)) {
          fs.renameSync(fileInfo.tempPath, newPath);
        }
        
        // Generate URL
        imageUrls.push(`/uploads/properties/${hostelId}/${fileInfo.filename}`);
      }
    }

    // Convert arrays to JSON strings
    const amenitiesStr = amenities ? JSON.stringify(typeof amenities === 'string' ? JSON.parse(amenities) : amenities) : null;
    const imagesStr = imageUrls.length > 0 ? JSON.stringify(imageUrls) : null;
    const rulesStr = rules ? JSON.stringify(typeof rules === 'string' ? JSON.parse(rules) : rules) : null;

    // Insert into database
    db.prepare(`
      INSERT INTO properties (
        id, manager_id, name, description, address, city, area, state, pincode,
        latitude, longitude, near_college, established_year, total_rooms,
        available_rooms, total_beds, available_beds, staff_count, price_starting,
        amenities, images, rules, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      hostelId, manager_id, name, description, address, city, area, state, pincode,
      latitude, longitude, near_college, established_year, total_rooms || 0,
      available_rooms || 0, total_beds || 0, available_beds || 0, staff_count || 0,
      price_starting, amenitiesStr, imagesStr, rulesStr, status
    );

    const hostel = db.prepare('SELECT * FROM properties WHERE id = ?').get(hostelId);

    res.status(201).json({
      success: true,
      message: 'Hostel created successfully',
      data: {
        ...hostel,
        amenities: hostel.amenities ? JSON.parse(hostel.amenities) : [],
        images: hostel.images ? JSON.parse(hostel.images) : [],
        rules: hostel.rules ? JSON.parse(hostel.rules) : []
      }
    });
  } catch (error) {
    // Cleanup: Remove property folder if creation failed
    if (hostelId) {
      const propertyDir = path.join(__dirname, '../../uploads/properties', hostelId);
      if (fs.existsSync(propertyDir)) {
        fs.rmSync(propertyDir, { recursive: true, force: true });
      }
    }

    // Cleanup temp files
    tempFiles.forEach(fileInfo => {
      if (fs.existsSync(fileInfo.tempPath)) {
        fs.unlinkSync(fileInfo.tempPath);
      }
    });

    res.status(500).json({
      success: false,
      message: 'Error creating hostel',
      error: error.message
    });
  }
};

/**
 * @desc    Get all hostels with filters
 * @route   GET /api/admin/hostels
 * @access  Private/Admin
 */
export const getAllHostels = async (req, res) => {
  try {
    const { city, owner, status, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, u.name as manager_name, u.email as manager_email
      FROM properties p
      JOIN users u ON p.manager_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (city) {
      query += ' AND p.city = ?';
      params.push(city);
    }

    if (owner) {
      query += ' AND p.manager_id = ?';
      params.push(owner);
    }

    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.city LIKE ? OR p.address LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get total count
    const countQuery = query.replace(
      'SELECT p.*, u.name as manager_name, u.email as manager_email FROM properties p',
      'SELECT COUNT(*) as total FROM properties p'
    );
    const countResult = db.prepare(countQuery).get(...params);
    const total = countResult?.total || 0;

    // Get paginated results
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const hostels = db.prepare(query).all(...params);

    // Parse JSON fields and add calculated fields
    const parsedHostels = hostels.map(hostel => {
      // Calculate monthly revenue
      const monthlyRevenue = db.prepare(`
        SELECT SUM(p.amount) as revenue
        FROM payments p
        JOIN bookings b ON p.booking_id = b.id
        WHERE b.property_id = ? 
        AND p.status = 'success'
        AND p.paid_at >= date('now', 'start of month')
      `).get(hostel.id)?.revenue || 0;

      // Calculate occupancy percentage
      const occupancyPercent = hostel.total_beds > 0 
        ? Math.round(((hostel.total_beds - hostel.available_beds) / hostel.total_beds) * 100)
        : 0;

      // Get average rating
      const avgRating = db.prepare(`
        SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
        FROM reviews WHERE property_id = ?
      `).get(hostel.id);

      return {
        ...hostel,
        amenities: hostel.amenities ? JSON.parse(hostel.amenities) : [],
        images: hostel.images ? JSON.parse(hostel.images) : [],
        rules: hostel.rules ? JSON.parse(hostel.rules) : [],
        monthly_revenue: monthlyRevenue,
        commission: monthlyRevenue * 0.10, // 10% commission
        occupancy_percent: occupancyPercent,
        average_rating: avgRating?.avg_rating ? parseFloat(avgRating.avg_rating.toFixed(1)) : 0,
        review_count: avgRating?.review_count || 0
      };
    });

    res.status(200).json({
      success: true,
      data: {
        hostels: parsedHostels,
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
      message: 'Error fetching hostels',
      error: error.message
    });
  }
};

/**
 * @desc    Get single hostel by ID
 * @route   GET /api/admin/hostels/:id
 * @access  Private/Admin
 */
export const getHostelById = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = db.prepare(`
      SELECT p.*, u.name as manager_name, u.email as manager_email, u.phone as manager_phone
      FROM properties p
      JOIN users u ON p.manager_id = u.id
      WHERE p.id = ?
    `).get(id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    // Get room types (with error handling)
    let roomTypes = [];
    try {
      roomTypes = db.prepare('SELECT * FROM room_types WHERE property_id = ?').all(id);
    } catch (error) {
      console.log('Room types table not found or error:', error.message);
    }

    // Get statistics (with error handling for missing tables)
    let stats = {
      totalBookings: 0,
      activeBookings: 0,
      totalRevenue: 0,
      averageRating: hostel.rating || 0
    };

    try {
      stats.totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE property_id = ?').get(id)?.count || 0;
    } catch (error) {
      console.log('Bookings table not found:', error.message);
    }

    try {
      stats.activeBookings = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE property_id = ? AND booking_status = ?').get(id, 'confirmed')?.count || 0;
    } catch (error) {
      console.log('Error fetching active bookings:', error.message);
    }

    try {
      stats.totalRevenue = db.prepare(`
        SELECT SUM(p.amount) as total
        FROM payments p
        JOIN bookings b ON p.booking_id = b.id
        WHERE b.property_id = ? AND p.status = ?
      `).get(id, 'success')?.total || 0;
    } catch (error) {
      console.log('Error fetching revenue:', error.message);
    }

    res.status(200).json({
      success: true,
      data: {
        hostel: {
          ...hostel,
          amenities: hostel.amenities ? JSON.parse(hostel.amenities) : [],
          images: hostel.images ? JSON.parse(hostel.images) : [],
          rules: hostel.rules ? JSON.parse(hostel.rules) : []
        },
        roomTypes: roomTypes.map(rt => ({
          ...rt,
          amenities: rt.amenities ? JSON.parse(rt.amenities) : [],
          images: rt.images ? JSON.parse(rt.images) : []
        })),
        stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hostel',
      error: error.message
    });
  }
};

/**
 * @desc    Update hostel
 * @route   PATCH /api/admin/hostels/:id
 * @access  Private/Admin
 */
export const updateHostel = async (req, res) => {
  let tempFiles = [];

  try {
    const { id } = req.params;
    const updates = req.body;

    const hostel = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      tempFiles = req.files.map(file => ({
        tempPath: file.path,
        filename: file.filename
      }));

      // Create property-specific directory if it doesn't exist
      const propertyDir = path.join(__dirname, '../../uploads/properties', id);
      if (!fs.existsSync(propertyDir)) {
        fs.mkdirSync(propertyDir, { recursive: true });
      }

      // Move files and generate URLs
      const newImageUrls = [];
      for (const fileInfo of tempFiles) {
        const newPath = path.join(propertyDir, fileInfo.filename);
        
        // Move file from temp to property folder
        if (fs.existsSync(fileInfo.tempPath)) {
          fs.renameSync(fileInfo.tempPath, newPath);
        }
        
        // Generate URL
        newImageUrls.push(`/uploads/properties/${id}/${fileInfo.filename}`);
      }
      
      // Merge with existing images
      let existingImages = [];
      if (hostel.images) {
        try {
          existingImages = JSON.parse(hostel.images);
        } catch (e) {
          existingImages = [];
        }
      }
      
      updates.images = JSON.stringify([...existingImages, ...newImageUrls]);
    }

    // Convert arrays to JSON strings if present
    if (updates.amenities && typeof updates.amenities === 'string') {
      updates.amenities = JSON.stringify(JSON.parse(updates.amenities));
    }
    if (updates.rules && typeof updates.rules === 'string') {
      updates.rules = JSON.stringify(JSON.parse(updates.rules));
    }

    // Build dynamic update query
    const fields = Object.keys(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);

    db.prepare(`
      UPDATE properties
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(...values, id);

    const updatedHostel = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);

    res.status(200).json({
      success: true,
      message: 'Hostel updated successfully',
      data: {
        ...updatedHostel,
        amenities: updatedHostel.amenities ? JSON.parse(updatedHostel.amenities) : [],
        images: updatedHostel.images ? JSON.parse(updatedHostel.images) : [],
        rules: updatedHostel.rules ? JSON.parse(updatedHostel.rules) : []
      }
    });
  } catch (error) {
    // Cleanup temp files on error
    tempFiles.forEach(fileInfo => {
      if (fs.existsSync(fileInfo.tempPath)) {
        fs.unlinkSync(fileInfo.tempPath);
      }
    });

    res.status(500).json({
      success: false,
      message: 'Error updating hostel',
      error: error.message
    });
  }
};

/**
 * @desc    Approve hostel
 * @route   PATCH /api/admin/hostels/:id/approve
 * @access  Private/Admin
 */
export const approveHostel = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Approving hostel with ID:', id);

    const hostel = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);
    if (!hostel) {
      console.log('Hostel not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    console.log('Found hostel:', hostel.name, 'Current status:', hostel.status);
    const result = db.prepare("UPDATE properties SET status = 'approved', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
    console.log('Update result:', result.changes, 'rows affected');

    // TODO: Send notification to hostel owner

    res.status(200).json({
      success: true,
      message: 'Hostel approved successfully'
    });
  } catch (error) {
    console.error('Error in approveHostel:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving hostel',
      error: error.message
    });
  }
};

/**
 * @desc    Reject hostel
 * @route   PATCH /api/admin/hostels/:id/reject
 * @access  Private/Admin
 */
export const rejectHostel = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    console.log('Rejecting hostel with ID:', id, 'Reason:', reason);

    const hostel = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);
    if (!hostel) {
      console.log('Hostel not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    console.log('Found hostel:', hostel.name, 'Current status:', hostel.status);
    const result = db.prepare("UPDATE properties SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
    console.log('Update result:', result.changes, 'rows affected');

    // TODO: Send notification to hostel owner with reason

    res.status(200).json({
      success: true,
      message: 'Hostel rejected successfully',
      reason
    });
  } catch (error) {
    console.error('Error in rejectHostel:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting hostel',
      error: error.message
    });
  }
};

/**
 * @desc    Delete hostel
 * @route   DELETE /api/admin/hostels/:id
 * @access  Private/Admin
 */
export const deleteHostel = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    // Check for active bookings (with error handling)
    let activeBookings = 0;
    try {
      activeBookings = db.prepare(`
        SELECT COUNT(*) as count FROM bookings
        WHERE property_id = ? AND booking_status IN ('pending', 'confirmed')
      `).get(id)?.count || 0;
    } catch (error) {
      console.log('Bookings table not found, skipping active bookings check:', error.message);
    }

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete hostel with ${activeBookings} active booking(s)`
      });
    }

    db.prepare('DELETE FROM properties WHERE id = ?').run(id);

    res.status(200).json({
      success: true,
      message: 'Hostel deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting hostel',
      error: error.message
    });
  }
};

/**
 * @desc    Suspend hostel
 * @route   PATCH /api/admin/hostels/:id/suspend
 * @access  Private/Admin
 */
export const suspendHostel = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    // For now, we'll track suspended status using is_active = 0 and a special marker
    // Since the database CHECK constraint doesn't allow 'suspended'
    // We'll use status = 'approved' with is_active = 0 to indicate suspended
    try {
      // First try with suspended status (if constraint allows)
      db.prepare(`
        UPDATE properties 
        SET status = 'suspended', is_active = 0, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(id);
    } catch (dbError) {
      // If suspended is not allowed, use approved with is_active = 0
      console.log('Using is_active flag for suspension due to constraint');
      db.prepare(`
        UPDATE properties 
        SET is_active = 0, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(id);
    }

    res.status(200).json({
      success: true,
      message: 'Hostel suspended successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error suspending hostel',
      error: error.message
    });
  }
};

/**
 * @desc    Reactivate hostel (change status back to approved/pending/rejected)
 * @route   PATCH /api/admin/hostels/:id/reactivate
 * @access  Private/Admin
 */
export const reactivateHostel = async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'approved' } = req.body; // Default to approved if not specified

    const hostel = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    // Validate the new status
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, approved, or rejected'
      });
    }

    // Update status from suspended to the specified status
    db.prepare(`
      UPDATE properties 
      SET status = ?, is_active = 1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(status, id);

    res.status(200).json({
      success: true,
      message: `Hostel reactivated and set to ${status} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reactivating hostel',
      error: error.message
    });
  }
};
