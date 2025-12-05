import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import validator from 'validator';
import db from '../config/database.js';

// Token configuration
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 1 * 60 * 100; // 1 minute in milliseconds

/**
 * Generate Access Token (short-lived)
 */
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'access' },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Generate Refresh Token (long-lived)
 */
export const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  // Store refresh token in database
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  try {
    db.prepare(`
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES (?, ?, ?)
    `).run(userId, refreshToken, expiresAt.toISOString());
  } catch (error) {
    console.error('Error storing refresh token:', error);
  }

  return refreshToken;
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if token is blacklisted
    const blacklisted = db.prepare('SELECT id FROM token_blacklist WHERE token = ?').get(token);
    if (blacklisted) {
      throw new Error('Token has been revoked');
    }
    
    return decoded;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key');
    
    // Check if refresh token exists in database
    const storedToken = db.prepare(`
      SELECT * FROM refresh_tokens 
      WHERE token = ? AND expires_at > datetime('now')
    `).get(token);
    
    if (!storedToken) {
      throw new Error('Invalid or expired refresh token');
    }
    
    return decoded;
  } catch (error) {
    throw error;
  }
};

/**
 * Revoke Refresh Token
 */
export const revokeRefreshToken = (token) => {
  try {
    db.prepare('DELETE FROM refresh_tokens WHERE token = ?').run(token);
  } catch (error) {
    console.error('Error revoking refresh token:', error);
  }
};

/**
 * Revoke All User Tokens
 */
export const revokeAllUserTokens = (userId) => {
  try {
    db.prepare('DELETE FROM refresh_tokens WHERE user_id = ?').run(userId);
  } catch (error) {
    console.error('Error revoking user tokens:', error);
  }
};

/**
 * Blacklist Access Token
 */
export const blacklistToken = (token, userId, reason = 'logout') => {
  try {
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);
    
    db.prepare(`
      INSERT INTO token_blacklist (token, user_id, reason, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(token, userId, reason, expiresAt.toISOString());
  } catch (error) {
    console.error('Error blacklisting token:', error);
  }
};

/**
 * Clean up expired tokens
 */
export const cleanupExpiredTokens = () => {
  try {
    // Remove expired refresh tokens
    db.prepare(`
      DELETE FROM refresh_tokens 
      WHERE expires_at < datetime('now')
    `).run();
    
    // Remove expired blacklisted tokens
    db.prepare(`
      DELETE FROM token_blacklist 
      WHERE expires_at < datetime('now')
    `).run();
    
    // Remove old login attempts (older than 24 hours)
    db.prepare(`
      DELETE FROM login_attempts 
      WHERE attempted_at < datetime('now', '-1 day')
    `).run();
  } catch (error) {
    console.error('Error cleaning up tokens:', error);
  }
};

/**
 * Validate Password Strength
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate Email
 */
export const validateEmail = (email) => {
  return validator.isEmail(email);
};

/**
 * Record Login Attempt
 */
export const recordLoginAttempt = (email, ipAddress, success) => {
  try {
    db.prepare(`
      INSERT INTO login_attempts (email, ip_address, success)
      VALUES (?, ?, ?)
    `).run(email, ipAddress, success ? 1 : 0);
  } catch (error) {
    console.error('Error recording login attempt:', error);
  }
};

/**
 * Check if Account is Locked
 */
export const isAccountLocked = (email) => {
  try {
    const user = db.prepare(`
      SELECT id FROM users WHERE email = ?
    `).get(email);
    
    if (!user) return { locked: false };
    
    // Try to get lock info (columns might not exist in old schema)
    try {
      const lockInfo = db.prepare(`
        SELECT failed_login_attempts, locked_until 
        FROM users 
        WHERE email = ?
      `).get(email);
      
      // Check if account is currently locked
      if (lockInfo && lockInfo.locked_until) {
        const lockTime = new Date(lockInfo.locked_until);
        if (lockTime > new Date()) {
          return {
            locked: true,
            until: lockTime
          };
        } else {
          // Lock time expired, reset
          db.prepare(`
            UPDATE users 
            SET failed_login_attempts = 0, locked_until = NULL 
            WHERE email = ?
          `).run(email);
        }
      }
    } catch (e) {
      // Columns don't exist, skip lock check
      console.log('Account lockout columns not available');
    }
    
    return { locked: false };
  } catch (error) {
    console.error('Error checking account lock:', error);
    return { locked: false };
  }
};

/**
 * Increment Failed Login Attempts
 */
export const incrementFailedAttempts = (email) => {
  try {
    // Check if columns exist
    try {
      const user = db.prepare('SELECT failed_login_attempts FROM users WHERE email = ?').get(email);
      
      if (user) {
        const newAttempts = (user.failed_login_attempts || 0) + 1;
        
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          // Lock the account
          const lockUntil = new Date(Date.now() + LOCK_TIME);
          db.prepare(`
            UPDATE users 
            SET failed_login_attempts = ?, locked_until = ? 
            WHERE email = ?
          `).run(newAttempts, lockUntil.toISOString(), email);
          
          return {
            locked: true,
            attempts: newAttempts,
            until: lockUntil
          };
        } else {
          db.prepare(`
            UPDATE users 
            SET failed_login_attempts = ? 
            WHERE email = ?
          `).run(newAttempts, email);
          
          return {
            locked: false,
            attempts: newAttempts,
            remaining: MAX_LOGIN_ATTEMPTS - newAttempts
          };
        }
      }
    } catch (e) {
      // Columns don't exist, skip increment
      console.log('Account lockout columns not available');
    }
  } catch (error) {
    console.error('Error incrementing failed attempts:', error);
  }
  
  return { locked: false };
};

/**
 * Reset Failed Login Attempts
 */
export const resetFailedAttempts = (email) => {
  try {
    // Try to reset (columns might not exist)
    try {
      db.prepare(`
        UPDATE users 
        SET failed_login_attempts = 0, locked_until = NULL 
        WHERE email = ?
      `).run(email);
    } catch (e) {
      // Columns don't exist, skip reset
      console.log('Account lockout columns not available');
    }
  } catch (error) {
    console.error('Error resetting failed attempts:', error);
  }
};

/**
 * Generate Secure Random Token
 */
export const generateSecureToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Run cleanup every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);
