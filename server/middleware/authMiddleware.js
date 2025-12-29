import jwt from "jsonwebtoken";
import { requireAuth, attachUser } from "./clerkAuth.js";

export const protect = [requireAuth, attachUser];

// Generate JWT token (legacy - used for backward compatibility)
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
