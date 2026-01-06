import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMapPin, FiMaximize, FiHeart, FiShare2, FiPhone, FiMail, FiCalendar, FiCheck, FiChevronLeft, FiChevronRight, FiArrowLeft, FiUser, FiMessageSquare, FiClock, FiFileText, FiArrowRight, FiHome } from 'react-icons/fi';
import { IoBedOutline, IoWaterOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { propertyAPI, inquiryAPI, visitAPI, wishlistAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const PropertyDetails = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [showVisitForm, setShowVisitForm] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    const { scrollY } = useScroll();

    const y = useTransform(scrollY, [0, 500], ["0%", "50%"]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const [inquiryForm, setInquiryForm] = useState({
        message: '',
        contactName: user?.name || '',
        contactEmail: user?.email || '',
        contactPhone: user?.contact || '',
    });

    const [visitForm, setVisitForm] = useState({
        scheduledDate: '',
        scheduledTime: '',
        contactName: user?.name || '',
        contactPhone: user?.contact || '',
        notes: '',
    });

    useEffect(() => {
        fetchProperty();
        if (isAuthenticated) checkWishlist();
    }, [id, isAuthenticated]);

    const fetchProperty = async () => {
        try {
            const { data } = await propertyAPI.getById(id);
            setProperty(data.property);
        } catch (error) {
            toast.error('Failed to load property');
        } finally {
            setLoading(false);
        }
    };

    const checkWishlist = async () => {
        try {
            const { data } = await wishlistAPI.check(id);
            setIsWishlisted(data.isInWishlist);
        } catch (error) {
            console.error('Wishlist check error:', error);
        }
    };

    const handleWishlist = async () => {
        if (!isAuthenticated) {
            toast.info('Please login to add to wishlist');
            return;
        }

        try {
            if (isWishlisted) {
                await wishlistAPI.remove(id);
                setIsWishlisted(false);
                toast.success('Removed from wishlist');
            } else {
                await wishlistAPI.add(id);
                setIsWishlisted(true);
                toast.success('Added to wishlist');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleInquiry = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info('Please login to send inquiry');
            return;
        }

        try {
            await inquiryAPI.create({ propertyId: id, ...inquiryForm });
            toast.success('Inquiry sent successfully!');
            setShowInquiryForm(false);
            setInquiryForm({ ...inquiryForm, message: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send inquiry');
        }
    };

    const handleVisit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info('Please login to schedule visit');
            return;
        }

        try {
            await visitAPI.schedule({ propertyId: id, ...visitForm });
            toast.success('Visit scheduled! Agent will confirm soon.');
            setShowVisitForm(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to schedule visit');
        }
    };

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
        return `₹${price?.toLocaleString('en-IN')}`;
    };

    const amenityLabels = {
        parking: 'Parking',
        lift: 'Lift',
        security: '24/7 Security',
        garden: 'Garden',
        gym: 'Gym',
        swimmingPool: 'Swimming Pool',
        powerBackup: 'Power Backup',
        waterSupply: 'Water Supply',
        clubhouse: 'Clubhouse',
        playground: 'Playground',
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Property Not Found</h2>
                    <Link to="/properties" className="btn-primary">Browse Properties</Link>
                </div>
            </div>
        );
    }

    // Shared visual component for the left side of the modal
    const ModalImageSide = ({ title, subtitle }) => (
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-dark-900 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src={property.images?.[0]?.url || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"}
                    alt="Property"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-dark-950/90 via-dark-900/60 to-transparent" />
            </div>

            <div className="relative z-10">
                <div className="inline-flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                        <FiHome className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-serif font-bold text-white tracking-wide">
                        Real<span className="text-cyan-400">Nest</span>
                    </span>
                </div>
            </div>

            <div className="relative z-10 max-w-lg">
                <h1 className="text-4xl font-serif font-bold text-white mb-4 leading-tight">
                    {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{subtitle}</span>
                </h1>
                <div className="flex gap-2">
                    <div className="h-1 w-10 bg-cyan-500 rounded-full" />
                    <div className="h-1 w-2 bg-white/20 rounded-full" />
                    <div className="h-1 w-2 bg-white/20 rounded-full" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-900 pt-24 pb-12 overflow-x-hidden relative">
            {/* Ambient Background Gradient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Back Button */}
                <div className="mb-6">
                    <Link to="/properties">
                        <motion.button
                            whileHover={{ scale: 1.05, x: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-dark-800/80 backdrop-blur-md px-4 py-2 rounded-xl text-white hover:bg-dark-700 transition-colors border border-white/10 flex items-center gap-2"
                        >
                            <FiArrowLeft size={20} />
                            <span>Back to Listings</span>
                        </motion.button>
                    </Link>
                </div>

                {/* Hero Image Card */}
                <div className="relative h-[500px] rounded-3xl overflow-hidden mb-8 shadow-2xl border border-white/10 group">
                    <motion.div
                        style={{ y, scale: 1.1 }}
                        className="absolute inset-0"
                    >
                        <img
                            src={property.images?.[activeImage]?.url || 'https://via.placeholder.com/1200x600?text=Property'}
                            alt={property.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
                    </motion.div>

                    {/* Image Navigation Dots */}
                    {property.images?.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                            {property.images.map((_, idx) => (
                                <motion.button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    whileHover={{ scale: 1.2 }}
                                    className={`h-2 rounded-full transition-all backdrop-blur-sm ${idx === activeImage ? 'bg-white w-8' : 'bg-white/40 w-2'}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Chevron Navigation */}
                    {property.images?.length > 1 && (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : property.images.length - 1))}
                                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/40 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <FiChevronLeft className="text-xl" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setActiveImage((prev) => (prev < property.images.length - 1 ? prev + 1 : 0))}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/40 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <FiChevronRight className="text-xl" />
                            </motion.button>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title & Price Card */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-dark-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                                <div>
                                    <div className="flex gap-2 mb-4">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase ${property.propertyType === 'sale'
                                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                            }`}>
                                            For {property.propertyType === 'sale' ? 'Sale' : 'Rent'}
                                        </span>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase ${property.status === 'available' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                            }`}>
                                            {property.status}
                                        </span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-2 leading-tight">{property.title}</h1>
                                    <div className="flex items-center gap-2 text-dark-300">
                                        <FiMapPin className="text-primary-400" />
                                        <span className="font-light tracking-wide">{property.location?.address}, {property.location?.city}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-serif text-white">
                                        {formatPrice(property.price)}
                                    </div>
                                    {property.propertyType === 'rent' && <div className="text-dark-400 font-light">/month</div>}
                                </div>
                            </div>

                            <hr className="border-white/10 my-6" />

                            <div className="flex justify-between items-center flex-wrap gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center">
                                        <IoBedOutline className="text-3xl text-primary-400 mb-1" />
                                        <span className="text-white font-medium">{property.bedrooms} Bed</span>
                                    </div>
                                    <div className="w-px h-10 bg-white/10 mx-2" />
                                    <div className="flex flex-col items-center">
                                        <IoWaterOutline className="text-3xl text-primary-400 mb-1" />
                                        <span className="text-white font-medium">{property.bathrooms} Bath</span>
                                    </div>
                                    <div className="w-px h-10 bg-white/10 mx-2" />
                                    <div className="flex flex-col items-center">
                                        <FiMaximize className="text-3xl text-primary-400 mb-1" />
                                        <span className="text-white font-medium">{property.area} sqft</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleWishlist}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border border-white/10 ${isWishlisted ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-white/5 text-white hover:bg-white/10'}`}
                                    >
                                        <FiHeart className={isWishlisted ? 'fill-current' : ''} size={20} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-12 h-12 rounded-full flex items-center justify-center transition-all border border-white/10 bg-white/5 text-white hover:bg-white/10"
                                    >
                                        <FiShare2 size={20} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="bg-dark-800/40 backdrop-blur-lg border border-white/5 rounded-3xl p-8"
                        >
                            <h2 className="text-2xl font-serif text-white mb-6">Description</h2>
                            <p className="text-dark-200 leading-8 text-lg font-light tracking-wide">{property.description}</p>
                        </motion.div>

                        {/* Amenities */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="bg-dark-800/40 backdrop-blur-lg border border-white/5 rounded-3xl p-8"
                        >
                            <h2 className="text-2xl font-serif text-white mb-6">Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {Object.entries(property.amenities || {}).map(([key, value]) => (
                                    value && (
                                        <motion.div
                                            key={key}
                                            whileHover={{ x: 5 }}
                                            className="flex items-center gap-3 text-dark-200"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400">
                                                <FiCheck size={14} />
                                            </div>
                                            <span className="font-light">{amenityLabels[key] || key}</span>
                                        </motion.div>
                                    )
                                ))}
                            </div>
                        </motion.div>

                        {/* Details Grid */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="bg-dark-800/40 backdrop-blur-lg border border-white/5 rounded-3xl p-8"
                        >
                            <h2 className="text-2xl font-serif text-white mb-6">Property Details</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-dark-400 text-xs uppercase tracking-wider mb-1">Furnishing</div>
                                    <div className="text-white font-medium capitalize text-lg">{property.furnishing || 'N/A'}</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-dark-400 text-xs uppercase tracking-wider mb-1">Facing</div>
                                    <div className="text-white font-medium capitalize text-lg">{property.facing || 'N/A'}</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-dark-400 text-xs uppercase tracking-wider mb-1">Floor</div>
                                    <div className="text-white font-medium text-lg">{property.floorNumber || 'N/A'} of {property.totalFloors || 'N/A'}</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-dark-400 text-xs uppercase tracking-wider mb-1">Property Age</div>
                                    <div className="text-white font-medium text-lg">{property.ageOfProperty ? `${property.ageOfProperty} years` : 'N/A'}</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Agent Card */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-dark-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sticky top-24"
                        >
                            <h3 className="text-xl font-serif text-white mb-6">Listed By</h3>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-lg shadow-primary-500/20 flex items-center justify-center text-white text-2xl font-serif font-bold">
                                    {property.agent?.name?.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-white font-semibold text-lg">{property.agent?.name}</div>
                                    <div className="text-primary-400 text-sm">{property.agent?.agencyName || 'Independent Agent'}</div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <a href={`tel:${property.agent?.contact}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-dark-200 hover:text-white group">
                                    <div className="w-8 h-8 rounded-full bg-dark-900 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
                                        <FiPhone size={14} />
                                    </div>
                                    <span className="font-light">{property.agent?.contact}</span>
                                </a>
                                <a href={`mailto:${property.agent?.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-dark-200 hover:text-white group">
                                    <div className="w-8 h-8 rounded-full bg-dark-900 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
                                        <FiMail size={14} />
                                    </div>
                                    <span className="font-light truncate">{property.agent?.email}</span>
                                </a>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowInquiryForm(true)}
                                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary-500/25 mb-3"
                            >
                                Send Inquiry
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowVisitForm(true)}
                                className="w-full bg-dark-800 text-white font-medium py-4 rounded-xl border border-dark-700 hover:bg-dark-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <FiCalendar /> Schedule Visit
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Inquiry Modal */}
            <AnimatePresence>
                {showInquiryForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-dark-900/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
                        onClick={() => setShowInquiryForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-dark-950 rounded-3xl w-full max-w-5xl overflow-hidden flex shadow-2xl border border-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Left Side (Image) */}
                            <ModalImageSide title="Interested in" subtitle="this property?" />

                            {/* Right Side (Form) */}
                            <div className="w-full lg:w-1/2 p-8 lg:p-12 relative flex flex-col justify-center">
                                {/* Close Button Mobile */}
                                <button
                                    onClick={() => setShowInquiryForm(false)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-white lg:hidden"
                                >
                                    <FiArrowLeft size={24} />
                                </button>

                                <div className="mb-8">
                                    <h3 className="text-3xl font-bold text-white mb-2">Send Inquiry</h3>
                                    <p className="text-gray-400">Fill out the form below to contact the agent.</p>
                                </div>

                                <form onSubmit={handleInquiry} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Your Name</label>
                                        <div className="relative group">
                                            <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur transition-opacity duration-300 ${focusedInput === 'inquiryName' ? 'opacity-20' : 'opacity-0'}`} />
                                            <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-center transition-colors group-hover:border-white/20">
                                                <div className="pl-4 text-gray-500"><FiUser size={20} /></div>
                                                <input
                                                    type="text"
                                                    value={inquiryForm.contactName}
                                                    onChange={(e) => setInquiryForm({ ...inquiryForm, contactName: e.target.value })}
                                                    onFocus={() => setFocusedInput('inquiryName')}
                                                    onBlur={() => setFocusedInput(null)}
                                                    className="w-full bg-transparent border-none text-white px-4 py-3.5 focus:ring-0 placeholder-gray-600 text-sm focus:outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Email</label>
                                        <div className="relative group">
                                            <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur transition-opacity duration-300 ${focusedInput === 'inquiryEmail' ? 'opacity-20' : 'opacity-0'}`} />
                                            <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-center transition-colors group-hover:border-white/20">
                                                <div className="pl-4 text-gray-500"><FiMail size={20} /></div>
                                                <input
                                                    type="email"
                                                    value={inquiryForm.contactEmail}
                                                    onChange={(e) => setInquiryForm({ ...inquiryForm, contactEmail: e.target.value })}
                                                    onFocus={() => setFocusedInput('inquiryEmail')}
                                                    onBlur={() => setFocusedInput(null)}
                                                    className="w-full bg-transparent border-none text-white px-4 py-3.5 focus:ring-0 placeholder-gray-600 text-sm focus:outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Phone</label>
                                        <div className="relative group">
                                            <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur transition-opacity duration-300 ${focusedInput === 'inquiryPhone' ? 'opacity-20' : 'opacity-0'}`} />
                                            <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-center transition-colors group-hover:border-white/20">
                                                <div className="pl-4 text-gray-500"><FiPhone size={20} /></div>
                                                <input
                                                    type="tel"
                                                    value={inquiryForm.contactPhone}
                                                    onChange={(e) => setInquiryForm({ ...inquiryForm, contactPhone: e.target.value })}
                                                    onFocus={() => setFocusedInput('inquiryPhone')}
                                                    onBlur={() => setFocusedInput(null)}
                                                    className="w-full bg-transparent border-none text-white px-4 py-3.5 focus:ring-0 placeholder-gray-600 text-sm focus:outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Message</label>
                                        <div className="relative group">
                                            <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur transition-opacity duration-300 ${focusedInput === 'inquiryMessage' ? 'opacity-20' : 'opacity-0'}`} />
                                            <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-start transition-colors group-hover:border-white/20">
                                                <div className="pl-4 pt-4 text-gray-500"><FiMessageSquare size={20} /></div>
                                                <textarea
                                                    value={inquiryForm.message}
                                                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                                    onFocus={() => setFocusedInput('inquiryMessage')}
                                                    onBlur={() => setFocusedInput(null)}
                                                    className="w-full bg-transparent border-none text-white px-4 py-3.5 focus:ring-0 placeholder-gray-600 text-sm focus:outline-none resize-none"
                                                    rows={3}
                                                    required
                                                    minLength={10}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-6">
                                        <button type="button" onClick={() => setShowInquiryForm(false)} className="flex-1 px-6 py-3 rounded-xl bg-dark-800 text-white font-medium hover:bg-dark-700 transition-colors">
                                            Cancel
                                        </button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="flex-1 bg-white text-dark-950 font-bold py-3 rounded-xl shadow-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            Send <FiArrowRight />
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Visit Modal */}
            <AnimatePresence>
                {showVisitForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-dark-900/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
                        onClick={() => setShowVisitForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-dark-950 rounded-3xl w-full max-w-5xl overflow-hidden flex shadow-2xl border border-white/10"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Left Side (Image) */}
                            <ModalImageSide title="Schedule a" subtitle="visit today" />

                            {/* Right Side (Form) */}
                            <div className="w-full lg:w-1/2 p-8 lg:p-12 relative flex flex-col justify-center">
                                {/* Close Button Mobile */}
                                <button
                                    onClick={() => setShowVisitForm(false)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-white lg:hidden"
                                >
                                    <FiArrowLeft size={24} />
                                </button>

                                <div className="mb-8">
                                    <h3 className="text-3xl font-bold text-white mb-2">Schedule Visit</h3>
                                    <p className="text-gray-400">Choose a date and time to view the property.</p>
                                </div>

                                <form onSubmit={handleVisit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Preferred Date</label>
                                        <div className="relative group">
                                            <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur transition-opacity duration-300 ${focusedInput === 'visitDate' ? 'opacity-20' : 'opacity-0'}`} />
                                            <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-center transition-colors group-hover:border-white/20">
                                                <div className="pl-4 text-gray-500"><FiCalendar size={20} /></div>
                                                <input
                                                    type="date"
                                                    value={visitForm.scheduledDate}
                                                    onChange={(e) => setVisitForm({ ...visitForm, scheduledDate: e.target.value })}
                                                    onFocus={() => setFocusedInput('visitDate')}
                                                    onBlur={() => setFocusedInput(null)}
                                                    className="w-full bg-transparent border-none text-white px-4 py-3.5 focus:ring-0 placeholder-gray-600 text-sm focus:outline-none [color-scheme:dark]"
                                                    min={new Date().toISOString().split('T')[0]}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Preferred Time</label>
                                        <div className="relative group">
                                            <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur transition-opacity duration-300 ${focusedInput === 'visitTime' ? 'opacity-20' : 'opacity-0'}`} />
                                            <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-center transition-colors group-hover:border-white/20">
                                                <div className="pl-4 text-gray-500"><FiClock size={20} /></div>
                                                <select
                                                    value={visitForm.scheduledTime}
                                                    onChange={(e) => setVisitForm({ ...visitForm, scheduledTime: e.target.value })}
                                                    onFocus={() => setFocusedInput('visitTime')}
                                                    onBlur={() => setFocusedInput(null)}
                                                    className="w-full bg-transparent border-none text-white px-4 py-3.5 focus:ring-0 placeholder-gray-600 text-sm focus:outline-none [&>option]:bg-dark-900"
                                                    required
                                                >
                                                    <option value="">Select time slot</option>
                                                    <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
                                                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                                                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                                                    <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
                                                    <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
                                                    <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Your Name</label>
                                        <div className="relative group">
                                            <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur transition-opacity duration-300 ${focusedInput === 'visitName' ? 'opacity-20' : 'opacity-0'}`} />
                                            <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-center transition-colors group-hover:border-white/20">
                                                <div className="pl-4 text-gray-500"><FiUser size={20} /></div>
                                                <input
                                                    type="text"
                                                    value={visitForm.contactName}
                                                    onChange={(e) => setVisitForm({ ...visitForm, contactName: e.target.value })}
                                                    onFocus={() => setFocusedInput('visitName')}
                                                    onBlur={() => setFocusedInput(null)}
                                                    className="w-full bg-transparent border-none text-white px-4 py-3.5 focus:ring-0 placeholder-gray-600 text-sm focus:outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Phone</label>
                                        <div className="relative group">
                                            <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur transition-opacity duration-300 ${focusedInput === 'visitPhone' ? 'opacity-20' : 'opacity-0'}`} />
                                            <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-center transition-colors group-hover:border-white/20">
                                                <div className="pl-4 text-gray-500"><FiPhone size={20} /></div>
                                                <input
                                                    type="tel"
                                                    value={visitForm.contactPhone}
                                                    onChange={(e) => setVisitForm({ ...visitForm, contactPhone: e.target.value })}
                                                    onFocus={() => setFocusedInput('visitPhone')}
                                                    onBlur={() => setFocusedInput(null)}
                                                    className="w-full bg-transparent border-none text-white px-4 py-3.5 focus:ring-0 placeholder-gray-600 text-sm focus:outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 ml-1">Notes (Optional)</label>
                                        <div className="relative group">
                                            <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur transition-opacity duration-300 ${focusedInput === 'visitNotes' ? 'opacity-20' : 'opacity-0'}`} />
                                            <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-start transition-colors group-hover:border-white/20">
                                                <div className="pl-4 pt-4 text-gray-500"><FiFileText size={20} /></div>
                                                <textarea
                                                    value={visitForm.notes}
                                                    onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                                                    onFocus={() => setFocusedInput('visitNotes')}
                                                    onBlur={() => setFocusedInput(null)}
                                                    className="w-full bg-transparent border-none text-white px-4 py-3.5 focus:ring-0 placeholder-gray-600 text-sm focus:outline-none resize-none"
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-6">
                                        <button type="button" onClick={() => setShowVisitForm(false)} className="flex-1 px-6 py-3 rounded-xl bg-dark-800 text-white font-medium hover:bg-dark-700 transition-colors">
                                            Cancel
                                        </button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="flex-1 bg-white text-dark-950 font-bold py-3 rounded-xl shadow-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            Schedule <FiArrowRight />
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PropertyDetails;
