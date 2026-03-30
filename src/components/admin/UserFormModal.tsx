import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, CheckCircle, ChevronDown } from 'lucide-react';
import AdminVault from './AdminVault';


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
    const [isVaultOpen, setIsVaultOpen] = useState(false);

    const handleVaultSuccess = () => {
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
        }, 800);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsVaultOpen(true);
    };


    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-[95%] sm:w-full max-w-md bg-[#0a0a0b] border border-white/5 rounded-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] z-[501] flex flex-col"
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
                                <h3 className="text-xl font-semibold tracking-tight uppercase">User Registered</h3>
                                <p className="text-muted-foreground uppercase tracking-widest text-[9px]">Account successfully added to the system</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0 overflow-hidden">
                                <div className="p-5 sm:p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <div className="flex-1 text-center">
                                        <h3 className="text-lg sm:text-xl font-light text-white uppercase tracking-tighter sm:ml-8">
                                            {initialData ? 'Update User' : 'Register User'}
                                        </h3>
                                        <p className="text-[8px] sm:text-[9px] text-[#00f2ff]/40 uppercase tracking-[0.2em] sm:tracking-[0.4em] font-black mt-1 sm:ml-8">
                                            {initialData ? 'Profile Modification' : 'New Account Registration'}
                                        </p>
                                    </div>
                                    <button type="button" onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors shrink-0">
                                        <X size={18} className="sm:w-5 sm:h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto no-scrollbar p-5 sm:p-6 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">User Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                            <input
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pl-11 text-xs sm:text-sm text-white focus:border-[#00f2ff] outline-none transition-all placeholder:text-white/10"
                                                placeholder="Enter full name..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                            <input
                                                required
                                                type="email"
                                                readOnly={!!initialData}
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pl-11 text-xs sm:text-sm text-white focus:border-[#00f2ff] outline-none transition-all placeholder:text-white/10 ${initialData ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                placeholder="user@example.com"
                                            />

                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2 sm:mb-3">Access Level</label>
                                            <div className="relative">
                                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                                <select
                                                    value={formData.role}
                                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pl-11 pr-10 text-xs sm:text-sm text-white focus:border-[#00f2ff] outline-none transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="Customer" className="bg-[#0a0a0b] text-white">Customer</option>
                                                    <option value="Viewer" className="bg-[#0a0a0b] text-white">Viewer</option>
                                                    <option value="Editor" className="bg-[#0a0a0b] text-white">Editor</option>
                                                    <option value="Admin" className="bg-[#0a0a0b] text-white">Admin</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={14} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2 sm:mb-3">Auth State</label>
                                            <div className="relative">
                                                <select
                                                    value={formData.status}
                                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-10 text-xs sm:text-sm text-white focus:border-[#00f2ff] outline-none transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="Active" className="bg-[#0a0a0b] text-white">Active</option>
                                                    <option value="Suspended" className="bg-[#0a0a0b] text-white">Suspended</option>
                                                    <option value="Pending" className="bg-[#0a0a0b] text-white">Pending</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 sm:p-6 border-t border-white/5 bg-white/[0.02] flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 sm:px-6 py-2.5 sm:py-3.5 bg-white/[0.03] border border-white/5 hover:border-white/10 text-white/40 hover:text-white rounded-xl text-[10px] sm:text-xs font-medium transition-all active:scale-95"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`flex-1 py-2.5 sm:py-3.5 rounded-xl text-[10px] sm:text-xs font-medium transition-all active:scale-95 border ${isSubmitting ? 'bg-white/5 text-white/20 border-white/5' : 'bg-[#00f2ff]/10 border-[#00f2ff]/20 text-[#00f2ff] hover:bg-[#00f2ff]/20 hover:border-[#00f2ff]/40 shadow-lg shadow-[#00f2ff]/5'}`}
                                    >
                                        {isSubmitting ? 'Updating...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}
                        </motion.div>
                    </div>
                </>
            )}
            <AdminVault
                isOpen={isVaultOpen}
                onClose={() => setIsVaultOpen(false)}
                onSuccess={handleVaultSuccess}
                actionLabel={initialData ? "update user profile" : "register new user"}
            />
        </AnimatePresence>
    );
};

export default UserFormModal;
