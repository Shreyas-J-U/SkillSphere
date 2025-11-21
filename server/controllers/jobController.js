import User from '../models/User.js';
import BarterRequest from '../models/BarterRequest.js';
import { searchJobs } from '../services/jobService.js';

// @desc    Get personalized job recommendations based on user's skills
// @route   GET /api/jobs/recommendations
// @access  Private
export const getJobRecommendations = async (req, res) => {
  try {
    const { page = 1, location = 'Remote', employmentType = 'all' } = req.query;
    
    // Get current user with skills
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Aggregate all skills from user profile
    const userSkills = [
      ...user.skillsOffered,
      ...user.skillsWanted
    ];

    // Get skills from completed barter sessions
    const completedBarters = await BarterRequest.find({
      $or: [
        { sender: req.user._id, status: 'completed' },
        { receiver: req.user._id, status: 'completed' }
      ]
    });

    // Extract skills from completed barters
    const barterSkills = completedBarters.flatMap(barter => {
      if (barter.sender.toString() === req.user._id.toString()) {
        // User was sender, they learned skillOffered and taught skillRequested
        return [barter.skillOffered, barter.skillRequested];
      } else {
        // User was receiver, they learned skillRequested and taught skillOffered
        return [barter.skillRequested, barter.skillOffered];
      }
    });

    // Combine and deduplicate all skills
    const allSkills = [...new Set([...userSkills, ...barterSkills])];

    // If user has no skills, return empty results with a message
    if (allSkills.length === 0) {
      return res.json({
        jobs: [],
        totalJobs: 0,
        page: parseInt(page),
        message: 'Add skills to your profile to get personalized job recommendations!',
        userSkills: []
      });
    }

    // Fetch jobs based on skills
    const jobResults = await searchJobs(allSkills, location, parseInt(page), employmentType);

    res.json({
      ...jobResults,
      userSkills: allSkills,
      message: jobResults.isMockData ? 'Showing demo jobs. Add RapidAPI key for real job listings.' : null
    });

  } catch (error) {
    console.error('Get job recommendations error:', error);
    
    if (error.message.includes('rate limit')) {
      return res.status(429).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Failed to fetch job recommendations' });
  }
};

// @desc    Search jobs manually with custom query
// @route   GET /api/jobs/search
// @access  Private
export const searchJobsManually = async (req, res) => {
  try {
    const { query, location = 'Remote', page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Convert query string to skills array
    const skills = query.split(',').map(s => s.trim()).filter(s => s);

    const jobResults = await searchJobs(skills, location, parseInt(page));

    res.json({
      ...jobResults,
      searchQuery: query,
      message: jobResults.isMockData ? 'Showing demo jobs. Add RapidAPI key for real job listings.' : null
    });

  } catch (error) {
    console.error('Search jobs error:', error);
    
    if (error.message.includes('rate limit')) {
      return res.status(429).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Failed to search jobs' });
  }
};
