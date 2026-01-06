import TryCatch from "../middleware/TryCatch.js";
import { Wishlist } from "../model/WishlistModel.js";
import { Property } from "../model/PropertyModel.js";

// Add Property to Wishlist
export const addToWishlist = TryCatch(async (req, res) => {
    const { propertyId } = req.body;
    const userId = req.user._id;

    if (!propertyId) {
        return res.status(400).json({
            message: "Property ID is required",
        });
    }

    // Check if property exists and is approved
    const property = await Property.findById(propertyId);
    if (!property || !property.isApproved) {
        return res.status(404).json({
            message: "Property not found",
        });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: userId,
            properties: [propertyId],
        });
    } else {
        // Check if already in wishlist
        if (wishlist.properties.includes(propertyId)) {
            return res.status(400).json({
                message: "Property already in wishlist",
            });
        }
        wishlist.properties.push(propertyId);
        await wishlist.save();
    }

    res.status(200).json({
        message: "Property added to wishlist",
        wishlist,
    });
});

// Remove Property from Wishlist
export const removeFromWishlist = TryCatch(async (req, res) => {
    const { propertyId } = req.params;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        return res.status(404).json({
            message: "Wishlist not found",
        });
    }

    const index = wishlist.properties.indexOf(propertyId);
    if (index === -1) {
        return res.status(400).json({
            message: "Property not in wishlist",
        });
    }

    wishlist.properties.splice(index, 1);
    await wishlist.save();

    res.status(200).json({
        message: "Property removed from wishlist",
        wishlist,
    });
});

// Get User's Wishlist
export const getWishlist = TryCatch(async (req, res) => {
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ user: userId })
        .populate({
            path: "properties",
            match: { isApproved: true, isActive: true },
            populate: [
                { path: "category", select: "name" },
                { path: "agent", select: "name agencyName" },
            ],
        });

    if (!wishlist) {
        return res.status(200).json({
            message: "Wishlist is empty",
            wishlist: { properties: [] },
        });
    }

    res.status(200).json({
        message: "Wishlist fetched successfully",
        wishlist,
    });
});

// Check if Property is in Wishlist
export const checkWishlist = TryCatch(async (req, res) => {
    const { propertyId } = req.params;
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ user: userId });

    const isInWishlist = wishlist ? wishlist.properties.includes(propertyId) : false;

    res.status(200).json({
        isInWishlist,
    });
});

// Clear Wishlist
export const clearWishlist = TryCatch(async (req, res) => {
    const userId = req.user._id;

    await Wishlist.findOneAndUpdate(
        { user: userId },
        { properties: [] }
    );

    res.status(200).json({
        message: "Wishlist cleared",
    });
});
