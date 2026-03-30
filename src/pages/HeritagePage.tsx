import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { useRef } from 'react';
import '../styles/heritage-page.css';

const HeritagePage = () => {
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
        <div className="heritage-container">
            {/* Cinematic Hero Segment */}
            <section ref={ref} className="heritage-hero">
                <motion.div
                    className="hero-bg-wrapper"
                    style={{ y: yBackground, opacity: opacityBackground, scale: scaleBackground }}
                >
                    <div 
                        className="hero-bg-image" 
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590725140246-20bfdc7bd8bb?q=80&w=2564&auto=format&fit=crop')" }} 
                    />
                    <div className="hero-bg-overlay" />
                </motion.div>

                <div className="relative z-10">
                    <motion.div
                        custom={0} initial="hidden" animate="visible" variants={fadeUp}
                        className="flex items-center justify-center gap-4 mb-8"
                    >
                        <div className="h-px w-10 bg-[#00f2ff]" />
                        <span className="text-[#00f2ff] tracking-[0.3em] uppercase text-xs sm:text-sm font-semibold">Our Legacy</span>
                        <div className="h-px w-10 bg-[#00f2ff]" />
                    </motion.div>

                    <motion.h1
                        className="heritage-hero-title text-gradient px-4"
                        custom={1} initial="hidden" animate="visible" variants={fadeUp}
                    >
                        The Vertex Heritage
                    </motion.h1>

                    <motion.p
                        className="heritage-hero-sub px-6"
                        custom={2} initial="hidden" animate="visible" variants={fadeUp}
                    >
                        Forged at the intersection of timeless craftsmanship and innovative digital design. A new standard for global commerce.
                    </motion.p>
                </div>
            </section>

            {/* The Genesis Segment */}
            <section className="heritage-section">
                <div className="genesis-grid">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-8"
                    >
                        <h2 className="genesis-title">
                            The Architecture<br className="hidden md:block" /> of Excellence
                        </h2>
                        <div className="w-10 h-px bg-[#00f2ff] opacity-40 mb-8" />
                        <p className="genesis-text">
                            Vertex was established with a singular, unyielding vision: to architect a commerce environment that completely dismantles the friction between luxury acquisition and digital convenience. Most platforms view these as inherently opposing forces. We view them as necessary counterparts.
                        </p>
                        <p className="genesis-text">
                            To achieve this, we bypassed conventional retail systems, building a bespoke digital platform from the ground up. Every algorithm and delivery network has been optimized to ensure the experience of securing rare artifacts feels as effortless as the items themselves.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <div className="genesis-image-wrapper">
                            <div className="genesis-image-main">
                                <img 
                                    src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop" 
                                    alt="Architecture" 
                                    className="object-cover w-full h-full opacity-60 mix-blend-luminosity filter grayscale" 
                                />
                                <div className="absolute inset-0 border border-white/5 pointer-events-none" />
                            </div>
                            <div className="genesis-image-offset" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Uncompromising Craft Segment */}
            <section className="curation-section heritage-section">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center mb-20 px-4"
                >
                    <h2 className="genesis-title">
                        Uncompromising Curation
                    </h2>
                    <p className="genesis-text max-w-2xl mx-auto mt-6">
                        The Vertex catalog is not merely assembled; it is rigorously vetted. We maintain an acceptance rate of less than 2% for global suppliers, ensuring that every asset available on our network meets an elite threshold for material provenance and ethical craftsmanship.
                    </p>
                </motion.div>

                <div className="curation-grid">
                    {[
                        { img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=2000", title: "Precision Hardware", desc: "Every electronic device and luxury accessory undergoes rigorous stress testing to meet our exacting standards for durability and performance." },
                        { img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=2000", title: "Advanced Textiles", desc: "From 14oz Japanese raw selvedge denim to ethically sourced extra-fine merino wool, our apparel is constructed from the globe's finest raw materials." },
                        { img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=2000", title: "Digital Ecosystems", desc: "Our premium software subscriptions and digital services are built on zero-knowledge encryption and global, lightning-fast server architectures." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.15 }}
                            viewport={{ once: true, margin: "-50px" }}
                            className="group"
                        >
                            <div className="aspect-[3/4] mb-6 overflow-hidden border border-white/5">
                                <img 
                                    src={item.img} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105" 
                                />
                            </div>
                            <h3 className="card-title">{item.title}</h3>
                            <p className="card-text">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HeritagePage;

