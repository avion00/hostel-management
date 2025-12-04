# 📚 Swagger UI Guide - Hostel Management API

## 🎯 Access Swagger UI

Once your server is running, access the interactive API documentation at:

```
http://localhost:5000/api-docs
```

## 🚀 Quick Start

### 1. Start the Server

```bash
cd server
npm run dev
```

### 2. Open Swagger UI

Open your browser and navigate to:
```
http://localhost:5000/api-docs
```

## 🔐 Testing Protected Endpoints

Many endpoints require authentication. Here's how to test them:

### Step 1: Login to Get Token

1. In Swagger UI, find the **Authentication** section
2. Click on `POST /auth/login`
3. Click **"Try it out"**
4. Enter credentials:
   ```json
   {
     "email": "student1@example.com",
     "password": "password123"
   }
   ```
5. Click **"Execute"**
6. Copy the `token` from the response

### Step 2: Authorize Swagger

1. Click the **"Authorize"** button at the top of the page (🔓 icon)
2. In the popup, enter: `Bearer YOUR_TOKEN_HERE`
   - Example: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Click **"Authorize"**
4. Click **"Close"**

Now all protected endpoints will include your token automatically!

## 📋 Sample Test Workflows

### Workflow 1: Student Searching for Hostels

1. **Get all properties** (no auth required)
   - Endpoint: `GET /properties`
   - Try filters:
     - `city`: Kathmandu
     - `min_price`: 5000
     - `max_price`: 10000

2. **Get property details**
   - Endpoint: `GET /properties/{id}`
   - Use `id: 1` to see property with rooms

3. **Login as student**
   - Endpoint: `POST /auth/login`
   - Email: `student1@example.com`
   - Password: `password123`

4. **Create a booking**
   - Endpoint: `POST /bookings`
   - Body:
     ```json
     {
       "property_id": 1,
       "room_id": 5,
       "check_in_date": "2024-12-20",
       "months": 6
     }
     ```

5. **View your bookings**
   - Endpoint: `GET /bookings/student`

### Workflow 2: Manager Managing Properties

1. **Login as manager**
   - Endpoint: `POST /auth/login`
   - Email: `manager1@hostel.com`
   - Password: `password123`
   - Copy the token and authorize

2. **View manager dashboard**
   - Endpoint: `GET /dashboard/manager`
   - See enrolled students and room assignments

3. **Get your properties**
   - Endpoint: `GET /properties/manager/{managerId}`
   - Use your manager ID from login response

4. **View property bookings**
   - Endpoint: `GET /bookings/property/{propertyId}`
   - Use a property ID from your properties

5. **Update booking status**
   - Endpoint: `PUT /bookings/{id}/status`
   - Body:
     ```json
     {
       "status": "confirmed"
     }
     ```

### Workflow 3: Admin Managing System

1. **Login as admin**
   - Endpoint: `POST /auth/login`
   - Email: `admin@hostel.com`
   - Password: `password123`
   - Authorize with the token

2. **View admin dashboard**
   - Endpoint: `GET /dashboard/admin`
   - See complete system statistics

3. **Get all users**
   - Endpoint: `GET /users`
   - Filter by role: `student`, `manager`, or `admin`

4. **View all properties**
   - Endpoint: `GET /properties`

## 🎨 Swagger UI Features

### Try It Out
- Click **"Try it out"** on any endpoint
- Fill in parameters or request body
- Click **"Execute"** to send the request
- View the response below

### Request Body Examples
- Swagger shows example request bodies
- You can edit them directly
- Click the example to populate the editor

### Response Schemas
- See the structure of responses
- Understand what data you'll receive
- Check status codes and their meanings

### Filter & Search
- Use the search box to find specific endpoints
- Filter by tags (Authentication, Properties, etc.)

## 📝 Available Sample Credentials

### Admin
```
Email: admin@hostel.com
Password: password123
```

### Managers
```
Email: manager1@hostel.com
Password: password123

Email: manager2@hostel.com
Password: password123

Email: manager3@hostel.com
Password: password123
```

### Students
```
Email: student1@example.com
Password: password123

Email: student2@example.com
Password: password123

Email: student3@example.com
Password: password123
```

## 🔍 Testing Search Functionality

### Search by City
```
GET /properties?city=Kathmandu
```

### Search by Pincode
```
GET /properties?pincode=44600
```

### Search by College
```
GET /properties?near_college=Tribhuvan University
```

### Combined Search
```
GET /properties?city=Kathmandu&min_price=5000&max_price=15000&page=1&limit=10
```

## 📊 API Sections in Swagger

### 1. Authentication
- Signup
- Login
- Get current user

### 2. Properties
- List all properties (with filters)
- Get property details
- Create property (Manager/Admin)
- Update property (Manager/Admin)
- Delete property (Manager/Admin)
- Get properties by manager

### 3. Bookings
- Create booking (Student)
- Get student bookings
- Get property bookings (Manager/Admin)
- Get booking details
- Update booking status (Manager/Admin)
- Cancel booking

### 4. Dashboard
- Student dashboard
- Manager dashboard (with enrolled students)
- Admin dashboard (system-wide stats)

### 5. Users (Admin Only)
- List all users
- Get user details
- Update user
- Change user role
- Toggle user status
- Delete user

### 6. Notifications
- Get notifications
- Mark as read
- Mark all as read

## 💡 Tips

1. **Always authorize first** for protected endpoints
2. **Use the examples** provided in the request bodies
3. **Check response codes** to understand what happened
4. **Copy IDs** from responses to use in other requests
5. **Test error cases** by providing invalid data

## 🐛 Troubleshooting

### "Not authorized" Error
- Make sure you've clicked "Authorize" and entered your token
- Token format: `Bearer YOUR_TOKEN`
- Get a new token by logging in again

### "Validation Error"
- Check required fields in the request body
- Ensure data types match (numbers, strings, etc.)
- Look at the example request body

### "Not Found" Error
- Verify the ID exists in the database
- Check if you're using the correct ID from previous responses

## 📖 Additional Resources

- **API Documentation**: `server/API_DOCUMENTATION.md`
- **Backend README**: `server/README.md`
- **Quick Start Guide**: `QUICK_START.md`

## 🎉 Happy Testing!

Swagger UI makes it easy to:
- ✅ Test all API endpoints
- ✅ See request/response formats
- ✅ Understand authentication
- ✅ Try different scenarios
- ✅ Debug issues quickly

---

**Swagger UI URL**: http://localhost:5000/api-docs
