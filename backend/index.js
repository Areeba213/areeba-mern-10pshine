const express = require('express');
const app = express();
const db = require('./db'); // MySQL connection

// Middleware to parse JSON bodies
app.use(express.json());

// Import and use authentication routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
