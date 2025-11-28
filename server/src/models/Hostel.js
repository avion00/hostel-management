import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hostel name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  nearbyCollege: {
    name: String,
    distance: String
  },
  images: [{
    type: String
  }],
  roomTypes: [{
    type: {
      type: String,
      enum: ['Single Room', 'Shared Room', 'Dormitory'],
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    available: {
      type: Number,
      default: 0
    },
    features: [String]
  }],
  amenities: [{
    type: String,
    enum: ['WiFi', 'AC', 'Parking', 'Kitchen', 'Security', 'Gym', 'Laundry', 'Common Area', 'Study Room']
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  verified: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for search
hostelSchema.index({ name: 'text', 'location.city': 'text', 'location.address': 'text' });

const Hostel = mongoose.model('Hostel', hostelSchema);

export default Hostel;
