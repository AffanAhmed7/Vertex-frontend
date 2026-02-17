import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Trash2 } from 'lucide-react';
import { RootState } from '../../store';
import { addProduct, deleteProduct, AdminProduct } from '../../store/slices/adminSlice';
import AdminTable from '../../components/admin/AdminTable';
import ProductFormModal from '../../components/admin/ProductFormModal';

const AdminProducts: React.FC = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state: RootState) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <p className="font-bold text-white group-hover:text-primary transition-colors">{name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{p.sku}</p>
                    </div>
                </div>
            )
        },
        { key: 'category', label: 'Sector' },
        {
            key: 'price',
            label: 'Valuation',
            render: (price: number) => <span className="font-medium text-white tracking-widest">${price}</span>
        },
        {
            key: 'stock',
            label: 'Capacity',
            render: (stock: number) => (
                <div className="space-y-1">
                    <span className="text-xs font-bold text-white">{stock} Units</span>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((stock / 50) * 100, 100)}%` }}
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
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${status === 'In Stock' ? 'text-emerald-500 bg-emerald-500/10' :
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
                    <button className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-all shadow-lg active:scale-95">
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(deleteProduct(p.id));
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
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{p.sku}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-medium text-white">${p.price}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${p.stock < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>
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

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-white/5 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:border-primary/50 outline-none transition-all w-full md:w-64"
                            placeholder="Identify asset (Name/SKU)..."
                        />
                    </div>
                    <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-muted-foreground hover:text-white transition-all shadow-lg active:scale-95">
                        <Filter size={20} />
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white/[0.03] border border-white/5 text-white/70 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all shadow-xl active:scale-95"
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
                onRowClick={(p) => console.log('Edit', p)}
            />

            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(data) => {
                    dispatch(addProduct({
                        id: Math.random().toString(36).substr(2, 9),
                        ...data,
                        price: Number(data.price),
                        stock: Number(data.stock),
                        image: '/products/placeholder.jpg'
                    }));
                }}
            />
        </div>
    );
};

export default AdminProducts;
