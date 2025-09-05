// Routes for yarn inventory CRUD operations
// This module defines RESTful API endpoints for managing yarn records
const express = require('express');
const router = express.Router();
const db = require('../db'); // Database connection module

// GET /api/yarn - Retrieve all active yarn records
// Supports optional query params: ?brand=...&color=... for filtering
router.get('/', async (req, res) => {
  try {
    const { brand, color } = req.query;
    let query = 'SELECT * FROM yarn_inventory WHERE deleted = 0';
    const params = [];

    // Add filters if provided (basic search functionality)
    if (brand) {
      query += ' AND brand LIKE ?';
      params.push(`%${brand}%`);
    }
    if (color) {
      query += ' AND color LIKE ?';
      params.push(`%${color}%`);
    }

    query += ' ORDER BY date_added DESC'; // Most recent first

    const [results] = await db.execute(query, params);
    res.json(results);
  } catch (err) {
    console.error('Error fetching yarns:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/yarn/:id - Retrieve a single yarn record by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const [results] = await db.execute('SELECT * FROM yarn_inventory WHERE id = ? AND deleted = 0', [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Yarn not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error('Error fetching yarn:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/yarn - Create a new yarn record
// Requires: user_id, brand, name, start_len, start_weight, curr_weight
router.post('/', async (req, res) => {
  try {
    const { user_id, brand, name, color, count, start_len, start_weight, curr_weight, upc, status } = req.body;

    // Basic validation
    if (!user_id || !brand || !name || !start_len || !start_weight || !curr_weight) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `INSERT INTO yarn_inventory
      (user_id, date_added, brand, name, color, count, start_len, start_weight, curr_weight, upc, status)
      VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [user_id, brand, name, color || null, count || null, start_len, start_weight, curr_weight, upc || null, status || 'active'];

    const [result] = await db.execute(query, params);
    res.status(201).json({ id: result.insertId, message: 'Yarn created successfully' });
  } catch (err) {
    console.error('Error creating yarn:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/yarn/:id - Update an existing yarn record
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { brand, name, color, count, start_len, start_weight, curr_weight, upc, status } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    // Check if record exists
    const [results] = await db.execute('SELECT * FROM yarn_inventory WHERE id = ? AND deleted = 0', [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Yarn not found' });
    }

    // Update the record
    const query = `UPDATE yarn_inventory SET
      brand = ?, name = ?, color = ?, count = ?, start_len = ?, start_weight = ?, curr_weight = ?, upc = ?, status = ?
      WHERE id = ?`;

    const params = [brand, name, color, count, start_len, start_weight, curr_weight, upc, status, id];

    await db.execute(query, params);
    res.json({ message: 'Yarn updated successfully' });
  } catch (err) {
    console.error('Error updating yarn:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/yarn/:id - Soft delete a yarn record (set deleted = 1)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const [result] = await db.execute('UPDATE yarn_inventory SET deleted = 1, deleted_when = NOW() WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Yarn not found' });
    }
    res.json({ message: 'Yarn deleted successfully' });
  } catch (err) {
    console.error('Error deleting yarn:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// To extend: Add pagination (LIMIT/OFFSET), advanced filtering, or bulk operations
// For security: Add authentication middleware to verify user_id matches logged-in user

module.exports = router;