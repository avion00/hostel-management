# API Documentation - Hostel Management System

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "student"  // student, manager, admin
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
```http
GET /auth/me
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "student",
    "created_at": "2024-12-01T10:00:00.000Z"
  }
}
```

---

## 🏠 Property Endpoints

### Get All Properties (Public)
```http
GET /properties
```

**Query Parameters:**
- `search` - Search term (name, description, address)
- `city` - Filter by city
- `pincode` - Filter by pincode
- `near_college` - Filter by nearby college
- `min_price` - Minimum price per month
- `max_price` - Maximum price per month
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example:**
```http
GET /properties?city=Kathmandu&min_price=5000&max_price=10000&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "manager_id": 2,
      "name": "Green Valley Student Hostel",
      "description": "Modern hostel with excellent facilities...",
      "address": "Chowk Road, Near DU",
      "city": "Dharan",
      "state": "Province 1",
      "pincode": "56700",
      "near_college": "Dharan University",
      "total_rooms": 15,
      "available_rooms": 14,
      "amenities": ["WiFi", "AC", "Parking", "Kitchen"],
      "images": ["https://..."],
      "price_per_month": 8500,
      "manager_name": "John Manager",
      "review_count": 5,
      "average_rating": 4.8
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Get Property by ID
```http
GET /properties/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Green Valley Student Hostel",
    "description": "...",
    "address": "...",
    "city": "Dharan",
    "amenities": ["WiFi", "AC"],
    "images": ["..."],
    "rooms": [
      {
        "id": 1,
        "room_number": "101",
        "room_type": "single",
        "capacity": 1,
        "occupied": 0,
        "is_available": 1,
        "price_per_month": 8500
      }
    ],
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "comment": "Excellent hostel!",
        "student_name": "Alice Student",
        "created_at": "2024-12-01T10:00:00.000Z"
      }
    ]
  }
}
```

### Create Property (Manager/Admin)
```http
POST /properties
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "New Hostel",
  "description": "Great place for students",
  "address": "123 Main Street",
  "city": "Kathmandu",
  "state": "Bagmati",
  "pincode": "44600",
  "latitude": 27.7172,
  "longitude": 85.3240,
  "near_college": "Tribhuvan University",
  "total_rooms": 20,
  "amenities": ["WiFi", "Kitchen", "Security"],
  "images": ["https://..."],
  "price_per_month": 7000
}
```

### Update Property (Manager/Admin)
```http
PUT /properties/:id
```
**Headers:** `Authorization: Bearer <token>`

### Delete Property (Manager/Admin)
```http
DELETE /properties/:id
```
**Headers:** `Authorization: Bearer <token>`

### Get Properties by Manager
```http
GET /properties/manager/:managerId
```
**Headers:** `Authorization: Bearer <token>`

---

## 📅 Booking Endpoints

### Create Booking (Student)
```http
POST /bookings
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "property_id": 1,
  "room_id": 5,
  "check_in_date": "2024-12-15",
  "months": 6
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "student_id": 5,
    "property_id": 1,
    "room_id": 5,
    "check_in_date": "2024-12-15",
    "status": "pending",
    "total_amount": 51000,
    "property_name": "Green Valley Student Hostel",
    "room_number": "105"
  }
}
```

### Get Student Bookings
```http
GET /bookings/student
```
**Headers:** `Authorization: Bearer <token>`

### Get Property Bookings (Manager/Admin)
```http
GET /bookings/property/:propertyId
```
**Headers:** `Authorization: Bearer <token>`

### Get Booking by ID
```http
GET /bookings/:id
```
**Headers:** `Authorization: Bearer <token>`

### Update Booking Status (Manager/Admin)
```http
PUT /bookings/:id/status
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "confirmed"  // pending, confirmed, active, completed, cancelled
}
```

### Cancel Booking
```http
DELETE /bookings/:id
```
**Headers:** `Authorization: Bearer <token>`

---

## 📊 Dashboard Endpoints

### Student Dashboard
```http
GET /dashboard/user
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Student

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "active_bookings": 1,
      "total_bookings": 3,
      "total_paid": 25500,
      "pending_payments": 8500,
      "unread_notifications": 2
    },
    "currentBooking": {
      "id": 1,
      "property_name": "Green Valley Student Hostel",
      "room_number": "101",
      "check_in_date": "2024-12-01",
      "status": "active"
    },
    "bookingHistory": [...],
    "recentPayments": [...]
  }
}
```

### Manager Dashboard
```http
GET /dashboard/manager
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Manager

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_properties": 3,
      "total_students": 15,
      "total_rooms": 50,
      "occupied_rooms": 35,
      "available_rooms": 15,
      "total_revenue": 255000,
      "pending_bookings": 5
    },
    "recentBookings": [...],
    "properties": [...],
    "students": [
      {
        "id": 5,
        "name": "Alice Student",
        "email": "alice@example.com",
        "property_name": "Green Valley Student Hostel",
        "room_number": "101",
        "check_in_date": "2024-12-01",
        "status": "active"
      }
    ],
    "monthlyRevenue": [...]
  }
}
```

### Admin Dashboard
```http
GET /dashboard/admin
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "users": [
        { "role": "student", "count": 50, "active_count": 48 },
        { "role": "manager", "count": 10, "active_count": 10 },
        { "role": "admin", "count": 2, "active_count": 2 }
      ],
      "properties": {
        "total": 25,
        "active": 23
      },
      "bookings": [
        { "status": "active", "count": 35 },
        { "status": "pending", "count": 10 }
      ],
      "revenue": {
        "total": 850000,
        "pending": 125000
      },
      "rooms": {
        "total": 500,
        "occupied": 350,
        "available": 150
      }
    },
    "recentActivities": {
      "bookings": [...],
      "users": [...],
      "properties": [...]
    },
    "analytics": {
      "monthlyStats": [...],
      "topProperties": [...],
      "topManagers": [...],
      "paymentStats": [...],
      "cityDistribution": [...]
    }
  }
}
```

---

## 👥 User Management Endpoints

### Get All Users (Admin)
```http
GET /users?role=student&search=john&page=1&limit=20
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Admin

### Get User by ID
```http
GET /users/:id
```
**Headers:** `Authorization: Bearer <token>`

### Update User
```http
PUT /users/:id
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "9876543210",
  "avatar": "https://..."
}
```

### Update User Role (Admin)
```http
PUT /users/:id/role
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Admin

**Request Body:**
```json
{
  "role": "manager"  // student, manager, admin
}
```

### Toggle User Status (Admin)
```http
PUT /users/:id/status
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Admin

**Request Body:**
```json
{
  "is_active": 0  // 0 or 1
}
```

### Delete User (Admin)
```http
DELETE /users/:id
```
**Headers:** `Authorization: Bearer <token>`
**Role:** Admin

---

## 🔔 Notification Endpoints

### Get User Notifications
```http
GET /users/notifications?unread_only=true&limit=20
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Booking Confirmed",
      "message": "Your booking has been confirmed",
      "type": "booking",
      "is_read": 0,
      "created_at": "2024-12-01T10:00:00.000Z"
    }
  ]
}
```

### Mark Notification as Read
```http
PUT /users/notifications/:id/read
```
**Headers:** `Authorization: Bearer <token>`

### Mark All Notifications as Read
```http
PUT /users/notifications/read-all
```
**Headers:** `Authorization: Bearer <token>`

---

## 🔍 Search Examples

### Search by City
```http
GET /properties?city=Kathmandu
```

### Search by Pincode
```http
GET /properties?pincode=44600
```

### Search by College
```http
GET /properties?near_college=Tribhuvan University
```

### Search by Price Range
```http
GET /properties?min_price=5000&max_price=10000
```

### Combined Search
```http
GET /properties?city=Kathmandu&near_college=Tribhuvan&min_price=5000&max_price=15000&page=1&limit=10
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role student is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Property not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error message"
}
```

---

## 📝 Notes

1. All timestamps are in ISO 8601 format
2. Pagination is available on list endpoints
3. JSON fields (amenities, images) are automatically parsed
4. Foreign key constraints are enforced
5. Soft delete is not implemented - deletions are permanent
6. File uploads are not implemented - use image URLs

---

## 🧪 Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@example.com","password":"password123"}'
```

### Get Properties
```bash
curl http://localhost:5000/api/properties?city=Kathmandu
```

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "property_id": 1,
    "room_id": 5,
    "check_in_date": "2024-12-15",
    "months": 6
  }'
```

---

**Last Updated:** December 2024
