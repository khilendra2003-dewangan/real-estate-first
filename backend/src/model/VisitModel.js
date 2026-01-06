import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
    // References
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    // Visit Schedule
    scheduledDate: {
        type: Date,
        required: true,
    },
    scheduledTime: {
        type: String, // e.g., "10:00 AM - 11:00 AM"
        required: true,
    },

    // Contact Information
    contactName: {
        type: String,
        required: true,
    },
    contactPhone: {
        type: String,
        required: true,
    },

    // Additional Notes
    notes: {
        type: String,
        default: "",
    },

    // Status
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled", "rescheduled"],
        default: "pending",
    },

    // Status Update Info
    statusUpdatedAt: {
        type: Date,
    },
    statusUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    // Agent Remarks (after visit)
    agentRemarks: {
        type: String,
        default: "",
    },

    // Cancellation Reason
    cancellationReason: {
        type: String,
        default: "",
    },
}, { timestamps: true });

// Indexes
visitSchema.index({ user: 1 });
visitSchema.index({ agent: 1 });
visitSchema.index({ property: 1 });
visitSchema.index({ status: 1 });
visitSchema.index({ scheduledDate: 1 });

export const Visit = mongoose.model("Visit", visitSchema);
