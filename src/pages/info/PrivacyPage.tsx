import { motion } from 'framer-motion';

const PrivacyPage = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-12"
                >
                    <header className="space-y-4">
                        <h1 className="text-4xl font-light tracking-[0.1em] text-white uppercase leading-none">
                            Privacy <span className="text-[#00f2ff]">Protocols</span>
                        </h1>
                        <p className="text-xs text-[#00f2ff]/60 uppercase tracking-widest font-medium">Data Governance <span className="text-white/10 mx-2">/</span> Operational Standards</p>
                    </header>
                    
                    <div className="space-y-12 prose prose-invert max-w-none text-white/50">
                        <section className="space-y-4">
                            <h2 className="text-white text-xs font-bold uppercase tracking-[0.3em] opacity-80">Information Handling</h2>
                            <p className="leading-relaxed">We collect only the essential data required to fulfill orders and provide secure account access. This includes contact details, shipping addresses, and transaction history. No non-essential tracking is performed on this infrastructure.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-white text-xs font-bold uppercase tracking-[0.3em] opacity-80">Security Measures</h2>
                            <p className="leading-relaxed">All sensitive data is stored using industry-standard encryption. Access to user records is strictly limited to authorized administrative personnel for order fulfillment purposes only.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-white text-xs font-bold uppercase tracking-[0.3em] opacity-80">Data Erasure</h2>
                            <p className="leading-relaxed">Users maintain the right to request full account deletion and data purging. Contact the Administrator directly to initiate a permanent data removal request.</p>
                        </section>

                        <div className="pt-12 border-t border-white/5 flex flex-col gap-2">
                            <span className="text-[10px] font-bold text-[#00f2ff]/40 uppercase tracking-[0.5em]">Principal Administrator</span>
                            <span className="text-xs text-white/20 uppercase tracking-[0.2em]">Administrator // March 2026</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPage;
