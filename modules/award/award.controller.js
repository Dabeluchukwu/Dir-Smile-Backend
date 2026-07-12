const {
  getAllAwards,
  getAllAwardsAdmin,
  getAwardById,
  createAward,
  updateAward,
  deleteAward,
} = require('./award.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');

const getAwards = asyncHandler(async (req, res) => {
  const awards = await getAllAwards();
  res.status(200).json(new ApiResponse(200, awards, 'Awards retrieved successfully'));
});

const getAwardsAdmin = asyncHandler(async (req, res) => {
  const awards = await getAllAwardsAdmin();
  res.status(200).json(new ApiResponse(200, awards, 'Awards retrieved successfully'));
});

const getAward = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const award = await getAwardById(id);
  res.status(200).json(new ApiResponse(200, award, 'Award retrieved successfully'));
});

const createNewAward = asyncHandler(async (req, res) => {
  const awardData = {
    title: req.body.title,
    organization: req.body.organization,
    category: req.body.category,
    year: req.body.year,
    description: req.body.description || '',
    isPublished: req.body.isPublished !== 'false',
  };
  
  const award = await createAward(awardData, req.files?.image);
  res.status(201).json(new ApiResponse(201, award, 'Award created successfully'));
});

const updateExistingAward = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const awardData = {
    title: req.body.title,
    organization: req.body.organization,
    category: req.body.category,
    year: req.body.year,
    description: req.body.description || '',
    isPublished: req.body.isPublished !== 'false',
  };
  
  const award = await updateAward(id, awardData, req.files?.image);
  res.status(200).json(new ApiResponse(200, award, 'Award updated successfully'));
});

const deleteExistingAward = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteAward(id);
  res.status(200).json(new ApiResponse(200, null, 'Award deleted successfully'));
});

module.exports = {
  getAwards,
  getAwardsAdmin,
  getAward,
  createNewAward,
  updateExistingAward,
  deleteExistingAward,
};