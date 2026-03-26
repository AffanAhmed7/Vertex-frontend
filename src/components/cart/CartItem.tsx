import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { CartItem as CartItemType, syncRemoveFromCart, syncUpdateQuantity } from '../../store/slices/cartSlice';
import { AppDispatch } from '../../store';
import { Card } from '../ui/Card';

interface CartItemProps {
    item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleRemove = () => {
        dispatch(syncRemoveFromCart({ id: item.id, variants: item.selectedVariants }));
    };

    const handleQuantityChange = (delta: number) => {
        dispatch(syncUpdateQuantity({
            id: item.id,
            variants: item.selectedVariants,
            quantity: item.quantity + delta
        }));
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
        >
            <Card
                enableTilt
                glass
                className="flex flex-col sm:flex-row items-center gap-6 p-6 group border-white/[0.03] hover:border-primary/30 transition-all duration-500"
            >
                {/* Product Image */}
                <div className="relative w-32 h-32 overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                </div>

                {/* Product Info */}
                <div className="flex-grow min-w-0 space-y-3">
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors line-clamp-1">
                            {item.name}
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            {item.selectedVariants && Object.entries(item.selectedVariants).map(([key, value]) => (
                                <div key={key} className="flex flex-col">
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-50">{key}</span>
                                    <span className="text-xs text-white/70 font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <p className="text-base font-bold text-[#00f2ff] tracking-tight">
                            ${item.price.toLocaleString()}
                        </p>
                        <div className="w-px h-3 bg-white/10" />
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">In Local Stock</span>
                    </div>
                </div>

                {/* Controls Area */}
                <div className="flex items-center gap-8 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 hover:border-primary/50 hover:text-primary disabled:opacity-20 transition-all"
                        >
                            <Minus size={14} />
                        </button>
                        <motion.span
                            key={item.quantity}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-4 text-center text-sm font-bold font-mono"
                        >
                            {item.quantity}
                        </motion.span>
                        <button
                            onClick={() => handleQuantityChange(1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 hover:border-primary/50 hover:text-primary transition-all"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* Subtotal */}
                    <div className="w-24 text-right hidden lg:block">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-0.5 opacity-50">Subtotal</p>
                        <p className="text-lg font-light tracking-tight text-white">
                            ${(item.price * item.quantity).toLocaleString()}
                        </p>
                    </div>

                    {/* Remove */}
                    <button
                        onClick={handleRemove}
                        className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </Card>
        </motion.div>
    );
};

export default CartItem;
