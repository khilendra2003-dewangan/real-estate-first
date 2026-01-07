import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiHome, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { authAPI } from '../../api/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await authAPI.login(formData);
            toast.success(data.message);
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || 'Login failed';
            toast.error(msg);
            setFormData({ ...formData, error: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-950 flex flex-col lg:flex-row">
            {/* Left Side - Image & Brand (Hidden on mobile) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
            >
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Luxury Home"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-dark-950/90 via-dark-900/60 to-transparent" />
                </div>

                <div className="relative z-10">
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all">
                            <FiHome className="text-white text-xl" />
                        </div>
                        <span className="text-2xl font-serif font-bold text-white tracking-wide">
                            Real<span className="text-cyan-400">Estate</span>Pro
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
                        Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">sweet home</span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-gray-300 text-lg leading-relaxed mb-8"
                    >
                        Discover curated luxury properties and connect with top-tier agents. Your journey to the perfect home starts here.
                    </motion.p>
                    <div className="flex gap-2">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 40 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="h-1 bg-cyan-500 rounded-full"
                        />
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 10 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="h-1 bg-white/20 rounded-full"
                        />
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 10 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="h-1 bg-white/20 rounded-full"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
                {/* Mobile Background Ambience */}
                <div className="lg:hidden absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="bg" className="w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0 bg-dark-950/90" />
                </div>

                {/* Animated Orbs */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="text-center lg:text-left mb-10">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <FiHome className="text-white text-xl" />
                            </div>
                            <span className="text-2xl font-serif font-bold text-white">RealEstatePro</span>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-3">Welcome Back!</h2>
                        <p className="text-gray-400">Please enter your details to sign in.</p>

                        {formData.error && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                            >
                                {formData.error}
                            </motion.div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur transition-opacity duration-300 ${focusedInput === 'email' ? 'opacity-20' : 'opacity-0'}`} />
                                <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-center transition-colors group-hover:border-white/20">
                                    <div className="pl-4 text-gray-500">
                                        <FiMail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('email')}
                                        onBlur={() => setFocusedInput(null)}
                                        className="w-full bg-transparent border-none text-white px-4 py-3.5 focus:ring-0 placeholder-gray-600"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
                            <div className="relative group">
                                <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur transition-opacity duration-300 ${focusedInput === 'password' ? 'opacity-20' : 'opacity-0'}`} />
                                <div className="relative bg-dark-900 border border-white/10 rounded-xl flex items-center transition-colors group-hover:border-white/20">
                                    <div className="pl-4 text-gray-500">
                                        <FiLock size={20} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('password')}
                                        onBlur={() => setFocusedInput(null)}
                                        className="w-full bg-transparent border-none text-white px-4 py-3.5 focus:ring-0 placeholder-gray-600"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="pr-4 text-gray-500 hover:text-white transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="rounded border-gray-600 bg-dark-800 text-cyan-500 focus:ring-cyan-500/20" />
                                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                                Forgot Password?
                            </Link>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-dark-950 font-bold py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-dark-950/30 border-t-dark-950 rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In <FiArrowRight />
                                </>
                            )}
                        </motion.button>


                    </form>

                    <p className="mt-8 text-center text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-white font-bold hover:underline decoration-cyan-500 decoration-2 underline-offset-4 cursor-none">
                            Register
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
