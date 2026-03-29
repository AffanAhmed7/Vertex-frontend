import { motion } from 'framer-motion';

const TermsPage = () => {
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
                            Terms of <span className="text-[#00f2ff]">Service</span>
                        </h1>
                        <p className="text-xs text-[#00f2ff]/60 uppercase tracking-widest font-medium">Standard Agreement <span className="text-white/10 mx-2">/</span> Interaction Policy</p>
                    </header>
                    
                    <div className="space-y-12 prose prose-invert max-w-none text-white/50">
                        <section className="space-y-4">
                            <h2 className="text-white text-xs font-bold uppercase tracking-[0.3em] opacity-80">General Use</h2>
                            <p className="leading-relaxed">By accessing this platform, you agree to abide by our operational policies regarding data use and transaction integrity. Unauthorized attempts to bypass security measures or manipulate system data will result in immediate account termination.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-white text-xs font-bold uppercase tracking-[0.3em] opacity-80">Order Fulfillment</h2>
                            <p className="leading-relaxed">All transactions processed through this platform are subject to availability. We reserve the right to cancel or modify orders in the event of stock discrepancies or system errors. Refund policies are managed on a case-by-case basis through direct contact.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-white text-xs font-bold uppercase tracking-[0.3em] opacity-80">Contact & Support</h2>
                            <p className="leading-relaxed">All support inquiries and legal disputes should be directed to Affan Ahmed at affanahmedkhan34@gmail.com. We aim to resolve all issues through direct professional communication.</p>
                        </section>

                        <div className="pt-12 border-t border-white/5 flex flex-col gap-2">
                             <span className="text-[10px] font-bold text-[#00f2ff]/40 uppercase tracking-[0.5em]">Legal Administration</span>
                            <span className="text-xs text-white/20 uppercase tracking-[0.2em]">Revision: March 2026</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsPage;
