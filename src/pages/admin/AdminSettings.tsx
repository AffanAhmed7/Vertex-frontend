import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Bell, Database } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const AdminSettings: React.FC = () => {
    const sections = [
        {
            title: 'Infrastructure',
            icon: Database,
            description: 'Core system stability and database synchronization settings.',
            settings: [
                { label: 'Auto-Scaling', value: 'Active', status: 'Optimal' },
                { label: 'Latency Buffer', value: '45ms', status: 'Low' },
            ]
        },
        {
            title: 'Access Control',
            icon: Shield,
            description: 'Quantum encryption and administrative privilege management.',
            settings: [
                { label: 'Two-Factor', value: 'Enforced', status: 'Secured' },
                { label: 'Identity Vault', value: 'Vertex v2', status: 'Standby' },
            ]
        },
        {
            title: 'Communications',
            icon: Bell,
            description: 'Protocol for system-wide alerts and high-priority diagnostics.',
            settings: [
                { label: 'Push Protocol', value: 'WebSocket', status: 'Connected' },
                { label: 'Email Relay', value: 'SMTP/S', status: 'Active' },
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="space-y-1">
                <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">Global Configurations</h1>
                <p className="text-[9px] text-[#00f2ff]/40 uppercase tracking-[0.4em] font-black">Admin Interface <span className="text-white/10 mx-2">/</span> Settings Node</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {sections.map((section, idx) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="p-6 bg-white/[0.02] border-white/5 hover:border-[#00f2ff]/20 transition-all duration-500 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-[#00f2ff]/5 text-[#00f2ff]">
                                    <section.icon size={20} />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-white/90">{section.title}</h3>
                            </div>
                            <p className="text-[10px] text-white/40 leading-relaxed mb-6 uppercase tracking-wider">{section.description}</p>

                            <div className="flex-1 space-y-4">
                                {section.settings.map(s => (
                                    <div key={s.label} className="flex justify-between items-center py-2 border-b border-white/5">
                                        <span className="text-[10px] text-white/30 uppercase tracking-widest">{s.label}</span>
                                        <div className="text-right">
                                            <div className="text-[10px] text-white/80 font-bold uppercase">{s.value}</div>
                                            <div className="text-[8px] text-[#00f2ff]/60 uppercase tracking-tighter">{s.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="ghost"
                                className="w-full mt-6 border border-white/5 text-[10px] uppercase tracking-[0.2em] hover:bg-[#00f2ff]/10 hover:text-[#00f2ff] py-4"
                            >
                                Reconfigure
                            </Button>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card className="p-8 bg-white/[0.01] border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/80">Danger Environment</h4>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Procedural wipe of all administrative session data and instance cache.</p>
                    </div>
                    <Button className="bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all duration-500 px-10 text-[10px] uppercase tracking-widest py-3">
                        Purge Instance
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default AdminSettings;
