import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchDbCart } from '../../store/slices/cartSlice';
import Navigation from './Navigation';
import Footer from './Footer';
import ToastContainer from '../ui/ToastContainer';

const AppLayout = () => {
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchDbCart());
        }
    }, [currentUser, dispatch]);

    return (
        <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-[#00f2ff] selection:text-black">
            {/* Global Background Depth Overlay */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(0,242,255,0.03)_0%,_transparent_50%)] pointer-events-none" />

            {/* Navigation */}
            <Navigation />

            {/* Main Content */}
            <main className="flex-grow">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, scale: 0.99 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.01 }}
                        transition={{
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                        className="w-full h-full"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer */}
            <Footer />

            {/* High-End Ambient Glows */}
            <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00f2ff]/5 rounded-full blur-[160px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#2dd4bf]/5 rounded-full blur-[160px] pointer-events-none" />
            
            <ToastContainer />
        </div>
    );
};

export default AppLayout;
