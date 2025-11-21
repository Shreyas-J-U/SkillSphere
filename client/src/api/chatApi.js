import api from '../utils/api';

export const getOrCreateChat = async (barterRequestId) => {
  const response = await api.post('/chats', { barterRequestId });
  return response.data;
};

export const getUserChats = async () => {
  const response = await api.get('/chats');
  return response.data;
};

export const getChatMessages = async (chatId) => {
  const response = await api.get(`/chats/${chatId}/messages`);
  return response.data;
};

export const sendMessage = async (chatId, messageData) => {
  const response = await api.post(`/chats/${chatId}/messages`, messageData);
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get('/chats/unread/count');
  return response.data;
};
