import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { CartItem as CartItemType, removeFromCart, updateQuantity } from '../../store/slices/cartSlice';
import { Button } from '../ui/Button';

interface CartItemProps {
    item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
    const dispatch = useDispatch();

    const handleRemove = () => {
        dispatch(removeFromCart({ id: item.id, variants: item.selectedVariants }));
    };

    const handleQuantityChange = (delta: number) => {
        dispatch(updateQuantity({
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
            className="flex items-center gap-6 p-6 bg-card/40 border border-white/5 rounded-2xl group hover:border-primary/20 transition-colors"
        >
            {/* Product Image */}
            <div className="relative w-24 h-24 overflow-hidden rounded-xl bg-muted shrink-0">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* Product Info */}
            <div className="flex-grow min-w-0">
                <h3 className="text-lg font-bold text-foreground line-clamp-1">{item.name}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                    {item.selectedVariants && Object.entries(item.selectedVariants).map(([key, value]) => (
                        <span key={key} className="text-xs text-muted-foreground uppercase tracking-wider">
                            {key}: <span className="text-foreground font-medium">{value}</span>
                        </span>
                    ))}
                </div>
                <p className="mt-2 text-primary font-bold">
                    ${item.price.toLocaleString()}
                </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-full px-2 py-1">
                <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={item.quantity <= 1}
                    className="p-1.5 hover:text-primary disabled:opacity-30 transition-colors"
                >
                    <Minus size={16} />
                </button>
                <motion.span
                    key={item.quantity}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-6 text-center text-sm font-bold"
                >
                    {item.quantity}
                </motion.span>
                <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-1.5 hover:text-primary transition-colors"
                >
                    <Plus size={16} />
                </button>
            </div>

            {/* Total Item Price */}
            <div className="w-24 text-right hidden md:block">
                <p className="text-lg font-black tracking-tight">
                    ${(item.price * item.quantity).toLocaleString()}
                </p>
            </div>

            {/* Remove Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
                <Trash2 size={18} />
            </Button>
        </motion.div>
    );
};

export default CartItem;
