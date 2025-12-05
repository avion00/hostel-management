import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'hostel_management.db');
const db = new Database(dbPath);

// Get email from command line argument or use default
const email = process.argv[2] || 'amic8848@gmail.com';

console.log(`🔓 Unlocking account: ${email}\n`);

try {
  // Check current lock status
  const user = db.prepare(`
    SELECT email, failed_login_attempts, locked_until 
    FROM users 
    WHERE email = ?
  `).get(email);

  if (!user) {
    console.log(`❌ User not found: ${email}`);
    process.exit(1);
  }

  console.log('Current status:');
  console.log(`  Failed attempts: ${user.failed_login_attempts || 0}`);
  console.log(`  Locked until: ${user.locked_until || 'Not locked'}`);

  // Reset the lock
  db.prepare(`
    UPDATE users 
    SET failed_login_attempts = 0, locked_until = NULL 
    WHERE email = ?
  `).run(email);

  console.log('\n✅ Account unlocked successfully!');
  console.log('You can now try logging in again.');

} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  db.close();
}
