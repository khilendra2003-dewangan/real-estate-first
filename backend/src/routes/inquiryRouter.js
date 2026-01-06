import express from "express";
import { isAuth, authorizeRoles } from "../middleware/isAuth.js";
import {
    createInquiry,
    getUserInquiries,
    getAgentInquiries,
    respondToInquiry,
    closeInquiry,
    getInquiryById,
} from "../controller/inquiryController.js";

const inquiryRouter = express.Router();

// All routes require authentication
inquiryRouter.use(isAuth);

// User Routes
inquiryRouter.post("/", createInquiry);
inquiryRouter.get("/my-inquiries", getUserInquiries);
inquiryRouter.get("/:id", getInquiryById);
inquiryRouter.put("/:id/close", closeInquiry);

// Agent Routes
inquiryRouter.get("/agent/inquiries", authorizeRoles("agent"), getAgentInquiries);
inquiryRouter.put("/:id/respond", authorizeRoles("agent"), respondToInquiry);

export default inquiryRouter;
