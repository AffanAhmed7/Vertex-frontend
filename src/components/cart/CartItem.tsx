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
                className="group border-white/[0.03] hover:border-primary/30 transition-all duration-500"
            >
                <div className="flex flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6 w-full">
                {/* Product Image */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                </div>

                {/* Product Info */}
                <div className="flex-grow min-w-0">
                    <div className="space-y-1">
                        <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                            {item.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4">
                            {item.selectedVariants && Object.entries(item.selectedVariants).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-1.5 whitespace-nowrap">
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-black opacity-60">{key}:</span>
                                    <span className="text-xs text-white/80 font-semibold">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Controls Area: Price, Quantity, Subtotal, Delete */}
                <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl max-w-full">
                    
                    {/* Price */}
                    <div className="flex items-center gap-3 shrink-0">
                        <p className="text-base font-bold text-[#00f2ff] tracking-tight">
                            ${item.price.toLocaleString()}
                        </p>
                        <div className="hidden sm:block w-px h-4 bg-white/10" />
                    </div>

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

                    <button
                        onClick={handleRemove}
                        className="p-2 shrink-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all ml-auto"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default CartItem;
