const express = require('express');
const {
  submitContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
} = require('./contact.controller');
const { protect } = require('../../middleware/auth');
const router = express.Router();

// Public route - submit contact form
router.post('/', submitContact);

// Admin routes
router.get('/', protect, getContacts);
router.get('/:id', protect, getContact);
router.patch('/:id/status', protect, updateContact);
router.delete('/:id', protect, deleteContact);

module.exports = router;