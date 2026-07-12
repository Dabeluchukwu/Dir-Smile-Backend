const express = require('express');
const {
  getWorks,
  getShowreel,
  getWork,
  createNewWork,
  updateExistingWork,
  deleteExistingWork,
} = require('./work.controller');
const { protect } = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const { body } = require('express-validator');
const router = express.Router();

// Public routes
router.get('/', getWorks);
router.get('/showreel', getShowreel);
router.get('/:id', getWork);

// Admin routes
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 },
    { name: 'video', maxCount: 1 },
  ]),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('year').isNumeric().withMessage('Year must be a number'),
    body('categories').notEmpty().withMessage('At least one category is required'),
  ],
  createNewWork
);

router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 10 },
    { name: 'video', maxCount: 1 },
  ]),
  updateExistingWork
);

router.delete('/:id', protect, deleteExistingWork);

module.exports = router;