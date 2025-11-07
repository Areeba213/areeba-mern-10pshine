const mysql = require('mysql2');

// Use test database
const testDb = mysql.createPool({
  host: 'localhost',   
  user: 'areebalaghari',       
  password: 'yourpassword',        
  database: 'notesapp_test' // Different database for testing
});

// Create test database if it doesn't exist
const setupDb = mysql.createPool({
  host: 'localhost',   
  user: 'areebalaghari',       
  password: 'yourpassword'
});

setupDb.query('CREATE DATABASE IF NOT EXISTS notesapp_test', (err) => {
  if (err) console.error('Error creating test database:', err);
  else console.log('Test database ready');
});

module.exports = testDb;