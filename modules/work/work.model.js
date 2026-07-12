const mongoose = require('mongoose');

const workSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    categories: {
      type: [String],
      enum: ['produced', 'directed', 'cinematography', 'edited', 'weddings-events', 'live-stream'],
      required: [true, 'At least one category is required'],
    },
    thumbnail: {
      publicId: String,
      url: String,
    },
    images: [
      {
        publicId: String,
        url: String,
      },
    ],
    video: {
      publicId: String,
      url: String,
    },
    externalVideoUrl: {
      type: String,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isShowreel: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Work', workSchema);