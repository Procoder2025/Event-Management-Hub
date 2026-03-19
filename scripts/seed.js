/* ============================================
   Database Seed Script
   Creates tables and default admin user
   Run: node scripts/seed.js
   ============================================ */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
  });

  console.log('🔌 Connected to MySQL');

  // Create database
  await conn.query('CREATE DATABASE IF NOT EXISTS event_db');
  await conn.query('USE event_db');
  console.log('📦 Database "event_db" ready');

  // Create registrations table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      phone VARCHAR(15) NOT NULL,
      department VARCHAR(50) NOT NULL,
      year INT NOT NULL,
      event VARCHAR(100) NOT NULL,
      id_proof VARCHAR(255) DEFAULT NULL,
      registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('📋 Table "registrations" ready');

  // Create admin_users table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('👤 Table "admin_users" ready');

  // Insert default admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await conn.query(
    `INSERT INTO admin_users (username, password) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password = ?`,
    ['admin', hashedPassword, hashedPassword]
  );
  console.log('🔑 Default admin created (admin / admin123)');

  await conn.end();
  console.log('\n✅ Database setup complete!');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
