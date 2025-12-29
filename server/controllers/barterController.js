import BarterRequest from "../models/BarterRequest.js";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Session from "../models/Session.js";
import {
  sendBarterRequestEmail,
  sendStatusUpdateEmail,
} from "../utils/emailService.js";

// @desc    Create barter request
// @route   POST /api/barters
// @access  Private
export const createBarterRequest = async (req, res) => {
  try {
    const { receiverId, skillOffered, skillRequested, message } = req.body;

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Check if request already exists
    const existingRequest = await BarterRequest.findOne({
      sender: req.user._id,
      receiver: receiverId,
      status: "pending",
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "You already have a pending request with this user" });
    }

    // Create barter request
    const barterRequest = await BarterRequest.create({
      sender: req.user._id,
      receiver: receiverId,
      skillOffered,
      skillRequested,
      message,
    });

    const populatedRequest = await BarterRequest.findById(barterRequest._id)
      .populate("sender", "name email avatar skillsOffered")
      .populate("receiver", "name email avatar skillsWanted");

    // Send email notification (don't let email failure break the request)
    let emailStatus = { sent: false };
    try {
      const emailResult = await sendBarterRequestEmail(
        receiver.email,
        req.user.name,
        skillOffered,
        skillRequested
      );

      if (emailResult && emailResult.success) {
        emailStatus = { sent: true };
      } else {
        console.warn(
          "⚠️ Barter request created but email notification failed:",
          emailResult?.error
        );
        emailStatus = { sent: false, error: emailResult?.error };
      }
    } catch (emailError) {
      console.error("❌ Email service error:", emailError.message);
      emailStatus = { sent: false, error: emailError.message };
    }

    res.status(201).json({ ...populatedRequest.toObject(), emailStatus });
  } catch (error) {
    console.error("Create barter request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user's barter requests
// @route   GET /api/barters
// @access  Private
export const getBarterRequests = async (req, res) => {
  try {
    const { type, status } = req.query;

    let query = {};

    if (type === "sent") {
      query.sender = req.user._id;
    } else if (type === "received") {
      query.receiver = req.user._id;
    } else {
      // Get all requests where user is sender or receiver
      query.$or = [{ sender: req.user._id }, { receiver: req.user._id }];
    }

    if (status) {
      query.status = status;
    }

    const requests = await BarterRequest.find(query)
      .populate("sender", "name email avatar skillsOffered")
      .populate("receiver", "name email avatar skillsWanted")
      .sort({ createdAt: -1 })
      .lean();

    // Add unread message count and session info to each request
    const requestsWithExtras = await Promise.all(
      requests.map(async (request) => {
        let extras = { unreadCount: 0, session: null };

        if (request.status === "accepted" || request.status === "completed") {
          const chat = await Chat.findOne({ barterRequest: request._id });
          if (chat) {
            extras.unreadCount = await Message.countDocuments({
              chat: chat._id,
              sender: { $ne: req.user._id },
              isRead: false,
            });
          }

          const session = await Session.findOne({ barterRequest: request._id });
          if (session) {
            extras.session = session;
          }
        }
        return { ...request, ...extras };
      })
    );

    res.json(requestsWithExtras);
  } catch (error) {
    console.error("Get barter requests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get barter request by ID
// @route   GET /api/barters/:id
// @access  Private
export const getBarterRequestById = async (req, res) => {
  try {
    const request = await BarterRequest.findById(req.params.id)
      .populate("sender", "name email avatar skillsOffered")
      .populate("receiver", "name email avatar skillsWanted");

    if (!request) {
      return res.status(404).json({ message: "Barter request not found" });
    }

    // Check if user is part of this request
    if (
      request.sender._id.toString() !== req.user._id.toString() &&
      request.receiver._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this request" });
    }

    res.json(request);
  } catch (error) {
    console.error("Get barter request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Accept barter request
// @route   PUT /api/barters/:id/accept
// @access  Private
export const acceptBarterRequest = async (req, res) => {
  try {
    const request = await BarterRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Barter request not found" });
    }

    // Only receiver can accept
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the receiver can accept this request" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request is not pending" });
    }

    request.status = "accepted";
    await request.save();

    // Create chat for this barter
    const chat = await Chat.create({
      participants: [request.sender, request.receiver],
      barterRequest: request._id,
    });

    const populatedRequest = await BarterRequest.findById(request._id)
      .populate("sender", "name email avatar skillsOffered")
      .populate("receiver", "name email avatar skillsWanted");

    // Send email to sender (don't let email failure break the operation)
    try {
      const sender = await User.findById(request.sender);
      await sendStatusUpdateEmail(
        sender.email,
        sender.name,
        "accepted",
        populatedRequest.skillOffered,
        populatedRequest.skillRequested
      );
    } catch (emailError) {
      console.error("❌ Failed to send acceptance email:", emailError.message);
    }

    res.json({ request: populatedRequest, chat });
  } catch (error) {
    console.error("Accept barter request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Reject barter request
// @route   PUT /api/barters/:id/reject
// @access  Private
export const rejectBarterRequest = async (req, res) => {
  try {
    const request = await BarterRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Barter request not found" });
    }

    // Only receiver can reject
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the receiver can reject this request" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request is not pending" });
    }

    request.status = "rejected";
    await request.save();

    const populatedRequest = await BarterRequest.findById(request._id)
      .populate("sender", "name email avatar skillsOffered")
      .populate("receiver", "name email avatar skillsWanted");

    // Send email to sender (don't let email failure break the operation)
    try {
      const sender = await User.findById(request.sender);
      await sendStatusUpdateEmail(
        sender.email,
        sender.name,
        "rejected",
        populatedRequest.skillOffered,
        populatedRequest.skillRequested
      );
    } catch (emailError) {
      console.error("❌ Failed to send rejection email:", emailError.message);
    }

    res.json(populatedRequest);
  } catch (error) {
    console.error("Reject barter request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Mark barter request as completed
// @route   PUT /api/barters/:id/complete
// @access  Private
export const completeBarterRequest = async (req, res) => {
  try {
    const request = await BarterRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Barter request not found" });
    }

    const userId = req.user._id.toString();
    const isSender = request.sender.toString() === userId;
    const isReceiver = request.receiver.toString() === userId;

    // Check authorization
    if (!isSender && !isReceiver) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (request.status !== "accepted") {
      return res
        .status(400)
        .json({ message: "Request must be accepted first" });
    }

    // Update individual completion status
    if (isSender) {
      request.senderCompleted = true;
    } else if (isReceiver) {
      request.receiverCompleted = true;
    }

    // Check if both have completed
    if (request.senderCompleted && request.receiverCompleted) {
      request.status = "completed";
    }

    await request.save();

    const populatedRequest = await BarterRequest.findById(request._id)
      .populate("sender", "name email avatar skillsOffered")
      .populate("receiver", "name email avatar skillsWanted");

    res.json(populatedRequest);
  } catch (error) {
    console.error("Complete barter request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
