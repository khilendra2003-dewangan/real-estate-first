import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  state: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  pincode: {
    type: String,
    default: "",
  },
  profileImage: {
    url: String,
    publicId: String,
  },
  role: {
    type: String,
    enum: ["user", "admin", "agent"],
    default: "user",
  },
  // Agent-specific fields
  isApproved: {
    type: Boolean,
    default: false,
  },
  agencyName: {
    type: String,
    default: "",
  },
  licenseNumber: {
    type: String,
    default: "",
  },
  experience: {
    type: Number,
    default: 0,
  },
  specialization: {
    type: [String],
    default: [],
  },
  bio: {
    type: String,
    default: "",
  },
  // Agent rejection reason (if rejected by admin)
  rejectionReason: {
    type: String,
    default: "",
  },
  approvedAt: {
    type: Date,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

// Index for faster queries
// Email index is already created by unique: true
userSchema.index({ role: 1, isApproved: 1 });

export const User = mongoose.model("User", userSchema);
