import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiBriefcase, FiArrowRight, FiHome, FiAward, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { authAPI } from '../../api/api';

const Signup = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        contact: '',
        agencyName: '',
        licenseNumber: '',
        experience: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                contact: formData.contact,
                role,
                ...(role === 'agent' && {
                    agencyName: formData.agencyName,
                    licenseNumber: formData.licenseNumber,
                    experience: parseInt(formData.experience) || 0,
                }),
            };

            const { data } = await authAPI.signup(payload);
            toast.success(data.message);
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-950 flex flex-col lg:flex-row">
            {/* Left Side - Image (Sticky) - Hidden on mobile */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 sticky top-0 h-screen"
            >
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Modern Mansion"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-dark-950/90 via-dark-900/60 to-transparent" />
                </div>

                <div className="relative z-10">
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all">
                            <FiHome className="text-white text-xl" />
                        </div>
                        <span className="text-2xl font-serif font-bold text-white tracking-wide">
                            Real<span className="text-purple-400">Nest</span>
                        </span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-5xl font-serif font-bold text-white mb-6 leading-tight"
                    >
                        Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">future</span> of real estate
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-gray-300 text-lg leading-relaxed"
                    >
                        Create an account to save your favorite properties, get notified about new listings, and connect with agents instantly.
                    </motion.p>
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2">
                <div className="min-h-full flex items-center justify-center p-6 lg:p-12 relative">
                    {/* Mobile Background */}
                    <div className="lg:hidden absolute inset-0 z-0">
                        <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="bg" className="w-full h-full object-cover opacity-20" />
                        <div className="absolute inset-0 bg-dark-950/90" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-md relative z-10"
                    >
                        <div className="text-center lg:text-left mb-10">
                            {/* Mobile Logo */}
                            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                                    <FiHome className="text-white text-xl" />
                                </div>
                                <span className="text-2xl font-serif font-bold text-white">RealNest</span>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-3">Create an Account</h2>
                            <p className="text-gray-400">Start your journey with us today.</p>
                        </div>

                        {/* Role Switcher */}
                        <div className="bg-dark-900 border border-white/5 rounded-2xl p-1.5 flex mb-8">
                            <button
                                onClick={() => setRole('user')}
                                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${role === 'user'
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <FiUser /> Buyer / Renter
                            </button>
                            <button
                                onClick={() => setRole('agent')}
                                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${role === 'agent'
                                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <FiBriefcase /> Agent
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-center transition-colors group-hover:border-white/20 focus-within:border-purple-500/50">
                                            <div className="pl-4 text-gray-500"><FiUser /></div>
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-transparent border-none text-white px-3 py-3.5 focus:ring-0 placeholder-gray-600 text-sm" placeholder="John Doe" required minLength={3} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone</label>
                                    <div className="relative group">
                                        <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-center transition-colors group-hover:border-white/20 focus-within:border-purple-500/50">
                                            <div className="pl-4 text-gray-500"><FiPhone /></div>
                                            <input type="tel" name="contact" value={formData.contact} onChange={handleChange} className="w-full bg-transparent border-none text-white px-3 py-3.5 focus:ring-0 placeholder-gray-600 text-sm" placeholder="10-digit number" required pattern="[0-9]{10}" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-center transition-colors group-hover:border-white/20 focus-within:border-purple-500/50">
                                        <div className="pl-4 text-gray-500"><FiMail /></div>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-transparent border-none text-white px-4 py-3.5 focus:ring-0 placeholder-gray-600" placeholder="john@example.com" required />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group">
                                    <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-center transition-colors group-hover:border-white/20 focus-within:border-purple-500/50">
                                        <div className="pl-4 text-gray-500"><FiLock /></div>
                                        <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className="w-full bg-transparent border-none text-white px-4 py-3.5 focus:ring-0 placeholder-gray-600" placeholder="Min 8 chars" required minLength={8} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-4 text-gray-500 hover:text-white focus:outline-none">{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                                    </div>
                                </div>
                            </div>

                            {/* Agent-specific fields */}
                            {role === 'agent' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4 pt-2 border-t border-white/10"
                                >
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Agency Name</label>
                                        <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-center focus-within:border-cyan-500/50">
                                            <div className="pl-4 text-gray-500"><FiBriefcase /></div>
                                            <input type="text" name="agencyName" value={formData.agencyName} onChange={handleChange} className="w-full bg-transparent border-none text-white px-4 py-3.5 focus:ring-0 placeholder-gray-600" placeholder="Real Estate Co." />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative bg-dark-900 border border-white/10 rounded-xl p-0.5 focus-within:border-cyan-500/50">
                                            <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className="w-full bg-transparent border-none text-white px-4 py-3 focus:ring-0 placeholder-gray-600 text-sm" placeholder="License #" />
                                        </div>
                                        <div className="relative bg-dark-900 border border-white/10 rounded-xl p-0.5 focus-within:border-cyan-500/50">
                                            <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="w-full bg-transparent border-none text-white px-4 py-3 focus:ring-0 placeholder-gray-600 text-sm" placeholder="Yrs Exp." min="0" />
                                        </div>
                                    </div>
                                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 flex gap-3 items-start">
                                        <FiAward className="text-yellow-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-xs text-yellow-200/80 leading-relaxed">Agent accounts require admin verification. You will be notified via email once approved.</p>
                                    </div>
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4 ${role === 'agent' ? 'bg-cyan-500 hover:bg-cyan-600 text-white' : 'bg-white hover:bg-gray-100 text-dark-950'}`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Create Account <FiArrowRight />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <p className="mt-8 text-center text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-white font-bold hover:underline decoration-purple-500 decoration-2 underline-offset-4 cursor-none">
                                Sign In
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
