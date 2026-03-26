import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { RootState } from '../../store';
import { removeToast } from '../../store/slices/toastSlice';

const ToastContainer: React.FC = () => {
    const { toasts } = useSelector((state: RootState) => state.toast);
    const dispatch = useDispatch();

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onClose={() => dispatch(removeToast(toast.id))}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

const ToastItem: React.FC<{ toast: any; onClose: () => void }> = ({ toast, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle2 className="text-emerald-400" size={20} />,
        error: <XCircle className="text-rose-400" size={20} />,
        info: <Info className="text-primary" size={20} />,
        warning: <AlertTriangle className="text-amber-400" size={20} />,
    };

    const colors = {
        success: 'border-emerald-500/20 bg-emerald-500/5',
        error: 'border-rose-500/20 bg-rose-500/5',
        info: 'border-primary/20 bg-primary/5',
        warning: 'border-amber-500/20 bg-amber-500/5',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto min-w-[300px] flex items-center justify-between gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${colors[toast.type as keyof typeof colors]}`}
        >
            <div className="flex items-center gap-3">
                {icons[toast.type as keyof typeof icons]}
                <span className="text-xs font-bold tracking-wide text-white/90">
                    {toast.message}
                </span>
            </div>
            <button
                onClick={onClose}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
            >
                <X size={14} />
            </button>
        </motion.div>
    );
};

export default ToastContainer;
