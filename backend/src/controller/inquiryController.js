import TryCatch from "../middleware/TryCatch.js";
import { Inquiry } from "../model/InquiryModel.js";
import { Property } from "../model/PropertyModel.js";
import { inquirySchema } from "../config/zodValidation.js";
import sanitize from "mongo-sanitize";

// Create Inquiry (User)
export const createInquiry = TryCatch(async (req, res) => {
    const sanitizedBody = sanitize(req.body);
    const validation = inquirySchema.safeParse(sanitizedBody);

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

    const { propertyId, message, contactName, contactEmail, contactPhone } = validation.data;

    // Check if property exists and is approved
    const property = await Property.findById(propertyId);
    if (!property || !property.isApproved) {
        return res.status(404).json({
            message: "Property not found",
        });
    }

    // Check for duplicate inquiry (same user, same property, within 24 hours)
    const existingInquiry = await Inquiry.findOne({
        user: req.user._id,
        property: propertyId,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (existingInquiry) {
        return res.status(400).json({
            message: "You have already sent an inquiry for this property. Please wait 24 hours before sending another.",
        });
    }

    const inquiry = await Inquiry.create({
        user: req.user._id,
        property: propertyId,
        agent: property.agent,
        message,
        contactName,
        contactEmail,
        contactPhone,
    });

    res.status(201).json({
        message: "Inquiry sent successfully",
        inquiry,
    });
});

// Get User's Inquiries
export const getUserInquiries = TryCatch(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user._id };

    if (status) {
        query.status = status;
    }

    const inquiries = await Inquiry.find(query)
        .populate("property", "title images price location")
        .populate("agent", "name email agencyName")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Inquiry.countDocuments(query);

    res.status(200).json({
        message: "Inquiries fetched successfully",
        inquiries,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalInquiries: total,
        },
    });
});

// Get Agent's Inquiries (for their properties)
export const getAgentInquiries = TryCatch(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;

    const query = { agent: req.user._id };

    if (status) {
        query.status = status;
    }

    const inquiries = await Inquiry.find(query)
        .populate("property", "title images price location")
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Inquiry.countDocuments(query);

    res.status(200).json({
        message: "Inquiries fetched successfully",
        inquiries,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalInquiries: total,
        },
    });
});

// Respond to Inquiry (Agent)
export const respondToInquiry = TryCatch(async (req, res) => {
    const { id } = req.params;
    const { response } = req.body;

    if (!response) {
        return res.status(400).json({
            message: "Response message is required",
        });
    }

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
        return res.status(404).json({
            message: "Inquiry not found",
        });
    }

    // Check if agent owns the property
    if (inquiry.agent.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            message: "You can only respond to inquiries for your properties",
        });
    }

    inquiry.response = response;
    inquiry.status = "responded";
    inquiry.respondedAt = new Date();
    await inquiry.save();

    res.status(200).json({
        message: "Response sent successfully",
        inquiry,
    });
});

// Close Inquiry
export const closeInquiry = TryCatch(async (req, res) => {
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
        return res.status(404).json({
            message: "Inquiry not found",
        });
    }

    // Check authorization
    if (
        inquiry.user.toString() !== req.user._id.toString() &&
        inquiry.agent.toString() !== req.user._id.toString()
    ) {
        return res.status(403).json({
            message: "You are not authorized to close this inquiry",
        });
    }

    inquiry.status = "closed";
    await inquiry.save();

    res.status(200).json({
        message: "Inquiry closed",
        inquiry,
    });
});

// Get Single Inquiry
export const getInquiryById = TryCatch(async (req, res) => {
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id)
        .populate("property", "title images price location")
        .populate("user", "name email")
        .populate("agent", "name email agencyName");

    if (!inquiry) {
        return res.status(404).json({
            message: "Inquiry not found",
        });
    }

    // Check authorization
    if (
        inquiry.user._id.toString() !== req.user._id.toString() &&
        inquiry.agent._id.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
    ) {
        return res.status(403).json({
            message: "You are not authorized to view this inquiry",
        });
    }

    res.status(200).json({
        message: "Inquiry fetched successfully",
        inquiry,
    });
});
