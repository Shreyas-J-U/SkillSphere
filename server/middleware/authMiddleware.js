import { requireAuth, attachUser } from "./clerkAuth.js";

export const protect = [requireAuth, attachUser];

// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
