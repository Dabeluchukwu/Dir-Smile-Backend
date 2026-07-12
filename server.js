// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS configuration - FIXED
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'https://dir-smilie-frontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware - add this temporarily
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// Routes - MAKE SURE ALL ROUTES ARE UNDER /api
app.use('/api/auth', require('./modules/admin/admin.routes'));
app.use('/api/works', require('./modules/work/work.routes'));
app.use('/api/awards', require('./modules/award/award.routes'));
app.use('/api/contacts', require('./modules/contact/contact.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handler - MUST BE LAST
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CORS allowed origins:', [
    process.env.FRONTEND_URL,
    'https://dir-smilie-frontend.vercel.app',
    'http://localhost:5173'
  ]);
});