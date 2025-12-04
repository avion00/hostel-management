import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import db from '../config/database.js';

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
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    db.prepare('DELETE FROM notifications').run();
    db.prepare('DELETE FROM reviews').run();
    db.prepare('DELETE FROM payments').run();
    db.prepare('DELETE FROM bookings').run();
    db.prepare('DELETE FROM rooms').run();
    db.prepare('DELETE FROM properties').run();
    db.prepare('DELETE FROM users').run();
    console.log('✅ Existing data cleared\n');

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create sample users
    console.log('👤 Creating sample users...');
    
    // Admin user
    const adminStmt = db.prepare(`
      INSERT INTO users (name, email, password, phone, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    const adminResult = adminStmt.run('Super Admin', 'admin@hostel.com', hashedPassword, '9876543210', 'admin');
    console.log('  ✓ Admin created');

    // Manager users
    const managerStmt = db.prepare(`
      INSERT INTO users (name, email, password, phone, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    const manager1Result = managerStmt.run('John Manager', 'manager1@hostel.com', hashedPassword, '9876543211', 'manager');
    const manager2Result = managerStmt.run('Sarah Manager', 'manager2@hostel.com', hashedPassword, '9876543212', 'manager');
    const manager3Result = managerStmt.run('Mike Manager', 'manager3@hostel.com', hashedPassword, '9876543213', 'manager');
    console.log('  ✓ 3 Managers created');

    // Student users
    const studentStmt = db.prepare(`
      INSERT INTO users (name, email, password, phone, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    const student1Result = studentStmt.run('Alice Student', 'student1@example.com', hashedPassword, '9876543214', 'student');
    const student2Result = studentStmt.run('Bob Student', 'student2@example.com', hashedPassword, '9876543215', 'student');
    const student3Result = studentStmt.run('Charlie Student', 'student3@example.com', hashedPassword, '9876543216', 'student');
    console.log('  ✓ 3 Students created\n');

    // Create properties
    console.log('🏠 Creating sample properties...');
    const propertyStmt = db.prepare(`
      INSERT INTO properties (
        manager_id, name, description, address, city, state, pincode,
        latitude, longitude, near_college, total_rooms, available_rooms,
        amenities, images, price_per_month
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const properties = [
      {
        manager_id: manager1Result.lastInsertRowid,
        name: 'Green Valley Student Hostel',
        description: 'Modern hostel with excellent facilities near major colleges. Perfect for students looking for a comfortable stay.',
        address: 'Chowk Road, Near DU',
        city: 'Dharan',
        state: 'Province 1',
        pincode: '56700',
        latitude: 26.8124,
        longitude: 87.2847,
        near_college: 'Dharan University',
        total_rooms: 15,
        available_rooms: 15,
        amenities: JSON.stringify(['WiFi', 'AC', 'Parking', 'Kitchen', 'Security', 'Laundry']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800']),
        price_per_month: 8500
      },
      {
        manager_id: manager1Result.lastInsertRowid,
        name: 'Urban Living Hostel',
        description: 'Budget-friendly hostel with all basic amenities. Great community atmosphere for students.',
        address: 'Main Road, City Center',
        city: 'Biratnagar',
        state: 'Province 1',
        pincode: '56613',
        latitude: 26.4525,
        longitude: 87.2718,
        near_college: 'Biratnagar College',
        total_rooms: 20,
        available_rooms: 20,
        amenities: JSON.stringify(['WiFi', 'Kitchen', 'Security', 'Common Area']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800']),
        price_per_month: 6500
      },
      {
        manager_id: manager2Result.lastInsertRowid,
        name: 'Student Paradise',
        description: 'Affordable accommodation perfect for budget-conscious students.',
        address: 'Lake Side, Tourist Area',
        city: 'Pokhara',
        state: 'Gandaki',
        pincode: '33700',
        latitude: 28.2096,
        longitude: 83.9856,
        near_college: 'Pokhara University',
        total_rooms: 25,
        available_rooms: 25,
        amenities: JSON.stringify(['WiFi', 'Common Area', 'Security', 'Study Room']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800']),
        price_per_month: 5000
      },
      {
        manager_id: manager2Result.lastInsertRowid,
        name: 'Elite Student Residence',
        description: 'Premium hostel with luxury amenities. Perfect for students who want the best facilities.',
        address: 'Thamel, Central District',
        city: 'Kathmandu',
        state: 'Bagmati',
        pincode: '44600',
        latitude: 27.7172,
        longitude: 85.3240,
        near_college: 'Tribhuvan University',
        total_rooms: 10,
        available_rooms: 10,
        amenities: JSON.stringify(['WiFi', 'AC', 'Parking', 'Kitchen', 'Gym', 'Security', 'Laundry', 'Swimming Pool']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800']),
        price_per_month: 12000
      },
      {
        manager_id: manager3Result.lastInsertRowid,
        name: 'City Center Hostel',
        description: 'Conveniently located hostel in the heart of the city with easy access to colleges.',
        address: 'New Road, Downtown',
        city: 'Kathmandu',
        state: 'Bagmati',
        pincode: '44600',
        latitude: 27.7025,
        longitude: 85.3156,
        near_college: 'Kathmandu University',
        total_rooms: 18,
        available_rooms: 18,
        amenities: JSON.stringify(['WiFi', 'Security', 'Common Area', 'Kitchen']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800']),
        price_per_month: 7000
      }
    ];

    const propertyIds = [];
    properties.forEach(prop => {
      const result = propertyStmt.run(
        prop.manager_id, prop.name, prop.description, prop.address, prop.city,
        prop.state, prop.pincode, prop.latitude, prop.longitude, prop.near_college,
        prop.total_rooms, prop.available_rooms, prop.amenities, prop.images, prop.price_per_month
      );
      propertyIds.push(result.lastInsertRowid);
    });
    console.log(`  ✓ ${properties.length} Properties created\n`);

    // Create rooms for each property
    console.log('🚪 Creating rooms...');
    const roomStmt = db.prepare(`
      INSERT INTO rooms (property_id, room_number, room_type, floor, capacity, price_per_month, amenities)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    let totalRooms = 0;
    propertyIds.forEach((propId, index) => {
      const roomCount = properties[index].total_rooms;
      const roomTypes = ['single', 'double', 'triple', 'quad'];
      
      for (let i = 1; i <= roomCount; i++) {
        const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
        const capacity = roomType === 'single' ? 1 : roomType === 'double' ? 2 : roomType === 'triple' ? 3 : 4;
        const floor = Math.floor((i - 1) / 5) + 1;
        const roomNumber = `${floor}0${i % 10 || 10}`;
        const amenities = JSON.stringify(['Bed', 'Study Table', 'Wardrobe', 'Fan']);
        
        roomStmt.run(propId, roomNumber, roomType, floor, capacity, properties[index].price_per_month, amenities);
        totalRooms++;
      }
    });
    console.log(`  ✓ ${totalRooms} Rooms created\n`);

    // Create sample bookings
    console.log('📅 Creating sample bookings...');
    const bookingStmt = db.prepare(`
      INSERT INTO bookings (student_id, property_id, room_id, check_in_date, status, total_amount)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const room1 = db.prepare('SELECT id FROM rooms WHERE property_id = ? LIMIT 1').get(propertyIds[0]);
    const room2 = db.prepare('SELECT id FROM rooms WHERE property_id = ? LIMIT 1 OFFSET 1').get(propertyIds[1]);
    
    const booking1 = bookingStmt.run(
      student1Result.lastInsertRowid,
      propertyIds[0],
      room1.id,
      '2024-12-01',
      'active',
      8500 * 6
    );

    const booking2 = bookingStmt.run(
      student2Result.lastInsertRowid,
      propertyIds[1],
      room2.id,
      '2024-12-15',
      'confirmed',
      6500 * 6
    );

    // Update room occupancy
    db.prepare('UPDATE rooms SET occupied = 1, is_available = 0 WHERE id = ?').run(room1.id);
    db.prepare('UPDATE rooms SET occupied = 1, is_available = 0 WHERE id = ?').run(room2.id);
    db.prepare('UPDATE properties SET available_rooms = available_rooms - 1 WHERE id = ?').run(propertyIds[0]);
    db.prepare('UPDATE properties SET available_rooms = available_rooms - 1 WHERE id = ?').run(propertyIds[1]);
    
    console.log('  ✓ 2 Bookings created\n');

    // Create sample payments
    console.log('💳 Creating sample payments...');
    const paymentStmt = db.prepare(`
      INSERT INTO payments (booking_id, student_id, amount, payment_method, payment_status, transaction_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    paymentStmt.run(booking1.lastInsertRowid, student1Result.lastInsertRowid, 8500, 'upi', 'completed', 'TXN001234567');
    paymentStmt.run(booking2.lastInsertRowid, student2Result.lastInsertRowid, 6500, 'card', 'completed', 'TXN001234568');
    console.log('  ✓ 2 Payments created\n');

    // Create sample reviews
    console.log('⭐ Creating sample reviews...');
    const reviewStmt = db.prepare(`
      INSERT INTO reviews (property_id, student_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `);

    reviewStmt.run(propertyIds[0], student1Result.lastInsertRowid, 5, 'Excellent hostel with great facilities!');
    reviewStmt.run(propertyIds[1], student2Result.lastInsertRowid, 4, 'Good value for money. Friendly staff.');
    console.log('  ✓ 2 Reviews created\n');

    // Create sample notifications
    console.log('🔔 Creating sample notifications...');
    const notificationStmt = db.prepare(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (?, ?, ?, ?)
    `);

    notificationStmt.run(student1Result.lastInsertRowid, 'Booking Confirmed', 'Your booking has been confirmed for Green Valley Student Hostel', 'booking');
    notificationStmt.run(manager1Result.lastInsertRowid, 'New Booking', 'New booking received for Green Valley Student Hostel', 'booking');
    console.log('  ✓ 2 Notifications created\n');

    console.log('🎉 Database seeded successfully!\n');
    console.log('📝 Sample Credentials:\n');
    console.log('  Admin:    admin@hostel.com / password123');
    console.log('  Manager1: manager1@hostel.com / password123');
    console.log('  Manager2: manager2@hostel.com / password123');
    console.log('  Manager3: manager3@hostel.com / password123');
    console.log('  Student1: student1@example.com / password123');
    console.log('  Student2: student2@example.com / password123');
    console.log('  Student3: student3@example.com / password123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
