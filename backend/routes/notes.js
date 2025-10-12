// routes/notes.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../db'); // your mysql2 pool (callback style)
const authMiddleware = require('../middlewares/authMiddleware');

// Helper to send validation errors
function sendValidation(res, errors) {
  return res.status(422).json({ errors: errors.array() });
}

// Create note
router.post(
  '/',
  authMiddleware,
  [
    body('title').isString().notEmpty().trim().isLength({ max: 255 }),
    body('content').optional().isString()
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return sendValidation(res, errors);

      const { title, content = '' } = req.body;
      const userId = req.user.id;

      db.query(
        'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
        [userId, title, content],
        (error, result) => {
          if (error) return next(error);
          
          const insertedId = result.insertId;
          db.query('SELECT * FROM notes WHERE id = ?', [insertedId], (err, rows) => {
            if (err) return next(err);
            res.status(201).json({ note: rows[0] });
          });
        }
      );
    } catch (err) {
      next(err);
    }
  }
);

// Get all notes for authenticated user
router.get('/', authMiddleware, (req, res, next) => {
  try {
    const userId = req.user.id;
    
    db.query(
      'SELECT id, title, content, created_at, updated_at FROM notes WHERE user_id = ? ORDER BY updated_at DESC',
      [userId],
      (error, rows) => {
        if (error) return next(error);
        res.json({ notes: rows });
      }
    );
  } catch (err) {
    next(err);
  }
});

// Get single note
router.get('/:id', authMiddleware, (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;
    
    db.query('SELECT * FROM notes WHERE id = ? AND user_id = ?', [noteId, userId], (error, rows) => {
      if (error) return next(error);
      if (rows.length === 0) return res.status(404).json({ message: 'Note not found' });
      res.json({ note: rows[0] });
    });
  } catch (err) {
    next(err);
  }
});

// Update note
router.put(
  '/:id',
  authMiddleware,
  [
    body('title').optional().isString().isLength({ max: 255 }),
    body('content').optional().isString()
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return sendValidation(res, errors);

      const userId = req.user.id;
      const noteId = req.params.id;
      const { title, content } = req.body;

      db.query('SELECT id FROM notes WHERE id = ? AND user_id = ?', [noteId, userId], (error, existing) => {
        if (error) return next(error);
        if (existing.length === 0) return res.status(404).json({ message: 'Note not found' });

        const fields = [];
        const params = [];
        if (title !== undefined) { fields.push('title = ?'); params.push(title); }
        if (content !== undefined) { fields.push('content = ?'); params.push(content); }
        if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });

        params.push(noteId, userId);
        const sql = `UPDATE notes SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
        
        db.query(sql, params, (err) => {
          if (err) return next(err);
          
          db.query('SELECT * FROM notes WHERE id = ?', [noteId], (error, rows) => {
            if (error) return next(error);
            res.json({ note: rows[0] });
          });
        });
      });
    } catch (err) {
      next(err);
    }
  }
);

// Delete note
router.delete('/:id', authMiddleware, (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;

    db.query('SELECT id FROM notes WHERE id = ? AND user_id = ?', [noteId, userId], (error, existing) => {
      if (error) return next(error);
      if (existing.length === 0) return res.status(404).json({ message: 'Note not found' });

      db.query('DELETE FROM notes WHERE id = ? AND user_id = ?', [noteId, userId], (err) => {
        if (err) return next(err);
        res.status(204).send();
      });
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
