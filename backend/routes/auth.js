const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Signup route - WITHOUT hashing (temporary for testing)
router.post('/signup-test', (req, res) => {
  const { name, email, password } = req.body;

  // Direct insert without hashing
  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password], // Raw password store
    (error, result) => {
      if (error) return res.status(400).json({ error: error.message });
      res.json({ message: 'User registered successfully (raw password)' });
    }
  );
});

// Original signup route (with hashing) - keep this
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (error, result) => {
        if (error) return res.status(400).json({ error: error.message });
        res.json({ message: 'User registered successfully' });
      }
    );
  });
});

// Login route - Updated to send user data
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(400).json({ error: 'User not found' });

    const user = results[0];

    console.log('User from database:', user);
    console.log('Created at:', user.created_at);

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, email: user.email }, 'secretKey', { expiresIn: '1h' });

      // Send user data with registration date
      res.json({ 
        message: 'Login successful', 
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          memberSince: user.created_at // Backend se registration date
        }
      });
    });
  });
});

// Original login route - keep this
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(400).json({ error: 'User not found' });

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, email: user.email }, 'secretKey', { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    });
  });
});

module.exports = router;