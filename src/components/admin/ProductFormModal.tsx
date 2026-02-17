import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, DollarSign, CheckCircle } from 'lucide-react';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        price: '',
        stock: '',
        status: 'In Stock',
        description: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API delay
        setTimeout(() => {
            onSubmit(formData);
            setIsSubmitting(false);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onClose();
            }, 1500);
        }, 1000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] bg-[#0a0a0b] border border-white/5 rounded-3xl overflow-hidden shadow-2xl z-[301]"
                    >
                        {showSuccess ? (
                            <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"
                                >
                                    <CheckCircle size={40} />
                                </motion.div>
                                <h3 className="text-2xl font-black italic tracking-tighter">SUCCESSFULLY INGESTED</h3>
                                <p className="text-muted-foreground uppercase tracking-widest text-[10px]">Product registered in infrastructure</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <div>
                                        <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">Register Product</h3>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Infrastructure Catalog Addition</p>
                                    </div>
                                    <button type="button" onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="p-8 overflow-y-auto space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Internal Name</label>
                                            <div className="relative">
                                                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                                <input
                                                    required
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:border-primary outline-none transition-all"
                                                    placeholder="Product name..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">SKU Designator</label>
                                            <input
                                                required
                                                value={formData.sku}
                                                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-sm text-white focus:border-primary outline-none transition-all font-mono"
                                                placeholder="VTX-0000"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Standard Price</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                                <input
                                                    type="number"
                                                    required
                                                    value={formData.price}
                                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:border-primary outline-none transition-all"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Inventory Units</label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.stock}
                                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-sm text-white focus:border-primary outline-none transition-all"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Projected Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-sm text-white focus:border-primary outline-none transition-all"
                                            >
                                                <option>In Stock</option>
                                                <option>Low Stock</option>
                                                <option>Out of Stock</option>
                                                <option>Draft</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operational Specs/Description</label>
                                        <textarea
                                            rows={3}
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-primary outline-none transition-all resize-none"
                                            placeholder="Detailed product specification..."
                                        />
                                    </div>
                                </div>

                                <div className="p-8 border-t border-white/5 bg-white/[0.02] flex items-center justify-end gap-4">
                                    <button type="button" onClick={onClose} className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                                    >
                                        {isSubmitting ? 'Processing...' : 'Confirm Ingestion'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProductFormModal;
