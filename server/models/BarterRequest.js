import mongoose from 'mongoose';

const barterRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillOffered: {
    type: String,
    required: [true, 'Skill offered is required'],
    trim: true
  },
  skillRequested: {
    type: String,
    required: [true, 'Skill requested is required'],
    trim: true
  },
  message: {
    type: String,
    trim: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for faster queries
barterRequestSchema.index({ sender: 1, receiver: 1 });
barterRequestSchema.index({ status: 1 });

const BarterRequest = mongoose.model('BarterRequest', barterRequestSchema);

export default BarterRequest;
