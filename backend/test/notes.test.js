const { expect } = require('chai');
const request = require('supertest');
const app = require('../index');
const db = require('../db');
const jwt = require('jsonwebtoken');

describe('Notes Controller Tests', () => {
  let authToken;
  let userId;
  let noteId;

  before((done) => {
    // Create test user and get token
    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      ['Notes Test User', 'notes@example.com', 'hashedpass'],
      (err, result) => {
        if (err) return done(err);
        userId = result.insertId;
        authToken = jwt.sign({ id: userId, email: 'notes@example.com' }, 'secretKey');
        done();
      }
    );
  });

  after((done) => {
    db.query('DELETE FROM users WHERE id = ?', [userId], done);
  });

  describe('GET /notes', () => {
    it('should return empty array when no notes exist', (done) => {
      request(app)
        .get('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('array').that.is.empty;
          done();
        });
    });

    it('should return user-specific notes only', (done) => {
      // Create a note for this user
      db.query(
        'INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)',
        ['Private Note', 'Secret content', userId],
        (err, result) => {
          if (err) return done(err);
          
          request(app)
            .get('/notes')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body).to.be.an('array').with.length(1);
              expect(res.body[0]).to.have.property('title', 'Private Note');
              expect(res.body[0]).to.have.property('user_id', userId);
              done();
            });
        }
      );
    });
  });

  describe('POST /notes', () => {
    it('should create note with title and content', (done) => {
      request(app)
        .post('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Note Title',
          content: 'Test note content here'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('title', 'Test Note Title');
          expect(res.body).to.have.property('content', 'Test note content here');
          
          noteId = res.body.id;
          
          // Verify note exists in database
          db.query('SELECT * FROM notes WHERE id = ?', [noteId], (err, results) => {
            if (err) return done(err);
            expect(results).to.have.length(1);
            expect(results[0].user_id).to.equal(userId);
            done();
          });
        });
    });

    it('should update last_modified timestamp on edit', (done) => {
      request(app)
        .put(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated content'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body).to.have.property('last_modified');
          expect(new Date(res.body.last_modified)).to.be.instanceOf(Date);
          done();
        });
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should permanently remove note from database', (done) => {
      request(app)
        .delete(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body).to.have.property('message', 'Note deleted successfully');
          
          // Verify note is actually deleted
          db.query('SELECT * FROM notes WHERE id = ?', [noteId], (err, results) => {
            if (err) return done(err);
            expect(results).to.be.empty;
            done();
          });
        });
    });
  });
});