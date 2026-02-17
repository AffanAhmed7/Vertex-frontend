import { motion } from 'framer-motion';
import { AdminOrder } from '../../store/slices/adminSlice';
import { Clock, ChevronRight } from 'lucide-react';

interface KanbanBoardProps {
    orders: AdminOrder[];
    onOrderClick: (order: AdminOrder) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ orders, onOrderClick }) => {
    const columns: AdminOrder['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    const getColumnOrders = (status: AdminOrder['status']) => orders.filter(o => o.status === status);

    const statusColors = {
        Pending: 'border-amber-500/20 text-amber-500',
        Processing: 'border-blue-500/20 text-blue-500',
        Shipped: 'border-indigo-500/20 text-indigo-500',
        Delivered: 'border-emerald-500/20 text-emerald-500',
        Cancelled: 'border-rose-500/20 text-rose-500',
    };

    return (
        <div className="flex gap-6 overflow-x-auto pb-8 -mx-6 px-6 min-h-[70vh]">
            {columns.map((column) => (
                <div key={column} className="flex-shrink-0 w-80 flex flex-col gap-4">
                    <div className={`p-4 rounded-2xl bg-white/[0.03] border ${statusColors[column]} flex items-center justify-between`}>
                        <h3 className="text-xs font-black uppercase tracking-widest">{column}</h3>
                        <span className="text-[10px] font-black bg-white/5 py-0.5 px-2 rounded-lg opacity-50">
                            {getColumnOrders(column).length}
                        </span>
                    </div>

                    <div className="flex-1 space-y-4">
                        {getColumnOrders(column).map((order) => (
                            <motion.div
                                key={order.id}
                                layoutId={order.id}
                                onClick={() => onOrderClick(order)}
                                className="bg-[#111114] border border-white/5 rounded-2xl p-4 shadow-xl shadow-black/20 group cursor-pointer hover:border-primary/30 transition-all active:scale-[0.98]"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] font-black italic text-white uppercase tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">
                                        {order.id}
                                    </span>
                                    <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>

                                <h4 className="text-sm font-bold text-white mb-4 line-clamp-1">{order.customerName}</h4>

                                <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest pt-4 border-t border-white/[0.03]">
                                    <span className="text-primary">${order.total}</span>
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Clock size={10} /> {new Date(order.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </motion.div>
                        ))}

                        {getColumnOrders(column).length === 0 && (
                            <div className="h-24 rounded-2xl border border-dashed border-white/5 flex items-center justify-center opacity-30">
                                <span className="text-[10px] font-black uppercase tracking-widest">Zone Clear</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;
