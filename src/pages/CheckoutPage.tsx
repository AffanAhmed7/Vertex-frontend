import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';
import { RootState } from '../store';
import { setProcessing, completeOrder } from '../store/slices/cartSlice';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSuccess from '../components/checkout/OrderSuccess';
import { Button } from '../components/ui/Button';

const CheckoutPage: React.FC = () => {
    const dispatch = useDispatch();
    const { items, shipping, taxRate, isProcessing, orderSuccess } = useSelector((state: RootState) => state.cart);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    const handleCheckout = () => {
        dispatch(setProcessing(true));
        // Simulate payment processing
        setTimeout(() => {
            dispatch(completeOrder());
        }, 2500);
    };

    if (items.length === 0 && !orderSuccess) {
        return <Navigate to="/cart" replace />;
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-6">
            <div className="container mx-auto max-w-7xl">
                <AnimatePresence mode="wait">
                    {orderSuccess ? (
                        <OrderSuccess key="success" />
                    ) : (
                        <motion.div
                            key="checkout"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
                        >
                            {/* Left Column: Forms */}
                            <div className="lg:col-span-8 space-y-12">
                                <div className="space-y-4">
                                    <Link
                                        to="/cart"
                                        className="group flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                        Back to Selection
                                    </Link>
                                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground uppercase italic underline decoration-primary decoration-4 underline-offset-8">
                                        Secure <span className="text-primary italic">Checkout</span>
                                    </h1>
                                </div>

                                <CheckoutForm />
                            </div>

                            {/* Right Column: Sticky Summary */}
                            <div className="lg:col-span-4 sticky top-28 space-y-6">
                                <div className="bg-card/40 border border-white/5 rounded-2xl p-6 space-y-6 backdrop-blur-xl">
                                    <h2 className="text-xl font-bold tracking-tight text-foreground uppercase italic underline decoration-primary decoration-2 underline-offset-4">
                                        Order Summary
                                    </h2>

                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {items.map((item) => (
                                            <div key={`${item.id}-${JSON.stringify(item.selectedVariants)}`} className="flex gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <h4 className="text-xs font-bold truncate">{item.name}</h4>
                                                    <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="text-xs font-bold">${(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-white/5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="text-foreground">${subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span className="text-foreground">${shipping.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Tax</span>
                                            <span className="text-foreground">${tax.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-end pt-3 text-lg font-black tracking-tight text-primary">
                                            <span>Total</span>
                                            <span>${total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-14 rounded-xl text-lg relative overflow-hidden"
                                        onClick={handleCheckout}
                                        isLoading={isProcessing}
                                        disabled={isProcessing}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Lock size={18} />
                                            Complete Partner Integration
                                        </div>
                                    </Button>

                                    <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                                        <Lock size={10} />
                                        256-Bit SSL Encrypted
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CheckoutPage;
