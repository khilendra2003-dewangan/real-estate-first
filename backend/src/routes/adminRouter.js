import express from "express";
import { isAuth, authorizeRoles } from "../middleware/isAuth.js";
import {
    getAllAgents,
    approveAgent,
    rejectAgent,
    getPendingProperties,
    approveProperty,
    rejectProperty,
    getAllPropertiesAdmin,
    getAdminDashboard,
} from "../controller/adminController.js";

const adminRouter = express.Router();

// All routes require admin authentication
adminRouter.use(isAuth, authorizeRoles("admin"));

// Dashboard
adminRouter.get("/dashboard", getAdminDashboard);

// Agent Management
adminRouter.get("/agents", getAllAgents);
adminRouter.put("/agents/:id/approve", approveAgent);
adminRouter.put("/agents/:id/reject", rejectAgent);

// Property Management
adminRouter.get("/properties", getAllPropertiesAdmin);
adminRouter.get("/properties/pending", getPendingProperties);
adminRouter.put("/properties/:id/approve", approveProperty);
adminRouter.put("/properties/:id/reject", rejectProperty);

export default adminRouter;
