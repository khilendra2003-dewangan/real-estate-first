import TryCatch from "../middleware/TryCatch.js";
import { Property } from "../model/PropertyModel.js";
import { Category } from "../model/CategoryModel.js";
import { Inquiry } from "../model/InquiryModel.js";
import { Visit } from "../model/VisitModel.js";
import cloudinary from "../config/cloudinary.js";
import { propertySchema, propertyUpdateSchema } from "../config/zodValidation.js";
import sanitize from "mongo-sanitize";

// Create Property (Agent Only)
export const createProperty = TryCatch(async (req, res) => {
    const sanitizedBody = sanitize(req.body);

    // Parse nested objects from form data
    let parsedBody = { ...sanitizedBody };
    if (typeof sanitizedBody.location === "string") {
        parsedBody.location = JSON.parse(sanitizedBody.location);
    }
    if (typeof sanitizedBody.amenities === "string") {
        parsedBody.amenities = JSON.parse(sanitizedBody.amenities);
    }
    if (sanitizedBody.price) {
        parsedBody.price = Number(sanitizedBody.price);
    }
    if (sanitizedBody.bedrooms) {
        parsedBody.bedrooms = Number(sanitizedBody.bedrooms);
    }
    if (sanitizedBody.bathrooms) {
        parsedBody.bathrooms = Number(sanitizedBody.bathrooms);
    }
    if (sanitizedBody.area) {
        parsedBody.area = Number(sanitizedBody.area);
    }

    const validation = propertySchema.safeParse(parsedBody);

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

    // Check if agent is approved
    if (!req.user.isApproved) {
        return res.status(403).json({
            message: "Your agent account is not approved yet",
        });
    }

    // Verify category exists
    const category = await Category.findById(validation.data.category);
    if (!category) {
        return res.status(400).json({
            message: "Invalid category",
        });
    }

    // Process uploaded images
    const images = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            images.push({
                url: file.path,
                publicId: file.filename,
            });
        }
    }

    if (images.length === 0) {
        return res.status(400).json({
            message: "At least one property image is required",
        });
    }

    const property = await Property.create({
        ...validation.data,
        images,
        agent: req.user._id,
        isApproved: false, // Requires admin approval
    });

    res.status(201).json({
        message: "Property created successfully. Awaiting admin approval.",
        property,
    });
});

// Update Property (Agent Only - own properties)
export const updateProperty = TryCatch(async (req, res) => {
    const { id } = req.params;
    const sanitizedBody = sanitize(req.body);

    const property = await Property.findById(id);

    if (!property) {
        return res.status(404).json({
            message: "Property not found",
        });
    }

    // Check ownership
    if (property.agent.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            message: "You can only update your own properties",
        });
    }

    // Parse nested objects from form data
    let parsedBody = { ...sanitizedBody };
    if (typeof sanitizedBody.location === "string") {
        parsedBody.location = JSON.parse(sanitizedBody.location);
    }
    if (typeof sanitizedBody.amenities === "string") {
        parsedBody.amenities = JSON.parse(sanitizedBody.amenities);
    }
    if (sanitizedBody.price) {
        parsedBody.price = Number(sanitizedBody.price);
    }
    if (sanitizedBody.bedrooms) {
        parsedBody.bedrooms = Number(sanitizedBody.bedrooms);
    }
    if (sanitizedBody.bathrooms) {
        parsedBody.bathrooms = Number(sanitizedBody.bathrooms);
    }
    if (sanitizedBody.area) {
        parsedBody.area = Number(sanitizedBody.area);
    }

    const validation = propertyUpdateSchema.safeParse(parsedBody);

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

    // Handle new images
    if (req.files && req.files.length > 0) {
        // Check if we need to delete old images
        if (sanitizedBody.deleteOldImages === "true") {
            for (const img of property.images) {
                await cloudinary.uploader.destroy(img.publicId);
            }
            property.images = [];
        }

        for (const file of req.files) {
            property.images.push({
                url: file.path,
                publicId: file.filename,
            });
        }
    }

    // Handle specific image deletions
    if (sanitizedBody.deleteImages) {
        const imagesToDelete = JSON.parse(sanitizedBody.deleteImages);
        for (const publicId of imagesToDelete) {
            await cloudinary.uploader.destroy(publicId);
            property.images = property.images.filter((img) => img.publicId !== publicId);
        }
    }

    // Update fields
    Object.assign(property, validation.data);

    // Reset approval status on update
    property.isApproved = false;
    property.rejectionReason = "";

    await property.save();

    res.status(200).json({
        message: "Property updated successfully. Awaiting admin re-approval.",
        property,
    });
});

// Delete Property (Agent Only - own properties)
export const deleteProperty = TryCatch(async (req, res) => {
    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
        return res.status(404).json({
            message: "Property not found",
        });
    }

    // Check ownership (admin can also delete)
    if (property.agent.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({
            message: "You can only delete your own properties",
        });
    }

    // Delete images from Cloudinary
    for (const img of property.images) {
        await cloudinary.uploader.destroy(img.publicId);
    }

    await Property.findByIdAndDelete(id);

    // Also delete related inquiries and visits
    await Inquiry.deleteMany({ property: id });
    await Visit.deleteMany({ property: id });

    res.status(200).json({
        message: "Property deleted successfully",
    });
});

// Get Agent's Properties
export const getAgentProperties = TryCatch(async (req, res) => {
    const { page = 1, limit = 10, status, isApproved } = req.query;

    const query = { agent: req.user._id };

    if (status) {
        query.status = status;
    }

    if (isApproved !== undefined) {
        query.isApproved = isApproved === "true";
    }

    const properties = await Property.find(query)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Property.countDocuments(query);

    res.status(200).json({
        message: "Properties fetched successfully",
        properties,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalProperties: total,
        },
    });
});

// Agent Dashboard
export const getAgentDashboard = TryCatch(async (req, res) => {
    const agentId = req.user._id;

    const [
        totalProperties,
        approvedProperties,
        pendingProperties,
        availableProperties,
        soldProperties,
        rentedProperties,
        totalInquiries,
        pendingInquiries,
        totalVisits,
        pendingVisits,
        completedVisits,
    ] = await Promise.all([
        Property.countDocuments({ agent: agentId }),
        Property.countDocuments({ agent: agentId, isApproved: true }),
        Property.countDocuments({ agent: agentId, isApproved: false, rejectionReason: "" }),
        Property.countDocuments({ agent: agentId, status: "available", isApproved: true }),
        Property.countDocuments({ agent: agentId, status: "sold" }),
        Property.countDocuments({ agent: agentId, status: "rented" }),
        Inquiry.countDocuments({ agent: agentId }),
        Inquiry.countDocuments({ agent: agentId, status: "pending" }),
        Visit.countDocuments({ agent: agentId }),
        Visit.countDocuments({ agent: agentId, status: "pending" }),
        Visit.countDocuments({ agent: agentId, status: "completed" }),
    ]);

    // Total views across all properties
    const viewsResult = await Property.aggregate([
        { $match: { agent: agentId } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);
    const totalViews = viewsResult[0]?.totalViews || 0;

    // Recent inquiries
    const recentInquiries = await Inquiry.find({ agent: agentId })
        .populate("property", "title")
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .limit(5);

    // Upcoming visits
    const upcomingVisits = await Visit.find({
        agent: agentId,
        status: { $in: ["pending", "confirmed"] },
        scheduledDate: { $gte: new Date() },
    })
        .populate("property", "title")
        .populate("user", "name")
        .sort({ scheduledDate: 1 })
        .limit(5);

    res.status(200).json({
        message: "Dashboard stats fetched successfully",
        stats: {
            properties: {
                total: totalProperties,
                approved: approvedProperties,
                pending: pendingProperties,
                available: availableProperties,
                sold: soldProperties,
                rented: rentedProperties,
            },
            inquiries: {
                total: totalInquiries,
                pending: pendingInquiries,
            },
            visits: {
                total: totalVisits,
                pending: pendingVisits,
                completed: completedVisits,
            },
            totalViews,
        },
        recentInquiries,
        upcomingVisits,
    });
});

// Get Single Property (Public)
export const getPropertyById = TryCatch(async (req, res) => {
    const { id } = req.params;

    const property = await Property.findById(id)
        .populate("category", "name slug")
        .populate("agent", "name email contact agencyName profileImage experience");

    if (!property) {
        return res.status(404).json({
            message: "Property not found",
        });
    }

    // Only show approved properties to public
    if (!property.isApproved && (!req.user || (req.user._id.toString() !== property.agent._id.toString() && req.user.role !== "admin"))) {
        return res.status(404).json({
            message: "Property not found",
        });
    }

    // Increment views
    property.views += 1;
    await property.save();

    res.status(200).json({
        message: "Property fetched successfully",
        property,
    });
});

// Get All Properties (Public - only approved)
export const getAllProperties = TryCatch(async (req, res) => {
    const {
        page = 1,
        limit = 12,
        city,
        state,
        category,
        propertyType,
        minPrice,
        maxPrice,
        minArea,
        maxArea,
        bedrooms,
        bathrooms,
        status = "available",
        sort = "newest",
        search,
    } = req.query;

    const query = {
        isApproved: true,
        isActive: true,
        status,
    };

    // Location filters
    if (city) {
        query["location.city"] = { $regex: city, $options: "i" };
    }
    if (state) {
        query["location.state"] = { $regex: state, $options: "i" };
    }

    // Category filter
    if (category) {
        query.category = category;
    }

    // Property type filter
    if (propertyType) {
        query.propertyType = propertyType;
    }

    // Price range
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Area range
    if (minArea || maxArea) {
        query.area = {};
        if (minArea) query.area.$gte = Number(minArea);
        if (maxArea) query.area.$lte = Number(maxArea);
    }

    // Bedrooms filter
    if (bedrooms) {
        query.bedrooms = Number(bedrooms);
    }

    // Bathrooms filter
    if (bathrooms) {
        query.bathrooms = Number(bathrooms);
    }

    // Search
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { "location.city": { $regex: search, $options: "i" } },
        ];
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
        case "newest":
            sortOption = { createdAt: -1 };
            break;
        case "oldest":
            sortOption = { createdAt: 1 };
            break;
        case "price-low":
            sortOption = { price: 1 };
            break;
        case "price-high":
            sortOption = { price: -1 };
            break;
        case "popular":
            sortOption = { views: -1 };
            break;
        default:
            sortOption = { createdAt: -1 };
    }

    const properties = await Property.find(query)
        .populate("category", "name slug")
        .populate("agent", "name agencyName profileImage")
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Property.countDocuments(query);

    res.status(200).json({
        message: "Properties fetched successfully",
        properties,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalProperties: total,
        },
    });
});

// Get Featured Properties
export const getFeaturedProperties = TryCatch(async (req, res) => {
    const { limit = 6 } = req.query;

    const properties = await Property.find({
        isApproved: true,
        isActive: true,
        isFeatured: true,
        status: "available",
    })
        .populate("category", "name")
        .populate("agent", "name agencyName")
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

    res.status(200).json({
        message: "Featured properties fetched successfully",
        properties,
    });
});

// Get Properties by Category
export const getPropertiesByCategory = TryCatch(async (req, res) => {
    const { slug } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const category = await Category.findOne({ slug });

    if (!category) {
        return res.status(404).json({
            message: "Category not found",
        });
    }

    const query = {
        category: category._id,
        isApproved: true,
        isActive: true,
        status: "available",
    };

    const properties = await Property.find(query)
        .populate("category", "name slug")
        .populate("agent", "name agencyName")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Property.countDocuments(query);

    res.status(200).json({
        message: "Properties fetched successfully",
        category,
        properties,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalProperties: total,
        },
    });
});

// Get Properties by Agent (Public)
export const getPropertiesByAgentId = TryCatch(async (req, res) => {
    const { agentId } = req.params;
    const { page = 1, limit = 12, status } = req.query;

    const query = {
        agent: agentId,
        isApproved: true,
        isActive: true, // Only show active properties
    };

    if (status) {
        query.status = status;
    } else {
        // By default show available, but allow seeing sold items if requested or show all public statuses
        query.status = { $in: ["available", "sold", "rented"] };
    }

    const properties = await Property.find(query)
        .populate("category", "name slug")
        .sort({ createdAt: -1 }) // Newest first
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Property.countDocuments(query);

    res.status(200).json({
        message: "Agent properties fetched successfully",
        properties,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalProperties: total,
        },
    });
});
