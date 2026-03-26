import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Search, ChevronRight, Clock, CheckCircle2, Truck, RefreshCcw } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { fetchOrders } from '../../store/slices/userSlice';

const AccountOrders: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { orders, loading } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'CREATED': return Clock;
            case 'PAID': return CheckCircle2;
            case 'SHIPPED': return Truck;
            case 'DELIVERED': return Package;
            case 'REFUNDED': return RefreshCcw;
            default: return Package;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CREATED': return 'text-secondary bg-secondary/10';
            case 'PAID': return 'text-primary bg-primary/10';
            case 'SHIPPED': return 'text-blue-400 bg-blue-400/10';
            case 'DELIVERED': return 'text-green-400 bg-green-400/10';
            case 'REFUNDED': return 'text-destructive bg-destructive/10';
            default: return 'text-muted-foreground bg-white/5';
        }
    };

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Header with Search */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">
                        Order <span className="text-primary">History</span>
                    </h1>
                    <p className="text-muted-foreground">Monitor and track your recent orders.</p>
                </div>
                <div className="w-full md:w-80">
                    <Input 
                        label="Search Orders" 
                        placeholder="VTX-..." 
                        icon={<Search size={18} />}
                    />
                </div>
            </header>

            {/* Orders List */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {orders.length > 0 ? (
                        orders.map((order, i) => {
                            const StatusIcon = getStatusIcon(order.status);
                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="hover:border-primary/20 transition-all group p-0" glass>
                                        <div className="p-6 flex flex-wrap items-center gap-8">
                                            {/* Order Identity */}
                                            <div className="min-w-[120px]">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Order ID</p>
                                                <p className="text-sm font-mono font-black">#{order.id.slice(-8).toUpperCase()}</p>
                                            </div>

                                            {/* Date */}
                                            <div className="min-w-[120px]">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Date</p>
                                                <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="min-w-[120px]">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Status</p>
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${getStatusColor(order.status)}`}>
                                                    <StatusIcon size={12} />
                                                    {order.status}
                                                </div>
                                            </div>

                                            {/* Total */}
                                            <div className="min-w-[100px]">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Total</p>
                                                <p className="text-sm font-black text-primary">${Number(order.total).toFixed(2)}</p>
                                            </div>

                                            {/* Item Previews */}
                                            <div className="flex-grow flex -space-x-3 overflow-hidden">
                                                {order.items.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-muted">
                                                        <img src={item.product?.image || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="w-10 h-10 rounded-full border-2 border-background bg-card flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action */}
                                            <Button variant="ghost" size="sm" className="group/btn">
                                                Details
                                                <ChevronRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            )
                        })
                    ) : (
                        <Card className="p-20 text-center italic text-muted-foreground">
                            No orders found in your history.
                        </Card>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AccountOrders;
