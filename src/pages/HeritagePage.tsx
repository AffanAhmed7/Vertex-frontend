import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { useRef } from 'react';
import '../styles/landing-page.css';

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
        <div className="landing-page" style={{ paddingTop: '80px' }}>
            {/* Cinematic Hero Segment */}
            <section ref={ref} className="cinematic-hero" style={{ height: '80vh' }}>
                <motion.div
                    className="hero-bg-wrapper"
                    style={{ y: yBackground, opacity: opacityBackground, scale: scaleBackground }}
                >
                    <div className="hero-bg-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590725140246-20bfdc7bd8bb?q=80&w=2564&auto=format&fit=crop')" }} />
                    <div className="hero-bg-overlay" />
                </motion.div>

                <div className="hero-overlay" style={{ padding: '0 2rem', maxWidth: '1200px' }}>
                    <motion.div
                        custom={0} initial="hidden" animate="visible" variants={fadeUp}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}
                    >
                        <div style={{ height: '1px', width: '40px', background: 'var(--lp-primary)' }} />
                        <span style={{ color: 'var(--lp-primary)', letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 600 }}>Our Legacy</span>
                        <div style={{ height: '1px', width: '40px', background: 'var(--lp-primary)' }} />
                    </motion.div>

                    <motion.h1
                        className="text-gradient"
                        custom={1} initial="hidden" animate="visible" variants={fadeUp}
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(4rem, 8vw, 7rem)',
                            lineHeight: 1.1,
                            marginBottom: '1.5rem',
                            fontWeight: 400,
                            fontStyle: 'italic'
                        }}
                    >
                        The Vertex Heritage
                    </motion.h1>

                    <motion.p
                        custom={2} initial="hidden" animate="visible" variants={fadeUp}
                        style={{
                            color: 'var(--lp-text-dim)',
                            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                            fontWeight: 300,
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}
                    >
                        Forged at the intersection of timeless craftsmanship and bleeding-edge digital infrastructure. A new standard for global commerce.
                    </motion.p>
                </div>
            </section>

            {/* The Genesis Segment */}
            <section className="section-wrapper" style={{ padding: '120px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div className="grid md:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-8"
                    >
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3.5rem', fontWeight: 400, lineHeight: 1.1, margin: '1rem 0 2rem' }}>
                            The Architecture<br />of Excellence
                        </h2>
                        <div style={{ width: '40px', height: '2px', background: 'var(--lp-primary)', opacity: 0.5, marginBottom: '2rem' }} />
                        <p style={{ color: 'var(--lp-text-dim)', fontSize: '1.125rem', fontWeight: 300, lineHeight: 1.8 }}>
                            Vertex was established with a singular, unyielding vision: to architect a commerce environment that completely dismantles the friction between luxury acquisition and digital convenience. Most platforms view these as inherently opposing forces. We view them as necessary counterparts.
                        </p>
                        <p style={{ color: 'var(--lp-text-dim)', fontSize: '1.125rem', fontWeight: 300, lineHeight: 1.8 }}>
                            To achieve this, we bypassed conventional retail systems, building a bespoke digital infrastructure from the ground up. Every algorithm, server protocol, and distribution node has been optimized to ensure the experience of securing rare artifacts feels as effortless as the items themselves.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] bg-black relative" style={{ zIndex: 2 }}>
                            <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop" alt="Architecture" className="object-cover w-full h-full opacity-80 mix-blend-luminosity filter grayscale" />
                            <div className="absolute inset-0 border border-white/10 pointer-events-none" />
                        </div>
                        <div className="absolute -bottom-8 -left-8 w-full h-full border border-primary/20" style={{ zIndex: 1 }} />
                    </motion.div>
                </div>
            </section>

            {/* Uncompromising Craft Segment */}
            <section style={{ background: '#0a0a0a', borderTop: '1px solid var(--lp-glass-border)', padding: '120px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        style={{ textAlign: 'center', marginBottom: '80px' }}
                    >
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 400, marginTop: '1rem' }}>
                            Uncompromising Curation
                        </h2>
                        <p style={{ color: 'var(--lp-text-dim)', fontSize: '1.125rem', fontWeight: 300, maxWidth: '700px', margin: '2rem auto 0', lineHeight: 1.8 }}>
                            The Vertex catalog is not merely assembled; it is rigorously vetted. We maintain an acceptance rate of less than 2% for global suppliers, ensuring that every asset available on our network meets an elite threshold for material provenance and ethical craftsmanship.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
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
                            >
                                <div className="aspect-[3/4] mb-6 overflow-hidden">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000 transform hover:scale-105" />
                                </div>
                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 400, margin: '0 0 1rem 0' }}>{item.title}</h3>
                                <p style={{ color: 'var(--lp-text-dim)', fontSize: '0.9375rem', fontWeight: 300, lineHeight: 1.6 }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HeritagePage;
