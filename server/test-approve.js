import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'hostel_management.db');
const db = new Database(dbPath);

const propertyId = '07f580f2-edca-49a6-880e-a87ce9127954';

console.log('Testing property approval...\n');

try {
  // Check if property exists
  const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(propertyId);
  
  if (!property) {
    console.log('❌ Property not found with ID:', propertyId);
    
    // List all properties
    const allProperties = db.prepare('SELECT id, name, status FROM properties').all();
    console.log('\nAvailable properties:');
    allProperties.forEach(p => {
      console.log(`  ${p.id}: ${p.name} (${p.status})`);
    });
  } else {
    console.log('✅ Property found:', property.name);
    console.log('  Current status:', property.status);
    
    // Try to update
    const result = db.prepare('UPDATE properties SET status = "approved", updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(propertyId);
    console.log('  Update result:', result.changes, 'rows affected');
    
    // Check new status
    const updated = db.prepare('SELECT status FROM properties WHERE id = ?').get(propertyId);
    console.log('  New status:', updated.status);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error);
} finally {
  db.close();
}
