import { motion } from 'framer-motion';
import { Shield, FileText, Globe, Key } from 'lucide-react';

const CompliancePage = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-12"
                >
                    <header className="space-y-4">
                        <h1 className="text-4xl font-light tracking-[0.1em] text-white uppercase leading-none">
                            System <span className="text-[#00f2ff]">Compliance</span>
                        </h1>
                        <p className="text-xs text-[#00f2ff]/60 uppercase tracking-widest font-medium">Regulatory Framework <span className="text-white/10 mx-2">/</span> Operational Integrity</p>
                    </header>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { icon: Shield, title: "Transaction Security", desc: "All payment processing is handled through secure, PCI-compliant gateways. We do not store full credit card details on our local servers." },
                            { icon: Globe, title: "Regional Standards", desc: "Our platform adheres to standard e-commerce regulations for digital trade and consumer protection within our operating regions." },
                            { icon: FileText, title: "Audit Protocols", desc: "Internal logs are maintained for all administrative actions to ensure complete transparency and operational accountability." },
                            { icon: Key, title: "Access Control", desc: "Strict role-based access control (RBAC) ensures that only authorized administrators can access sensitive system configurations." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/[0.02] border border-white/5 p-10 rounded-3xl space-y-4">
                                <item.icon className="text-[#00f2ff]" size={28} />
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest opacity-80">{item.title}</h3>
                                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-white/5">
                         <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Compliance Oversight: Administrator</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CompliancePage;
