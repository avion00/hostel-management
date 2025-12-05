# Image Upload Implementation Guide

## Overview
The hostel management system now supports direct image file uploads instead of requiring image URLs. Images are stored locally on the server and served as static files.

## Backend Changes

### 1. Dependencies
- **multer**: Installed for handling multipart/form-data file uploads
- **File size limit**: 5MB per image
- **Allowed formats**: JPEG, JPG, PNG, GIF, WEBP

### 2. File Structure
```
server/
├── src/
│   └── middleware/
│       └── upload.js          # Multer configuration
├── uploads/
│   └── properties/            # Property images storage
│       └── .gitkeep
```

### 3. Upload Middleware (`src/middleware/upload.js`)
- Configures multer with disk storage
- Generates unique filenames: `{originalname}-{timestamp}-{random}.{ext}`
- Validates file types (images only)
- Sets file size limit to 5MB

### 4. API Endpoints Updated

#### Create Property (POST /api/admin/hostels)
**Content-Type**: `multipart/form-data`

**Form Fields**:
- `manager_id`: string (required)
- `name`: string (required)
- `description`: string
- `address`: string (required)
- `city`: string (required)
- `area`: string
- `state`: string (required)
- `pincode`: string (required)
- `latitude`: number
- `longitude`: number
- `near_college`: string
- `established_year`: number
- `total_rooms`: number (required)
- `available_rooms`: number
- `total_beds`: number
- `available_beds`: number
- `staff_count`: number
- `price_starting`: number (required)
- `amenities`: JSON string (array)
- `rules`: JSON string (array)
- `images`: file[] (multiple files, max 10)

**Example using cURL**:
```bash
curl -X POST http://localhost:5000/api/admin/hostels \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "manager_id=YOUR_MANAGER_ID" \
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

#### Update Property (PATCH /api/admin/hostels/:id)
**Content-Type**: `multipart/form-data`

**Form Fields**: Same as create, but all optional
- New images will be appended to existing images
- To replace images, you need to handle deletion separately

**Example using cURL**:
```bash
curl -X PATCH http://localhost:5000/api/admin/hostels/HOSTEL_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Updated Hostel Name" \
  -F "images=@/path/to/new-image.jpg"
```

### 5. Image Storage
- **Location**: `server/uploads/properties/`
- **Naming**: `{originalname}-{timestamp}-{random}.{ext}`
- **Access**: `http://localhost:5000/uploads/properties/{filename}`

### 6. Response Format
Images are returned as an array of relative URLs:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Green Valley Hostel",
    "images": [
      "/uploads/properties/hostel-1733334123456-123456789.jpg",
      "/uploads/properties/hostel-1733334123457-987654321.jpg"
    ]
  }
}
```

## Frontend Integration

### Using Fetch API
```javascript
const formData = new FormData();
formData.append('manager_id', managerId);
formData.append('name', 'Green Valley Hostel');
formData.append('city', 'Dharan');
// ... other fields

// Add multiple images
imageFiles.forEach(file => {
  formData.append('images', file);
});

// Add JSON arrays as strings
formData.append('amenities', JSON.stringify(['WiFi', 'AC']));

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

const response = await axios.post('http://localhost:5000/api/admin/hostels', formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});
```

### React Example with File Input
```jsx
const [images, setImages] = useState([]);

const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  setImages(files);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('manager_id', managerId);
  formData.append('name', name);
  // ... other fields
  
  images.forEach(file => {
    formData.append('images', file);
  });
  
  formData.append('amenities', JSON.stringify(amenities));
  
  const response = await fetch('/api/admin/hostels', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
};

return (
  <form onSubmit={handleSubmit}>
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handleImageChange}
    />
    {/* Other form fields */}
    <button type="submit">Create Property</button>
  </form>
);
```

## Important Notes

1. **File Size**: Maximum 5MB per image
2. **File Types**: Only JPEG, JPG, PNG, GIF, WEBP allowed
3. **Multiple Files**: Up to 10 images can be uploaded at once
4. **JSON Fields**: Arrays like `amenities` and `rules` must be sent as JSON strings
5. **Image URLs**: Stored images are accessible at `/uploads/properties/{filename}`
6. **Update Behavior**: New images are appended to existing ones

## Error Handling

### Common Errors
- **File too large**: "File too large" (5MB limit)
- **Invalid file type**: "Only image files are allowed (jpeg, jpg, png, gif, webp)"
- **No manager found**: "Manager not found"

### Example Error Response
```json
{
  "success": false,
  "message": "Only image files are allowed (jpeg, jpg, png, gif, webp)"
}
```

## Testing

### Using Postman
1. Set request type to POST/PATCH
2. Select "Body" tab
3. Choose "form-data"
4. Add text fields for regular data
5. Add file fields for images (change type to "File")
6. Add Authorization header with Bearer token

### Using Thunder Client (VS Code)
1. Create new request
2. Set method to POST/PATCH
3. Go to "Body" tab
4. Select "Form"
5. Add fields and files
6. Add Authorization header

## Security Considerations

1. **File Validation**: Only image files are accepted
2. **File Size Limit**: 5MB per file prevents abuse
3. **Unique Filenames**: Prevents file overwrites
4. **Directory Structure**: Files organized by type (properties)
5. **Static Serving**: Images served through Express static middleware

## Future Enhancements

1. Image compression/optimization
2. Cloud storage integration (AWS S3, Cloudinary)
3. Image deletion endpoint
4. Thumbnail generation
5. Image reordering
6. Bulk image upload
