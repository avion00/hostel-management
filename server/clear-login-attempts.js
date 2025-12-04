import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'hostel_management.db');
const db = new Database(dbPath);

try {
  console.log('🔧 Clearing login attempts...');
  
  // Clear all login attempts
  const result = db.prepare('DELETE FROM login_attempts').run();
  
  console.log(`✅ Cleared ${result.changes} login attempt records`);
  console.log('✅ You can now login without rate limiting!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  db.close();
}
