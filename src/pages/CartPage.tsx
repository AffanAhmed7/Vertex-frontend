import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ShoppingCart, Activity } from 'lucide-react';
import { RootState } from '../store';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { Button } from '../components/ui/Button';

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const { items } = useSelector((state: RootState) => state.cart);

    return (
        <div className="relative min-h-screen pt-24 pb-20 px-6 overflow-hidden">
            {/* ── Procedural Background ── */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Subtle Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Floating Glow Orbs */}
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#00f2ff]/30 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 60, 0],
                        opacity: [0.05, 0.15, 0.05]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-emerald-500/20 blur-[140px] rounded-full"
                />
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5 text-primary">
                            <ShoppingCart size={16} className="text-[#00f2ff]" />
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">Deployment Queue</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-light tracking-[0.1em] text-white uppercase leading-none">
                            Your <span className="text-primary font-medium">Selection</span>
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-md font-medium opacity-80">
                            Review and manage your selected commerce infrastructure modules before finalizing system integration.
                        </p>
                    </div>

                    <Link
                        to="/shop"
                        className="group flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all duration-300"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Explore Modules
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
                            <h2 className="text-2xl font-light tracking-widest text-white uppercase">Queue Empty</h2>
                            <p className="text-sm text-muted-foreground max-w-xs mb-8 font-medium">
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
