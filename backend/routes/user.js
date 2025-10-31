const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Get all users with passwords (For testing only - remove in production)
router.get('/', (req, res) => {
  db.query('SELECT id, name, email, password, created_at FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get specific user with password
router.get('/:id', (req, res) => {
  db.query('SELECT id, name, email, password, created_at FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  });
});

// Get user by email with password
router.get('/email/:email', (req, res) => {
  db.query('SELECT id, name, email, password, created_at FROM users WHERE email = ?', [req.params.email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  });
});

module.exports = router;