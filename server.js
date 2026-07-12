const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { createInitialAdmin } = require('./modules/admin/admin.service');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create initial admin
// createInitialAdmin();

const app = express();

// Middleware
// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,           
  'dir-smile-frontend.vercel.app', 
  'http://localhost:5173',           
  'http://localhost:3000',           
].filter(Boolean); 

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Origin ${origin} not allowed by CORS`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./modules/admin/admin.routes'));
app.use('/api/works', require('./modules/work/work.routes'));
app.use('/api/awards', require('./modules/award/award.routes'));
app.use('/api/contacts', require('./modules/contact/contact.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handler - MUST BE LAST
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});