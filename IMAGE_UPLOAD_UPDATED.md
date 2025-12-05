# Image Upload - Updated Implementation

## 🎯 What Changed

The image upload system has been updated to organize images by property ID in separate folders.

### Previous Structure
```
uploads/
  └── properties/
      ├── image1.jpg
      ├── image2.jpg
      └── image3.jpg
```

### New Structure (Property-Based)
```
uploads/
  └── properties/
      ├── {property-id-1}/
      │   ├── room1_1733334123456.jpg
      │   ├── room2_1733334123457.jpg
      │   └── lobby_1733334123458.jpg
      └── {property-id-2}/
          ├── exterior_1733334123459.jpg
          └── interior_1733334123460.jpg
```

## 📋 API Endpoint

### Create Property with Images
```
POST /api/admin/hostels
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

### Request Format

**Important**: The request must be `multipart/form-data`, NOT `application/json`

#### Form Fields (all as form-data):

**Required:**
- `manager_id` (string) - UUID of the manager
- `name` (string) - Property name
- `address` (string) - Full address
- `city` (string) - City name
- `state` (string) - State/Province
- `pincode` (string) - Postal code
- `total_rooms` (number) - Total rooms
- `price_starting` (number) - Starting price
- `images` (files) - Image files (1-10 files, max 5MB each)

**Optional:**
- `description` (string)
- `area` (string)
- `latitude` (number)
- `longitude` (number)
- `near_college` (string)
- `established_year` (number)
- `available_rooms` (number)
- `total_beds` (number)
- `available_beds` (number)
- `staff_count` (number)
- `amenities` (string) - JSON array as string, e.g., `'["WiFi","AC"]'`
- `rules` (string) - JSON array as string

## 🔧 How It Works

1. **Property Creation**: First, a UUID is generated for the new property
2. **Folder Creation**: A folder is created at `/uploads/properties/{property-id}/`
3. **File Upload**: Images are uploaded to the temp folder
4. **File Move**: Images are moved from temp to the property-specific folder
5. **URL Generation**: Image URLs are generated as `/uploads/properties/{property-id}/{filename}`
6. **Database Save**: Property data with image URLs is saved to database

## 📤 Example Requests

### Using cURL
```bash
curl -X POST http://localhost:5000/api/admin/hostels \
  -H "Authorization: Bearer YOUR_TOKEN" \
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
  -F "images=@/path/to/room1.jpg" \
  -F "images=@/path/to/room2.jpg" \
  -F "images=@/path/to/lobby.jpg"
```

### Using JavaScript Fetch
```javascript
const formData = new FormData();

// Add text fields
formData.append('manager_id', 'e127ba6d-27d5-458c-b5cc-5407bea64cec');
formData.append('name', 'Green Valley Hostel');
formData.append('description', 'Modern hostel');
formData.append('address', 'Chowk Road, Near DU');
formData.append('city', 'Dharan');
formData.append('state', 'Province 1');
formData.append('pincode', '56700');
formData.append('total_rooms', '15');
formData.append('price_starting', '8500');

// Add amenities as JSON string
formData.append('amenities', JSON.stringify(['WiFi', 'AC', 'Parking']));

// Add image files
const imageFiles = document.getElementById('images').files;
for (let i = 0; i < imageFiles.length; i++) {
  formData.append('images', imageFiles[i]);
}

// Send request
const response = await fetch('http://localhost:5000/api/admin/hostels', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
    // DON'T set Content-Type - browser will set it automatically
  },
  body: formData
});

const result = await response.json();
console.log(result);
```

### Using Postman

1. **Method**: POST
2. **URL**: `http://localhost:5000/api/admin/hostels`
3. **Headers**:
   - Authorization: `Bearer {your_token}`
4. **Body**: Select "form-data"
5. **Add fields**:
   - Text fields: manager_id, name, city, etc.
   - File fields: images (select multiple files)
6. **Send**

## 📥 Response Format

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
      "/uploads/properties/36b395b4-0930-4ef4-88db-d74bb9df5e8c/room1_1733334123456.jpg",
      "/uploads/properties/36b395b4-0930-4ef4-88db-d74bb9df5e8c/room2_1733334123457.jpg",
      "/uploads/properties/36b395b4-0930-4ef4-88db-d74bb9df5e8c/lobby_1733334123458.jpg"
    ],
    "status": "approved",
    "created_at": "2025-12-04T17:30:00.000Z",
    "updated_at": "2025-12-04T17:30:00.000Z"
  }
}
```

## 🖼️ Accessing Images

### Image URL Format
```
/uploads/properties/{property-id}/{filename}
```

### Full URL
```
http://localhost:5000/uploads/properties/36b395b4-0930-4ef4-88db-d74bb9df5e8c/room1_1733334123456.jpg
```

### In Frontend
```javascript
// Get property data from API
const property = await fetchProperty(propertyId);

// Display images
property.images.forEach(imageUrl => {
  const fullUrl = `${API_BASE_URL}${imageUrl}`;
  // Example: http://localhost:5000/uploads/properties/36b395b4.../room1_1733334123456.jpg
  
  const img = document.createElement('img');
  img.src = fullUrl;
  img.alt = property.name;
  container.appendChild(img);
});
```

## 🎨 Frontend Integration

### React Component Example
```jsx
import React, { useState } from 'react';

const CreatePropertyForm = () => {
  const [formData, setFormData] = useState({
    managerId: '',
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    totalRooms: '',
    priceStarting: '',
    amenities: []
  });
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    
    // Add all fields
    data.append('manager_id', formData.managerId);
    data.append('name', formData.name);
    data.append('address', formData.address);
    data.append('city', formData.city);
    data.append('state', formData.state);
    data.append('pincode', formData.pincode);
    data.append('total_rooms', formData.totalRooms);
    data.append('price_starting', formData.priceStarting);
    data.append('amenities', JSON.stringify(formData.amenities));
    
    // Add images
    images.forEach(file => {
      data.append('images', file);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/hostels', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Property created successfully!');
        console.log('Property ID:', result.data.id);
        console.log('Images:', result.data.images);
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages(Array.from(e.target.files))}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Property'}
      </button>
    </form>
  );
};
```

### Display Property Images
```jsx
const PropertyImages = ({ property }) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  return (
    <div className="property-images">
      {property.images?.map((imageUrl, index) => (
        <img
          key={index}
          src={`${API_BASE_URL}${imageUrl}`}
          alt={`${property.name} - Image ${index + 1}`}
          className="property-image"
        />
      ))}
    </div>
  );
};
```

## 🔒 Security & Validation

### File Validation
- **Allowed types**: JPEG, JPG, PNG, GIF, WEBP
- **Max file size**: 5MB per file
- **Max files**: 10 images per request
- **Total max size**: 50MB per request

### Error Handling
- **File too large**: Returns 400 with error message
- **Invalid file type**: Returns 400 with error message
- **Manager not found**: Returns 404
- **Server error**: Rolls back changes, deletes uploaded files

## 🧹 Cleanup on Error

If property creation fails:
1. Property folder is deleted
2. All uploaded files are removed
3. Database transaction is rolled back
4. Error message is returned

## 📝 Important Notes

1. **Content-Type**: Must be `multipart/form-data`, NOT `application/json`
2. **Arrays**: Send as JSON strings: `JSON.stringify(['WiFi', 'AC'])`
3. **File Field Name**: Must be `images` (plural)
4. **Property ID**: Auto-generated UUID
5. **Folder Structure**: Each property gets its own folder
6. **File Naming**: `{original-name}_{timestamp}.{ext}`

## 🧪 Testing

### Test HTML Form
Open `server/test-image-upload.html` in your browser to test the API directly.

### Test with Postman
1. Import the Swagger documentation
2. Use the "Admin - Hostels" endpoints
3. Select `multipart/form-data` for request body
4. Add files and fields
5. Send request

## 🚀 Next Steps

1. **Frontend Update**: Change property creation form to use FormData
2. **Image Display**: Update image display components to use new URLs
3. **Image Management**: Add ability to delete individual images
4. **Image Reordering**: Add drag-and-drop to reorder images
5. **Image Optimization**: Add image compression/resizing

## ✅ Summary

- ✅ Images organized by property ID
- ✅ Each property has its own folder
- ✅ Proper error handling and cleanup
- ✅ Multipart/form-data support
- ✅ File validation (type, size, count)
- ✅ Automatic folder creation
- ✅ Clean URL structure
- ✅ Ready for frontend integration

**Status**: Backend implementation complete and ready for testing!
