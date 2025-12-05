# 🧪 API Testing Guide

## ⚠️ IMPORTANT: Use the Correct Endpoints!

### **For Super Admin Property Management Page:**

Use: `/api/admin/hostels` ✅  
**NOT:** `/api/properties` ❌

---

## 📍 **Correct API Endpoints**

### **1. Get Dashboard Statistics**
```bash
GET http://localhost:5000/api/admin/analytics/overview
Authorization: Bearer {your_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalBookings": 0,
      "totalRevenue": 0,
      "totalStudents": 1,
      "totalOwners": 3,
      "totalHostels": 6,
      "approvedHostels": 0,
      "pendingHostels": 6,
      "rejectedHostels": 0,
      "monthlyRevenue": 0,
      "monthlyCommission": 0
    },
    "topLocations": [...],
    "mostSearchedCities": [...],
    "monthlyRevenueHistory": [...],
    "recentBookings": [...]
  }
}
```

---

### **2. Get Properties List (Admin)**
```bash
GET http://localhost:5000/api/admin/hostels?status=pending&page=1&limit=10
Authorization: Bearer {your_token}
```

**Query Parameters:**
- `status` - Filter by status (approved/pending/rejected)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in name, city, address

**Response:**
```json
{
  "success": true,
  "data": {
    "hostels": [
      {
        "id": "uuid",
        "manager_id": "uuid",
        "name": "AVION Valley Student Hostel",
        "description": "avi hostel with excellent facilities",
        "address": "Chowk Road, Near DU",
        "city": "Dharan",
        "state": "Province 1",
        "pincode": "56700",
        "latitude": 26.8124,
        "longitude": 87.2847,
        "near_college": "Dharan University",
        "total_rooms": 15,
        "available_rooms": 15,
        "total_beds": 0,
        "available_beds": 0,
        "price_starting": 8500,
        "amenities": ["WiFi", "AC", "Parking"],
        "images": ["https://hello.com"],
        "rules": [],
        "status": "pending",
        "is_active": 1,
        "created_at": "2025-12-04 15:19:57",
        "updated_at": "2025-12-04 15:19:57",
        "manager_name": "Super Admin",
        "manager_phone": "9876543210",
        "manager_email": "admin@hostel.com",
        "monthly_revenue": 0,
        "commission": 0,
        "occupancy_percent": 0,
        "average_rating": 0,
        "review_count": 0
      }
    ],
    "pagination": {
      "total": 6,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

**✅ Notice the difference:**
- `data.hostels` (nested) - Admin endpoint
- `data` (direct array) - Public endpoint

---

### **3. Approve Property**
```bash
PATCH http://localhost:5000/api/admin/hostels/{property_id}/approve
Authorization: Bearer {your_token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Property approved successfully",
  "data": {
    "id": "uuid",
    "status": "approved",
    ...
  }
}
```

---

### **4. Reject Property**
```bash
PATCH http://localhost:5000/api/admin/hostels/{property_id}/reject
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "reason": "Does not meet quality standards"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property rejected successfully",
  "data": {
    "id": "uuid",
    "status": "rejected",
    ...
  }
}
```

---

### **5. Delete Property**
```bash
DELETE http://localhost:5000/api/admin/hostels/{property_id}
Authorization: Bearer {your_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

---

## 🔑 **How to Get Your Token**

### **Method 1: From Browser Console**
1. Login to your app
2. Open browser console (F12)
3. Type:
```javascript
JSON.parse(localStorage.getItem('persist:root')).auth
```
4. Copy the `accessToken` value

### **Method 2: From Login API Response**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@hostel.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Super Admin",
    "email": "admin@hostel.com",
    "role": "admin",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "..."
  }
}
```

Copy the `accessToken` and use it in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 **Endpoint Comparison**

| Feature | `/api/properties` | `/api/admin/hostels` |
|---------|-------------------|----------------------|
| **Purpose** | Public property listing | Admin management |
| **Auth Required** | No | Yes (Admin only) |
| **Response Structure** | `data: [...]` | `data: { hostels: [...] }` |
| **Calculated Fields** | ❌ No | ✅ Yes |
| **Monthly Revenue** | ❌ | ✅ |
| **Commission** | ❌ | ✅ |
| **Occupancy %** | ❌ | ✅ |
| **Average Rating** | ❌ | ✅ |
| **Manager Info** | ❌ | ✅ |
| **Status Filter** | ❌ | ✅ |

---

## 🧪 **Testing with cURL**

### **Get Admin Hostels:**
```bash
curl -X GET "http://localhost:5000/api/admin/hostels?status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### **Approve Property:**
```bash
curl -X PATCH "http://localhost:5000/api/admin/hostels/PROPERTY_ID/approve" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### **Reject Property:**
```bash
curl -X PATCH "http://localhost:5000/api/admin/hostels/PROPERTY_ID/reject" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Does not meet standards"}'
```

---

## ✅ **Frontend Integration**

Your frontend is already correctly configured to use:
```javascript
// Dashboard Stats
GET /api/admin/analytics/overview

// Property List
GET /api/admin/hostels?status=${statusFilter}&page=${page}&limit=${limit}

// Approve
PATCH /api/admin/hostels/${id}/approve

// Reject
PATCH /api/admin/hostels/${id}/reject

// Delete
DELETE /api/admin/hostels/${id}
```

---

## 🎯 **Quick Test Checklist**

- [ ] Login as admin (`admin@hostel.com` / `password123`)
- [ ] Get token from response
- [ ] Test `/api/admin/analytics/overview`
- [ ] Test `/api/admin/hostels?status=pending`
- [ ] Verify response has `data.hostels` (not just `data`)
- [ ] Verify calculated fields exist (monthly_revenue, commission, etc.)
- [ ] Test approve endpoint
- [ ] Test reject endpoint
- [ ] Test delete endpoint

---

## 🚀 **Your Frontend is Ready!**

Just navigate to:
```
http://localhost:5173/dashboard/admin/properties
```

Everything will work automatically! ✅

---

**Last Updated:** December 4, 2025
