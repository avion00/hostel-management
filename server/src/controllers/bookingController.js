import db from '../config/database.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Student)
export const createBooking = async (req, res) => {
  try {
    const { property_id, room_id, check_in_date, months } = req.body;
    const student_id = req.user.id;
    
    // Validation
    if (!property_id || !room_id || !check_in_date || !months) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }
    
    // Check if room exists and is available
    const room = db.prepare('SELECT * FROM rooms WHERE id = ? AND property_id = ?').get(room_id, property_id);
    
    if (!room) {
      return res.status(404).json({ 
        success: false,
        message: 'Room not found' 
      });
    }
    
    if (!room.is_available || room.occupied >= room.capacity) {
      return res.status(400).json({ 
        success: false,
        message: 'Room is not available' 
      });
    }
    
    // Calculate total amount
    const total_amount = room.price_per_month * months;
    
    // Create booking
    const stmt = db.prepare(`
      INSERT INTO bookings (student_id, property_id, room_id, check_in_date, total_amount, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `);
    
    const result = stmt.run(student_id, property_id, room_id, check_in_date, total_amount);
    
    // Update room occupancy
    db.prepare('UPDATE rooms SET occupied = occupied + 1, is_available = CASE WHEN occupied + 1 >= capacity THEN 0 ELSE 1 END WHERE id = ?').run(room_id);
    
    // Update property available rooms
    db.prepare('UPDATE properties SET available_rooms = (SELECT COUNT(*) FROM rooms WHERE property_id = ? AND is_available = 1) WHERE id = ?').run(property_id, property_id);
    
    // Create notification for manager
    const property = db.prepare('SELECT manager_id, name FROM properties WHERE id = ?').get(property_id);
    db.prepare(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (?, ?, ?, 'booking')
    `).run(property.manager_id, 'New Booking Request', `New booking request for ${property.name}`, 'booking');
    
    const booking = db.prepare(`
      SELECT b.*, p.name as property_name, p.address, r.room_number, r.room_type
      FROM bookings b
      LEFT JOIN properties p ON b.property_id = p.id
      LEFT JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get all bookings for a student
// @route   GET /api/bookings/student
// @access  Private (Student)
export const getStudentBookings = async (req, res) => {
  try {
    const student_id = req.user.id;
    
    const bookings = db.prepare(`
      SELECT b.*, 
        p.name as property_name, p.address, p.city, p.images,
        r.room_number, r.room_type,
        u.name as manager_name, u.phone as manager_phone
      FROM bookings b
      LEFT JOIN properties p ON b.property_id = p.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN users u ON p.manager_id = u.id
      WHERE b.student_id = ?
      ORDER BY b.created_at DESC
    `).all(student_id);
    
    bookings.forEach(booking => {
      booking.images = booking.images ? JSON.parse(booking.images) : [];
    });
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Get student bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get all bookings for a property (Manager)
// @route   GET /api/bookings/property/:propertyId
// @access  Private (Manager, Admin)
export const getPropertyBookings = async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    // Check if user is authorized
    const property = db.prepare('SELECT manager_id FROM properties WHERE id = ?').get(propertyId);
    
    if (!property) {
      return res.status(404).json({ 
        success: false,
        message: 'Property not found' 
      });
    }
    
    if (req.user.role !== 'admin' && property.manager_id !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view these bookings' 
      });
    }
    
    const bookings = db.prepare(`
      SELECT b.*, 
        r.room_number, r.room_type,
        u.name as student_name, u.email as student_email, u.phone as student_phone
      FROM bookings b
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN users u ON b.student_id = u.id
      WHERE b.property_id = ?
      ORDER BY b.created_at DESC
    `).all(propertyId);
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Get property bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = db.prepare(`
      SELECT b.*, 
        p.name as property_name, p.address, p.city, p.images, p.manager_id,
        r.room_number, r.room_type, r.amenities as room_amenities,
        u.name as student_name, u.email as student_email, u.phone as student_phone,
        m.name as manager_name, m.email as manager_email, m.phone as manager_phone
      FROM bookings b
      LEFT JOIN properties p ON b.property_id = p.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN users u ON b.student_id = u.id
      LEFT JOIN users m ON p.manager_id = m.id
      WHERE b.id = ?
    `).get(id);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && booking.student_id !== req.user.id && booking.manager_id !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view this booking' 
      });
    }
    
    booking.images = booking.images ? JSON.parse(booking.images) : [];
    booking.room_amenities = booking.room_amenities ? JSON.parse(booking.room_amenities) : [];
    
    // Get payment history
    const payments = db.prepare(`
      SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC
    `).all(id);
    
    res.json({
      success: true,
      data: {
        ...booking,
        payments
      }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Manager, Admin)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status' 
      });
    }
    
    const booking = db.prepare(`
      SELECT b.*, p.manager_id 
      FROM bookings b
      LEFT JOIN properties p ON b.property_id = p.id
      WHERE b.id = ?
    `).get(id);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && booking.manager_id !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this booking' 
      });
    }
    
    // Update booking status
    db.prepare('UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
    
    // If cancelled, update room availability
    if (status === 'cancelled') {
      db.prepare('UPDATE rooms SET occupied = occupied - 1, is_available = 1 WHERE id = ?').run(booking.room_id);
      db.prepare('UPDATE properties SET available_rooms = (SELECT COUNT(*) FROM rooms WHERE property_id = ? AND is_available = 1) WHERE id = ?').run(booking.property_id, booking.property_id);
    }
    
    // Create notification for student
    const statusMessages = {
      confirmed: 'Your booking has been confirmed',
      active: 'Your booking is now active',
      completed: 'Your booking has been completed',
      cancelled: 'Your booking has been cancelled'
    };
    
    if (statusMessages[status]) {
      db.prepare(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (?, ?, ?, 'booking')
      `).run(booking.student_id, 'Booking Status Update', statusMessages[status]);
    }
    
    const updatedBooking = db.prepare(`
      SELECT b.*, 
        p.name as property_name, p.address,
        r.room_number, r.room_type
      FROM bookings b
      LEFT JOIN properties p ON b.property_id = p.id
      LEFT JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ?
    `).get(id);
    
    res.json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private (Student, Manager, Admin)
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = db.prepare(`
      SELECT b.*, p.manager_id 
      FROM bookings b
      LEFT JOIN properties p ON b.property_id = p.id
      WHERE b.id = ?
    `).get(id);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }
    
    // Check authorization
    if (req.user.role !== 'admin' && booking.student_id !== req.user.id && booking.manager_id !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to cancel this booking' 
      });
    }
    
    // Update booking status to cancelled
    db.prepare('UPDATE bookings SET status = \'cancelled\', updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);
    
    // Update room availability
    db.prepare('UPDATE rooms SET occupied = occupied - 1, is_available = 1 WHERE id = ?').run(booking.room_id);
    db.prepare('UPDATE properties SET available_rooms = (SELECT COUNT(*) FROM rooms WHERE property_id = ? AND is_available = 1) WHERE id = ?').run(booking.property_id, booking.property_id);
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
