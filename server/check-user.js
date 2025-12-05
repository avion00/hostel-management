import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'hostel_management.db');
const db = new Database(dbPath);

const email = 'amic8848@gmail.com';

console.log(`\n🔍 Checking user: ${email}\n`);

// Check table schema
const tableInfo = db.prepare("PRAGMA table_info(users)").all();
console.log('Users table schema:');
tableInfo.forEach(col => {
  console.log(`  ${col.name}: ${col.type} ${col.pk ? '(PRIMARY KEY)' : ''}`);
});

// Get user data
const user = db.prepare(`
  SELECT * FROM users WHERE email = ?
`).get(email);

if (user) {
  console.log('\n✅ User found:');
  console.log(JSON.stringify(user, null, 2));
  
  // Check what the id field contains
  console.log('\nID field analysis:');
  console.log(`  Type: ${typeof user.id}`);
  console.log(`  Value: "${user.id}"`);
  console.log(`  Is null: ${user.id === null}`);
  console.log(`  Is undefined: ${user.id === undefined}`);
  console.log(`  Length: ${user.id ? user.id.length : 'N/A'}`);
} else {
  console.log('\n❌ User not found');
}

db.close();
