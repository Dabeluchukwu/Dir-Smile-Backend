const express = require('express');
const {
  getAwards,
  getAwardsAdmin,
  getAward,
  createNewAward,
  updateExistingAward,
  deleteExistingAward,
} = require('./award.controller');
const { protect } = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const router = express.Router();

// Public routes
router.get('/', getAwards);
router.get('/:id', getAward);

// Admin routes
router.get('/admin/all', protect, getAwardsAdmin);
router.post(
  '/',
  protect,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  createNewAward
);
router.put(
  '/:id',
  protect,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  updateExistingAward
);
router.delete('/:id', protect, deleteExistingAward);

module.exports = router;