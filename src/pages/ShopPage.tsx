import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Search, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchProducts, setFilters, resetFilters } from '../store/slices/productSlice';
import ProductCard from '../components/shop/ProductCard';
import FilterPanel from '../components/shop/FilterPanel';
import '../styles/shop-page.css';

const ShopPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams] = useSearchParams();
    const { filteredItems, loading, filters } = useSelector((state: RootState) => state.products);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    useEffect(() => {
        const urlSort = searchParams.get('sortBy');
        if (urlSort && urlSort !== filters.sortBy) {
            dispatch(setFilters({ sortBy: urlSort as any }));
        }
    }, [searchParams, dispatch]);

    useEffect(() => {
        dispatch(fetchProducts(filters));
    }, [dispatch, filters.category, filters.sortBy, filters.search, filters.minPrice, filters.maxPrice]);

    return (
        <div className="shop-container">
            <div className="shop-layout">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block">
                    <FilterPanel />
                </aside>

                {/* Main Content */}
                <main>
                    {/* Header Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                        <div className="relative w-full md:w-[400px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                            <input
                                type="text"
                                placeholder="Search our collection..."
                                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 focus:border-[#00f2ff] outline-none transition-all placeholder:text-white/20"
                                value={filters.search}
                                onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
                            />
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button
                                className="lg:hidden flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-full py-3 px-6 hover:bg-white/10 transition-all"
                                onClick={() => setIsMobileFilterOpen(true)}
                            >
                                <SlidersHorizontal size={18} />
                                <span>Filters</span>
                            </button>

                            <div className="relative group">
                                <select
                                    className="bg-white/5 border border-white/10 rounded-full py-3 pl-6 pr-12 outline-none hover:bg-white/10 transition-all cursor-pointer appearance-none text-sm font-medium focus:border-[#00f2ff]/50 min-w-[200px]"
                                    value={filters.sortBy}
                                    onChange={(e) => dispatch(setFilters({ sortBy: e.target.value as any }))}
                                >
                                    <option value="price-low" className="bg-[#0a0a0c]">Price: Low to High</option>
                                    <option value="price-high" className="bg-[#0a0a0c]">Price: High to Low</option>
                                    <option value="rating" className="bg-[#0a0a0c]">Highest Rated</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-[#00f2ff] pointer-events-none transition-colors" size={16} />
                            </div>


                        </div>
                    </div>

                    {/* Active Chips */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {filters.category !== 'All' && (
                            <span className="chip">
                                {filters.category}
                                <X size={12} className="cursor-pointer ml-2" onClick={() => dispatch(setFilters({ category: 'All' }))} />
                            </span>
                        )}
                        {filters.maxPrice < 5000 && (
                            <span className="chip">
                                Under ${filters.maxPrice}
                                <X size={12} className="cursor-pointer ml-2" onClick={() => dispatch(setFilters({ maxPrice: 5000 }))} />
                            </span>
                        )}
                        {filters.onlyInStock && (
                            <span className="chip">
                                In Stock Only
                                <X size={12} className="cursor-pointer ml-2" onClick={() => dispatch(setFilters({ onlyInStock: false }))} />
                            </span>
                        )}
                    </div>

                    {/* Results Grid */}
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                className="skeleton-grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
                            </motion.div>
                        ) : filteredItems.length > 0 ? (
                            <motion.div
                                key="grid"
                                className="product-grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ staggerChildren: 0.1 }}
                            >
                                {filteredItems.map((product, i) => (
                                    <ProductCard key={product.id} product={product} index={i} />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                className="flex flex-col items-center justify-center py-32 text-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Search size={64} className="text-white/10 mb-6" />
                                <h2 className="text-2xl font-bold mb-2">No selections found</h2>
                                <p className="text-white/40 mb-8 max-width-[400px]">We couldn't find any products matching your current criteria. Try adjusting your filters.</p>
                                <button className="btn-primary-shop px-8 py-3" onClick={() => dispatch(resetFilters())}>Clear all filters</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* Mobile Filter Drawer */}
            <FilterPanel
                isMobile
                isOpen={isMobileFilterOpen}
                onClose={() => setIsMobileFilterOpen(false)}
            />
        </div>
    );
};

const X = ({ size, className, onClick }: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        onClick={onClick}
    >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default ShopPage;
