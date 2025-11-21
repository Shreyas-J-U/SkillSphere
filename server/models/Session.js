import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  barterRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BarterRequest',
    required: true,
    unique: true
  },
  meetLink: {
    type: String,
    required: [true, 'Google Meet link is required'],
    trim: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isReady: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  // Track multiple meeting instances
  meetingInstances: [{
    instanceNumber: {
      type: Number,
      required: true
    },
    startedAt: {
      type: Date
    },
    endedAt: {
      type: Date
    },
    duration: {
      type: Number, // Duration in minutes
      default: 0
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress'
    }
  }],
  totalDuration: {
    type: Number, // Total duration across all instances in minutes
    default: 0
  },
  currentInstance: {
    type: Number,
    default: 0
  },
  scheduledAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
sessionSchema.index({ barterRequest: 1 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
