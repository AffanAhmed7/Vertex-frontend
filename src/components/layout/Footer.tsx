import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative bg-[#050505] border-t border-white/5 pt-32 pb-16 overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {/* Background Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#00f2ff]/30 to-transparent" />
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00f2ff]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f2ff] to-[#2dd4bf] flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.2)]">
                                <span className="text-black font-extrabold text-sm tracking-tighter">VX</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-extrabold tracking-[0.2em] text-white leading-none uppercase">
                                    Vertex
                                </span>
                                <span className="text-[10px] tracking-[0.4em] text-[#00f2ff] font-bold uppercase mt-1">
                                    Principle
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                            Architecting the future of high-end retail through meticulous curation
                            and unprecedented technological depth.
                        </p>
                        <div className="flex items-center gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-[#00f2ff]/30 transition-all duration-300 cursor-pointer group">
                                    <div className="w-3 h-3 bg-white/20 group-hover:bg-[#00f2ff] rounded-full transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-[12px] font-black tracking-[0.3em] text-white uppercase mb-8 opacity-50">Discovery</h3>
                        <ul className="space-y-5">
                            {['New Arrivals', 'The Archive', 'Vertex Lab', 'Collaborations'].map(link => (
                                <li key={link}>
                                    <a href="#" className="text-sm text-white/50 hover:text-[#00f2ff] transition-all duration-300 font-medium tracking-wide">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-[12px] font-black tracking-[0.3em] text-white uppercase mb-8 opacity-50">Support</h3>
                        <ul className="space-y-5">
                            {['Concierge Service', 'Private Viewing', 'Global Logistics', 'Security Protocols'].map(link => (
                                <li key={link}>
                                    <a href="#" className="text-sm text-white/50 hover:text-[#00f2ff] transition-all duration-300 font-medium tracking-wide">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-8">
                        <h3 className="text-[12px] font-black tracking-[0.3em] text-white uppercase opacity-50">The Inner Circle</h3>
                        <p className="text-sm text-white/50 leading-relaxed">
                            Join our curated dispatch for early access and tactical updates.
                        </p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Corporate email"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00f2ff]/50 transition-all duration-500"
                            />
                            <button className="absolute right-2 top-2 p-2 bg-[#00f2ff] rounded-lg text-black hover:bg-white hover:scale-105 transition-all duration-500 shadow-lg shadow-[#00f2ff]/20">
                                <Mail size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8">
                    <p className="text-[11px] text-white/20 tracking-[0.2em] uppercase order-2 md:order-1">
                        © {new Date().getFullYear()} Vertex Principle. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-10 text-[11px] text-white/20 tracking-[0.2em] uppercase order-1 md:order-2">
                        <a href="#" className="hover:text-[#00f2ff] transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[#00f2ff] transition-colors">Terms</a>
                        <a href="#" className="hover:text-[#00f2ff] transition-colors">Compliance</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
