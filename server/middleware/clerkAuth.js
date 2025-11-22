import { createClerkClient } from "@clerk/clerk-sdk-node";
import User from "../models/User.js";

// Lazy initialization to ensure env vars are loaded first
let clerkClient = null;
const getClerkClient = () => {
  if (!clerkClient) {
    clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    });
  }
  return clerkClient;
};

// Middleware to verify Clerk token (custom implementation using verifyToken)
export const requireAuth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token using Clerk client (same approach as socket.js)
    const decoded = await getClerkClient().verifyToken(token);

    // Attach Clerk user ID to request
    req.auth = {
      userId: decoded.sub,
      sessionId: decoded.sid,
    };

    next();
  } catch (error) {
    console.error("❌ requireAuth failed:", {
      message: error.message,
      name: error.name,
    });
    return res
      .status(401)
      .json({ message: "Authentication failed", error: error.message });
  }
};

// Middleware to sync/attach MongoDB user based on Clerk ID
export const attachUser = async (req, res, next) => {
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({ message: "Unauthorized - No Clerk ID" });
  }

  try {
    // Find user by Clerk ID
    let user = await User.findOne({ clerkId: req.auth.userId });

    if (user) {
      req.user = user;
      return next();
    }

    // If user not found, fetch details from Clerk and create in MongoDB
    const clerkUser = await getClerkClient().users.getUser(req.auth.userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const name =
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
      email.split("@")[0];
    const avatar = clerkUser.imageUrl;

    // Check if user exists by email (legacy user migration)
    user = await User.findOne({ email });

    if (user) {
      // Link existing user to Clerk
      user.clerkId = req.auth.userId;
      if (avatar) user.avatar = avatar;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        clerkId: req.auth.userId,
        name,
        email,
        avatar,
        skillsOffered: [],
        skillsWanted: [],
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error details:", {
      message: error.message,
      stack: error.stack,
      clerkId: req.auth?.userId,
    });
    res.status(500).json({
      message: "Server error during authentication",
      error: error.message,
    });
  }
};
