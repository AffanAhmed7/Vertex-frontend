import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, DollarSign, CheckCircle, Plus, Hash, Layers } from 'lucide-react';
import { Input } from '../ui/Input';

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
                price: initialData.price?.toString() || '',
                stock: initialData.stock?.toString() || '',
                description: initialData.description || '',
                image: initialData.image || ''
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit(formData);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Product submission failed', err);
        } finally {
            setIsSubmitting(false);
        }
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
                        className="fixed inset-0 m-auto w-[92%] sm:w-full max-w-lg h-fit max-h-[90vh] bg-[#0a0a0b] border border-white/5 rounded-3xl overflow-hidden shadow-2xl z-[301] flex flex-col"
                    >
                        {showSuccess ? (
                            <div className="p-12 sm:p-20 flex flex-col items-center justify-center text-center space-y-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"
                                >
                                    <CheckCircle size={32} className="sm:w-12 sm:h-12" />
                                </motion.div>
                                <div className="space-y-2">
                                    <h3 className="text-xl sm:text-3xl font-light text-white uppercase tracking-tighter">Asset Synchronized</h3>
                                    <p className="text-[10px] sm:text-sm text-muted-foreground uppercase tracking-widest leading-relaxed">
                                        The infrastructure core has been updated<br/>with the latest product design data.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0 overflow-hidden">
                                <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <div>
                                        <h3 className="text-base sm:text-2xl font-light text-white uppercase tracking-tighter">
                                            {initialData ? 'Update Asset' : 'Register Product'}
                                        </h3>
                                        <p className="text-[8px] sm:text-xs text-muted-foreground uppercase tracking-widest mt-1">
                                            {initialData ? 'Modify Infrastructure Entity' : 'Infrastructure Catalog Addition'}
                                        </p>
                                    </div>
                                    <button type="button" onClick={onClose} className="p-1.5 sm:p-2 hover:bg-white/5 rounded-xl transition-colors">
                                        <X size={18} className="sm:w-6 sm:h-6" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-8 space-y-5 sm:space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <Input 
                                            label="Internal Name" 
                                            placeholder="Product name..." 
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            icon={<Package size={16} />}
                                        />
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2 flex items-center gap-2">
                                                <Layers size={14} className="text-[#00f2ff]/60" /> Strategic Sector
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={formData.category}
                                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 sm:py-3 px-4 text-xs sm:text-sm text-white focus:border-[#00f2ff] outline-none transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled className="bg-[#0a0a0b] text-white/40">Select Sector...</option>
                                                    {categories?.map(cat => (
                                                        <option key={cat} value={cat} className="bg-[#0a0a0b] text-white">
                                                            {cat}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                                    <Plus size={14} className="rotate-45" />
                                                </div>
                                            </div>
                                        </div>
                                        <Input 
                                            label="SKU Designator" 
                                            placeholder="VTX-0000" 
                                            value={formData.sku}
                                            onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                            required
                                            className="tracking-widest uppercase"
                                            icon={<Hash size={16} />}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                                        <Input 
                                            label="Standard Price" 
                                            type="number"
                                            placeholder="0.00" 
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            required
                                            icon={<DollarSign size={16} />}
                                        />
                                        <Input 
                                            label="Inventory Units" 
                                            type="number"
                                            placeholder="0" 
                                            value={formData.stock}
                                            onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                            required
                                            icon={<Package size={16} />}
                                        />
                                        <div className="space-y-2 col-span-2 sm:col-span-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Projected Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 sm:py-3 px-4 text-xs sm:text-sm text-white focus:border-[#00f2ff] outline-none transition-all appearance-none"
                                            >
                                                <option className="bg-[#0a0a0b] text-white">In Stock</option>
                                                <option className="bg-[#0a0a0b] text-white">Low Stock</option>
                                                <option className="bg-[#0a0a0b] text-white">Out of Stock</option>
                                                <option className="bg-[#0a0a0b] text-white">Draft</option>
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

                                <div className="p-4 sm:p-8 border-t border-white/5 bg-white/[0.02] flex items-center justify-end gap-3 sm:gap-4">
                                    <button type="button" onClick={onClose} className="px-4 py-2 sm:py-3 text-[9px] sm:text-xs font-medium text-muted-foreground hover:text-white transition-colors">
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 sm:px-8 py-2 sm:py-3 bg-white/[0.05] hover:bg-white/10 border border-white/10 hover:border-[#00f2ff]/50 text-white rounded-xl text-[9px] sm:text-xs font-medium disabled:opacity-50 transition-all shadow-xl"
                                    >
                                        {isSubmitting ? 'Processing...' : (initialData ? 'Update Asset' : 'Add Asset')}
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
