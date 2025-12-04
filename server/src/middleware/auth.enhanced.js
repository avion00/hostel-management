import db from '../config/database.js';
import { verifyAccessToken } from '../utils/security.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token provided' 
    });
  }

  try {
    // Verify token and check if blacklisted
    const decoded = verifyAccessToken(token);
    
    // Get user from database
    const user = db.prepare(`
      SELECT id, name, email, phone, role, avatar, is_active 
      FROM users WHERE id = ?
    `).get(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (!user.is_active) {
      return res.status(403).json({ 
        success: false,
        message: 'Account has been deactivated' 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired, please refresh your token',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.message === 'Token has been revoked') {
      return res.status(401).json({ 
        success: false,
        message: 'Token has been revoked, please login again',
        code: 'TOKEN_REVOKED'
      });
    }
    
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, invalid token' 
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};
