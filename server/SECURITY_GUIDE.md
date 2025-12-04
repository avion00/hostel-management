# 🔐 Enhanced Security Guide

## Security Improvements Implemented

Your authentication system has been upgraded with **enterprise-grade security features**:

### ✅ What's New

1. **JWT with Refresh Tokens**
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
   - Token rotation on refresh
   - Secure token storage in database

2. **Token Blacklisting**
   - Revoked tokens are blacklisted
   - Prevents use of compromised tokens
   - Automatic cleanup of expired tokens

3. **Account Protection**
   - Account lockout after 5 failed login attempts
   - 15-minute lockout period
   - Automatic unlock after timeout
   - Login attempt tracking

4. **Password Security**
   - Strong password requirements:
     - Minimum 8 characters
     - At least 1 uppercase letter
     - At least 1 lowercase letter
     - At least 1 number
     - At least 1 special character
   - Bcrypt hashing with 12 rounds
   - Password change forces re-login on all devices

5. **Rate Limiting**
   - Login: 5 attempts per 15 minutes
   - Signup: 3 accounts per hour per IP
   - General API: 100 requests per 15 minutes
   - Booking: 10 requests per hour

6. **HTTP Security Headers** (Helmet.js)
   - XSS Protection
   - Content Security Policy
   - HSTS (HTTP Strict Transport Security)
   - Frame Options
   - And more...

7. **Input Validation**
   - Email format validation
   - Password strength validation
   - Payload size limits (10MB)

---

## 🚀 How to Use

### 1. Install Dependencies

```bash
cd server
npm install
```

New dependencies added:
- `helmet` - Security headers
- `cookie-parser` - Cookie handling
- `express-rate-limit` - Rate limiting
- `validator` - Input validation

### 2. Update Environment Variables

Copy the new `.env.example`:

```bash
cp .env.example .env
```

**Important:** Update these values in production:

```env
# Use strong, random secrets (minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-min-32-chars

# Token expiry
JWT_EXPIRE=15m          # Access token (15 minutes)
JWT_REFRESH_EXPIRE=7d   # Refresh token (7 days)

# Security settings
MAX_LOGIN_ATTEMPTS=5
ACCOUNT_LOCK_TIME=15
BCRYPT_ROUNDS=12
```

### 3. Update Your Code

**Option A: Use Enhanced Files (Recommended)**

Replace the old files with enhanced versions:

```bash
# Backup old files
mv src/controllers/authController.js src/controllers/authController.old.js
mv src/middleware/auth.js src/middleware/auth.old.js
mv src/routes/authRoutes.js src/routes/authRoutes.old.js

# Use enhanced files
mv src/controllers/authController.enhanced.js src/controllers/authController.js
mv src/middleware/auth.enhanced.js src/middleware/auth.js
mv src/routes/authRoutes.enhanced.js src/routes/authRoutes.js
```

**Option B: Keep Both (For Testing)**

Update `app.js` to use enhanced routes:

```javascript
import authRoutes from './src/routes/authRoutes.enhanced.js';
```

### 4. Reset Database (Important!)

The database schema has been updated with new security tables:

```bash
# Delete old database
rm database/hostel_management.db

# Reseed with new schema
npm run seed
```

### 5. Start Server

```bash
npm run dev
```

---

## 📡 New API Endpoints

### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token-here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new-access-token",
    "refreshToken": "new-refresh-token"
  }
}
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "refreshToken": "your-refresh-token-here"
}
```

### Logout from All Devices
```http
POST /api/auth/logout-all
Authorization: Bearer <access-token>
```

### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass456!"
}
```

---

## 🔑 Authentication Flow

### 1. Login Flow

```
Client                          Server
  |                               |
  |-- POST /api/auth/login ------>|
  |   { email, password }         |
  |                               |
  |                               |-- Check account lock
  |                               |-- Verify credentials
  |                               |-- Reset failed attempts
  |                               |-- Generate tokens
  |                               |-- Store refresh token in DB
  |                               |
  |<-- { accessToken, refresh } --|
  |                               |
```

### 2. Using Access Token

```
Client                          Server
  |                               |
  |-- GET /api/protected -------->|
  |   Authorization: Bearer token |
  |                               |
  |                               |-- Verify token
  |                               |-- Check blacklist
  |                               |-- Check user active
  |                               |
  |<-- Protected data ------------|
  |                               |
```

### 3. Token Refresh Flow

```
Client                          Server
  |                               |
  |-- POST /api/auth/refresh ---->|
  |   { refreshToken }            |
  |                               |
  |                               |-- Verify refresh token
  |                               |-- Check DB for token
  |                               |-- Generate new tokens
  |                               |-- Revoke old refresh token
  |                               |-- Store new refresh token
  |                               |
  |<-- { new tokens } ------------|
  |                               |
```

---

## 🛡️ Security Features in Detail

### Token Blacklisting

When a user logs out or changes password, tokens are blacklisted:

```javascript
// Tokens are stored in token_blacklist table
{
  token: "jwt-token-string",
  user_id: 123,
  reason: "logout",
  blacklisted_at: "2024-12-02T10:00:00Z",
  expires_at: "2024-12-02T10:15:00Z"
}
```

### Account Lockout

After 5 failed login attempts:

```json
{
  "success": false,
  "message": "Account is locked due to too many failed login attempts. Please try again in 14 minutes.",
  "lockedUntil": "2024-12-02T10:15:00Z"
}
```

### Password Validation

Passwords must meet these requirements:

```javascript
{
  "isValid": false,
  "errors": [
    "Password must be at least 8 characters long",
    "Password must contain at least one uppercase letter",
    "Password must contain at least one number",
    "Password must contain at least one special character"
  ]
}
```

### Rate Limiting

Different limits for different endpoints:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/login` | 5 requests | 15 minutes |
| `/api/auth/signup` | 3 requests | 1 hour |
| `/api/bookings` | 10 requests | 1 hour |
| `/api/*` (general) | 100 requests | 15 minutes |

---

## 🔄 Migration from Old System

### Frontend Changes Required

#### 1. Store Both Tokens

```javascript
// Old way
localStorage.setItem('token', response.data.token);

// New way
localStorage.setItem('accessToken', response.data.accessToken);
localStorage.setItem('refreshToken', response.data.refreshToken);
```

#### 2. Handle Token Expiry

```javascript
// Axios interceptor for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED') {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/auth/refresh', { refreshToken });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);
```

#### 3. Logout Properly

```javascript
// Send logout request
const refreshToken = localStorage.getItem('refreshToken');
await axios.post('/api/auth/logout', { refreshToken }, {
  headers: { Authorization: `Bearer ${accessToken}` }
});

// Clear local storage
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
localStorage.removeItem('user');
```

---

## 📊 Database Tables

### New Tables

#### refresh_tokens
```sql
CREATE TABLE refresh_tokens (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### token_blacklist
```sql
CREATE TABLE token_blacklist (
  id INTEGER PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  user_id INTEGER,
  reason TEXT,
  blacklisted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL
);
```

#### login_attempts
```sql
CREATE TABLE login_attempts (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL,
  ip_address TEXT,
  success INTEGER DEFAULT 0,
  attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 Testing

### Test Password Validation

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "weak"
  }'
```

Expected: Password validation errors

### Test Account Lockout

Try logging in with wrong password 5 times:

```bash
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
  echo "\nAttempt $i"
done
```

Expected: Account locked after 5 attempts

### Test Token Refresh

```bash
# 1. Login
LOGIN_RESPONSE=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@example.com","password":"password123"}')

# 2. Extract refresh token
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.refreshToken')

# 3. Refresh token
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
```

---

## 🚨 Security Best Practices

### For Production

1. **Use Strong Secrets**
   ```bash
   # Generate secure random secrets
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Enable HTTPS**
   - Use SSL/TLS certificates
   - Redirect HTTP to HTTPS
   - Set secure cookie flags

3. **Environment Variables**
   - Never commit `.env` file
   - Use different secrets for dev/prod
   - Rotate secrets regularly

4. **Database Security**
   - Regular backups
   - Encrypt sensitive data
   - Use prepared statements (already done)

5. **Monitoring**
   - Log failed login attempts
   - Monitor rate limit hits
   - Alert on suspicious activity

### For Development

1. **Test Security Features**
   - Try weak passwords
   - Test account lockout
   - Verify token expiry

2. **Use Swagger UI**
   - Test all auth endpoints
   - Verify error messages
   - Check response formats

---

## 📚 Additional Resources

- **JWT Best Practices**: https://tools.ietf.org/html/rfc8725
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Helmet.js Docs**: https://helmetjs.github.io/

---

## ✅ Security Checklist

- [x] JWT with refresh tokens
- [x] Token blacklisting
- [x] Account lockout
- [x] Strong password requirements
- [x] Rate limiting
- [x] Security headers (Helmet)
- [x] Input validation
- [x] CORS configuration
- [x] Bcrypt password hashing
- [x] SQL injection prevention
- [x] XSS protection
- [x] CSRF protection (via tokens)

---

**Your API is now significantly more secure!** 🎉
