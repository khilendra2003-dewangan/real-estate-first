import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiHome, FiPlus, FiMessageSquare, FiCalendar, FiEye, FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp, FiArrowRight, FiUser, FiSettings, FiSearch } from 'react-icons/fi';
import { propertyAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import ProfileSection from '../../components/dashboard/ProfileSection';

const HERO_BG_URL = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop';

const DashboardContent = ({ stats, user }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const heroRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    const statCards = stats ? [
        { label: 'Total Properties', value: stats.stats?.properties?.total || 0, icon: FiHome, color: 'text-cyan-400', gradient: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30' },
        { label: 'Approved', value: stats.stats?.properties?.approved || 0, icon: FiCheckCircle, color: 'text-emerald-400', gradient: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
        { label: 'Pending Approval', value: stats.stats?.properties?.pending || 0, icon: FiClock, color: 'text-amber-400', gradient: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', alert: true },
        { label: 'Total Views', value: stats.stats?.totalViews || 0, icon: FiEye, color: 'text-purple-400', gradient: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30' },
        { label: 'Active Inquiries', value: stats.stats?.inquiries?.pending || 0, icon: FiMessageSquare, color: 'text-pink-400', gradient: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30' },
        { label: 'Scheduled Visits', value: stats.stats?.visits?.pending || 0, icon: FiCalendar, color: 'text-indigo-400', gradient: 'from-indigo-500/20 to-blue-500/20', border: 'border-indigo-500/30' },
    ] : [];

    const quickActions = [
        {
            name: 'Add New Property',
            icon: FiPlus,
            path: '/agent/properties/new',
            desc: 'Create a new premium listing',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
            color: 'group-hover:text-cyan-400'
        },
        {
            name: 'My Properties',
            icon: FiHome,
            path: '/agent/properties',
            desc: 'Manage and edit your listings',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
            color: 'group-hover:text-emerald-400'
        },
        {
            name: 'Inquiries',
            icon: FiMessageSquare,
            path: '/agent/inquiries',
            desc: 'Respond to customer messages',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop',
            color: 'group-hover:text-purple-400'
        },
        {
            name: 'Visits',
            icon: FiCalendar,
            path: '/agent/visits',
            desc: 'View scheduled property visits',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
            color: 'group-hover:text-pink-400'
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen bg-dark-950 text-white selection:bg-cyan-500/30">

            {/* Parallax Hero Header */}
            <div ref={heroRef} className="relative h-[400px] overflow-hidden">
                <motion.div
                    style={{ y: backgroundY }}
                    className="absolute inset-0 z-0"
                >
                    <img src={HERO_BG_URL} alt="Agent Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-dark-950/90 to-dark-950"></div>
                </motion.div>

                <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col md:flex-row justify-between items-end gap-6"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
                                    Real Estate Agent
                                </span>
                                {user?.isApproved ? (
                                    <>
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        <span className="text-gray-400 text-xs">Verified Account</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                        <span className="text-gray-400 text-xs text-amber-500">Pending Approval</span>
                                    </>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-2 drop-shadow-lg">
                                Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{user?.name}</span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-xl font-light leading-relaxed">
                                Manage your premium listings, track performance, and connect with potential buyers.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">

                {/* Pending Approval Warning */}
                {!user?.isApproved && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-10 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <FiAlertCircle className="text-9xl text-amber-500" />
                        </div>
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                                <FiAlertCircle className="text-amber-400 text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Account Pending Approval</h3>
                                <p className="text-gray-300 max-w-2xl">
                                    Your agent account is currently under review by our administrators. You can create properties, but they will not be public until your account is approved.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 mb-10 p-1.5 bg-dark-900/80 backdrop-blur-xl border border-white/5 rounded-2xl w-fit shadow-2xl"
                >
                    {['overview', 'profile'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${activeTab === tab
                                ? 'text-white shadow-lg'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTabBadge"
                                    className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                {tab === 'overview' ? <FiTrendingUp /> : <FiUser />}
                                {tab === 'overview' ? 'Overview' : 'Profile Settings'}
                            </span>
                        </button>
                    ))}
                </motion.div>

                {activeTab === 'profile' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-dark-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8"
                    >
                        <ProfileSection />
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
                            {statCards.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className={`relative group bg-dark-900/60 backdrop-blur-md rounded-2xl p-5 border ${stat.border} hover:bg-dark-800/80 transition-all duration-300 shadow-xl overflow-hidden`}
                                >
                                    {/* Background Gradient Blob */}
                                    <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${stat.gradient} blur-2xl rounded-full group-hover:scale-150 transition-transform duration-700`}></div>

                                    <div className="relative z-10">
                                        <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <stat.icon className={`text-2xl ${stat.color} drop-shadow-md`} />
                                        </div>
                                        <div className="text-3xl font-bold text-white mb-1 tracking-tight">{stat.value}</div>
                                        <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">{stat.label}</div>
                                    </div>

                                    {stat.alert && stat.value > 0 && (
                                        <div className="absolute top-4 right-4 w-3 h-3 bg-amber-500 rounded-full animate-ping"></div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Quick Actions / Featured Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {quickActions.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    className="group relative h-64 rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer"
                                >
                                    <Link to={item.path} className="block h-full w-full">
                                        <div className="absolute inset-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-50 group-hover:brightness-75" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-900/40 to-transparent"></div>
                                        </div>

                                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                <div className={`w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                                    <item.icon className={`text-2xl text-white ${item.color} transition-colors`} />
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{item.name}</h3>
                                                <p className="text-gray-400 text-xs font-light">{item.desc}</p>
                                            </div>

                                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                                <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                                    <FiArrowRight className="text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Recent Activity Sections */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Recent Inquiries */}
                            <motion.div
                                variants={itemVariants}
                                className="relative bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl group hover:shadow-purple-500/10 transition-all duration-500"
                            >
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 blur-3xl rounded-full pointer-events-none -mr-40 -mt-40 opacity-30 group-hover:opacity-60 transition-opacity duration-700"></div>
                                <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 blur-3xl rounded-full pointer-events-none -ml-30 -mb-30 opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>

                                <div className="relative z-10 p-8 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-purple-500/30 shadow-lg shadow-purple-500/10">
                                            <FiMessageSquare className="text-purple-400 text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-serif font-bold text-white tracking-tight">Recent Inquiries</h3>
                                            <p className="text-purple-300/60 text-xs uppercase tracking-widest font-semibold mt-1">Latest Messages</p>
                                        </div>
                                    </div>
                                    <Link to="/agent/inquiries" className="group/btn flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-purple-500/20 text-xs text-gray-400 hover:text-white uppercase tracking-wider font-semibold transition-all border border-white/5 hover:border-purple-500/30">
                                        View All <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                                <div className="relative z-10 p-6 min-h-[300px]">
                                    {stats?.recentInquiries?.length > 0 ? (
                                        <div className="space-y-4">
                                            {stats.recentInquiries.map((inquiry) => (
                                                <div key={inquiry._id} className="flex items-center gap-4 p-4 rounded-2xl bg-dark-950/40 hover:bg-dark-950/80 border border-white/5 hover:border-purple-500/30 transition-all duration-300 group/item cursor-pointer backdrop-blur-sm">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border border-white/10 shadow-inner ring-2 ring-transparent group-hover/item:ring-purple-500/30 transition-all">
                                                        <span className="text-white font-serif font-bold text-lg">{inquiry.user?.name?.charAt(0)}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h4 className="text-white font-medium group-hover/item:text-purple-400 transition-colors truncate text-base">{inquiry.property?.title}</h4>
                                                            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-gray-400 text-sm truncate pr-4">
                                                            <span className="text-purple-400/80 font-medium">From:</span> {inquiry.user?.name}
                                                        </p>
                                                    </div>
                                                    <div className="opacity-0 group-hover/item:opacity-100 transition-opacity -translate-x-2 group-hover/item:translate-x-0">
                                                        <FiArrowRight className="text-purple-400" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                            <div className="w-24 h-24 bg-gradient-to-b from-white/5 to-transparent rounded-full flex items-center justify-center mb-6 border border-white/5">
                                                <div className="w-16 h-16 bg-dark-950 rounded-full flex items-center justify-center shadow-inner">
                                                    <FiMessageSquare className="text-3xl text-gray-700" />
                                                </div>
                                            </div>
                                            <h4 className="text-white font-serif text-lg mb-2">No New Messages</h4>
                                            <p className="text-gray-500 text-sm max-w-xs">Your inbox is empty. New inquiries from potential buyers will appear here.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Upcoming Visits */}
                            <motion.div
                                variants={itemVariants}
                                className="relative bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl group hover:shadow-indigo-500/10 transition-all duration-500"
                            >
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none -mr-40 -mt-40 opacity-30 group-hover:opacity-60 transition-opacity duration-700"></div>
                                <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none -ml-30 -mb-30 opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>

                                <div className="relative z-10 p-8 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
                                            <FiCalendar className="text-indigo-400 text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-serif font-bold text-white tracking-tight">Upcoming Visits</h3>
                                            <p className="text-indigo-300/60 text-xs uppercase tracking-widest font-semibold mt-1">Schedule & Tours</p>
                                        </div>
                                    </div>
                                    <Link to="/agent/visits" className="group/btn flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-indigo-500/20 text-xs text-gray-400 hover:text-white uppercase tracking-wider font-semibold transition-all border border-white/5 hover:border-indigo-500/30">
                                        View All <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                                <div className="relative z-10 p-6 min-h-[300px]">
                                    {stats?.upcomingVisits?.length > 0 ? (
                                        <div className="space-y-4">
                                            {stats.upcomingVisits.map((visit) => (
                                                <div key={visit._id} className="flex items-center gap-4 p-4 rounded-2xl bg-dark-950/40 hover:bg-dark-950/80 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group/item cursor-pointer backdrop-blur-sm">
                                                    <div className="w-14 h-14 bg-gradient-to-b from-dark-800 to-dark-900 rounded-xl flex flex-col items-center justify-center border border-white/10 shadow-lg group-hover/item:border-indigo-500/30 transition-colors">
                                                        <span className="text-indigo-400 font-bold text-xl leading-none mb-0.5">{new Date(visit.scheduledDate).getDate()}</span>
                                                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{new Date(visit.scheduledDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-white font-medium group-hover/item:text-indigo-400 transition-colors truncate text-base mb-1">{visit.property?.title}</h4>
                                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                                            <span className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-md">
                                                                <FiClock className="w-3.5 h-3.5 text-indigo-400" /> {visit.scheduledTime}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wide border ${visit.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                                    visit.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                                        'bg-gray-500/10 text-gray-400 border-white/10'
                                                                }`}>
                                                                {visit.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                            <div className="w-24 h-24 bg-gradient-to-b from-white/5 to-transparent rounded-full flex items-center justify-center mb-6 border border-white/5">
                                                <div className="w-16 h-16 bg-dark-950 rounded-full flex items-center justify-center shadow-inner">
                                                    <FiCalendar className="text-3xl text-gray-700" />
                                                </div>
                                            </div>
                                            <h4 className="text-white font-serif text-lg mb-2">No Scheduled Visits</h4>
                                            <p className="text-gray-500 text-sm max-w-xs">Your calendar is clear. Upcoming property tours will be listed here.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                    </motion.div>
                )}
            </div>
        </div>
    );
};

const AgentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const { data } = await propertyAPI.getAgentDashboard();
            setStats(data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin-reverse"></div>
                    </div>
                    <p className="text-gray-400 font-light tracking-widest uppercase text-sm animate-pulse">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return <DashboardContent stats={stats} user={user} />;
};

export default AgentDashboard;
