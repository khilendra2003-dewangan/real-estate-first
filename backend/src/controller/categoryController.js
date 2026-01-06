import TryCatch from "../middleware/TryCatch.js";
import { Category } from "../model/CategoryModel.js";
import { categorySchema } from "../config/zodValidation.js";
import sanitize from "mongo-sanitize";

// Create Category (Admin Only)
export const createCategory = TryCatch(async (req, res) => {
    const sanitizedBody = sanitize(req.body);
    const validation = categorySchema.safeParse(sanitizedBody);

    if (!validation.success) {
        const errors = validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        }));
        return res.status(400).json({
            message: errors[0]?.message || "Validation Error",
            errors,
        });
    }

    const { name, description, icon, isActive } = validation.data;

    // Check if category already exists
    const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") }
    });

    if (existingCategory) {
        return res.status(400).json({
            message: "Category with this name already exists",
        });
    }

    const category = await Category.create({
        name,
        description: description || "",
        icon: icon || "",
        isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
        message: "Category created successfully",
        category,
    });
});

// Get All Categories (Public)
export const getAllCategories = TryCatch(async (req, res) => {
    const { activeOnly = "true" } = req.query;

    const query = {};
    if (activeOnly === "true") {
        query.isActive = true;
    }

    const categories = await Category.find(query).sort({ name: 1 });

    res.status(200).json({
        message: "Categories fetched successfully",
        categories,
    });
});

// Get Single Category
export const getCategoryBySlug = TryCatch(async (req, res) => {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });

    if (!category) {
        return res.status(404).json({
            message: "Category not found",
        });
    }

    res.status(200).json({
        message: "Category fetched successfully",
        category,
    });
});

// Update Category (Admin Only)
export const updateCategory = TryCatch(async (req, res) => {
    const { id } = req.params;
    const sanitizedBody = sanitize(req.body);

    const category = await Category.findById(id);

    if (!category) {
        return res.status(404).json({
            message: "Category not found",
        });
    }

    const { name, description, icon, isActive } = sanitizedBody;

    // Check for duplicate name
    if (name && name !== category.name) {
        const existingCategory = await Category.findOne({
            name: { $regex: new RegExp(`^${name}$`, "i") },
            _id: { $ne: id },
        });

        if (existingCategory) {
            return res.status(400).json({
                message: "Category with this name already exists",
            });
        }
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.status(200).json({
        message: "Category updated successfully",
        category,
    });
});

// Delete Category (Admin Only)
export const deleteCategory = TryCatch(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
        return res.status(404).json({
            message: "Category not found",
        });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
        message: "Category deleted successfully",
    });
});

// Seed Default Categories
export const seedCategories = TryCatch(async (req, res) => {
    const defaultCategories = [
        { name: "House", description: "Independent houses and villas" },
        { name: "Flat", description: "Apartments and flats" },
        { name: "Plot", description: "Land and plots" },
        { name: "Commercial", description: "Office spaces and shops" },
        { name: "Villa", description: "Luxury villas and bungalows" },
        { name: "Farmhouse", description: "Farm lands and farmhouses" },
    ];

    const existingCategories = await Category.find();
    if (existingCategories.length > 0) {
        return res.status(400).json({
            message: "Categories already exist",
            categories: existingCategories,
        });
    }

    const categories = await Category.insertMany(defaultCategories);

    res.status(201).json({
        message: "Default categories seeded successfully",
        categories,
    });
});
