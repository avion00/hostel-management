# Test Credentials

## Available Test Accounts

All test accounts use the same password: **`password123`**

### Admin Account
```
Email: admin@hostel.com
Password: password123
Role: admin
Access: Full system access, all admin features
```

### Manager Accounts
```
Email: manager1@hostel.com
Password: password123
Role: manager
Access: Property management, bookings, payments

Email: manager2@hostel.com
Password: password123
Role: manager

Email: manager3@hostel.com
Password: password123
Role: manager
```

### Student Accounts
```
Email: student1@example.com
Password: password123
Role: student
Access: Browse hostels, make bookings, view payments

Email: student2@example.com
Password: password123
Role: student

Email: student3@example.com
Password: password123
Role: student
```

## How to Seed Test Data

If you don't have test users in your database, run the seed script:

```bash
cd server
node src/scripts/seedData.js
```

This will create:
- 1 Admin user
- 3 Manager users
- 3 Student users
- Sample properties
- Sample rooms
- Sample bookings

## Login URLs

- **Frontend Login**: http://localhost:5173/login
- **API Login Endpoint**: http://localhost:5000/api/auth/login

## Testing Different Roles

### Test as Admin
1. Login with `admin@hostel.com` / `password123`
2. You'll be redirected to `/dashboard/admin/overview`
3. You can access all admin features

### Test as Manager
1. Login with `manager1@hostel.com` / `password123`
2. You'll be redirected to `/dashboard/owner/overview`
3. You can manage properties and bookings

### Test as Student
1. Login with `student1@example.com` / `password123`
2. You'll be redirected to home page `/`
3. You can browse hostels and make bookings

## Common Login Issues

### Issue: "Invalid email or password"
**Cause**: User doesn't exist or wrong password
**Solution**: 
- Use one of the test credentials above
- Run seed script if database is empty
- Check that password is exactly `password123`

### Issue: "Account is locked"
**Cause**: Too many failed login attempts (5 attempts)
**Solution**: 
- Wait 15 minutes for automatic unlock
- Or manually clear the `login_attempts` table in database

### Issue: "Your account has been deactivated"
**Cause**: User's `is_active` field is set to 0
**Solution**: 
- Update database: `UPDATE users SET is_active = 1 WHERE email = 'your@email.com'`

### Issue: "Cannot connect to server"
**Cause**: Backend server is not running
**Solution**: 
- Start backend: `cd server && npm run dev`
- Check server is running on http://localhost:5000

## API Testing with cURL

### Login as Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hostel.com",
    "password": "password123"
  }'
```

### Login as Manager
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager1@hostel.com",
    "password": "password123"
  }'
```

### Login as Student
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@example.com",
    "password": "password123"
  }'
```

## Expected Response

### Successful Login
```json
{
  "success": true,
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Alice Student",
    "email": "student1@example.com",
    "phone": "9876543214",
    "role": "student",
    "avatar": null,
    "is_active": 1,
    "created_at": "2025-12-04T12:00:00.000Z",
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Failed Login
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Creating New Test Users

You can create new users via signup or directly in database:

### Via Signup API
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New User",
    "email": "newuser@example.com",
    "password": "password123",
    "phone": "1234567890",
    "role": "student"
  }'
```

### Via Database (SQLite)
```sql
-- First, hash the password (use bcrypt with salt rounds 10-12)
-- Then insert:
INSERT INTO users (name, email, password, phone, role)
VALUES ('New User', 'newuser@example.com', '$2a$10$hashedpassword', '1234567890', 'student');
```

## Security Notes

⚠️ **Important**: These are test credentials for development only!

- Never use these credentials in production
- Change all passwords before deploying
- Use strong, unique passwords for production
- Enable proper authentication mechanisms
- Consider adding email verification
- Implement rate limiting for login attempts

## Quick Reference

| Role | Email | Password | Dashboard URL |
|------|-------|----------|---------------|
| Admin | admin@hostel.com | password123 | /dashboard/admin/overview |
| Manager | manager1@hostel.com | password123 | /dashboard/owner/overview |
| Student | student1@example.com | password123 | / (home page) |
