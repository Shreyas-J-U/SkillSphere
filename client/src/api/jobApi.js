import api from '../utils/api';

/**
 * Get personalized job recommendations based on user's skills
 * @param {number} page - Page number for pagination
 * @param {string} location - Job location (default: "Remote")
 * @returns {Promise<Object>} Job recommendations data
 */
export const getJobRecommendations = async (page = 1, location = 'Remote', employmentType = 'all') => {
  const response = await api.get('/jobs/recommendations', {
    params: { page, location, employmentType }
  });
  return response.data;
};

/**
 * Search jobs manually with custom query
 * @param {string} query - Search query (skills, job title, etc.)
 * @param {string} location - Job location
 * @param {number} page - Page number for pagination
 * @returns {Promise<Object>} Job search results
 */
export const searchJobs = async (query, location = 'Remote', page = 1) => {
  const response = await api.get('/jobs/search', {
    params: { query, location, page }
  });
  return response.data;
};
