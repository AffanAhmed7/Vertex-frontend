import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { loginUser, registerUser, clearError } from '../../store/slices/userSlice';
import { AppDispatch, RootState } from '../../store';
import GoogleAuthButton from './GoogleAuthButton';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock } from 'lucide-react';

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
    
    const { error, loading: isLoading } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Clear error when switcher or initial mount
    React.useEffect(() => {
        dispatch(clearError());
    }, [mode, dispatch]);


    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (mode === 'login') {
                const actionResult = await dispatch(loginUser({ email, password }));
                if (loginUser.fulfilled.match(actionResult)) {
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

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="md"
            showCloseButton={false}
        >
            <div className="relative w-full py-1">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-light tracking-[0.15em] uppercase text-white leading-none">
                            {mode === 'login' ? 'Sign In' : 'Join'}
                        </h2>
                        <p className="text-[10px] text-[#00f2ff]/60 uppercase tracking-[0.3em] font-medium transition-all duration-500">
                            {mode === 'login' ? 'Premium access to Vertex' : 'Become a part of the future'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 transition-all duration-300 rounded-full hover:bg-white/5 text-white/20 hover:text-[#00f2ff]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Area */}
                <div className="space-y-5">
                    <form onSubmit={handleAuth} className="space-y-4">
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
                                className="p-3 rounded-lg border border-red-500/20 bg-red-500/5"
                            >
                                <p className="text-red-400 text-xs font-medium uppercase tracking-wider text-center">
                                    {error}
                                </p>
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                            whileTap={{ scale: 0.99 }}
                            disabled={isLoading}
                            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] transition-all duration-500 group mt-4"
                        >
                            <span className="text-[11px] font-medium text-white/60 tracking-[0.2em] uppercase group-hover:text-white transition-colors">
                                {isLoading ? 'Authenticating...' : (mode === 'login' ? 'Proceed' : 'Create')}
                            </span>
                        </motion.button>
                    </form>

                    <div className="relative py-3">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em] text-white/20">
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
                </div>
            </div>
        </Modal>
    );
};
