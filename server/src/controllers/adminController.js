import db from '../config/database.js';
import bcrypt from 'bcryptjs';

/**
 * @desc    Get all users with filters and pagination
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, name, email, phone, role, avatar, is_active, created_at FROM users WHERE 1=1';
    const params = [];

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    if (status) {
      query += ' AND is_active = ?';
      params.push(status === 'active' ? 1 : 0);
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const countQuery = query.replace('SELECT id, name, email, phone, role, avatar, is_active, created_at FROM users', 'SELECT COUNT(*) as total FROM users');
    const countResult = db.prepare(countQuery).get(...params);
    const total = countResult?.total || 0;

    // Get paginated results
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const users = db.prepare(query).all(...params);

    res.status(200).json({
      success: true,
      data: {
        users,
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
      message: 'Error fetching users',
      error: error.message
    });
  }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = db.prepare(`
      SELECT id, name, email, phone, role, avatar, is_active, created_at, updated_at
      FROM users WHERE id = ?
    `).get(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user statistics
    const stats = {
      bookings: db.prepare('SELECT COUNT(*) as count FROM bookings WHERE student_id = ?').get(id)?.count || 0,
      properties: db.prepare('SELECT COUNT(*) as count FROM properties WHERE manager_id = ?').get(id)?.count || 0,
      documents: db.prepare('SELECT COUNT(*) as count FROM documents WHERE user_id = ?').get(id)?.count || 0
    };

    res.status(200).json({
      success: true,
      data: {
        user,
        stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

/**
 * @desc    Block user
 * @route   PATCH /api/admin/users/:id/block
 * @access  Private/Admin
 */
export const blockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot block admin users'
      });
    }

    db.prepare('UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);

    res.status(200).json({
      success: true,
      message: 'User blocked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error blocking user',
      error: error.message
    });
  }
};

/**
 * @desc    Unblock user
 * @route   PATCH /api/admin/users/:id/unblock
 * @access  Private/Admin
 */
export const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    db.prepare('UPDATE users SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);

    res.status(200).json({
      success: true,
      message: 'User unblocked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unblocking user',
      error: error.message
    });
  }
};

/**
 * @desc    Change user role
 * @route   PATCH /api/admin/users/:id/change-role
 * @access  Private/Admin
 */
export const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'manager', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    db.prepare('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(role, id);

    res.status(200).json({
      success: true,
      message: 'User role updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing user role',
      error: error.message
    });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

/**
 * @desc    Get platform analytics overview
 * @route   GET /api/admin/analytics/overview
 * @access  Private/Admin
 */
export const getAnalyticsOverview = async (req, res) => {
  try {
    // Total counts
    const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
    const totalRevenue = db.prepare("SELECT SUM(amount) as total FROM payments WHERE status = 'success'").get().total || 0;
    const totalStudents = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").get().count;
    const totalOwners = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'manager'").get().count;
    const totalHostels = db.prepare('SELECT COUNT(*) as count FROM properties').get().count;
    const approvedHostels = db.prepare("SELECT COUNT(*) as count FROM properties WHERE status = 'approved'").get().count;
    const pendingHostels = db.prepare("SELECT COUNT(*) as count FROM properties WHERE status = 'pending'").get().count;
    const rejectedHostels = db.prepare("SELECT COUNT(*) as count FROM properties WHERE status = 'rejected'").get().count;

    // Monthly revenue and commission
    const monthlyRevenue = db.prepare(`
      SELECT SUM(amount) as revenue
      FROM payments
      WHERE status = 'success' 
      AND paid_at >= date('now', 'start of month')
    `).get()?.revenue || 0;
    const monthlyCommission = monthlyRevenue * 0.10; // 10% commission

    // Top locations
    const topLocations = db.prepare(`
      SELECT city, COUNT(*) as count
      FROM properties
      WHERE status = 'approved'
      GROUP BY city
      ORDER BY count DESC
      LIMIT 5
    `).all();

    // Most searched cities (based on bookings)
    const mostSearchedCities = db.prepare(`
      SELECT p.city, COUNT(b.id) as bookings
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      GROUP BY p.city
      ORDER BY bookings DESC
      LIMIT 5
    `).all();

    // Monthly revenue history (last 6 months)
    const monthlyRevenueHistory = db.prepare(`
      SELECT 
        strftime('%Y-%m', paid_at) as month,
        SUM(amount) as revenue
      FROM payments
      WHERE status = 'success' AND paid_at >= date('now', '-6 months')
      GROUP BY month
      ORDER BY month DESC
    `).all();

    // Recent bookings
    const recentBookings = db.prepare(`
      SELECT 
        b.id,
        b.booking_status,
        b.total_amount,
        b.created_at,
        u.name as student_name,
        p.name as property_name
      FROM bookings b
      JOIN users u ON b.student_id = u.id
      JOIN properties p ON b.property_id = p.id
      ORDER BY b.created_at DESC
      LIMIT 10
    `).all();

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalBookings,
          totalRevenue,
          totalStudents,
          totalOwners,
          totalHostels,
          approvedHostels,
          pendingHostels,
          rejectedHostels,
          monthlyRevenue,
          monthlyCommission
        },
        topLocations,
        mostSearchedCities,
        monthlyRevenueHistory,
        recentBookings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};
