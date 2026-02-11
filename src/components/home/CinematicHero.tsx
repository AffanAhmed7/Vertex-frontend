import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const CinematicHero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacityBackground = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const scaleBackground = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1.2,
                delay: 0.3 + i * 0.2,
                ease: [0.16, 1, 0.3, 1] as any
            }
        })
    };

    return (
        <section ref={ref} className="cinematic-hero">
            {/* Immersive Background Layer */}
            <motion.div
                className="hero-bg-wrapper"
                style={{ y: yBackground, opacity: opacityBackground, scale: scaleBackground }}
            >
                <div className="hero-bg-image" />
                <div className="hero-bg-overlay" />
            </motion.div>

            {/* Content Layer */}
            <div className="hero-overlay">
                <motion.h1
                    className="hero-headline text-gradient"
                    custom={0}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                >
                    Vertex: The Pinnacle of Modern Living
                </motion.h1>

                <motion.p
                    className="hero-subheading"
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                >
                    Experience a meticulously curated selection of world-class essentials,
                    redefined for the global connoisseur.
                </motion.p>

                <motion.div
                    className="hero-ctas"
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                >
                    <Link to="/shop" className="cta-btn cta-primary shadow-glow">Begin Exploration</Link>
                    <button className="cta-btn cta-secondary">Our Heritage</button>
                </motion.div>
            </div>

            {/* Floating Visual Accent */}
            <motion.div
                className="hero-visual-accent"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="accent-bloom" />
            </motion.div>

            <div className="hero-scroll-indicator">
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="scroll-dot"
                />
            </div>
        </section>
    );
};

export default CinematicHero;
