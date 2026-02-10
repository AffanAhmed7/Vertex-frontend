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
        { name: 'Solutions', path: '/solutions' },
        { name: 'Products', path: '/shop' },
        { name: 'Enterprise', path: '/enterprise' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'
                }`}
        >
            <div className="container mx-auto px-6">
                <div
                    className={`relative flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-300 ${isScrolled ? 'glass-panel shadow-2xl px-4' : 'bg-transparent'
                        }`}
                >
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow-emerald group-hover:scale-110 transition-transform">
                            <span className="text-primary-foreground font-black text-xs">VX</span>
                        </div>
                        <span className="text-xl font-bold tracking-tighter text-foreground uppercase">
                            Vertex <span className="text-primary">Commerce</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-muted-foreground'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                            <ShoppingCart size={20} />
                            <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full font-bold">
                                0
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="px-4">
                                Login
                            </Button>
                            <Button size="sm" className="px-5">
                                Get Started
                            </Button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-muted-foreground"
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
                        className="absolute top-full left-0 right-0 p-6 md:hidden"
                    >
                        <div className="glass-panel rounded-2xl p-6 space-y-6 shadow-2xl">
                            <div className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-lg font-medium text-foreground"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                            <hr className="border-white/10" />
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="ghost">Login</Button>
                                <Button>Register</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navigation;
