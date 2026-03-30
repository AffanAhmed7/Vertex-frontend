import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Ticket } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { openAuthModal } from '../../store';

const CartSummary: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, shipping, taxRate } = useSelector((state: RootState) => state.cart);
    const { currentUser } = useSelector((state: RootState) => state.user);
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
            <div className="bg-[#111114]/60 border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6 lg:space-y-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none" />

                <div className="space-y-1 relative z-10">
                    <h2 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">Order Summary</h2>
                    <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="space-y-5 relative z-10">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">Subtotal</span>
                        <span className="text-white font-semibold">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium">Shipping</span>
                        </div>
                        <span className="text-white font-semibold">${shipping === 0 ? '0' : shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-white/40">
                        <span className="font-medium">Estimated Tax</span>
                        <span className="font-semibold">${tax.toLocaleString()}</span>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Total Amount</span>
                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-50">Includes tax & shipping</p>
                            </div>
                            <div className="text-right">
                                <motion.p
                                    key={total}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-4xl font-light tracking-tighter text-white"
                                >
                                    ${total.toLocaleString()}
                                </motion.p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 relative z-10">
                    <div className="flex gap-2">
                        <Input
                            label="Promo Code"
                            placeholder="SYSTEM_KEY"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            className="bg-white/[0.02] border-white/5 h-11 text-xs tracking-widest uppercase font-bold"
                            icon={<Ticket size={18} />}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleApplyDiscount}
                            isLoading={isApplying}
                            className="border-white/10 px-6 h-11"
                        >
                            Log
                        </Button>
                    </div>

                    <Button
                        className="w-full h-14 rounded-xl text-xs font-bold uppercase tracking-[0.2em] group relative overflow-hidden bg-gradient-to-r from-[#00f2ff] to-[#00d8e6] text-black hover:shadow-[0_0_30px_#00f2ff40] transition-all duration-500"
                        onClick={() => currentUser ? navigate('/checkout') : dispatch(openAuthModal('login'))}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {currentUser ? 'Proceed to Checkout' : 'Login to Checkout'}
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                &rarr;
                            </motion.span>
                        </span>
                    </Button>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-4 px-2">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/5 group hover:border-primary/20 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                        <ShieldCheck size={18} className="text-primary opacity-50" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Secure Checkout</p>
                        <p className="text-[11px] text-white/60 leading-relaxed font-medium">Your transaction is protected with industry-standard encryption.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/5 group hover:border-secondary/20 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-secondary/5 flex items-center justify-center shrink-0 border border-secondary/10">
                        <Truck size={18} className="text-secondary opacity-50" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Premium Delivery</p>
                        <p className="text-[11px] text-white/60 leading-relaxed font-medium">Free express shipping on all orders over $500.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;
