# Image Upload API - Quick Reference

## 📍 Endpoints

### Create Property with Images
```
POST /api/admin/hostels
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

### Update Property with Images
```
PATCH /api/admin/hostels/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

## 📋 Request Format

### Required Fields
| Field | Type | Description |
|-------|------|-------------|
| `manager_id` | string | UUID of the manager |
| `name` | string | Property name |
| `address` | string | Full address |
| `city` | string | City name |
| `state` | string | State/Province |
| `pincode` | string | Postal code |
| `total_rooms` | number | Total number of rooms |
| `price_starting` | number | Starting price in Rs. |
| `images` | file[] | Image files (1-10 files) |

### Optional Fields
| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Property description |
| `area` | string | Area/locality |
| `latitude` | number | GPS latitude |
| `longitude` | number | GPS longitude |
| `near_college` | string | Nearby college/university |
| `established_year` | number | Year established |
| `available_rooms` | number | Available rooms |
| `total_beds` | number | Total beds |
| `available_beds` | number | Available beds |
| `staff_count` | number | Number of staff |
| `amenities` | string | JSON array as string |
| `rules` | string | JSON array as string |

## 📝 Example Requests

### Using cURL
```bash
curl -X POST http://localhost:5000/api/admin/hostels \
  -H "Authorization: Bearer eyJhbGc..." \
  -F "manager_id=e127ba6d-27d5-458c-b5cc-5407bea64cec" \
  -F "name=Green Valley Hostel" \
  -F "description=Modern hostel with excellent facilities" \
  -F "address=Chowk Road, Near DU" \
  -F "city=Dharan" \
  -F "state=Province 1" \
  -F "pincode=56700" \
  -F "total_rooms=15" \
  -F "price_starting=8500" \
  -F "amenities=[\"WiFi\",\"AC\",\"Parking\"]" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

### Using JavaScript Fetch
```javascript
const formData = new FormData();
formData.append('manager_id', 'e127ba6d-27d5-458c-b5cc-5407bea64cec');
formData.append('name', 'Green Valley Hostel');
formData.append('city', 'Dharan');
formData.append('state', 'Province 1');
formData.append('address', 'Chowk Road, Near DU');
formData.append('pincode', '56700');
formData.append('total_rooms', '15');
formData.append('price_starting', '8500');
formData.append('amenities', JSON.stringify(['WiFi', 'AC', 'Parking']));

// Add multiple images
imageFiles.forEach(file => {
  formData.append('images', file);
});

const response = await fetch('http://localhost:5000/api/admin/hostels', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Using Axios
```javascript
const formData = new FormData();
formData.append('manager_id', managerId);
formData.append('name', 'Green Valley Hostel');
// ... other fields

imageFiles.forEach(file => {
  formData.append('images', file);
});

const response = await axios.post(
  'http://localhost:5000/api/admin/hostels',
  formData,
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  }
);
```

## 📤 Response Format

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Hostel created successfully",
  "data": {
    "id": "36b395b4-0930-4ef4-88db-d74bb9df5e8c",
    "manager_id": "e127ba6d-27d5-458c-b5cc-5407bea64cec",
    "name": "Green Valley Hostel",
    "description": "Modern hostel with excellent facilities",
    "address": "Chowk Road, Near DU",
    "city": "Dharan",
    "state": "Province 1",
    "pincode": "56700",
    "total_rooms": 15,
    "price_starting": 8500,
    "amenities": ["WiFi", "AC", "Parking"],
    "images": [
      "/uploads/properties/hostel-1733334123456-123456789.jpg",
      "/uploads/properties/hostel-1733334123457-987654321.jpg"
    ],
    "status": "approved",
    "created_at": "2025-12-04T17:15:23.456Z",
    "updated_at": "2025-12-04T17:15:23.456Z"
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Only image files are allowed (jpeg, jpg, png, gif, webp)"
}
```

### Error Response (404 Not Found)
```json
{
  "success": false,
  "message": "Manager not found"
}
```

## 🖼️ Image Access

### Image URL Format
```
/uploads/properties/{filename}
```

### Full URL
```
http://localhost:5000/uploads/properties/hostel-1733334123456-123456789.jpg
```

### In Frontend
```javascript
const imageUrl = `${API_BASE_URL}${property.images[0]}`;
// Example: http://localhost:5000/uploads/properties/hostel-1733334123456-123456789.jpg
```

## ⚙️ Configuration

### File Limits
- **Max files per request**: 10
- **Max file size**: 5MB per file
- **Total max size**: 50MB per request

### Allowed File Types
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Storage
- **Location**: `server/uploads/properties/`
- **Filename format**: `{originalname}-{timestamp}-{random}.{ext}`

## 🔒 Authentication

All endpoints require authentication:
```
Authorization: Bearer {jwt_token}
```

Only users with `admin` role can access these endpoints.

## ❌ Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | File too large | Image exceeds 5MB limit |
| 400 | Only image files are allowed | Invalid file type |
| 401 | Not authenticated | Missing or invalid token |
| 403 | Forbidden | User is not an admin |
| 404 | Manager not found | Invalid manager_id |
| 500 | Error creating hostel | Server error |

## 🧪 Testing Tools

### 1. HTML Test Form
Open `server/test-image-upload.html` in browser

### 2. Postman
1. Create POST request
2. Set Authorization header
3. Select Body → form-data
4. Add fields and files
5. Send

### 3. Thunder Client (VS Code)
1. New request → POST
2. Auth → Bearer Token
3. Body → Form
4. Add fields and files
5. Send

### 4. cURL (Command Line)
See example above

## 📊 Response Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 201 | Created | Property created successfully |
| 200 | OK | Property updated successfully |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

## 💡 Tips

1. **Don't set Content-Type** when using FormData - browser sets it automatically
2. **Arrays as JSON strings**: `JSON.stringify(['WiFi', 'AC'])`
3. **Multiple files**: Use same field name `images` for all files
4. **Image previews**: Use `URL.createObjectURL(file)` before upload
5. **Error handling**: Always check response status and handle errors

## 🔗 Related Documentation

- Full API Guide: `IMAGE_UPLOAD_GUIDE.md`
- Frontend Integration: `FRONTEND_IMAGE_UPLOAD_GUIDE.md`
- Implementation Summary: `IMAGE_UPLOAD_IMPLEMENTATION.md`
- Test Form: `test-image-upload.html`
