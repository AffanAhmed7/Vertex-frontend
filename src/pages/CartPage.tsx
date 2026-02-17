import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ShoppingCart } from 'lucide-react';
import { RootState } from '../store';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { Button } from '../components/ui/Button';

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const { items } = useSelector((state: RootState) => state.cart);

    return (
        <div className="min-h-screen pt-24 pb-20 px-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <ShoppingCart size={18} />
                            <span className="text-xs font-bold tracking-[0.2em] uppercase">Deployment Queue</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground uppercase italic underline decoration-primary decoration-4 underline-offset-8">
                            Your <span className="text-primary italic">Selection</span>
                        </h1>
                        <p className="text-muted-foreground max-w-md">
                            Review and manage your selected commerce infrastructure modules before finalizing system integration.
                        </p>
                    </div>

                    <Link
                        to="/shop"
                        className="group flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Continue Exploring
                    </Link>
                </div>

                <AnimatePresence mode="wait">
                    {items.length === 0 ? (
                        /* Empty State */
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center py-20 text-center"
                        >
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
                                <div className="relative w-32 h-32 rounded-3xl bg-card border border-white/5 flex items-center justify-center shadow-2xl">
                                    <ShoppingBag size={48} className="text-primary/40" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mb-3 uppercase italic">Selection Empty</h2>
                            <p className="text-muted-foreground max-w-xs mb-8">
                                No infrastructure modules have been added to your current deployment queue.
                            </p>
                            <Button size="lg" onClick={() => navigate('/shop')}>
                                Explore Modules
                            </Button>
                        </motion.div>
                    ) : (
                        /* Cart Content */
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
                        >
                            {/* Items List */}
                            <div className="lg:col-span-8 space-y-4">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 mb-4 text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                                    <span>Product Details</span>
                                    <div className="flex gap-20 mr-24">
                                        <span className="hidden md:block">Quantity</span>
                                        <span className="hidden md:block">Price</span>
                                    </div>
                                </div>
                                <AnimatePresence initial={false}>
                                    {items.map((item) => (
                                        <CartItem key={`${item.id}-${JSON.stringify(item.selectedVariants)}`} item={item} />
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Summary Column */}
                            <div className="lg:col-span-4 sticky top-28">
                                <CartSummary />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CartPage;
