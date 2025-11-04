const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, (req, res) => {
  req.log.info({ userId: req.user.id }, 'Fetching user notes');
  
  db.query('SELECT * FROM notes WHERE user_id = ?', [req.user.id], (err, results) => {
    if (err) {
      req.log.error({ err, userId: req.user.id }, 'Error fetching notes');
      return res.status(500).json({ error: err.message });
    }
    
    req.log.info({ userId: req.user.id, noteCount: results.length }, 'Notes fetched successfully');
    res.json(results);
  });
});

router.post('/', authMiddleware, (req, res) => {
  const { title, content } = req.body;
  
  req.log.info({ userId: req.user.id, title }, 'Creating new note');

  db.query(
    'INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)',
    [title, content, req.user.id],
    (err, result) => {
      if (err) {
        req.log.error({ err, userId: req.user.id }, 'Error creating note');
        return res.status(500).json({ error: err.message });
      }
      
      req.log.info({ userId: req.user.id, noteId: result.insertId }, 'Note created successfully');
      res.json({ id: result.insertId, title, content });
    }
  );
});

// Similar logging for PUT and DELETE endpoints...
router.put('/:id', authMiddleware, (req, res) => {
  const { title, content } = req.body;
  const last_modified = new Date();
  
  req.log.info({ userId: req.user.id, noteId: req.params.id }, 'Updating note');

  db.query(
    'UPDATE notes SET title = ?, content = ?, last_modified = ? WHERE id = ? AND user_id = ?',
    [title, content, last_modified, req.params.id, req.user.id],
    (err, result) => {
      if (err) {
        req.log.error({ err, userId: req.user.id, noteId: req.params.id }, 'Error updating note');
        return res.status(500).json({ error: err.message });
      }
      
      if (result.affectedRows === 0) {
        req.log.warn({ userId: req.user.id, noteId: req.params.id }, 'Note not found for update');
        return res.status(404).json({ error: 'Note not found' });
      }
      
      req.log.info({ userId: req.user.id, noteId: req.params.id }, 'Note updated successfully');
      res.json({ 
        id: req.params.id, 
        title, 
        content,
        last_modified
      });
    }
  );
});

router.delete('/:id', authMiddleware, (req, res) => {
  req.log.info({ userId: req.user.id, noteId: req.params.id }, 'Deleting note');

  db.query(
    'DELETE FROM notes WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    (err, result) => {
      if (err) {
        req.log.error({ err, userId: req.user.id, noteId: req.params.id }, 'Error deleting note');
        return res.status(500).json({ error: err.message });
      }
      
      if (result.affectedRows === 0) {
        req.log.warn({ userId: req.user.id, noteId: req.params.id }, 'Note not found for deletion');
        return res.status(404).json({ error: 'Note not found' });
      }
      
      req.log.info({ userId: req.user.id, noteId: req.params.id }, 'Note deleted successfully');
      res.json({ message: 'Note deleted successfully' });
    }
  );
});

module.exports = router;