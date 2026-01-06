import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiClock, FiSearch, FiShield, FiUser, FiArrowLeft, FiFilter, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { adminAPI } from '../../api/api';

const HERO_BG_URL = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2070&auto=format&fit=crop';

const ManageAgents = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [search, setSearch] = useState('');
    const [rejectModal, setRejectModal] = useState({ show: false, agentId: null, reason: '' });

    // Parallax Setup
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    useEffect(() => {
        fetchAgents();
    }, [filter, search]);

    const fetchAgents = async () => {
        setLoading(true);
        try {
            const params = { limit: 50 };
            if (filter !== 'all') params.isApproved = filter === 'approved' ? 'true' : 'false';
            if (search) params.search = search;

            const { data } = await adminAPI.getAgents(params);
            setAgents(data.agents || []);
        } catch (error) {
            console.error('Error fetching agents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await adminAPI.approveAgent(id);
            setAgents(agents.map((a) => (a._id === id ? { ...a, isApproved: true } : a)));
            toast.success('Agent approved successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Approval failed');
        }
    };

    const handleReject = async () => {
        if (!rejectModal.reason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }

        try {
            await adminAPI.rejectAgent(rejectModal.agentId, rejectModal.reason);
            setAgents(agents.map((a) =>
                a._id === rejectModal.agentId ? { ...a, isApproved: false, rejectionReason: rejectModal.reason } : a
            ));
            toast.success('Agent rejected');
            setRejectModal({ show: false, agentId: null, reason: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Rejection failed');
        }
    };

    return (
        <div className="min-h-screen bg-dark-950 text-white selection:bg-emerald-500/30">
            {/* Parallax Hero */}
            <div ref={heroRef} className="relative h-[350px] overflow-hidden">
                <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
                    <img src={HERO_BG_URL} alt="Agents Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-950/60 via-dark-950/80 to-dark-950"></div>
                </motion.div>

                <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Link to="/admin" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-4 group font-medium">
                            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 drop-shadow-xl">
                            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Agents</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl text-lg font-light">
                            Verify identities, review applications, and manage agent access permissions.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Main Content Helper */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-20">
                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
                >
                    <div className="relative w-full md:w-96">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search agents by name or email..."
                            className="w-full bg-black/20 text-white pl-11 pr-4 py-3 rounded-xl border border-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-gray-600"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="bg-black/20 p-1 rounded-xl border border-white/10 flex items-center">
                            {['all', 'pending', 'approved'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === f
                                            ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Agents List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                    </div>
                ) : agents.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 border-dashed"
                    >
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiUser className="text-3xl text-emerald-500/50" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Agents Found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {agents.map((agent, index) => (
                                <motion.div
                                    key={agent._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative bg-dark-900/50 hover:bg-white/5 backdrop-blur-md border border-white/5 hover:border-emerald-500/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/10"
                                >
                                    {/* Glass Highlight */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:via-emerald-500/5 rounded-2xl transition-all duration-500" />

                                    <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                                        {/* Avatar & Info */}
                                        <div className="flex items-center gap-5 flex-1">
                                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-emerald-500/20">
                                                {agent.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                                                    {agent.name}
                                                </h3>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-400 mt-1">
                                                    <span>{agent.email}</span>
                                                    <span className="hidden sm:inline w-1 h-1 bg-gray-600 rounded-full"></span>
                                                    <span className="text-gray-500">{agent.agencyName || 'Independent Agent'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-8 md:px-8 md:border-l md:border-r border-white/5">
                                            <div className="text-center md:text-left">
                                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Experience</div>
                                                <div className="text-white font-medium">{agent.experience || 0} Years</div>
                                            </div>
                                            <div className="text-center md:text-left">
                                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
                                                {agent.rejectionReason ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">
                                                        <FiXCircle /> Rejected
                                                    </span>
                                                ) : agent.isApproved ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                                                        <FiCheckCircle /> Approved
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 animate-pulse">
                                                        <FiClock /> Pending
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 md:justify-end min-w-[140px]">
                                            {!agent.isApproved && !agent.rejectionReason && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(agent._id)}
                                                        className="flex-1 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-sm font-semibold transition-all border border-emerald-500/20 hover:border-emerald-500/40"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => setRejectModal({ show: true, agentId: agent._id, reason: '' })}
                                                        className="px-3 py-2 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                                                        title="Reject"
                                                    >
                                                        <FiXCircle className="text-lg" />
                                                    </button>
                                                </>
                                            )}
                                            {(agent.isApproved || agent.rejectionReason) && (
                                                <div className="w-full text-right text-sm text-gray-500 italic">
                                                    {agent.rejectionReason ? 'Application Rejected' : 'Verified Agent'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {rejectModal.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setRejectModal({ show: false, agentId: null, reason: '' })}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-dark-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <FiShield className="text-3xl text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white text-center mb-2">Reject Application</h3>
                            <p className="text-gray-400 text-center mb-6">Are you sure you want to reject this agent? This action cannot be easily undone.</p>

                            <textarea
                                value={rejectModal.reason}
                                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-red-500/50 outline-none transition-colors mb-6 resize-none"
                                rows={4}
                                placeholder="Please provide specific feedback for the rejection..."
                            />

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setRejectModal({ show: false, agentId: null, reason: '' })}
                                    className="flex-1 py-3.5 rounded-xl font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="flex-1 py-3.5 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageAgents;
