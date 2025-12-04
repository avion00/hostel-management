// Migration script to add UUID columns to existing database
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database/hostel_management.db');
const db = new Database(dbPath);

console.log('🔄 Starting UUID migration...\n');

try {
  // Start transaction
  db.exec('BEGIN TRANSACTION');

  // Add UUID columns to all tables
  const tables = ['users', 'properties', 'rooms', 'bookings', 'payments', 'reviews', 'notifications', 'refresh_tokens', 'token_blacklist', 'login_attempts'];
  
  for (const table of tables) {
    try {
      console.log(`Adding uuid column to ${table}...`);
      db.exec(`ALTER TABLE ${table} ADD COLUMN uuid TEXT UNIQUE`);
      console.log(`✅ Added uuid column to ${table}`);
    } catch (e) {
      if (e.message.includes('duplicate column name')) {
        console.log(`⚠️  uuid column already exists in ${table}`);
      } else {
        throw e;
      }
    }
  }

  // Generate UUIDs for existing records
  for (const table of tables) {
    console.log(`\nGenerating UUIDs for ${table}...`);
    const rows = db.prepare(`SELECT id FROM ${table} WHERE uuid IS NULL`).all();
    
    const updateStmt = db.prepare(`UPDATE ${table} SET uuid = ? WHERE id = ?`);
    
    for (const row of rows) {
      const uuid = crypto.randomUUID();
      updateStmt.run(uuid, row.id);
    }
    
    console.log(`✅ Generated ${rows.length} UUIDs for ${table}`);
  }

  // Create indexes on UUID columns
  console.log('\n📊 Creating indexes on UUID columns...');
  for (const table of tables) {
    try {
      db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_${table}_uuid ON ${table}(uuid)`);
      console.log(`✅ Created index for ${table}.uuid`);
    } catch (e) {
      console.log(`⚠️  Index already exists for ${table}.uuid`);
    }
  }

  // Commit transaction
  db.exec('COMMIT');
  
  console.log('\n🎉 UUID migration completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Update your code to use UUIDs instead of integer IDs');
  console.log('2. Update API responses to return uuid field');
  console.log('3. Update frontend to use UUIDs');
  console.log('4. Test all endpoints');
  
} catch (error) {
  console.error('\n❌ Migration failed:', error);
  db.exec('ROLLBACK');
  process.exit(1);
} finally {
  db.close();
}
