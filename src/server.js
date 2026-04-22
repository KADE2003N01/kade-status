// Import required modules
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const contactRoutes = require('./routes/contact');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = new Set([
  process.env.FRONTEND_URL || 'http://localhost:5500',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
]);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) or if in the allowed list
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: Origin ${origin} not in authorized list`));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ROUTES
app.use('/api/contact', contactRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// ERROR HANDLING
app.use((req, res) => { // This should be after all routes
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// =====================
// START SERVER
// =====================

const server = app.listen(PORT)
  .on('listening', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📧 Email configured: ${process.env.EMAIL_USER}`);
    console.log(`🌍 CORS allowed origins: ${allowedOrigins.join(', ')}`);
  })
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Error: Port ${PORT} is already in use. Run 'fuser -k ${PORT}/tcp' to free it.`);
      process.exit(1);
    } else {
      throw err;
    }
  });