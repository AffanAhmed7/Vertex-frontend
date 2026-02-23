import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Hammer, Construction } from 'lucide-react';

const AdminPlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary"
            >
                <Construction size={48} />
            </motion.div>

            <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tighter uppercase text-white">
                    {title} <span className="text-primary">Module</span>
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto text-sm uppercase tracking-widest">
                    This administrative interface is currently under construction and scheduled for future deployment.
                </p>
            </div>

            <div className="flex gap-4 pt-4">
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Shield size={12} /> Priority: High
                </div>
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Hammer size={12} /> Status: Engineering
                </div>
            </div>
        </div>
    );
};

export default AdminPlaceholderPage;
