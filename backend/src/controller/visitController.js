import TryCatch from "../middleware/TryCatch.js";
import { Visit } from "../model/VisitModel.js";
import { Property } from "../model/PropertyModel.js";
import { visitSchema, visitStatusSchema } from "../config/zodValidation.js";
import sanitize from "mongo-sanitize";

// Schedule Visit (User)
export const scheduleVisit = TryCatch(async (req, res) => {
    const sanitizedBody = sanitize(req.body);
    const validation = visitSchema.safeParse(sanitizedBody);

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

    const { propertyId, scheduledDate, scheduledTime, contactName, contactPhone, notes } = validation.data;

    // Check if property exists and is approved
    const property = await Property.findById(propertyId);
    if (!property || !property.isApproved) {
        return res.status(404).json({
            message: "Property not found",
        });
    }

    // Validate scheduled date is in the future
    const visitDate = new Date(scheduledDate);
    if (visitDate < new Date()) {
        return res.status(400).json({
            message: "Scheduled date must be in the future",
        });
    }

    // Check for existing visit (same user, same property, same date)
    const existingVisit = await Visit.findOne({
        user: req.user._id,
        property: propertyId,
        scheduledDate: visitDate,
        status: { $in: ["pending", "confirmed"] },
    });

    if (existingVisit) {
        return res.status(400).json({
            message: "You already have a visit scheduled for this property on this date",
        });
    }

    const visit = await Visit.create({
        user: req.user._id,
        property: propertyId,
        agent: property.agent,
        scheduledDate: visitDate,
        scheduledTime,
        contactName,
        contactPhone,
        notes: notes || "",
    });

    res.status(201).json({
        message: "Visit scheduled successfully. Awaiting agent confirmation.",
        visit,
    });
});

// Get User's Visits
export const getUserVisits = TryCatch(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user._id };

    if (status) {
        query.status = status;
    }

    const visits = await Visit.find(query)
        .populate("property", "title images price location")
        .populate("agent", "name email contact agencyName")
        .sort({ scheduledDate: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Visit.countDocuments(query);

    res.status(200).json({
        message: "Visits fetched successfully",
        visits,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalVisits: total,
        },
    });
});

// Get Agent's Visits (for their properties)
export const getAgentVisits = TryCatch(async (req, res) => {
    const { page = 1, limit = 10, status, upcoming } = req.query;

    const query = { agent: req.user._id };

    if (status) {
        query.status = status;
    }

    if (upcoming === "true") {
        query.scheduledDate = { $gte: new Date() };
        query.status = { $in: ["pending", "confirmed"] };
    }

    const visits = await Visit.find(query)
        .populate("property", "title images price location")
        .populate("user", "name email contact")
        .sort({ scheduledDate: 1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Visit.countDocuments(query);

    res.status(200).json({
        message: "Visits fetched successfully",
        visits,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalVisits: total,
        },
    });
});

// Update Visit Status (Agent)
export const updateVisitStatus = TryCatch(async (req, res) => {
    const { id } = req.params;
    const sanitizedBody = sanitize(req.body);
    const validation = visitStatusSchema.safeParse(sanitizedBody);

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

    const { status, agentRemarks, cancellationReason } = validation.data;

    const visit = await Visit.findById(id);

    if (!visit) {
        return res.status(404).json({
            message: "Visit not found",
        });
    }

    // Check if agent owns the property
    if (visit.agent.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            message: "You can only update visits for your properties",
        });
    }

    visit.status = status;
    visit.statusUpdatedAt = new Date();
    visit.statusUpdatedBy = req.user._id;

    if (agentRemarks) {
        visit.agentRemarks = agentRemarks;
    }

    if (status === "cancelled" && cancellationReason) {
        visit.cancellationReason = cancellationReason;
    }

    await visit.save();

    res.status(200).json({
        message: "Visit status updated successfully",
        visit,
    });
});

// Cancel Visit (User - can cancel their own visits)
export const cancelVisit = TryCatch(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    const visit = await Visit.findById(id);

    if (!visit) {
        return res.status(404).json({
            message: "Visit not found",
        });
    }

    // Check if user owns the visit
    if (visit.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            message: "You can only cancel your own visits",
        });
    }

    // Can only cancel pending or confirmed visits
    if (!["pending", "confirmed"].includes(visit.status)) {
        return res.status(400).json({
            message: "Cannot cancel a visit that is already completed or cancelled",
        });
    }

    visit.status = "cancelled";
    visit.cancellationReason = reason || "Cancelled by user";
    visit.statusUpdatedAt = new Date();
    visit.statusUpdatedBy = req.user._id;
    await visit.save();

    res.status(200).json({
        message: "Visit cancelled",
        visit,
    });
});

// Get Single Visit
export const getVisitById = TryCatch(async (req, res) => {
    const { id } = req.params;

    const visit = await Visit.findById(id)
        .populate("property", "title images price location")
        .populate("user", "name email contact")
        .populate("agent", "name email contact agencyName");

    if (!visit) {
        return res.status(404).json({
            message: "Visit not found",
        });
    }

    // Check authorization
    if (
        visit.user._id.toString() !== req.user._id.toString() &&
        visit.agent._id.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
    ) {
        return res.status(403).json({
            message: "You are not authorized to view this visit",
        });
    }

    res.status(200).json({
        message: "Visit fetched successfully",
        visit,
    });
});

// Reschedule Visit (User)
export const rescheduleVisit = TryCatch(async (req, res) => {
    const { id } = req.params;
    const { scheduledDate, scheduledTime } = req.body;

    if (!scheduledDate || !scheduledTime) {
        return res.status(400).json({
            message: "New date and time are required",
        });
    }

    const visit = await Visit.findById(id);

    if (!visit) {
        return res.status(404).json({
            message: "Visit not found",
        });
    }

    // Check if user owns the visit
    if (visit.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            message: "You can only reschedule your own visits",
        });
    }

    // Can only reschedule pending or confirmed visits
    if (!["pending", "confirmed"].includes(visit.status)) {
        return res.status(400).json({
            message: "Cannot reschedule a completed or cancelled visit",
        });
    }

    // Validate new date is in the future
    const newDate = new Date(scheduledDate);
    if (newDate < new Date()) {
        return res.status(400).json({
            message: "New scheduled date must be in the future",
        });
    }

    visit.scheduledDate = newDate;
    visit.scheduledTime = scheduledTime;
    visit.status = "rescheduled";
    visit.statusUpdatedAt = new Date();
    visit.statusUpdatedBy = req.user._id;
    await visit.save();

    res.status(200).json({
        message: "Visit rescheduled successfully",
        visit,
    });
});
