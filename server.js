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

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'https://dir-smile-frontend.vercel.app',
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

// ✅ Health check route - MUST be /api/health
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ✅ All routes MUST start with /api
app.use('/api/auth', require('./modules/admin/admin.routes'));
app.use('/api/works', require('./modules/work/work.routes'));
app.use('/api/awards', require('./modules/award/award.routes'));
app.use('/api/contacts', require('./modules/contact/contact.routes'));

// 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.url} not found`
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('  GET /api/health');
  console.log('  GET /api/works');
  console.log('  GET /api/works/showreel');
  console.log('  GET /api/awards');
  console.log('  POST /api/auth/login');
  console.log('  POST /api/contacts');
});