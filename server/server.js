// Load environment variables FIRST before any other imports
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load dotenv only in development (local)
if (process.env.NODE_ENV !== "production") {
  try {
    const envPath = join(__dirname, ".env");
    console.log("🔍 Loading .env from:", envPath);

    const dotenv = await import("dotenv");
    const result = dotenv.config({ path: envPath });

    if (result.error) {
      console.error("⚠️ Error loading .env:", result.error);
    } else {
      console.log("✅ .env loaded successfully");
    }
  } catch (err) {
    console.error("⚠️ dotenv import error:", err);
  }
} else {
  console.log(
    "🚀 Production mode — skipping .env load (using system ENV variables)"
  );
}

import express from "express";
import { createServer } from "http";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import { initializeSocket } from "./socket.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import barterRoutes from "./routes/barterRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";

// Initialize Express app
const app = express();
const server = createServer(app);

// Trust proxy (required for rate limiting behind load balancers/proxies like Vercel/Heroku)
app.set("trust proxy", 1);

// Connect to MongoDB
connectDB();

// Initialize Socket.IO
const io = initializeSocket(server);

// Make io accessible to routes
app.set("io", io);

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route (Place BEFORE rate limiters to avoid blocking monitoring)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "SkillSphere API is running",
    timestamp: new Date().toISOString(),
  });
});

// Apply rate limiting to all API routes
app.use("/api/", limiter);

// Routes with specific rate limiting
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/barters", barterRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/community", communityRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║   🚀 SkillSphere Server Running!          ║
║                                           ║
║   📡 Port: ${PORT}                        ║
║   🌍 Environment: ${process.env.NODE_ENV || "development"}           ║
║   🔗 Client URL: ${process.env.CLIENT_URL || "Not Set"}              ║
║   🔗 API: http://localhost:${PORT}/api    ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  server.close(() => process.exit(1));
});
