import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hostel Management System API',
      version: '1.0.0',
      description: 'Complete API documentation for the Hostel Management System with SQLite database',
      contact: {
        name: 'API Support',
        email: 'support@hostelmanagement.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            phone: { type: 'string', example: '9876543210' },
            role: { type: 'string', enum: ['student', 'manager', 'admin'], example: 'student' },
            avatar: { type: 'string', nullable: true },
            is_active: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Property: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            manager_id: { type: 'integer', example: 2 },
            name: { type: 'string', example: 'Green Valley Student Hostel' },
            description: { type: 'string', example: 'Modern hostel with excellent facilities' },
            address: { type: 'string', example: 'Chowk Road, Near DU' },
            city: { type: 'string', example: 'Dharan' },
            state: { type: 'string', example: 'Province 1' },
            pincode: { type: 'string', example: '56700' },
            latitude: { type: 'number', example: 26.8124 },
            longitude: { type: 'number', example: 87.2847 },
            near_college: { type: 'string', example: 'Dharan University' },
            total_rooms: { type: 'integer', example: 15 },
            available_rooms: { type: 'integer', example: 14 },
            amenities: { type: 'array', items: { type: 'string' }, example: ['WiFi', 'AC', 'Parking'] },
            images: { type: 'array', items: { type: 'string' }, example: ['https://...'] },
            price_per_month: { type: 'number', example: 8500 },
            is_active: { type: 'integer', example: 1 },
          },
        },
        Room: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            property_id: { type: 'integer', example: 1 },
            room_number: { type: 'string', example: '101' },
            room_type: { type: 'string', enum: ['single', 'double', 'triple', 'quad'], example: 'single' },
            floor: { type: 'integer', example: 1 },
            capacity: { type: 'integer', example: 1 },
            occupied: { type: 'integer', example: 0 },
            price_per_month: { type: 'number', example: 8500 },
            amenities: { type: 'array', items: { type: 'string' } },
            is_available: { type: 'integer', example: 1 },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            student_id: { type: 'integer', example: 5 },
            property_id: { type: 'integer', example: 1 },
            room_id: { type: 'integer', example: 1 },
            booking_date: { type: 'string', format: 'date-time' },
            check_in_date: { type: 'string', format: 'date', example: '2024-12-15' },
            check_out_date: { type: 'string', format: 'date', nullable: true },
            status: { type: 'string', enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'], example: 'pending' },
            total_amount: { type: 'number', example: 51000 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
          },
        },
      },
    },
    tags: [
      { name: 'Authentication', description: 'User authentication endpoints' },
      { name: 'Properties', description: 'Property/Hostel management' },
      { name: 'Bookings', description: 'Booking management' },
      { name: 'Dashboard', description: 'Dashboard analytics' },
      { name: 'Users', description: 'User management' },
      { name: 'Notifications', description: 'Notification management' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
