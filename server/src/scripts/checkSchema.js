import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
const db = new Database(path.join(__dirname, '../../hostel_management.db'));

try {
  // Get the full table schema
  const tableInfo = db.prepare("PRAGMA table_info(properties)").all();
  console.log('Properties table columns:');
  console.log('Total columns:', tableInfo.length);
  tableInfo.forEach(col => {
    console.log(`  ${col.cid}. ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : 'NULL'} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
  });

  // Get the CREATE TABLE statement
  const tableSchema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='properties'").get();
  console.log('\nOriginal CREATE TABLE statement:');
  console.log(tableSchema.sql);

  // Count rows
  const rowCount = db.prepare("SELECT COUNT(*) as count FROM properties").get();
  console.log('\nTotal rows in properties table:', rowCount.count);

  // Sample a row to see actual data
  const sampleRow = db.prepare("SELECT * FROM properties LIMIT 1").get();
  if (sampleRow) {
    console.log('\nSample row columns:', Object.keys(sampleRow).length);
    console.log('Column names:', Object.keys(sampleRow));
  }

} catch (error) {
  console.error('Error:', error);
} finally {
  db.close();
}
