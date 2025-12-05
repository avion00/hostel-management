# Super Admin Backend Implementation Guide

## ✅ COMPLETED

### 1. Database Schema Updated
- ✅ Enhanced `properties` table with all required fields
- ✅ Created `room_types` table (replaces individual rooms)
- ✅ Updated `bookings` table with duration_type and proper statuses
- ✅ Updated `payments` table with payment gateways
- ✅ Created `subscription_plans` table
- ✅ Created `user_subscriptions` table
- ✅ Created `documents` table for verification
- ✅ Created `cms` table for content management
- ✅ Added proper indexes for all tables
- ✅ Added default CMS data

### 2. Admin Controller Created
- ✅ User Management functions
- ✅ Analytics overview function

## 🚧 REMAINING TASKS

### 3. Complete Admin Controllers

Create these additional controller files:

#### `adminHostelController.js`
```javascript
- createHostel()
- getAllHostels() // with filters: city, owner, status
- getHostelById()
- updateHostel()
- approveHostel()
- rejectHostel()
- deleteHostel()
```

#### `adminRoomController.js`
```javascript
- createRoomType()
- getAllRoomTypes() // with filters
- getRoomTypeById()
- updateRoomType()
- deleteRoomType()
```

#### `adminBookingController.js`
```javascript
- getAllBookings() // with filters: hostel, student, status
- getBookingById()
- cancelBooking()
- confirmBooking()
- deleteBooking()
```

#### `adminPaymentController.js`
```javascript
- getAllPayments() // with filters
- getPaymentById()
- refundPayment()
```

#### `adminSubscriptionController.js`
```javascript
- createPlan()
- getAllPlans()
- getPlanById()
- updatePlan()
- deletePlan()
- assignPlanToUser()
```

#### `adminDocumentController.js`
```javascript
- getAllDocuments() // with filters
- getDocumentById()
- approveDocument()
- rejectDocument()
```

#### `adminCMSController.js`
```javascript
- getCMS()
- updateCMS()
```

### 4. Create Validation Schemas

Install Joi:
```bash
npm install joi
```

Create `src/validators/adminValidators.js`:
```javascript
import Joi from 'joi';

export const hostelSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  // ... all fields
});

export const roomTypeSchema = Joi.object({
  // ... fields
});

// ... more schemas
```

### 5. Create Admin Routes

Create `src/routes/adminRoutes.js`:
```javascript
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';
// ... import other controllers

const router = express.Router();

// Protect all routes and authorize only admin
router.use(protect);
router.use(authorize('admin'));

// User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/block', adminController.blockUser);
router.patch('/users/:id/unblock', adminController.unblockUser);
router.patch('/users/:id/change-role', adminController.changeUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Hostel Management
router.post('/hostels', adminHostelController.createHostel);
router.get('/hostels', adminHostelController.getAllHostels);
router.get('/hostels/:id', adminHostelController.getHostelById);
router.patch('/hostels/:id', adminHostelController.updateHostel);
router.patch('/hostels/:id/approve', adminHostelController.approveHostel);
router.patch('/hostels/:id/reject', adminHostelController.rejectHostel);
router.delete('/hostels/:id', adminHostelController.deleteHostel);

// Room Types
router.post('/rooms', adminRoomController.createRoomType);
router.get('/rooms', adminRoomController.getAllRoomTypes);
router.get('/rooms/:id', adminRoomController.getRoomTypeById);
router.patch('/rooms/:id', adminRoomController.updateRoomType);
router.delete('/rooms/:id', adminRoomController.deleteRoomType);

// Bookings
router.get('/bookings', adminBookingController.getAllBookings);
router.get('/bookings/:id', adminBookingController.getBookingById);
router.patch('/bookings/:id/cancel', adminBookingController.cancelBooking);
router.patch('/bookings/:id/confirm', adminBookingController.confirmBooking);
router.delete('/bookings/:id', adminBookingController.deleteBooking);

// Payments
router.get('/payments', adminPaymentController.getAllPayments);
router.get('/payments/:id', adminPaymentController.getPaymentById);
router.patch('/payments/:id/refund', adminPaymentController.refundPayment);

// Subscriptions
router.post('/subscriptions', adminSubscriptionController.createPlan);
router.get('/subscriptions', adminSubscriptionController.getAllPlans);
router.get('/subscriptions/:id', adminSubscriptionController.getPlanById);
router.patch('/subscriptions/:id', adminSubscriptionController.updatePlan);
router.delete('/subscriptions/:id', adminSubscriptionController.deletePlan);

// Documents
router.get('/documents', adminDocumentController.getAllDocuments);
router.get('/documents/:id', adminDocumentController.getDocumentById);
router.patch('/documents/:id/approve', adminDocumentController.approveDocument);
router.patch('/documents/:id/reject', adminDocumentController.rejectDocument);

// CMS
router.get('/cms', adminCMSController.getCMS);
router.patch('/cms', adminCMSController.updateCMS);

// Analytics
router.get('/analytics/overview', adminController.getAnalyticsOverview);

export default router;
```

### 6. Update app.js

Add admin routes:
```javascript
import adminRoutes from './routes/adminRoutes.js';

// ... existing code

app.use('/api/admin', adminRoutes);
```

### 7. Check Middleware

Ensure `src/middleware/auth.js` has:
```javascript
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    next();
  };
};
```

### 8. Add Swagger Documentation

Install swagger dependencies:
```bash
npm install swagger-jsdoc swagger-ui-express
```

Create `src/config/swagger.js` and add JSDoc comments to all routes.

## 📝 IMPLEMENTATION STEPS

1. **Install Dependencies**
   ```bash
   cd server
   npm install joi swagger-jsdoc swagger-ui-express
   ```

2. **Create All Controller Files**
   - adminHostelController.js
   - adminRoomController.js
   - adminBookingController.js
   - adminPaymentController.js
   - adminSubscriptionController.js
   - adminDocumentController.js
   - adminCMSController.js

3. **Create Validators**
   - Create validators folder
   - Add Joi schemas for all entities

4. **Create Admin Routes**
   - Create adminRoutes.js with all endpoints

5. **Update app.js**
   - Import and use admin routes

6. **Add Swagger**
   - Configure Swagger
   - Add JSDoc comments

7. **Test All Endpoints**
   - Use Postman or Thunder Client
   - Test with admin user

## 🎯 QUICK START

To implement everything quickly:

1. Copy the database schema changes (already done ✅)
2. Create all controller files following the pattern in `adminController.js`
3. Create validators using Joi
4. Create admin routes file
5. Update app.js
6. Test with Postman

## 📊 API ENDPOINTS SUMMARY

### Users (7 endpoints)
- GET /api/admin/users
- GET /api/admin/users/:id
- PATCH /api/admin/users/:id/block
- PATCH /api/admin/users/:id/unblock
- PATCH /api/admin/users/:id/change-role
- DELETE /api/admin/users/:id

### Hostels (7 endpoints)
- POST /api/admin/hostels
- GET /api/admin/hostels
- GET /api/admin/hostels/:id
- PATCH /api/admin/hostels/:id
- PATCH /api/admin/hostels/:id/approve
- PATCH /api/admin/hostels/:id/reject
- DELETE /api/admin/hostels/:id

### Room Types (5 endpoints)
- POST /api/admin/rooms
- GET /api/admin/rooms
- GET /api/admin/rooms/:id
- PATCH /api/admin/rooms/:id
- DELETE /api/admin/rooms/:id

### Bookings (5 endpoints)
- GET /api/admin/bookings
- GET /api/admin/bookings/:id
- PATCH /api/admin/bookings/:id/cancel
- PATCH /api/admin/bookings/:id/confirm
- DELETE /api/admin/bookings/:id

### Payments (3 endpoints)
- GET /api/admin/payments
- GET /api/admin/payments/:id
- PATCH /api/admin/payments/:id/refund

### Subscriptions (5 endpoints)
- POST /api/admin/subscriptions
- GET /api/admin/subscriptions
- GET /api/admin/subscriptions/:id
- PATCH /api/admin/subscriptions/:id
- DELETE /api/admin/subscriptions/:id

### Documents (4 endpoints)
- GET /api/admin/documents
- GET /api/admin/documents/:id
- PATCH /api/admin/documents/:id/approve
- PATCH /api/admin/documents/:id/reject

### CMS (2 endpoints)
- GET /api/admin/cms
- PATCH /api/admin/cms

### Analytics (1 endpoint)
- GET /api/admin/analytics/overview

**Total: 39 Super Admin API Endpoints**

## 🔒 Security

All admin routes are protected with:
1. `protect` middleware - Checks JWT token
2. `authorize('admin')` middleware - Checks user role

## ✅ NEXT STEPS

Would you like me to:
1. Create all the remaining controller files?
2. Create the validation schemas?
3. Create the admin routes file?
4. Set up Swagger documentation?

Let me know which part you'd like me to implement next!
