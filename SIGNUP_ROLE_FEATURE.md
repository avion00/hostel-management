# Signup Role Selection Feature

## What Was Added

Added a **role/account type selector** to the signup form, allowing users to choose between:
- **Student** - Can browse and book hostels
- **Property Manager** - Can list and manage properties

## Changes Made

### 1. Updated Form State
Added `role` field to form data with default value of "student":

```javascript
const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  role: "student",  // ✅ New field
  password: "",
  confirmPassword: "",
});
```

### 2. Added Role Select Field
Added a dropdown selector in the signup form:

```jsx
<div>
  <label htmlFor="role" className="text-sm font-medium text-slate-700 mb-2 block">
    Account Type
  </label>
  <Select
    value={formData.role}
    onValueChange={(value) => handleInputChange("role", value)}
  >
    <SelectTrigger className="h-12 bg-slate-50 border-slate-200 focus:bg-white">
      <SelectValue placeholder="Select account type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="student">Student</SelectItem>
      <SelectItem value="manager">Property Manager</SelectItem>
    </SelectContent>
  </Select>
  <p className="text-xs text-slate-500 mt-1">
    Students can browse and book hostels. Managers can list and manage properties.
  </p>
</div>
```

### 3. Enhanced Form Submission
- Added password matching validation
- Formatted data to match backend API expectations
- Improved error handling with specific messages

```javascript
const signupData = {
  name: `${formData.firstName} ${formData.lastName}`.trim(),
  email: formData.email,
  password: formData.password,
  phone: formData.phoneNumber,
  role: formData.role  // ✅ Sent to backend
};
```

### 4. Improved Error Handling
- Password mismatch validation
- Network error detection
- Password strength requirement errors
- User-friendly error messages

## User Experience

### Form Layout
1. First Name & Last Name (side by side)
2. Email Address
3. Phone Number
4. **Account Type** (NEW - dropdown selector)
5. Password & Confirm Password (side by side)
6. Terms & Conditions checkbox
7. Create Account button

### Account Type Options

| Option | Value | Description |
|--------|-------|-------------|
| Student | `student` | Browse hostels, make bookings, view payments |
| Property Manager | `manager` | List properties, manage rooms, handle bookings |

### Helper Text
Below the dropdown: *"Students can browse and book hostels. Managers can list and manage properties."*

## Backend Integration

### API Endpoint
```
POST /api/auth/signup
```

### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "9876543210",
  "role": "student"
}
```

### Response (Success)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "student",
    "is_active": 1,
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

## Validation

### Frontend Validation
- ✅ Password must match confirm password
- ✅ All fields required
- ✅ Role must be selected (defaults to "student")

### Backend Validation
- ✅ Email format validation
- ✅ Password strength requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- ✅ Duplicate email check
- ✅ Role must be valid (student, manager, or admin)

## Error Messages

| Scenario | Message |
|----------|---------|
| Passwords don't match | "Passwords do not match" |
| Weak password | Shows specific requirements not met |
| Email already exists | "User already exists with this email" |
| Network error | "Cannot connect to server. Please check your internet connection." |
| Invalid input | "Please check your input and try again." |

## Testing

### Test Signup as Student
```
First Name: Alice
Last Name: Student
Email: alice.student@example.com
Phone: 9876543210
Account Type: Student
Password: Password123!
Confirm Password: Password123!
```

### Test Signup as Manager
```
First Name: Bob
Last Name: Manager
Email: bob.manager@example.com
Phone: 9876543211
Account Type: Property Manager
Password: Password123!
Confirm Password: Password123!
```

## User Flow

1. **User visits signup page** → http://localhost:5173/signup
2. **Fills in personal information** → Name, email, phone
3. **Selects account type** → Student or Property Manager
4. **Creates password** → Must meet security requirements
5. **Submits form** → Account created
6. **Redirected to login** → Can now login with credentials
7. **Dashboard access** → Based on selected role
   - Students → Home page with hostel listings
   - Managers → Property management dashboard

## Role-Based Access

After signup and login:

| Role | Dashboard URL | Access |
|------|---------------|--------|
| Student | `/` | Browse hostels, make bookings |
| Manager | `/dashboard/owner/overview` | Manage properties, rooms, bookings |
| Admin | `/dashboard/admin/overview` | Full system access (not available in signup) |

## Security Features

- ✅ Password hashing with bcrypt (salt rounds: 12)
- ✅ JWT tokens (access + refresh)
- ✅ Email validation
- ✅ Password strength requirements
- ✅ Protected routes based on role
- ✅ CORS enabled
- ✅ Rate limiting on login

## Notes

- **Admin role** is not available in signup (must be created manually or via seed script)
- **Default role** is "student" if not specified
- **Role cannot be changed** after signup (requires admin intervention)
- **Email is unique** - one account per email address

## Files Modified

- ✅ `client/src/pages/authentication/signup/Main.jsx`
  - Added role select field
  - Enhanced form validation
  - Improved error handling
  - Updated API integration

## Summary

The signup form now includes a role selector that allows users to choose their account type during registration. This enables:
- Students to sign up and start browsing hostels
- Property managers to sign up and list their properties
- Proper role-based access control from the start
- Better user experience with clear account type selection

The feature is fully integrated with the backend API and includes comprehensive error handling and validation! 🎉
