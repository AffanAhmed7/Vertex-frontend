import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Shield
} from 'lucide-react';

interface AdminSidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    className?: string;
    isMobile?: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggle, className, isMobile }) => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/admin', end: true },
        { icon: Package, label: 'Products', path: '/admin/products' },
        { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: isMobile ? '100%' : (isCollapsed ? 80 : 260) }}
            className={`flex flex-col bg-[#111114] border-r border-white/5 ${className}`}
        >
            {/* Logo Section */}
            <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00f2ff]/10 border border-[#00f2ff]/20 flex items-center justify-center text-[#00f2ff]">
                        <Shield size={18} />
                    </div>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-light tracking-[0.15em] text-lg uppercase text-white/90"
                        >
                            Vertex <span className="text-[#00f2ff]/40">Admin</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto scrollbar-hide">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative
                            ${isActive
                                ? 'bg-[#00f2ff]/5 text-[#00f2ff]'
                                : 'text-white/40 hover:text-white/90 hover:bg-white/[0.03]'}
                        `}
                    >
                        <item.icon size={20} className="shrink-0" />
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm font-medium"
                            >
                                {item.label}
                            </motion.span>
                        )}
                        {!isCollapsed && (
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight size={14} />
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer Section (Logout) */}
            <div className="p-4 border-t border-white/5">
                <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all">
                    <LogOut size={20} className="shrink-0" />
                    {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
                </button>
            </div>

            {/* Collapse Toggle (Desktop only) */}
            {!isMobile && (
                <button
                    onClick={onToggle}
                    className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-[#111114] border border-white/5 flex items-center justify-center text-white/30 shadow-xl hover:text-white transition-all z-50"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            )}
        </motion.aside>
    );
};

export default AdminSidebar;
