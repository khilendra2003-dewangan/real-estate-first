import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiHome, FiDollarSign, FiMap, FiBox, FiBell, FiArrowRight, FiStar, FiUsers, FiCheckCircle, FiPlay, FiTrendingUp, FiChevronDown } from 'react-icons/fi';
import { motion, useScroll, useTransform } from 'framer-motion';
// Hero background image - luxury home with pool
const HERO_BG_URL = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop';
import { propertyAPI, categoryAPI, locationAPI } from '../api/api';
import PropertyCard from '../components/property/PropertyCard';
import LocationCard from '../components/LocationCard';

const howItWorks = [
    { step: '01', title: 'Search Properties', desc: 'Browse through our extensive collection of premium properties using advanced filters.' },
    { step: '02', title: 'Schedule a Visit', desc: 'Book a visit to see your favorite properties with our verified agents.' },
    { step: '03', title: 'Make It Yours', desc: 'Complete the paperwork and move into your dream home.' },
];

const testimonials = [
    { name: 'Sarah Johnson', role: 'Homeowner', rating: 5, text: 'Found my dream home within a week! The process was smooth and the agents were incredibly helpful.' },
    { name: 'Michael Chen', role: 'Property Investor', rating: 5, text: 'Best platform for real estate investment. The analytics and market insights are invaluable.' },
    { name: 'Emily Davis', role: 'First-time Buyer', rating: 5, text: 'As a first-time buyer, I was nervous but the team guided me through every step. Highly recommend!' },
];

const Home = () => {
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const heroRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [propertiesRes, categoriesRes, locationsRes] = await Promise.all([
                propertyAPI.getFeatured(3),
                categoryAPI.getAll(),
                locationAPI.getAll()
            ]);
            setFeaturedProperties(propertiesRes.data.properties || []);
            setCategories(categoriesRes.data.categories || []);
            setLocations(locationsRes.data.locations || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };



    const features = [
        { icon: FiMap, title: 'Smart Heatmaps', desc: 'Visualize price trends and safe neighborhoods instantly.' },
        { icon: FiBox, title: 'Virtual Tours', desc: 'Step inside your future home without leaving your couch.' },
        { icon: FiBell, title: 'Instant Alerts', desc: 'Be the first to know when your dream home hits the market.' },
    ];

    // Premium Smooth Easing
    const transition = { duration: 1.4, ease: [0.22, 1, 0.36, 1] };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { ...transition, duration: 1.2 }
        }
    };

    return (
        <div className="min-h-screen bg-dark-950 text-white">

            {/* HERO SECTION */}
            <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
                <motion.div
                    style={{ y: backgroundY, scale: backgroundScale }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src={HERO_BG_URL}
                        alt="Luxury Home"
                        className="w-full h-full object-cover"
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-dark-950/95 via-dark-950/70 to-dark-950/40"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-dark-950/30"></div>
                </motion.div>

                {/* Animated Particles */}
                <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -100, 0],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 5,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>

                {/* Hero Content */}
                <motion.div
                    style={{ y: textY, opacity }}
                    className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center"
                >
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 backdrop-blur-sm mb-6"
                            >
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                                <span className="text-cyan-400 text-sm font-medium tracking-wide">Premium Real Estate Platform</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight"
                            >
                                <span className="text-white drop-shadow-lg">Find Your Place</span>
                                <br />
                                <span className="bg-gradient-to-r from-cyan-300 via-white to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
                                    To Call Home
                                </span>
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="text-base sm:text-lg text-gray-200 mb-10 max-w-xl mx-auto leading-relaxed drop-shadow-md font-light tracking-wide"
                            >
                                Discover curated listings, verified buyers & expert guidance for your next property journey.
                            </motion.p>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="flex flex-col sm:flex-row justify-center gap-6 items-center"
                            >
                                <Link to="/properties">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="relative px-8 py-3 rounded-full font-semibold overflow-hidden group shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-sky-600 to-sky-900"></div>
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-cyan-400/40 blur-md rounded-full group-hover:bg-cyan-300/50 transition-colors"></div>
                                        <div className="absolute inset-0 border border-sky-400/30 rounded-full"></div>
                                        <span className="relative flex items-center gap-3 text-white text-lg tracking-wide">
                                            <FiHome className="text-xl" />
                                            Explore Listings
                                        </span>
                                    </motion.button>
                                </Link>
                                <Link to="/contact">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="relative px-8 py-3 rounded-full font-semibold overflow-hidden group transition-all"
                                    >
                                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"></div>
                                        <div className="absolute inset-0 border border-white/20 group-hover:border-white/40 rounded-full transition-colors"></div>
                                        <span className="relative text-white text-lg tracking-wide">
                                            Contact Agent
                                        </span>
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Bottom Fade */}
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-dark-950 to-transparent pointer-events-none z-10"></div>
            </section>



            {/* SECTION 5: Cities - 3D Cards */}
            <section className="py-24 bg-dark-900 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Find Properties in your Favorite City</h2>
                        <p className="text-gray-400">"Experience a new era of living"</p>
                    </motion.div>

                    {/* Marquee Container for Cities */}
                    <div className="relative w-full overflow-hidden mask-gradient-x">
                        <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused] w-max px-4 py-8">
                            {[...locations, ...locations, ...locations].map((city, idx) => (
                                <div key={`${city._id}-${idx}`} className="w-[300px] md:w-[350px] flex-shrink-0">
                                    <LocationCard
                                        name={city.name}
                                        img={city.image}
                                        count={city.propertyCount}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: Categories - Premium Image Cards with 3D Effect */}
            <section className="py-24 bg-dark-900/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Browse by Category</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Find properties that match your lifestyle</p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
                    >
                        {categories.map((cat) => {
                            // Static Image Mapping
                            const images = {
                                'flat': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop',
                                'apartment': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop',
                                'villa': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000&auto=format&fit=crop',
                                'house': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop',
                                'commercial': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop',
                                'plot': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop',
                                'farmhouse': 'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=1000&auto=format&fit=crop'
                            };

                            // Fallback based on name if slug doesn't match
                            const getBgImage = (name, slug) => {
                                const key = slug?.toLowerCase() || name?.toLowerCase();
                                if (key.includes('flat') || key.includes('apartment')) return images.flat;
                                if (key.includes('villa')) return images.villa;
                                if (key.includes('house')) return images.house;
                                if (key.includes('commercial') || key.includes('office')) return images.commercial;
                                if (key.includes('plot') || key.includes('land')) return images.plot;
                                if (key.includes('farm')) return images.farmhouse;
                                return images.house; // fallback
                            };

                            const bgImage = getBgImage(cat.name, cat.slug);

                            return (
                                <motion.div key={cat._id} variants={itemVariants}>
                                    <Link to={`/properties?category=${cat._id}`} className="block h-full perspective-1000">
                                        <motion.div
                                            whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5, z: 50 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className="group relative h-64 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl transform-style-3d"
                                        >
                                            {/* Background Image */}
                                            <div className="absolute inset-0">
                                                <img
                                                    src={bgImage}
                                                    alt={cat.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-900/20 to-transparent group-hover:via-dark-900/40 transition-colors" />
                                            </div>

                                            {/* Content */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 z-10">
                                                <h3 className="text-xl font-bold text-white mb-2 translate-y-0 group-hover:-translate-y-2 transition-transform duration-300 drop-shadow-lg text-center">{cat.name}</h3>
                                                <div className="h-1 w-0 bg-cyan-400 rounded-full group-hover:w-12 transition-all duration-300" />
                                            </div>

                                            {/* 3D Shine Effect */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none" />
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* SECTION 2: Features */}
            <section className="py-20 bg-dark-950 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {features.map((feature, idx) => (
                            <motion.div key={idx} variants={itemVariants} className="perspective-1000 h-full">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5, z: 50 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="flex items-start gap-5 p-8 bg-dark-900/40 backdrop-blur-lg rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-300 group h-full transform-style-3d shadow-xl relative overflow-hidden"
                                >
                                    {/* 3D Shine Effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none z-50" />

                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:bg-white/10 transition-colors">
                                        <feature.icon className="text-white text-xl" />
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-white font-serif text-xl mb-2 translate-z-10 group-hover:translate-z-20">{feature.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed font-light">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* SECTION 3: Featured Properties */}
            <section className="py-24 relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4"
                    >
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Properties</h2>
                            <p className="text-gray-500">Handpicked properties for you</p>
                        </div>
                        <Link
                            to="/properties"
                            className="flex items-center gap-2 text-white hover:text-cyan-300 font-medium transition-colors group px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 backdrop-blur-md"
                        >
                            View All
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-dark-800/50 rounded-2xl overflow-hidden animate-pulse">
                                    <div className="h-48 bg-dark-700"></div>
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 bg-dark-700 rounded w-3/4"></div>
                                        <div className="h-4 bg-dark-700 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {featuredProperties.map((property) => (
                                <motion.div key={property._id} variants={itemVariants}>
                                    <PropertyCard property={property} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* SECTION 5: How It Works */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Simple steps to find your dream home</p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {howItWorks.map((item, idx) => (
                            <motion.div key={idx} variants={itemVariants} className="perspective-1000 h-full">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5, z: 50 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="relative p-8 bg-dark-900/40 backdrop-blur-xl rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-300 group overflow-hidden h-full transform-style-3d shadow-xl"
                                >
                                    {/* 3D Shine Effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none z-50" />

                                    <span className="absolute top-4 right-6 text-8xl font-serif font-bold text-white/5 group-hover:text-white/10 transition-colors pointer-events-none transform translate-z-0 group-hover:translate-z-10 duration-500">
                                        {item.step}
                                    </span>
                                    <div className="relative z-10 text-center transform-style-3d">
                                        <h3 className="text-xl font-serif text-white mb-3 tracking-wide translate-z-0 group-hover:translate-z-10 transition-transform duration-300">{item.title}</h3>
                                        <p className="text-gray-400 leading-relaxed text-sm font-light">{item.desc}</p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>



            {/* SECTION 7: Latest Listings */}
            <section className="py-24 bg-dark-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Latest Listings</h2>
                            <p className="text-gray-500">Fresh properties just added</p>
                        </div>
                        <Link
                            to="/properties"
                            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors group"
                        >
                            Browse All
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {featuredProperties.slice(0, 3).map((property) => (
                            <motion.div key={property._id} variants={itemVariants}>
                                <PropertyCard property={property} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* SECTION 8: Testimonials - Moving Marquee */}
            <section className="py-24 relative overflow-hidden bg-dark-950">
                <div className="absolute left-0 top-1/4 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">What Our Clients Say</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto font-light">Trusted by thousands of happy customers</p>
                    </motion.div>
                </div>

                {/* Marquee Container */}
                <div className="relative w-full overflow-hidden mask-gradient-x">
                    <div className="flex gap-8 animate-marquee hover:[animation-play-state:paused] w-max px-4">
                        {[...testimonials, ...testimonials, ...testimonials].map((t, idx) => (
                            <div key={idx} className="w-[350px] md:w-[400px] flex-shrink-0">
                                <div className="h-full p-8 bg-dark-900/60 backdrop-blur-xl rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-300 transform hover:scale-[1.02] shadow-xl relative overflow-hidden group">
                                    {/* 3D Shine Effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none z-50"></div>

                                    <div className="flex gap-1 mb-6">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <FiStar key={i} className="text-amber-300 fill-amber-300 w-4 h-4" />
                                        ))}
                                    </div>
                                    <p className="text-gray-200 mb-8 text-lg leading-relaxed font-serif italic relative z-10">"{t.text}"</p>
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                                            <span className="text-white font-serif font-bold">{t.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{t.name}</div>
                                            <div className="text-gray-500 text-sm tracking-wide uppercase">{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 9: CTA Banner */}
            <section className="py-24 bg-dark-950">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 perspective-1000">
                    <motion.div
                        initial="initial"
                        whileInView="visible"
                        whileHover="hover"
                        viewport={{ once: true }}
                        variants={{
                            initial: { opacity: 0, y: 20, rotateX: 0, rotateY: 0, z: 0 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
                            hover: {
                                scale: 1.02,
                                rotateX: 2,
                                rotateY: 2,
                                z: 30,
                                transition: { type: "spring", stiffness: 300, damping: 20 }
                            }
                        }}
                        className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/5 transform-style-3d group"
                    >
                        {/* 3D Shine Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none z-50" />
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
                                alt="CTA Background"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-dark-900/40"></div>
                        </div>

                        <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center">
                            <div className="max-w-2xl mx-auto">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight"
                                >
                                    Ready to Find Your Dream Home?
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-lg text-gray-300 mb-10 font-light"
                                >
                                    Join thousands of happy homeowners who found their perfect property with us.
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex flex-col sm:flex-row gap-4 justify-center"
                                >
                                    <Link
                                        to="/signup"
                                        className="inline-flex items-center justify-center gap-2 bg-white text-dark-900 font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:bg-gray-100 transform hover:scale-[1.02] shadow-lg shadow-white/10"
                                    >
                                        Get Started Free <FiArrowRight />
                                    </Link>
                                    <Link
                                        to="/properties"
                                        className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 border border-white/10 backdrop-blur-sm"
                                    >
                                        Browse Properties
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 9.5: Luxury Gallery - Premium Moving Grid */}
            <section className="py-24 bg-dark-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/10 to-dark-950 pointer-events-none z-10" />

                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
                            Visual Masterpieces
                        </h2>
                    </motion.div>
                </div>

                {/* Marquee Rows Container - Straight Layout */}
                <div className="relative flex flex-col gap-8">

                    {/* Row 1 - Moving Left */}
                    <div className="flex relative overflow-hidden mask-gradient-x select-none">
                        <div className="flex gap-6 animate-marquee w-max hover:[animation-play-state:paused]">
                            {[
                                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
                                'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
                                'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
                                'https://images.unsplash.com/photo-1600607687644-c7171b42498b',
                                'https://images.unsplash.com/photo-1600585154526-990dced4db0d',
                                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
                                'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
                                'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
                                'https://images.unsplash.com/photo-1600607687644-c7171b42498b',
                                'https://images.unsplash.com/photo-1600585154526-990dced4db0d',
                            ].concat([
                                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
                                'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
                                'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
                                'https://images.unsplash.com/photo-1600607687644-c7171b42498b',
                                'https://images.unsplash.com/photo-1600585154526-990dced4db0d',
                                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
                                'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
                                'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
                                'https://images.unsplash.com/photo-1600607687644-c7171b42498b',
                                'https://images.unsplash.com/photo-1600585154526-990dced4db0d',
                            ]).map((img, idx) => (
                                <div key={`r1-${idx}`} className="relative w-[280px] h-[180px] md:w-[320px] md:h-[220px] shrink-0 rounded-2xl overflow-hidden group border border-white/5 mx-2">
                                    <img src={`${img}?q=80&w=600&auto=format&fit=crop`} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-dark-950/20 group-hover:bg-transparent transition-colors duration-300" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Row 2 - Moving Right */}
                    <div className="flex relative overflow-hidden mask-gradient-x select-none">
                        <div className="flex gap-6 animate-marquee-reverse w-max hover:[animation-play-state:paused]">
                            {[
                                'https://images.unsplash.com/photo-1600573472592-401b489a3cdc',
                                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
                                'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
                                'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea',
                                'https://images.unsplash.com/photo-1600585152220-90363fe7e115',
                                'https://images.unsplash.com/photo-1600573472592-401b489a3cdc',
                                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
                                'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
                                'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea',
                                'https://images.unsplash.com/photo-1600585152220-90363fe7e115',
                            ].concat([
                                'https://images.unsplash.com/photo-1600573472592-401b489a3cdc',
                                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
                                'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
                                'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea',
                                'https://images.unsplash.com/photo-1600585152220-90363fe7e115',
                                'https://images.unsplash.com/photo-1600573472592-401b489a3cdc',
                                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
                                'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
                                'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea',
                                'https://images.unsplash.com/photo-1600585152220-90363fe7e115',
                            ]).map((img, idx) => (
                                <div key={`r2-${idx}`} className="relative w-[280px] h-[180px] md:w-[320px] md:h-[220px] shrink-0 rounded-2xl overflow-hidden group border border-white/5 mx-2">
                                    <img src={`${img}?q=80&w=600&auto=format&fit=crop`} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-dark-950/20 group-hover:bg-transparent transition-colors duration-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            <section className="py-24 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 perspective-1000">
                    <motion.div
                        initial="initial"
                        whileInView="visible"
                        whileHover="hover"
                        viewport={{ once: true }}
                        variants={{
                            initial: { opacity: 0, scale: 0.95, rotateX: 0, rotateY: 0, z: 0 },
                            visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
                            hover: {
                                scale: 1.02,
                                rotateX: 2,
                                rotateY: 2,
                                z: 30,
                                transition: { type: "spring", stiffness: 300, damping: 20 }
                            }
                        }}
                        className="relative rounded-[2.5rem] p-[1px] bg-gradient-to-br from-cyan-400/30 via-purple-500/30 to-pink-500/30 shadow-2xl overflow-hidden transform-style-3d group"
                    >
                        {/* 3D Shine Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none z-50" />
                        {/* Inner Content Card */}
                        <div className="relative bg-dark-900/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-16 text-center overflow-hidden">

                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

                            {/* Floating Icons */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 right-10 text-cyan-400/20 hidden md:block"
                            >
                                <FiBell className="w-24 h-24 rotate-12" />
                            </motion.div>

                            <div className="relative z-10 max-w-2xl mx-auto">
                                <h2 className="text-3xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-6 tracking-tight">
                                    Unlock Exclusive Deals
                                </h2>
                                <p className="text-gray-300 mb-10 text-lg md:text-xl font-light leading-relaxed">
                                    Join our exclusive community to receive early access to premium listings and expert market insights directly in your inbox.
                                </p>

                                <form className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto bg-white/5 border border-white/10 rounded-full p-1.5 backdrop-blur-md focus-within:ring-2 focus-within:ring-cyan-400/50 transition-all shadow-lg">
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="flex-1 bg-transparent border-none rounded-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-0 text-base"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-cyan-500/30 flex items-center justify-center gap-2"
                                    >
                                        Subscribe
                                    </motion.button>
                                </form>
                                <p className="text-gray-500 text-xs mt-6">
                                    No spam, ever. Unsubscribe anytime.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
