import api from '../utils/api';

export const createSession = async (sessionData) => {
  const response = await api.post('/sessions', sessionData);
  return response.data;
};

export const getSessionByBarterId = async (barterId) => {
  const response = await api.get(`/sessions/barter/${barterId}`);
  return response.data;
};

export const markUserReady = async (sessionId) => {
  const response = await api.put(`/sessions/${sessionId}/ready`);
  return response.data;
};

export const startMeetingInstance = async (sessionId) => {
  const response = await api.put(`/sessions/${sessionId}/start`);
  return response.data;
};

export const endMeetingInstance = async (sessionId) => {
  const response = await api.put(`/sessions/${sessionId}/end`);
  return response.data;
};

export const completeSession = async (sessionId) => {
  const response = await api.put(`/sessions/${sessionId}/complete`);
  return response.data;
};
