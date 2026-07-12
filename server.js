const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

// CORS configuration
const allowedOrigins = [
  'https://dir-smile-frontend.vercel.app',
  'https://dir-smilie-frontend.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log(`Blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Add this BEFORE all other routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Test route is working!',
    timestamp: new Date().toISOString()
  });
});
// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'DIR. SMILIE API',
    endpoints: ['/api/health', '/api/works', '/api/awards', '/api/auth/login', '/api/contacts'],
    status: '✅ Server is running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use('/api/works', require('./modules/work/work.routes'));
app.use('/api/awards', require('./modules/award/award.routes'));
app.use('/api/auth', require('./modules/admin/admin.routes'));
app.use('/api/contacts', require('./modules/contact/contact.routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.url} not found` 
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Allowed origins:`, allowedOrigins);
  console.log(`📍 Available routes:`);
  console.log(`  - GET  /`);
  console.log(`  - GET  /api/health`);
  console.log(`  - GET  /api/works`);
  console.log(`  - GET  /api/works/showreel`);
  console.log(`  - GET  /api/awards`);
  console.log(`  - POST /api/auth/login`);
  console.log(`  - POST /api/contacts`);
});