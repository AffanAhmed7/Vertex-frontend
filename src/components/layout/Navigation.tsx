import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Moon, Sun, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, RootState } from '../../store';
import { Button } from '../ui/Button';

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.ui.theme);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Collections', path: '/shop' },
        { name: 'Heritage', path: '/heritage' },
        { name: 'Concierge', path: '/concierge' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-4'
                }`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            <div className="container mx-auto px-8">
                <div
                    className={`relative flex items-center justify-between px-8 py-4 rounded-full transition-all duration-500 ${isScrolled
                        ? 'bg-black/40 backdrop-blur-2xl border border-white/5 shadow-2xl'
                        : 'bg-transparent'
                        }`}
                >
                    {/* Logo - Elegant Vertex Branding */}
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

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-[13px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 hover:text-[#00f2ff] ${location.pathname === link.path ? 'text-[#00f2ff]' : 'text-white/70'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className="p-2 text-white/50 hover:text-[#00f2ff] transition-all duration-300"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <Link to="/cart" className="relative p-2 text-white/50 hover:text-[#00f2ff] transition-all duration-300">
                            <ShoppingCart size={18} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00f2ff] text-black text-[9px] flex items-center justify-center rounded-full font-black">
                                0
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-3">
                            <Button variant="ghost" size="sm" className="px-5 text-white/70 hover:text-white hover:bg-white/5 font-semibold tracking-wider text-[12px] uppercase text-nowrap">
                                Login
                            </Button>
                            <Button size="sm" className="px-6 bg-[#00f2ff] text-black hover:bg-white transition-all duration-500 font-bold tracking-wider text-[12px] uppercase rounded-full text-nowrap">
                                Join Now
                            </Button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2 text-white/70"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 p-6 lg:hidden"
                    >
                        <div className="bg-black/90 backdrop-blur-3xl rounded-3xl p-8 space-y-8 border border-white/5 shadow-2xl">
                            <div className="flex flex-col gap-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-2xl font-bold text-white tracking-widest uppercase"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="h-px bg-white/5 w-full" />
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="ghost" className="text-white border border-white/10 uppercase tracking-widest py-6">Login</Button>
                                <Button className="bg-[#00f2ff] text-black font-bold uppercase tracking-widest py-6">Register</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navigation;
