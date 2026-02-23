import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    MapPin,
    Star,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    UserCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/userSlice';
import { Button } from '../ui/Button';

const AccountLayout: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className="flex flex-col h-full py-8 px-6 space-y-8">
            {/* User Profile Summary */}
            <div className="flex items-center gap-4 px-2">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/10">
                    <UserCircle size={28} />
                </div>
                <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate">{currentUser?.name}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{currentUser?.status} Member</p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => `
                            flex items-center justify-between px-4 py-3 rounded-xl transition-all group
                            ${isActive
                                ? 'bg-primary/10 text-primary border border-primary/10'
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
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all"
            >
                <LogOut size={18} />
                Logout
            </button>
        </div>
    );

    return (
        <div className="min-h-screen pt-20" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <div className="container mx-auto max-w-7xl px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-card/40 border border-white/5 rounded-3xl backdrop-blur-xl shrink-0 overflow-hidden">
                        <SidebarContent />
                    </aside>

                    {/* Mobile Menu Toggle */}
                    <div className="lg:hidden flex items-center justify-between mb-8 p-4 bg-card/40 border border-white/5 rounded-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <UserCircle size={24} />
                            </div>
                            <span className="text-sm font-bold">{currentUser?.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={20} />
                        </Button>
                    </div>

                    {/* Content Panel */}
                    <main className="lg:col-span-9">
                        <Outlet />
                    </main>
                </div>
            </div>

            {/* Mobile Sidebar Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 bg-background border-r border-white/5 z-[101] lg:hidden"
                        >
                            <div className="absolute top-6 right-6">
                                <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                                    <X size={20} />
                                </Button>
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
