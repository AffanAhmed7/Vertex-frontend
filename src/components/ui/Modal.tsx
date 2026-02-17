import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'lg', showCloseButton = true }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={`relative w-full overflow-hidden glass-panel rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 ${maxWidth === 'sm' ? 'max-w-sm' :
                            maxWidth === 'md' ? 'max-w-md' :
                                maxWidth === 'lg' ? 'max-w-lg' :
                                    maxWidth === 'xl' ? 'max-w-xl' :
                                        'max-w-2xl'
                            }`}
                    >
                        {/* Header */}
                        {title && (
                            <div className="flex items-center justify-between p-8 pb-4">
                                <h2 className="text-2xl font-light tracking-[0.2em] uppercase text-white/90">{title}</h2>
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="p-2 transition-all duration-300 rounded-full hover:bg-white/10 text-white/30 hover:text-white"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Body */}
                        <div className="p-6">
                            {children}
                        </div>

                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 to-transparent" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export { Modal };
