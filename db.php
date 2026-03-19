<?php
/* ============================================
   Database Configuration & Connection
   ============================================ */

// Database credentials - UPDATE THESE for your environment
$db_host = 'localhost';
$db_user = 'root';         // Default XAMPP/WAMP username
$db_pass = '';              // Default XAMPP/WAMP password (empty)
$db_name = 'event_db';

// Create connection using MySQLi
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to UTF-8 for proper character handling
$conn->set_charset("utf8mb4");

/*
   ============================================
   SQL to create the database and table.
   Run this in phpMyAdmin or MySQL CLI:
   ============================================

   CREATE DATABASE IF NOT EXISTS event_db;
   USE event_db;

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
   );

   -- Admin users table
   CREATE TABLE IF NOT EXISTS admin_users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(50) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Insert default admin (password: admin123)
   INSERT INTO admin_users (username, password)
   VALUES ('admin', '$2y$10$8KzQFXgVvKBHmSMo0H5Yj.qJvQxlYcXzLmRJ4kT0mGz0Y5K5m0Wy');

   NOTE: The above hash is for 'admin123'. To generate your own:
   echo password_hash('your_password', PASSWORD_DEFAULT);

*/
?>
