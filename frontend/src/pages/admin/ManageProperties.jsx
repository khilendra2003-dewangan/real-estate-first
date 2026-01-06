import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiClock, FiSearch, FiEye, FiArrowLeft, FiMapPin, FiHome, FiDollarSign, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { adminAPI } from '../../api/api';

const HERO_BG_URL = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop';

const ManageProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [search, setSearch] = useState('');
    const [rejectModal, setRejectModal] = useState({ show: false, propertyId: null, reason: '' });

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    useEffect(() => {
        fetchProperties();
    }, [filter, search]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const params = { limit: 50 };
            if (filter !== 'all') params.isApproved = filter === 'approved' ? 'true' : 'false';
            if (search) params.search = search;

            const { data } = filter === 'pending'
                ? await adminAPI.getPendingProperties(params)
                : await adminAPI.getProperties(params);
            setProperties(data.properties || []);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await adminAPI.approveProperty(id);
            setProperties(properties.map((p) => (p._id === id ? { ...p, isApproved: true } : p)));
            toast.success('Property approved');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Approval failed');
        }
    };

    const handleReject = async () => {
        if (!rejectModal.reason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }

        try {
            await adminAPI.rejectProperty(rejectModal.propertyId, rejectModal.reason);
            setProperties(properties.filter((p) => p._id !== rejectModal.propertyId));
            toast.success('Property rejected');
            setRejectModal({ show: false, propertyId: null, reason: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Rejection failed');
        }
    };

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
        return `₹${price?.toLocaleString('en-IN')}`;
    };

    return (
        <div className="min-h-screen bg-dark-950 text-white selection:bg-cyan-500/30">
            {/* Parallax Hero */}
            <div ref={heroRef} className="relative h-[350px] overflow-hidden">
                <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
                    <img src={HERO_BG_URL} alt="Properties Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-950/60 via-dark-950/80 to-dark-950"></div>
                </motion.div>

                <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link to="/admin" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4 group font-medium">
                            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 drop-shadow-xl">
                            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Properties</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl text-lg font-light">
                            Review new listings, verify property details, and maintain catalog quality.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content Helper */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-20">
                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
                >
                    <div className="relative w-full md:w-96">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search properties by title or location..."
                            className="w-full bg-black/20 text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all placeholder:text-gray-600"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="bg-black/20 p-1 rounded-xl border border-white/10 flex items-center">
                            {['all', 'pending', 'approved'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === f
                                            ? 'bg-cyan-500/20 text-cyan-400 shadow-sm'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Properties Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                ) : properties.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 border-dashed"
                    >
                        <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiHome className="text-3xl text-cyan-500/50" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Properties Found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence>
                            {properties.map((property, index) => (
                                <motion.div
                                    key={property._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative bg-dark-900/50 hover:bg-white/5 backdrop-blur-md border border-white/5 hover:border-cyan-500/30 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/10"
                                >
                                    {/* Glass Highlight */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-hover:via-cyan-500/5 rounded-2xl transition-all duration-500 pointer-events-none" />

                                    <div className="relative flex flex-col md:flex-row gap-6">
                                        {/* Image */}
                                        <div className="w-full md:w-64 h-48 md:h-auto flex-shrink-0 relative rounded-xl overflow-hidden">
                                            <img
                                                src={property.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'}
                                                alt={property.title}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                                <span className="text-white font-bold text-lg drop-shadow-md">{formatPrice(property.price)}</span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col min-w-0 py-2">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 mb-1">
                                                        {property.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                                        <span className="flex items-center gap-1.5"><FiMapPin className="text-cyan-500" /> {property.location?.city}, {property.location?.state}</span>
                                                    </div>
                                                </div>
                                                {property.isApproved ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
                                                        <FiCheckCircle /> Approved
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 animate-pulse">
                                                        <FiClock /> Pending Review
                                                    </span>
                                                )}
                                            </div>

                                            <div className="bg-white/5 rounded-lg p-3 mb-4 backdrop-blur-sm border border-white/5">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                                                            {property.agent?.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-gray-300 font-medium">{property.agent?.name}</div>
                                                            <div className="text-gray-500 text-xs">{property.agent?.agencyName || 'Independent Agent'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-gray-500 text-xs text-right">
                                                        <div>Listed on</div>
                                                        <div className="text-gray-400">{new Date(property.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">{property.description}</p>

                                            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                                <Link
                                                    to={`/property/${property._id}`}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-white transition-colors text-sm font-medium"
                                                >
                                                    <FiEye /> View Listing
                                                </Link>

                                                <div className="flex-1"></div>

                                                {!property.isApproved && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(property._id)}
                                                            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => setRejectModal({ show: true, propertyId: property._id, reason: '' })}
                                                            className="px-5 py-2 bg-white/5 hover:bg-red-500/10 text-gray-300 hover:text-red-400 rounded-xl text-sm font-semibold transition-all border border-transparent hover:border-red-500/20"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {rejectModal.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setRejectModal({ show: false, propertyId: null, reason: '' })}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-dark-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <FiShield className="text-3xl text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white text-center mb-2">Reject Property Listing</h3>
                            <p className="text-gray-400 text-center mb-6">Are you sure you want to reject this property? This action cannot be easily undone.</p>

                            <textarea
                                value={rejectModal.reason}
                                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-red-500/50 outline-none transition-colors mb-6 resize-none"
                                rows={4}
                                placeholder="Please provide specific feedback regarding the rejection..."
                            />

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setRejectModal({ show: false, propertyId: null, reason: '' })}
                                    className="flex-1 py-3.5 rounded-xl font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="flex-1 py-3.5 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageProperties;
