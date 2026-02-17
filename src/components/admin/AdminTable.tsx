import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, ArrowUpDown } from 'lucide-react';

interface Column {
    key: string;
    label: string;
    render?: (value: any, item: any) => React.ReactNode;
    sortable?: boolean;
}

interface AdminTableProps {
    columns: Column[];
    data: any[];
    onRowClick?: (item: any) => void;
    isLoading?: boolean;
    mobileCardRender: (item: any) => React.ReactNode;
}

const AdminTable: React.FC<AdminTableProps> = ({ columns, data, onRowClick, isLoading, mobileCardRender }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-white/5 rounded-xl border border-white/5" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-hidden bg-[#111114] border border-white/5 rounded-2xl shadow-xl shadow-black/20">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            {columns.map((col) => (
                                <th key={col.key} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && <ArrowUpDown size={12} className="opacity-50" />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode="popLayout">
                            {paginatedData.map((item, index) => (
                                <motion.tr
                                    key={item.id || index}
                                    layout
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => onRowClick?.(item)}
                                    className={`group hover:bg-white/[0.03] transition-colors cursor-pointer border-b border-white/[0.02] last:border-0`}
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4 text-sm whitespace-nowrap">
                                            {col.render ? col.render(item[col.key], item) : item[col.key]}
                                        </td>
                                    ))}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {paginatedData.map((item, index) => (
                    <motion.div
                        key={item.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => onRowClick?.(item)}
                        className="bg-[#111114] border border-white/5 rounded-xl p-4 shadow-lg shadow-black/20"
                    >
                        {mobileCardRender(item)}
                    </motion.div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length}
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="p-2 bg-white/5 border border-white/5 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-2 bg-white/5 border border-white/5 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTable;
