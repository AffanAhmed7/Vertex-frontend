import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { List, Layout, Search, Download, Eye } from 'lucide-react';
import { RootState } from '../../store';
import { updateOrderStatus, AdminOrder } from '../../store/slices/adminSlice';
import AdminTable from '../../components/admin/AdminTable';
import KanbanBoard from '../../components/admin/KanbanBoard';
import OrderDetailPanel from '../../components/admin/OrderDetailPanel';

const AdminOrders: React.FC = () => {
    const dispatch = useDispatch();
    const { orders, loading } = useSelector((state: RootState) => state.admin);
    const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            key: 'id',
            label: 'Order ID',
            render: (id: string) => <span className="font-mono text-xs font-bold text-white uppercase opacity-70 group-hover:opacity-100 transition-opacity">{id}</span>
        },
        {
            key: 'customerName',
            label: 'Merchant/Customer',
            render: (name: string, o: AdminOrder) => (
                <div className="flex flex-col">
                    <span className="font-bold text-white group-hover:text-primary transition-colors">{name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none mt-0.5">{o.customerEmail}</span>
                </div>
            )
        },
        {
            key: 'date',
            label: 'Timestamp',
            render: (date: string) => (
                <div className="flex flex-col">
                    <span className="text-xs text-white uppercase font-bold">{new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter mt-0.5">{new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            )
        },
        {
            key: 'total',
            label: 'Total Valuation',
            render: (total: number) => <span className="font-medium text-white tracking-widest">${total}</span>
        },
        {
            key: 'status',
            label: 'Process Vector',
            render: (status: string) => (
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${status === 'Delivered' ? 'text-emerald-500 bg-emerald-500/10' :
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
        <div className="flex items-center justify-between">
            <div>
                <h4 className="text-sm font-bold text-white">{o.customerName}</h4>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{o.id}</p>
            </div>
            <div className="text-right">
                <p className="text-sm font-medium text-white">${o.total}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">{o.status}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">Order Stream</h1>
                    <p className="text-[9px] text-[#00f2ff]/40 uppercase tracking-[0.4em] font-black">Mission Control <span className="text-white/10 mx-2">/</span> Transactions</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-white/5 border border-white/5 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white'}`}
                        >
                            <List size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white'}`}
                        >
                            <Layout size={18} />
                        </button>
                    </div>

                    <div className="h-10 w-px bg-white/5 mx-2 hidden md:block" />

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-white/5 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:border-primary/50 outline-none transition-all w-full md:w-64"
                            placeholder="Find record..."
                        />
                    </div>

                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white/[0.03] border border-white/5 text-white/70 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all shadow-xl">
                        <Download size={18} /> Manifest
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'table' ? (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AdminTable
                            columns={columns}
                            data={filteredOrders}
                            isLoading={loading}
                            mobileCardRender={mobileRender}
                            onRowClick={(o) => setSelectedOrder(o)}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="kanban"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <KanbanBoard
                            orders={filteredOrders}
                            onOrderClick={(o) => setSelectedOrder(o)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <OrderDetailPanel
                order={selectedOrder}
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onUpdateStatus={(id, status) => dispatch(updateOrderStatus({ id, status }))}
            />
        </div>
    );
};

export default AdminOrders;
