import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

const AppLayout = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
            {/* Navigation */}
            <Navigation />

            {/* Main Content */}
            <main className="flex-grow pt-24 md:pt-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        className="w-full h-full"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer */}
            <Footer />

            {/* Global Ambient Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
};

export default AppLayout;
