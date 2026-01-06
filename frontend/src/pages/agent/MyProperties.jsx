import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiCheckCircle, FiClock, FiXCircle, FiHome, FiSearch, FiFilter, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { propertyAPI } from '../../api/api';

const HERO_BG_URL = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop';

const MyProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const heroRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    useEffect(() => {
        fetchProperties();
    }, [filter]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const params = { limit: 50 };
            if (filter === 'approved') params.isApproved = 'true';
            if (filter === 'pending') params.isApproved = 'false';

            const { data } = await propertyAPI.getAgentProperties(params);
            setProperties(data.properties || []);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this property?')) return;

        try {
            await propertyAPI.delete(id);
            setProperties(properties.filter((p) => p._id !== id));
            toast.success('Property deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
        return `₹${price?.toLocaleString('en-IN')}`;
    };

    const getStatusBadge = (property) => {
        if (property.rejectionReason) {
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium uppercase tracking-wide">
                    <FiXCircle /> Rejected
                </span>
            );
        }
        if (!property.isApproved) {
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium uppercase tracking-wide">
                    <FiClock /> Pending
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium uppercase tracking-wide">
                <FiCheckCircle /> Approved
            </span>
        );
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen bg-dark-950 text-white selection:bg-cyan-500/30">

            {/* Parallax Hero Header */}
            <div ref={heroRef} className="relative h-[300px] overflow-hidden">
                <motion.div
                    style={{ y: backgroundY }}
                    className="absolute inset-0 z-0"
                >
                    <img src={HERO_BG_URL} alt="Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-950/70 via-dark-950/85 to-dark-950"></div>
                </motion.div>

                <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pb-8">
                    <Link to="/agent" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors w-fit group">
                        <FiArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 shadow-lg">
                            My Properties
                        </h1>
                        <p className="text-gray-400 text-lg font-light max-w-xl">
                            Manage your portfolio, track performance, and edit your listings.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">

                {/* Controls Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-dark-900/60 backdrop-blur-xl border border-white/5 p-4 rounded-2xl shadow-xl"
                >
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="pl-10 pr-8 py-2.5 bg-dark-950/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 appearance-none min-w-[160px]"
                            >
                                <option value="all">All Properties</option>
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                        <div className="h-8 w-px bg-white/10 hidden md:block"></div>
                        <span className="text-gray-400 text-sm hidden md:block">
                            Showing <span className="text-white font-semibold">{properties.length}</span> results
                        </span>
                    </div>

                    <Link
                        to="/agent/properties/new"
                        className="btn-primary flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5"
                    >
                        <FiPlus className="text-lg" /> Add New Property
                    </Link>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 animate-pulse text-sm uppercase tracking-wider">Loading properties...</p>
                    </div>
                ) : properties.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-24 bg-dark-900/40 backdrop-blur-sm rounded-3xl border border-white/5 border-dashed"
                    >
                        <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-dark-900">
                            <FiHome className="text-4xl text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 font-serif">No properties listed yet</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">Start building your real estate portfolio by adding your first premium listing.</p>
                        <Link to="/agent/properties/new" className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white transition-all">
                            <FiPlus /> Create First Listing
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        <AnimatePresence>
                            {properties.map((property) => (
                                <motion.div
                                    key={property._id}
                                    variants={itemVariants}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="group relative bg-dark-900/60 backdrop-blur-md rounded-2xl border border-white/5 hover:border-cyan-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-dark-900/80"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Image */}
                                        <div className="md:w-64 h-48 md:h-auto relative">
                                            <img
                                                src={property.images?.[0]?.url || 'https://via.placeholder.com/300'}
                                                alt={property.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent md:hidden"></div>
                                            <div className="absolute top-3 left-3 md:hidden">
                                                {getStatusBadge(property)}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-6 flex flex-col justify-between">
                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                <div>
                                                    <div className="hidden md:block mb-2">
                                                        {getStatusBadge(property)}
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 mb-1 font-serif">
                                                        {property.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></span>
                                                        {property.location?.city}, {property.location?.state}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-white mb-1 whitespace-nowrap">
                                                        {formatPrice(property.price)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Price</div>
                                                </div>
                                            </div>

                                            {property.rejectionReason && (
                                                <div className="mb-4 px-4 py-2 bg-red-500/5 border border-red-500/10 rounded-lg text-sm text-red-400">
                                                    <span className="font-semibold">Reason for rejection:</span> {property.rejectionReason}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-6 text-sm text-gray-400">
                                                    <span className="flex items-center gap-2" title="Total Views">
                                                        <FiEye className="text-cyan-400" /> {property.views || 0} <span className="hidden sm:inline">Views</span>
                                                    </span>
                                                    <span className="flex items-center gap-2" title="Date Added">
                                                        <FiClock className="text-purple-400" /> {new Date(property.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        to={`/property/${property._id}`}
                                                        className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-cyan-400 transition-colors"
                                                        title="View Public Page"
                                                    >
                                                        <FiEye className="text-lg" />
                                                    </Link>
                                                    <Link
                                                        to={`/agent/properties/${property._id}/edit`}
                                                        className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-amber-400 transition-colors"
                                                        title="Edit Property"
                                                    >
                                                        <FiEdit2 className="text-lg" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(property._id)}
                                                        className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                                                        title="Delete Property"
                                                    >
                                                        <FiTrash2 className="text-lg" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MyProperties;
