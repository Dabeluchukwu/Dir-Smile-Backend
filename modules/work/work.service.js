const Work = require('./work.model');
const cloudinary = require('../../config/cloudinary');
const ApiError = require('../../utils/ApiError');

const uploadToCloudinary = async (file, folder = 'dir-smilie') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
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

const getAllWorks = async (filters = {}) => {
  const query = { isPublished: true };
  
  if (filters.category && filters.category !== 'all') {
    query.categories = filters.category;
  }
  
  if (filters.isFeatured !== undefined) {
    query.isFeatured = filters.isFeatured;
  }
  
  const works = await Work.find(query).sort({ createdAt: -1 });
  return works;
};

const getShowreelWork = async () => {
  const showreel = await Work.findOne({ isShowreel: true, isPublished: true });
  return showreel;
};

const getWorkById = async (id) => {
  const work = await Work.findById(id);
  if (!work) {
    throw new ApiError(404, 'Work not found');
  }
  return work;
};

const getWorkBySlug = async (slug) => {
  const work = await Work.findOne({ slug, isPublished: true });
  if (!work) {
    throw new ApiError(404, 'Work not found');
  }
  return work;
};

const createWork = async (workData, files) => {
  const { thumbnail, images, video } = files || {};
  
  // If this work is marked as showreel, unset any existing showreel
  if (workData.isShowreel) {
    await Work.updateMany({ isShowreel: true }, { isShowreel: false });
  }
  
  // Check if slug already exists
  if (workData.slug) {
    const existingWork = await Work.findOne({ slug: workData.slug });
    if (existingWork) {
      // Append timestamp to make slug unique
      workData.slug = `${workData.slug}-${Date.now()}`;
    }
  }
  
  // Upload thumbnail
  let thumbnailData = null;
  if (thumbnail && thumbnail[0]) {
    try {
      const result = await uploadToCloudinary(thumbnail[0], 'dir-smilie/thumbnails');
      thumbnailData = {
        publicId: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
      throw new ApiError(500, 'Failed to upload thumbnail');
    }
  }
  
  // Upload images
  const imagesData = [];
  if (images && images.length > 0) {
    for (const image of images) {
      try {
        const result = await uploadToCloudinary(image, 'dir-smilie/images');
        imagesData.push({
          publicId: result.public_id,
          url: result.secure_url,
        });
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    }
  }
  
  // Upload video
  let videoData = null;
  if (video && video[0]) {
    try {
      const result = await uploadToCloudinary(video[0], 'dir-smilie/videos');
      videoData = {
        publicId: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error('Video upload failed:', error);
      throw new ApiError(500, 'Failed to upload video');
    }
  }
  
  const work = await Work.create({
    ...workData,
    thumbnail: thumbnailData,
    images: imagesData,
    video: videoData,
  });
  
  return work;
};

const updateWork = async (id, workData, files) => {
  const work = await Work.findById(id);
  if (!work) {
    throw new ApiError(404, 'Work not found');
  }
  
  // If this work is marked as showreel, unset any existing showreel
  if (workData.isShowreel) {
    await Work.updateMany({ _id: { $ne: id }, isShowreel: true }, { isShowreel: false });
  }
  
  // Handle file updates
  if (files) {
    const { thumbnail, images, video } = files;
    
    // Update thumbnail
    if (thumbnail && thumbnail[0]) {
      if (work.thumbnail && work.thumbnail.publicId) {
        await deleteFromCloudinary(work.thumbnail.publicId);
      }
      try {
        const result = await uploadToCloudinary(thumbnail[0], 'dir-smilie/thumbnails');
        workData.thumbnail = {
          publicId: result.public_id,
          url: result.secure_url,
        };
      } catch (error) {
        console.error('Thumbnail upload failed:', error);
        throw new ApiError(500, 'Failed to upload thumbnail');
      }
    }
    
    // Update images (replace all)
    if (images && images.length > 0) {
      // Delete old images
      for (const image of work.images) {
        if (image.publicId) {
          await deleteFromCloudinary(image.publicId);
        }
      }
      const imagesData = [];
      for (const image of images) {
        try {
          const result = await uploadToCloudinary(image, 'dir-smilie/images');
          imagesData.push({
            publicId: result.public_id,
            url: result.secure_url,
          });
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      }
      workData.images = imagesData;
    }
    
    // Update video
    if (video && video[0]) {
      if (work.video && work.video.publicId) {
        await deleteFromCloudinary(work.video.publicId);
      }
      try {
        const result = await uploadToCloudinary(video[0], 'dir-smilie/videos');
        workData.video = {
          publicId: result.public_id,
          url: result.secure_url,
        };
      } catch (error) {
        console.error('Video upload failed:', error);
        throw new ApiError(500, 'Failed to upload video');
      }
    }
  }
  
  // Update the work - FIX: Replace { new: true } with { returnDocument: 'after' }
  const updatedWork = await Work.findByIdAndUpdate(id, workData, {
    returnDocument: 'after',  // This replaces 'new: true'
    runValidators: true,
  });
  
  return updatedWork;
};

const deleteWork = async (id) => {
  const work = await Work.findById(id);
  if (!work) {
    throw new ApiError(404, 'Work not found');
  }
  
  // Delete all associated files from Cloudinary
  if (work.thumbnail && work.thumbnail.publicId) {
    await deleteFromCloudinary(work.thumbnail.publicId);
  }
  
  if (work.video && work.video.publicId) {
    await deleteFromCloudinary(work.video.publicId);
  }
  
  for (const image of work.images) {
    if (image.publicId) {
      await deleteFromCloudinary(image.publicId);
    }
  }
  
  await work.deleteOne();
  return work;
};

module.exports = {
  getAllWorks,
  getShowreelWork,
  getWorkById,
  getWorkBySlug,
  createWork,
  updateWork,
  deleteWork,
};