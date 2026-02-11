import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../store';
import { setSelectedProduct, setLoading, setError } from '../store/slices/productSlice';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductInfo from '../components/product/ProductInfo';
import ProductDetailsSections from '../components/product/ProductDetailsSections';
import { allProducts } from '../data/products';
import '../styles/product-detail.css';

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedProduct, loading, error } = useSelector((state: RootState) => state.products);

    useEffect(() => {
        dispatch(setLoading(true));

        const timer = setTimeout(() => {
            const product = allProducts.find(p => p.id === id);
            if (product) {
                dispatch(setSelectedProduct(product));
                dispatch(setError(null));
            } else {
                dispatch(setError('Product Not Found'));
            }
            dispatch(setLoading(false));
        }, 600);

        return () => {
            clearTimeout(timer);
        };
    }, [id, dispatch]);

    if (loading) {
        return (
            <div className="product-detail-container flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#00f2ff]/20 border-t-[#00f2ff] rounded-full animate-spin mb-6 mx-auto"></div>
                    <p className="text-[#00f2ff] font-bold tracking-[0.2em] uppercase text-sm">Loading Product</p>
                </div>
            </div>
        );
    }

    if (error || !selectedProduct) {
        return (
            <div className="product-detail-container flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">Product Not Found</h2>
                    <p className="text-white/40 mb-8">The requested product could not be found in our collection.</p>
                    <button className="btn-buy-now px-8" onClick={() => navigate('/shop')}>Return to Shop</button>
                </div>
            </div>
        );
    }

    // Get related products from same category
    const relatedProducts = allProducts
        .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
        .slice(0, 4);

    return (
        <div className="product-detail-container">
            <motion.div
                className="product-detail-layout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                {/* Image Gallery Section */}
                <div className="viewer-area">
                    <ProductImageGallery
                        images={selectedProduct.images}
                        productName={selectedProduct.name}
                    />
                </div>

                {/* Product Info Section */}
                <div className="info-area">
                    <ProductInfo product={selectedProduct} />
                </div>
            </motion.div>

            {/* Below the fold */}
            <ProductDetailsSections relatedProducts={relatedProducts} />

            {/* Mobile Sticky CTA */}
            <div className="mobile-sticky-actions">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-white/40">Price</span>
                    <span className="text-sm font-bold">${selectedProduct.price.toLocaleString()}</span>
                </div>
                <button className="flex-1 bg-[#00f2ff] text-black font-bold rounded-lg py-3 text-sm uppercase">
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductDetailPage;
