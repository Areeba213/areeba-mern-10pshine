const express = require('express');
const cors = require('cors'); // Yeh line add karo
const app = express();
const db = require('./db'); // MySQL connection

// CORS middleware add karo - YEH IMPORTANT HAI
app.use(cors({
  origin: 'http://localhost:5173', // Tumhara frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Import and use authentication routes
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes'); // Yeh bhi add karo

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes); // Yeh bhi add karo

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});