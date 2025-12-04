import db from '../config/database.js';

// @desc    Get manager dashboard stats
// @route   GET /api/dashboard/manager
// @access  Private (Manager)
export const getManagerDashboard = async (req, res) => {
  try {
    const manager_id = req.user.id;
    
    // Get total properties
    const { total_properties } = db.prepare(`
      SELECT COUNT(*) as total_properties FROM properties WHERE manager_id = ?
    `).get(manager_id);
    
    // Get total students enrolled (active bookings)
    const { total_students } = db.prepare(`
      SELECT COUNT(DISTINCT b.student_id) as total_students
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      WHERE p.manager_id = ? AND b.status IN ('confirmed', 'active')
    `).get(manager_id);
    
    // Get total rooms
    const { total_rooms, occupied_rooms, available_rooms } = db.prepare(`
      SELECT 
        COUNT(*) as total_rooms,
        SUM(occupied) as occupied_rooms,
        SUM(CASE WHEN is_available = 1 THEN 1 ELSE 0 END) as available_rooms
      FROM rooms r
      JOIN properties p ON r.property_id = p.id
      WHERE p.manager_id = ?
    `).get(manager_id);
    
    // Get total revenue (completed payments)
    const { total_revenue } = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total_revenue
      FROM payments pay
      JOIN bookings b ON pay.booking_id = b.id
      JOIN properties p ON b.property_id = p.id
      WHERE p.manager_id = ? AND pay.payment_status = 'completed'
    `).get(manager_id);
    
    // Get pending bookings
    const { pending_bookings } = db.prepare(`
      SELECT COUNT(*) as pending_bookings
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      WHERE p.manager_id = ? AND b.status = 'pending'
    `).get(manager_id);
    
    // Get recent bookings
    const recentBookings = db.prepare(`
      SELECT b.*, 
        p.name as property_name,
        r.room_number,
        u.name as student_name, u.email as student_email, u.phone as student_phone
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.student_id = u.id
      WHERE p.manager_id = ?
      ORDER BY b.created_at DESC
      LIMIT 10
    `).all(manager_id);
    
    // Get properties with room assignments
    const properties = db.prepare(`
      SELECT 
        p.id, p.name, p.address, p.city,
        p.total_rooms, p.available_rooms,
        (SELECT COUNT(*) FROM bookings WHERE property_id = p.id AND status IN ('confirmed', 'active')) as active_bookings
      FROM properties p
      WHERE p.manager_id = ?
      ORDER BY p.name
    `).all(manager_id);
    
    // Get students with room assignments
    const students = db.prepare(`
      SELECT 
        u.id, u.name, u.email, u.phone,
        p.name as property_name,
        r.room_number, r.room_type,
        b.check_in_date, b.status
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.student_id = u.id
      WHERE p.manager_id = ? AND b.status IN ('confirmed', 'active')
      ORDER BY b.check_in_date DESC
    `).all(manager_id);
    
    // Monthly revenue data (last 6 months)
    const monthlyRevenue = db.prepare(`
      SELECT 
        strftime('%Y-%m', pay.payment_date) as month,
        SUM(pay.amount) as revenue
      FROM payments pay
      JOIN bookings b ON pay.booking_id = b.id
      JOIN properties p ON b.property_id = p.id
      WHERE p.manager_id = ? AND pay.payment_status = 'completed'
        AND pay.payment_date >= date('now', '-6 months')
      GROUP BY month
      ORDER BY month
    `).all(manager_id);
    
    res.json({
      success: true,
      data: {
        stats: {
          total_properties,
          total_students,
          total_rooms: total_rooms || 0,
          occupied_rooms: occupied_rooms || 0,
          available_rooms: available_rooms || 0,
          total_revenue: total_revenue || 0,
          pending_bookings
        },
        recentBookings,
        properties,
        students,
        monthlyRevenue
      }
    });
  } catch (error) {
    console.error('Get manager dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
export const getAdminDashboard = async (req, res) => {
  try {
    // Get total users by role
    const userStats = db.prepare(`
      SELECT 
        role,
        COUNT(*) as count,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_count
      FROM users
      GROUP BY role
    `).all();
    
    // Get total properties
    const { total_properties, active_properties } = db.prepare(`
      SELECT 
        COUNT(*) as total_properties,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_properties
      FROM properties
    `).get();
    
    // Get total bookings by status
    const bookingStats = db.prepare(`
      SELECT 
        status,
        COUNT(*) as count
      FROM bookings
      GROUP BY status
    `).all();
    
    // Get total revenue
    const { total_revenue, pending_revenue } = db.prepare(`
      SELECT 
        SUM(CASE WHEN payment_status = 'completed' THEN amount ELSE 0 END) as total_revenue,
        SUM(CASE WHEN payment_status = 'pending' THEN amount ELSE 0 END) as pending_revenue
      FROM payments
    `).get();
    
    // Get total rooms
    const { total_rooms, occupied_rooms } = db.prepare(`
      SELECT 
        COUNT(*) as total_rooms,
        SUM(occupied) as occupied_rooms
      FROM rooms
    `).get();
    
    // Get recent activities (bookings, users, properties)
    const recentBookings = db.prepare(`
      SELECT b.*, 
        p.name as property_name,
        u.name as student_name
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      JOIN users u ON b.student_id = u.id
      ORDER BY b.created_at DESC
      LIMIT 10
    `).all();
    
    const recentUsers = db.prepare(`
      SELECT id, name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 10
    `).all();
    
    const recentProperties = db.prepare(`
      SELECT p.*, u.name as manager_name
      FROM properties p
      JOIN users u ON p.manager_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 10
    `).all();
    
    // Monthly statistics (last 12 months)
    const monthlyStats = db.prepare(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as bookings,
        SUM(total_amount) as revenue
      FROM bookings
      WHERE created_at >= date('now', '-12 months')
      GROUP BY month
      ORDER BY month
    `).all();
    
    // Top properties by bookings
    const topProperties = db.prepare(`
      SELECT 
        p.id, p.name, p.city,
        COUNT(b.id) as booking_count,
        AVG(r.rating) as average_rating
      FROM properties p
      LEFT JOIN bookings b ON p.id = b.property_id
      LEFT JOIN reviews r ON p.id = r.property_id
      GROUP BY p.id
      ORDER BY booking_count DESC
      LIMIT 10
    `).all();
    
    // Top managers by revenue
    const topManagers = db.prepare(`
      SELECT 
        u.id, u.name, u.email,
        COUNT(DISTINCT p.id) as property_count,
        COUNT(DISTINCT b.id) as booking_count,
        COALESCE(SUM(pay.amount), 0) as total_revenue
      FROM users u
      LEFT JOIN properties p ON u.id = p.manager_id
      LEFT JOIN bookings b ON p.id = b.property_id
      LEFT JOIN payments pay ON b.id = pay.booking_id AND pay.payment_status = 'completed'
      WHERE u.role = 'manager'
      GROUP BY u.id
      ORDER BY total_revenue DESC
      LIMIT 10
    `).all();
    
    // Payment statistics
    const paymentStats = db.prepare(`
      SELECT 
        payment_status,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM payments
      GROUP BY payment_status
    `).all();
    
    // City-wise distribution
    const cityDistribution = db.prepare(`
      SELECT 
        city,
        COUNT(*) as property_count,
        SUM(total_rooms) as total_rooms
      FROM properties
      WHERE is_active = 1
      GROUP BY city
      ORDER BY property_count DESC
      LIMIT 10
    `).all();
    
    res.json({
      success: true,
      data: {
        stats: {
          users: userStats,
          properties: {
            total: total_properties,
            active: active_properties
          },
          bookings: bookingStats,
          revenue: {
            total: total_revenue || 0,
            pending: pending_revenue || 0
          },
          rooms: {
            total: total_rooms || 0,
            occupied: occupied_rooms || 0,
            available: (total_rooms || 0) - (occupied_rooms || 0)
          }
        },
        recentActivities: {
          bookings: recentBookings,
          users: recentUsers,
          properties: recentProperties
        },
        analytics: {
          monthlyStats,
          topProperties,
          topManagers,
          paymentStats,
          cityDistribution
        }
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get user dashboard stats (Student)
// @route   GET /api/dashboard/user
// @access  Private (Student)
export const getUserDashboard = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // Get active bookings
    const { active_bookings } = db.prepare(`
      SELECT COUNT(*) as active_bookings
      FROM bookings
      WHERE student_id = ? AND status IN ('confirmed', 'active')
    `).get(user_id);
    
    // Get total bookings
    const { total_bookings } = db.prepare(`
      SELECT COUNT(*) as total_bookings
      FROM bookings
      WHERE student_id = ?
    `).get(user_id);
    
    // Get total payments
    const { total_paid } = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total_paid
      FROM payments
      WHERE student_id = ? AND payment_status = 'completed'
    `).get(user_id);
    
    // Get pending payments
    const { pending_payments } = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as pending_payments
      FROM payments
      WHERE student_id = ? AND payment_status = 'pending'
    `).get(user_id);
    
    // Get current booking details
    const currentBooking = db.prepare(`
      SELECT b.*, 
        p.name as property_name, p.address, p.city, p.images,
        r.room_number, r.room_type,
        u.name as manager_name, u.phone as manager_phone
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON p.manager_id = u.id
      WHERE b.student_id = ? AND b.status IN ('confirmed', 'active')
      ORDER BY b.check_in_date DESC
      LIMIT 1
    `).get(user_id);
    
    if (currentBooking && currentBooking.images) {
      currentBooking.images = JSON.parse(currentBooking.images);
    }
    
    // Get booking history
    const bookingHistory = db.prepare(`
      SELECT b.*, 
        p.name as property_name, p.city,
        r.room_number
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      JOIN rooms r ON b.room_id = r.id
      WHERE b.student_id = ?
      ORDER BY b.created_at DESC
      LIMIT 5
    `).all(user_id);
    
    // Get recent payments
    const recentPayments = db.prepare(`
      SELECT p.*, b.property_id, pr.name as property_name
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN properties pr ON b.property_id = pr.id
      WHERE p.student_id = ?
      ORDER BY p.created_at DESC
      LIMIT 5
    `).all(user_id);
    
    // Get unread notifications
    const { unread_notifications } = db.prepare(`
      SELECT COUNT(*) as unread_notifications
      FROM notifications
      WHERE user_id = ? AND is_read = 0
    `).get(user_id);
    
    res.json({
      success: true,
      data: {
        stats: {
          active_bookings,
          total_bookings,
          total_paid: total_paid || 0,
          pending_payments: pending_payments || 0,
          unread_notifications
        },
        currentBooking,
        bookingHistory,
        recentPayments
      }
    });
  } catch (error) {
    console.error('Get user dashboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
