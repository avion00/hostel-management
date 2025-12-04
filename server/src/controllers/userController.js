import bcrypt from 'bcryptjs';
import db from '../config/database.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    
    let query = 'SELECT id, name, email, phone, role, avatar, is_active, created_at FROM users WHERE 1=1';
    const params = [];
    
    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }
    
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    // Get total count
    const countQuery = query.replace('SELECT id, name, email, phone, role, avatar, is_active, created_at', 'SELECT COUNT(*) as total');
    const { total } = db.prepare(countQuery).get(...params);
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
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
    console.error('Get all users error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin, Self)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check authorization
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view this user' 
      });
    }
    
    const user = db.prepare('SELECT id, name, email, phone, role, avatar, is_active, created_at FROM users WHERE id = ?').get(id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Get additional stats based on role
    let additionalData = {};
    
    if (user.role === 'student') {
      const bookingStats = db.prepare(`
        SELECT 
          COUNT(*) as total_bookings,
          SUM(CASE WHEN status IN ('confirmed', 'active') THEN 1 ELSE 0 END) as active_bookings
        FROM bookings WHERE student_id = ?
      `).get(id);
      
      const paymentStats = db.prepare(`
        SELECT 
          COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN amount ELSE 0 END), 0) as total_paid,
          COALESCE(SUM(CASE WHEN payment_status = 'pending' THEN amount ELSE 0 END), 0) as pending_amount
        FROM payments WHERE student_id = ?
      `).get(id);
      
      additionalData = { ...bookingStats, ...paymentStats };
    } else if (user.role === 'manager') {
      const propertyStats = db.prepare(`
        SELECT 
          COUNT(*) as total_properties,
          SUM(total_rooms) as total_rooms,
          SUM(available_rooms) as available_rooms
        FROM properties WHERE manager_id = ?
      `).get(id);
      
      const bookingStats = db.prepare(`
        SELECT COUNT(DISTINCT b.id) as total_bookings
        FROM bookings b
        JOIN properties p ON b.property_id = p.id
        WHERE p.manager_id = ?
      `).get(id);
      
      additionalData = { ...propertyStats, ...bookingStats };
    }
    
    res.json({
      success: true,
      data: {
        ...user,
        ...additionalData
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin, Self)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check authorization
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this user' 
      });
    }
    
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    const { name, email, phone, avatar, password } = req.body;
    
    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const emailExists = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, id);
      if (emailExists) {
        return res.status(400).json({ 
          success: false,
          message: 'Email already in use' 
        });
      }
    }
    
    let updateQuery = `
      UPDATE users SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        avatar = COALESCE(?, avatar),
        updated_at = CURRENT_TIMESTAMP
    `;
    
    const params = [name || null, email || null, phone || null, avatar || null];
    
    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateQuery += ', password = ?';
      params.push(hashedPassword);
    }
    
    updateQuery += ' WHERE id = ?';
    params.push(id);
    
    db.prepare(updateQuery).run(...params);
    
    const updatedUser = db.prepare('SELECT id, name, email, phone, role, avatar, is_active, created_at FROM users WHERE id = ?').get(id);
    
    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const validRoles = ['student', 'manager', 'admin'];
    if (!validRoles.includes(role)) {
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
    
    const updatedUser = db.prepare('SELECT id, name, email, phone, role, avatar, is_active, created_at FROM users WHERE id = ?').get(id);
    
    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/users/:id/status
// @access  Private (Admin only)
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    const newStatus = is_active !== undefined ? is_active : !user.is_active;
    
    db.prepare('UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus ? 1 : 0, id);
    
    const updatedUser = db.prepare('SELECT id, name, email, phone, role, avatar, is_active, created_at FROM users WHERE id = ?').get(id);
    
    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
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
    
    // Prevent deleting yourself
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot delete your own account' 
      });
    }
    
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
export const getUserNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { unread_only, limit = 20 } = req.query;
    
    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [user_id];
    
    if (unread_only === 'true') {
      query += ' AND is_read = 0';
    }
    
    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));
    
    const notifications = db.prepare(query).all(...params);
    
    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id/read
// @access  Private
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    const notification = db.prepare('SELECT * FROM notifications WHERE id = ? AND user_id = ?').get(id, user_id);
    
    if (!notification) {
      return res.status(404).json({ 
        success: false,
        message: 'Notification not found' 
      });
    }
    
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(id);
    
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/users/notifications/read-all
// @access  Private
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(user_id);
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
