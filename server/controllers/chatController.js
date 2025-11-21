import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import BarterRequest from '../models/BarterRequest.js';

// @desc    Get or create chat for a barter request
// @route   POST /api/chats
// @access  Private
export const getOrCreateChat = async (req, res) => {
  try {
    const { barterRequestId } = req.body;

    // Check if barter request exists and is accepted
    const barterRequest = await BarterRequest.findById(barterRequestId);
    
    if (!barterRequest) {
      return res.status(404).json({ message: 'Barter request not found' });
    }

    if (barterRequest.status !== 'accepted' && barterRequest.status !== 'completed') {
      return res.status(400).json({ message: 'Barter request must be accepted to chat' });
    }

    // Check if user is part of this barter
    if (barterRequest.sender.toString() !== req.user._id.toString() &&
        barterRequest.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find existing chat or create new one
    let chat = await Chat.findOne({ barterRequest: barterRequestId })
      .populate('participants', 'name email avatar')
      .populate('barterRequest');

    if (!chat) {
      chat = await Chat.create({
        participants: [barterRequest.sender, barterRequest.receiver],
        barterRequest: barterRequestId
      });

      chat = await Chat.findById(chat._id)
        .populate('participants', 'name email avatar')
        .populate('barterRequest');
    }

    res.json(chat);
  } catch (error) {
    console.error('Get or create chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's chats
// @route   GET /api/chats
// @access  Private
export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
      .populate('participants', 'name email avatar')
      .populate('barterRequest')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get messages for a chat
// @route   GET /api/chats/:id/messages
// @access  Private
export const getChatMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Mark unread messages as read
    await Message.updateMany(
      { chat: req.params.id, sender: { $ne: req.user._id }, isRead: false },
      { $set: { isRead: true } }
    );

    const messages = await Message.find({ chat: req.params.id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Send message
// @route   POST /api/chats/:id/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { content, messageType, mediaUrl } = req.body;

    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = await Message.create({
      chat: req.params.id,
      sender: req.user._id,
      content,
      messageType: messageType || 'text',
      mediaUrl
    });

    // Update chat's last message
    chat.lastMessage = message._id;
    chat.lastMessageAt = new Date();
    await chat.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get total unread message count
// @route   GET /api/chats/unread/count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
    // Find all chats where user is a participant
    const chats = await Chat.find({ participants: req.user._id });
    const chatIds = chats.map(chat => chat._id);

    // Count unread messages in these chats where sender is NOT the user
    const count = await Message.countDocuments({
      chat: { $in: chatIds },
      sender: { $ne: req.user._id },
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
