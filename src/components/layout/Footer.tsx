import { ShieldCheck, Truck, RefreshCw, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative z-10 bg-muted/20 border-t border-white/5 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Trust Points */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-foreground mb-6">Vertex Solutions</h3>
                        <div className="flex items-center gap-3 text-muted-foreground group">
                            <ShieldCheck className="text-primary group-hover:scale-110 transition-transform" size={20} />
                            <span className="text-sm">Enterprise-grade encryption</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground group">
                            <Truck className="text-primary group-hover:scale-110 transition-transform" size={20} />
                            <span className="text-sm">Reliable logistics network</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground group">
                            <RefreshCw className="text-primary group-hover:scale-110 transition-transform" size={20} />
                            <span className="text-sm">Comprehensive platform SLA</span>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-6">Platforms</h3>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Core Retail</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Analytics & BI</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Global Operations</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-6">Resources</h3>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-foreground">Stay Connected</h3>
                        <p className="text-sm text-muted-foreground">Receive professional insights and infrastructure updates.</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Corporate email"
                                className="w-full bg-muted/50 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-primary transition-all"
                            />
                            <button className="absolute right-2 top-1.5 p-2 bg-primary rounded-full text-primary-foreground hover:scale-105 transition-transform">
                                <Mail size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-white/5 gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-black text-[10px]">VX</span>
                        </div>
                        <span className="text-sm font-bold tracking-tighter uppercase">Vertex Commerce</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Vertex Commerce. Built for performance and reliability.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                        <a href="#" className="hover:text-foreground">Privacy Policy</a>
                        <a href="#" className="hover:text-foreground">Legal Notice</a>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </footer>
    );
};

export default Footer;
