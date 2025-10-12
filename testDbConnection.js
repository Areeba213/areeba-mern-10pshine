// testDbConnection.js
const db = require('./db');

(async () => {
  try {
    const [rows] = await db.execute('SELECT 1+1 AS result');
    console.log('DB connection OK — query result:', rows);
  } catch (err) {
    console.error('DB connection failed:', err.message || err);
  } finally {
    process.exit(0);
  }
})();
