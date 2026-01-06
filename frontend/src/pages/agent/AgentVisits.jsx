import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiCheckCircle, FiXCircle, FiClock, FiArrowRight, FiMapPin, FiUser, FiPhone, FiInfo } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { visitAPI } from '../../api/api';

const HERO_BG_URL = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop';

const AgentVisits = () => {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const heroRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    useEffect(() => {
        fetchVisits();
    }, []);

    const fetchVisits = async () => {
        try {
            const { data } = await visitAPI.getAgentVisits({ limit: 50 });
            setVisits(data.visits || []);
        } catch (error) {
            console.error('Error fetching visits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status, remarks = '') => {
        try {
            await visitAPI.updateStatus(id, { status, agentRemarks: remarks });
            setVisits(visits.map((v) => (v._id === id ? { ...v, status } : v)));
            toast.success(`Visit ${status}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                color: 'text-amber-400',
                bg: 'bg-amber-500/10',
                border: 'border-amber-500/20',
                label: 'Pending Request',
                icon: FiClock
            },
            confirmed: {
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/20',
                label: 'Confirmed',
                icon: FiCheckCircle
            },
            completed: {
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                border: 'border-blue-500/20',
                label: 'Completed',
                icon: FiCheckCircle
            },
            cancelled: {
                color: 'text-red-400',
                bg: 'bg-red-500/10',
                border: 'border-red-500/20',
                label: 'Cancelled',
                icon: FiXCircle
            },
        };
        return configs[status] || configs.pending;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
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
                            Scheduled Visits
                        </h1>
                        <p className="text-gray-400 text-lg font-light max-w-xl">
                            Manage your appointment schedule and property viewings.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 animate-pulse text-sm uppercase tracking-wider">Loading schedule...</p>
                    </div>
                ) : visits.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-24 bg-dark-900/40 backdrop-blur-sm rounded-3xl border border-white/5 border-dashed"
                    >
                        <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-dark-900">
                            <FiCalendar className="text-4xl text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 font-serif">No visits scheduled</h3>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">Upcoming property visit requests will appear here.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        <AnimatePresence>
                            {visits.map((visit) => {
                                const statusConfig = getStatusConfig(visit.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <motion.div
                                        key={visit._id}
                                        variants={itemVariants}
                                        className="relative bg-dark-900/60 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden group hover:border-white/10 transition-colors"
                                    >
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

                                        <div className="flex flex-col md:flex-row">
                                            {/* Date Column */}
                                            <div className="bg-white/5 p-6 md:w-48 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-white/5">
                                                <div className="text-4xl font-bold text-white mb-1 font-serif">
                                                    {new Date(visit.scheduledDate).getDate()}
                                                </div>
                                                <div className="text-cyan-400 uppercase tracking-widest text-sm font-semibold mb-2">
                                                    {new Date(visit.scheduledDate).toLocaleDateString('en-US', { month: 'short' })}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400 text-sm bg-dark-950/30 px-3 py-1 rounded-full border border-white/5">
                                                    <FiClock className="text-xs" /> {visit.scheduledTime}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 p-6">
                                                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                                    <div>
                                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider mb-2 ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border`}>
                                                            <StatusIcon /> {statusConfig.label}
                                                        </div>
                                                        <h3 className="text-xl font-bold text-white mb-1 hover:text-cyan-400 transition-colors">
                                                            <Link to={`/property/${visit.property?._id}`}>
                                                                {visit.property?.title}
                                                            </Link>
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                            <FiMapPin className="text-white/40" />
                                                            {visit.property?.location?.city}, {visit.property?.location?.state}
                                                        </div>
                                                    </div>

                                                    {/* Visitor Info */}
                                                    <div className="bg-dark-950/30 rounded-xl p-3 border border-white/5 flex flex-col gap-2 min-w-[200px]">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                                <FiUser className="text-sm" />
                                                            </div>
                                                            <div className="text-sm font-medium text-white">{visit.contactName}</div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                                <FiPhone className="text-sm" />
                                                            </div>
                                                            <div className="text-sm text-gray-400">{visit.contactPhone}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {visit.notes && (
                                                    <div className="mb-6 flex gap-3 p-3 bg-dark-800/50 rounded-lg border border-white/5">
                                                        <FiInfo className="text-gray-400 flex-shrink-0 mt-0.5" />
                                                        <p className="text-sm text-gray-400 italic">"{visit.notes}"</p>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                                    {visit.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusUpdate(visit._id, 'confirmed')}
                                                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
                                                            >
                                                                <FiCheckCircle /> Confirm Visit
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(visit._id, 'cancelled', 'Cancelled by agent')}
                                                                className="flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-red-500/10 hover:text-red-400 text-gray-400 rounded-xl text-sm font-semibold border border-white/5 hover:border-red-500/20 transition-all"
                                                            >
                                                                <FiXCircle /> Cancel
                                                            </button>
                                                        </>
                                                    )}
                                                    {visit.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(visit._id, 'completed')}
                                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5"
                                                        >
                                                            <FiCheckCircle /> Mark Completed
                                                        </button>
                                                    )}
                                                    {visit.status === 'cancelled' && (
                                                        <span className="text-gray-500 text-sm italic">This visit has been cancelled.</span>
                                                    )}
                                                    {visit.status === 'completed' && (
                                                        <span className="text-blue-400/70 text-sm font-medium flex items-center gap-2">
                                                            <FiCheckCircle /> Visit completed successfully
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AgentVisits;
