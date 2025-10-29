const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Get all notes for user
router.get('/', authMiddleware, (req, res) => {
  db.query('SELECT * FROM notes WHERE user_id = ?', [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create new note
router.post('/', authMiddleware, (req, res) => {
  const { title, content } = req.body;
  db.query(
    'INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)',
    [title, content, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, title, content });
    }
  );
});

// Update note - ADD THIS
router.put('/:id', authMiddleware, (req, res) => {
  const { title, content } = req.body;
  db.query(
    'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
    [title, content, req.params.id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Note not found' });
      res.json({ id: req.params.id, title, content });
    }
  );
});

// Delete note - ADD THIS
router.delete('/:id', authMiddleware, (req, res) => {
  db.query(
    'DELETE FROM notes WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Note not found' });
      res.json({ message: 'Note deleted successfully' });
    }
  );
});

module.exports = router;