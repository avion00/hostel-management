import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateUUID } from './src/utils/uuid.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'hostel_management.db');
const db = new Database(dbPath);

console.log('🔧 Fixing existing users without proper IDs...\n');

try {
  // Get all users
  const users = db.prepare('SELECT * FROM users').all();
  console.log(`Found ${users.length} users`);

  let fixed = 0;
  for (const user of users) {
    // Check if user has a proper UUID ID
    if (!user.id || user.id === 'null' || user.id === null || user.id.length < 10) {
      console.log(`\n❌ User ${user.email} has invalid ID: "${user.id}"`);
      
      // Generate new UUID
      const newId = generateUUID();
      console.log(`  Generating new ID: ${newId}`);
      
      // Create a new user with proper ID
      db.prepare(`
        DELETE FROM users WHERE email = ?
      `).run(user.email);
      
      db.prepare(`
        INSERT INTO users (id, name, email, password, phone, role, avatar, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        newId,
        user.name,
        user.email,
        user.password,
        user.phone,
        user.role,
        user.avatar,
        user.is_active,
        user.created_at,
        user.updated_at
      );
      
      console.log(`  ✅ Fixed user ${user.email} with new ID`);
      fixed++;
    } else {
      console.log(`✅ User ${user.email} has valid ID: ${user.id.substring(0, 8)}...`);
    }
  }

  console.log(`\n✨ Fixed ${fixed} users`);
  
  // Show current users
  console.log('\nCurrent users:');
  const updatedUsers = db.prepare('SELECT id, email, role FROM users').all();
  updatedUsers.forEach(u => {
    console.log(`  ${u.email} (${u.role}): ${u.id ? u.id.substring(0, 8) : 'NO ID'}...`);
  });

} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  db.close();
}
