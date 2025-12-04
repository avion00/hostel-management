// Script to add missing columns to existing database
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database/hostel_management.db');
const db = new Database(dbPath);

console.log('🔧 Fixing database schema...\n');

try {
  // Check if columns exist
  const tableInfo = db.prepare("PRAGMA table_info(users)").all();
  const columnNames = tableInfo.map(col => col.name);
  
  console.log('Current columns:', columnNames);
  
  // Add failed_login_attempts if not exists
  if (!columnNames.includes('failed_login_attempts')) {
    console.log('Adding failed_login_attempts column...');
    db.exec('ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0');
    console.log('✅ Added failed_login_attempts');
  } else {
    console.log('✅ failed_login_attempts already exists');
  }
  
  // Add locked_until if not exists
  if (!columnNames.includes('locked_until')) {
    console.log('Adding locked_until column...');
    db.exec('ALTER TABLE users ADD COLUMN locked_until DATETIME');
    console.log('✅ Added locked_until');
  } else {
    console.log('✅ locked_until already exists');
  }
  
  console.log('\n🎉 Database schema fixed successfully!');
  console.log('You can now restart the server: npm run dev');
  
} catch (error) {
  console.error('❌ Error fixing database:', error);
} finally {
  db.close();
}
