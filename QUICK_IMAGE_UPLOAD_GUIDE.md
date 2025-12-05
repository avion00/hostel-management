# Quick Image Upload Guide

## ✅ What's Fixed

The API now properly accepts **multipart/form-data** instead of JSON, and images are organized by property ID.

## 🎯 Key Changes

### 1. Content Type
- ❌ **Before**: `application/json`
- ✅ **Now**: `multipart/form-data`

### 2. Image Storage
- ❌ **Before**: `/uploads/properties/image.jpg`
- ✅ **Now**: `/uploads/properties/{property-id}/image_timestamp.jpg`

## 📋 Quick API Reference

### Endpoint
```
POST /api/admin/hostels
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

### Required Fields
```javascript
manager_id: "uuid-string"
name: "Property Name"
address: "Full Address"
city: "City"
state: "State"
pincode: "12345"
total_rooms: 15
price_starting: 8500
images: [File, File, ...]  // 1-10 image files
```

### Optional Fields
```javascript
description: "Description"
amenities: '["WiFi","AC"]'  // JSON string
rules: '["No smoking"]'      // JSON string
// ... other fields
```

## 🚀 Quick Test

### 1. Using Test HTML Form
```bash
# Open in browser
server/test-image-upload.html
```

### 2. Using Postman
1. POST to `http://localhost:5000/api/admin/hostels`
2. Headers: `Authorization: Bearer {token}`
3. Body: form-data
4. Add text fields + file fields
5. Send

### 3. Using JavaScript
```javascript
const formData = new FormData();
formData.append('manager_id', managerId);
formData.append('name', 'Green Valley Hostel');
formData.append('city', 'Dharan');
formData.append('state', 'Province 1');
formData.append('address', 'Chowk Road');
formData.append('pincode', '56700');
formData.append('total_rooms', '15');
formData.append('price_starting', '8500');
formData.append('amenities', JSON.stringify(['WiFi', 'AC']));

// Add images
imageFiles.forEach(file => {
  formData.append('images', file);
});

const response = await fetch('http://localhost:5000/api/admin/hostels', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

## 📤 Response Example
```json
{
  "success": true,
  "data": {
    "id": "property-uuid",
    "name": "Green Valley Hostel",
    "images": [
      "/uploads/properties/property-uuid/room1_1733334123456.jpg",
      "/uploads/properties/property-uuid/room2_1733334123457.jpg"
    ]
  }
}
```

## 🖼️ Display Images in Frontend
```javascript
const imageUrl = `http://localhost:5000${property.images[0]}`;
// http://localhost:5000/uploads/properties/property-uuid/room1_1733334123456.jpg
```

## ⚠️ Common Issues

### Issue: "application/json" error
**Solution**: Don't set Content-Type header when using FormData

### Issue: Images not uploading
**Solution**: Use field name `images` (plural) and append files, not paths

### Issue: Amenities showing as string
**Solution**: Send as JSON string: `JSON.stringify(['WiFi', 'AC'])`

## 📁 File Structure
```
uploads/
  └── properties/
      └── {property-id}/
          ├── room1_timestamp.jpg
          ├── room2_timestamp.jpg
          └── lobby_timestamp.jpg
```

## 🎨 Frontend Update Needed

Replace this:
```javascript
// OLD - JSON
fetch('/api/admin/hostels', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, images: ['url1', 'url2'] })
})
```

With this:
```javascript
// NEW - FormData
const formData = new FormData();
formData.append('name', name);
imageFiles.forEach(file => formData.append('images', file));

fetch('/api/admin/hostels', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
})
```

## ✅ Checklist

- [ ] Change Content-Type to multipart/form-data
- [ ] Use FormData instead of JSON.stringify
- [ ] Send arrays as JSON strings
- [ ] Use file input: `<input type="file" multiple>`
- [ ] Update image display to use new URLs
- [ ] Test with actual image files

## 📚 Full Documentation

- `IMAGE_UPLOAD_UPDATED.md` - Complete implementation details
- `server/test-image-upload.html` - Test form
- `server/API_IMAGE_UPLOAD_REFERENCE.md` - API reference

## 🎯 Ready to Use!

The backend is fully configured. Just update your frontend to use FormData and you're good to go!
