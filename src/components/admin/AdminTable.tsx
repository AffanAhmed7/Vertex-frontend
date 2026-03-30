import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        setCurrentPage(1);
    }, [data.length]);

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
            {/* Desktop Table / Empty State */}
            <div className="hidden md:block overflow-hidden bg-[#111114] border border-white/5 rounded-2xl shadow-xl shadow-black/20">
                {data.length === 0 ? (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/20">
                            <ChevronRight size={32} className="rotate-45" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-white/40">No users found</h3>
                            <p className="text-xs text-white/10">Try adjusting your search or filters</p>
                        </div>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                {columns.map((col) => (
                                    <th key={col.key} className="px-6 py-4 text-xs font-medium text-[#00f2ff]/40">
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
                                            <td key={col.key} className="px-6 py-4 text-sm whitespace-nowrap font-medium">
                                                {col.render ? col.render(item[col.key], item) : item[col.key]}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
            </div>

            {/* Mobile Cards / Empty State */}
            <div className="md:hidden space-y-4">
                {data.length === 0 ? (
                    <div className="bg-[#111114] border border-white/5 rounded-xl p-12 text-center">
                        <p className="text-xs font-medium text-white/20">No Users Found</p>
                    </div>
                ) : (
                    paginatedData.map((item, index) => (
                        <motion.div
                            key={item.id || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => onRowClick?.(item)}
                            className="bg-[#111114] border border-white/5 rounded-xl p-4 shadow-lg shadow-black/20"
                        >
                            {mobileCardRender(item)}
                        </motion.div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-widest">
                        Dispensing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, data.length)} <span className="text-white/20">of</span> {data.length}
                    </p>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="p-2 bg-white/5 border border-white/5 rounded-lg disabled:opacity-20 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {/* Mobile: only show current/total. Tablet+: show list */}
                            <div className="sm:hidden flex items-center px-3 h-8 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black text-white uppercase tracking-tighter">
                                {currentPage} <span className="mx-1.5 text-white/20">/</span> {totalPages}
                            </div>
                            
                            <div className="hidden sm:flex items-center gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/50' : 'bg-white/5 text-muted-foreground hover:bg-white/10 border border-transparent'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-2 bg-white/5 border border-white/5 rounded-lg disabled:opacity-20 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
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
