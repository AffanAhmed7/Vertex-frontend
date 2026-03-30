import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { loginUser, registerUser, clearError, verify2FA, reset2FA } from '../../store/slices/userSlice';
import { AppDispatch, RootState } from '../../store';
import GoogleAuthButton from './GoogleAuthButton';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, ShieldCheck, ArrowLeft } from 'lucide-react';

interface AuthModalsProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
}

export const AuthModals: React.FC<AuthModalsProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

    React.useEffect(() => {
        setMode(initialMode);
    }, [initialMode, isOpen]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    
    const { error, loading: isLoading, requires2FA, securityQuestion, twoFactorUserId } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Clear error when switcher or initial mount
    React.useEffect(() => {
        dispatch(clearError());
        if (!isOpen) {
            dispatch(reset2FA());
            setSecurityAnswer('');
        }
    }, [mode, isOpen, dispatch]);


    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearError());

        try {
            if (mode === 'login') {
                const actionResult = await dispatch(loginUser({ email, password }));
                if (loginUser.fulfilled.match(actionResult)) {
                    // Check if 2FA is needed
                    if (actionResult.payload?.requires2FA) {
                        return; // userSlice handles setting requires2FA to true
                    }
                    onClose();
                    navigate(actionResult.payload?.role === 'ADMIN' ? '/admin' : '/account');
                }
            } else {
                const actionResult = await dispatch(registerUser({ name, email, password }));
                if (registerUser.fulfilled.match(actionResult)) {
                    onClose();
                    navigate(actionResult.payload?.role === 'ADMIN' ? '/admin' : '/account');
                }
            }
        } catch (err) {
            // Errors are handled by the userSlice extraReducers
        }
    };

    const handle2FAVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!twoFactorUserId) return;

        const actionResult = await dispatch(verify2FA({ userId: twoFactorUserId, answer: securityAnswer }));
        if (verify2FA.fulfilled.match(actionResult)) {
            onClose();
            navigate(actionResult.payload?.role === 'ADMIN' ? '/admin' : '/account');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="md"
            showCloseButton={false}
        >
            <div className="relative w-full py-1">
                {/* Header */}
                <div className="flex justify-between items-start mb-4 md:mb-6 font-['Outfit']">
                    <div className="space-y-1">
                        <h2 className="text-xl md:text-3xl font-light tracking-[0.15em] uppercase text-white leading-none">
                            {requires2FA ? 'Verification' : (mode === 'login' ? 'Sign In' : 'Join')}
                        </h2>
                        <p className="text-[8px] md:text-[10px] text-[#00f2ff]/60 uppercase tracking-[0.3em] font-medium transition-all duration-500 mt-1 md:mt-2">
                            {requires2FA ? 'Additional Security Required' : (mode === 'login' ? 'Premium access to Vertex' : 'Become a part of the future')}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 md:p-2 -mr-2 transition-all duration-300 rounded-full hover:bg-white/5 text-white/20 hover:text-[#00f2ff]"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form Area */}
                <div className="space-y-3 md:space-y-5">
                    <AnimatePresence mode="wait">
                        {requires2FA ? (
                            <motion.div
                                key="2fa-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-3">
                                    <div className="flex items-center gap-3 text-[#00f2ff]">
                                        <ShieldCheck size={20} />
                                        <span className="text-[11px] font-bold uppercase tracking-widest">Security Question</span>
                                    </div>
                                    <p className="text-sm text-white/80 italic pl-8">
                                        "{securityQuestion}"
                                    </p>
                                </div>

                                <form onSubmit={handle2FAVerify} className="space-y-3 md:space-y-4">
                                    <Input
                                        label="Your Answer"
                                        type="text"
                                        value={securityAnswer}
                                        onChange={(e) => setSecurityAnswer(e.target.value)}
                                        className="bg-transparent"
                                        autoFocus
                                        icon={<Lock size={18} />}
                                    />

                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 rounded-lg border border-red-500/20 bg-red-500/5"
                                        >
                                            <p className="text-red-400 text-[10px] md:text-xs font-medium uppercase tracking-wider text-center">
                                                {error}
                                            </p>
                                        </motion.div>
                                    )}

                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                        whileTap={{ scale: 0.99 }}
                                        disabled={isLoading}
                                        className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] transition-all duration-500 group"
                                    >
                                        <span className="text-[11px] font-medium text-white/60 tracking-[0.2em] uppercase group-hover:text-white transition-colors">
                                            {isLoading ? 'Verifying...' : 'Authorize Access'}
                                        </span>
                                    </motion.button>
                                </form>

                                <button
                                    onClick={() => dispatch(reset2FA())}
                                    className="flex items-center gap-2 text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-widest pt-2"
                                >
                                    <ArrowLeft size={14} />
                                    Back to Login
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="auth-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-5"
                            >
                                <form onSubmit={handleAuth} className="space-y-3 md:space-y-4">
                                    <AnimatePresence mode="wait">
                                        {mode === 'signup' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-1">
                                                    <Input
                                                        label="Full Name"
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="bg-transparent"
                                                        icon={<User size={18} />}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <Input
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-transparent"
                                        icon={<Mail size={18} />}
                                    />
                                    <Input
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-transparent"
                                        icon={<Lock size={18} />}
                                    />

                                    {/* Error Message */}
                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-2.5 md:p-3 rounded-lg border border-red-500/20 bg-red-500/5"
                                        >
                                            <p className="text-red-400 text-[10px] md:text-xs font-medium uppercase tracking-wider text-center">
                                                {error}
                                            </p>
                                        </motion.div>
                                    )}

                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                        whileTap={{ scale: 0.99 }}
                                        disabled={isLoading}
                                        className="w-full h-11 md:h-12 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] transition-all duration-500 group mt-2 md:mt-4"
                                    >
                                        <span className="text-[10px] md:text-[11px] font-medium text-white/60 tracking-[0.2em] uppercase group-hover:text-white transition-colors">
                                            {isLoading ? 'Authenticating...' : (mode === 'login' ? 'Proceed' : 'Create')}
                                        </span>
                                    </motion.button>
                                </form>

                                <div className="relative py-2 md:py-3">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/5"></div>
                                    </div>
                                    <div className="relative flex justify-center text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-white/20">
                                        <span className="bg-[#0c0c0c] px-4">Secure Gateway</span>
                                    </div>
                                </div>

                                <div className="space-y-4 pb-2">
                                    <GoogleAuthButton onSuccess={onClose} />

                                    <div className="text-center">
                                        <button
                                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                            className="text-[10px] text-white/30 hover:text-[#00f2ff] transition-all duration-300 uppercase tracking-[0.3em] font-bold"
                                        >
                                            {mode === 'login' ? "Need an account? Sign Up" : "Already have an identity? Sign In"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Modal>
    );
};
