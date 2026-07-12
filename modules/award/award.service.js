const Award = require('./award.model');
const cloudinary = require('../../config/cloudinary');
const ApiError = require('../../utils/ApiError');

const uploadToCloudinary = async (file, folder = 'dir-smilie/awards') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(file.buffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

const getAllAwards = async () => {
  const awards = await Award.find({ isPublished: true }).sort({ year: -1 });
  return awards;
};

const getAllAwardsAdmin = async () => {
  const awards = await Award.find().sort({ year: -1 });
  return awards;
};

const getAwardById = async (id) => {
  const award = await Award.findById(id);
  if (!award) {
    throw new ApiError(404, 'Award not found');
  }
  return award;
};

const createAward = async (awardData, file) => {
  let imageData = null;
  
  if (file && file[0]) {
    const result = await uploadToCloudinary(file[0]);
    imageData = {
      publicId: result.public_id,
      url: result.secure_url,
    };
  }
  
  const award = await Award.create({
    ...awardData,
    image: imageData,
  });
  
  return award;
};

const updateAward = async (id, awardData, file) => {
  const award = await Award.findById(id);
  if (!award) {
    throw new ApiError(404, 'Award not found');
  }
  
  if (file && file[0]) {
    if (award.image && award.image.publicId) {
      await deleteFromCloudinary(award.image.publicId);
    }
    const result = await uploadToCloudinary(file[0]);
    awardData.image = {
      publicId: result.public_id,
      url: result.secure_url,
    };
  }
  
  // FIX: Replace { new: true } with { returnDocument: 'after' }
  const updatedAward = await Award.findByIdAndUpdate(id, awardData, {
    returnDocument: 'after',  // This replaces 'new: true'
    runValidators: true,
  });
  
  return updatedAward;
};

const deleteAward = async (id) => {
  const award = await Award.findById(id);
  if (!award) {
    throw new ApiError(404, 'Award not found');
  }
  
  if (award.image && award.image.publicId) {
    await deleteFromCloudinary(award.image.publicId);
  }
  
  await award.deleteOne();
  return award;
};

module.exports = {
  getAllAwards,
  getAllAwardsAdmin,
  getAwardById,
  createAward,
  updateAward,
  deleteAward,
};