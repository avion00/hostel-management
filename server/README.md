# Hostel Management System - Backend API

A comprehensive backend API for managing hostel properties, bookings, and user management built with Node.js, Express, and SQLite.

## 🚀 Features

### User Roles
- **Student**: Browse properties, make bookings, manage payments
- **Hostel Manager**: Manage properties, rooms, view bookings and students
- **Super Admin**: Full system access, user management, analytics

### Core Functionality
- ✅ User authentication & authorization (JWT)
- ✅ Property/Hostel management with search & filters
- ✅ Room management with availability tracking
- ✅ Booking system with status management
- ✅ Payment tracking
- ✅ Review & rating system
- ✅ Notification system
- ✅ Dashboard analytics for all user roles
- ✅ Advanced search (location, pincode, college name)

## 📋 Prerequisites

- Node.js (v18.x or higher)
- npm or yarn

## 🛠️ Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5173
   ```

3. **Initialize database and seed data**
   ```bash
   npm run seed
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The server will start at `http://localhost:5000`

## 📚 Interactive API Documentation (Swagger UI)

Access the interactive API documentation at:
```
http://localhost:5000/api-docs
```

**Features:**
- 🎯 Test all API endpoints directly in your browser
- 📝 See request/response examples
- 🔐 Easy authentication with JWT tokens
- 📊 Organized by categories (Auth, Properties, Bookings, etc.)
- ✅ Try different scenarios without writing code

**Quick Test:**
1. Start the server: `npm run dev`
2. Open browser: `http://localhost:5000/api-docs`
3. Login via `/auth/login` endpoint
4. Copy the token and click "Authorize" button
5. Test any protected endpoint!

See `SWAGGER_GUIDE.md` for detailed usage instructions.

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js          # SQLite database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── propertyController.js # Property management
│   │   ├── bookingController.js  # Booking management
│   │   ├── dashboardController.js # Dashboard analytics
│   │   └── userController.js     # User management
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── userRoutes.js
│   └── scripts/
│       └── seedData.js          # Database seeding script
├── database/
│   └── hostel_management.db     # SQLite database (auto-created)
├── app.js                       # Express app configuration
├── package.json
└── README.md
```

## 🗄️ Database Schema

### Tables
- **users** - User accounts (students, managers, admins)
- **properties** - Hostel/property listings
- **rooms** - Individual rooms in properties
- **bookings** - Student booking records
- **payments** - Payment transactions
- **reviews** - Property reviews and ratings
- **notifications** - User notifications

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/signup          # Register new user
POST   /api/auth/login           # Login user
GET    /api/auth/me              # Get current user (Protected)
```

### Properties
```
GET    /api/properties           # Get all properties (with filters)
GET    /api/properties/:id       # Get single property
POST   /api/properties           # Create property (Manager/Admin)
PUT    /api/properties/:id       # Update property (Manager/Admin)
DELETE /api/properties/:id       # Delete property (Manager/Admin)
GET    /api/properties/manager/:managerId  # Get properties by manager
```

**Search & Filter Parameters:**
- `search` - Search in name, description, address
- `city` - Filter by city
- `pincode` - Filter by pincode
- `near_college` - Filter by nearby college
- `min_price` - Minimum price
- `max_price` - Maximum price
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Bookings
```
POST   /api/bookings             # Create booking (Student)
GET    /api/bookings/student     # Get student bookings (Student)
GET    /api/bookings/property/:propertyId  # Get property bookings (Manager/Admin)
GET    /api/bookings/:id         # Get booking details
PUT    /api/bookings/:id/status  # Update booking status (Manager/Admin)
DELETE /api/bookings/:id         # Cancel booking
```

### Dashboard
```
GET    /api/dashboard/user       # Student dashboard (Student)
GET    /api/dashboard/manager    # Manager dashboard (Manager)
GET    /api/dashboard/admin      # Admin dashboard (Admin)
```

### Users
```
GET    /api/users                # Get all users (Admin)
GET    /api/users/:id            # Get user by ID
PUT    /api/users/:id            # Update user
PUT    /api/users/:id/role       # Update user role (Admin)
PUT    /api/users/:id/status     # Toggle user status (Admin)
DELETE /api/users/:id            # Delete user (Admin)
GET    /api/users/notifications  # Get user notifications
PUT    /api/users/notifications/:id/read  # Mark notification as read
PUT    /api/users/notifications/read-all  # Mark all as read
```

## 👥 Sample Credentials

After running `npm run seed`, you can use these credentials:

### Admin
- Email: `admin@hostel.com`
- Password: `password123`

### Managers
- Email: `manager1@hostel.com` / Password: `password123`
- Email: `manager2@hostel.com` / Password: `password123`
- Email: `manager3@hostel.com` / Password: `password123`

### Students
- Email: `student1@example.com` / Password: `password123`
- Email: `student2@example.com` / Password: `password123`
- Email: `student3@example.com` / Password: `password123`

## 📊 Manager Dashboard Features

Hostel managers can:
- View total properties and rooms
- See total enrolled students
- Track room assignments
- View booking requests
- Monitor revenue
- Manage property details

## 🔧 Admin Dashboard Features

Super admins can:
- View all system statistics
- Manage all users (students, managers)
- View all properties and bookings
- Access analytics and reports
- Monitor payments
- Manage system settings

## 🔍 Search Functionality

Students can search for hostels by:
- **Location** - City name
- **Pincode** - Exact pincode match
- **College Name** - Nearby college/university
- **Price Range** - Min and max price filters
- **Amenities** - Filter by available facilities

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control (RBAC)
- Protected routes with middleware
- SQL injection prevention (prepared statements)

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

## 🧪 Testing the API

### Option 1: Swagger UI (Recommended) ⭐
The easiest way to test the API:
```
http://localhost:5000/api-docs
```
- Interactive interface
- No setup required
- Built-in authentication
- See all endpoints organized by category

### Option 2: cURL
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@example.com","password":"password123"}'

# Get properties
curl http://localhost:5000/api/properties?city=Kathmandu
```

### Option 3: Other Tools
- **Postman** - Import the endpoints
- **Thunder Client** (VS Code extension)
- **Insomnia** - API client

## 🚀 Deployment

1. Set `NODE_ENV=production` in your environment
2. Update `JWT_SECRET` to a secure random string
3. Configure `CLIENT_URL` to your frontend URL
4. Deploy to your preferred hosting service (Heroku, Railway, Render, etc.)

## 📦 Dependencies

- **express** - Web framework
- **better-sqlite3** - SQLite database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **nodemon** - Development auto-reload
- **swagger-jsdoc** - Swagger documentation generator
- **swagger-ui-express** - Swagger UI interface

## 📚 Documentation

- **Swagger UI**: `http://localhost:5000/api-docs` (Interactive API docs)
- **Swagger Guide**: `SWAGGER_GUIDE.md` (How to use Swagger UI)
- **API Documentation**: `API_DOCUMENTATION.md` (Complete API reference)
- **Backend README**: `README.md` (This file)
- **Database Schema**: See `src/config/database.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

ISC

## 🐛 Troubleshooting

### Database Issues
If you encounter database errors, delete the database file and reseed:
```bash
rm database/hostel_management.db
npm run seed
```

### Port Already in Use
Change the PORT in `.env` file to a different port number.

### Module Not Found
Ensure all dependencies are installed:
```bash
npm install
```

## 📞 Support

For issues and questions, please open an issue in the repository.

---

Built with ❤️ for Hostel Management
