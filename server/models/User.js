import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    clerkId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined values to not conflict
    },
    password: {
      type: String,
      required: [false, "Password is required"], // Made optional for Clerk users
      minlength: 6,
      select: false,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    skillsOffered: [
      {
        type: String,
        trim: true,
      },
    ],
    skillsWanted: [
      {
        type: String,
        trim: true,
      },
    ],
    // Rating statistics
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    ratingBreakdown: {
      communication: {
        type: Number,
        default: 0,
      },
      skillQuality: {
        type: Number,
        default: 0,
      },
      punctuality: {
        type: Number,
        default: 0,
      },
      professionalism: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
