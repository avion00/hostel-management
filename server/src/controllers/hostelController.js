import Hostel from '../models/Hostel.js';

// @desc    Get all hostels with filters
// @route   GET /api/hostels
// @access  Public
export const getHostels = async (req, res) => {
  try {
    const { 
      search, 
      city, 
      minPrice, 
      maxPrice, 
      roomType, 
      amenities,
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    let query = { status: 'active' };

    // Search by name or location
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by city
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query['roomTypes.price'] = {};
      if (minPrice) query['roomTypes.price'].$gte = Number(minPrice);
      if (maxPrice) query['roomTypes.price'].$lte = Number(maxPrice);
    }

    // Filter by room type
    if (roomType) {
      query['roomTypes.type'] = roomType;
    }

    // Filter by amenities
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      query.amenities = { $all: amenitiesArray };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const hostels = await Hostel.find(query)
      .populate('owner', 'name email phone')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Hostel.countDocuments(query);

    res.json({
      success: true,
      data: hostels,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get single hostel
// @route   GET /api/hostels/:id
// @access  Public
export const getHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name avatar' }
      });

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    res.json({
      success: true,
      data: hostel
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Create new hostel
// @route   POST /api/hostels
// @access  Private (Partner/Admin)
export const createHostel = async (req, res) => {
  try {
    req.body.owner = req.user.id;
    
    const hostel = await Hostel.create(req.body);

    res.status(201).json({
      success: true,
      data: hostel
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update hostel
// @route   PUT /api/hostels/:id
// @access  Private (Owner/Admin)
export const updateHostel = async (req, res) => {
  try {
    let hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    // Check ownership
    if (hostel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this hostel' });
    }

    hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: hostel
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Delete hostel
// @route   DELETE /api/hostels/:id
// @access  Private (Owner/Admin)
export const deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    // Check ownership
    if (hostel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this hostel' });
    }

    await hostel.deleteOne();

    res.json({
      success: true,
      message: 'Hostel deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get featured hostels
// @route   GET /api/hostels/featured
// @access  Public
export const getFeaturedHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ featured: true, status: 'active' })
      .limit(6)
      .sort('-rating.average');

    res.json({
      success: true,
      data: hostels
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
