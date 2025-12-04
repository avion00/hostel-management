# Authentication Testing Guide

## Quick Start

### 1. Start the Backend Server
```bash
cd server
npm run dev
```

Server should be running on: http://localhost:5000

### 2. Start the Frontend
```bash
cd client
npm run dev
```

Frontend should be running on: http://localhost:5173

## Test Scenarios

### Scenario 1: Login Flow

1. **Navigate to Login Page**
   - Go to http://localhost:5173/login
   - You should see the login form

2. **Login with Test Credentials**
   ```
   Email: student1@example.com
   Password: password123
   ```

3. **Expected Result**
   - Success toast message appears
   - Redirected to appropriate dashboard based on role:
     - Student → Home page (/)
     - Manager → /dashboard/owner/overview
     - Admin → /dashboard/admin/overview
   - User info displayed in header
   - Logout button visible

### Scenario 2: Token Persistence

1. **Login to the application**
2. **Refresh the browser page (F5)**
3. **Expected Result**
   - User remains logged in
   - No redirect to login page
   - User data still displayed
   - Can access protected routes

### Scenario 3: Protected Routes

1. **Without Login**
   - Try to access: http://localhost:5173/dashboard/admin/overview
   - **Expected**: Redirect to /login

2. **With Wrong Role**
   - Login as student
   - Try to access: http://localhost:5173/dashboard/admin/overview
   - **Expected**: Redirect to appropriate dashboard for your role

3. **With Correct Role**
   - Login as admin
   - Access: http://localhost:5173/dashboard/admin/overview
   - **Expected**: Page loads successfully

### Scenario 4: Token Refresh (Automatic)

**Note**: Access tokens expire in 15 minutes

1. **Login to the application**
2. **Wait 15+ minutes** (or modify token expiry in backend for faster testing)
3. **Make any API call** (navigate to different page, fetch data)
4. **Expected Result**
   - Request succeeds without manual re-login
   - New tokens automatically obtained
   - User experience is seamless

**To Test Faster:**
Edit `server/src/utils/security.js`:
```javascript
// Change from 15m to 1m for testing
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1m' });
};
```

### Scenario 5: Logout

1. **Login to the application**
2. **Click the Logout button** in the header
3. **Expected Result**
   - Success toast message
   - Redirected to /login
   - Cannot access protected routes
   - Tokens cleared from Redux store
   - Tokens invalidated on server

### Scenario 6: Multiple Tabs

1. **Login in Tab 1**
2. **Open Tab 2** with the same application
3. **Expected Result**
   - Both tabs show logged-in state
   - User data visible in both tabs

4. **Logout in Tab 1**
5. **Refresh Tab 2**
6. **Expected Result**
   - Tab 2 redirects to login (tokens cleared)

### Scenario 7: API Calls with Authentication

1. **Login to the application**
2. **Navigate to a page that fetches data** (e.g., properties list)
3. **Open Browser DevTools → Network tab**
4. **Check the API request headers**
5. **Expected Result**
   - `Authorization: Bearer <token>` header present
   - Request succeeds with 200 status

## Test User Accounts

### Student Account
```
Email: student1@example.com
Password: password123
Role: student
Access: User dashboard, booking features
```

### Manager Account
```
Email: manager1@example.com
Password: password123
Role: manager
Access: Owner dashboard, property management
```

### Admin Account
```
Email: admin@example.com
Password: password123
Role: admin
Access: Admin dashboard, all features
```

## Debugging Tips

### Check Redux State
1. Install Redux DevTools browser extension
2. Open DevTools → Redux tab
3. Check `auth` state for:
   - `accessToken`
   - `refreshToken`
   - `user`
   - `isLoggedIn`

### Check LocalStorage
1. Open DevTools → Application tab
2. Go to Storage → Local Storage
3. Look for `persist:root` key
4. Should contain serialized auth state

### Check Network Requests
1. Open DevTools → Network tab
2. Filter by XHR/Fetch
3. Check for:
   - `/api/auth/login` - Login request
   - `/api/auth/refresh` - Token refresh
   - `/api/auth/logout` - Logout request
   - Other API calls with Authorization header

### Common Issues

#### Issue: "Invalid or expired refresh token"
**Cause**: Refresh token expired or invalid
**Solution**: 
- Logout and login again
- Check token expiry settings
- Verify refresh token in database

#### Issue: Infinite redirect loop
**Cause**: ProtectedRoute wrapping login route
**Solution**: Ensure login route is not protected

#### Issue: 401 Unauthorized on all requests
**Cause**: Access token not being sent
**Solution**: 
- Verify using `axiosInstance` not plain `axios`
- Check Redux state has valid token
- Check Authorization header in network tab

#### Issue: User data not persisting
**Cause**: Redux persist not configured properly
**Solution**: 
- Check `redux-persist` setup in store.js
- Clear browser cache and localStorage
- Verify PersistGate in main.jsx

## API Endpoints

### Authentication Endpoints

```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
PUT  /api/auth/change-password
```

### Testing with cURL

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@example.com",
    "password": "password123"
  }'
```

#### Get User Info
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Refresh Token
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Success Criteria

✅ User can login with valid credentials
✅ User stays logged in after page refresh
✅ Protected routes redirect to login when not authenticated
✅ Role-based access control works correctly
✅ Tokens automatically refresh before expiry
✅ User can logout successfully
✅ Logout clears all auth data
✅ Multiple API calls work with authentication
✅ User info displays correctly in UI
✅ Error messages show for invalid credentials

## Next Steps

After successful testing:
1. Update other pages to use `axiosInstance` for API calls
2. Add loading states during authentication
3. Implement "Remember Me" functionality
4. Add password reset flow
5. Implement email verification
6. Add social login (Google, Facebook)
7. Add two-factor authentication
