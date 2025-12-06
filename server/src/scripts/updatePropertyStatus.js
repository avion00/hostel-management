import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
const db = new Database(path.join(__dirname, '../../hostel_management.db'));

try {
  // First, let's check the current schema
  const tableInfo = db.prepare("PRAGMA table_info(properties)").all();
  console.log('Current properties table schema:');
  const statusColumn = tableInfo.find(col => col.name === 'status');
  console.log('Status column:', statusColumn);

  // Drop the existing CHECK constraint and recreate the table with updated constraint
  // SQLite doesn't support ALTER TABLE to modify constraints, so we need to recreate
  
  console.log('\nCreating new properties table with updated status constraint...');
  
  // Begin transaction
  db.prepare('BEGIN TRANSACTION').run();
  
  // First, get the actual structure of the existing table
  const existingColumns = db.prepare("PRAGMA table_info(properties)").all();
  console.log('Existing table has', existingColumns.length, 'columns');
  
  // Get column names from existing table
  const columnNames = existingColumns.map(col => col.name);
  console.log('Column names:', columnNames.join(', '));
  
  // Create new table with the same structure but updated constraint
  // We'll copy the exact structure but modify the status constraint
  db.prepare(`
    CREATE TABLE IF NOT EXISTS properties_new (
      id TEXT PRIMARY KEY,
      manager_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      near_college TEXT,
      total_rooms INTEGER NOT NULL,
      available_rooms INTEGER,
      price_starting REAL NOT NULL,
      amenities TEXT,
      rules TEXT,
      images TEXT,
      monthly_revenue REAL,
      occupancy_rate REAL,
      average_rating REAL,
      total_bookings INTEGER,
      active_bookings INTEGER,
      total_revenue REAL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'suspended')),
      is_active INTEGER DEFAULT 1,
      rating REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (manager_id) REFERENCES users(id)
    )
  `).run();
  
  // Copy data from old table to new table - specify columns explicitly
  const selectColumns = columnNames.join(', ');
  db.prepare(`
    INSERT INTO properties_new (${selectColumns})
    SELECT ${selectColumns} FROM properties
  `).run();
  
  // Drop old table
  db.prepare('DROP TABLE properties').run();
  
  // Rename new table to properties
  db.prepare('ALTER TABLE properties_new RENAME TO properties').run();
  
  // Recreate indexes if any
  db.prepare('CREATE INDEX IF NOT EXISTS idx_properties_manager ON properties(manager_id)').run();
  db.prepare('CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status)').run();
  db.prepare('CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city)').run();
  
  // Commit transaction
  db.prepare('COMMIT').run();
  
  console.log('✅ Successfully updated properties table with suspended status support');
  
  // Verify the update
  const newTableInfo = db.prepare("PRAGMA table_info(properties)").all();
  const newStatusColumn = newTableInfo.find(col => col.name === 'status');
  console.log('\nUpdated status column:', newStatusColumn);
  
  // Show current status distribution
  const statusCount = db.prepare(`
    SELECT status, COUNT(*) as count 
    FROM properties 
    GROUP BY status
  `).all();
  console.log('\nCurrent status distribution:');
  statusCount.forEach(row => {
    console.log(`  ${row.status}: ${row.count} properties`);
  });
  
} catch (error) {
  console.error('Error updating database schema:', error);
  db.prepare('ROLLBACK').run();
  process.exit(1);
} finally {
  db.close();
}

console.log('\n✅ Database schema update completed successfully!');
