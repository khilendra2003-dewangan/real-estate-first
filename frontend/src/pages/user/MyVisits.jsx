import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiArrowLeft, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { visitAPI } from '../../api/api';

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
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">Scheduled Visits</h1>
                <p className="text-gray-300 max-w-2xl font-light">
                    Manage your property viewings and upcoming appointments.
                </p>
            </motion.div>
        </div>
    );
};

const MyVisits = () => {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVisits();
    }, []);

    const fetchVisits = async () => {
        try {
            const { data } = await visitAPI.getUserVisits({ limit: 50 });
            setVisits(data.visits || []);
        } catch (error) {
            console.error('Error fetching visits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        try {
            await visitAPI.cancel(id, 'Cancelled by user');
            setVisits(visits.map((v) => (v._id === id ? { ...v, status: 'cancelled' } : v)));
            toast.success('Visit cancelled');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { icon: FiClock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Pending' },
            confirmed: { icon: FiCheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Confirmed' },
            completed: { icon: FiCheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Completed' },
            cancelled: { icon: FiXCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Cancelled' },
            rescheduled: { icon: FiAlertCircle, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Rescheduled' },
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
                {visits.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-12 text-center"
                    >
                        <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiCalendar className="text-3xl text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white mb-2">No Scheduled Visits</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            Schedule a visit to experience your dream home in person.
                        </p>
                        <Link to="/properties" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
                            Browse Properties
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {visits.map((visit, index) => (
                            <motion.div
                                key={visit._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-dark-900/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/20 transition-colors"
                            >
                                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                                    {/* Property Image & Date */}
                                    <div className="flex-shrink-0 w-full md:w-64 flex flex-col gap-3">
                                        <Link to={`/property/${visit.property?._id}`} className="block relative group overflow-hidden rounded-xl h-40">
                                            <img
                                                src={visit.property?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                                alt={visit.property?.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </Link>
                                        <div className="bg-dark-800/50 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-cyan-400">
                                                <FiCalendar />
                                                <span className="text-white font-medium">{new Date(visit.scheduledDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-400 text-sm">
                                                <FiClock />
                                                <span>{visit.scheduledTime}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                                <div>
                                                    <Link to={`/property/${visit.property?._id}`} className="text-xl font-bold text-white hover:text-cyan-400 transition-colors mb-2 block">
                                                        {visit.property?.title}
                                                    </Link>
                                                    <div className="flex flex-col gap-1 text-sm text-gray-400">
                                                        <span className="flex items-center gap-2">
                                                            <FiMapPin className="text-gray-500" />
                                                            {visit.property?.location?.city}, {visit.property?.location?.state}
                                                        </span>
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-4 flex justify-center text-gray-500">@</span>
                                                            Agent: <span className="text-white">{visit.agent?.name}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                {getStatusBadge(visit.status)}
                                            </div>

                                            {visit.agentRemarks && (
                                                <div className="mt-4 bg-cyan-900/10 rounded-xl p-4 border border-cyan-500/10">
                                                    <p className="text-cyan-400 text-xs font-bold mb-1 uppercase tracking-wider">Agent Remarks</p>
                                                    <p className="text-gray-300 text-sm">{visit.agentRemarks}</p>
                                                </div>
                                            )}
                                        </div>

                                        {['pending', 'confirmed'].includes(visit.status) && (
                                            <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                                                <button
                                                    onClick={() => handleCancel(visit._id)}
                                                    className="px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                                                >
                                                    Cancel Appointment
                                                </button>
                                            </div>
                                        )}
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

export default MyVisits;
