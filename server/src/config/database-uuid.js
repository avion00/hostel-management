import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generateUUID } from '../utils/uuid.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize SQLite database
const dbPath = join(__dirname, '../../database/hostel_management.db');
const db = new Database(dbPath, { verbose: console.log });

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables with UUID
const initDatabase = () => {
  try {
    // Users table
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
        failed_login_attempts INTEGER DEFAULT 0,
        locked_until DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Properties/Hostels table (Enhanced with UUID)
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

    // Room Types table
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
        is_available INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
      );
    `);

    // Bookings table
    db.exec(`
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        property_id TEXT NOT NULL,
        room_type_id TEXT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        duration_type TEXT NOT NULL CHECK(duration_type IN ('daily', 'weekly', 'monthly')) DEFAULT 'monthly',
        total_amount REAL NOT NULL,
        payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'partial', 'completed', 'refunded')),
        booking_status TEXT NOT NULL CHECK(booking_status IN ('pending', 'confirmed', 'cancelled', 'rejected', 'completed')) DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE
      );
    `);

    // Add additional booking detail columns if they don't exist
    const bookingExtraColumns = [
      "ALTER TABLE bookings ADD COLUMN duration_value INTEGER;",
      "ALTER TABLE bookings ADD COLUMN occupants INTEGER DEFAULT 1;",
      "ALTER TABLE bookings ADD COLUMN special_requests TEXT;",
      "ALTER TABLE bookings ADD COLUMN preferred_floor TEXT;",
      "ALTER TABLE bookings ADD COLUMN check_in_time TEXT;",
      "ALTER TABLE bookings ADD COLUMN sharing_preference TEXT;",
      "ALTER TABLE bookings ADD COLUMN payment_method TEXT;",
      "ALTER TABLE bookings ADD COLUMN pay_mode TEXT;",
      "ALTER TABLE bookings ADD COLUMN discount_code TEXT;",
      "ALTER TABLE bookings ADD COLUMN emergency_contact_name TEXT;",
      "ALTER TABLE bookings ADD COLUMN emergency_contact_phone TEXT;",
      "ALTER TABLE bookings ADD COLUMN emergency_contact_relation TEXT;",
      "ALTER TABLE bookings ADD COLUMN id_document_type TEXT;",
      "ALTER TABLE bookings ADD COLUMN id_document_number TEXT;",
      "ALTER TABLE bookings ADD COLUMN heard_from TEXT;",
      "ALTER TABLE bookings ADD COLUMN notes_internal TEXT;"
    ];

    for (const alterSql of bookingExtraColumns) {
      try {
        db.exec(alterSql);
      } catch (e) {
        // Column already exists, ignore
      }
    }

    // Payments table
    db.exec(`
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        booking_id TEXT NOT NULL,
        amount REAL NOT NULL,
        payment_gateway TEXT CHECK(payment_gateway IN ('khalti', 'esewa', 'fonepay', 'stripe', 'cash', 'bank_transfer')),
        transaction_id TEXT UNIQUE,
        status TEXT NOT NULL CHECK(status IN ('pending', 'success', 'failed', 'refunded')) DEFAULT 'pending',
        paid_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
      );
    `);

    // Reviews table
    db.exec(`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        property_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Notifications table
    db.exec(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('booking', 'payment', 'system', 'alert')),
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Subscription Plans table
    db.exec(`
      CREATE TABLE IF NOT EXISTS subscription_plans (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        duration_days INTEGER NOT NULL,
        max_hostels INTEGER NOT NULL DEFAULT 1,
        max_rooms INTEGER NOT NULL DEFAULT 10,
        features TEXT,
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // User Subscriptions table
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        plan_id TEXT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'expired', 'cancelled')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE CASCADE
      );
    `);

    // Documents table
    db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('citizenship', 'student_id', 'license', 'passport', 'other')),
        file_url TEXT NOT NULL,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
        remarks TEXT,
        verified_by TEXT,
        verified_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // CMS table
    db.exec(`
      CREATE TABLE IF NOT EXISTS cms (
        id TEXT PRIMARY KEY,
        banner_title TEXT,
        banner_subtitle TEXT,
        banner_image TEXT,
        about_us TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        contact_address TEXT,
        faq TEXT,
        terms TEXT,
        privacy_policy TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert default CMS data if not exists
    const cmsExists = db.prepare('SELECT COUNT(*) as count FROM cms').get();
    if (cmsExists.count === 0) {
      db.prepare(`
        INSERT INTO cms (id, banner_title, banner_subtitle, contact_email) 
        VALUES (?, ?, ?, ?);
      `).run(generateUUID(), 'Welcome to HostelHub', 'Find your perfect hostel accommodation', 'info@hostelhub.com');
    }

    // Refresh Tokens table
    db.exec(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Token Blacklist table
    db.exec(`
      CREATE TABLE IF NOT EXISTS token_blacklist (
        id TEXT PRIMARY KEY,
        token TEXT UNIQUE NOT NULL,
        user_id TEXT,
        reason TEXT,
        blacklisted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // Login Attempts table
    db.exec(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        ip_address TEXT,
        success INTEGER DEFAULT 0,
        attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better query performance
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_properties_manager ON properties(manager_id);
      CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(city);
      CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
      CREATE INDEX IF NOT EXISTS idx_room_types_property ON room_types(property_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_student ON bookings(student_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_property ON bookings(property_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
      CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
      CREATE INDEX IF NOT EXISTS idx_reviews_property ON reviews(property_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON user_subscriptions(user_id);
      CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);
      CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
      CREATE INDEX IF NOT EXISTS idx_token_blacklist_token ON token_blacklist(token);
      CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
    `);

    console.log('✅ SQLite Database initialized successfully with UUID');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// Initialize database on import
initDatabase();

export default db;
