import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiUsers, FiHome, FiMessageSquare, FiCalendar, FiCheckCircle, FiClock, FiUserCheck, FiUserX, FiArrowRight, FiTrendingUp, FiShield, FiActivity, FiSearch } from 'react-icons/fi';
import { adminAPI } from '../../api/api';
import ProfileSection from '../../components/dashboard/ProfileSection';

const HERO_BG_URL = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop';

const DashboardContent = ({ stats, fetchDashboard }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const heroRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    const statCards = stats ? [
        { label: 'Total Users', value: stats.stats?.users?.total || 0, icon: FiUsers, color: 'text-blue-400', gradient: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30' },
        { label: 'Total Agents', value: stats.stats?.agents?.total || 0, icon: FiUserCheck, color: 'text-emerald-400', gradient: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
        { label: 'Pending Agents', value: stats.stats?.agents?.pendingApproval || 0, icon: FiClock, color: 'text-amber-400', gradient: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', alert: true },
        { label: 'Total Properties', value: stats.stats?.properties?.total || 0, icon: FiHome, color: 'text-cyan-400', gradient: 'from-cyan-500/20 to-sky-500/20', border: 'border-cyan-500/30' },
        { label: 'Pending Properties', value: stats.stats?.properties?.pendingApproval || 0, icon: FiActivity, color: 'text-rose-400', gradient: 'from-rose-500/20 to-red-500/20', border: 'border-rose-500/30', alert: true },
        { label: 'Total Inquiries', value: stats.stats?.inquiries?.total || 0, icon: FiMessageSquare, color: 'text-purple-400', gradient: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30' },
    ] : [];

    const quickActions = [
        {
            name: 'Manage Agents',
            icon: FiUserCheck,
            path: '/admin/agents',
            desc: 'Verify and manage agent accounts',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop',
            color: 'group-hover:text-emerald-400',
            badge: stats?.stats?.agents?.pendingApproval
        },
        {
            name: 'Manage Properties',
            icon: FiHome,
            path: '/admin/properties',
            desc: 'Review and approve new listings',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop',
            color: 'group-hover:text-cyan-400',
            badge: stats?.stats?.properties?.pendingApproval
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
                    <img src={HERO_BG_URL} alt="Admin Background" className="w-full h-full object-cover" />
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
                                    System Administrator
                                </span>
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-gray-400 text-xs">System Online</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-2 drop-shadow-lg">
                                Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Dashboard</span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-xl font-light leading-relaxed">
                                Overview of platform performance, user verification, and property management.
                            </p>
                        </div>

                        {/* Search Bar for Quick Access */}
                        <div className="w-full md:w-auto relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search users, properties..."
                                className="w-full md:w-80 bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all backdrop-blur-md shadow-lg"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
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
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                {tab === 'overview' ? <FiTrendingUp /> : <FiUserCheck />}
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
                                        <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                                    )}
                                    {stat.alert && stat.value > 0 && (
                                        <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full"></div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Quick Actions / Featured Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            {quickActions.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    className="group relative h-64 rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer"
                                >
                                    <Link to={item.path} className="block h-full w-full">
                                        <div className="absolute inset-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-900/60 to-dark-900/30"></div>
                                        </div>

                                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className={`w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                        <item.icon className={`text-3xl text-white ${item.color} transition-colors`} />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{item.name}</h3>
                                                    <p className="text-gray-300 font-light">{item.desc}</p>
                                                </div>

                                                {item.badge > 0 && (
                                                    <div className="bg-red-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg shadow-red-500/30 animate-pulse">
                                                        {item.badge} Pending
                                                    </div>
                                                )}
                                            </div>

                                            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
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
                            {/* Pending Agents List */}
                            <motion.div
                                variants={itemVariants}
                                className="relative bg-dark-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-2xl hover:border-white/10 transition-colors group"
                            >
                                {/* Decorative Gradient */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full pointer-events-none -mr-32 -mt-32 transition-opacity duration-700 opacity-50 group-hover:opacity-100"></div>

                                <div className="relative z-10 p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                            <FiUserCheck className="text-amber-400 text-lg" />
                                        </div>
                                        Pending Agents
                                    </h3>
                                    <Link to="/admin/agents" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white uppercase tracking-wider font-semibold transition-all border border-white/5 hover:border-white/20">
                                        View All
                                    </Link>
                                </div>
                                <div className="relative z-10 p-6">
                                    {stats?.recentPendingAgents?.length > 0 ? (
                                        <div className="space-y-4">
                                            {stats.recentPendingAgents.map((agent) => (
                                                <div key={agent._id} className="flex items-center gap-4 p-4 rounded-2xl bg-dark-950/50 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 transition-all duration-300 group/item cursor-pointer">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-amber-500/20 shadow-lg">
                                                        <span className="text-amber-400 font-bold text-lg">{agent.name.charAt(0)}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-white font-medium group-hover/item:text-amber-400 transition-colors">{agent.name}</h4>
                                                        <p className="text-gray-500 text-sm">{agent.agencyName || 'Independent Agent'}</p>
                                                    </div>
                                                    <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 shadow-sm">
                                                        Review
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-16 flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 bg-gradient-to-br from-dark-800 to-dark-900 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5 ring-4 ring-dark-900">
                                                <FiCheckCircle className="text-3xl text-green-500/50" />
                                            </div>
                                            <h4 className="text-white font-medium text-lg mb-1">All caught up!</h4>
                                            <p className="text-gray-500 text-sm max-w-xs">There are no pending agent approvals at the moment.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Pending Properties List */}
                            <motion.div
                                variants={itemVariants}
                                className="relative bg-dark-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-2xl hover:border-white/10 transition-colors group"
                            >
                                {/* Decorative Gradient */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-3xl rounded-full pointer-events-none -mr-32 -mt-32 transition-opacity duration-700 opacity-50 group-hover:opacity-100"></div>

                                <div className="relative z-10 p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                                            <FiHome className="text-rose-400 text-lg" />
                                        </div>
                                        Pending Properties
                                    </h3>
                                    <Link to="/admin/properties" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white uppercase tracking-wider font-semibold transition-all border border-white/5 hover:border-white/20">
                                        View All
                                    </Link>
                                </div>
                                <div className="relative z-10 p-6">
                                    {stats?.recentPendingProperties?.length > 0 ? (
                                        <div className="space-y-4">
                                            {stats.recentPendingProperties.map((prop) => (
                                                <div key={prop._id} className="flex items-center gap-4 p-4 rounded-2xl bg-dark-950/50 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 transition-all duration-300 group/item cursor-pointer">
                                                    <img
                                                        src={prop.images?.[0]?.url || 'https://via.placeholder.com/100'}
                                                        alt={prop.title}
                                                        className="w-16 h-16 object-cover rounded-xl border border-white/10 shadow-md transform group-hover/item:scale-105 transition-transform"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-white font-medium truncate group-hover/item:text-rose-400 transition-colors">{prop.title}</h4>
                                                        <p className="text-gray-500 text-sm flex items-center gap-1">
                                                            <FiUserCheck className="w-3 h-3" /> {prop.agent?.name}
                                                        </p>
                                                    </div>
                                                    <div className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20 shadow-sm">
                                                        Review
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-16 flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 bg-gradient-to-br from-dark-800 to-dark-900 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5 ring-4 ring-dark-900">
                                                <FiCheckCircle className="text-3xl text-green-500/50" />
                                            </div>
                                            <h4 className="text-white font-medium text-lg mb-1">Excellent!</h4>
                                            <p className="text-gray-500 text-sm max-w-xs">No pending properties requiring approval. Good job!</p>
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

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const { data } = await adminAPI.getDashboard();
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
                    <p className="text-gray-400 font-light tracking-widest uppercase text-sm animate-pulse">Initializing Admin Dashboard...</p>
                </div>
            </div>
        );
    }

    return <DashboardContent stats={stats} fetchDashboard={fetchDashboard} />;
};

export default AdminDashboard;
