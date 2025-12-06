import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { generateUUID } from './src/utils/uuid.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Backup existing database
const dbPath = path.join(__dirname, 'hostel_management.db');
if (fs.existsSync(dbPath)) {
  const backupPath = path.join(__dirname, `hostel_management_backup_${Date.now()}.db`);
  fs.copyFileSync(dbPath, backupPath);
  console.log(`✅ Database backed up to: ${backupPath}`);
  
  // Delete old database
  fs.unlinkSync(dbPath);
  console.log('✅ Old database removed');
}

// Create new database
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

console.log('Creating new database schema...');

// Create users table with UUID
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK(role IN ('student', 'manager', 'admin')),
    avatar TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create properties table with UUID
db.exec(`
  CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY,
    manager_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    area TEXT,
    state TEXT,
    pincode TEXT,
    latitude REAL,
    longitude REAL,
    near_college TEXT,
    established_year INTEGER,
    rating REAL DEFAULT 0,
    total_rooms INTEGER DEFAULT 0,
    available_rooms INTEGER DEFAULT 0,
    total_beds INTEGER DEFAULT 0,
    available_beds INTEGER DEFAULT 0,
    staff_count INTEGER DEFAULT 0,
    price_starting REAL,
    amenities TEXT,
    images TEXT,
    rules TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Create room_types table
db.exec(`
  CREATE TABLE IF NOT EXISTS room_types (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price_per_month REAL NOT NULL,
    price_per_week REAL,
    price_per_day REAL,
    total_beds INTEGER NOT NULL DEFAULT 0,
    beds_available INTEGER NOT NULL DEFAULT 0,
    amenities TEXT,
    images TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
  );
`);

// Create bookings table
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL,
    room_type_id TEXT,
    user_id TEXT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    booking_status TEXT DEFAULT 'pending' CHECK(booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'refunded')),
    total_amount REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (room_type_id) REFERENCES room_types(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Create payments table
db.exec(`
  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT,
    transaction_id TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'success', 'failed', 'refunded')),
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
  );
`);

// Create reviews table
db.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

console.log('✅ Tables created successfully');

// Insert default admin user
const adminId = generateUUID();
const hashedPassword = bcrypt.hashSync('admin123', 10);

db.prepare(`
  INSERT INTO users (id, name, email, password, phone, role, is_active)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  adminId,
  'Super Admin',
  'admin@hostel.com',
  hashedPassword,
  '9876543210',
  'admin',
  1
);

console.log('✅ Default admin user created');
console.log('   Email: admin@hostel.com');
console.log('   Password: admin123');

// Insert sample manager
const managerId = generateUUID();
const managerPassword = bcrypt.hashSync('manager123', 10);

db.prepare(`
  INSERT INTO users (id, name, email, password, phone, role, is_active)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  managerId,
  'John Manager',
  'manager@hostel.com',
  managerPassword,
  '9876543211',
  'manager',
  1
);

console.log('✅ Sample manager created');
console.log('   Email: manager@hostel.com');
console.log('   Password: manager123');

// Insert sample student
const studentId = generateUUID();
const studentPassword = bcrypt.hashSync('student123', 10);

db.prepare(`
  INSERT INTO users (id, name, email, password, phone, role, is_active)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  studentId,
  'Alice Student',
  'student@hostel.com',
  studentPassword,
  '9876543212',
  'student',
  1
);

console.log('✅ Sample student created');
console.log('   Email: student@hostel.com');
console.log('   Password: student123');

db.close();
console.log('\n✅ Database reset complete!');
console.log('You can now restart the server and use the application.');
