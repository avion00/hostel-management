import db from '../config/database-uuid.js';
import { generateUUID } from '../utils/uuid.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Student)
export const createBooking = async (req, res) => {
  try {
    const {
      property_id,
      room_type_id,
      start_date,
      duration_type,
      duration_value,
      occupants = 1,
      special_requests,
      preferred_floor,
      check_in_time,
      sharing_preference,
      payment_method,
      pay_mode,
      discount_code,
      emergency_contact_name,
      emergency_contact_phone,
      emergency_contact_relation,
      id_document_type,
      id_document_number,
      heard_from,
      notes_internal,
    } = req.body;

    const student_id = req.user.id;

    // Basic validation
    if (!property_id || !room_type_id || !start_date || !duration_type || !duration_value) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property_id, room_type_id, start_date, duration_type and duration_value',
      });
    }

    if (!['daily', 'weekly', 'monthly'].includes(duration_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid duration_type. Allowed values are daily, weekly, monthly',
      });
    }

    if (isNaN(duration_value) || duration_value <= 0) {
      return res.status(400).json({
        success: false,
        message: 'duration_value must be a positive number',
      });
    }

    const bedsRequested = Number(occupants) || 1;

    // Check property exists
    const property = db
      .prepare('SELECT id, manager_id, name, available_beds FROM properties WHERE id = ?')
      .get(property_id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check room type exists and has available beds
    const roomType = db
      .prepare(
        'SELECT id, name, price_per_day, price_per_week, price_per_month, beds_available FROM room_types WHERE id = ? AND property_id = ?'
      )
      .get(room_type_id, property_id);

    if (!roomType) {
      return res.status(404).json({
        success: false,
        message: 'Room type not found for this property',
      });
    }

    if (roomType.beds_available < bedsRequested) {
      return res.status(400).json({
        success: false,
        message: 'Selected room type does not have enough available beds',
      });
    }

    // Calculate end_date and total_amount
    const start = new Date(start_date);
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start_date format. Expected YYYY-MM-DD',
      });
    }

    const end = new Date(start);
    let total_amount = 0;

    if (duration_type === 'daily') {
      end.setDate(end.getDate() + duration_value);
      total_amount = (roomType.price_per_day || 0) * duration_value * bedsRequested;
    } else if (duration_type === 'weekly') {
      end.setDate(end.getDate() + duration_value * 7);
      total_amount = (roomType.price_per_week || 0) * duration_value * bedsRequested;
    } else if (duration_type === 'monthly') {
      end.setMonth(end.getMonth() + duration_value);
      total_amount = (roomType.price_per_month || 0) * duration_value * bedsRequested;
    }

    if (!total_amount || total_amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Unable to calculate total amount. Please ensure room type has valid pricing.',
      });
    }

    const end_date = end.toISOString().slice(0, 10); // YYYY-MM-DD

    const bookingId = generateUUID();

    // Create booking
    const stmt = db.prepare(`
      INSERT INTO bookings (
        id,
        student_id,
        property_id,
        room_type_id,
        start_date,
        end_date,
        duration_type,
        duration_value,
        total_amount,
        payment_status,
        booking_status,
        occupants,
        special_requests,
        preferred_floor,
        check_in_time,
        sharing_preference,
        payment_method,
        pay_mode,
        discount_code,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relation,
        id_document_type,
        id_document_number,
        heard_from,
        notes_internal
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    const result = stmt.run(
      bookingId,
      student_id,
      property_id,
      room_type_id,
      start_date,
      end_date,
      duration_type,
      duration_value,
      total_amount,
      'pending',
      'pending',
      bedsRequested,
      special_requests || null,
      preferred_floor || null,
      check_in_time || null,
      sharing_preference || null,
      payment_method || null,
      pay_mode || null,
      discount_code || null,
      emergency_contact_name || null,
      emergency_contact_phone || null,
      emergency_contact_relation || null,
      id_document_type || null,
      id_document_number || null,
      heard_from || null,
      notes_internal || null
    );

    // Update room type availability
    db.prepare(
      'UPDATE room_types SET beds_available = beds_available - ? WHERE id = ? AND property_id = ?'
    ).run(bedsRequested, room_type_id, property_id);

    // Update property available beds
    db.prepare('UPDATE properties SET available_beds = available_beds - ? WHERE id = ?').run(
      bedsRequested,
      property_id
    );

    // Create notification for manager
    if (property.manager_id) {
      db.prepare(
        `
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (?, ?, ?, 'booking')
      `
      ).run(
        property.manager_id,
        'New Booking Request',
        `New booking request for ${property.name}`,
        'booking'
      );
    }

    const booking = db
      .prepare(
        `
      SELECT 
        b.*,
        p.name as property_name,
        p.address,
        p.city,
        rt.name as room_type_name
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      JOIN room_types rt ON b.room_type_id = rt.id
      WHERE b.id = ?
    `
      )
      .get(bookingId);

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
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
      SELECT
        b.id,
        b.student_id,
        b.property_id,
        b.room_type_id,
        b.start_date,
        b.end_date,
        b.duration_type,
        b.duration_value,
        b.occupants,
        b.total_amount,
        b.payment_status,
        b.booking_status,
        b.special_requests,
        b.preferred_floor,
        b.check_in_time,
        b.sharing_preference,
        b.payment_method,
        b.pay_mode,
        b.discount_code,
        b.emergency_contact_name,
        b.emergency_contact_phone,
        b.emergency_contact_relation,
        b.id_document_type,
        b.id_document_number,
        b.heard_from,
        b.notes_internal,
        b.created_at,
        b.updated_at,
        p.name as property_name,
        p.address,
        p.city,
        p.images,
        rt.name as room_type_name,
        u.name as manager_name,
        u.phone as manager_phone
      FROM bookings b
      LEFT JOIN properties p ON b.property_id = p.id
      LEFT JOIN room_types rt ON b.room_type_id = rt.id
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
