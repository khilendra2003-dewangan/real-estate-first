import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    propertyCount: {
        type: Number,
        default: 0
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Pre-save middleware to create slug
locationSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }
    next();
});

const Location = mongoose.model('Location', locationSchema);

export default Location;
