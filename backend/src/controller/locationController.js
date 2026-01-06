import Location from '../model/LocationModel.js';
import { Property } from '../model/PropertyModel.js';

// Fallback images pool for unknown locations
const fallbackImages = [
    'https://images.unsplash.com/photo-1519501025264-658b1f89c313?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1449824913929-49aa7115669a?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1444723121867-2291933002af?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518391846015-55a3342e77b8?q=80&w=2000&auto=format&fit=crop'
];

export const locationController = {
    // Get all locations with dynamic property counts
    getAllLocations: async (req, res) => {
        try {
            // 1. Aggregate properties by city
            const locationCounts = await Property.aggregate([
                {
                    $match: {
                        status: 'available',
                        isActive: true,
                        isApproved: true
                    }
                },
                {
                    $group: {
                        _id: "$location.city",
                        count: { $sum: 1 }
                    }
                }
            ]);

            // 2. Fetch all location metadata (images)
            const locationMetadata = await Location.find();

            // 3. Merge data
            const metadataMap = locationMetadata.reduce((acc, loc) => {
                acc[loc.name.toLowerCase()] = loc;
                return acc;
            }, {});

            // Form final list based on properties found
            const finalLocations = locationCounts.map((item, index) => {
                const cityName = item._id;
                const metadata = metadataMap[cityName.toLowerCase()];

                // Deterministic fallback image selection based on city name characters
                let image = metadata?.image;
                if (!image) {
                    const charCodeSum = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    image = fallbackImages[charCodeSum % fallbackImages.length];
                }

                return {
                    _id: metadata?._id || `temp-${cityName}`,
                    name: cityName,
                    image: image,
                    propertyCount: item.count,
                    isFeatured: metadata?.isFeatured || false
                };
            });

            res.status(200).json({
                success: true,
                count: finalLocations.length,
                locations: finalLocations
            });
        } catch (error) {
            console.error('Error in getAllLocations:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching locations',
                error: error.message
            });
        }
    },

    // Get featured locations 
    getFeaturedLocations: async (req, res) => {
        try {
            const locationCounts = await Property.aggregate([
                { $match: { status: 'available', isActive: true, isApproved: true } },
                { $group: { _id: "$location.city", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 6 }
            ]);

            const locationMetadata = await Location.find();
            const metadataMap = locationMetadata.reduce((acc, loc) => {
                acc[loc.name.toLowerCase()] = loc;
                return acc;
            }, {});

            const finalLocations = locationCounts.map((item, index) => {
                const cityName = item._id;
                const metadata = metadataMap[cityName.toLowerCase()];

                // Deterministic fallback image
                let image = metadata?.image;
                if (!image) {
                    const charCodeSum = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    image = fallbackImages[charCodeSum % fallbackImages.length];
                }

                return {
                    _id: metadata?._id || `temp-${cityName}`,
                    name: cityName,
                    image: image,
                    propertyCount: item.count
                };
            });

            res.status(200).json({
                success: true,
                count: finalLocations.length,
                locations: finalLocations
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching featured locations',
                error: error.message
            });
        }
    },

    // Create a new location (Admin only)
    createLocation: async (req, res) => {
        try {
            const { name, image, propertyCount, isFeatured } = req.body;

            // Check if location already exists
            const existingLocation = await Location.findOne({ name });
            if (existingLocation) {
                return res.status(400).json({
                    success: false,
                    message: 'Location already exists'
                });
            }

            const location = await Location.create({
                name,
                image,
                propertyCount: propertyCount || 0,
                isFeatured: isFeatured || false
            });

            res.status(201).json({
                success: true,
                message: 'Location created successfully',
                location
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating location',
                error: error.message
            });
        }
    }
};
