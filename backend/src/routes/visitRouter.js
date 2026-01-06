import express from "express";
import { isAuth, authorizeRoles } from "../middleware/isAuth.js";
import {
    scheduleVisit,
    getUserVisits,
    getAgentVisits,
    updateVisitStatus,
    cancelVisit,
    getVisitById,
    rescheduleVisit,
} from "../controller/visitController.js";

const visitRouter = express.Router();

// All routes require authentication
visitRouter.use(isAuth);

// User Routes
visitRouter.post("/", scheduleVisit);
visitRouter.get("/my-visits", getUserVisits);
visitRouter.get("/:id", getVisitById);
visitRouter.put("/:id/cancel", cancelVisit);
visitRouter.put("/:id/reschedule", rescheduleVisit);

// Agent Routes
visitRouter.get("/agent/visits", authorizeRoles("agent"), getAgentVisits);
visitRouter.put("/:id/status", authorizeRoles("agent"), updateVisitStatus);

export default visitRouter;
