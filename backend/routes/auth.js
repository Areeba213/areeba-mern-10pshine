const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // MySQL connection

// Signup route
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // hash password
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

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(400).json({ error: 'User not found' });

    const user = results[0];

    // compare password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

      // generate JWT
      const token = jwt.sign({ id: user.id, email: user.email }, 'secretKey', { expiresIn: '1h' });

      res.json({ message: 'Login successful', token });
    });
  });
});

module.exports = router;
