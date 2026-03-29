import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative bg-[#050505] border-t border-white/5 pt-32 pb-16 overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {/* Background Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#00f2ff]/30 to-transparent" />
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00f2ff]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="relative w-12 h-12 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                                <img src="/logo.svg" alt="Vertex Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,242,255,0.2)]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-light tracking-[0.3em] text-white leading-none uppercase">
                                    Vertex
                                </span>
                                <span className="text-[9px] tracking-[0.5em] text-[#00f2ff]/80 font-medium uppercase mt-2 border-t border-white/10 pt-1">
                                    Haute Commerce
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                            Architecting the future of high-end retail through meticulous curation
                            and unprecedented technological depth.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-[12px] font-black tracking-[0.3em] text-white uppercase mb-8 opacity-50">Discovery</h3>
                        <ul className="space-y-5">
                            <li>
                                <Link to="/shop?sortBy=newest" className="text-sm text-white/50 hover:text-[#00f2ff] transition-all duration-300 font-medium tracking-wide">
                                    New Arrivals
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop" className="text-sm text-white/50 hover:text-[#00f2ff] transition-all duration-300 font-medium tracking-wide">
                                    Collections
                                </Link>
                            </li>
                            <li>
                                <Link to="/heritage" className="text-sm text-white/50 hover:text-[#00f2ff] transition-all duration-300 font-medium tracking-wide">
                                    Our Heritage
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-[12px] font-black tracking-[0.3em] text-white uppercase mb-8 opacity-50">Support</h3>
                        <ul className="space-y-5">
                            <li>
                                <Link to="/contact" className="text-sm text-white/50 hover:text-[#00f2ff] transition-all duration-300 font-medium tracking-wide">
                                    Contact Concierge
                                </Link>
                            </li>
                            <li>
                                <Link to="/account" className="text-sm text-white/50 hover:text-[#00f2ff] transition-all duration-300 font-medium tracking-wide">
                                    Account Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/compliance" className="text-sm text-white/50 hover:text-[#00f2ff] transition-all duration-300 font-medium tracking-wide">
                                    Global Compliance
                                </Link>
                            </li>
                        </ul>
                    </div>


                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8">
                    <p className="text-[11px] text-white/20 tracking-[0.2em] uppercase order-2 md:order-1">
                        © {new Date().getFullYear()} Vertex Principle. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-10 text-[11px] text-white/20 tracking-[0.2em] uppercase order-1 md:order-2">
                        <Link to="/privacy" className="hover:text-[#00f2ff] transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-[#00f2ff] transition-colors">Terms</Link>
                        <Link to="/compliance" className="hover:text-[#00f2ff] transition-colors">Compliance</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
