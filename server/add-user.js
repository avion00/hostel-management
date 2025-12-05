import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { generateUUID } from './src/utils/uuid.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'hostel_management.db');
const db = new Database(dbPath);

async function addUser() {
  const email = 'amic8848@gmail.com';
  const password = 'asdf@asdfA1';
  const name = 'Amic User';
  const role = 'student'; // or 'manager' if you prefer
  
  console.log(`\n📝 Adding user: ${email}\n`);

  try {
    // Check if user exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      console.log('❌ User already exists!');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate UUID
    const userId = generateUUID();
    
    // Insert user
    db.prepare(`
      INSERT INTO users (id, name, email, password, phone, role, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, name, email, hashedPassword, null, role, 1);
    
    console.log('✅ User created successfully!');
    console.log(`  ID: ${userId}`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Role: ${role}`);
    console.log('\nYou can now login with these credentials!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    db.close();
  }
}

addUser();
