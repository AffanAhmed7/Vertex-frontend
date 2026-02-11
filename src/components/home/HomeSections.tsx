import { motion } from 'framer-motion';
import { ShieldCheck, Zap, CreditCard, Lock, Truck, Briefcase } from 'lucide-react';

export const ValueProp = () => {
    const items = [
        {
            icon: Zap,
            title: "Unrivaled Velocity",
            description: "Our proprietary global fulfillment network ensures your selections arrive with unprecedented speed, setting a new standard for premium logistics."
        },
        {
            icon: ShieldCheck,
            title: "Meticulous Curation",
            description: "Every piece in our collection undergoes a rigorous multi-stage vetting process to ensure exceptional quality, provenance, and ethical sourcing."
        },
        {
            icon: Briefcase,
            title: "Elite Concierge",
            description: "Experience personalized 24/7 support from our dedicated hospitality team, tailored to meet the needs of our most discerning clientele."
        }
    ];

    return (
        <section className="section-wrapper">
            <span className="section-label">Our Philosophy</span>
            <h2 className="section-title">Redefining the Standards of Excellence</h2>
            <div className="value-grid">
                {items.map((item, i) => (
                    <motion.div
                        key={i}
                        className="v-card"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2, duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <item.icon className="v-icon" />
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export const FeaturedCategories = () => {
    const categories = [
        {
            title: "Modern Wardrobe",
            img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
            label: "Apparel & Textiles"
        },
        {
            title: "Precision Tech",
            img: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800",
            label: "Digital Innovation"
        },
        {
            title: "Essential Accents",
            img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
            label: "Accessories"
        }
    ];

    return (
        <section className="section-wrapper">
            <span className="section-label">Collections</span>
            <h2 className="section-title">The Vertex Curation</h2>
            <div className="cat-grid">
                {categories.map((cat, i) => (
                    <motion.div
                        key={i}
                        className="cat-item"
                        initial={{ opacity: 0, scale: 1.05 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true }}
                    >
                        <img src={cat.img} alt={cat.title} className="cat-img" />
                        <div className="cat-content">
                            <span className="cat-label">{cat.label}</span>
                            <h3 className="cat-name">{cat.title}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export const TrustSection = () => {
    const trustItems = [
        {
            icon: Truck,
            title: "Global Shipping",
            desc: "Swift, secure delivery to over 120 countries with real-time tracking."
        },
        {
            icon: CreditCard,
            title: "Secure Payments",
            desc: "Multiple encrypted payment layers ensuring financial peace of mind."
        },
        {
            icon: Lock,
            title: "Data Privacy",
            desc: "Military-grade encryption for all your personal and transactional data."
        },
        {
            icon: ShieldCheck,
            title: "Authenticity",
            desc: "Guaranteed provenance for every item in our curated collection."
        }
    ];

    return (
        <section className="section-wrapper trust-section">
            <div className="trust-grid">
                {trustItems.map((item, i) => (
                    <motion.div
                        key={i}
                        className="trust-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="trust-card-header">
                            <item.icon className="trust-icon" />
                            <h4>{item.title}</h4>
                        </div>
                        <p>{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export const BottomCTA = () => {
    return (
        <section className="premium-cta">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
            >
                <span className="section-label" style={{ color: '#000' }}>Membership</span>
                <h2 style={{ color: '#000' }}>Excellence Awaits Your Arrival</h2>
                <p style={{ color: '#666', fontSize: '1.25rem', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
                    Join the Vertex inner circle and redefine your relationship with luxury retail.
                </p>
                <button className="premium-cta-btn">
                    Apply for Access
                </button>
            </motion.div>
        </section>
    );
};
