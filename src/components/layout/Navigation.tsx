import { useState, useEffect } from 'react';
import { ShoppingCart, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, openAuthModal, closeAuthModal, toggleAccountSidebar } from '../../store';
import { Button } from '../ui/Button';
import { AuthModals } from '../auth/AuthModals';

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const { isAuthModalOpen, authMode } = useSelector((state: RootState) => state.ui);
    const { currentUser } = useSelector((state: RootState) => state.user);
    const { items } = useSelector((state: RootState) => state.cart);
    
    const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const isAccountPage = location.pathname.startsWith('/account');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Collections', path: '/shop' },
        { name: 'Heritage', path: '/heritage' }
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 pointer-events-none ${isScrolled ? 'py-1 md:py-2' : 'pt-0 pb-2 md:pt-0 md:pb-3'}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            <div className="container mx-auto px-4 md:px-8">
                <div
                    className={`relative flex flex-col lg:flex-row items-center justify-between px-6 py-3 md:px-10 md:py-4 rounded-[1.5rem] md:rounded-full transition-all duration-500 gap-y-2 md:gap-y-4 lg:gap-y-0 pointer-events-auto ${isScrolled
                        ? 'bg-black/60 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
                        : 'bg-transparent'
                        }`}
                >
                    {/* Row 1: Logo & Cart Status (Mobile) / Logo (Desktop) */}
                    <div className="flex items-center justify-between w-full lg:w-auto">
                        <div className="flex items-center gap-3 md:gap-4">
                            {/* Account Sidebar Toggle (Mobile Only) */}
                            {isAccountPage && (
                                <button
                                    onClick={() => dispatch(toggleAccountSidebar())}
                                    className="lg:hidden p-2 -ml-2 text-white/50 hover:text-[#00f2ff] transition-all duration-300"
                                >
                                    <Menu size={20} />
                                </button>
                            )}

                            <Link to="/" className="flex items-center gap-4 group">
                                <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                                    <img src="/logo.svg" alt="Vertex Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,242,255,0.2)]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl md:text-2xl font-light tracking-[0.3em] text-white leading-none uppercase">
                                        Vertex
                                    </span>
                                    <span className="text-[8px] md:text-[9px] tracking-[0.5em] text-[#00f2ff]/80 font-medium uppercase mt-1 md:mt-2 border-t border-white/10 pt-1">
                                        Haute Commerce
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Cart Shortcut for Mobile (Visible when not on LG) */}
                        <div className="lg:hidden">
                             <Link to="/cart" className="p-2 text-white/50 hover:text-[#00f2ff] transition-all duration-300 block">
                                <div className="relative inline-block flex items-center justify-center">
                                    <ShoppingCart size={20} />
                                    {cartItemsCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-[14px] h-[14px] bg-[#00f2ff] text-black text-[8px] flex items-center justify-center rounded-full font-black ring-2 ring-black">
                                            {cartItemsCount}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Center Links (LG only) */}
                    <div className="hidden lg:flex items-center gap-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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

                    {/* Navbar Actions/Links Row (Mobile) / Actions (Desktop) */}
                    <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8">
                        {/* Mobile Links (Hidden on LG) */}
                        <div className="flex lg:hidden items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 hover:text-[#00f2ff] ${location.pathname === link.path ? 'text-[#00f2ff]' : 'text-white/70'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Actions: Account/Auth */}
                        <div className="flex items-center gap-3 md:gap-4">
                            {currentUser ? (
                                <Link to="/account">
                                    <Button variant="ghost" size="sm" className="px-4 md:px-5 h-9 md:h-10 text-[#00f2ff] hover:text-white hover:bg-[#00f2ff]/10 font-semibold tracking-wider text-[10px] md:text-[12px] uppercase text-nowrap rounded-full border border-[#00f2ff]/20">
                                        Account
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="px-3 md:px-5 h-9 md:h-10 text-white/70 hover:text-white hover:bg-white/5 font-semibold tracking-wider text-[10px] md:text-[12px] uppercase text-nowrap"
                                        onClick={() => dispatch(openAuthModal('login'))}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="px-4 md:px-5 h-9 md:h-10 text-[#00f2ff] hover:text-white hover:bg-[#00f2ff]/10 border border-[#00f2ff]/20 font-semibold tracking-wider text-[10px] md:text-[12px] uppercase text-nowrap rounded-full"
                                        onClick={() => dispatch(openAuthModal('signup'))}
                                    >
                                        Join Now
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Cart (Desktop Only) */}
                        <div className="hidden lg:block">
                            <Link to="/cart" className="p-2 text-white/50 hover:text-[#00f2ff] transition-all duration-300 block">
                                <div className="relative inline-block flex items-center justify-center">
                                    <ShoppingCart size={18} />
                                    {cartItemsCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-[14px] h-[14px] bg-[#00f2ff] text-black text-[8px] flex items-center justify-center rounded-full font-black ring-2 ring-black">
                                            {cartItemsCount}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <AuthModals
                isOpen={isAuthModalOpen}
                onClose={() => dispatch(closeAuthModal())}
                initialMode={authMode}
            />
        </nav>
    );
};

export default Navigation;
