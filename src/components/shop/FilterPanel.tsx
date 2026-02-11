import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setFilters } from '../../store/slices/productSlice';

interface FilterPanelProps {
    isOpen?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
}

const FilterPanel = ({ isOpen, onClose, isMobile }: FilterPanelProps) => {
    const dispatch = useDispatch();
    const { filters } = useSelector((state: RootState) => state.products);

    const categories = ['All', 'Electronics', 'Apparel', 'Accessories', 'Digital', 'Home'];
    const ratings = [4, 3, 2];

    const content = (
        <div className={isMobile ? "filter-content-mobile" : "filter-panel glass-card"}>
            {isMobile && (
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-bold tracking-widest uppercase">Filters</h2>
                    <button onClick={onClose}><X size={24} /></button>
                </div>
            )}

            {/* Category Filter */}
            <div className="filter-section">
                <h3 className="filter-title">Category</h3>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <div
                            key={cat}
                            className={`filter-option ${filters.category === cat ? 'active' : ''}`}
                            onClick={() => dispatch(setFilters({ category: cat }))}
                        >
                            <div className={`w-4 h-4 rounded-sm border border-white/20 flex items-center justify-center ${filters.category === cat ? 'bg-[#00f2ff] border-[#00f2ff]' : ''}`}>
                                {filters.category === cat && <Check size={10} color="#000" strokeWidth={4} />}
                            </div>
                            <span>{cat}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Filter */}
            <div className="filter-section">
                <h3 className="filter-title">Price Range</h3>
                <div className="px-2">
                    <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={filters.maxPrice}
                        onChange={(e) => dispatch(setFilters({ maxPrice: Number(e.target.value) }))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f2ff]"
                    />
                    <div className="flex justify-between mt-4 text-xs text-white/60">
                        <span>$0</span>
                        <span className="text-[#00f2ff] font-bold">Up to ${filters.maxPrice}</span>
                    </div>
                </div>
            </div>

            {/* Rating Filter */}
            <div className="filter-section">
                <h3 className="filter-title">Minimum Rating</h3>
                <div className="space-y-2">
                    {ratings.map(rating => (
                        <div
                            key={rating}
                            className={`filter-option ${filters.minRating === rating ? 'active' : ''}`}
                            onClick={() => dispatch(setFilters({ minRating: rating }))}
                        >
                            <div className={`w-4 h-4 rounded-full border border-white/20 flex items-center justify-center ${filters.minRating === rating ? 'bg-[#00f2ff] border-[#00f2ff]' : ''}`}>
                                {filters.minRating === rating && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                            </div>
                            <span>{rating}+ Stars</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Availability */}
            <div className="filter-section">
                <h3 className="filter-title">Availability</h3>
                <div className="filter-option" onClick={() => dispatch(setFilters({ search: filters.search === 'available' ? '' : 'available' }))}>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${filters.search === 'available' ? 'bg-[#00f2ff]' : 'bg-white/10'}`}>
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${filters.search === 'available' ? 'left-6' : 'left-1'}`} />
                    </div>
                    <span>In Stock Only</span>
                </div>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="drawer-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                        />
                        <motion.div
                            className="drawer-content"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            {content}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        );
    }

    return content;
};

export default FilterPanel;
