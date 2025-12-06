import db from '../config/database.js';
import bcrypt from 'bcryptjs';
import { generateUUID } from '../utils/uuid.js';

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { 
      role, 
      status, 
      search, 
      page = 1, 
      limit = 10 
    } = req.query;

    let query = `
      SELECT 
        id, name, email, phone, role, avatar, 
        is_active, created_at, updated_at
      FROM users 
      WHERE 1=1
    `;
    
    const params = [];

    // Filter by role
    if (role && role !== 'all') {
      query += ` AND role = ?`;
      params.push(role);
    }

    // Filter by status
    if (status === 'active') {
      query += ` AND is_active = 1`;
    } else if (status === 'inactive') {
      query += ` AND is_active = 0`;
    }

    // Search by name or email
    if (search) {
      query += ` AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Get total count
    const countQuery = query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM');
    const countResult = db.prepare(countQuery).get(...params);
    const total = countResult?.total || 0;

    // Add pagination
    const offset = (page - 1) * limit;
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const users = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = db.prepare(`
      SELECT 
        id, name, email, phone, role, avatar, 
        is_active, created_at, updated_at
      FROM users 
      WHERE id = ?
    `).get(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get additional info based on role
    let additionalInfo = {};

    if (user.role === 'manager') {
      // Get properties managed
      const properties = db.prepare(`
        SELECT COUNT(*) as total_properties
        FROM properties 
        WHERE manager_id = ?
      `).get(id);
      additionalInfo.totalProperties = properties.total_properties;
    } else if (user.role === 'student') {
      // Get bookings
      const bookings = db.prepare(`
        SELECT COUNT(*) as total_bookings
        FROM bookings 
        WHERE user_id = ?
      `).get(id);
      additionalInfo.totalBookings = bookings.total_bookings;
    }

    res.json({
      success: true,
      data: {
        ...user,
        ...additionalInfo
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private/Admin
export const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      is_active = true
    } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if email already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Validate role
    const validRoles = ['admin', 'manager', 'student'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateUUID();

    // Insert user
    db.prepare(`
      INSERT INTO users (
        id, name, email, password, phone, role, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      name,
      email,
      hashedPassword,
      phone || null,
      role,
      is_active ? 1 : 0
    );

    const newUser = db.prepare(`
      SELECT 
        id, name, email, phone, role, 
        is_active, created_at
      FROM users 
      WHERE id = ?
    `).get(userId);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      role,
      is_active,
      password
    } = req.body;

    // Check if user exists
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and already exists
    if (email && email !== user.email) {
      const existingUser = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, id);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (role !== undefined) {
      updates.push('role = ?');
      values.push(role);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active ? 1 : 0);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    db.prepare(`
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = ?
    `).run(...values);

    const updatedUser = db.prepare(`
      SELECT 
        id, name, email, phone, role, 
        is_active, created_at, updated_at
      FROM users 
      WHERE id = ?
    `).get(id);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting the last admin
    if (user.role === 'admin') {
      const adminCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('admin');
      if (adminCount.count <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last admin user'
        });
      }
    }

    // Check for related data
    if (user.role === 'manager') {
      const properties = db.prepare('SELECT COUNT(*) as count FROM properties WHERE manager_id = ?').get(id);
      if (properties.count > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete manager with active properties. Please reassign properties first.'
        });
      }
    } else if (user.role === 'student') {
      const bookings = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE user_id = ? AND booking_status = ?').get(id, 'confirmed');
      if (bookings.count > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete student with active bookings'
        });
      }
    }

    // Delete user
    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// @desc    Toggle user status
// @route   PATCH /api/admin/users/:id/toggle-status
// @access  Private/Admin
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = db.prepare('SELECT is_active FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const newStatus = user.is_active ? 0 : 1;
    
    db.prepare(`
      UPDATE users 
      SET is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(newStatus, id);

    res.json({
      success: true,
      message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
      data: {
        is_active: newStatus
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling user status',
      error: error.message
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/admin/users/stats
// @access  Private/Admin
export const getUserStats = async (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        role,
        COUNT(*) as count,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_count,
        SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive_count
      FROM users
      GROUP BY role
    `).all();

    const totalUsers = db.prepare('SELECT COUNT(*) as total FROM users').get();
    const recentUsers = db.prepare(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE created_at >= datetime('now', '-30 days')
    `).get();

    res.json({
      success: true,
      data: {
        total: totalUsers.total,
        recentSignups: recentUsers.count,
        byRole: stats.reduce((acc, stat) => {
          acc[stat.role] = {
            total: stat.count,
            active: stat.active_count,
            inactive: stat.inactive_count
          };
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
};

// @desc    Reset user password
// @route   PATCH /api/admin/users/:id/reset-password
// @access  Private/Admin
export const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.prepare(`
      UPDATE users 
      SET password = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(hashedPassword, id);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
};
