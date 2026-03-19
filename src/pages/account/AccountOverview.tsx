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
                <p className="text-muted-foreground">Welcome back, {currentUser?.name}. Manage your infrastructure and account data here.</p>
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
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-white">Recent Order</h2>
                        <Link to="/account/orders" className="text-xs font-bold text-primary hover:underline">View All &rarr;</Link>
                    </div>
                    {recentOrder ? (
                        <Card className="p-6 bg-card/40 border-white/5 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold font-mono text-muted-foreground">#{recentOrder.id.slice(-8).toUpperCase()}</p>
                                    <p className="text-sm font-medium">{new Date(recentOrder.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-tight">
                                    {recentOrder.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden">
                                    <img src={recentOrder.items[0]?.product.image || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="text-sm font-bold truncate">{recentOrder.items[0]?.product.name}</p>
                                    <p className="text-xs text-muted-foreground">{recentOrder.items.length > 1 ? `+ ${recentOrder.items.length - 1} more items` : '1 Item'}</p>
                                </div>
                                <p className="text-sm font-black">${Number(recentOrder.total).toFixed(2)}</p>
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-8 bg-card/40 border-white/5 text-center italic text-muted-foreground text-sm">
                            No recent orders found.
                        </Card>
                    )}
                </section>

                {/* Default Address Preview */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-white">Shipping Default</h2>
                        <Link to="/account/addresses" className="text-xs font-bold text-primary hover:underline">Manage &rarr;</Link>
                    </div>
                    {defaultAddress ? (
                        <Card className="p-6 bg-card/40 border-white/5 space-y-4">
                            <div className="flex items-center gap-3 text-primary">
                                <MapPin size={18} />
                                <span className="text-xs font-bold uppercase tracking-widest">Master Node Address</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold">{defaultAddress.fullName}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {defaultAddress.street}<br />
                                    {defaultAddress.city}, {defaultAddress.postalCode}<br />
                                    {defaultAddress.country}
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-8 bg-card/40 border-white/5 text-center italic text-muted-foreground text-sm">
                            No default address saved.
                        </Card>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AccountOverview;
