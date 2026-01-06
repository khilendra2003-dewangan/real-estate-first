import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiHeart, FiMessageSquare, FiCalendar, FiHome, FiArrowRight, FiSearch, FiEye, FiSettings, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import ProfileSection from '../../components/dashboard/ProfileSection';

const HERO_BG_URL = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop';

const ParallaxHero = ({ user }) => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={heroRef} className="relative h-[400px] overflow-hidden">
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
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
                        Welcome back,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            {user?.name}
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl font-light">
                        Your personal gateway to luxury living. Manage your favorites, inquiries, and scheduled visits all in one place.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

const UserDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    const quickActions = [
        { name: 'Wishlist', icon: FiHeart, path: '/dashboard/wishlist', desc: 'Your saved properties', color: 'text-pink-400', bg: 'group-hover:bg-pink-500/10', border: 'group-hover:border-pink-500/30' },
        { name: 'My Inquiries', icon: FiMessageSquare, path: '/dashboard/inquiries', desc: 'Track your inquiries', color: 'text-purple-400', bg: 'group-hover:bg-purple-500/10', border: 'group-hover:border-purple-500/30' },
        { name: 'Scheduled Visits', icon: FiCalendar, path: '/dashboard/visits', desc: 'Upcoming property visits', color: 'text-green-400', bg: 'group-hover:bg-green-500/10', border: 'group-hover:border-green-500/30' },
        { name: 'Browse Properties', icon: FiSearch, path: '/properties', desc: 'Find your dream home', color: 'text-cyan-400', bg: 'group-hover:bg-cyan-500/10', border: 'group-hover:border-cyan-500/30' },
    ];

    return (
        <div className="min-h-screen bg-dark-950 text-white pb-20">
            <ParallaxHero user={user} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20">
                {/* Tabs Navigation */}
                <div className="flex justify-center mb-12">
                    <div className="bg-dark-900/80 backdrop-blur-xl border border-white/10 p-1.5 rounded-full inline-flex gap-2 shadow-2xl">
                        {[
                            { id: 'overview', label: 'Overview', icon: FiHome },
                            { id: 'profile', label: 'Profile Settings', icon: FiSettings }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-8 py-3 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-300 ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon className={activeTab === tab.id ? 'text-white' : 'text-gray-500'} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'profile' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl"
                    >
                        <ProfileSection />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {/* Dream Home Banner */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="relative overflow-hidden rounded-3xl border border-white/10 bg-dark-900/40 backdrop-blur-md p-10 group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]"></div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <h2 className="text-3xl font-serif font-bold text-white mb-3">Begin Your Journey</h2>
                                    <p className="text-gray-400 max-w-xl text-lg">
                                        Explore our curated collection of premium properties. Your dream home is just a click away.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <Link
                                        to="/buy"
                                        className="bg-white text-dark-950 font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                                    >
                                        <FiHome /> Buy Property
                                    </Link>
                                    <Link
                                        to="/rent"
                                        className="bg-dark-800 text-white font-bold py-3 px-8 rounded-xl border border-white/10 hover:border-cyan-500/50 hover:bg-dark-700 transition-all flex items-center gap-2"
                                    >
                                        <FiHome /> Rent Property
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {quickActions.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link
                                        to={item.path}
                                        className={`group block h-full p-6 bg-dark-900/60 backdrop-blur-xl border border-white/5 rounded-2xl hover:border-white/20 transition-all duration-300 relative overflow-hidden ${item.border}`}
                                    >
                                        <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${item.bg}`}></div>

                                        <div className="relative z-10">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                                                <item.icon className={`text-2xl ${item.color}`} />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                                                {item.desc}
                                            </p>
                                        </div>

                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                            <FiArrowRight className="text-gray-400" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Quick Tips Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-dark-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8"
                        >
                            <h3 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-cyan-500/10 rounded-lg">
                                    <FiEye className="text-cyan-400" />
                                </div>
                                Pro Tips for Buyers
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { title: 'Save Favorites', desc: 'Create a wishlist to easily compare your top property choices side-by-side.', icon: FiHeart, color: 'text-pink-400' },
                                    { title: 'Contact Agents', desc: 'Reach out directly to verified agents to get detailed property insights.', icon: FiMessageSquare, color: 'text-purple-400' },
                                    { title: 'Schedule Visits', desc: 'Book in-person visits to experience properties firsthand before deciding.', icon: FiCalendar, color: 'text-green-400' }
                                ].map((tip, idx) => (
                                    <div key={idx} className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 ${tip.color}`}>
                                                <tip.icon size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold mb-2">{tip.title}</h4>
                                                <p className="text-gray-400 text-sm leading-relaxed">{tip.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
