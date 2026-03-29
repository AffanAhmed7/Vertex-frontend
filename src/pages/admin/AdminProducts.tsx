import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import { RootState } from '../../store';
import { addToast } from '../../store/slices/toastSlice';
import { setProducts, setLoading, AdminProduct } from '../../store/slices/adminSlice';
import { fetchAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct, fetchCategories } from '../../services/adminService';
import AdminTable from '../../components/admin/AdminTable';
import ProductFormModal from '../../components/admin/ProductFormModal';
import AdminVault from '../../components/admin/AdminVault';

const AdminProducts: React.FC = () => {
    const dispatch = useDispatch();
    const { products, loading, searchQuery } = useSelector((state: RootState) => state.admin);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<AdminProduct | null>(null);
    const [filterCategory, setFilterCategory] = useState<string | null>(null);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [categoryList, setCategoryList] = useState<{ id: string; name: string }[]>([]);
    
    // Vault State
    const [isVaultOpen, setIsVaultOpen] = useState(false);
    const [vaultAction, setVaultAction] = useState<{ type: 'save' | 'delete', data?: any } | null>(null);

    // Fetch products + categories on mount
    useEffect(() => {
        const load = async () => {
            dispatch(setLoading(true));
            try {
                const [prods, cats] = await Promise.all([fetchAdminProducts(), fetchCategories()]);
                dispatch(setProducts(prods));
                if (Array.isArray(cats)) setCategoryList(cats);
            } catch (err) {
                console.error('Failed to load products', err);
            } finally {
                dispatch(setLoading(false));
            }
        };
        load();
    }, [dispatch]);

    const maxStock = Math.max(...products.map(p => p.stock), 1);

    const categories = Array.from(new Set(products.map(p => p.category)));

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !filterCategory || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const columns = [
        {
            key: 'name',
            label: 'Product Architecture',
            render: (name: string, p: AdminProduct) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                        <img src={p.image} alt={name} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                        <p className="font-semibold text-white group-hover:text-primary transition-colors">{name}</p>
                        <p className="text-xs text-muted-foreground">{p.sku}</p>
                    </div>
                </div>
            )
        },
        { key: 'category', label: 'Sector' },
        {
            key: 'price',
            label: 'Valuation',
            render: (price: number) => <span className="font-medium text-white">${price}</span>
        },
        {
            key: 'stock',
            label: 'Capacity',
            render: (stock: number) => (
                <div className="space-y-1">
                    <span className="text-xs font-medium text-white">{stock} Units</span>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((stock / maxStock) * 100, 100)}%` }}
                            className={`h-full ${stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        />
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Deployment Status',
            render: (status: string) => (
                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${status === 'In Stock' ? 'text-emerald-500 bg-emerald-500/10' :
                    status === 'Low Stock' ? 'text-amber-500 bg-amber-500/10' :
                        'text-rose-500 bg-rose-500/10'
                    }`}>
                    {status}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Operations',
            render: (_: any, p: AdminProduct) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(p);
                            setIsModalOpen(true);
                        }}
                        className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-all shadow-lg active:scale-95 group/btn"
                    >
                        <Edit2 size={14} className="group-hover/btn:text-primary transition-colors" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(p);
                        }}
                        className="p-2 hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-500 transition-all shadow-lg active:scale-95"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )
        }
    ];

    const mobileRender = (p: AdminProduct) => (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-50" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white">{p.name}</h4>
                    <p className="text-xs text-muted-foreground">{p.sku}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-medium text-white">${p.price}</p>
                <p className={`text-xs font-semibold ${p.stock < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {p.stock} Units
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">Catalog Core</h1>
                    <p className="text-[9px] text-[#00f2ff]/40 uppercase tracking-[0.4em] font-black">Infrastructure Assets <span className="text-white/10 mx-2">/</span> Product Management</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 relative">
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                            className={`p-2.5 border rounded-xl transition-all shadow-lg active:scale-95 ${isFilterMenuOpen ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-muted-foreground hover:text-white'}`}
                        >
                            <Filter size={20} />
                        </button>

                        <AnimatePresence>
                            {isFilterMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-48 bg-[#1a1a1e] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden"
                                >
                                    <button
                                        onClick={() => {
                                            setFilterCategory(null);
                                            setIsFilterMenuOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${!filterCategory ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
                                    >
                                        All Sectors
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setFilterCategory(cat);
                                                setIsFilterMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${filterCategory === cat ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={() => {
                            setSelectedProduct(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white/[0.03] border border-white/5 text-white/70 rounded-full text-xs font-medium hover:bg-white/10 hover:text-white transition-all shadow-xl active:scale-95"
                    >
                        <Plus size={16} /> New Asset
                    </button>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={filteredProducts}
                isLoading={loading}
                mobileCardRender={mobileRender}
                onRowClick={(p) => {
                    setSelectedProduct(p);
                    setIsModalOpen(true);
                }}
            />

            <ProductFormModal
                isOpen={isModalOpen}
                initialData={selectedProduct}
                categories={categories}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(data) => {
                    setVaultAction({ type: 'save', data });
                    setIsVaultOpen(true);
                }}
            />

            {/* Deletion Confirmation Modal */}
            <AnimatePresence>
                {confirmDelete && (
                    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmDelete(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm bg-[#0a0a0b] border border-white/5 rounded-3xl p-8 shadow-2xl space-y-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto">
                                <ShieldAlert size={32} />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold tracking-tight text-white">Critical Asset Termination</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Are you certain you want to decommission <span className="text-white font-bold">{confirmDelete.name}</span>?
                                    This action will permanently purge the asset from infrastructure records.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-medium transition-all text-white/50 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setVaultAction({ type: 'delete', data: confirmDelete });
                                        setIsVaultOpen(true);
                                    }}
                                    className="flex-1 px-4 py-3 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-lg shadow-rose-500/20"
                                >
                                    Terminate
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* OTP Vault */}
            <AdminVault
                isOpen={isVaultOpen}
                onClose={() => {
                    setIsVaultOpen(false);
                    setVaultAction(null);
                }}
                onSuccess={async () => {
                    if (!vaultAction) return;

                    if (vaultAction.type === 'save') {
                        const data = vaultAction.data;
                        try {
                            let categoryId = categoryList.find(c => c.name === data.category)?.id || '';
                            if (data.id) {
                                await updateAdminProduct(data.id, {
                                    name: data.name,
                                    price: Number(data.price),
                                    stock: Number(data.stock),
                                    sku: data.sku,
                                    description: data.description || undefined,
                                    image: data.image || undefined,
                                    ...(categoryId ? { categoryId } : {}),
                                });
                            } else {
                                if (!categoryId && categoryList.length > 0) categoryId = categoryList[0].id;
                                await createAdminProduct({
                                    name: data.name,
                                    price: Number(data.price),
                                    stock: Number(data.stock),
                                    sku: data.sku,
                                    description: data.description || undefined,
                                    image: data.image || undefined,
                                    categoryId,
                                });
                            }
                            const prods = await fetchAdminProducts();
                            dispatch(setProducts(prods));
                            dispatch(addToast({ message: 'Product configuration synchronized.', type: 'success' }));
                            setIsModalOpen(false);
                        } catch (err: any) {
                            const msg = err.response?.data?.message || err.response?.data?.error || 'Product save failed';
                            dispatch(addToast({ message: msg, type: 'error' }));
                        }
                    } else if (vaultAction.type === 'delete') {
                        const product = vaultAction.data;
                        try {
                            await deleteAdminProduct(product.id);
                            const prods = await fetchAdminProducts();
                            dispatch(setProducts(prods));
                            dispatch(addToast({ message: 'Asset decommissioned successfully.', type: 'success' }));
                            setConfirmDelete(null);
                        } catch (err: any) {
                            const msg = err.response?.data?.message || err.response?.data?.error || 'Delete failed';
                            dispatch(addToast({ message: msg, type: 'error' }));
                        }
                    }
                    setVaultAction(null);
                }}
                actionLabel={vaultAction?.type === 'save' ? "save product configuration" : "decommission asset"}
            />
        </div>
    );
};

export default AdminProducts;
