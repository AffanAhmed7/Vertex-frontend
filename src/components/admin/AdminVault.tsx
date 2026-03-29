import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, ArrowRight, Lock, AlertCircle } from 'lucide-react';

interface AdminVaultProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    actionLabel?: string;
}

const AdminVault: React.FC<AdminVaultProps> = ({ isOpen, onClose, onSuccess, actionLabel = "authorize transaction" }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Check if already verified in this session
            const isVerified = sessionStorage.getItem('admin_otp_verified') === 'true';
            if (isVerified) {
                onSuccess();
                onClose();
                return;
            }

            setOtp('');
            setError(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleVerify = () => {
        setIsVerifying(true);
        // OTP is hardcoded as 'helloque' per user requirement
        setTimeout(() => {
            if (otp.toLowerCase() === 'helloque') {
                sessionStorage.setItem('admin_otp_verified', 'true');
                onSuccess();
                onClose();
            } else {
                setError(true);
                setOtp('');
                inputRef.current?.focus();
            }
            setIsVerifying(false);
        }, 600);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && otp.length > 0) {
            handleVerify();
        }
        if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#0e0e10]/95 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-[#111114] border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Security Header */}
                        <div className="bg-[#00f2ff]/5 border-b border-[#00f2ff]/10 p-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/20 flex items-center justify-center text-[#00f2ff]">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Admin Vault</h3>
                                    <p className="text-[10px] text-[#00f2ff]/60 font-black uppercase tracking-[0.2em]">Restricted Sector Access</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-rose-500 mb-1">
                                    <Lock size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Action: {actionLabel}</span>
                                </div>
                                <h4 className="text-lg font-light text-white leading-tight">
                                    Verification required to confirm administrative changes.
                                </h4>
                            </div>

                            <div className="space-y-4">
                                <div className="relative group">
                                    <input
                                        ref={inputRef}
                                        type="password"
                                        placeholder="Enter Administrative OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className={`w-full bg-[#1a1a1e] border rounded-2xl px-6 py-4 text-center text-xl tracking-[0.5em] text-white placeholder:text-white/20 placeholder:tracking-normal placeholder:text-sm focus:outline-none transition-all ${error ? 'border-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-white/10 focus:border-[#00f2ff]/50'}`}
                                    />
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute -bottom-6 left-0 right-0 text-center"
                                        >
                                            <span className="text-[10px] text-rose-500 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                                                <AlertCircle size={10} /> Access Denied: Invalid OTP
                                            </span>
                                        </motion.div>
                                    )}
                                </div>

                                <button
                                    onClick={handleVerify}
                                    disabled={otp.length === 0 || isVerifying}
                                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs transition-all ${otp.length > 0 ? 'bg-[#00f2ff] text-[#0e0e10] hover:shadow-[0_0_30px_rgba(0,242,255,0.3)] active:scale-95' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                                >
                                    {isVerifying ? (
                                        "Verifying Identity..."
                                    ) : (
                                        <>Proceed to Execution <ArrowRight size={14} /></>
                                    )}
                                </button>
                            </div>

                            <p className="text-[9px] text-white/30 text-center uppercase tracking-widest leading-relaxed">
                                Continuous monitoring active. Unauthorized access attempts are logged and reported to the primary infrastructure node.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AdminVault;
