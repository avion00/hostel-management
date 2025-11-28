import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String
  }],
  helpful: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Update hostel rating when review is added
reviewSchema.post('save', async function() {
  const Hostel = mongoose.model('Hostel');
  const hostel = await Hostel.findById(this.hostel);
  
  const reviews = await mongoose.model('Review').find({ hostel: this.hostel });
  const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  hostel.rating.average = avgRating;
  hostel.rating.count = reviews.length;
  await hostel.save();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
