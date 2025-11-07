const { expect } = require('chai');
const request = require('supertest');
const app = require('../index');
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Auth Controller Tests', () => {
  beforeEach((done) => {
    db.query('DELETE FROM users WHERE email LIKE ?', ['test%@example.com'], done);
  });

  describe('POST /auth/signup', () => {
    it('should create user with hashed password', (done) => {
      request(app)
        .post('/auth/signup')
        .send({
          name: 'Test User',
          email: 'test1@example.com',
          password: 'password123'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          
          // Verify user was created in database
          db.query('SELECT * FROM users WHERE email = ?', ['test1@example.com'], (err, results) => {
            if (err) return done(err);
            
            expect(results).to.have.length(1);
            expect(results[0].name).to.equal('Test User');
            expect(results[0].email).to.equal('test1@example.com');
            // Verify password is hashed
            expect(results[0].password).to.not.equal('password123');
            expect(bcrypt.compareSync('password123', results[0].password)).to.be.true;
            done();
          });
        });
    });

    it('should return error for duplicate email', (done) => {
      // First create a user
      request(app)
        .post('/auth/signup')
        .send({
          name: 'Test User',
          email: 'duplicate@example.com',
          password: 'password123'
        })
        .end(() => {
          // Try to create same user again
          request(app)
            .post('/auth/signup')
            .send({
              name: 'Test User 2',
              email: 'duplicate@example.com',
              password: 'password456'
            })
            .expect(400)
            .end((err, res) => {
              expect(res.body).to.have.property('error');
              done();
            });
        });
    });
  });

  describe('POST /auth/login', () => {
    beforeEach((done) => {
      // Create a user for login tests
      const hashedPassword = bcrypt.hashSync('testpassword', 10);
      db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        ['Login Test User', 'login@example.com', hashedPassword],
        done
      );
    });

    it('should return JWT token on successful login', (done) => {
      request(app)
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: 'testpassword'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.property('id');
          expect(res.body.user).to.have.property('name', 'Login Test User');
          expect(res.body.user).to.have.property('email', 'login@example.com');
          
          // Verify JWT token is valid
          const decoded = jwt.verify(res.body.token, 'secretKey');
          expect(decoded).to.have.property('id');
          expect(decoded).to.have.property('email', 'login@example.com');
          done();
        });
    });

    it('should return user data with registration date', (done) => {
      request(app)
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: 'testpassword'
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res.body.user).to.have.property('memberSince');
          expect(res.body.user.memberSince).to.be.a('string');
          done();
        });
    });
  });
});