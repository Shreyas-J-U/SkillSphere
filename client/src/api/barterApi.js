import api from '../utils/api';

export const createBarterRequest = async (requestData) => {
  const response = await api.post('/barters', requestData);
  return response.data;
};

export const getBarterRequests = async (params = {}) => {
  const response = await api.get('/barters', { params });
  return response.data;
};

export const getBarterRequestById = async (id) => {
  const response = await api.get(`/barters/${id}`);
  return response.data;
};

export const acceptBarterRequest = async (id) => {
  const response = await api.put(`/barters/${id}/accept`);
  return response.data;
};

export const rejectBarterRequest = async (id) => {
  const response = await api.put(`/barters/${id}/reject`);
  return response.data;
};

export const completeBarterRequest = async (id) => {
  const response = await api.put(`/barters/${id}/complete`);
  return response.data;
};
