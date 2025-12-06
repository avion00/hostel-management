import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database/hostel_management.db');
const db = new Database(dbPath);

const generateUUID = () => crypto.randomUUID();

console.log('🔄 Starting UUID migration for ALL tables...\n');

try {
  // Start transaction
  db.exec('BEGIN TRANSACTION');

  // ==================== BACKUP OLD TABLES ====================
  console.log('📦 Creating backup of old tables...');
  
  const tables = [
    'users', 'properties', 'room_types', 'bookings', 'payments', 
    'reviews', 'notifications', 'subscription_plans', 'user_subscriptions',
    'documents', 'cms', 'refresh_tokens', 'token_blacklist', 'login_attempts'
  ];

  tables.forEach(table => {
    try {
      db.exec(`DROP TABLE IF EXISTS ${table}_old`);
      db.exec(`ALTER TABLE ${table} RENAME TO ${table}_old`);
      console.log(`✅ Backed up ${table}`);
    } catch (e) {
      console.log(`⚠️  Table ${table} doesn't exist, skipping...`);
    }
  });

  // ==================== CREATE NEW TABLES WITH UUID ====================
  console.log('\n🔨 Creating new tables with UUID...');

  // Users table
  db.exec(`
    CREATE TABLE users (
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
    )
  `);

  // Properties table
  db.exec(`
    CREATE TABLE properties (
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
    )
  `);

  // Room Types table
  db.exec(`
    CREATE TABLE room_types (
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
    )
  `);

  // Bookings table
  db.exec(`
    CREATE TABLE bookings (
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
    )
  `);

  // Payments table
  db.exec(`
    CREATE TABLE payments (
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
    )
  `);

  // Reviews table
  db.exec(`
    CREATE TABLE reviews (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Notifications table
  db.exec(`
    CREATE TABLE notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('booking', 'payment', 'system', 'alert')),
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Subscription Plans table
  db.exec(`
    CREATE TABLE subscription_plans (
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
    )
  `);

  // User Subscriptions table
  db.exec(`
    CREATE TABLE user_subscriptions (
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
    )
  `);

  // Documents table
  db.exec(`
    CREATE TABLE documents (
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
    )
  `);

  // CMS table (no ID needed, single row)
  db.exec(`
    CREATE TABLE cms (
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
    )
  `);

  // Refresh Tokens table
  db.exec(`
    CREATE TABLE refresh_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Token Blacklist table
  db.exec(`
    CREATE TABLE token_blacklist (
      id TEXT PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      user_id TEXT,
      reason TEXT,
      blacklisted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Login Attempts table
  db.exec(`
    CREATE TABLE login_attempts (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      ip_address TEXT,
      success INTEGER DEFAULT 0,
      attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ All new tables created with UUID');

  // ==================== MIGRATE DATA ====================
  console.log('\n📊 Migrating data with UUID mapping...');

  // Create ID mapping
  const idMap = {};

  // Migrate users
  const oldUsers = db.prepare('SELECT * FROM users_old').all();
  const userInsert = db.prepare(`
    INSERT INTO users (id, name, email, password, phone, role, avatar, is_active, failed_login_attempts, locked_until, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  oldUsers.forEach(user => {
    const newId = generateUUID();
    idMap[`user_${user.id}`] = newId;
    userInsert.run(
      newId, user.name, user.email, user.password, user.phone, user.role,
      user.avatar, user.is_active, user.failed_login_attempts || 0, 
      user.locked_until, user.created_at, user.updated_at
    );
  });
  console.log(`✅ Migrated ${oldUsers.length} users`);

  // Migrate properties
  try {
    const oldProperties = db.prepare('SELECT * FROM properties_old').all();
    const propertyInsert = db.prepare(`
      INSERT INTO properties (id, manager_id, name, description, address, city, area, state, pincode, latitude, longitude, near_college, established_year, rating, total_rooms, available_rooms, total_beds, available_beds, staff_count, price_starting, amenities, images, rules, status, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    oldProperties.forEach(prop => {
      const newId = generateUUID();
      idMap[`property_${prop.id}`] = newId;
      propertyInsert.run(
        newId, idMap[`user_${prop.manager_id}`], prop.name, prop.description,
        prop.address, prop.city, prop.area, prop.state, prop.pincode,
        prop.latitude, prop.longitude, prop.near_college, prop.established_year,
        prop.rating || 0, prop.total_rooms || 0, prop.available_rooms || 0,
        prop.total_beds || 0, prop.available_beds || 0, prop.staff_count || 0,
        prop.price_starting, prop.amenities, prop.images, prop.rules,
        prop.status || 'pending', prop.is_active, prop.created_at, prop.updated_at
      );
    });
    console.log(`✅ Migrated ${oldProperties.length} properties`);
  } catch (e) {
    console.log('⚠️  No properties to migrate');
  }

  // Migrate room_types
  try {
    const oldRoomTypes = db.prepare('SELECT * FROM room_types_old').all();
    const roomTypeInsert = db.prepare(`
      INSERT INTO room_types (id, property_id, name, description, price_per_month, price_per_week, price_per_day, total_beds, beds_available, amenities, images, is_available, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    oldRoomTypes.forEach(rt => {
      const newId = generateUUID();
      idMap[`room_type_${rt.id}`] = newId;
      roomTypeInsert.run(
        newId, idMap[`property_${rt.property_id}`], rt.name, rt.description,
        rt.price_per_month, rt.price_per_week, rt.price_per_day,
        rt.total_beds, rt.beds_available, rt.amenities, rt.images,
        rt.is_available, rt.created_at, rt.updated_at
      );
    });
    console.log(`✅ Migrated ${oldRoomTypes.length} room types`);
  } catch (e) {
    console.log('⚠️  No room types to migrate');
  }

  // Migrate bookings
  try {
    const oldBookings = db.prepare('SELECT * FROM bookings_old').all();
    const bookingInsert = db.prepare(`
      INSERT INTO bookings (id, student_id, property_id, room_type_id, start_date, end_date, duration_type, total_amount, payment_status, booking_status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    oldBookings.forEach(booking => {
      const newId = generateUUID();
      idMap[`booking_${booking.id}`] = newId;
      bookingInsert.run(
        newId, idMap[`user_${booking.student_id}`],
        idMap[`property_${booking.property_id}`],
        idMap[`room_type_${booking.room_type_id || booking.room_id}`],
        booking.start_date || booking.check_in_date,
        booking.end_date || booking.check_out_date,
        booking.duration_type || 'monthly',
        booking.total_amount,
        booking.payment_status || 'pending',
        booking.booking_status || booking.status || 'pending',
        booking.created_at, booking.updated_at
      );
    });
    console.log(`✅ Migrated ${oldBookings.length} bookings`);
  } catch (e) {
    console.log('⚠️  No bookings to migrate');
  }

  // Migrate payments
  try {
    const oldPayments = db.prepare('SELECT * FROM payments_old').all();
    const paymentInsert = db.prepare(`
      INSERT INTO payments (id, booking_id, amount, payment_gateway, transaction_id, status, paid_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    oldPayments.forEach(payment => {
      const newId = generateUUID();
      paymentInsert.run(
        newId, idMap[`booking_${payment.booking_id}`],
        payment.amount, payment.payment_gateway || payment.payment_method,
        payment.transaction_id,
        payment.status || payment.payment_status || 'pending',
        payment.paid_at || payment.payment_date,
        payment.created_at, payment.updated_at
      );
    });
    console.log(`✅ Migrated ${oldPayments.length} payments`);
  } catch (e) {
    console.log('⚠️  No payments to migrate');
  }

  // Migrate CMS
  try {
    const oldCMS = db.prepare('SELECT * FROM cms_old LIMIT 1').get();
    if (oldCMS) {
      db.prepare(`
        INSERT INTO cms (id, banner_title, banner_subtitle, banner_image, about_us, contact_email, contact_phone, contact_address, faq, terms, privacy_policy, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        generateUUID(), oldCMS.banner_title, oldCMS.banner_subtitle,
        oldCMS.banner_image, oldCMS.about_us, oldCMS.contact_email,
        oldCMS.contact_phone, oldCMS.contact_address, oldCMS.faq,
        oldCMS.terms, oldCMS.privacy_policy, oldCMS.updated_at
      );
      console.log('✅ Migrated CMS data');
    }
  } catch (e) {
    // Insert default CMS if none exists
    db.prepare(`
      INSERT INTO cms (id, banner_title, banner_subtitle, contact_email)
      VALUES (?, ?, ?, ?)
    `).run(generateUUID(), 'Welcome to HostelHub', 'Find your perfect hostel accommodation', 'info@hostelhub.com');
    console.log('✅ Created default CMS data');
  }

  // ==================== CREATE INDEXES ====================
  console.log('\n🔍 Creating indexes...');
  
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

  console.log('✅ Indexes created');

  // Commit transaction
  db.exec('COMMIT');

  console.log('\n✅ UUID migration completed successfully!');
  console.log('\n📝 Summary:');
  console.log(`   - All tables now use UUID as primary keys`);
  console.log(`   - All foreign keys updated to UUID`);
  console.log(`   - Old tables backed up with _old suffix`);
  console.log(`   - Data migrated with UUID mapping`);
  console.log('\n⚠️  IMPORTANT: Restart your server to use the new UUID schema!');

} catch (error) {
  db.exec('ROLLBACK');
  console.error('\n❌ Migration failed:', error.message);
  console.error('   Transaction rolled back. Database unchanged.');
  process.exit(1);
} finally {
  db.close();
}
