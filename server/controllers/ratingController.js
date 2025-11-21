import Rating from '../models/Rating.js';
import BarterRequest from '../models/BarterRequest.js';
import User from '../models/User.js';

// @desc    Submit rating for a completed barter
// @route   POST /api/ratings
// @access  Private
export const submitRating = async (req, res) => {
  try {
    const { barterRequestId, rateeId, rating, review, categories } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if barter request exists and is completed
    const barterRequest = await BarterRequest.findById(barterRequestId);
    if (!barterRequest) {
      return res.status(404).json({ message: 'Barter request not found' });
    }

    if (barterRequest.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed barters' });
    }

    // Verify user is part of this barter
    const isParticipant = 
      barterRequest.sender.toString() === req.user._id.toString() ||
      barterRequest.receiver.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to rate this barter' });
    }

    // Verify ratee is the other participant
    const otherParticipant = barterRequest.sender.toString() === req.user._id.toString()
      ? barterRequest.receiver.toString()
      : barterRequest.sender.toString();

    if (otherParticipant !== rateeId) {
      return res.status(400).json({ message: 'Invalid ratee' });
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({
      barterRequest: barterRequestId,
      rater: req.user._id
    });

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this barter' });
    }

    // Create rating
    const newRating = await Rating.create({
      barterRequest: barterRequestId,
      rater: req.user._id,
      ratee: rateeId,
      rating,
      review,
      categories: categories || {}
    });

    // Update ratee's rating statistics
    await updateUserRatingStats(rateeId);

    const populatedRating = await Rating.findById(newRating._id)
      .populate('rater', 'name avatar')
      .populate('ratee', 'name avatar');

    res.status(201).json(populatedRating);
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get ratings for a user
// @route   GET /api/ratings/user/:userId
// @access  Public
export const getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const ratings = await Rating.find({ ratee: userId })
      .populate('rater', 'name avatar')
      .populate('barterRequest', 'skillOffered skillRequested')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Rating.countDocuments({ ratee: userId });

    res.json({
      ratings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get rating for a specific barter
// @route   GET /api/ratings/barter/:barterRequestId
// @access  Private
export const getBarterRatings = async (req, res) => {
  try {
    const { barterRequestId } = req.params;

    const ratings = await Rating.find({ barterRequest: barterRequestId })
      .populate('rater', 'name avatar')
      .populate('ratee', 'name avatar');

    res.json(ratings);
  } catch (error) {
    console.error('Get barter ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Check if user can rate a barter
// @route   GET /api/ratings/can-rate/:barterRequestId
// @access  Private
export const canRateBarter = async (req, res) => {
  try {
    const { barterRequestId } = req.params;

    const barterRequest = await BarterRequest.findById(barterRequestId);
    if (!barterRequest) {
      return res.status(404).json({ message: 'Barter request not found' });
    }

    // Check if completed
    if (barterRequest.status !== 'completed') {
      return res.json({ canRate: false, reason: 'Barter not completed' });
    }

    // Check if user is participant
    const isParticipant = 
      barterRequest.sender.toString() === req.user._id.toString() ||
      barterRequest.receiver.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.json({ canRate: false, reason: 'Not a participant' });
    }

    // Check if already rated
    const existingRating = await Rating.findOne({
      barterRequest: barterRequestId,
      rater: req.user._id
    });

    if (existingRating) {
      return res.json({ canRate: false, reason: 'Already rated', rating: existingRating });
    }

    // Get the other participant
    const otherParticipantId = barterRequest.sender.toString() === req.user._id.toString()
      ? barterRequest.receiver
      : barterRequest.sender;

    const otherParticipant = await User.findById(otherParticipantId).select('name avatar');

    res.json({ 
      canRate: true, 
      otherParticipant: {
        _id: otherParticipantId,
        name: otherParticipant.name,
        avatar: otherParticipant.avatar
      }
    });
  } catch (error) {
    console.error('Can rate barter error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to update user rating statistics
async function updateUserRatingStats(userId) {
  try {
    const ratings = await Rating.find({ ratee: userId });

    if (ratings.length === 0) {
      return;
    }

    // Calculate average rating
    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / ratings.length;

    // Calculate category averages
    const categoryTotals = {
      communication: 0,
      skillQuality: 0,
      punctuality: 0,
      professionalism: 0
    };
    const categoryCounts = {
      communication: 0,
      skillQuality: 0,
      punctuality: 0,
      professionalism: 0
    };

    ratings.forEach(rating => {
      if (rating.categories) {
        Object.keys(categoryTotals).forEach(category => {
          if (rating.categories[category]) {
            categoryTotals[category] += rating.categories[category];
            categoryCounts[category]++;
          }
        });
      }
    });

    const ratingBreakdown = {};
    Object.keys(categoryTotals).forEach(category => {
      ratingBreakdown[category] = categoryCounts[category] > 0
        ? categoryTotals[category] / categoryCounts[category]
        : 0;
    });

    // Update user
    await User.findByIdAndUpdate(userId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalRatings: ratings.length,
      ratingBreakdown
    });
  } catch (error) {
    console.error('Update user rating stats error:', error);
  }
}
