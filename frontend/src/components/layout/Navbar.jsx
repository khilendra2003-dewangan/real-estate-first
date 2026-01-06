import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiHeart, FiUser, FiMenu, FiX, FiLogOut, FiGrid, FiPlus, FiSettings, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        setIsDropdownOpen(false);
        navigate('/');
    };

    const navLinks = [
        { name: 'Buy', path: '/buy' },
        { name: 'Rent', path: '/rent' },
        { name: 'Agents', path: '/agents' },
    ];

    const getDashboardLink = () => {
        if (!user) return '/login';
        switch (user.role) {
            case 'admin': return '/admin';
            case 'agent': return '/agent';
            default: return '/dashboard';
        }
    };

    const getRoleBadge = () => {
        if (!user) return null;
        const badges = {
            admin: { text: 'Admin', color: 'bg-red-500' },
            agent: { text: 'Agent', color: 'bg-green-500' },
            user: { text: 'User', color: 'bg-blue-500' }
        };
        return badges[user.role] || badges.user;
    };

    const dropdownVariants = {
        hidden: {
            opacity: 0,
            y: -10,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: {
                duration: 0.15
            }
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-dark-900/95 backdrop-blur-xl border-b border-dark-700/50 shadow-lg shadow-dark-950/20'
                : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <FiHome className="text-white text-xl" />
                        </div>
                        <span className="text-xl font-bold text-white">
                            Real<span className="text-cyan-400">Estate</span>Pro
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative text-sm font-medium transition-colors py-2 ${location.pathname === link.path
                                        ? 'text-cyan-400'
                                        : 'text-gray-300 hover:text-white'
                                    }`}
                            >
                                {link.name}
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            to="/properties"
                            className="p-2.5 text-gray-400 hover:text-white hover:bg-dark-800/50 rounded-xl transition-all"
                            title="Search Properties"
                        >
                            <FiSearch className="text-xl" />
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard/wishlist"
                                    className="p-2.5 text-gray-400 hover:text-white hover:bg-dark-800/50 rounded-xl transition-all relative"
                                    title="Wishlist"
                                >
                                    <FiHeart className="text-xl" />
                                </Link>

                                {/* User Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${isDropdownOpen
                                                ? 'bg-white/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                                                : 'bg-white/5 hover:bg-white/10 border-transparent hover:border-white/10'
                                            } border backdrop-blur-md`}
                                    >
                                        <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/25 transition-all">
                                            <span className="text-white text-sm font-bold">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="text-left hidden lg:block">
                                            <div className="text-white text-sm font-medium leading-none mb-1 group-hover:text-cyan-400 transition-colors">{user?.name?.split(' ')[0]}</div>
                                            <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">{user?.role}</div>
                                        </div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isDropdownOpen ? 'bg-white/10 text-cyan-400' : 'text-gray-400 group-hover:text-white'}`}>
                                            <FiChevronDown className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                variants={dropdownVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="absolute right-0 mt-3 w-72 py-1 bg-dark-900/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-white/5"
                                            >
                                                {/* User Info Header with Gradient */}
                                                <div className="relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 opacity-50"></div>
                                                    <div className="relative px-6 py-6 border-b border-white/5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-2 ring-black/20">
                                                                <span className="text-white text-xl font-bold">
                                                                    {user?.name?.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-white font-bold text-lg truncate">{user?.name}</div>
                                                                <div className="text-cyan-200/70 text-sm truncate font-medium">{user?.email}</div>
                                                                <div className="mt-2">
                                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-red-500/20 text-red-300 border border-red-500/20' :
                                                                            user.role === 'agent' ? 'bg-green-500/20 text-green-300 border border-green-500/20' :
                                                                                'bg-blue-500/20 text-blue-300 border border-blue-500/20'
                                                                        }`}>
                                                                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${user.role === 'admin' ? 'bg-red-400' :
                                                                                user.role === 'agent' ? 'bg-green-400' :
                                                                                    'bg-blue-400'
                                                                            }`}></span>
                                                                        {user.role} Account
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="p-2 space-y-1">
                                                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-widest pl-4">Menu</div>

                                                    <Link
                                                        to={getDashboardLink()}
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="group flex items-center gap-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                                                    >
                                                        <div className="w-10 h-10 bg-dark-800 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-all">
                                                            <FiGrid className="text-lg text-gray-400 group-hover:text-cyan-400 transition-colors" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-sm">Dashboard</div>
                                                            <div className="text-xs text-gray-500 group-hover:text-gray-400">Access your analytics</div>
                                                        </div>
                                                    </Link>

                                                    {user?.role === 'agent' && (
                                                        <Link
                                                            to="/agent/properties/new"
                                                            onClick={() => setIsDropdownOpen(false)}
                                                            className="group flex items-center gap-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                                                        >
                                                            <div className="w-10 h-10 bg-dark-800 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-green-500/30 group-hover:bg-green-500/10 transition-all">
                                                                <FiPlus className="text-lg text-gray-400 group-hover:text-green-400 transition-colors" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-semibold text-sm">Add Property</div>
                                                                <div className="text-xs text-gray-500 group-hover:text-gray-400">List a new home</div>
                                                            </div>
                                                        </Link>
                                                    )}

                                                    <Link
                                                        to={`${getDashboardLink()}`}
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="group flex items-center gap-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                                                    >
                                                        <div className="w-10 h-10 bg-dark-800 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-all">
                                                            <FiSettings className="text-lg text-gray-400 group-hover:text-purple-400 transition-colors" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-sm">Settings</div>
                                                            <div className="text-xs text-gray-500 group-hover:text-gray-400">Profile & preferences</div>
                                                        </div>
                                                    </Link>
                                                </div>

                                                {/* Logout */}
                                                <div className="p-2 mt-1 border-t border-white/5">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="group flex items-center gap-3 px-4 py-3 text-red-300/80 hover:text-red-200 hover:bg-red-500/10 w-full rounded-xl transition-all duration-200"
                                                    >
                                                        <div className="w-10 h-10 bg-red-500/5 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                                                            <FiLogOut className="text-lg group-hover:scale-110 transition-transform" />
                                                        </div>
                                                        <span className="font-bold text-sm">Sign Out</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20"
                            >
                                Log In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-white bg-dark-800/50 rounded-xl"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-dark-900/95 backdrop-blur-xl border-t border-dark-700/50"
                    >
                        <div className="px-4 py-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`block py-3 px-4 rounded-xl font-medium transition-colors ${location.pathname === link.path
                                            ? 'bg-cyan-500/10 text-cyan-400'
                                            : 'text-gray-300 hover:bg-dark-800/50 hover:text-white'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <hr className="border-dark-700/50 my-4" />

                            {isAuthenticated ? (
                                <>
                                    {/* User Info */}
                                    <div className="flex items-center gap-3 p-4 bg-dark-800/50 rounded-xl mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                                            <span className="text-white text-lg font-bold">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold">{user?.name}</div>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge()?.color} text-white`}>
                                                {getRoleBadge()?.text}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        to={getDashboardLink()}
                                        className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-dark-800/50 hover:text-white transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <FiGrid className="text-xl text-cyan-400" />
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/dashboard/wishlist"
                                        className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-dark-800/50 hover:text-white transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <FiHeart className="text-xl text-pink-400" />
                                        Wishlist
                                    </Link>
                                    {user?.role === 'agent' && (
                                        <Link
                                            to="/agent/properties/new"
                                            className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-300 hover:bg-dark-800/50 hover:text-white transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <FiPlus className="text-xl text-green-400" />
                                            Add Property
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                        className="flex items-center gap-3 py-3 px-4 rounded-xl text-red-400 hover:bg-red-500/10 w-full transition-colors"
                                    >
                                        <FiLogOut className="text-xl" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="block text-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Log In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
