import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiMessageSquare, FiClock, FiCheckCircle, FiXCircle, FiArrowLeft, FiSend } from 'react-icons/fi';
import { inquiryAPI } from '../../api/api';

const HERO_BG_URL = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop';

const ParallaxHero = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={heroRef} className="relative h-[300px] overflow-hidden">
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 z-0"
            >
                <img src={HERO_BG_URL} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-dark-950/30 via-dark-950/60 to-dark-950"></div>
            </motion.div>

            <motion.div
                style={{ opacity: opacityHero }}
                className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
            >
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4 w-fit">
                    <FiArrowLeft /> Back to Dashboard
                </Link>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">My Inquiries</h1>
                <p className="text-gray-300 max-w-2xl font-light">
                    Track your conversations with agents and manage your property interests.
                </p>
            </motion.div>
        </div>
    );
};

const MyInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const { data } = await inquiryAPI.getUserInquiries({ limit: 50 });
            setInquiries(data.inquiries || []);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { icon: FiClock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Pending' },
            responded: { icon: FiCheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Responded' },
            closed: { icon: FiXCircle, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: 'Closed' },
        };
        const badge = badges[status] || badges.pending;
        return (
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badge.bg} ${badge.color} ${badge.border}`}>
                <badge.icon /> {badge.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-950 pb-12">
            <ParallaxHero />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-16">
                {inquiries.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-12 text-center"
                    >
                        <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiMessageSquare className="text-3xl text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white mb-2">No Inquiries Yet</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Start your journey by exploring our premium properties and connecting with our expert agents.
                        </p>
                        <Link to="/properties" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
                            Browse Properties
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {inquiries.map((inquiry, index) => (
                            <motion.div
                                key={inquiry._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-dark-900/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/20 transition-colors group"
                            >
                                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                                    {/* Property Image */}
                                    <Link to={`/property/${inquiry.property?._id}`} className="flex-shrink-0 relative group/image overflow-hidden rounded-xl w-full md:w-48 h-32">
                                        <img
                                            src={inquiry.property?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                            alt={inquiry.property?.title}
                                            className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover/image:bg-transparent transition-colors"></div>
                                    </Link>

                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                            <div>
                                                <Link to={`/property/${inquiry.property?._id}`} className="text-xl font-bold text-white hover:text-cyan-400 transition-colors mb-1 block">
                                                    {inquiry.property?.title}
                                                </Link>
                                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                                    To: <span className="text-white font-medium">{inquiry.agent?.name}</span>
                                                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                                    {inquiry.agent?.agencyName}
                                                </p>
                                            </div>
                                            {getStatusBadge(inquiry.status)}
                                        </div>

                                        <div className="space-y-4">
                                            {/* User Message */}
                                            <div className="flex gap-3">
                                                <div className="flex-1 bg-dark-800/50 rounded-2xl rounded-tl-none p-4 border border-white/5">
                                                    <p className="text-gray-300 text-sm">{inquiry.message}</p>
                                                    <p className="text-xs text-gray-500 mt-2 text-right">
                                                        {new Date(inquiry.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Agent Response */}
                                            {inquiry.response && (
                                                <div className="flex gap-3 justify-end">
                                                    <div className="flex-1 max-w-2xl bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-2xl rounded-tr-none p-4 border border-cyan-500/20">
                                                        <p className="text-cyan-400 text-xs font-bold mb-1">Agent Response</p>
                                                        <p className="text-gray-200 text-sm">{inquiry.response}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyInquiries;
