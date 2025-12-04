# 🔗 Frontend Integration Guide

This guide shows how to integrate the backend API with your React frontend.

---

## 📡 API Configuration

### 1. Create API Client

Create `client/src/services/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔐 Authentication Service

Create `client/src/services/authService.js`:

```javascript
import api from './api';

export const authService = {
  // Register new user
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Get user from localStorage
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
```

---

## 🏠 Property Service

Create `client/src/services/propertyService.js`:

```javascript
import api from './api';

export const propertyService = {
  // Get all properties with filters
  getProperties: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.city) params.append('city', filters.city);
    if (filters.pincode) params.append('pincode', filters.pincode);
    if (filters.near_college) params.append('near_college', filters.near_college);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await api.get(`/properties?${params.toString()}`);
    return response.data;
  },

  // Get single property
  getPropertyById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Create property (Manager/Admin)
  createProperty: async (propertyData) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },

  // Update property (Manager/Admin)
  updateProperty: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  // Delete property (Manager/Admin)
  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  // Get properties by manager
  getPropertiesByManager: async (managerId) => {
    const response = await api.get(`/properties/manager/${managerId}`);
    return response.data;
  },
};
```

---

## 📅 Booking Service

Create `client/src/services/bookingService.js`:

```javascript
import api from './api';

export const bookingService = {
  // Create booking (Student)
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get student bookings
  getStudentBookings: async () => {
    const response = await api.get('/bookings/student');
    return response.data;
  },

  // Get property bookings (Manager/Admin)
  getPropertyBookings: async (propertyId) => {
    const response = await api.get(`/bookings/property/${propertyId}`);
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Update booking status (Manager/Admin)
  updateBookingStatus: async (id, status) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};
```

---

## 📊 Dashboard Service

Create `client/src/services/dashboardService.js`:

```javascript
import api from './api';

export const dashboardService = {
  // Get student dashboard
  getUserDashboard: async () => {
    const response = await api.get('/dashboard/user');
    return response.data;
  },

  // Get manager dashboard
  getManagerDashboard: async () => {
    const response = await api.get('/dashboard/manager');
    return response.data;
  },

  // Get admin dashboard
  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },
};
```

---

## 👥 User Service

Create `client/src/services/userService.js`:

```javascript
import api from './api';

export const userService = {
  // Get all users (Admin)
  getAllUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Update user role (Admin)
  updateUserRole: async (id, role) => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },

  // Toggle user status (Admin)
  toggleUserStatus: async (id, is_active) => {
    const response = await api.put(`/users/${id}/status`, { is_active });
    return response.data;
  },

  // Delete user (Admin)
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Get notifications
  getNotifications: async (unreadOnly = false, limit = 20) => {
    const params = new URLSearchParams();
    if (unreadOnly) params.append('unread_only', 'true');
    params.append('limit', limit);
    
    const response = await api.get(`/users/notifications?${params.toString()}`);
    return response.data;
  },

  // Mark notification as read
  markNotificationAsRead: async (id) => {
    const response = await api.put(`/users/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async () => {
    const response = await api.put('/users/notifications/read-all');
    return response.data;
  },
};
```

---

## 🎯 Usage Examples

### Login Page

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login({ email, password });
      
      if (response.success) {
        const user = response.data;
        
        // Redirect based on role
        if (user.role === 'student') {
          navigate('/dashboard/user/overview');
        } else if (user.role === 'manager') {
          navigate('/dashboard/owner/overview');
        } else if (user.role === 'admin') {
          navigate('/dashboard/admin/overview');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Property Search Page

```javascript
import { useState, useEffect } from 'react';
import { propertyService } from '@/services/propertyService';

function FindHostelsPage() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
    pincode: '',
    near_college: '',
    min_price: '',
    max_price: '',
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await propertyService.getProperties(filters);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div>
      {/* Search Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="City"
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
        />
        <input
          type="text"
          placeholder="Pincode"
          value={filters.pincode}
          onChange={(e) => handleFilterChange('pincode', e.target.value)}
        />
        <input
          type="text"
          placeholder="Near College"
          value={filters.near_college}
          onChange={(e) => handleFilterChange('near_college', e.target.value)}
        />
      </div>

      {/* Property List */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="property-grid">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Manager Dashboard

```javascript
import { useState, useEffect } from 'react';
import { dashboardService } from '@/services/dashboardService';

function ManagerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardService.getManagerDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const { stats, students, properties, recentBookings } = dashboardData;

  return (
    <div className="dashboard">
      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard title="Total Properties" value={stats.total_properties} />
        <StatCard title="Total Students" value={stats.total_students} />
        <StatCard title="Occupied Rooms" value={stats.occupied_rooms} />
        <StatCard title="Total Revenue" value={`₹${stats.total_revenue}`} />
      </div>

      {/* Enrolled Students Table */}
      <div className="students-section">
        <h2>Enrolled Students</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Property</th>
              <th>Room</th>
              <th>Check-in Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.property_name}</td>
                <td>{student.room_number}</td>
                <td>{new Date(student.check_in_date).toLocaleDateString()}</td>
                <td>{student.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Create Booking

```javascript
import { useState } from 'react';
import { bookingService } from '@/services/bookingService';

function BookingForm({ propertyId, roomId }) {
  const [checkInDate, setCheckInDate] = useState('');
  const [months, setMonths] = useState(6);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await bookingService.createBooking({
        property_id: propertyId,
        room_id: roomId,
        check_in_date: checkInDate,
        months: months,
      });

      if (response.success) {
        alert('Booking created successfully!');
        // Redirect or update UI
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        value={checkInDate}
        onChange={(e) => setCheckInDate(e.target.value)}
        required
      />
      <input
        type="number"
        min="1"
        max="12"
        value={months}
        onChange={(e) => setMonths(e.target.value)}
        placeholder="Number of months"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Booking...' : 'Book Now'}
      </button>
    </form>
  );
}
```

---

## 🔒 Protected Routes

```javascript
import { Navigate } from 'react-router-dom';
import { authService } from '@/services/authService';

function ProtectedRoute({ children, allowedRoles }) {
  const user = authService.getStoredUser();

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

// Usage in routes
<Route
  path="/dashboard/owner/*"
  element={
    <ProtectedRoute allowedRoles={['manager']}>
      <OwnerDashboard />
    </ProtectedRoute>
  }
/>
```

---

## 🎨 Environment Variables

Create `.env` in client folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Update `api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

---

## ✅ Integration Checklist

- [ ] Create API client with axios
- [ ] Set up authentication service
- [ ] Create service files for each resource
- [ ] Implement login/signup pages
- [ ] Add protected routes
- [ ] Implement property search
- [ ] Create dashboard pages
- [ ] Add booking functionality
- [ ] Implement user management (admin)
- [ ] Add notification system
- [ ] Handle errors gracefully
- [ ] Add loading states
- [ ] Test all features

---

## 🚀 Ready to Integrate!

Your backend is fully functional and ready to connect with the frontend. Follow the examples above to integrate each feature.

**Happy Coding! 🎉**
