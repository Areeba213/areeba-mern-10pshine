const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',   
  user: 'areebalaghari',       
  password: 'VECTorIJk',        
  database: 'notesapp' 
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err.message);
  } else {
    console.log('✅ Connected to MySQL database');
    connection.release();
  }
});

module.exports = pool;
