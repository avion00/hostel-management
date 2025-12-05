# Frontend Image Upload Integration Guide

## 🎯 Quick Start

The backend now accepts **actual image files** instead of URLs. Here's what you need to change in the frontend.

## 📝 Changes Required in Frontend

### 1. Update the Property Creation Form

#### Before (Old - URL Input):
```jsx
const [images, setImages] = useState([]);

// Old input
<input
  type="text"
  placeholder="Enter image URL"
  value={imageUrl}
  onChange={(e) => setImageUrl(e.target.value)}
/>
<button onClick={() => setImages([...images, imageUrl])}>Add Image</button>
```

#### After (New - File Upload):
```jsx
const [imageFiles, setImageFiles] = useState([]);

// New file input
<input
  type="file"
  multiple
  accept="image/*"
  onChange={(e) => setImageFiles(Array.from(e.target.files))}
/>
```

### 2. Update Form Submission

#### Before (Old - JSON):
```javascript
const createProperty = async (formData) => {
  const response = await fetch('/api/admin/hostels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: formData.name,
      city: formData.city,
      images: formData.images, // Array of URLs
      amenities: formData.amenities
    })
  });
};
```

#### After (New - FormData):
```javascript
const createProperty = async (formData) => {
  const data = new FormData();
  
  // Add text fields
  data.append('manager_id', formData.managerId);
  data.append('name', formData.name);
  data.append('description', formData.description);
  data.append('address', formData.address);
  data.append('city', formData.city);
  data.append('state', formData.state);
  data.append('pincode', formData.pincode);
  data.append('near_college', formData.nearCollege);
  data.append('total_rooms', formData.totalRooms);
  data.append('price_starting', formData.priceStarting);
  
  // Add arrays as JSON strings
  data.append('amenities', JSON.stringify(formData.amenities));
  
  // Add image files
  imageFiles.forEach(file => {
    data.append('images', file);
  });
  
  const response = await fetch('/api/admin/hostels', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // DON'T set Content-Type - browser will set it automatically with boundary
    },
    body: data
  });
};
```

### 3. Display Uploaded Images

#### Update Image Display:
```jsx
// Images from API response
const property = {
  images: [
    "/uploads/properties/hostel-1733334123456-123456789.jpg",
    "/uploads/properties/hostel-1733334123457-987654321.jpg"
  ]
};

// Display images
{property.images?.map((imageUrl, index) => (
  <img
    key={index}
    src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imageUrl}`}
    alt={`${property.name} - Image ${index + 1}`}
    className="property-image"
  />
))}
```

## 🎨 Complete React Component Example

```jsx
import React, { useState } from 'react';

const CreatePropertyForm = () => {
  const [formData, setFormData] = useState({
    managerId: '',
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    nearCollege: '',
    totalRooms: '',
    priceStarting: '',
    amenities: []
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });
      
      // Add image files
      imageFiles.forEach(file => {
        data.append('images', file);
      });

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
        // Reset form
        setFormData({
          managerId: '',
          name: '',
          description: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          nearCollege: '',
          totalRooms: '',
          priceStarting: '',
          amenities: []
        });
        setImageFiles([]);
        setImagePreviews([]);
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
      {/* Text inputs */}
      <input
        type="text"
        placeholder="Property Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      
      {/* ... other inputs ... */}
      
      {/* Image upload */}
      <div>
        <label>Property Images (Max 10, 5MB each)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        
        {/* Image previews */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          {imagePreviews.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`Preview ${index + 1}`}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Property'}
      </button>
    </form>
  );
};

export default CreatePropertyForm;
```

## 🎨 Image Preview Component

```jsx
const ImagePreview = ({ files }) => {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (files && files.length > 0) {
      const newPreviews = Array.from(files).map(file => 
        URL.createObjectURL(file)
      );
      setPreviews(newPreviews);

      // Cleanup
      return () => {
        newPreviews.forEach(url => URL.revokeObjectURL(url));
      };
    }
  }, [files]);

  return (
    <div className="image-preview-grid">
      {previews.map((url, index) => (
        <div key={index} className="preview-item">
          <img src={url} alt={`Preview ${index + 1}`} />
          <span>{files[index].name}</span>
        </div>
      ))}
    </div>
  );
};
```

## 📦 Using Axios (Alternative)

```javascript
import axios from 'axios';

const createProperty = async (formData, imageFiles) => {
  const data = new FormData();
  
  // Add fields
  Object.keys(formData).forEach(key => {
    if (Array.isArray(formData[key])) {
      data.append(key, JSON.stringify(formData[key]));
    } else {
      data.append(key, formData[key]);
    }
  });
  
  // Add images
  imageFiles.forEach(file => {
    data.append('images', file);
  });

  try {
    const response = await axios.post(
      'http://localhost:5000/api/admin/hostels',
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};
```

## 🎯 Key Points to Remember

1. **Don't set Content-Type header** when using FormData - the browser will set it automatically with the correct boundary.

2. **Arrays must be JSON strings**:
   ```javascript
   formData.append('amenities', JSON.stringify(['WiFi', 'AC']));
   ```

3. **Multiple files use the same field name**:
   ```javascript
   files.forEach(file => formData.append('images', file));
   ```

4. **Image URLs are relative paths**:
   ```javascript
   const fullUrl = `${API_BASE_URL}${imageUrl}`;
   // Example: http://localhost:5000/uploads/properties/image.jpg
   ```

5. **File validation**:
   - Max 10 images per request
   - Max 5MB per image
   - Only image formats: jpeg, jpg, png, gif, webp

## 🐛 Common Issues & Solutions

### Issue 1: "Content-Type boundary missing"
**Solution**: Don't set Content-Type header when using FormData

### Issue 2: "Images not uploading"
**Solution**: Make sure field name is 'images' (plural) and you're appending files, not file paths

### Issue 3: "Amenities showing as string"
**Solution**: Convert array to JSON string before appending:
```javascript
formData.append('amenities', JSON.stringify(amenitiesArray));
```

### Issue 4: "Images not displaying"
**Solution**: Prepend the API base URL to the image path:
```javascript
const imageUrl = `${API_BASE_URL}${property.images[0]}`;
```

## 📱 Mobile/Responsive Considerations

```jsx
// Allow camera on mobile devices
<input
  type="file"
  accept="image/*"
  capture="environment"  // Use rear camera
  multiple
  onChange={handleImageChange}
/>
```

## 🎨 Styling Tips

```css
/* File input styling */
.file-input {
  display: none;
}

.file-input-label {
  display: inline-block;
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.file-input-label:hover {
  background: #45a049;
}

/* Image preview grid */
.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.preview-item img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  border: 2px solid #ddd;
}
```

## ✅ Testing Checklist

- [ ] File input accepts multiple images
- [ ] Image previews display correctly
- [ ] Form submits with FormData instead of JSON
- [ ] Authorization token is included in headers
- [ ] Arrays (amenities) are sent as JSON strings
- [ ] Success response shows uploaded image URLs
- [ ] Uploaded images display correctly in property list
- [ ] Error handling works for file size/type validation
- [ ] Loading state shows during upload

## 🚀 Ready to Implement!

The backend is fully configured and ready. Just update your frontend code following the examples above, and you'll have a working image upload system!

For testing the API directly, use: `server/test-image-upload.html`
