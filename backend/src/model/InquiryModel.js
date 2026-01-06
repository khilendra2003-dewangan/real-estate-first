import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
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

    // Inquiry Details
    message: {
        type: String,
        required: true,
        trim: true,
    },

    // Contact Information (can be different from user profile)
    contactName: {
        type: String,
        required: true,
    },
    contactEmail: {
        type: String,
        required: true,
    },
    contactPhone: {
        type: String,
        required: true,
    },

    // Status
    status: {
        type: String,
        enum: ["pending", "responded", "closed"],
        default: "pending",
    },

    // Agent Response
    response: {
        type: String,
        default: "",
    },
    respondedAt: {
        type: Date,
    },
}, { timestamps: true });

// Indexes
inquirySchema.index({ user: 1 });
inquirySchema.index({ agent: 1 });
inquirySchema.index({ property: 1 });
inquirySchema.index({ status: 1 });

export const Inquiry = mongoose.model("Inquiry", inquirySchema);
