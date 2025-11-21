import Session from '../models/Session.js';
import BarterRequest from '../models/BarterRequest.js';

// @desc    Create session
// @route   POST /api/sessions
// @access  Private
export const createSession = async (req, res) => {
  try {
    const { barterRequestId, meetLink, scheduledAt } = req.body;

    // Check if barter request exists and is accepted
    const barterRequest = await BarterRequest.findById(barterRequestId)
      .populate('sender receiver');

    if (!barterRequest) {
      return res.status(404).json({ message: 'Barter request not found' });
    }

    if (barterRequest.status !== 'accepted') {
      return res.status(400).json({ message: 'Barter request must be accepted' });
    }

    // Check if user is part of this barter
    if (barterRequest.sender._id.toString() !== req.user._id.toString() &&
        barterRequest.receiver._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if session already exists
    let session = await Session.findOne({ barterRequest: barterRequestId });

    if (session) {
      return res.status(400).json({ message: 'Session already exists for this barter' });
    }

    // Create session
    session = await Session.create({
      barterRequest: barterRequestId,
      meetLink,
      scheduledAt,
      participants: [
        { user: barterRequest.sender._id, isReady: false },
        { user: barterRequest.receiver._id, isReady: false }
      ],
      meetingInstances: [],
      currentInstance: 0,
      totalDuration: 0
    });

    const populatedSession = await Session.findById(session._id)
      .populate('barterRequest')
      .populate('participants.user', 'name email avatar');

    res.status(201).json(populatedSession);
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get session by barter request ID
// @route   GET /api/sessions/barter/:barterId
// @access  Private
export const getSessionByBarterId = async (req, res) => {
  try {
    const session = await Session.findOne({ barterRequest: req.params.barterId })
      .populate('barterRequest')
      .populate('participants.user', 'name email avatar');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is participant
    const isParticipant = session.participants.some(
      p => p.user._id.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(session);
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Start a new meeting instance
// @route   PUT /api/sessions/:id/start
// @access  Private
export const startMeetingInstance = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('participants.user', 'name email avatar');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is participant
    const isParticipant = session.participants.some(
      p => p.user._id.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if both participants are ready
    const allReady = session.participants.every(p => p.isReady);
    if (!allReady) {
      return res.status(400).json({ message: 'Both participants must be ready' });
    }

    // Check if there's already an in-progress instance
    const hasInProgress = session.meetingInstances.some(
      instance => instance.status === 'in-progress'
    );

    if (hasInProgress) {
      return res.status(400).json({ message: 'A meeting is already in progress' });
    }

    // Create new meeting instance
    const newInstanceNumber = session.currentInstance + 1;
    session.meetingInstances.push({
      instanceNumber: newInstanceNumber,
      startedAt: new Date(),
      status: 'in-progress'
    });

    session.currentInstance = newInstanceNumber;
    session.status = 'in-progress';

    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate('barterRequest')
      .populate('participants.user', 'name email avatar');

    res.json(populatedSession);
  } catch (error) {
    console.error('Start meeting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    End current meeting instance
// @route   PUT /api/sessions/:id/end
// @access  Private
export const endMeetingInstance = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is participant
    const isParticipant = session.participants.some(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find the in-progress instance
    const inProgressInstance = session.meetingInstances.find(
      instance => instance.status === 'in-progress'
    );

    if (!inProgressInstance) {
      return res.status(400).json({ message: 'No meeting in progress' });
    }

    // Calculate duration
    const endTime = new Date();
    const startTime = new Date(inProgressInstance.startedAt);
    const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));

    // Update instance
    inProgressInstance.endedAt = endTime;
    inProgressInstance.duration = durationMinutes;
    inProgressInstance.status = 'completed';

    // Update total duration
    session.totalDuration += durationMinutes;

    // Reset ready status for next meeting
    session.participants.forEach(p => {
      p.isReady = false;
    });

    session.status = 'scheduled'; // Ready for next instance

    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate('barterRequest')
      .populate('participants.user', 'name email avatar');

    res.json(populatedSession);
  } catch (error) {
    console.error('End meeting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark user as ready
// @route   PUT /api/sessions/:id/ready
// @access  Private
export const markUserReady = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('participants.user', 'name email avatar');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Find participant
    const participant = session.participants.find(
      p => p.user._id.toString() === req.user._id.toString()
    );

    if (!participant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    participant.isReady = true;

    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate('barterRequest')
      .populate('participants.user', 'name email avatar');

    res.json(populatedSession);
  } catch (error) {
    console.error('Mark ready error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Complete entire session (no more meetings)
// @route   PUT /api/sessions/:id/complete
// @access  Private
export const completeSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is participant
    const isParticipant = session.participants.some(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    session.status = 'completed';
    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate('barterRequest')
      .populate('participants.user', 'name email avatar');

    res.json(populatedSession);
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
