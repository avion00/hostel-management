# Authentication Integration Guide

## Overview
This document describes the complete authentication system with automatic token refresh functionality.

## Features Implemented

### 1. **JWT Token Management**
- Access tokens (short-lived, 15 minutes)
- Refresh tokens (long-lived, 7 days)
- Automatic token refresh on expiry
- Token persistence using Redux Persist

### 2. **Automatic Token Refresh**
- Axios interceptor automatically refreshes expired access tokens
- Queues failed requests during token refresh
- Retries failed requests with new token
- Automatic logout on refresh failure

### 3. **Protected Routes**
- Role-based access control
- Automatic redirect to login if not authenticated
- Redirect to appropriate dashboard based on user role
- Token verification on protected route access

### 4. **Redux State Management**
- Centralized auth state
- Persisted to localStorage
- Actions for login, logout, token updates

## File Structure

```
client/src/
├── redux/
│   ├── store.js                    # Redux store with persist config
│   └── features/
│       └── authSlice.js            # Auth state management
├── lib/
│   └── api/
│       ├── api.js                  # API endpoints
│       └── axiosInstance.js        # Axios with interceptors
├── components/
│   └── common/
│       └── ProtectedRoute.jsx      # Protected route wrapper
├── hooks/
│   └── useAuth.js                  # Auth hook for components
└── pages/
    └── authentication/
        └── login/
            └── Main.jsx            # Login page
```

## Usage Examples

### 1. Login Flow

```jsx
import { useDispatch } from 'react-redux';
import { setAccessToken, setRefreshToken, setUser, setIsLoggedIn } from '@/redux/features/authSlice';
import axiosInstance from '@/lib/api/axiosInstance';
import apis from '@/lib/api/api';

const handleLogin = async (email, password) => {
  const response = await axiosInstance.post(apis.login, { email, password });
  
  if (response.data.success) {
    const { accessToken, refreshToken, ...userData } = response.data.data;
    
    dispatch(setAccessToken(accessToken));
    dispatch(setRefreshToken(refreshToken));
    dispatch(setUser(userData));
    dispatch(setIsLoggedIn(true));
  }
};
```

### 2. Making Authenticated API Calls

```jsx
import axiosInstance from '@/lib/api/axiosInstance';

// The interceptor automatically adds the access token
const fetchUserData = async () => {
  const response = await axiosInstance.get('/api/users/profile');
  return response.data;
};
```

### 3. Using Protected Routes

```jsx
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Protect a route for specific roles
<Route 
  path="/dashboard/admin/*" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

### 4. Using the Auth Hook

```jsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, logout, hasRole } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.name}</p>
      {hasRole('admin') && <AdminPanel />}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Token Refresh Flow

1. User makes an API request
2. If access token is expired (401 error):
   - Interceptor catches the error
   - Calls refresh endpoint with refresh token
   - Gets new access token and refresh token
   - Updates Redux store
   - Retries original request with new token
3. If refresh fails:
   - Clears auth state
   - Redirects to login page

## API Response Format

### Login Response
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "student",
    "avatar": null,
    "is_active": 1,
    "created_at": "2025-12-04T12:00:00.000Z"
  }
}
```

### Refresh Response
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

## User Roles

- **student**: Regular users who book hostels
- **manager**: Hostel owners/managers
- **admin**: System administrators

## Security Features

1. **Token Rotation**: Refresh tokens are rotated on each refresh
2. **Token Blacklisting**: Old tokens are blacklisted on server
3. **Automatic Logout**: On token refresh failure
4. **Request Queuing**: Multiple requests during refresh are queued
5. **Role-Based Access**: Routes protected by user roles

## Environment Variables

```env
VITE_BACKEND_DOMAIN=http://localhost:5000/api
```

## Testing the Integration

### 1. Test Login
```bash
# Login with valid credentials
POST http://localhost:5000/api/auth/login
{
  "email": "student1@example.com",
  "password": "password123"
}
```

### 2. Test Protected Route
- Navigate to `/dashboard/admin/overview`
- Should redirect to login if not authenticated
- Should redirect to appropriate dashboard if wrong role

### 3. Test Token Refresh
- Wait for access token to expire (15 minutes)
- Make any API call
- Should automatically refresh and succeed

### 4. Test Logout
- Click logout button
- Should clear tokens and redirect to login
- Subsequent API calls should fail with 401

## Troubleshooting

### Issue: Infinite redirect loop
**Solution**: Check that ProtectedRoute is not wrapping the login route

### Issue: Token not being sent with requests
**Solution**: Ensure you're using `axiosInstance` instead of plain `axios`

### Issue: User logged out unexpectedly
**Solution**: Check refresh token expiry, ensure backend is returning valid tokens

### Issue: CORS errors
**Solution**: Ensure `withCredentials: true` is set in axios config

## Best Practices

1. Always use `axiosInstance` for API calls
2. Never store tokens in component state
3. Use `useAuth` hook for auth-related operations
4. Implement proper error handling for auth failures
5. Clear sensitive data on logout
6. Validate user roles on both frontend and backend

## Future Enhancements

- [ ] Remember me functionality (longer token expiry)
- [ ] Biometric authentication
- [ ] Two-factor authentication
- [ ] Session management dashboard
- [ ] Device tracking and management
