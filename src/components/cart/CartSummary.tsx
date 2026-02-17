import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck } from 'lucide-react';

const CartSummary: React.FC = () => {
    const navigate = useNavigate();
    const { items, shipping, taxRate } = useSelector((state: RootState) => state.cart);
    const [discountCode, setDiscountCode] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    const handleApplyDiscount = () => {
        setIsApplying(true);
        setTimeout(() => setIsApplying(false), 1500); // Mock delay
    };

    return (
        <div className="space-y-6">
            <div className="bg-card/40 border border-white/5 rounded-2xl p-6 space-y-6 backdrop-blur-xl">
                <h2 className="text-xl font-bold tracking-tight text-foreground uppercase italic underline decoration-primary decoration-2 underline-offset-4">
                    Order Summary
                </h2>

                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground font-medium">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Estimate Shipping</span>
                        <span className="text-foreground font-medium">${shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Estimated Tax</span>
                        <span className="text-foreground font-medium">${tax.toLocaleString()}</span>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <div className="flex justify-between items-end">
                            <span className="text-base font-bold text-foreground">Total</span>
                            <div className="text-right">
                                <motion.p
                                    key={total}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-3xl font-black tracking-tighter text-primary"
                                >
                                    ${total.toLocaleString()}
                                </motion.p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="flex gap-2">
                        <Input
                            label="Discount Code"
                            placeholder="Enter code"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            className="bg-black/20 border-white/5 h-10 text-sm"
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleApplyDiscount}
                            isLoading={isApplying}
                            className="border-white/10"
                        >
                            Apply
                        </Button>
                    </div>

                    <Button
                        className="w-full h-14 rounded-xl text-lg group"
                        onClick={() => navigate('/checkout')}
                    >
                        Proceed to Checkout
                        <motion.span
                            className="ml-2 inline-block"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            &rarr;
                        </motion.span>
                    </Button>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 gap-4 px-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <ShieldCheck size={16} className="text-primary" />
                    </div>
                    <p>Secure checkout with SSL encryption and enterprise-grade data protection.</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                        <Truck size={16} className="text-secondary" />
                    </div>
                    <p>Insured worldwide shipping with real-time tracking from our global nodes.</p>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;
