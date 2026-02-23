import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, DollarSign, CheckCircle, Plus } from 'lucide-react';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
    categories?: string[];
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSubmit, initialData, categories }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        price: '',
        stock: '',
        status: 'In Stock',
        description: '',
        image: ''
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                price: initialData.price.toString(),
                stock: initialData.stock.toString(),
            });
            setImagePreview(initialData.image);
        } else {
            setFormData({
                name: '',
                sku: '',
                category: '',
                price: '',
                stock: '',
                status: 'In Stock',
                description: '',
                image: ''
            });
            setImagePreview(null);
        }
    }, [initialData, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setFormData({ ...formData, image: result });
            };
            reader.readAsDataURL(file);
        }
    };

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
                        className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] bg-[#0a0a0b] border border-white/5 rounded-3xl overflow-hidden shadow-2xl z-[301] flex flex-col"
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
                                <h3 className="text-2xl font-semibold tracking-tight">SUCCESSFULLY INGESTED</h3>
                                <p className="text-muted-foreground text-xs font-medium">Product registered in infrastructure</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0 overflow-hidden">
                                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <div>
                                        <h3 className="text-2xl font-light text-white uppercase tracking-tighter">
                                            {initialData ? 'Update Asset' : 'Register Product'}
                                        </h3>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                                            {initialData ? 'Modify Infrastructure Entity' : 'Infrastructure Catalog Addition'}
                                        </p>
                                    </div>
                                    <button type="button" onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto hide-scrollbar p-8 space-y-8">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Internal Name</label>
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
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Strategic Sector</label>
                                            <input
                                                required
                                                list="category-suggestions"
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-sm text-white focus:border-primary outline-none transition-all"
                                                placeholder="Category..."
                                            />
                                            <datalist id="category-suggestions">
                                                {categories?.map(cat => (
                                                    <option key={cat} value={cat} />
                                                ))}
                                            </datalist>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">SKU Designator</label>
                                            <input
                                                required
                                                value={formData.sku}
                                                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-sm text-white focus:border-primary outline-none transition-all tracking-widest uppercase"
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

                                    <div className="space-y-4">
                                        <label className="text-xs font-medium text-muted-foreground">Local Asset Ingestion</label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="group relative aspect-video rounded-2xl bg-white/5 border border-dashed border-white/20 hover:border-primary/50 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-2"
                                        >
                                            {imagePreview ? (
                                                <>
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <p className="text-xs font-medium text-white bg-black/60 px-4 py-2 rounded-full backdrop-blur-md">Change Selection</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                                        <Plus size={24} />
                                                    </div>
                                                    <p className="text-xs font-medium text-muted-foreground">Select Infrastructure Visual</p>
                                                </>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">Operational Specs/Description</label>
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
                                    <button type="button" onClick={onClose} className="px-6 py-3 text-xs font-medium text-muted-foreground hover:text-white transition-colors">
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-white/[0.05] hover:bg-white/10 border border-white/10 hover:border-primary/50 text-white rounded-xl text-xs font-medium disabled:opacity-50 transition-all shadow-xl"
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
