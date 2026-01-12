import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setIsVisible(true);

            // Check if hovering over clickable element
            const target = e.target;
            const isClickable = (
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'input' ||
                target.tagName.toLowerCase() === 'textarea' ||
                target.tagName.toLowerCase() === 'select' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('clickable') ||
                window.getComputedStyle(target).cursor === 'pointer'
            );
            setIsHovered(isClickable);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', moveCursor);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [cursorX, cursorY]);

    if (!isVisible) return null;

    return (
        <div className="hidden lg:block fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {/* Main Dot */}
            <motion.div
                className="absolute w-2.5 h-2.5 bg-cyan-400 rounded-full mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%'
                }}
            />

            {/* Trailing Ring */}
            <motion.div
                className="absolute rounded-full border border-cyan-400/50 mix-blend-screen"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                    width: isHovered ? 60 : 20,
                    height: isHovered ? 60 : 20,
                    backgroundColor: isHovered ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                    borderWidth: isHovered ? '2px' : '1px'
                }}
                transition={{
                    type: "tween",
                    ease: "backOut",
                    duration: 0.2
                }}
            />
        </div>
    );
};

export default CustomCursor;
