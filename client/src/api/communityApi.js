import api from "../utils/api";

export const createPost = async (postData) => {
  const response = await api.post("/community", postData);
  return response.data;
};

export const getPosts = async () => {
  const response = await api.get("/community");
  return response.data;
};

export const likePost = async (postId) => {
  const response = await api.put(`/community/${postId}/like`);
  return response.data;
};

export const addComment = async (postId, content) => {
  const response = await api.post(`/community/${postId}/comment`, { content });
  return response.data;
};
