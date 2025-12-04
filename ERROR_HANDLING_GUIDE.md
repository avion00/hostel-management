# Error Handling Guide

## Frontend Error Handling

### Login Error Handling

The login page now handles all possible error scenarios with clear, user-friendly messages.

#### Error Types and Messages

| Status Code | Error Type | User Message | Action |
|-------------|-----------|--------------|--------|
| 400 | Bad Request | "Please provide valid email and password" | Check form inputs |
| 401 | Unauthorized | "Invalid email or password. Please check your credentials." | Verify credentials |
| 403 | Forbidden | "Your account has been deactivated" | Contact support |
| 423 | Locked | "Account is locked due to too many failed attempts" | Wait 15 minutes |
| 500 | Server Error | "An error occurred during login" | Try again later |
| Network | Connection Failed | "Cannot connect to server. Please check your internet connection." | Check network |

### Implementation

```javascript
try {
  const response = await axiosInstance.post(apis.login, formData);
  // Handle success
} catch (err) {
  if (err.response) {
    // Server responded with error
    const status = err.response.status;
    const message = err.response.data?.message;
    
    if (status === 401) {
      toast.error(message || "Invalid email or password");
    } else if (status === 423) {
      toast.error(message || "Account is locked");
    }
    // ... handle other status codes
  } else if (err.request) {
    // Request made but no response
    toast.error("Cannot connect to server");
  } else {
    // Something else happened
    toast.error("An unexpected error occurred");
  }
}
```

## Backend Error Handling

### Authentication Errors

#### 1. Invalid Credentials (401)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Causes**:
- User doesn't exist
- Wrong password
- Email typo

**Prevention**:
- Use test credentials from TEST_CREDENTIALS.md
- Check email spelling
- Ensure password is correct

#### 2. Account Locked (423)
```json
{
  "success": false,
  "message": "Account is locked due to too many failed login attempts. Please try again in 15 minutes.",
  "lockedUntil": "2025-12-04T13:15:00.000Z"
}
```

**Causes**:
- 5 failed login attempts within 15 minutes

**Prevention**:
- Use correct credentials
- Don't spam login attempts

**Resolution**:
- Wait 15 minutes for automatic unlock
- Or clear `login_attempts` table

#### 3. Account Deactivated (403)
```json
{
  "success": false,
  "message": "Your account has been deactivated. Please contact support."
}
```

**Causes**:
- User's `is_active` field is 0

**Resolution**:
```sql
UPDATE users SET is_active = 1 WHERE email = 'user@example.com';
```

#### 4. Missing Fields (400)
```json
{
  "success": false,
  "message": "Please provide email and password"
}
```

**Causes**:
- Email or password not provided

**Prevention**:
- Ensure form validation is working
- Check required fields

#### 5. Server Error (500)
```json
{
  "success": false,
  "message": "Error logging in"
}
```

**Causes**:
- Database connection issues
- Server crash
- Unexpected errors

**Resolution**:
- Check server logs
- Restart server
- Check database connection

## Common Error Scenarios

### Scenario 1: User Not Found

**Error**: 401 Unauthorized
**Message**: "Invalid email or password"

**Debug Steps**:
1. Check if user exists in database:
   ```sql
   SELECT * FROM users WHERE email = 'user@example.com';
   ```
2. If no user found, create one or use test credentials
3. Run seed script if needed:
   ```bash
   node src/scripts/seedData.js
   ```

### Scenario 2: Wrong Password

**Error**: 401 Unauthorized
**Message**: "Invalid email or password"

**Debug Steps**:
1. Verify password is correct
2. Test credentials use `password123`
3. Check if password was hashed correctly
4. Reset password if needed

### Scenario 3: Network Error

**Error**: Network Error
**Message**: "Cannot connect to server. Please check your internet connection."

**Debug Steps**:
1. Check if backend is running:
   ```bash
   curl http://localhost:5000/api/auth/login
   ```
2. Verify backend URL in `.env`:
   ```
   VITE_BACKEND_DOMAIN=http://localhost:5000/api
   ```
3. Check CORS settings
4. Restart backend server

### Scenario 4: CORS Error

**Error**: CORS policy error in browser console

**Debug Steps**:
1. Check backend CORS configuration in `app.js`
2. Ensure frontend URL is allowed
3. Check `withCredentials` setting
4. Verify headers are correct

### Scenario 5: Token Refresh Failed

**Error**: 401 Unauthorized on protected routes
**Message**: "Invalid or expired refresh token"

**Debug Steps**:
1. Check if refresh token exists in Redux
2. Verify token hasn't expired
3. Check refresh endpoint is working
4. Clear localStorage and login again

## Error Logging

### Frontend Logging
```javascript
console.error("Login error:", err);
console.error("Status:", err.response?.status);
console.error("Message:", err.response?.data?.message);
console.error("Full response:", err.response?.data);
```

### Backend Logging
```javascript
console.error('Login error:', error);
console.error('Stack trace:', error.stack);
```

## Testing Error Scenarios

### Test Invalid Credentials
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid@example.com",
    "password": "wrongpassword"
  }'
```

**Expected**: 401 with "Invalid email or password"

### Test Missing Fields
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**Expected**: 400 with "Please provide email and password"

### Test Account Lock
1. Make 5 failed login attempts
2. Try to login again

**Expected**: 423 with account locked message

## Error Prevention Best Practices

### Frontend
1. ✅ Validate form inputs before submission
2. ✅ Show clear error messages to users
3. ✅ Handle all possible error status codes
4. ✅ Implement proper loading states
5. ✅ Add retry mechanisms for network errors
6. ✅ Log errors for debugging

### Backend
1. ✅ Validate all inputs
2. ✅ Return consistent error format
3. ✅ Use appropriate HTTP status codes
4. ✅ Don't expose sensitive information in errors
5. ✅ Log errors with context
6. ✅ Implement rate limiting
7. ✅ Handle database errors gracefully

## Error Response Format

All API errors follow this format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": ["Optional array of detailed errors"]
}
```

## Debugging Checklist

When you encounter an error:

- [ ] Check browser console for errors
- [ ] Check Network tab for API response
- [ ] Verify backend server is running
- [ ] Check backend logs
- [ ] Verify credentials are correct
- [ ] Check database connection
- [ ] Verify environment variables
- [ ] Check CORS settings
- [ ] Test with cURL to isolate frontend issues
- [ ] Check Redux state in DevTools

## Quick Fixes

### Clear Everything and Start Fresh
```bash
# Frontend
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev

# Backend
cd server
rm -rf node_modules package-lock.json
npm install
npm run dev

# Clear browser data
# Open DevTools > Application > Clear storage
```

### Reset Database
```bash
cd server
rm hostel_management.db
node src/scripts/seedData.js
```

### Clear Auth State
```javascript
// In browser console
localStorage.clear();
// Then refresh page
```

## Getting Help

If you're still experiencing errors:

1. Check `TEST_CREDENTIALS.md` for valid test accounts
2. Check `AUTHENTICATION_TESTING.md` for test scenarios
3. Check `AUTH_INTEGRATION.md` for implementation details
4. Review backend logs for detailed error messages
5. Check database for data integrity
