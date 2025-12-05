# 🎨 Frontend Integration Guide

## ✅ **YOUR API IS 100% READY!**

Your backend is fully prepared to integrate with your Super Admin frontend dashboard!

---

## 📊 **API ENDPOINTS FOR YOUR DASHBOARD**

### **1. Dashboard Statistics** 📈

**Endpoint:**
```
GET /api/admin/analytics/overview
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalBookings": 150,
      "totalRevenue": 2500000,
      "totalStudents": 500,
      "totalOwners": 50,
      "totalHostels": 777,
      "approvedHostels": 720,
      "pendingHostels": 45,
      "rejectedHostels": 12,
      "monthlyRevenue": 420000,
      "monthlyCommission": 42000
    },
    "topLocations": [...],
    "mostSearchedCities": [...],
    "monthlyRevenueHistory": [...],
    "recentBookings": [...]
  }
}
```

**Frontend Mapping:**
```javascript
const { overview } = data.data;

// Map to your UI cards
setDashboardStats({
  approvedProperties: overview.approvedHostels,    // 720
  pendingApproval: overview.pendingHostels,        // 45
  rejectedProperties: overview.rejectedHostels,    // 12
  monthlyCommission: overview.monthlyCommission    // Rs.4.2L
});
```

---

### **2. Property List** 🏢

**Endpoint:**
```
GET /api/admin/hostels?status=approved&page=1&limit=10
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hostels": [
      {
        "id": "a3f2c8d1-4b5e-4f9a-8c7d-1e2f3a4b5c6d",
        "name": "Green Valley Student Hostel",
        "address": "Sector 15, Noida",
        "city": "Noida",
        "manager_name": "Rajesh Kumar",
        "status": "approved",
        "total_rooms": 50,
        "total_beds": 47,
        "available_beds": 3,
        "occupancy_percent": 94,
        "average_rating": 4.8,
        "review_count": 25,
        "monthly_revenue": 235000,
        "commission": 23500,
        "amenities": ["WiFi", "AC", "Parking"],
        "images": ["url1.jpg", "url2.jpg"]
      }
    ],
    "pagination": {
      "total": 720,
      "page": 1,
      "limit": 10,
      "pages": 72
    }
  }
}
```

**Frontend Mapping:**
```javascript
const properties = data.data.hostels.map(hostel => ({
  id: hostel.id,
  name: hostel.name,
  location: `${hostel.address}, ${hostel.city}`,
  owner: hostel.manager_name,
  rating: hostel.average_rating,
  occupancy: `${hostel.occupancy_percent}%`,
  rooms: `${hostel.total_rooms - hostel.available_rooms}/${hostel.total_rooms}`,
  monthlyRevenue: `Rs.${hostel.monthly_revenue.toLocaleString()}`,
  commission: `Rs.${hostel.commission.toLocaleString()}`,
  status: hostel.status,
  verified: hostel.status === 'approved'
}));
```

---

### **3. Get Single Property** 🔍

**Endpoint:**
```
GET /api/admin/hostels/:id
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hostel": {
      "id": "a3f2c8d1-4b5e-4f9a-8c7d-1e2f3a4b5c6d",
      "name": "Green Valley Student Hostel",
      "description": "Best hostel in town",
      "address": "Sector 15, Noida",
      "city": "Noida",
      "state": "UP",
      "pincode": "201301",
      "near_college": "Tribhuvan University",
      "established_year": 2023,
      "rating": 4.8,
      "total_rooms": 50,
      "available_rooms": 3,
      "total_beds": 47,
      "available_beds": 3,
      "staff_count": 10,
      "price_starting": 8500,
      "amenities": ["WiFi", "AC", "Parking"],
      "images": ["url1.jpg"],
      "rules": ["No smoking", "No pets"],
      "status": "approved",
      "manager_name": "Rajesh Kumar",
      "manager_email": "rajesh@example.com"
    },
    "roomTypes": [...],
    "bookingStats": {...}
  }
}
```

---

### **4. Approve Property** ✅

**Endpoint:**
```
PATCH /api/admin/hostels/:id/approve
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Hostel approved successfully"
}
```

**Frontend Code:**
```javascript
const approveProperty = async (propertyId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/admin/hostels/${propertyId}/approve`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    
    if (data.success) {
      toast.success('Property approved successfully!');
      fetchProperties(); // Refresh list
    }
  } catch (error) {
    toast.error('Failed to approve property');
  }
};
```

---

### **5. Reject Property** ❌

**Endpoint:**
```
PATCH /api/admin/hostels/:id/reject
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "reason": "Incomplete documentation"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Hostel rejected successfully",
  "reason": "Incomplete documentation"
}
```

**Frontend Code:**
```javascript
const rejectProperty = async (propertyId, reason) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/admin/hostels/${propertyId}/reject`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      }
    );
    
    const data = await response.json();
    
    if (data.success) {
      toast.success('Property rejected!');
      fetchProperties();
    }
  } catch (error) {
    toast.error('Failed to reject property');
  }
};
```

---

### **6. Update Property** ✏️

**Endpoint:**
```
PATCH /api/admin/hostels/:id
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Updated Name",
  "price_starting": 9000,
  "status": "approved"
}
```

---

### **7. Delete Property** 🗑️

**Endpoint:**
```
DELETE /api/admin/hostels/:id
Authorization: Bearer YOUR_TOKEN
```

---

## 🎯 **COMPLETE FRONTEND INTEGRATION EXAMPLE**

### **Dashboard Component**

```javascript
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem('accessToken');

  // Fetch dashboard statistics
  useEffect(() => {
    fetchDashboardStats();
    fetchProperties();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/admin/analytics/overview',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        const { overview } = data.data;
        setStats({
          approvedProperties: overview.approvedHostels,
          pendingApproval: overview.pendingHostels,
          rejectedProperties: overview.rejectedHostels,
          monthlyCommission: overview.monthlyCommission
        });
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
    }
  };

  const fetchProperties = async (status = 'approved') => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/admin/hostels?status=${status}&page=1&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setProperties(data.data.hostels);
      }
    } catch (error) {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const approveProperty = async (propertyId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/hostels/${propertyId}/approve`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Property approved successfully!');
        fetchProperties();
        fetchDashboardStats(); // Update stats
      }
    } catch (error) {
      toast.error('Failed to approve property');
    }
  };

  const rejectProperty = async (propertyId, reason) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/hostels/${propertyId}/reject`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reason })
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Property rejected!');
        fetchProperties();
        fetchDashboardStats();
      }
    } catch (error) {
      toast.error('Failed to reject property');
    }
  };

  return (
    <div className="dashboard">
      {/* Statistics Cards */}
      <div className="stats-grid">
        <StatCard 
          title="Approved Properties" 
          value={stats.approvedProperties} 
          icon="✅"
        />
        <StatCard 
          title="Pending Approval" 
          value={stats.pendingApproval} 
          icon="⏳"
        />
        <StatCard 
          title="Rejected Properties" 
          value={stats.rejectedProperties} 
          icon="❌"
        />
        <StatCard 
          title="Monthly Commission" 
          value={`Rs.${(stats.monthlyCommission / 100000).toFixed(2)}L`} 
          icon="💰"
        />
      </div>

      {/* Property List */}
      <div className="property-list">
        <h2>Property Management</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          properties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onApprove={() => approveProperty(property.id)}
              onReject={(reason) => rejectProperty(property.id, reason)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
```

---

## 📋 **API RESPONSE FIELDS MAPPING**

| Frontend Field | API Response Field | Notes |
|----------------|-------------------|-------|
| Property Name | `name` | Direct mapping |
| Location | `address`, `city` | Combine both |
| Owner | `manager_name` | From JOIN |
| Rating | `average_rating` | Calculated from reviews |
| Occupancy | `occupancy_percent` | Calculated: `(total_beds - available_beds) / total_beds * 100` |
| Rooms | `total_rooms`, `available_rooms` | Show as "47/50" |
| Monthly Revenue | `monthly_revenue` | Calculated from payments |
| Commission | `commission` | 10% of monthly_revenue |
| Status | `status` | approved/pending/rejected |
| Verified Badge | `status === 'approved'` | Boolean check |

---

## ✅ **CHECKLIST**

- [x] Dashboard statistics API
- [x] Property list with filters
- [x] Property details
- [x] Approve property
- [x] Reject property
- [x] Update property
- [x] Delete property
- [x] Revenue calculation
- [x] Commission calculation
- [x] Occupancy calculation
- [x] Rating calculation
- [x] Pagination support
- [x] UUID support

---

## 🚀 **YOUR API IS READY!**

**All endpoints are working and ready to integrate with your frontend!**

Just:
1. ✅ Use the token from login
2. ✅ Call the endpoints as shown above
3. ✅ Map the response fields to your UI
4. ✅ Handle success/error states

**Start integrating now!** 🎉
