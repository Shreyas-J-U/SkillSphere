import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  barterRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BarterRequest',
    required: true
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure only 2 participants
chatSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    next(new Error('Chat must have exactly 2 participants'));
  }
  next();
});

// Index for faster queries
chatSchema.index({ participants: 1 });
chatSchema.index({ barterRequest: 1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
