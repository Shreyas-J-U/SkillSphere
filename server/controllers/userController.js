import User from '../models/User.js';

// @desc    Get all users (for skill discovery)
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res) => {
  try {
    const { search, skillOffered, skillWanted, sortBy = 'rating' } = req.query;
    
    let query = { _id: { $ne: req.user._id } }; // Exclude current user

    // Search by name, email, or skills
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { skillsOffered: { $regex: search, $options: 'i' } },
        { skillsWanted: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by specific skill offered
    if (skillOffered) {
      query.skillsOffered = { $in: [skillOffered] };
    }

    // Filter by specific skill wanted
    if (skillWanted) {
      query.skillsWanted = { $in: [skillWanted] };
    }

    // Define sort options
    let sortOptions = {};
    if (sortBy === 'rating') {
      // Sort by average rating (descending), then by total ratings (descending)
      sortOptions = { averageRating: -1, totalRatings: -1 };
    } else if (sortBy === 'name') {
      sortOptions = { name: 1 };
    } else if (sortBy === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const users = await User.find(query)
      .select('-password')
      .sort(sortOptions);
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.bio = bio !== undefined ? bio : user.bio;
    user.avatar = avatar || user.avatar;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      skillsOffered: updatedUser.skillsOffered,
      skillsWanted: updatedUser.skillsWanted
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user skills
// @route   PUT /api/users/skills
// @access  Private
export const updateSkills = async (req, res) => {
  try {
    const { skillsOffered, skillsWanted } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (skillsOffered !== undefined) {
      user.skillsOffered = skillsOffered;
    }

    if (skillsWanted !== undefined) {
      user.skillsWanted = skillsWanted;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      skillsOffered: updatedUser.skillsOffered,
      skillsWanted: updatedUser.skillsWanted
    });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
