import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye, Filter } from 'lucide-react';
import { RootState } from '../../store';
import { setOrders, setLoading, updateOrderStatus, updateOrder, AdminOrder } from '../../store/slices/adminSlice';
import { fetchAdminOrders, updateAdminOrderStatus } from '../../services/adminService';
import AdminTable from '../../components/admin/AdminTable';
import OrderDetailPanel from '../../components/admin/OrderDetailPanel';

const AdminOrders: React.FC = () => {
    const dispatch = useDispatch();
    const { orders, loading, searchQuery } = useSelector((state: RootState) => state.admin);
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [filterStatus, setFilterStatus] = useState<AdminOrder['status'] | 'All'>('All');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    // Fetch orders on mount
    useEffect(() => {
        const load = async () => {
            dispatch(setLoading(true));
            try {
                const data = await fetchAdminOrders();
                dispatch(setOrders(data));
            } catch (err) {
                console.error('Failed to load orders', err);
            } finally {
                dispatch(setLoading(false));
            }
        };
        load();
    }, [dispatch]);

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            key: 'id',
            label: 'Order ID',
            render: (id: string) => <span className="font-sans text-xs font-medium text-white/70 group-hover:text-white transition-opacity">{id}</span>
        },
        {
            key: 'customerName',
            label: 'Merchant/Customer',
            render: (name: string, o: AdminOrder) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-white group-hover:text-primary transition-colors">{name}</span>
                    <span className="text-xs text-muted-foreground leading-none mt-0.5">{o.customerEmail}</span>
                </div>
            )
        },
        {
            key: 'date',
            label: 'Timestamp',
            render: (date: string) => (
                <div className="flex flex-col">
                    <span className="text-xs text-white font-medium">{new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            )
        },
        {
            key: 'subtotal',
            label: 'Valuation',
            render: (subtotal: number) => <span className="font-medium text-white">${subtotal}</span>
        },
        {
            key: 'status',
            label: 'Process Vector',
            render: (status: string) => (
                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${status === 'Delivered' ? 'text-emerald-500 bg-emerald-500/10' :
                    status === 'Pending' ? 'text-amber-500 bg-amber-500/10' :
                        status === 'Cancelled' ? 'text-rose-500 bg-rose-500/10' :
                            'text-blue-500 bg-blue-500/10'
                    }`}>
                    {status}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Operations',
            render: (_: any, o: AdminOrder) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(o);
                    }}
                    className="p-2 bg-white/5 border border-white/5 rounded-lg text-muted-foreground hover:text-white transition-all shadow-lg active:scale-95 group/btn"
                >
                    <Eye size={14} className="group-hover/btn:text-primary transition-colors" />
                </button>
            )
        }
    ];

    const mobileRender = (o: AdminOrder) => (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">{o.customerName}</h4>
                    <p className="text-[10px] sm:text-xs font-sans text-muted-foreground truncate uppercase tracking-tighter">{o.id}</p>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-xs sm:text-sm font-medium text-white tracking-tight">${o.subtotal}</p>
                    <p className={`text-[10px] sm:text-xs font-semibold uppercase tracking-widest ${o.status === 'Delivered' ? 'text-emerald-500' :
                            o.status === 'Pending' ? 'text-amber-500' :
                                o.status === 'Cancelled' ? 'text-rose-500' :
                                    'text-blue-500'
                        }`}>
                        {o.status}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.03]">
                <div className="flex flex-col">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">Received</span>
                    <span className="text-[10px] text-white font-medium">
                        {new Date(o.date).toLocaleDateString([], { month: 'short', day: 'numeric' })} @ {new Date(o.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(o);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-medium text-white transition-all shadow-lg active:scale-95 group/btn"
                >
                    <Eye size={12} className="group-hover/btn:text-primary transition-colors" /> View Operations
                </button>
            </div>
        </div>
    );

    const handleExport = () => {
        setIsExporting(true);
        try {
            const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Date', 'Total', 'Status', 'Items', 'Shipping Address'];
            const csvData = filteredOrders.map(o => [
                o.id,
                o.customerName,
                o.customerEmail,
                o.date,
                o.subtotal,
                o.status,
                o.items.map(i => `${i.name} (x${i.quantity})`).join('; '),
                o.shippingAddress
            ]);

            const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `manifest_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setTimeout(() => setIsExporting(false), 1000);
        }
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">Order Stream</h1>
                    <p className="text-[8px] sm:text-[10px] text-[#00f2ff]/40 uppercase tracking-[0.3em] sm:tracking-[0.4em] font-black italic">
                        Node Management <span className="text-white/10 mx-1 sm:mx-2 not-italic">/</span> Transactions
                    </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                            className={`p-2.5 bg-[#111114] border border-white/10 rounded-xl text-muted-foreground hover:text-white transition-all shadow-xl active:scale-95 ${isFilterMenuOpen ? 'border-[#00f2ff]/50 text-[#00f2ff]' : ''}`}
                        >
                            <Filter size={18} className="sm:w-5 sm:h-5" />
                        </button>

                        <AnimatePresence>
                            {isFilterMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute left-0 mt-2 w-40 md:w-48 bg-[#111114] border border-white/10 rounded-2xl p-1.5 md:p-2 shadow-2xl z-50 overflow-hidden glass-panel"
                                >
                                    {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setFilterStatus(status as any);
                                                setIsFilterMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-[10px] md:text-xs font-medium transition-all ${filterStatus === status ? 'bg-[#00f2ff]/20 text-[#00f2ff]' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white/[0.03] border border-white/5 text-white/70 rounded-xl text-[10px] sm:text-xs font-medium hover:bg-white/10 hover:text-white transition-all shadow-xl disabled:opacity-50 min-w-0"
                    >
                        <Download size={16} className={`${isExporting ? 'animate-bounce' : ''} shrink-0`} /> 
                        <span className="truncate">{isExporting ? 'Encoding...' : 'Manifest'}</span>
                    </button>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={filteredOrders}
                isLoading={loading}
                mobileCardRender={mobileRender}
                onRowClick={(o) => setSelectedOrder(o)}
            />

            <OrderDetailPanel
                order={orders.find(o => o.id === selectedOrder?.id) || null}
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onUpdateStatus={async (id: string, status: AdminOrder['status']) => {
                    try {
                        await updateAdminOrderStatus(id, status);
                        dispatch(updateOrderStatus({ id, status }));
                    } catch (err) {
                        console.error('Status update failed', err);
                    }
                }}
                onUpdateOrder={(order: AdminOrder) => dispatch(updateOrder(order))}
            />
        </div>
    );
};

export default AdminOrders;
