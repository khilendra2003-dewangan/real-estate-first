import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    // Basic Information
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    propertyType: {
        type: String,
        enum: ["sale", "rent"],
        required: true,
    },

    // Category Reference
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },

    // Location Details
    location: {
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        coordinates: {
            lat: Number,
            lng: Number,
        },
    },

    // Property Details
    bedrooms: {
        type: Number,
        default: 0,
    },
    bathrooms: {
        type: Number,
        default: 0,
    },
    area: {
        type: Number, // in sq ft
        required: true,
    },

    // Amenities
    amenities: {
        parking: { type: Boolean, default: false },
        lift: { type: Boolean, default: false },
        security: { type: Boolean, default: false },
        garden: { type: Boolean, default: false },
        gym: { type: Boolean, default: false },
        swimmingPool: { type: Boolean, default: false },
        powerBackup: { type: Boolean, default: false },
        waterSupply: { type: Boolean, default: false },
        clubhouse: { type: Boolean, default: false },
        playground: { type: Boolean, default: false },
    },

    // Additional Features
    furnishing: {
        type: String,
        enum: ["unfurnished", "semi-furnished", "fully-furnished"],
        default: "unfurnished",
    },
    facing: {
        type: String,
        enum: ["north", "south", "east", "west", "north-east", "north-west", "south-east", "south-west"],
    },
    floorNumber: {
        type: Number,
    },
    totalFloors: {
        type: Number,
    },
    ageOfProperty: {
        type: Number, // in years
    },

    // Image Gallery
    images: [{
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
    }],

    // Agent/Owner Reference
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    // Status
    status: {
        type: String,
        enum: ["available", "sold", "rented", "pending"],
        default: "available",
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    rejectionReason: {
        type: String,
        default: "",
    },
    approvedAt: {
        type: Date,
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    // Analytics
    views: {
        type: Number,
        default: 0,
    },

    // Featured Property
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Indexes for faster queries
propertySchema.index({ "location.city": 1 });
propertySchema.index({ "location.state": 1 });
propertySchema.index({ category: 1 });
propertySchema.index({ agent: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ status: 1, isApproved: 1, isActive: 1 });
propertySchema.index({ propertyType: 1 });

// Text index for search
propertySchema.index({ title: "text", description: "text", "location.city": "text" });

export const Property = mongoose.model("Property", propertySchema);
