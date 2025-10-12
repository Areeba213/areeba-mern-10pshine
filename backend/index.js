const express = require('express');
const app = express();
const db = require('./db'); // MySQL connection
const notesRoutes = require("./routes/notes");

// Middleware to parse JSON bodies
app.use(express.json());

// Import and use authentication routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

app.use("/api/notes", notesRoutes);

// Test DB route
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1');
    res.send('✅ MySQL connection test successful!');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    res.send('Database connection failed.');
  }
});

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
