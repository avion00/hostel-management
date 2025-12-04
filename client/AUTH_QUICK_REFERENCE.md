# Authentication Quick Reference

## Import Statements

```javascript
// For making API calls
import axiosInstance from '@/lib/api/axiosInstance';

// For auth operations in components
import { useAuth } from '@/hooks/useAuth';

// For protecting routes
import ProtectedRoute from '@/components/common/ProtectedRoute';

// For Redux actions (if needed)
import { setAccessToken, setRefreshToken, setUser, setIsLoggedIn, logout } from '@/redux/features/authSlice';
```

## Common Patterns

### 1. Making API Calls
```javascript
// GET request
const response = await axiosInstance.get('/api/properties');

// POST request
const response = await axiosInstance.post('/api/bookings', {
  propertyId: 123,
  roomId: 456
});

// PUT request
const response = await axiosInstance.put('/api/users/profile', userData);

// DELETE request
const response = await axiosInstance.delete('/api/bookings/123');
```

### 2. Using Auth in Components
```javascript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, logout, hasRole, isAuthenticated } = useAuth();
  
  // Check if logged in
  if (!isAuthenticated()) {
    return <LoginPrompt />;
  }
  
  // Show content based on role
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      
      {hasRole('admin') && <AdminPanel />}
      {hasRole(['manager', 'admin']) && <ManagementTools />}
      
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 3. Protecting Routes
```javascript
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Single role
<Route 
  path="/admin" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminPage />
    </ProtectedRoute>
  } 
/>

// Multiple roles
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute allowedRoles={['manager', 'admin']}>
      <Dashboard />
    </ProtectedRoute>
  } 
/>

// Any authenticated user
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  } 
/>
```

### 4. Conditional Rendering by Role
```javascript
import { useAuth } from '@/hooks/useAuth';

function Navigation() {
  const { hasRole } = useAuth();
  
  return (
    <nav>
      <Link to="/">Home</Link>
      
      {hasRole('student') && (
        <Link to="/bookings">My Bookings</Link>
      )}
      
      {hasRole('manager') && (
        <Link to="/properties">My Properties</Link>
      )}
      
      {hasRole('admin') && (
        <Link to="/admin">Admin Panel</Link>
      )}
    </nav>
  );
}
```

### 5. Handling Logout
```javascript
import { useAuth } from '@/hooks/useAuth';

function LogoutButton() {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    await logout(); // Calls API and redirects to login
  };
  
  return <button onClick={handleLogout}>Logout</button>;
}
```

### 6. Accessing User Data
```javascript
import { useAuth } from '@/hooks/useAuth';

function UserProfile() {
  const { user } = useAuth();
  
  return (
    <div>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <p>Phone: {user?.phone}</p>
    </div>
  );
}
```

### 7. Error Handling
```javascript
import axiosInstance from '@/lib/api/axiosInstance';
import { toast } from 'sonner';

async function fetchData() {
  try {
    const response = await axiosInstance.get('/api/data');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Handled automatically by interceptor
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to access this resource.');
    } else {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
    throw error;
  }
}
```

### 8. Form Submission with Auth
```javascript
import axiosInstance from '@/lib/api/axiosInstance';
import { toast } from 'sonner';

async function handleSubmit(formData) {
  try {
    const response = await axiosInstance.post('/api/bookings', formData);
    
    if (response.data.success) {
      toast.success('Booking created successfully!');
      // Handle success
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to create booking');
  }
}
```

## User Roles

| Role | Value | Access |
|------|-------|--------|
| Student | `'student'` | User dashboard, bookings, payments |
| Manager | `'manager'` | Owner dashboard, property management |
| Admin | `'admin'` | Admin dashboard, all features |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login user |
| `/api/auth/logout` | POST | Logout user |
| `/api/auth/refresh` | POST | Refresh access token |
| `/api/auth/me` | GET | Get current user |
| `/api/auth/signup` | POST | Register new user |

## Redux State Structure

```javascript
{
  auth: {
    accessToken: "eyJhbGc...",
    refreshToken: "eyJhbGc...",
    user: {
      uuid: "550e8400-e29b-41d4-a716-446655440000",
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      role: "student",
      avatar: null,
      is_active: 1,
      created_at: "2025-12-04T12:00:00.000Z"
    },
    isLoggedIn: true
  }
}
```

## Common Issues & Solutions

### Issue: 401 Unauthorized
**Solution**: Ensure you're using `axiosInstance` not plain `axios`

### Issue: Token not refreshing
**Solution**: Check refresh token in Redux state, ensure backend is running

### Issue: Redirect loop
**Solution**: Don't wrap login route with ProtectedRoute

### Issue: User data not persisting
**Solution**: Check redux-persist configuration, clear localStorage

## Testing Credentials

```javascript
// Student
email: "student1@example.com"
password: "password123"

// Manager
email: "manager1@example.com"
password: "password123"

// Admin
email: "admin@example.com"
password: "password123"
```

## Useful Commands

```bash
# Start backend
cd server && npm run dev

# Start frontend
cd client && npm run dev

# Clear localStorage (in browser console)
localStorage.clear()

# Check Redux state (in browser console with Redux DevTools)
// Open Redux DevTools tab
```

## Best Practices

✅ Always use `axiosInstance` for API calls
✅ Use `useAuth` hook for auth operations
✅ Never store tokens in component state
✅ Always handle errors in API calls
✅ Use ProtectedRoute for sensitive pages
✅ Check roles on both frontend and backend
✅ Clear sensitive data on logout

❌ Don't use plain `axios`
❌ Don't access Redux state directly in components
❌ Don't hardcode tokens
❌ Don't skip error handling
❌ Don't trust frontend role checks alone

## Quick Debugging

```javascript
// Check if user is logged in
import { useAuth } from '@/hooks/useAuth';
const { isAuthenticated } = useAuth();
console.log('Is authenticated:', isAuthenticated());

// Check current user
const { user } = useAuth();
console.log('Current user:', user);

// Check tokens in Redux
import { useSelector } from 'react-redux';
const auth = useSelector(state => state.auth);
console.log('Auth state:', auth);

// Check localStorage
console.log('Persisted state:', localStorage.getItem('persist:root'));
```

## Need Help?

1. Check `AUTH_INTEGRATION.md` for detailed docs
2. Check `AUTHENTICATION_TESTING.md` for test scenarios
3. Check `AUTH_INTEGRATION_SUMMARY.md` for overview
4. Check browser console for errors
5. Check Redux DevTools for state
6. Check Network tab for API calls
