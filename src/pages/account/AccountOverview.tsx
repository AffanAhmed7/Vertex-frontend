import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Package, MapPin, Star } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { Card } from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { fetchOrders, fetchAddresses } from '../../store/slices/userSlice';

const AccountOverview: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser, orders, addresses, loading } = useSelector((state: RootState) => state.user);
    
    useEffect(() => {
        dispatch(fetchOrders());
        dispatch(fetchAddresses());
    }, [dispatch]);

    const recentOrder = orders[0];
    const defaultAddress = addresses.find(a => a.isDefault);

    const stats = [
        { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-primary' },
        { label: 'Saved Locations', value: addresses.length, icon: MapPin, color: 'text-secondary' },
        { label: 'Pending Reviews', value: '0', icon: Star, color: 'text-yellow-400' },
    ];

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Header */}
            <header className="space-y-2">
                <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">
                    Account <span className="text-primary">Overview</span>
                </h1>
                <p className="text-muted-foreground">Welcome back, {currentUser?.name}. Manage your orders and account information here.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="p-6 bg-card/40 border-white/5" glass>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-2xl font-black text-foreground">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recent Order Preview */}
                <Card className="p-0 bg-card/40 border-white/5 flex flex-col" glass>
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-xs font-bold text-white uppercase tracking-widest opacity-60">Recent Order</h2>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Last Order Placed</p>
                        </div>
                        <Link to="/account/orders" className="text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest transition-colors flex items-center gap-2">
                            Order History <span className="text-lg leading-none">&rarr;</span>
                        </Link>
                    </div>
                    <div className="p-8 flex-grow">
                        {recentOrder ? (
                            <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold font-mono text-white/40">VTX-{recentOrder.id.slice(-8).toUpperCase()}</p>
                                        <p className="text-sm font-medium text-white">{new Date(recentOrder.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                        {recentOrder.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                                    <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden shrink-0 border border-white/5">
                                        <img src={recentOrder.items[0]?.product.image || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow min-w-0 pr-4">
                                        <p className="text-base font-bold leading-tight text-white mb-1">{recentOrder.items[0]?.product.name}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                                            {recentOrder.items.length > 1 ? `+ ${recentOrder.items.length - 1} Additional Items` : 'Single Item'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-primary">${Number(recentOrder.total).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-grow items-center justify-center italic text-muted-foreground text-sm opacity-50">
                                No recent orders found in history.
                            </div>
                        )}
                    </div>
                </Card>

                {/* Default Address Preview */}
                <Card className="p-0 bg-card/40 border-white/5 flex flex-col" glass>
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-xs font-bold text-white uppercase tracking-widest opacity-60">Shipping Default</h2>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Primary Shipping Address</p>
                        </div>
                        <Link to="/account/addresses" className="text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest transition-colors flex items-center gap-2">
                            Manage <span className="text-lg leading-none">&rarr;</span>
                        </Link>
                    </div>
                    <div className="p-8 flex-grow">
                        {defaultAddress ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-primary/40">
                                    <MapPin size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Default Shipping Address</span>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-lg font-bold text-white uppercase tracking-tight">{defaultAddress.fullName}</p>
                                    <div className="space-y-1">
                                        <p className="text-base text-muted-foreground leading-relaxed">
                                            {defaultAddress.street}
                                        </p>
                                        <p className="text-base text-muted-foreground leading-relaxed">
                                            {defaultAddress.city}, {defaultAddress.postalCode}
                                        </p>
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-white/5">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
                                            {defaultAddress.country}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-grow items-center justify-center italic text-muted-foreground text-sm opacity-50">
                                No default address saved.
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AccountOverview;
