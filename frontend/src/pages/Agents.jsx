import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiUser, FiArrowRight, FiPhone, FiMail, FiStar } from 'react-icons/fi';
import { motion, useScroll, useTransform } from 'framer-motion';
import { authAPI } from '../api/api';

const HERO_BG = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop';

const Agents = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    useEffect(() => {
        fetchAgents();
    }, [search]);

    const fetchAgents = async () => {
        setLoading(true);
        try {
            const params = { limit: 20 };
            if (search) params.search = search;
            const { data } = await authAPI.getPublicAgents(params);
            setAgents(data.agents || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <div className="min-h-screen bg-dark-950 text-white selection:bg-amber-500/30 font-sans">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[150px] mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-600/5 rounded-full blur-[150px] mix-blend-screen" />
            </div>

            {/* Parallax Hero Section */}
            <div ref={heroRef} className="relative h-[65vh] flex items-center justify-center overflow-hidden">
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-950/40 via-dark-950/60 to-dark-950 z-10" />
                    <img src={HERO_BG} alt="Luxury Interior" className="w-full h-full object-cover" />
                </motion.div>

                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-md">
                            World-Class Service
                        </span>
                        <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-8 leading-tight drop-shadow-2xl">
                            Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">Realtors</span>
                        </h1>
                        <p className="text-xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed opacity-90">
                            Partner with distinguished professionals who understand the art of luxury living.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative z-20 px-4 sm:px-6 lg:px-8 pb-32 -mt-24">
                <div className="max-w-7xl mx-auto">
                    {/* Search Bar - Floating Glass */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="relative max-w-3xl mx-auto mb-24"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-300/30 to-yellow-600/30 blur-2xl rounded-full opacity-50" />
                        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center shadow-2xl transition-all duration-300 focus-within:bg-black/40 focus-within:border-amber-500/30">
                            <div className="pl-6 text-amber-500/70">
                                <FiSearch size={22} />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Find your property expert..."
                                className="w-full bg-transparent border-none text-white px-6 py-4 focus:ring-0 placeholder-gray-400 text-lg font-light tracking-wide outline-none"
                            />
                            <button className="bg-gradient-to-r from-amber-400 to-amber-600 text-dark-900 px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-wider">
                                Search
                            </button>
                        </div>
                    </motion.div>

                    {/* Agents Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-6"></div>
                            <p className="text-amber-200/50 font-serif tracking-widest text-sm animate-pulse">CURATING SELECTION...</p>
                        </div>
                    ) : agents.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24 bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/5 max-w-2xl mx-auto"
                        >
                            <div className="text-6xl mb-6 grayscale opacity-50">🦅</div>
                            <h3 className="text-3xl font-serif text-white mb-3">No Agents Found</h3>
                            <p className="text-gray-400 font-light">We couldn't find any agents matching your criteria.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {agents.map((agent) => (
                                <Link to={`/agents/${agent._id}`} key={agent._id} className="block group h-full">
                                    <motion.div
                                        variants={itemVariants}
                                        className="relative h-full bg-dark-900 rounded-[2rem] overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-300 group shadow-2xl"
                                    >
                                        {/* Image Container */}
                                        <div className="relative aspect-[4/5] overflow-hidden">
                                            {agent.profileImage?.url ? (
                                                <img
                                                    src={agent.profileImage.url}
                                                    alt={agent.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-dark-800 text-dark-600">
                                                    <FiUser className="text-6xl" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />

                                            {/* Agency Badge */}
                                            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
                                                <span className="text-xs font-bold text-white tracking-widest uppercase">
                                                    {agent.agencyName || 'Independent'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Floating Action Button */}
                                        <div className="absolute top-[calc(55%-2rem)] right-6 z-20">
                                            <button className="w-14 h-14 rounded-full bg-amber-500 text-dark-900 flex items-center justify-center shadow-lg shadow-amber-500/20 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-45deg]">
                                                <FiArrowRight size={24} />
                                            </button>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-8 pt-10 relative bg-dark-900">
                                            <h3 className="text-3xl font-serif font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                                                {agent.name}
                                            </h3>

                                            <div className="flex items-center gap-2 text-gray-400 mb-8 font-light">
                                                <FiMapPin className="text-amber-500" />
                                                {agent.city || 'Global'}
                                            </div>

                                            {/* Footer Actions */}
                                            <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                                                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-amber-400 transition-colors group/btn">
                                                    <FiPhone className="text-lg text-gray-500 group-hover/btn:text-amber-500 transition-colors" />
                                                    <span>Contact</span>
                                                </button>
                                                <div className="w-px h-4 bg-white/10"></div>
                                                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-amber-400 transition-colors group/btn">
                                                    <FiMail className="text-lg text-gray-500 group-hover/btn:text-amber-500 transition-colors" />
                                                    <span>Message</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Agents;
