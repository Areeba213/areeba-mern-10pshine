const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');
const loggerMiddleware = require('./middleware/loggerMiddleware');
const logger = require('./logger');

// Add logging middleware
app.use(loggerMiddleware);

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Logs endpoint for frontend
app.post('/logs', (req, res) => {
  const logEntry = req.body;
  
  // Log frontend messages to backend logger
  const logger = require('./logger');
  
  switch (logEntry.level) {
    case 'ERROR':
      logger.error({ frontendLog: logEntry }, 'Frontend Error');
      break;
    case 'WARN':
      logger.warn({ frontendLog: logEntry }, 'Frontend Warning');
      break;
    case 'INFO':
      logger.info({ frontendLog: logEntry }, 'Frontend Info');
      break;
    case 'DEBUG':
      logger.debug({ frontendLog: logEntry }, 'Frontend Debug');
      break;
    default:
      logger.info({ frontendLog: logEntry }, 'Frontend Log');
  }
  
  res.status(200).json({ message: 'Log received' });
});

// Import and use authentication routes
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

app.get('/', (req, res) => {
  req.log.info('Home route accessed');
  res.send('Backend is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  req.log.error({
    error: err.message,
    stack: err.stack
  }, 'Unhandled error occurred');
  
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = 3000;
  app.listen(PORT, () => {
    logger.info(`Server started on http://localhost:${PORT}`);
  });
}

// Export app for testing
module.exports = app;