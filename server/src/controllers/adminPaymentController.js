import db from '../config/database.js';

/**
 * @desc    Get all payments with filters
 * @route   GET /api/admin/payments
 * @access  Private/Admin
 */
export const getAllPayments = async (req, res) => {
  try {
    const { status, gateway, booking, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        p.*,
        b.booking_status,
        b.start_date,
        b.end_date,
        u.name as student_name,
        u.email as student_email,
        prop.name as property_name,
        prop.city as property_city
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN users u ON b.student_id = u.id
      JOIN properties prop ON b.property_id = prop.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }

    if (gateway) {
      query += ' AND p.payment_gateway = ?';
      params.push(gateway);
    }

    if (booking) {
      query += ' AND p.booking_id = ?';
      params.push(booking);
    }

    // Get total count
    const countQuery = query.replace(
      'SELECT p.*, b.booking_status, b.start_date, b.end_date, u.name as student_name, u.email as student_email, prop.name as property_name, prop.city as property_city FROM payments p',
      'SELECT COUNT(*) as total FROM payments p'
    );
    const countResult = db.prepare(countQuery).get(...params);
    const total = countResult?.total || 0;

    // Get paginated results
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const payments = db.prepare(query).all(...params);

    // Calculate total revenue
    const totalRevenue = db.prepare(`
      SELECT SUM(amount) as total FROM payments WHERE status = 'success'
    `).get()?.total || 0;

    res.status(200).json({
      success: true,
      data: {
        payments,
        totalRevenue,
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
      message: 'Error fetching payments',
      error: error.message
    });
  }
};

/**
 * @desc    Get single payment by ID
 * @route   GET /api/admin/payments/:id
 * @access  Private/Admin
 */
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = db.prepare(`
      SELECT 
        p.*,
        b.booking_status,
        b.start_date,
        b.end_date,
        b.duration_type,
        b.total_amount as booking_amount,
        u.name as student_name,
        u.email as student_email,
        u.phone as student_phone,
        prop.name as property_name,
        prop.address as property_address,
        prop.city as property_city,
        rt.name as room_type_name
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN users u ON b.student_id = u.id
      JOIN properties prop ON b.property_id = prop.id
      JOIN room_types rt ON b.room_type_id = rt.id
      WHERE p.id = ?
    `).get(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: error.message
    });
  }
};

/**
 * @desc    Refund payment
 * @route   PATCH /api/admin/payments/:id/refund
 * @access  Private/Admin
 */
export const refundPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Can only refund successful payments'
      });
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({
        success: false,
        message: 'Payment is already refunded'
      });
    }

    // Update payment status to refunded
    db.prepare(`
      UPDATE payments
      SET status = 'refunded', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(id);

    // Update booking payment status
    db.prepare(`
      UPDATE bookings
      SET payment_status = 'refunded', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(payment.booking_id);

    // TODO: Integrate with actual payment gateway for refund processing
    // TODO: Send refund notification to student

    res.status(200).json({
      success: true,
      message: 'Payment refunded successfully',
      data: {
        refund_amount: payment.amount,
        reason,
        note: 'Refund will be processed through the original payment method within 5-7 business days'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message
    });
  }
};

/**
 * @desc    Get payment statistics
 * @route   GET /api/admin/payments/stats
 * @access  Private/Admin
 */
export const getPaymentStats = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days

    // Total revenue
    const totalRevenue = db.prepare(`
      SELECT SUM(amount) as total FROM payments WHERE status = 'success'
    `).get()?.total || 0;

    // Revenue by period
    const periodRevenue = db.prepare(`
      SELECT SUM(amount) as total FROM payments
      WHERE status = 'success' AND paid_at >= date('now', '-' || ? || ' days')
    `).get(period)?.total || 0;

    // Revenue by gateway
    const revenueByGateway = db.prepare(`
      SELECT 
        payment_gateway,
        COUNT(*) as transaction_count,
        SUM(amount) as total_amount
      FROM payments
      WHERE status = 'success'
      GROUP BY payment_gateway
      ORDER BY total_amount DESC
    `).all();

    // Payment status breakdown
    const statusBreakdown = db.prepare(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM payments
      GROUP BY status
    `).all();

    // Recent successful payments
    const recentPayments = db.prepare(`
      SELECT 
        p.*,
        u.name as student_name,
        prop.name as property_name
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN users u ON b.student_id = u.id
      JOIN properties prop ON b.property_id = prop.id
      WHERE p.status = 'success'
      ORDER BY p.paid_at DESC
      LIMIT 10
    `).all();

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        periodRevenue,
        period: `${period} days`,
        revenueByGateway,
        statusBreakdown,
        recentPayments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment statistics',
      error: error.message
    });
  }
};
