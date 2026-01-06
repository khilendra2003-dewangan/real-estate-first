import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiMaximize, FiHeart, FiCalendar, FiShare2, FiEye, FiArrowUpRight } from 'react-icons/fi';
import { IoBedOutline, IoWaterOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { wishlistAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const PropertyCard = ({ property, onWishlistChange }) => {
    const { isAuthenticated } = useAuth();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const formatPrice = (price) => {
        if (price >= 10000000) {
            return `${(price / 10000000).toFixed(2)} Cr`;
        } else if (price >= 100000) {
            return `${(price / 100000).toFixed(2)} Lac`;
        }
        return price.toLocaleString('en-IN');
    };

    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.info('Please login to add to wishlist');
            return;
        }

        setLoading(true);
        try {
            if (isWishlisted) {
                await wishlistAPI.remove(property._id);
                setIsWishlisted(false);
                toast.success('Removed from wishlist');
            } else {
                await wishlistAPI.add(property._id);
                setIsWishlisted(true);
                toast.success('Added to wishlist');
            }
            onWishlistChange?.();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/property/${property._id}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: property.title,
                    text: `Check out this property: ${property.title}`,
                    url: url,
                });
            } catch (error) {/* User cancelled */ }
        } else {
            navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        }
    };

    const images = property.images?.length > 0 ? property.images : [{ url: 'https://via.placeholder.com/400x300?text=No+Image' }];

    return (
        <Link to={`/property/${property._id}`} className="block h-full group">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative h-full bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/5 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/10 hover:border-amber-500/30 flex flex-col"
            >
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                    <img
                        src={images[currentImageIndex]?.url}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Status Badges */}
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border ${property.propertyType === 'sale'
                                ? 'bg-amber-500/20 text-amber-200 border-amber-500/20'
                                : 'bg-white/20 text-white border-white/20'
                            }`}>
                            {property.propertyType === 'sale' ? 'For Sale' : 'For Rent'}
                        </span>
                        {property.status === 'available' && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 backdrop-blur-md">
                                Available
                            </span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300 z-10">
                        <button
                            onClick={handleWishlist}
                            disabled={loading}
                            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg transition-colors ${isWishlisted ? 'bg-red-500 text-white border-red-500' : 'bg-black/30 text-white hover:bg-white hover:text-black'
                                }`}
                        >
                            <FiHeart className={isWishlisted ? 'fill-current' : ''} />
                        </button>
                        <button
                            onClick={handleShare}
                            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors shadow-lg"
                        >
                            <FiShare2 />
                        </button>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-4 left-4">
                        <div className="bg-black/40 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/10 flex items-baseline gap-1">
                            <span className="text-2xl font-serif font-bold text-white">
                                ₹{formatPrice(property.price)}
                            </span>
                            {property.propertyType === 'rent' && <span className="text-xs text-gray-300 uppercase">/mo</span>}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow border-t border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-serif font-bold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
                            {property.title}
                        </h3>
                        <FiArrowUpRight className="text-2xl text-gray-500 group-hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300" />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-light">
                        <FiMapPin className="text-amber-500" />
                        <span className="line-clamp-1">{property.location?.address}, {property.location?.city}</span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-6 text-gray-300">
                        <div className="flex flex-col items-center p-2 rounded-lg bg-white/5 border border-white/5">
                            <IoBedOutline className="text-lg mb-1 text-amber-500/80" />
                            <span className="font-bold text-white">{property.bedrooms}</span>
                            <span className="text-[10px] uppercase tracking-wider opacity-60">Beds</span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-white/5 border border-white/5">
                            <IoWaterOutline className="text-lg mb-1 text-amber-500/80" />
                            <span className="font-bold text-white">{property.bathrooms}</span>
                            <span className="text-[10px] uppercase tracking-wider opacity-60">Baths</span>
                        </div>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-white/5 border border-white/5">
                            <FiMaximize className="text-lg mb-1 text-amber-500/80" />
                            <span className="font-bold text-white">{property.area}</span>
                            <span className="text-[10px] uppercase tracking-wider opacity-60">Sqft</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                            <FiCalendar />
                            {format(new Date(property.createdAt), 'MMM dd, yyyy')}
                        </div>
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest group-hover:underline decoration-amber-500/30 underline-offset-4">
                            View Details
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default PropertyCard;
