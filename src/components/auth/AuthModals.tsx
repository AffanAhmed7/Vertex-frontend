import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { setUser } from '../../store/slices/userSlice';
import GoogleAuthButton from './GoogleAuthButton';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AuthModalsProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
}

export const AuthModals: React.FC<AuthModalsProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Mock authentication logic
            await new Promise(resolve => setTimeout(resolve, 1500));

            const isEmailAdmin = email.toLowerCase().includes('admin');
            const mockUser = {
                id: Math.random().toString(36).substr(2, 9),
                name: mode === 'signup' ? name : (isEmailAdmin ? 'Admin User' : 'Standard User'),
                email: email,
                role: (isEmailAdmin ? 'ADMIN' : 'CUSTOMER') as 'ADMIN' | 'CUSTOMER',
                joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                status: 'Standard' as const,
            };

            dispatch(setUser(mockUser));
            onClose();

            if (mockUser.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/account');
            }
        } catch (err) {
            setError('Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="md"
            showCloseButton={false}
        >
            <div className="space-y-8 py-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-light tracking-[0.15em] uppercase text-white">
                            {mode === 'login' ? 'Sign In' : 'Join'}
                        </h2>
                        <p className="text-[10px] text-[#00f2ff]/60 uppercase tracking-[0.3em] font-medium transition-all duration-500">
                            {mode === 'login' ? 'Premium access to Vertex' : 'Become a part of the future'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 transition-all duration-300 rounded-full hover:bg-white/5 text-white/20 hover:text-[#00f2ff]"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    <form onSubmit={handleAuth} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {mode === 'signup' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <Input
                                        label="Full Name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-transparent border-white/5 focus:border-[#00f2ff]/50"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-transparent border-white/5 focus:border-[#00f2ff]/50"
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent border-white/5 focus:border-[#00f2ff]/50"
                        />

                        {error && <p className="text-[#00f2ff] text-[10px] uppercase tracking-widest text-center">{error}</p>}

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full bg-white text-black hover:bg-[#00f2ff] hover:text-black font-black uppercase tracking-[0.3em] h-12 rounded-full transition-all duration-700 shadow-xl"
                        >
                            {mode === 'login' ? 'Proceed' : 'Create'}
                        </Button>
                    </form>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em] text-white/20">
                            <span className="bg-transparent px-4">Secure Gateway</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <GoogleAuthButton onClick={() => console.log('Google Auth')} />

                        <div className="text-center pt-2">
                            <button
                                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                className="text-[10px] text-white/30 hover:text-[#00f2ff] transition-all duration-300 uppercase tracking-[0.2em] font-bold"
                            >
                                {mode === 'login' ? "Need an invitation? Sign Up" : "Have an identity? Sign In"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
