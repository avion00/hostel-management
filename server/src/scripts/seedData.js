import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Hostel from '../models/Hostel.js';
import connectDatabase from '../config/database.js';

dotenv.config();

const sampleHostels = [
  {
    name: "Green Valley Student Hostel",
    description: "Modern hostel with excellent facilities near major colleges. Perfect for students looking for a comfortable stay.",
    location: {
      address: "Chowk Road, Near DU",
      city: "Dharan",
      state: "Province 1",
      pincode: "56700",
      coordinates: { lat: 26.8124, lng: 87.2847 }
    },
    nearbyCollege: {
      name: "Dharan University",
      distance: "0.5 km"
    },
    images: [
      "https://media.designcafe.com/wp-content/uploads/2023/07/05141750/aesthetic-room-decor.jpg"
    ],
    roomTypes: [
      {
        type: "Single Room",
        price: 8500,
        available: 5,
        features: ["Private bathroom", "Study desk", "Wi-Fi", "AC"]
      },
      {
        type: "Shared Room",
        price: 5000,
        available: 10,
        features: ["2-3 sharing", "Common bathroom", "Wi-Fi", "Study area"]
      }
    ],
    amenities: ["WiFi", "AC", "Parking", "Kitchen", "Security"],
    rating: { average: 4.8, count: 124 },
    verified: true,
    featured: true,
    status: "active"
  },
  {
    name: "Urban Living Hostel",
    description: "Budget-friendly hostel with all basic amenities. Great community atmosphere for students.",
    location: {
      address: "Main Road, City Center",
      city: "Biratnagar",
      state: "Province 1",
      pincode: "56613",
      coordinates: { lat: 26.4525, lng: 87.2718 }
    },
    nearbyCollege: {
      name: "Biratnagar College",
      distance: "1.2 km"
    },
    images: [
      "https://i.pinimg.com/736x/2e/92/57/2e9257f6c7d679ee0d0dfdd5636bd327.jpg"
    ],
    roomTypes: [
      {
        type: "Shared Room",
        price: 6500,
        available: 8,
        features: ["2-3 sharing", "Common bathroom", "Wi-Fi", "Study area"]
      },
      {
        type: "Dormitory",
        price: 3500,
        available: 15,
        features: ["6-8 sharing", "Common facilities", "Wi-Fi", "Locker"]
      }
    ],
    amenities: ["WiFi", "Kitchen", "Security", "Common Area"],
    rating: { average: 4.6, count: 89 },
    verified: true,
    featured: true,
    status: "active"
  },
  {
    name: "Student Paradise",
    description: "Affordable dormitory-style accommodation perfect for budget-conscious students.",
    location: {
      address: "Lake Side, Tourist Area",
      city: "Pokhara",
      state: "Gandaki",
      pincode: "33700",
      coordinates: { lat: 28.2096, lng: 83.9856 }
    },
    nearbyCollege: {
      name: "Pokhara University",
      distance: "2.1 km"
    },
    images: [
      "https://i.pinimg.com/564x/fe/ce/52/fece5293cef4572b965d41eda2de8a32.jpg"
    ],
    roomTypes: [
      {
        type: "Dormitory",
        price: 4200,
        available: 20,
        features: ["6-8 sharing", "Common facilities", "Wi-Fi", "Locker"]
      }
    ],
    amenities: ["WiFi", "Common Area", "Security"],
    rating: { average: 4.4, count: 67 },
    verified: true,
    featured: false,
    status: "active"
  },
  {
    name: "Elite Student Residence",
    description: "Premium hostel with luxury amenities. Perfect for students who want the best facilities.",
    location: {
      address: "Thamel, Central District",
      city: "Kathmandu",
      state: "Bagmati",
      pincode: "44600",
      coordinates: { lat: 27.7172, lng: 85.3240 }
    },
    nearbyCollege: {
      name: "Tribhuvan University",
      distance: "1.8 km"
    },
    images: [
      "https://media.istockphoto.com/id/484706362/photo/luxurious-living-room-in-new-home.jpg?s=612x612&w=0&k=20&c=4puAmBhX-a303hlxZzTy2ZXmN70FE0GOmDILDGZxq5Y="
    ],
    roomTypes: [
      {
        type: "Single Room",
        price: 12000,
        available: 3,
        features: ["Private bathroom", "Study desk", "Wi-Fi", "AC", "Mini fridge"]
      }
    ],
    amenities: ["WiFi", "AC", "Parking", "Kitchen", "Gym", "Security", "Laundry"],
    rating: { average: 4.9, count: 156 },
    verified: true,
    featured: true,
    status: "active"
  }
];

const seedDatabase = async () => {
  try {
    await connectDatabase();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Hostel.deleteMany({});
    await User.deleteMany({});

    // Create sample partner user
    console.log('👤 Creating sample users...');
    const partner = await User.create({
      name: "John Partner",
      email: "partner@example.com",
      password: "password123",
      phone: "9876543210",
      role: "partner",
      verified: true
    });

    const student = await User.create({
      name: "Jane Student",
      email: "student@example.com",
      password: "password123",
      phone: "9876543211",
      role: "student",
      college: "Dharan University",
      verified: true
    });

    console.log('✅ Users created');

    // Create hostels
    console.log('🏠 Creating sample hostels...');
    const hostelsWithOwner = sampleHostels.map(hostel => ({
      ...hostel,
      owner: partner._id
    }));

    await Hostel.insertMany(hostelsWithOwner);
    console.log('✅ Hostels created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Sample Credentials:');
    console.log('Partner: partner@example.com / password123');
    console.log('Student: student@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
