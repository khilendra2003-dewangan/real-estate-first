import TryCatch from "../middleware/TryCatch.js";
import { User } from "../model/UserModel.js";
import { Property } from "../model/PropertyModel.js";
import { Inquiry } from "../model/InquiryModel.js";
import { Visit } from "../model/VisitModel.js";
import sendmail from "../config/sendmail.js";
import {
    getAgentApprovalHtml,
    getAgentRejectionHtml,
    getPropertyApprovalHtml,
    getPropertyRejectionHtml
} from "../config/html.js";

// Get All Agents
export const getAllAgents = TryCatch(async (req, res) => {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = { role: "agent" };

    if (status === "approved") {
        query.isApproved = true;
    } else if (status === "pending") {
        query.isApproved = false;
        query.rejectionReason = "";
    } else if (status === "rejected") {
        query.isApproved = false;
        query.rejectionReason = { $ne: "" };
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { agencyName: { $regex: search, $options: "i" } },
        ];
    }

    const agents = await User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
        message: "Agents fetched successfully",
        agents,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalAgents: total,
        },
    });
});

// Approve Agent
export const approveAgent = TryCatch(async (req, res) => {
    const { id } = req.params;

    const agent = await User.findById(id);

    if (!agent) {
        return res.status(404).json({
            message: "Agent not found",
        });
    }

    if (agent.role !== "agent") {
        return res.status(400).json({
            message: "User is not an agent",
        });
    }

    if (agent.isApproved) {
        return res.status(400).json({
            message: "Agent is already approved",
        });
    }

    agent.isApproved = true;
    agent.rejectionReason = "";
    agent.approvedAt = new Date();
    agent.approvedBy = req.user._id;
    await agent.save();

    // Send approval email
    const subject = "Your Agent Account Has Been Approved!";
    const html = getAgentApprovalHtml({ name: agent.name, email: agent.email });
    await sendmail({ email: agent.email, subject, html });

    res.status(200).json({
        message: "Agent approved successfully",
        agent: {
            _id: agent._id,
            name: agent.name,
            email: agent.email,
            isApproved: agent.isApproved,
            approvedAt: agent.approvedAt,
        },
    });
});

// Reject Agent
export const rejectAgent = TryCatch(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    const agent = await User.findById(id);

    if (!agent) {
        return res.status(404).json({
            message: "Agent not found",
        });
    }

    if (agent.role !== "agent") {
        return res.status(400).json({
            message: "User is not an agent",
        });
    }

    agent.isApproved = false;
    agent.rejectionReason = reason || "Your application does not meet our requirements.";
    await agent.save();

    // Send rejection email
    const subject = "Update on Your Agent Application";
    const html = getAgentRejectionHtml({ name: agent.name, reason: agent.rejectionReason });
    await sendmail({ email: agent.email, subject, html });

    res.status(200).json({
        message: "Agent rejected",
        agent: {
            _id: agent._id,
            name: agent.name,
            email: agent.email,
            isApproved: agent.isApproved,
            rejectionReason: agent.rejectionReason,
        },
    });
});

// Get All Pending Properties
export const getPendingProperties = TryCatch(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const query = { isApproved: false, rejectionReason: "" };

    const properties = await Property.find(query)
        .populate("agent", "name email agencyName")
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Property.countDocuments(query);

    res.status(200).json({
        message: "Pending properties fetched successfully",
        properties,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalProperties: total,
        },
    });
});

// Approve Property
export const approveProperty = TryCatch(async (req, res) => {
    const { id } = req.params;

    const property = await Property.findById(id).populate("agent", "name email");

    if (!property) {
        return res.status(404).json({
            message: "Property not found",
        });
    }

    if (property.isApproved) {
        return res.status(400).json({
            message: "Property is already approved",
        });
    }

    property.isApproved = true;
    property.rejectionReason = "";
    property.approvedAt = new Date();
    property.approvedBy = req.user._id;
    await property.save();

    // Send approval email to agent
    const subject = "Your Property Listing Has Been Approved!";
    const html = getPropertyApprovalHtml({
        agentName: property.agent.name,
        propertyTitle: property.title
    });
    await sendmail({ email: property.agent.email, subject, html });

    res.status(200).json({
        message: "Property approved successfully",
        property,
    });
});

// Reject Property
export const rejectProperty = TryCatch(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    const property = await Property.findById(id).populate("agent", "name email");

    if (!property) {
        return res.status(404).json({
            message: "Property not found",
        });
    }

    property.isApproved = false;
    property.rejectionReason = reason || "Your listing does not meet our guidelines.";
    await property.save();

    // Send rejection email to agent
    const subject = "Update on Your Property Listing";
    const html = getPropertyRejectionHtml({
        agentName: property.agent.name,
        propertyTitle: property.title,
        reason: property.rejectionReason
    });
    await sendmail({ email: property.agent.email, subject, html });

    res.status(200).json({
        message: "Property rejected",
        property,
    });
});

// Get All Properties (Admin)
export const getAllPropertiesAdmin = TryCatch(async (req, res) => {
    const { page = 1, limit = 10, status, isApproved, search } = req.query;

    const query = {};

    if (status) {
        query.status = status;
    }

    if (isApproved !== undefined) {
        query.isApproved = isApproved === "true";
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { "location.city": { $regex: search, $options: "i" } },
        ];
    }

    const properties = await Property.find(query)
        .populate("agent", "name email agencyName")
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

// Admin Dashboard Stats
export const getAdminDashboard = TryCatch(async (req, res) => {
    const [
        totalUsers,
        totalAgents,
        pendingAgents,
        approvedAgents,
        totalProperties,
        pendingProperties,
        approvedProperties,
        totalInquiries,
        pendingInquiries,
        totalVisits,
        pendingVisits,
    ] = await Promise.all([
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "agent" }),
        User.countDocuments({ role: "agent", isApproved: false, rejectionReason: "" }),
        User.countDocuments({ role: "agent", isApproved: true }),
        Property.countDocuments(),
        Property.countDocuments({ isApproved: false, rejectionReason: "" }),
        Property.countDocuments({ isApproved: true }),
        Inquiry.countDocuments(),
        Inquiry.countDocuments({ status: "pending" }),
        Visit.countDocuments(),
        Visit.countDocuments({ status: "pending" }),
    ]);

    // Recent agents awaiting approval
    const recentPendingAgents = await User.find({
        role: "agent",
        isApproved: false,
        rejectionReason: ""
    })
        .select("name email agencyName createdAt")
        .sort({ createdAt: -1 })
        .limit(5);

    // Recent properties awaiting approval
    const recentPendingProperties = await Property.find({
        isApproved: false,
        rejectionReason: ""
    })
        .populate("agent", "name")
        .select("title price location createdAt")
        .sort({ createdAt: -1 })
        .limit(5);

    res.status(200).json({
        message: "Dashboard stats fetched successfully",
        stats: {
            users: {
                total: totalUsers,
            },
            agents: {
                total: totalAgents,
                pending: pendingAgents,
                approved: approvedAgents,
            },
            properties: {
                total: totalProperties,
                pending: pendingProperties,
                approved: approvedProperties,
            },
            inquiries: {
                total: totalInquiries,
                pending: pendingInquiries,
            },
            visits: {
                total: totalVisits,
                pending: pendingVisits,
            },
        },
        recentPendingAgents,
        recentPendingProperties,
    });
});
