import express from "express";
import { isAuth, authorizeRoles } from "../middleware/isAuth.js";
import {
    createCategory,
    getAllCategories,
    getCategoryBySlug,
    updateCategory,
    deleteCategory,
    seedCategories,
} from "../controller/categoryController.js";

const categoryRouter = express.Router();

// Public Routes
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:slug", getCategoryBySlug);

// Admin Only Routes
categoryRouter.post("/", isAuth, authorizeRoles("admin"), createCategory);
categoryRouter.put("/:id", isAuth, authorizeRoles("admin"), updateCategory);
categoryRouter.delete("/:id", isAuth, authorizeRoles("admin"), deleteCategory);
// Seed route - no auth required for initial setup (will fail if categories already exist)
categoryRouter.post("/seed", seedCategories);

export default categoryRouter;
