// Import required modules
const express = require('express'); // Web framework for Node.js
const cors = require('cors'); // Enable CORS for frontend-backend communication
require('dotenv').config(); // Load environment variables from .env file
const db = require('./db'); // Database connection module

// Import routes
const yarnRoutes = require('./routes/yarn');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000; // Port from env or default to 3000

// Middleware setup
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // Parse incoming JSON requests

// Test database connection on startup
db.getConnection()
  .then(connection => {
    console.log('Connected to MariaDB');
    connection.release(); // Release the connection back to pool
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    // In production, handle this more gracefully (e.g., retry logic)
  });

// API routes
app.use('/api/yarn', yarnRoutes); // Mount yarn CRUD routes

// Basic health check route
app.get('/', (req, res) => {
  res.send('Yarn Inventory API');
  // Extend: Add API documentation endpoint here (e.g., /api/docs)
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Extend: Add logging middleware for requests (e.g., Morgan)
});