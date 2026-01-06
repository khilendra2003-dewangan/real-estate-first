import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMapPin, FiHeart, FiArrowRight, FiHome } from 'react-icons/fi';
import { IoBedOutline, IoWaterOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { wishlistAPI } from '../../api/api';

const HERO_BG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const { data } = await wishlistAPI.get();
            setWishlist(data.wishlist?.properties || []);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (e, propertyId) => {
        e.preventDefault(); // Prevent navigation
        try {
            await wishlistAPI.remove(propertyId);
            setWishlist(wishlist.filter((p) => p._id !== propertyId));
            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error('Failed to remove');
        }
    };

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
        return `₹${price?.toLocaleString('en-IN')}`;
    };

    return (
        <div className="min-h-screen bg-dark-950 text-white selection:bg-rose-500/30">
            {/* Parallax Hero */}
            <div ref={heroRef} className="relative h-[400px] overflow-hidden">
                <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
                    <img src={HERO_BG} alt="Wishlist Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-950/40 via-dark-950/60 to-dark-950"></div>
                </motion.div>

                <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold mb-6 backdrop-blur-sm">
                            <FiHeart className="fill-current" /> My Saved Collection
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-2xl">
                            Your Dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Homes</span>
                        </h1>
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                            Curated by you. A collection of properties that caught your eye and captured your imagination.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-24">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
                    </div>
                ) : wishlist.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center shadow-2xl"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-24 h-24 bg-gradient-to-tr from-rose-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-rose-500/30"
                        >
                            <FiHeart className="text-4xl text-white fill-white" />
                        </motion.div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-4">Your wishlist is currently empty</h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">Start exploring our exclusive listings to find properties that inspire you.</p>
                        <Link
                            to="/properties"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-dark-900 rounded-full font-bold hover:bg-gray-200 transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-white/10"
                        >
                            <FiHome /> Browse Properties <FiArrowRight />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {wishlist.map((property, index) => (
                                <motion.div
                                    key={property._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative bg-dark-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 hover:border-rose-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-900/20"
                                >
                                    <Link to={`/property/${property._id}`} className="block h-full">
                                        <div className="relative h-64 overflow-hidden">
                                            <div className="absolute inset-0 bg-gray-900 animate-pulse" />
                                            <img
                                                src={property.images?.[0]?.url || 'https://via.placeholder.com/400x300'}
                                                alt={property.title}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80" />

                                            <div className="absolute top-4 right-4 z-10">
                                                <button
                                                    onClick={(e) => handleRemove(e, property._id)}
                                                    className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110 hover:rotate-12"
                                                    title="Remove from Wishlist"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>

                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="text-2xl font-bold text-white mb-1 tracking-tight drop-shadow-lg">
                                                    {formatPrice(property.price)}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                                                    <FiMapPin className="text-rose-400" />
                                                    {property.location?.city}, {property.location?.state}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-white mb-3 line-clamp-1 group-hover:text-rose-400 transition-colors">
                                                {property.title}
                                            </h3>

                                            <div className="flex items-center gap-6 text-gray-400 mb-6 border-b border-white/5 pb-4">
                                                <div className="flex items-center gap-2">
                                                    <IoBedOutline className="text-xl text-rose-400/80" />
                                                    <span className="font-medium text-gray-300">{property.bedrooms}</span> Beds
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <IoWaterOutline className="text-xl text-rose-400/80" />
                                                    <span className="font-medium text-gray-300">{property.bathrooms}</span> Baths
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    Added {new Date().toLocaleDateString()}
                                                </span>
                                                <span className="text-sm font-semibold text-rose-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                                    View Details <FiArrowRight />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
