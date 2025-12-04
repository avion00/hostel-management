# 🚀 Quick Start Guide - Hostel Management System

## Overview

This is a complete hostel management system with:
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **Backend**: Node.js + Express + SQLite
- **3 User Roles**: Student, Hostel Manager, Super Admin

---

## 📦 Installation

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

Backend will run on: **http://localhost:5000**

### 2. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the frontend
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

## 👤 Sample Login Credentials

### Super Admin
- **Email**: `admin@hostel.com`
- **Password**: `password123`
- **Access**: Full system control, user management, analytics

### Hostel Managers
- **Email**: `manager1@hostel.com` (or manager2, manager3)
- **Password**: `password123`
- **Access**: Manage properties, view enrolled students, track bookings

### Students
- **Email**: `student1@example.com` (or student2, student3)
- **Password**: `password123`
- **Access**: Browse properties, make bookings, view payments

---

## 🎯 Features by Role

### 🎓 Student Features
- Browse available hostels/properties
- Search by location, pincode, or college name
- Filter by price range and amenities
- View property details with images and reviews
- Make room bookings
- Track booking status
- View payment history
- Receive notifications
- Leave reviews and ratings

### 🏢 Hostel Manager Features
- **Dashboard Overview**:
  - Total properties managed
  - Total students enrolled
  - Total rooms (occupied/available)
  - Revenue tracking
  - Pending booking requests

- **Property Management**:
  - Create new properties
  - Update property details
  - Add/edit room information
  - Upload property images
  - Set pricing and amenities

- **Student Management**:
  - View all enrolled students
  - See room assignments
  - Track check-in dates
  - Manage booking requests

- **Booking Management**:
  - View all bookings
  - Approve/reject booking requests
  - Update booking status
  - Track payment status

### 👑 Super Admin Features
- **Complete System Overview**:
  - Total users (students, managers, admins)
  - All properties across the system
  - System-wide booking statistics
  - Revenue analytics
  - User activity tracking

- **User Management**:
  - View all users
  - Create/edit/delete users
  - Change user roles
  - Activate/deactivate accounts

- **Property Management**:
  - View all properties
  - Manage any property
  - Monitor property performance
  - City-wise distribution

- **Analytics & Reports**:
  - Monthly revenue trends
  - Top performing properties
  - Top managers by revenue
  - Booking statistics
  - Payment status overview

---

## 🔍 Search & Filter Features

Students can search for hostels using:

1. **Location-based**:
   - City name (e.g., "Kathmandu", "Pokhara")
   - Pincode (exact match)

2. **College-based**:
   - Nearby college/university name
   - Distance from college

3. **Price-based**:
   - Minimum price filter
   - Maximum price filter
   - Price range slider

4. **Amenities**:
   - WiFi, AC, Parking
   - Kitchen, Gym, Security
   - Laundry, Swimming Pool

---

## 📊 Database Structure

### SQLite Database
Location: `server/database/hostel_management.db`

**Tables**:
- `users` - All user accounts
- `properties` - Hostel/property listings
- `rooms` - Individual rooms
- `bookings` - Booking records
- `payments` - Payment transactions
- `reviews` - Property reviews
- `notifications` - User notifications

---

## 🛠️ API Endpoints

### Base URL: `http://localhost:5000/api`

**Authentication**:
- `POST /auth/signup` - Register
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user

**Properties**:
- `GET /properties` - List all (with search/filters)
- `GET /properties/:id` - Get single property
- `POST /properties` - Create (Manager/Admin)
- `PUT /properties/:id` - Update (Manager/Admin)
- `DELETE /properties/:id` - Delete (Manager/Admin)

**Bookings**:
- `POST /bookings` - Create booking (Student)
- `GET /bookings/student` - Student's bookings
- `GET /bookings/property/:id` - Property bookings (Manager)
- `PUT /bookings/:id/status` - Update status (Manager)

**Dashboard**:
- `GET /dashboard/user` - Student dashboard
- `GET /dashboard/manager` - Manager dashboard
- `GET /dashboard/admin` - Admin dashboard

**Users** (Admin only):
- `GET /users` - List all users
- `PUT /users/:id/role` - Change user role
- `PUT /users/:id/status` - Activate/deactivate

See `server/API_DOCUMENTATION.md` for complete API docs.

---

## 🎨 Frontend Routes

### Public Routes
- `/` - Home page (landing)
- `/find-hostels` - Search properties
- `/about` - About page
- `/contact` - Contact page
- `/for-partners` - Partner information
- `/login` - Login page
- `/signup` - Registration page

### Student Dashboard
- `/dashboard/user/overview` - Dashboard home
- `/dashboard/user/bookings` - My bookings
- `/dashboard/user/payments` - Payment history
- `/dashboard/user/notifications` - Notifications
- `/dashboard/user/profile` - Profile settings

### Manager Dashboard
- `/dashboard/owner/overview` - Dashboard home
- `/dashboard/owner/properties` - My properties
- `/dashboard/owner/bookings` - All bookings
- `/dashboard/owner/payments` - Payment tracking
- `/dashboard/owner/profile` - Profile settings

### Admin Dashboard
- `/dashboard/admin/overview` - System overview
- `/dashboard/admin/user-management` - Manage users
- `/dashboard/admin/properties` - All properties
- `/dashboard/admin/payments` - All payments
- `/dashboard/admin/analytics` - Analytics & reports
- `/dashboard/admin/system` - System settings
- `/dashboard/admin/settings` - Admin settings

---

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### Frontend
Update API base URL in your axios configuration if needed.

---

## 📝 Common Tasks

### Reset Database
```bash
cd server
rm database/hostel_management.db
npm run seed
```

### Add New Manager
1. Login as admin
2. Go to User Management
3. Create new user with role "manager"
4. Manager can now create properties

### Add New Property
1. Login as manager
2. Go to Properties
3. Click "Add New Property"
4. Fill in details and add rooms

### Make a Booking
1. Login as student
2. Browse properties
3. Select a property
4. Choose available room
5. Submit booking request
6. Wait for manager approval

---

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Ensure all dependencies are installed
- Check .env file exists

### Frontend won't start
- Check if port 5173 is available
- Clear node_modules and reinstall
- Check for Node.js version compatibility

### Database errors
- Delete database file and reseed
- Check file permissions
- Ensure SQLite is properly installed

### Login not working
- Verify credentials match seeded data
- Check JWT_SECRET in .env
- Clear browser cache/cookies

---

## 📚 Documentation

- **Backend README**: `server/README.md`
- **API Documentation**: `server/API_DOCUMENTATION.md`
- **Database Schema**: See `server/src/config/database.js`

---

## 🎯 Next Steps

1. **Customize the frontend** to match your branding
2. **Add more features** like:
   - File upload for property images
   - Payment gateway integration
   - Email notifications
   - SMS alerts
   - Advanced analytics
3. **Deploy to production**:
   - Backend: Heroku, Railway, Render
   - Frontend: Vercel, Netlify
   - Database: Keep SQLite or migrate to PostgreSQL

---

## 💡 Tips

- Use the admin account to explore all features
- Test the search functionality with different filters
- Try creating properties as a manager
- Make test bookings as a student
- Check the dashboard analytics

---

## 🤝 Support

For issues or questions:
1. Check the documentation
2. Review the API documentation
3. Check console logs for errors
4. Verify database seeding completed successfully

---

**Happy Coding! 🚀**
