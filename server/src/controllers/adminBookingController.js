import db from '../config/database-uuid.js';

/**
 * @desc    Get all bookings with filters
 * @route   GET /api/admin/bookings
 * @access  Private/Admin
 */
export const getAllBookings = async (req, res) => {
  try {
    const { hostel, student, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
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
        u.name as student_name,
        u.email as student_email,
        u.phone as student_phone,
        p.name as property_name,
        p.city as property_city,
        rt.name as room_type_name
      FROM bookings b
      JOIN users u ON b.student_id = u.id
      JOIN properties p ON b.property_id = p.id
      JOIN room_types rt ON b.room_type_id = rt.id
      WHERE 1=1
    `;
    const params = [];

    if (hostel) {
      query += ' AND b.property_id = ?';
      params.push(hostel);
    }

    if (student) {
      query += ' AND b.student_id = ?';
      params.push(student);
    }

    if (status) {
      query += ' AND b.booking_status = ?';
      params.push(status);
    }

    // Get total count
    const countQuery = query.replace(
      'SELECT b.*, u.name as student_name, u.email as student_email, u.phone as student_phone, p.name as property_name, p.city as property_city, rt.name as room_type_name FROM bookings b',
      'SELECT COUNT(*) as total FROM bookings b'
    );
    const countResult = db.prepare(countQuery).get(...params);
    const total = countResult?.total || 0;

    // Get paginated results
    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const bookings = db.prepare(query).all(...params);

    res.status(200).json({
      success: true,
      data: {
        bookings,
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
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

/**
 * @desc    Get single booking by ID
 * @route   GET /api/admin/bookings/:id
 * @access  Private/Admin
 */
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = db.prepare(`
      SELECT 
        b.*,
        u.name as student_name,
        u.email as student_email,
        u.phone as student_phone,
        p.name as property_name,
        p.address as property_address,
        p.city as property_city,
        rt.name as room_type_name,
        rt.price_per_month,
        rt.price_per_week,
        rt.price_per_day
      FROM bookings b
      JOIN users u ON b.student_id = u.id
      JOIN properties p ON b.property_id = p.id
      JOIN room_types rt ON b.room_type_id = rt.id
      WHERE b.id = ?
    `).get(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Get payment information
    const payments = db.prepare(`
      SELECT * FROM payments WHERE booking_id = ?
    `).all(id);

    res.status(200).json({
      success: true,
      data: {
        booking,
        payments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

/**
 * @desc    Cancel booking
 * @route   PATCH /api/admin/bookings/:id/cancel
 * @access  Private/Admin
 */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.booking_status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (booking.booking_status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    // Update booking status
    db.prepare(`
      UPDATE bookings
      SET booking_status = 'cancelled', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(id);

    // Increase available beds in room type
    db.prepare(`
      UPDATE room_types
      SET beds_available = beds_available + 1
      WHERE id = ?
    `).run(booking.room_type_id);

    // Update property available beds
    db.prepare(`
      UPDATE properties
      SET available_beds = available_beds + 1
      WHERE id = ?
    `).run(booking.property_id);

    // TODO: Send notification to student
    // TODO: Process refund if payment was made

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      reason
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

/**
 * @desc    Confirm booking
 * @route   PATCH /api/admin/bookings/:id/confirm
 * @access  Private/Admin
 */
export const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.booking_status === 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already confirmed'
      });
    }

    if (booking.booking_status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot confirm cancelled booking'
      });
    }

    // Update booking status
    db.prepare(`
      UPDATE bookings
      SET booking_status = 'confirmed', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(id);

    // TODO: Send confirmation notification to student

    res.status(200).json({
      success: true,
      message: 'Booking confirmed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error confirming booking',
      error: error.message
    });
  }
};

/**
 * @desc    Delete booking
 * @route   DELETE /api/admin/bookings/:id
 * @access  Private/Admin
 */
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking has payments
    const payments = db.prepare('SELECT COUNT(*) as count FROM payments WHERE booking_id = ?').get(id)?.count;
    if (payments > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete booking with payment records. Cancel it instead.'
      });
    }

    // If booking was confirmed, restore bed availability
    if (booking.booking_status === 'confirmed') {
      db.prepare(`
        UPDATE room_types
        SET beds_available = beds_available + 1
        WHERE id = ?
      `).run(booking.room_type_id);

      db.prepare(`
        UPDATE properties
        SET available_beds = available_beds + 1
        WHERE id = ?
      `).run(booking.property_id);
    }

    db.prepare('DELETE FROM bookings WHERE id = ?').run(id);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message
    });
  }
};
