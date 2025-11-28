# 🏠 Hostel Management System

A full-stack hostel booking and management platform for students. Built with React, Express.js, and MongoDB.

## 🚀 Features

### For Students
- 🔍 Search hostels by location, price, and amenities
- 🏠 View detailed hostel information with images
- ⭐ Read reviews and ratings
- 📱 Responsive design for mobile and desktop
- 🔐 Secure authentication

### For Partners (Hostel Owners)
- ➕ Add and manage hostel listings
- 📊 Track bookings and availability
- 💰 Manage room types and pricing
- 📸 Upload hostel images

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router 6** - Routing
- **TailwindCSS 4** - Styling
- **shadcn/ui** - UI components
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Validation

### Backend
- **Node.js** - Runtime
- **Express.js 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher)
- **npm** or **yarn**

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/avion00/hostel-management.git
cd hostel-management
```

### 2. Install MongoDB

#### On Windows (WSL):
```bash
# Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update packages
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installation
mongosh --version
```

### 3. Setup Backend

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your configuration
# MONGODB_URI=mongodb://localhost:27017/hostel-management
# JWT_SECRET=your-secret-key
# PORT=5000

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

The backend server will run on `http://localhost:5000`

### 4. Setup Frontend

```bash
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "college": "Dharan University"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Hostel Endpoints

#### Get All Hostels
```http
GET /api/hostels?city=Dharan&minPrice=3000&maxPrice=10000&roomType=Single Room
```

#### Get Single Hostel
```http
GET /api/hostels/:id
```

#### Create Hostel (Partner only)
```http
POST /api/hostels
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Hostel",
  "description": "Great hostel",
  "location": {
    "address": "Main Road",
    "city": "Dharan",
    "state": "Province 1",
    "pincode": "56700"
  },
  "roomTypes": [
    {
      "type": "Single Room",
      "price": 8000,
      "available": 5,
      "features": ["WiFi", "AC"]
    }
  ],
  "amenities": ["WiFi", "Parking"]
}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['student', 'partner', 'admin'],
  college: String,
  verified: Boolean,
  bookings: [ObjectId],
  favorites: [ObjectId]
}
```

### Hostel Model
```javascript
{
  name: String,
  description: String,
  owner: ObjectId (User),
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: { lat, lng }
  },
  roomTypes: [{
    type: String,
    price: Number,
    available: Number,
    features: [String]
  }],
  amenities: [String],
  rating: { average, count },
  verified: Boolean,
  status: ['active', 'inactive', 'pending']
}
```

## 🔐 Sample Credentials

After running `npm run seed`, use these credentials:

**Partner Account:**
- Email: `partner@example.com`
- Password: `password123`

**Student Account:**
- Email: `student@example.com`
- Password: `password123`

## 📁 Project Structure

```
hostel-management/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   └── package.json
│
├── server/                # Backend Express app
│   ├── src/
│   │   ├── models/       # Mongoose models
│   │   ├── controllers/  # Route controllers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   ├── config/       # Configuration
│   │   └── scripts/      # Utility scripts
│   ├── app.js
│   └── package.json
│
└── README.md
```

## 🚀 Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Add environment variables
4. Deploy

### Frontend (Netlify/Vercel)
1. Build the app: `npm run build`
2. Deploy the `dist` folder
3. Add environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Bikram (avion00)**
- GitHub: [@avion00](https://github.com/avion00)

## 🙏 Acknowledgments

- shadcn/ui for beautiful components
- Lucide React for icons
- MongoDB for database
- Express.js community

---

Made with ❤️ for students
