const {
  getAllWorks,
  getWorkById,
  getShowreelWork,
  createWork,
  updateWork,
  deleteWork,
} = require('./work.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const { validationResult } = require('express-validator');

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const getWorks = asyncHandler(async (req, res) => {
  const { category, featured } = req.query;
  const filters = {};
  
  if (category) filters.category = category;
  if (featured !== undefined) filters.isFeatured = featured === 'true';
  
  const works = await getAllWorks(filters);
  res.status(200).json(new ApiResponse(200, works, 'Works retrieved successfully'));
});

const getShowreel = asyncHandler(async (req, res) => {
  const showreel = await getShowreelWork();
  res.status(200).json(new ApiResponse(200, showreel, 'Showreel retrieved successfully'));
});

const getWork = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const work = await getWorkById(id);
  res.status(200).json(new ApiResponse(200, work, 'Work retrieved successfully'));
});

const createNewWork = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(new ApiResponse(400, null, errors.array()[0].msg));
  }
  
  // Parse categories if they come as JSON string
  let categories = req.body.categories;
  if (typeof categories === 'string') {
    try {
      categories = JSON.parse(categories);
    } catch (e) {
      categories = [];
    }
  }
  
  // Generate slug if not provided
  let slug = req.body.slug;
  if (!slug && req.body.title) {
    slug = generateSlug(req.body.title);
  }
  
  // If this work is marked as showreel, unset any existing showreel
  const isShowreel = req.body.isShowreel === 'true' || req.body.isShowreel === true;
  
  const workData = {
    title: req.body.title,
    slug: slug,
    description: req.body.description,
    year: parseInt(req.body.year),
    categories: Array.isArray(categories) ? categories : [],
    externalVideoUrl: req.body.externalVideoUrl || null,
    isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
    isShowreel: isShowreel,
    isPublished: req.body.isPublished !== 'false' && req.body.isPublished !== false,
  };
  
  const work = await createWork(workData, req.files);
  res.status(201).json(new ApiResponse(201, work, 'Work created successfully'));
});

const updateExistingWork = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Parse categories if they come as JSON string
  let categories = req.body.categories;
  if (typeof categories === 'string') {
    try {
      categories = JSON.parse(categories);
    } catch (e) {
      categories = [];
    }
  }
  
  // Generate slug if not provided
  let slug = req.body.slug;
  if (!slug && req.body.title) {
    slug = generateSlug(req.body.title);
  }
  
  // If this work is marked as showreel, unset any existing showreel
  const isShowreel = req.body.isShowreel === 'true' || req.body.isShowreel === true;
  
  const workData = {
    title: req.body.title,
    slug: slug,
    description: req.body.description,
    year: parseInt(req.body.year),
    categories: Array.isArray(categories) ? categories : [],
    externalVideoUrl: req.body.externalVideoUrl || null,
    isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
    isShowreel: isShowreel,
    isPublished: req.body.isPublished !== 'false' && req.body.isPublished !== false,
  };
  
  const work = await updateWork(id, workData, req.files);
  res.status(200).json(new ApiResponse(200, work, 'Work updated successfully'));
});

const deleteExistingWork = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteWork(id);
  res.status(200).json(new ApiResponse(200, null, 'Work deleted successfully'));
});

module.exports = {
  getWorks,
  getShowreel,
  getWork,
  createNewWork,
  updateExistingWork,
  deleteExistingWork,
};