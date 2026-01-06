import express from "express";
import {
    signUpUser,
    verifyUser,
    loginUser,
    verifyOtp,
    getUserProfile,
    refreshAccessToken,
    updateProfile,
    logoutUser,
    getAllUsers,
    getAllAgents,
    getAgentPublicProfile,
    resendOtp,
} from "../controller/userController.js";
import { isAuth, authorizeRoles } from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";

const userRouter = express.Router();

// Public Routes
userRouter.post("/signup", signUpUser);
userRouter.post("/verify/:token", verifyUser);
userRouter.post("/login", loginUser);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/resend-otp", resendOtp);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.get("/agents", getAllAgents);
userRouter.get("/agents/:id", getAgentPublicProfile);

// Protected Routes
userRouter.get("/me", isAuth, getUserProfile);
userRouter.put("/update-profile", isAuth, upload.single("profileImage"), updateProfile);
userRouter.post("/logout", isAuth, logoutUser);

// Admin Only Routes
userRouter.get("/all", isAuth, authorizeRoles("admin"), getAllUsers);

export default userRouter;
