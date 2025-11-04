const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  req.log.info({ email, name }, 'User signup attempt');

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      req.log.error({ err, email }, 'Password hashing failed');
      return res.status(500).json({ error: err.message });
    }

    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (error, result) => {
        if (error) {
          req.log.error({ error: error.message, email }, 'User registration failed');
          return res.status(400).json({ error: error.message });
        }
        
        req.log.info({ userId: result.insertId, email }, 'User registered successfully');
        res.json({ message: 'User registered successfully' });
      }
    );
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  req.log.info({ email }, 'User login attempt');

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      req.log.error({ err, email }, 'Database error during login');
      return res.status(500).json({ error: err.message });
    }
    
    if (results.length === 0) {
      req.log.warn({ email }, 'Login failed - user not found');
      return res.status(400).json({ error: 'User not found' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        req.log.error({ err, email }, 'Password comparison failed');
        return res.status(500).json({ error: err.message });
      }
      
      if (!isMatch) {
        req.log.warn({ email }, 'Login failed - invalid credentials');
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, 'secretKey', { expiresIn: '1h' });

      req.log.info({ userId: user.id, email }, 'User logged in successfully');
      
      res.json({ 
        message: 'Login successful', 
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          memberSince: user.created_at
        }
      });
    });
  });
});

module.exports = router;