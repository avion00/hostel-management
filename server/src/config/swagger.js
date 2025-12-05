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
            student_id: { type: 'string', example: 'e127ba6d-27d5-458c-b5cc-5407bea6' },
            property_id: { type: 'string', example: 'd74a4f4c-1a4c-4826-8ea0-20dbb077c134' },
            room_type_id: { type: 'integer', example: 3 },
            start_date: { type: 'string', format: 'date', example: '2024-12-15' },
            end_date: { type: 'string', format: 'date', nullable: true, example: '2025-06-15' },
            duration_type: { type: 'string', enum: ['daily', 'weekly', 'monthly'], example: 'monthly' },
            duration_value: { type: 'integer', example: 6 },
            occupants: { type: 'integer', example: 1 },
            total_amount: { type: 'number', example: 51000 },
            payment_status: { type: 'string', enum: ['pending', 'partial', 'completed', 'refunded'], example: 'pending' },
            booking_status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'rejected', 'completed'], example: 'pending' },
            special_requests: { type: 'string', example: 'Prefer a quiet room with balcony if available' },
            preferred_floor: { type: 'string', example: 'top' },
            check_in_time: { type: 'string', example: '15:00' },
            sharing_preference: { type: 'string', example: 'double' },
            payment_method: { type: 'string', example: 'khalti' },
            pay_mode: { type: 'string', example: 'partial' },
            discount_code: { type: 'string', example: 'WELCOME10' },
            emergency_contact_name: { type: 'string', example: 'Father Name' },
            emergency_contact_phone: { type: 'string', example: '+977-98XXXXXXXX' },
            emergency_contact_relation: { type: 'string', example: 'father' },
            id_document_type: { type: 'string', example: 'citizenship' },
            id_document_number: { type: 'string', example: '1234-5678-9012' },
            heard_from: { type: 'string', example: 'college' },
            notes_internal: { type: 'string', example: 'Student prefers quiet roommates' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
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
