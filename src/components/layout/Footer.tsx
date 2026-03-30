import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { openAuthModal, RootState } from '../../store';

const Footer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state: RootState) => state.user);

    const handleAccountAccess = () => {
        if (currentUser) {
            navigate('/account');
        } else {
            dispatch(openAuthModal('login'));
        }
    };
    return (
        <footer className="relative bg-[#050505] border-t border-white/5 pt-32 pb-12 overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {/* Background Transitions & Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#00f2ff]/20 to-transparent" />
            <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00f2ff]/10 blur-[160px] rounded-full pointer-events-none opacity-50" />

            <div className="container mx-auto px-10 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24"
                >
                    {/* Brand Section */}
                    <div className="md:col-span-5 space-y-10">
                        <Link to="/" className="inline-flex items-center gap-5 group">
                            <div className="relative w-14 h-14 flex items-center justify-center transition-all duration-700 group-hover:rotate-[360deg]">
                                <img src="/logo.svg" alt="Vertex Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,242,255,0.3)]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-light tracking-[0.4em] text-white leading-none uppercase">
                                    Vertex
                                </span>
                                <span className="text-[10px] tracking-[0.6em] text-[#00f2ff] font-bold uppercase mt-3 border-t border-white/10 pt-2 opacity-80">
                                    Haute Commerce
                                </span>
                            </div>
                        </Link>
                        
                        <p className="text-base text-white/40 leading-relaxed font-light max-w-sm">
                            Redefining the boundaries of digital acquisition through 
                            precision-engineered retail protocols and absolute curation.
                        </p>
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-1" /> {/* Spacer */}

                    <div className="md:col-span-3">
                        <h3 className="text-[11px] font-bold tracking-[0.4em] text-[#00f2ff]/60 uppercase mb-10">Exploration</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'New Arrivals', path: '/shop?sortBy=newest' },
                                { name: 'Collections', path: '/shop' },
                                { name: 'Heritage', path: '/heritage' },
                                { name: 'Direct Support', path: '/contact' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link 
                                        to={link.path} 
                                        className="group flex items-center gap-2 text-[13px] text-white/50 hover:text-white transition-all duration-500 font-medium tracking-wide"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-3">
                        <h3 className="text-[11px] font-bold tracking-[0.4em] text-[#00f2ff]/60 uppercase mb-10">Operational</h3>
                        <ul className="space-y-4">
                            <li>
                                <button
                                    onClick={handleAccountAccess}
                                    className="group flex items-center gap-2 text-[13px] text-white/50 hover:text-white transition-all duration-500 font-medium tracking-wide"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform">Account Access</span>
                                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                </button>
                            </li>
                            {[
                                { name: 'Privacy Protocols', path: '/privacy' },
                                { name: 'Terms of Service', path: '/terms' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link 
                                        to={link.path} 
                                        className="group flex items-center gap-2 text-[13px] text-white/50 hover:text-white transition-all duration-500 font-medium tracking-wide"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="flex flex-col items-center justify-center pt-20 border-t border-white/5"
                >
                    <p className="text-[10px] text-white/25 tracking-[0.35em] font-light uppercase text-center">
                        © {new Date().getFullYear()} Vertex Principle. All Rights Reserved.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
