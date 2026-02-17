import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { resetCheckout } from '../../store/slices/cartSlice';

const OrderSuccess: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { lastOrderId } = useSelector((state: RootState) => state.cart);

    useEffect(() => {
        return () => {
            dispatch(resetCheckout());
        };
    }, [dispatch]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-8"
        >
            <div className="relative">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                    className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                >
                    <CheckCircle2 size={64} />
                </motion.div>
                {/* Decorative rings */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.5 }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0 border-2 border-primary/20 rounded-full -z-10"
                />
            </div>

            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase italic underline decoration-primary decoration-4 underline-offset-8">
                    Deployment <span className="text-primary italic">Confirmed</span>
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Your infrastructure modules are being provisioned. System integration will begin momentarily across our global edge network.
                </p>
            </div>

            <div className="bg-card/40 border border-white/5 rounded-2xl p-6 w-full max-w-sm space-y-4 backdrop-blur-xl">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Order ID</span>
                    <span className="text-foreground font-mono font-bold">{lastOrderId}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Status</span>
                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-tight">Provisioning</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Button size="lg" onClick={() => navigate('/shop')} className="group">
                    Continue Exploring
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg">
                    <Download size={18} className="mr-2" />
                    Download Invoice
                </Button>
            </div>

            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] pt-8">
                Vertex Corporate Infrastructure Group
            </p>
        </motion.div>
    );
};

export default OrderSuccess;
