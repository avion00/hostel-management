# 🔄 Migration Guide: Enhanced Security

## Quick Migration Steps

Follow these steps to upgrade to the enhanced security system:

### Step 1: Install New Dependencies

```bash
cd server
npm install
```

This will install:
- `helmet` - Security headers
- `cookie-parser` - Cookie handling  
- `express-rate-limit` - Rate limiting
- `validator` - Input validation

### Step 2: Backup Current Files

```bash
# Create backup directory
mkdir -p backups

# Backup current files
cp src/controllers/authController.js backups/authController.old.js
cp src/middleware/auth.js backups/auth.old.js
cp src/routes/authRoutes.js backups/authRoutes.old.js
cp app.js backups/app.old.js
```

### Step 3: Replace with Enhanced Files

```bash
# Replace auth controller
mv src/controllers/authController.enhanced.js src/controllers/authController.js

# Replace auth middleware
mv src/middleware/auth.enhanced.js src/middleware/auth.js

# Replace auth routes
mv src/routes/authRoutes.enhanced.js src/routes/authRoutes.js
```

### Step 4: Update .env File

Add these new variables to your `.env`:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Security Configuration
MAX_LOGIN_ATTEMPTS=5
ACCOUNT_LOCK_TIME=15
BCRYPT_ROUNDS=12
```

**Generate secure secrets:**

```bash
# Run this to generate random secrets
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Reset Database

The database schema has been updated with new security tables:

```bash
# Delete old database
rm database/hostel_management.db

# Reseed with new schema
npm run seed
```

### Step 6: Test the Server

```bash
npm run dev
```

Visit: http://localhost:5000/api-docs

### Step 7: Test Authentication

#### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@example.com","password":"password123"}'
```

You should receive both `accessToken` and `refreshToken`.

#### Test Token Refresh
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN_HERE"}'
```

#### Test Password Validation
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "weak"
  }'
```

Should return password validation errors.

---

## What Changed?

### Authentication Flow

**Before:**
```
Login → Single JWT token (30 days) → Use until expired
```

**After:**
```
Login → Access Token (15 min) + Refresh Token (7 days)
      → Access expires → Refresh to get new tokens
      → Refresh expires → Login again
```

### API Responses

**Before:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John",
    "email": "john@example.com",
    "token": "single-jwt-token"
  }
}
```

**After:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John",
    "email": "john@example.com",
    "accessToken": "short-lived-token",
    "refreshToken": "long-lived-token"
  }
}
```

### New Endpoints

- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (revoke tokens)
- `POST /api/auth/logout-all` - Logout from all devices
- `PUT /api/auth/change-password` - Change password

### Security Features Added

✅ Token refresh mechanism
✅ Token blacklisting
✅ Account lockout (5 failed attempts)
✅ Strong password requirements
✅ Rate limiting
✅ Security headers (Helmet)
✅ Input validation
✅ Login attempt tracking

---

## Frontend Integration Changes

### Update Your Frontend Code

#### 1. Update Login Function

```javascript
// OLD
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.data.token);
  return response.data;
};

// NEW
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('accessToken', response.data.data.accessToken);
  localStorage.setItem('refreshToken', response.data.data.refreshToken);
  return response.data;
};
```

#### 2. Update API Client

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If token expired, try to refresh
    if (error.response?.status === 401 && 
        error.response?.data?.code === 'TOKEN_EXPIRED' &&
        !originalRequest._retry) {
      
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          'http://localhost:5000/api/auth/refresh',
          { refreshToken }
        );
        
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

#### 3. Update Logout Function

```javascript
// OLD
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// NEW
const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    await api.post('/auth/logout', { refreshToken });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};
```

#### 4. Add Password Change Function

```javascript
const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/auth/change-password', {
    currentPassword,
    newPassword
  });
  
  // Password changed, need to login again
  localStorage.clear();
  return response.data;
};
```

---

## Rollback Instructions

If you need to rollback to the old system:

```bash
# Restore old files
cp backups/authController.old.js src/controllers/authController.js
cp backups/auth.old.js src/middleware/auth.js
cp backups/authRoutes.old.js src/routes/authRoutes.js
cp backups/app.old.js app.js

# Restore old database
rm database/hostel_management.db
npm run seed

# Restart server
npm run dev
```

---

## Testing Checklist

After migration, test these scenarios:

- [ ] User can signup with strong password
- [ ] User cannot signup with weak password
- [ ] User can login successfully
- [ ] User receives both access and refresh tokens
- [ ] Access token works for protected routes
- [ ] Access token expires after 15 minutes
- [ ] Refresh token can generate new access token
- [ ] Account locks after 5 failed login attempts
- [ ] Account unlocks after 15 minutes
- [ ] User can logout successfully
- [ ] Logged out tokens don't work
- [ ] User can change password
- [ ] Rate limiting works (try 6 login attempts quickly)

---

## Troubleshooting

### Issue: "Cannot find module './utils/security.js'"

**Solution:** Make sure the `src/utils/security.js` file exists. It should have been created during setup.

### Issue: "Database error: no such column"

**Solution:** You need to reset the database:
```bash
rm database/hostel_management.db
npm run seed
```

### Issue: "Rate limit exceeded"

**Solution:** This is working as intended! Wait 15 minutes or restart the server to reset rate limits during testing.

### Issue: "Invalid refresh token"

**Solution:** The refresh token might have expired or been revoked. Login again to get new tokens.

---

## Support

For questions or issues:
1. Check `SECURITY_GUIDE.md` for detailed documentation
2. Review `server/README.md` for general setup
3. Visit Swagger UI at http://localhost:5000/api-docs

---

**Migration complete! Your authentication is now enterprise-grade secure.** 🔐
