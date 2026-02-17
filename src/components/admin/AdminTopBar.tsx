import React from 'react';
import { Search, Bell, Menu, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminTopBarProps {
    onMenuClick: () => void;
}

const AdminTopBar: React.FC<AdminTopBarProps> = ({ onMenuClick }) => {
    const [showNotifications, setShowNotifications] = React.useState(false);

    const notifications = [
        { id: 1, text: 'System Update: v1.0.4 deployed', time: '2m ago' },
        { id: 2, text: 'New asset verification required', time: '15m ago' },
        { id: 3, text: 'Operational threshold reached: Node A', time: '1h ago' },
    ];

    return (
        <header className="h-20 bg-[#070708] border-b border-white/5 flex items-center justify-between px-6 shrink-0 sticky top-0 z-40" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {/* Left: Mobile Menu & Search */}
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-white/40 hover:text-white lg:hidden transition-colors"
                >
                    <Menu size={20} />
                </button>

                <div className="relative group max-w-md w-full hidden sm:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00f2ff]/50 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search infrastructure..."
                        className="w-full bg-white/[0.03] border border-white/5 rounded-full py-2 pl-10 pr-4 text-[11px] tracking-widest uppercase focus:outline-none focus:border-[#00f2ff]/30 focus:bg-white/[0.05] transition-all"
                    />
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-6">
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative p-2 transition-colors ${showNotifications ? 'text-[#00f2ff]' : 'text-white/30 hover:text-white/60'}`}
                    >
                        <Bell size={18} />
                        <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#00f2ff] rounded-full border border-[#070708]" />
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-4 w-72 bg-[#111114] border border-white/5 rounded-2xl shadow-2xl overflow-hidden glass-panel"
                            >
                                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Status Updates</span>
                                    <button className="text-[9px] text-[#00f2ff] hover:underline uppercase font-bold tracking-widest">Clear</button>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.map(n => (
                                        <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                                            <p className="text-[11px] text-white/70 group-hover:text-white transition-colors">{n.text}</p>
                                            <p className="text-[9px] text-white/20 mt-1 uppercase tracking-widest">{n.time}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 text-center">
                                    <button className="text-[9px] text-white/40 hover:text-white uppercase tracking-widest font-bold">View Diagnostics</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-white/5">
                    <div className="text-right hidden sm:block">
                        <div className="text-[11px] font-bold text-white/90 uppercase tracking-widest">Instance Prime</div>
                        <div className="text-[8px] text-[#00f2ff]/40 uppercase tracking-[0.3em] font-black">Authorized</div>
                    </div>
                    <button className="flex items-center gap-2 p-1 rounded-full hover:bg-white/[0.03] transition-all group">
                        <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/40 group-hover:text-[#00f2ff] transition-colors">
                            <User size={16} />
                        </div>
                        <ChevronDown size={12} className="text-white/20 group-hover:text-white/40 transition-colors" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminTopBar;
