import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, MapPin } from 'lucide-react';
import { AdminOrder } from '../../store/slices/adminSlice';

interface OrderDetailPanelProps {
    order: AdminOrder | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdateStatus: (id: string, status: AdminOrder['status']) => void;
}

const OrderDetailPanel: React.FC<OrderDetailPanelProps> = ({ order, isOpen, onClose, onUpdateStatus }) => {
    if (!order) return null;

    const statusColors = {
        Pending: 'text-amber-500 bg-amber-500/10',
        Processing: 'text-blue-500 bg-blue-500/10',
        Shipped: 'text-indigo-500 bg-indigo-500/10',
        Delivered: 'text-emerald-500 bg-emerald-500/10',
        Cancelled: 'text-rose-500 bg-rose-500/10',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#0a0a0b] border-l border-white/5 z-[201] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div>
                                <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">{order.id}</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Order Details</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Status Section */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Status</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusColors[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.keys(statusColors).map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => onUpdateStatus(order.id, s as AdminOrder['status'])}
                                            className={`px-4 py-2 border rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${order.status === s
                                                ? 'bg-primary border-primary text-white'
                                                : 'bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/10'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Customer Info */}
                            <section className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <User size={14} /> Customer Intelligence
                                </h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white font-bold">
                                            {order.customerName[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{order.customerName}</p>
                                            <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin size={16} className="text-muted-foreground mt-0.5" />
                                        <p className="text-xs text-muted-foreground leading-relaxed">{order.shippingAddress}</p>
                                    </div>
                                </div>
                            </section>

                            {/* Line Items */}
                            <section className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Manifest</h4>
                                <div className="space-y-3">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                            <div>
                                                <p className="text-sm font-bold text-white">{item.name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-black italic text-white">${item.price}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Revenue</span>
                                    <span className="text-2xl font-black italic text-primary tracking-tighter">${order.total}</span>
                                </div>
                            </section>

                            {/* Timeline/Activity */}
                            <section className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lifecycle Timeline</h4>
                                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                                    <div className="relative">
                                        <div className="absolute -left-[1.375rem] w-3 h-3 rounded-full bg-emerald-500 border-4 border-[#0a0a0b]" />
                                        <p className="text-xs font-bold text-white">Payment Confirmed</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">{order.date}</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[1.375rem] w-3 h-3 rounded-full bg-white/20 border-4 border-[#0a0a0b]" />
                                        <p className="text-xs font-bold text-muted-foreground">Order Processed</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">Pending</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex gap-3">
                            <button className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                                Print Invoice
                            </button>
                            <button className="flex-1 px-4 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all">
                                Manage Refund
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default OrderDetailPanel;
