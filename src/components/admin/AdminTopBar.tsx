import React from 'react';
import { Search, Bell, Menu, User, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setSearchQuery, clearNotifications, markNotificationAsRead } from '../../store/slices/adminSlice';

interface AdminTopBarProps {
    onMenuClick: () => void;
}

const AdminTopBar: React.FC<AdminTopBarProps> = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const [showNotifications, setShowNotifications] = React.useState(false);

    const { notifications, searchQuery } = useSelector((state: RootState) => state.admin);
    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <header className="h-20 bg-[#070708] border-b border-white/5 flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
            {/* Left: Mobile Menu & Search */}
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-white/40 hover:text-white lg:hidden transition-colors"
                >
                    <Menu size={20} />
                </button>

                <div className="relative group max-w-md w-full hidden sm:block">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? 'text-[#00f2ff]' : 'text-white/20 group-focus-within:text-[#00f2ff]/50'}`} size={16} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                        placeholder="Search infrastructure..."
                        className="w-full bg-white/[0.03] border border-white/5 rounded-full py-2 pl-10 pr-10 text-sm focus:outline-none focus:border-[#00f2ff]/30 focus:bg-white/[0.05] transition-all placeholder:text-white/20"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => dispatch(setSearchQuery(''))}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                        >
                            <X size={14} />
                        </button>
                    )}
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
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#00f2ff] rounded-full border border-[#070708] shadow-[0_0_8px_#00f2ff]" />
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-4 w-80 bg-[#111114] border border-white/5 rounded-2xl shadow-2xl overflow-hidden glass-panel"
                            >
                                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                    <span className="text-xs font-medium text-white/40">Status Updates {unreadCount > 0 && `(${unreadCount})`}</span>
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={() => dispatch(clearNotifications())}
                                            className="text-xs text-[#00f2ff] hover:text-[#00f2ff]/80 font-medium transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map(n => (
                                            <div
                                                key={n.id}
                                                onClick={() => dispatch(markNotificationAsRead(n.id))}
                                                className={`p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group flex gap-3 items-start ${!n.unread ? 'opacity-50' : ''}`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.type === 'alert' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : n.type === 'warning' ? 'bg-amber-500' : 'bg-[#00f2ff]'}`} />
                                                <div>
                                                    <p className="text-[11px] text-white/70 group-hover:text-white transition-colors leading-relaxed">{n.text}</p>
                                                    <p className="text-xs text-white/20 mt-1.5 font-medium">{n.time}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-12 text-center text-white/10 text-xs font-medium">
                                            No New Updates
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 text-center border-t border-white/5 bg-white/[0.01]">
                                    <button className="text-xs text-white/40 hover:text-white font-medium transition-colors">System Diagnostics</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-white/5">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-medium text-white/90 leading-none">Instance Prime</div>
                        <div className="text-xs text-[#00f2ff]/40 font-medium mt-1">Authorized</div>
                    </div>
                    <button className="flex items-center gap-2 p-1 rounded-full hover:bg-white/[0.03] transition-all group">
                        <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/40 group-hover:text-[#00f2ff] transition-colors overflow-hidden">
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
