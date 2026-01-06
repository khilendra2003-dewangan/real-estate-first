import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiSend, FiArrowRight, FiUser, FiMail, FiPhone, FiCheck, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { inquiryAPI } from '../../api/api';

const HERO_BG_URL = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop';

const AgentInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responseText, setResponseText] = useState({});
    const heroRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const { data } = await inquiryAPI.getAgentInquiries({ limit: 50 });
            setInquiries(data.inquiries || []);
        } catch (error) {
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (id) => {
        if (!responseText[id]?.trim()) return;

        try {
            await inquiryAPI.respond(id, responseText[id]);
            setInquiries(inquiries.map((i) =>
                i._id === id ? { ...i, status: 'responded', response: responseText[id] } : i
            ));
            setResponseText({ ...responseText, [id]: '' });
            toast.success('Response sent successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send response');
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
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
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
                            Customer Inquiries
                        </h1>
                        <p className="text-gray-400 text-lg font-light max-w-xl">
                            Respond to potential buyers and manage your communications.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 animate-pulse text-sm uppercase tracking-wider">Loading messages...</p>
                    </div>
                ) : inquiries.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-24 bg-dark-900/40 backdrop-blur-sm rounded-3xl border border-white/5 border-dashed"
                    >
                        <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-dark-900">
                            <FiMessageSquare className="text-4xl text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 font-serif">No inquiries yet</h3>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">Messages from interested buyers will appear here.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        <AnimatePresence>
                            {inquiries.map((inquiry) => (
                                <motion.div
                                    key={inquiry._id}
                                    variants={itemVariants}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-dark-900/60 backdrop-blur-md rounded-3xl border border-white/5 shadow-xl overflow-hidden group hover:border-white/10 transition-colors"
                                >
                                    <div className="flex flex-col lg:flex-row">
                                        {/* Property Sidebar - Desktop */}
                                        <div className="lg:w-72 bg-dark-950/30 border-b lg:border-b-0 lg:border-r border-white/5 p-6 flex flex-col gap-4">
                                            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                                <img
                                                    src={inquiry.property?.images?.[0]?.url || 'https://via.placeholder.com/300'}
                                                    alt={inquiry.property?.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                <Link to={`/property/${inquiry.property?._id}`} className="absolute bottom-2 left-2 right-2 text-xs text-white truncate font-medium hover:underline">
                                                    {inquiry.property?.title}
                                                </Link>
                                            </div>

                                            <div className="space-y-3 mt-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                                        <FiUser className="text-sm" />
                                                    </div>
                                                    <div className="text-sm font-medium text-white">{inquiry.contactName}</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                                        <FiMail className="text-sm" />
                                                    </div>
                                                    <div className="text-sm text-gray-400 truncate" title={inquiry.contactEmail}>{inquiry.contactEmail}</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                                        <FiPhone className="text-sm" />
                                                    </div>
                                                    <div className="text-sm text-gray-400">{inquiry.contactPhone}</div>
                                                </div>
                                            </div>

                                            <div className="mt-auto text-xs text-center text-gray-500 pt-4 border-t border-white/5">
                                                Received {new Date(inquiry.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {/* Conversation Area */}
                                        <div className="flex-1 p-6 lg:p-8 flex flex-col">
                                            {/* Message Bubble */}
                                            <div className="bg-dark-800/50 rounded-2xl p-5 mb-6 border border-white/5 relative self-start max-w-3xl">
                                                <div className="absolute -left-2 top-6 w-4 h-4 bg-dark-800/50 border-l border-b border-white/5 transform rotate-45"></div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Message</h4>
                                                <p className="text-gray-200 leading-relaxed text-sm md:text-base">"{inquiry.message}"</p>
                                            </div>

                                            {/* Response Area */}
                                            <div className="mt-auto">
                                                {inquiry.status === 'responded' ? (
                                                    <div className="bg-emerald-500/5 rounded-2xl p-5 border border-emerald-500/10 self-end ml-auto max-w-3xl relative">
                                                        <div className="absolute -right-2 top-6 w-4 h-4 bg-dark-900 border-r border-t border-emerald-500/10 transform rotate-45 z-0"></div>
                                                        <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl z-10 pointer-events-none"></div>
                                                        <div className="relative z-20">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <FiCheck className="text-emerald-400" />
                                                                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">You Responded</h4>
                                                            </div>
                                                            <p className="text-gray-300 text-sm md:text-base">{inquiry.response}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="relative group/input">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500"></div>
                                                        <div className="relative flex gap-3 bg-dark-950/50 p-2 rounded-2xl border border-white/10 group-focus-within/input:border-cyan-500/30 transition-colors">
                                                            <input
                                                                type="text"
                                                                value={responseText[inquiry._id] || ''}
                                                                onChange={(e) => setResponseText({ ...responseText, [inquiry._id]: e.target.value })}
                                                                placeholder="Type your response here..."
                                                                className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 px-4 py-3"
                                                            />
                                                            <button
                                                                onClick={() => handleRespond(inquiry._id)}
                                                                disabled={!responseText[inquiry._id]?.trim()}
                                                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2 rounded-xl font-semibold shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                                            >
                                                                <FiSend /> <span className="hidden sm:inline">Send</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AgentInquiries;
