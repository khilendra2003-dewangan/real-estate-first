import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiBriefcase, FiUser, FiAward, FiHome, FiCheckCircle } from 'react-icons/fi';
import { authAPI, propertyAPI } from '../api/api';
import PropertyCard from '../components/property/PropertyCard';

const HERO_BG_URL = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop';

const HeroSection = () => {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    return (
        <div ref={heroRef} className="relative h-[500px] overflow-hidden">
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 z-0"
            >
                <img src={HERO_BG_URL} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-dark-950/30 via-dark-950/60 to-dark-950"></div>
            </motion.div>
        </div>
    );
};

const AgentProfile = () => {
    const { id } = useParams();
    const [agent, setAgent] = useState(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAgentData();
    }, [id]);

    const fetchAgentData = async () => {
        setLoading(true);
        try {
            const [agentRes, propertiesRes] = await Promise.all([
                authAPI.getAgentPublicProfile(id),
                propertyAPI.getPropertiesByAgentId(id, { limit: 100 })
            ]);
            setAgent(agentRes.data.agent);
            setProperties(propertiesRes.data.properties || []);
        } catch (error) {
            console.error(error);
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
                </div>
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-3xl font-serif text-white mb-2">Agent Not Found</h2>
                    <p className="text-gray-400">The agent profile you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-950 text-white selection:bg-cyan-500/30">
            <HeroSection />



            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-64 pb-20">

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-dark-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl mb-20 relative overflow-hidden"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none -mr-32 -mt-32 opacity-40"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 blur-3xl rounded-full pointer-events-none -ml-32 -mb-32 opacity-30"></div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">

                        {/* Avatar */}
                        <div className="w-40 h-40 md:w-56 md:h-56 rounded-full p-2 bg-gradient-to-br from-white/10 to-transparent border border-white/20 shadow-2xl flex-shrink-0 mx-auto md:mx-0 relative group">
                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-dark-800 relative z-10">
                                {agent.profileImage?.url ? (
                                    <img src={agent.profileImage.url} alt={agent.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-dark-800 text-dark-400">
                                        <FiUser className="text-6xl" />
                                    </div>
                                )}
                            </div>
                            {/* Verification Badge */}
                            <div className="absolute bottom-4 right-4 z-20 bg-blue-500 text-white rounded-full p-2 border-4 border-dark-900 shadow-lg" title="Verified Agent">
                                <FiCheckCircle className="text-xl" />
                            </div>
                        </div>

                        <div className="flex-1 w-full text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-white/5 pb-8">
                                <div>
                                    <motion.h1
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-4xl md:text-5xl font-serif font-bold text-white mb-3"
                                    >
                                        {agent.name}
                                    </motion.h1>
                                    <p className="text-xl text-cyan-400 font-light tracking-wide mb-4">{agent.agencyName || 'Premium Real Estate Agent'}</p>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                                        {agent.specialization?.map((spec, idx) => (
                                            <span key={idx} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs uppercase tracking-wider font-semibold hover:bg-white/10 transition-colors">
                                                {spec}
                                            </span>
                                        )) || (
                                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs uppercase tracking-wider font-semibold">
                                                    Luxury Real Estate
                                                </span>
                                            )}
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <div className="px-6 py-4 bg-dark-950/50 rounded-2xl border border-white/5 text-center min-w-[100px] hover:border-cyan-500/30 transition-colors group/stat">
                                        <div className="text-2xl font-bold text-white group-hover/stat:text-cyan-400 transition-colors">{properties.length}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Properties</div>
                                    </div>
                                    <div className="px-6 py-4 bg-dark-950/50 rounded-2xl border border-white/5 text-center min-w-[100px] hover:border-purple-500/30 transition-colors group/stat">
                                        <div className="text-2xl font-bold text-white group-hover/stat:text-purple-400 transition-colors">{agent.experience || 0}+</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Years Exp.</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                <div className="flex items-center gap-4 text-gray-300 group/item p-3 rounded-xl hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-cyan-400 group-hover/item:scale-110 transition-transform">
                                        <FiBriefcase />
                                    </div>
                                    <div className="text-sm">
                                        <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Specialization</span>
                                        {agent.specialization?.join(', ') || 'General Real Estate'}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-gray-300 group/item p-3 rounded-xl hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-purple-400 group-hover/item:scale-110 transition-transform">
                                        <FiMapPin />
                                    </div>
                                    <div className="text-sm">
                                        <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Location</span>
                                        {[agent.city, agent.state, agent.country].filter(Boolean).join(', ') || 'Available Worldwide'}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-gray-300 group/item p-3 rounded-xl hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-pink-400 group-hover/item:scale-110 transition-transform">
                                        <FiMail />
                                    </div>
                                    <div className="text-sm">
                                        <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Email</span>
                                        <a href={`mailto:${agent.email}`} className="hover:text-white transition-colors break-all">{agent.email}</a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-gray-300 group/item p-3 rounded-xl hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-emerald-400 group-hover/item:scale-110 transition-transform">
                                        <FiPhone />
                                    </div>
                                    <div className="text-sm">
                                        <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Phone</span>
                                        <a href={`tel:${agent.contact}`} className="hover:text-white transition-colors">{agent.contact}</a>
                                    </div>
                                </div>
                            </div>

                            {agent.bio && (
                                <div className="bg-dark-950/30 rounded-2xl p-6 border border-white/5">
                                    <h3 className="text-white font-serif text-lg mb-3 flex items-center gap-2">
                                        <FiUser className="text-cyan-400" /> About Agent
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed text-sm">{agent.bio}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Agent Properties */}
                <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-6">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-2">Properties Documented</h2>
                        <p className="text-gray-400 text-sm">Explore the premium portfolio curated by {agent.name}</p>
                    </div>
                    <div className="hidden md:block text-xs text-gray-500 font-mono">
                        Showing {properties.length} Results
                    </div>
                </div>

                {properties.length === 0 ? (
                    <div className="bg-dark-900/50 rounded-3xl p-16 text-center border border-white/5 border-dashed">
                        <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiHome className="text-gray-600 text-3xl" />
                        </div>
                        <h3 className="text-xl text-white font-medium mb-2">No Listings Available</h3>
                        <p className="text-gray-500 max-w-md mx-auto">This agent currently has no active property listings. Please check back later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map((property, idx) => (
                            <motion.div
                                key={property._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <PropertyCard property={property} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentProfile;
