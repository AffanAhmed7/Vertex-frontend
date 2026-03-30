import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Package, CheckCircle, Clock, Truck, ShieldCheck, AlertCircle } from 'lucide-react';
import { AdminOrder } from '../../store/slices/adminSlice';
import AdminVault from './AdminVault';

interface OrderDetailPanelProps {
    order: AdminOrder | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdateStatus: (id: string, status: AdminOrder['status']) => void;
    onUpdateOrder: (order: AdminOrder) => void;
}

const OrderDetailPanel: React.FC<OrderDetailPanelProps> = ({
    order,
    isOpen,
    onClose,
    onUpdateStatus,
    onUpdateOrder
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedOrder, setEditedOrder] = useState<AdminOrder | null>(null);
    const [isVaultOpen, setIsVaultOpen] = useState(false);
    const [vaultAction, setVaultAction] = useState<{ type: 'status' | 'update', data: any } | null>(null);

    useEffect(() => {
        if (order) {
            setEditedOrder(order);
        } else {
            setIsEditing(false);
            setEditedOrder(null);
        }
    }, [order, isOpen]);

    const handleSaveInitiate = () => {
        if (editedOrder) {
            setVaultAction({ type: 'update', data: editedOrder });
            setIsVaultOpen(true);
        }
    };

    const handleStatusInitiate = (status: AdminOrder['status']) => {
        if (order) {
            setVaultAction({ type: 'status', data: status });
            setIsVaultOpen(true);
        }
    };

    const statusIcons = {
        'Pending': <Clock size={16} />,
        'Processing': <Package size={16} />,
        'Shipped': <Truck size={16} />,
        'Delivered': <CheckCircle size={16} />,
        'Cancelled': <AlertCircle size={16} />
    };

    const statusColors = {
        'Pending': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        'Processing': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        'Shipped': 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        'Delivered': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        'Cancelled': 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    };

    return (
        <AnimatePresence>
            {isOpen && order && editedOrder && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-[95%] sm:w-full max-w-xl h-fit max-h-[90vh] bg-[#0a0a0b] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div>
                                <h3 className="text-base sm:text-xl font-light text-white uppercase tracking-tighter">
                                    Order Details
                                </h3>
                                <p className="text-[8px] sm:text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                                    Order Information <span className="text-white/10 mx-1 sm:mx-2">/</span> <span className="text-white/60">{order.id}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <button
                                    onClick={() => isEditing ? handleSaveInitiate() : setIsEditing(true)}
                                    className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[9px] sm:text-xs font-medium transition-all active:scale-95 border ${isEditing ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/[0.05] border-white/10 text-white hover:bg-white/10'}`}
                                >
                                    {isEditing ? 'Confirm' : 'Edit'}
                                </button>
                                <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-white/5 rounded-xl transition-colors">
                                    <X size={18} className="text-white/40 sm:w-5 sm:h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-8 space-y-6 sm:space-y-8">
                            {/* Content Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Identity Module */}
                                <section className="space-y-3 sm:space-y-4">
                                    <div className="flex items-center gap-2 text-[#00f2ff] opacity-60">
                                        <ShieldCheck size={12} />
                                        <h4 className="text-[10px] font-medium uppercase tracking-widest">Protocol Metadata</h4>
                                    </div>
                                    <div className="space-y-3 sm:space-y-4 bg-white/[0.01] border border-white/5 rounded-2xl p-4 sm:p-5">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-medium text-white/30 uppercase tracking-tighter">Originator</label>
                                            {isEditing ? (
                                                <input
                                                    value={editedOrder.customerName}
                                                    onChange={e => setEditedOrder({ ...editedOrder, customerName: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white focus:border-[#00f2ff]/50 outline-none transition-all"
                                                />
                                            ) : (
                                                <div className="text-xs sm:text-sm text-white font-bold">{order.customerName}</div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-medium text-white/30 uppercase tracking-tighter">Communication Vector</label>
                                            {isEditing ? (
                                                <input
                                                    value={editedOrder.customerEmail}
                                                    onChange={e => setEditedOrder({ ...editedOrder, customerEmail: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white focus:border-[#00f2ff]/50 outline-none transition-all"
                                                />
                                            ) : (
                                                <div className="text-xs sm:text-sm text-white/60 tracking-tight truncate">{order.customerEmail}</div>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Process Module */}
                                <section className="space-y-3 sm:space-y-4">
                                    <div className="flex items-center gap-2 text-[#00f2ff] opacity-60">
                                        <Clock size={12} />
                                        <h4 className="text-[10px] font-medium uppercase tracking-widest">Process State</h4>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                                        {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusInitiate(status as AdminOrder['status'])}
                                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[9px] sm:text-xs font-medium transition-all ${order.status === status ? statusColors[status as keyof typeof statusColors] : 'border-white/5 bg-white/[0.01] text-white/20 hover:bg-white/5'}`}
                                            >
                                                {statusIcons[status as keyof typeof statusIcons]}
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Logistics Overview */}
                             <section className="space-y-3 sm:space-y-4">
                                <div className="flex items-center gap-2 text-[#00f2ff] opacity-60">
                                    <MapPin size={12} />
                                    <h4 className="text-[10px] font-medium uppercase tracking-widest">Logistics Coordinates</h4>
                                </div>
                                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 sm:p-5">
                                    <label className="text-[9px] font-medium text-white/30 uppercase tracking-tighter mb-1.5 block">Destination</label>
                                    {isEditing ? (
                                        <textarea
                                            rows={2}
                                            value={editedOrder.shippingAddress}
                                            onChange={e => setEditedOrder({ ...editedOrder, shippingAddress: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs sm:text-sm text-white focus:border-[#00f2ff]/50 outline-none transition-all resize-none"
                                        />
                                    ) : (
                                        <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{order.shippingAddress}</p>
                                    )}
                                </div>
                            </section>

                            {/* Payload Summary */}
                             <section className="space-y-3 sm:space-y-4">
                                <div className="flex items-center gap-2 text-[#00f2ff] opacity-60">
                                    <Package size={12} />
                                    <h4 className="text-[10px] font-medium uppercase tracking-widest">Payload Manifest</h4>
                                </div>
                                <div className="bg-[#111115] border border-white/5 rounded-2xl overflow-hidden shadow-inner shadow-black/40">
                                    <div className="p-2.5 sm:p-3 border-b border-white/5 bg-white/[0.02]">
                                        <div className="flex justify-between items-center text-[8px] sm:text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                            <span>Component</span>
                                            <span>Quantity</span>
                                        </div>
                                    </div>
                                    <div className="max-h-40 overflow-y-auto no-scrollbar">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="p-3 flex items-center justify-between border-b border-white/[0.02] last:border-0 hover:bg-white/[0.01] transition-colors">
                                                <div className="space-y-0.5 min-w-0 flex-1">
                                                    <p className="text-[11px] sm:text-xs font-bold text-white truncate">{item.name}</p>
                                                    <p className="text-[9px] text-[#00f2ff]/40 tracking-tight font-medium">${item.price}</p>
                                                </div>
                                                <span className="text-[10px] font-black text-[#00f2ff] bg-[#00f2ff]/10 px-2 py-0.5 rounded-lg shrink-0 ml-4 border border-[#00f2ff]/20 uppercase">
                                                    x{item.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 sm:p-5 bg-white/[0.03] border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Aggregate Total</span>
                                        <span className="text-lg sm:text-xl font-light text-white tracking-widest">${order.total}</span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="p-4 sm:p-6 border-t border-white/5 bg-white/[0.01] flex items-center justify-end">
                            <button
                                onClick={onClose}
                                className="w-full sm:w-auto px-8 py-3 bg-white/[0.03] border border-white/5 hover:border-white/10 text-white/60 hover:text-white rounded-xl text-[10px] sm:text-xs font-medium transition-all uppercase tracking-widest"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
            <AdminVault
                isOpen={isVaultOpen}
                onClose={() => {
                    setIsVaultOpen(false);
                    setVaultAction(null);
                }}
                onSuccess={() => {
                    if (!vaultAction || !order) return;
                    if (vaultAction.type === 'status') {
                        onUpdateStatus(order.id, vaultAction.data);
                    } else if (vaultAction.type === 'update') {
                        onUpdateOrder(vaultAction.data);
                        setIsEditing(false);
                    }
                    setVaultAction(null);
                }}
                actionLabel={vaultAction?.type === 'status' ? `update order status to ${vaultAction.data}` : "override order details"}
            />
        </AnimatePresence>
    );
};

export default OrderDetailPanel;
