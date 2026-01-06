import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FiHome, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { authAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();
    const email = location.state?.email;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [timer, setTimer] = useState(0);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
        inputRefs.current[0]?.focus();
    }, [email, navigate]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when complete
        if (newOtp.every((digit) => digit) && newOtp.join('').length === 6) {
            handleSubmit(newOtp.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = pastedData.split('');
        while (newOtp.length < 6) newOtp.push('');
        setOtp(newOtp);

        if (pastedData.length === 6) {
            handleSubmit(pastedData);
        }
    };

    const handleSubmit = async (otpString) => {
        setLoading(true);
        try {
            const { data } = await authAPI.verifyOtp({ email, otp: otpString });
            await login(data.user, data.token);
            toast.success('Login successful!');

            // Redirect based on role
            switch (data.user.role) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'agent':
                    navigate('/agent');
                    break;
                default:
                    navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        setLoading(true);
        try {
            await authAPI.resendOtp({ email });
            toast.success('OTP resent successfully');
            setTimer(60); // Start 60s timer
            setOtp(['', '', '', '', '', '']); // Clear inputs
            inputRefs.current[0]?.focus();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
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
                            Real<span className="text-cyan-400">Nest</span>
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
                        Secure your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">legacy</span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-gray-300 text-lg leading-relaxed mb-8"
                    >
                        Please verify your identity to access your exclusive real estate dashboard. Your privacy and security are our top priority.
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
                            <span className="text-2xl font-serif font-bold text-white">RealNest</span>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
                            <FiCheckCircle /> Verification Required
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">Confirm Identity</h2>
                        <p className="text-gray-400">
                            We've sent a 6-digit code to <span className="text-white font-medium">{email}</span>
                        </p>
                    </div>

                    <div className="flex gap-3 justify-center mb-8" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="relative w-12 h-16 sm:w-14 sm:h-16 group"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-xl blur transition-opacity duration-300 ${focusedIndex === index ? 'opacity-45' : 'opacity-0'}`} />
                                <input
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onFocus={() => setFocusedIndex(index)}
                                    onBlur={() => setFocusedIndex(null)}
                                    className="relative w-full h-full bg-dark-900 border border-white/10 rounded-xl text-center text-2xl font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-all shadow-lg"
                                    disabled={loading}
                                />
                            </motion.div>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSubmit(otp.join(''))}
                        disabled={loading || otp.join('').length !== 6}
                        className="w-full bg-white text-dark-950 font-bold py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mb-6"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-dark-950/30 border-t-dark-950 rounded-full animate-spin" />
                        ) : (
                            <>
                                Verify Securely <FiArrowRight />
                            </>
                        )}
                    </motion.button>

                    <p className="text-center text-gray-400">
                        Didn't receive the code?{' '}
                        <button
                            onClick={handleResend}
                            disabled={timer > 0 || loading}
                            className={`font-bold transition-colors decoration-2 underline-offset-4 ${timer > 0 || loading
                                    ? 'text-gray-600 cursor-not-allowed no-underline'
                                    : 'text-white hover:text-cyan-400 hover:underline decoration-cyan-500'
                                }`}
                        >
                            {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default VerifyOtp;
