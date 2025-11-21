import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from './models/Message.js';
import Chat from './models/Chat.js';

// Store user socket mappings
const userSocketMap = new Map();

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);
    
    // Store user socket mapping
    userSocketMap.set(socket.userId, socket.id);

    // Join user to their personal room
    socket.join(socket.userId);

    // Join chat room
    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.userId} joined chat ${chatId}`);
    });

    // Leave chat room
    socket.on('leave_chat', (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.userId} left chat ${chatId}`);
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { chatId, content, messageType, mediaUrl } = data;

        // Create message in database
        const message = await Message.create({
          chat: chatId,
          sender: socket.userId,
          content,
          messageType: messageType || 'text',
          mediaUrl
        });

        // Update chat's last message
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: message._id,
          lastMessageAt: new Date()
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name avatar');

        // Emit to all users in the chat room
        io.to(chatId).emit('new_message', populatedMessage);

        // Notify receiver via their personal room if they are not in the chat
        const chatDoc = await Chat.findById(chatId);
        if (chatDoc) {
          const receiverId = chatDoc.participants.find(p => p.toString() !== socket.userId);
          if (receiverId) {
            io.to(receiverId.toString()).emit('new_notification', { 
              type: 'message',
              count: 1 // Increment by 1
            });
          }
        }
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('message_error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { chatId, isTyping } = data;
      socket.to(chatId).emit('user_typing', {
        userId: socket.userId,
        isTyping
      });
    });

    // Session readiness
    socket.on('session_ready', (data) => {
      const { sessionId, barterRequestId, participants } = data;
      
      // Notify other participant
      participants.forEach(participantId => {
        if (participantId !== socket.userId) {
          const participantSocketId = userSocketMap.get(participantId);
          if (participantSocketId) {
            io.to(participantSocketId).emit('participant_ready', {
              sessionId,
              userId: socket.userId
            });
          }
        }
      });
    });

    // Barter request notification
    socket.on('barter_request_sent', (data) => {
      const { receiverId, request } = data;
      const receiverSocketId = userSocketMap.get(receiverId);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new_barter_request', request);
      }
    });

    // Barter status update notification
    socket.on('barter_status_updated', (data) => {
      const { userId, request } = data;
      const userSocketId = userSocketMap.get(userId);
      
      if (userSocketId) {
        io.to(userSocketId).emit('barter_status_changed', request);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
      userSocketMap.delete(socket.userId);
    });
  });

  return io;
};

export { userSocketMap };
