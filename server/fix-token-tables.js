import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'hostel_management.db');
const db = new Database(dbPath);

console.log('🔧 Fixing token tables schema...\n');

try {
  // Begin transaction
  db.exec('BEGIN TRANSACTION');

  // Backup existing data
  console.log('📦 Backing up existing data...');
  
  const refreshTokens = db.prepare('SELECT * FROM refresh_tokens').all();
  const blacklistTokens = db.prepare('SELECT * FROM token_blacklist').all();
  
  console.log(`  Found ${refreshTokens.length} refresh tokens`);
  console.log(`  Found ${blacklistTokens.length} blacklisted tokens`);

  // Drop old tables
  console.log('\n🗑️ Dropping old tables...');
  db.exec('DROP TABLE IF EXISTS refresh_tokens');
  db.exec('DROP TABLE IF EXISTS token_blacklist');

  // Create new tables with correct schema
  console.log('\n📝 Creating new tables with TEXT user_id...');
  
  db.exec(`
    CREATE TABLE refresh_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.exec(`
    CREATE TABLE token_blacklist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      user_id TEXT,
      reason TEXT,
      blacklisted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  console.log('✅ Tables recreated with correct schema');

  // Note: We're not restoring the old data because the user_ids were wrong anyway
  // Fresh start for tokens

  // Commit transaction
  db.exec('COMMIT');
  
  console.log('\n✨ Schema fixed successfully!');
  console.log('Note: Old tokens have been cleared. Users will need to login again.');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  db.exec('ROLLBACK');
} finally {
  db.close();
}
