// Database connection module
// Centralizes database configuration and connection for reuse across the app
const mysql = require('mysql2');

// Create connection pool for better performance and connection management
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'yarn_inventory_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool promise interface for async/await support
const promisePool = pool.promise();

// Export both pool and promisePool for flexibility
module.exports = promisePool;

// To extend: Add connection retry logic, health checks, or multiple database support
// For production: Use connection pooling with proper limits and monitoring