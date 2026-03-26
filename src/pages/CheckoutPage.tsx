import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';
import { RootState, AppDispatch } from '../store';
import { processCheckout } from '../store/slices/cartSlice';
import { addToast } from '../store/slices/toastSlice';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSuccess from '../components/checkout/OrderSuccess';
import { Button } from '../components/ui/Button';

const CheckoutPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser, addresses } = useSelector((state: RootState) => state.user);
    const { items, shipping, taxRate, isProcessing, orderSuccess } = useSelector((state: RootState) => state.cart);

    const [shippingData, setShippingData] = React.useState({
        email: currentUser?.email || '',
        shippingName: currentUser?.name || '',
        shippingPhone: '',
        shippingAddress: '',
        shippingCity: '',
        shippingZip: '',
        shippingCountry: ''
    });

    // Removed automatic pre-fill to give user manual control (autofill option)
    React.useEffect(() => {
        // We only fetch addresses here, selection is manual via CheckoutForm
    }, [addresses]);

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    const handleCheckout = async () => {
        // Strict client-side validation
        const validationRules = [
            { key: 'email', label: 'Email Address', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, patternMsg: 'Invalid email format' },
            { key: 'shippingName', label: 'Full Name', required: true },
            { key: 'shippingPhone', label: 'Phone Number', required: true, length: 11 },
            { key: 'shippingAddress', label: 'Street Address', required: true },
            { key: 'shippingCity', label: 'City', required: true },
            { key: 'shippingZip', label: 'Postal Code', required: true },
            { key: 'shippingCountry', label: 'Country', required: true },
        ];

        for (const rule of validationRules) {
            const value = shippingData[rule.key as keyof typeof shippingData]?.trim();
            
            if (rule.required && !value) {
                dispatch(addToast({ message: `${rule.label} is required`, type: 'error' }));
                return;
            }

            if (rule.length && value.length !== rule.length) {
                dispatch(addToast({ message: `${rule.label} must be exactly ${rule.length} digits`, type: 'error' }));
                return;
            }

            if (rule.pattern && !rule.pattern.test(value)) {
                dispatch(addToast({ message: rule.patternMsg, type: 'error' }));
                return;
            }
        }

        try {
            await dispatch(processCheckout(shippingData)).unwrap();
        } catch (error: any) {
            console.error('Checkout failed:', error);
            // Error messaging is already handled by toast inside processCheckout thunk
        }
    };

    if (items.length === 0 && !orderSuccess) {
        return <Navigate to="/cart" replace />;
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-6 bg-[#0a0a0c]" style={{ fontFamily: "'Outfit', sans-serif" }}>
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
                                        Back to Cart
                                    </Link>
                                    <h1 className="text-4xl md:text-5xl font-light tracking-[0.1em] text-white uppercase italic">
                                        Secure <span className="text-primary font-medium tracking-normal">Checkout</span>
                                    </h1>
                                </div>

                                <div className="bg-[#111114]/60 border border-white/5 rounded-3xl p-8 backdrop-blur-3xl shadow-2xl">
                                    <CheckoutForm formData={shippingData} setFormData={setShippingData} addresses={addresses} />
                                </div>
                            </div>

                            {/* Right Column: Sticky Summary */}
                            <div className="lg:col-span-4 sticky top-28 space-y-6">
                                <div className="bg-[#111114]/60 border border-white/5 rounded-3xl p-8 backdrop-blur-3xl shadow-2xl space-y-8">
                                    <h2 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">
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
                                            Confirm Purchase
                                        </div>
                                    </Button>

                                    {/* Trust Badges */}
                                    <div className="pt-6 grid grid-cols-2 gap-4 border-t border-white/5">
                                        <div className="text-center space-y-1">
                                            <p className="text-[10px] font-bold text-foreground">Secure Payment</p>
                                            <p className="text-[8px] text-muted-foreground">SSL Encrypted</p>
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-[10px] font-bold text-foreground">Money Back</p>
                                            <p className="text-[8px] text-muted-foreground">30-Day Guarantee</p>
                                        </div>
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
