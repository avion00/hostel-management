import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.js';
import db from './src/config/database-uuid.js';
import authRoutes from './src/routes/authRoutes.js';
import propertyRoutes from './src/routes/propertyRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import userManagementRoutes from './src/routes/userManagementRoutes.js';
import { apiLimiter } from './src/middleware/rateLimiter.js';

dotenv.config();

// Database is initialized automatically on import

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Content-Length']
}));
app.use(cookieParser()); // Parse cookies
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Serve static files (uploaded images) with proper headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static('uploads'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Hostel Management API',
}));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hostel Management API Server',
    version: '1.0.0',
    documentation: 'http://localhost:' + (process.env.PORT || 5000) + '/api-docs',
    endpoints: {
      auth: '/api/auth',
      properties: '/api/properties',
      bookings: '/api/bookings',
      dashboard: '/api/dashboard',
      users: '/api/users',
      admin: '/api/admin',
      health: '/api/health'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
// Register more specific route first
app.use('/api/admin/users', userManagementRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: err.message || 'Something went wrong!' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/`);
});
