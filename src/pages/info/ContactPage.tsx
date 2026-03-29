import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
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
                            Contact <span className="text-[#00f2ff]">Information</span>
                        </h1>
                        <p className="text-xs text-[#00f2ff]/60 uppercase tracking-widest font-medium">Direct Communication <span className="text-white/10 mx-2">/</span> Affan Ahmed</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-12">
                            <div className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00f2ff] shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Address</h3>
                                    <p className="text-lg font-medium text-white">affanahmedkhan34@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00f2ff] shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Phone Number</h3>
                                    <p className="text-lg font-medium text-white">03379811576</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00f2ff] shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Principal</h3>
                                    <p className="text-lg font-medium text-white">Affan Ahmed</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 backdrop-blur-xl space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest opacity-60">Correspondence</h3>
                                <p className="text-[10px] text-[#00f2ff]/60 uppercase tracking-widest font-medium">Direct Message</p>
                            </div>
                            
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-widest text-white/30 ml-1">Full Name</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#00f2ff]/50 transition-all text-sm" placeholder="Your Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-widest text-white/30 ml-1">Email Address</label>
                                    <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#00f2ff]/50 transition-all text-sm" placeholder="your@email.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-widest text-white/30 ml-1">Message</label>
                                    <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-[#00f2ff]/50 transition-all resize-none text-sm" placeholder="Support Inquiry"></textarea>
                                </div>
                                <button className="w-full bg-[#00f2ff] text-black font-black py-4 rounded-xl hover:bg-white transition-all duration-500 uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(0,242,255,0.2)]">Submit Dispatch</button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactPage;
