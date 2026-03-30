import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToast } from '../../store/slices/toastSlice';
import { submitContactCorrespondence } from '../../services/contactService';

const ContactPage = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            dispatch(addToast({ message: 'Please provide a valid return address (Email).', type: 'error' }));
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await submitContactCorrespondence(formData);
            dispatch(addToast({ message: res.message || 'Inquiry dispatched successfully.', type: 'success' }));
            setFormData({ name: '', email: '', message: '' });
        } catch (err: any) {
            dispatch(addToast({ 
                message: err.response?.data?.message || 'Failed to dispatch inquiry. Please try again.', 
                type: 'error' 
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-12"
                >
                    <header className="space-y-4">
                        <h1 className="text-4xl font-light tracking-[0.1em] text-white uppercase leading-none">
                            Client <span className="text-[#00f2ff]">Concierge</span>
                        </h1>
                        <p className="text-xs text-[#00f2ff]/60 uppercase tracking-widest font-medium">Concierge Relations <span className="text-white/10 mx-2">/</span> Administrator</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-12">
                            <div className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00f2ff] shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Digital Channel</h3>
                                    <p className="text-lg font-medium text-white">affanahmedkhan34@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00f2ff] shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Connect Directly</h3>
                                    <p className="text-lg font-medium text-white">03379811576</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00f2ff] shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Director</h3>
                                    <p className="text-lg font-medium text-white">Administrator</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 backdrop-blur-xl space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest opacity-60">Communication</h3>
                                <p className="text-[10px] text-[#00f2ff]/60 uppercase tracking-widest font-medium">Direct Inquiry</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-widest text-white/30 ml-1">Client Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#00f2ff]/50 transition-all text-sm" 
                                        placeholder="Enter your name" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-widest text-white/30 ml-1">Return Address</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#00f2ff]/50 transition-all text-sm" 
                                        placeholder="your@email.com" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-widest text-white/30 ml-1">Inquiry Details</label>
                                    <textarea 
                                        rows={4} 
                                        required
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#00f2ff]/50 transition-all resize-none text-sm" 
                                        placeholder="How may we assist you?"
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 flex items-center justify-center gap-3 border ${
                                        isSubmitting 
                                        ? 'bg-white/5 border-white/5 text-white/20 cursor-not-allowed' 
                                        : 'bg-[#0a0a0b] border-white/10 text-white hover:border-[#00f2ff]/50 hover:shadow-[0_0_30px_rgba(0,242,255,0.1)] active:scale-[0.98]'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <><Loader2 size={14} className="animate-spin text-[#00f2ff]" /> Processing...</>
                                    ) : (
                                        <><Send size={14} className="text-[#00f2ff]" /> Dispatch Inquiry</>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactPage;
