import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  barterRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BarterRequest',
    required: true
  },
  rater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true,
    maxlength: 500
  },
  categories: {
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    skillQuality: {
      type: Number,
      min: 1,
      max: 5
    },
    punctuality: {
      type: Number,
      min: 1,
      max: 5
    },
    professionalism: {
      type: Number,
      min: 1,
      max: 5
    }
  }
}, {
  timestamps: true
});

// Ensure one rating per user per barter
ratingSchema.index({ barterRequest: 1, rater: 1 }, { unique: true });

// Index for faster queries
ratingSchema.index({ ratee: 1 });
ratingSchema.index({ rater: 1 });

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
