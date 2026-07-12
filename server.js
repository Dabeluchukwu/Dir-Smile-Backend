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
createInitialAdmin();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
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