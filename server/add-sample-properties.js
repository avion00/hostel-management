import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to database
const db = new Database(join(__dirname, 'database', 'hostel_management.db'));

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON');

// Generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

try {
  // Get a manager ID (or create one if needed)
  let managerId;
  const manager = db.prepare(`
    SELECT id FROM users WHERE role = 'manager' LIMIT 1
  `).get();
  
  if (manager) {
    managerId = manager.id;
  } else {
    // Get admin ID to use as manager
    const admin = db.prepare(`
      SELECT id FROM users WHERE role = 'admin' LIMIT 1
    `).get();
    managerId = admin ? admin.id : null;
  }
  
  if (!managerId) {
    console.error('No manager or admin found in database. Please run fix-admin-user.js first.');
    process.exit(1);
  }
  
  console.log('Using manager ID:', managerId);
  
  // Sample properties data
  const properties = [
    {
      name: 'Green Valley Student Hostel',
      description: 'Modern hostel with excellent facilities near major colleges. Perfect for students looking for a comfortable stay with all amenities.',
      address: 'Chowk Road, Near DU',
      city: 'Dharan',
      area: 'University Area',
      state: 'Province 1',
      pincode: '56700',
      near_college: 'Dharan University',
      total_rooms: 25,
      available_rooms: 10,
      total_beds: 50,
      available_beds: 20,
      price_starting: 8500,
      amenities: JSON.stringify(['WiFi', 'AC', 'Parking', 'Kitchen', 'Security', 'Common Area', 'Gym']),
      images: JSON.stringify([
        '/uploads/property1.jpg',
        '/uploads/property1-2.jpg',
        '/uploads/property1-3.jpg'
      ]),
      status: 'approved',
      is_active: 1
    },
    {
      name: 'Urban Living Hostel',
      description: 'Budget-friendly hostel with all basic amenities. Great community atmosphere for students from all backgrounds.',
      address: 'Main Road, City Center',
      city: 'Biratnagar',
      area: 'City Center',
      state: 'Province 1',
      pincode: '56613',
      near_college: 'Biratnagar College',
      total_rooms: 30,
      available_rooms: 15,
      total_beds: 90,
      available_beds: 45,
      price_starting: 6500,
      amenities: JSON.stringify(['WiFi', 'Kitchen', 'Security', 'Common Area']),
      images: JSON.stringify([
        '/uploads/property2.jpg',
        '/uploads/property2-2.jpg'
      ]),
      status: 'approved',
      is_active: 1
    },
    {
      name: 'Student Paradise',
      description: 'Affordable dormitory-style accommodation perfect for budget-conscious students. Clean, safe, and well-maintained.',
      address: 'Lake Side, Tourist Area',
      city: 'Pokhara',
      area: 'Lakeside',
      state: 'Gandaki',
      pincode: '33700',
      near_college: 'Pokhara University',
      total_rooms: 20,
      available_rooms: 8,
      total_beds: 80,
      available_beds: 32,
      price_starting: 5000,
      amenities: JSON.stringify(['WiFi', 'Security', 'Common Area']),
      images: JSON.stringify([
        '/uploads/property3.jpg'
      ]),
      status: 'approved',
      is_active: 1
    },
    {
      name: 'Elite Student Residence',
      description: 'Premium student accommodation with single rooms, attached bathrooms, and study areas. Perfect for serious students.',
      address: 'Education Hub, Ring Road',
      city: 'Kathmandu',
      area: 'Baneshwor',
      state: 'Bagmati',
      pincode: '44600',
      near_college: 'Tribhuvan University',
      total_rooms: 40,
      available_rooms: 12,
      total_beds: 40,
      available_beds: 12,
      price_starting: 12000,
      amenities: JSON.stringify(['WiFi', 'AC', 'Parking', 'Kitchen', 'Security', 'Gym', 'Common Area']),
      images: JSON.stringify([
        '/uploads/property4.jpg',
        '/uploads/property4-2.jpg',
        '/uploads/property4-3.jpg',
        '/uploads/property4-4.jpg'
      ]),
      status: 'approved',
      is_active: 1
    },
    {
      name: 'Cozy Corner Hostel',
      description: 'Small, homely hostel with a friendly atmosphere. Perfect for students who want a home away from home.',
      address: 'College Road',
      city: 'Butwal',
      area: 'College Area',
      state: 'Lumbini',
      pincode: '32907',
      near_college: 'Butwal Multiple Campus',
      total_rooms: 15,
      available_rooms: 5,
      total_beds: 30,
      available_beds: 10,
      price_starting: 4500,
      amenities: JSON.stringify(['WiFi', 'Kitchen', 'Security']),
      images: JSON.stringify([
        '/uploads/property5.jpg',
        '/uploads/property5-2.jpg'
      ]),
      status: 'approved',
      is_active: 1
    }
  ];
  
  // Insert properties
  const insertStmt = db.prepare(`
    INSERT INTO properties (
      id, manager_id, name, description, address, city, area, state, pincode,
      near_college, total_rooms, available_rooms, total_beds, available_beds,
      price_starting, amenities, images, status, is_active, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')
    )
  `);
  
  let addedCount = 0;
  
  for (const property of properties) {
    const propertyId = generateUUID();
    
    try {
      insertStmt.run(
        propertyId,
        managerId,
        property.name,
        property.description,
        property.address,
        property.city,
        property.area,
        property.state,
        property.pincode,
        property.near_college,
        property.total_rooms,
        property.available_rooms,
        property.total_beds,
        property.available_beds,
        property.price_starting,
        property.amenities,
        property.images,
        property.status,
        property.is_active
      );
      
      console.log(`✅ Added property: ${property.name} (ID: ${propertyId})`);
      
      // Add some sample rooms for this property
      const roomTypes = [
        { name: 'Single Room', price: property.price_starting, capacity: 1, available: true },
        { name: 'Double Room', price: property.price_starting * 0.7, capacity: 2, available: true },
        { name: 'Triple Room', price: property.price_starting * 0.5, capacity: 3, available: false }
      ];
      
      const roomStmt = db.prepare(`
        INSERT INTO rooms (
          id, property_id, room_number, room_type, capacity, price, is_available, 
          has_ac, has_bathroom, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `);
      
      roomTypes.forEach((room, index) => {
        const roomId = generateUUID();
        try {
          roomStmt.run(
            roomId,
            propertyId,
            `${101 + index}`,
            room.name,
            room.capacity,
            room.price,
            room.available ? 1 : 0,
            property.amenities.includes('AC') ? 1 : 0,
            room.name === 'Single Room' ? 1 : 0
          );
        } catch (err) {
          // Room table might not exist, skip
        }
      });
      
      addedCount++;
    } catch (err) {
      console.log(`Property ${property.name} might already exist, skipping...`);
    }
  }
  
  // List all properties
  console.log('\n📋 All properties in database:');
  const allProperties = db.prepare(`
    SELECT id, name, city, price_starting, status, is_active 
    FROM properties
  `).all();
  
  console.table(allProperties);
  console.log(`\n✅ Successfully added ${addedCount} new properties!`);
  
} catch (error) {
  console.error('Error:', error);
} finally {
  db.close();
}
