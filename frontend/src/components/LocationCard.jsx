import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';

const LocationCard = ({ name, count, img }) => {
    const ref = useRef(null);

    // Mouse position for parallax effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring animation for mouse movement
    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set((clientX - left) / width - 0.5);
        y.set((clientY - top) / height - 0.5);
    }

    const onMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Dynamic transform templates for parallax
    const transform = useMotionTemplate`perspective(1000px) rotateX(${mouseY}deg) rotateY(${mouseX}deg)`;
    const backgroundTransform = useMotionTemplate`scale(1.1) translateX(${mouseX}px) translateY(${mouseY}px)`;

    // Premium Image Overrides for demo/specific cities to ensure quality
    const premiumImages = {
        'durg': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop', // Luxury home generic
        'bhilai': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop', // Luxury villa generic
        'abu dhabi': 'https://images.unsplash.com/photo-1512453979798-5ea904f18427?q=80&w=800&auto=format&fit=crop', // Actual Abu Dhabi
        'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea904f18427?q=80&w=800&auto=format&fit=crop',
        'london': 'https://images.unsplash.com/photo-1513635269975-59663e0acad2',
        'new york': 'https://images.unsplash.com/photo-1496442226666-8d4a0e29e128',
    };

    const displayImg = premiumImages[name?.toLowerCase()] || img;

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                transform
            }}
            className="group relative h-[420px] w-full rounded-[2rem] bg-dark-900 overflow-hidden cursor-pointer border border-white/5 shadow-2xl"
        >
            {/* Background Image with Parallax */}
            <motion.div
                style={{
                    transform: backgroundTransform,
                    scale: 1.15
                }}
                className="absolute inset-0 h-full w-full"
            >
                <img
                    src={displayImg}
                    alt={name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop';
                    }}
                />
                {/* Gradient Overlay - Cleaner and darker at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-70" />
            </motion.div>

            {/* Content Area - Minimalist & Premium */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 translate-z-20">

                <div className="transform transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-2 group-hover:translate-y-0">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-cyan-400">
                            <FiMapPin className="w-3 h-3" />
                        </span>
                        <span className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">Explore City</span>
                    </div>

                    <h3 className="text-3xl font-serif font-bold text-white mb-2 tracking-tight group-hover:text-cyan-50 transition-colors">
                        {name}
                    </h3>

                    <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                        <span className="text-gray-300 text-sm font-medium tracking-wide">
                            {count} Premium Properties
                        </span>

                        <motion.div
                            whileHover={{ x: 5 }}
                            className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm"
                        >
                            <FiArrowRight className="text-white text-lg" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Shine Effect on Hover */}
            <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none" />

        </motion.div>
    );
};

export default LocationCard;
