import express from "express";
import { isAuth, authorizeRoles } from "../middleware/isAuth.js";
import { uploadPropertyImages } from "../middleware/multer.js";
import {
    createProperty,
    updateProperty,
    deleteProperty,
    getAgentProperties,
    getAgentDashboard,
    getPropertyById,
    getAllProperties,
    getFeaturedProperties,
    getPropertiesByCategory,
    getPropertiesByAgentId,
} from "../controller/propertyController.js";

const propertyRouter = express.Router();

// Agent Only Routes (must come before /:id to avoid conflicts)
propertyRouter.get(
    "/agent/my-properties",
    isAuth,
    authorizeRoles("agent"),
    getAgentProperties
);

propertyRouter.get(
    "/agent/dashboard",
    isAuth,
    authorizeRoles("agent"),
    getAgentDashboard
);

// Public Routes
propertyRouter.get("/", getAllProperties);
propertyRouter.get("/featured", getFeaturedProperties);
propertyRouter.get("/category/:slug", getPropertiesByCategory);
propertyRouter.get("/agent-properties/:agentId", getPropertiesByAgentId);

// Dynamic routes (must come after static routes)
propertyRouter.get("/:id", getPropertyById);

propertyRouter.post(
    "/",
    isAuth,
    authorizeRoles("agent"),
    uploadPropertyImages.array("images", 10),
    createProperty
);

propertyRouter.put(
    "/:id",
    isAuth,
    authorizeRoles("agent"),
    uploadPropertyImages.array("images", 10),
    updateProperty
);

propertyRouter.delete(
    "/:id",
    isAuth,
    authorizeRoles("agent", "admin"),
    deleteProperty
);

export default propertyRouter;
