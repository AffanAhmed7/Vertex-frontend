import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    MapPin,
    Star,
    Settings,
    LogOut,
    X,
    ChevronRight,
    UserCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, closeAccountSidebar } from '../../store';
import { logout } from '../../store/slices/userSlice';

const AccountLayout: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: RootState) => state.user);
    const { isAccountSidebarOpen } = useSelector((state: RootState) => state.ui);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/account', end: true },
        { icon: Package, label: 'Orders', path: '/account/orders' },
        { icon: MapPin, label: 'Addresses', path: '/account/addresses' },
        { icon: Star, label: 'Reviews', path: '/account/reviews' },
        { icon: Settings, label: 'Settings', path: '/account/settings' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full py-8 px-6 space-y-8 bg-[#0a0a0b]">
            {/* User Profile Summary */}
            <div className="flex items-center gap-4 px-2">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/10">
                    <UserCircle size={28} />
                </div>
                <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate">{currentUser?.name}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{currentUser?.role === 'ADMIN' ? 'Admin' : 'Active'} Member</p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        onClick={() => dispatch(closeAccountSidebar())}
                        className={({ isActive }) => `
                            flex items-center justify-between px-4 py-3 rounded-xl transition-all group
                            ${isActive
                                ? 'bg-primary/10 text-primary border border-primary/10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={18} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </NavLink>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="pt-6 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <div className="container mx-auto max-w-7xl px-4 md:px-6 pt-32 md:pt-28 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-[#0a0a0b]/40 border border-white/5 rounded-3xl backdrop-blur-xl shrink-0 overflow-hidden">
                        <SidebarContent />
                    </aside>

                    {/* Content Panel */}
                    <main className="lg:col-span-9 min-w-0">
                        <Outlet />
                    </main>
                </div>
            </div>

            {/* Mobile Sidebar Drawer */}
            <AnimatePresence>
                {isAccountSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => dispatch(closeAccountSidebar())}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-[#0a0a0b] border-r border-white/5 z-[101] lg:hidden shadow-2xl"
                        >
                            <div className="absolute top-5 right-5">
                                <button
                                    onClick={() => dispatch(closeAccountSidebar())}
                                    className="p-2 text-white/20 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AccountLayout;
