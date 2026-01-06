import sanitize from "mongo-sanitize";
import { redisClient } from "../../index.js";
import TryCatch from "../middleware/TryCatch.js";
import { User } from "../model/UserModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendmail from "../config/sendmail.js";
import { generateHtmlOTP, getVerifyEmailHtml, getAgentApprovalHtml, getAgentRejectionHtml } from "../config/html.js";
import { loginSchema, signupSchema, agentSignupSchema } from "../config/zodValidation.js";
import { genearateToken, generateAccessToken, verifyRefreshToken } from "../config/generateToken.js";
import cloudinary from "../config/cloudinary.js";

// User/Agent Signup
export const signUpUser = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  const { role } = sanitizedBody;

  // Use appropriate schema based on role
  const schema = role === "agent" ? agentSignupSchema : signupSchema;
  const validation = schema.safeParse(sanitizedBody);

  if (!validation.success) {
    const zodError = validation.error;
    const allError = zodError?.issues?.map((issue) => ({
      field: issue.path?.join(".") || "Unknown",
      message: issue.message || "validation error",
      code: issue.code,
    })) || [];

    return res.status(400).json({
      message: allError[0]?.message || "Validation Error",
      errors: allError,
    });
  }

  const { name, email, password, contact, agencyName, licenseNumber, experience, specialization } = validation.data;

  const rateLimiting = `signup-rate-limiting:${req.ip}:${email}`;
  if (await redisClient.get(rateLimiting)) {
    return res.status(429).json({
      message: "Too many requests, please try again later",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const verifyKey = `verify:${verifyToken}`;
  const verifyEmailKey = `verify:email:${email}`;

  const oldToken = await redisClient.get(verifyEmailKey);
  if (oldToken) {
    await redisClient.del(`verify:${oldToken}`);
  }

  const data = JSON.stringify({
    name,
    email,
    password: hashPassword,
    contact,
    role: role || "user",
    // Agent-specific fields
    ...(role === "agent" && {
      agencyName: agencyName || "",
      licenseNumber: licenseNumber || "",
      experience: experience || 0,
      specialization: specialization || [],
    }),
  });

  await redisClient.set(verifyKey, data, { EX: 300 });
  await redisClient.set(verifyEmailKey, verifyToken, { EX: 300 });

  const subject = "Verification link for your Real Estate account";
  const html = getVerifyEmailHtml({ name, email, verifyToken });

  await sendmail({ email, subject, html });
  await redisClient.set(rateLimiting, "true", { EX: 60 });

  res.status(200).json({
    message: "If your email is valid, a verification link has been sent. Valid for 5 minutes.",
  });
});

// Verify Email
export const verifyUser = TryCatch(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      message: "Token is missing",
    });
  }

  const verifyKey = `verify:${token}`;
  const storeDataJson = await redisClient.get(verifyKey);

  if (!storeDataJson) {
    return res.status(400).json({
      message: "Verification link has expired",
    });
  }

  const storeData = JSON.parse(storeDataJson);

  const existingUser = await User.findOne({ email: storeData.email });
  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const userData = {
    name: storeData.name,
    email: storeData.email,
    password: storeData.password,
    contact: storeData.contact,
    role: storeData.role || "user",
  };

  // Add agent-specific fields if registering as agent
  if (storeData.role === "agent") {
    userData.agencyName = storeData.agencyName || "";
    userData.licenseNumber = storeData.licenseNumber || "";
    userData.experience = storeData.experience || 0;
    userData.specialization = storeData.specialization || [];
    userData.isApproved = false; // Agents need admin approval
  }

  const newUser = await User.create(userData);
  await redisClient.del(verifyKey);

  const responseMessage = storeData.role === "agent"
    ? "Email verified successfully! Your agent account is pending admin approval."
    : "Email verified successfully! You can now login.";

  res.status(200).json({
    message: responseMessage,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      contact: newUser.contact,
      role: newUser.role,
      isApproved: newUser.isApproved,
    },
  });
});

// Login User
export const loginUser = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  const validation = loginSchema.safeParse(sanitizedBody);

  if (!validation.success) {
    const zodError = validation.error;
    const allError = zodError?.issues?.map((issue) => ({
      field: issue.path?.join(".") || "Unknown",
      message: issue.message || "validation error",
      code: issue.code,
    })) || [];

    return res.status(400).json({
      message: allError[0]?.message || "Validation Error",
      errors: allError,
    });
  }

  const { email, password } = validation.data;

  const rateLimitKey = `login-rate-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many requests, please try again later",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  // Check if agent is approved
  if (user.role === "agent" && !user.isApproved) {
    return res.status(403).json({
      message: "Your agent account is pending admin approval. Please wait for approval.",
      isApproved: false,
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, otp, { EX: 300 });

  const subject = "OTP for Real Estate Login Verification";
  const html = generateHtmlOTP({ name: user.name, email, otp });

  await sendmail({ email, subject, html });
  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  res.status(200).json({
    message: "OTP has been sent to your email",
  });
});

// Verify OTP
export const verifyOtp = TryCatch(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: "Email and OTP are required",
    });
  }

  const otpKey = `otp:${email}`;
  const storeOtp = await redisClient.get(otpKey);

  if (!storeOtp) {
    return res.status(400).json({
      message: "OTP expired or invalid",
    });
  }

  if (storeOtp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  await redisClient.del(otpKey);

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  const { accessToken: token } = await genearateToken(user._id, res);

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      contact: user.contact,
      role: user.role,
      isApproved: user.isApproved,
      profileImage: user.profileImage,
    },
  });
});

// Resend OTP
export const resendOtp = TryCatch(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  const rateLimitKey = `resend-otp-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Please wait before resending OTP",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, otp, { EX: 300 });

  const subject = "Resend OTP for Real Estate Login Verification";
  const html = generateHtmlOTP({ name: user.name, email, otp });

  await sendmail({ email, subject, html });
  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  res.status(200).json({
    message: "OTP resent successfully",
  });
});

// Get User Profile
export const getUserProfile = TryCatch(async (req, res) => {
  const userId = req.user.id;
  const userData = await User.findById(userId).select("-password");

  if (!userData) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    message: "User profile fetched successfully",
    user: userData,
  });
});

// Refresh Access Token
export const refreshAccessToken = TryCatch(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({
      message: "Please login, no refresh token found",
    });
  }

  const decode = await verifyRefreshToken(token);
  if (!decode) {
    return res.status(403).json({
      message: "Invalid or expired refresh token",
    });
  }

  const newToken = await generateAccessToken(decode.id, res);

  return res.status(200).json({
    message: "Access token refreshed successfully",
    accessToken: newToken,
  });
});

// Update Profile
export const updateProfile = TryCatch(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({
      message: "Please login, you are not authenticated",
    });
  }

  const { name, address, city, state, country, pincode, contact, bio, agencyName, experience, specialization } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({
      message: "No user found with this ID",
    });
  }

  // Handle profile image upload
  if (req.file) {
    if (user.profileImage?.publicId) {
      await cloudinary.uploader.destroy(user.profileImage.publicId);
    }
    user.profileImage = {
      url: req.file.path,
      publicId: req.file.filename,
    };
  }

  // Update user fields
  user.name = name || user.name;
  user.address = address || user.address;
  user.city = city || user.city;
  user.state = state || user.state;
  user.country = country || user.country;
  user.pincode = pincode || user.pincode;
  user.contact = contact || user.contact;

  // Update agent-specific fields
  if (user.role === "agent") {
    user.bio = bio || user.bio;
    user.agencyName = agencyName || user.agencyName;
    user.experience = experience === "" ? 0 : (experience !== undefined ? experience : user.experience);

    // Handle specialization parsing if sent as string (from FormData)
    if (specialization) {
      if (typeof specialization === 'string') {
        try {
          // Try parsing if it's a JSON string
          user.specialization = JSON.parse(specialization);
        } catch (e) {
          // If comma separated string
          user.specialization = specialization.split(',').map(s => s.trim()).filter(Boolean);
        }
      } else if (Array.isArray(specialization)) {
        user.specialization = specialization;
      }
    }
  }

  await user.save();

  res.status(200).json({
    message: "Profile updated successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      contact: user.contact,
      role: user.role,
      profileImage: user.profileImage,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
      pincode: user.pincode,
      ...(user.role === "agent" && {
        agencyName: user.agencyName,
        licenseNumber: user.licenseNumber,
        experience: user.experience,
        specialization: user.specialization,
        bio: user.bio,
        isApproved: user.isApproved,
      }),
    },
  });
});

// Logout User
export const logoutUser = TryCatch(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({
      message: "You are not authenticated",
    });
  }

  const refreshTokenKey = `refresh_token:${userId}`;
  await redisClient.del(refreshTokenKey);

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
});

// Get All Users (Admin only)
export const getAllUsers = TryCatch(async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query;

  const query = {};

  if (role) {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await User.countDocuments(query);

  res.status(200).json({
    message: "Users fetched successfully",
    users,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    },
  });
});

// Get All Agents (Public)
export const getAllAgents = TryCatch(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;

  const query = {
    role: "agent",
    isApproved: true,
  };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { agencyName: { $regex: search, $options: "i" } },
      { "location.city": { $regex: search, $options: "i" } },
    ];
  }

  const agents = await User.find(query)
    .select("name email contact agencyName profileImage experience specialization bio licenseNumber approvedAt")
    .sort({ approvedAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await User.countDocuments(query);

  res.status(200).json({
    message: "Agents fetched successfully",
    agents,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalAgents: total,
    },
  });
});

// Get Agent Public Profile
export const getAgentPublicProfile = TryCatch(async (req, res) => {
  const { id } = req.params;

  const agent = await User.findOne({ _id: id, role: "agent", isApproved: true })
    .select("name email contact agencyName profileImage experience specialization bio licenseNumber approvedAt");

  if (!agent) {
    return res.status(404).json({
      message: "Agent not found",
    });
  }

  res.status(200).json({
    message: "Agent profile fetched successfully",
    agent,
  });
});
