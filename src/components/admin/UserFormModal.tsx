import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, CheckCircle } from 'lucide-react';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Customer',
        status: 'Active'
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ name: '', email: '', role: 'Customer', status: 'Active' });
        }
    }, [initialData, isOpen]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API delay
        setTimeout(() => {
            onSubmit(formData);
            setIsSubmitting(false);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setFormData({ name: '', email: '', role: 'Customer', status: 'Active' });
                onClose();
            }, 1500);
        }, 1000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[500]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-md h-fit max-h-[90vh] bg-[#0a0a0b] border border-white/5 rounded-3xl overflow-hidden shadow-2xl z-[501] flex flex-col"
                    >
                        {showSuccess ? (
                            <div className="p-16 flex flex-col items-center justify-center text-center space-y-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"
                                >
                                    <CheckCircle size={32} />
                                </motion.div>
                                <h3 className="text-xl font-semibold tracking-tight">CLEARANCE GRANTED</h3>
                                <p className="text-muted-foreground uppercase tracking-widest text-[9px]">Entity registered in infrastructure protocols</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0 overflow-hidden">
                                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <div>
                                        <h3 className="text-xl font-light text-white uppercase tracking-tighter">
                                            {initialData ? 'Update Entity' : 'Register Entity'}
                                        </h3>
                                        <p className="text-xs text-muted-foreground font-medium mt-1">
                                            {initialData ? 'Clearance Modification' : 'Access Protocol Injection'}
                                        </p>
                                    </div>
                                    <button type="button" onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">Entity Designation (Name)</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                            <input
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-white/10"
                                                placeholder="Full Name designation..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">Comm Vector (Email)</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                            <input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-white/10"
                                                placeholder="entity@infrastructure.net"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Access Level</label>
                                            <div className="relative">
                                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                                <select
                                                    value={formData.role}
                                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="Customer">Customer</option>
                                                    <option value="Viewer">Viewer</option>
                                                    <option value="Editor">Editor</option>
                                                    <option value="Admin">Admin</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Auth State</label>
                                            <select
                                                value={formData.status}
                                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Suspended">Suspended</option>
                                                <option value="Pending">Pending</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-white/5 bg-white/[0.02] flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-6 py-3.5 bg-white/[0.03] border border-white/5 hover:border-white/10 text-white/40 hover:text-white rounded-xl text-xs font-medium transition-all active:scale-95"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`flex-1 py-3.5 rounded-xl text-xs font-medium transition-all active:scale-95 border ${isSubmitting ? 'bg-white/5 text-white/20 border-white/5' : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/40 shadow-lg shadow-primary/5'}`}
                                    >
                                        {isSubmitting ? 'Syncing...' : 'Grant Access'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UserFormModal;
