import { motion } from 'framer-motion';
import { Zap, Shield, Globe, Award, Star } from 'lucide-react';
import ProductCard from '../shop/ProductCard';
import { Product } from '../../store/slices/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchProductReviews } from '../../store/slices/reviewSlice';
import { useEffect } from 'react';

interface ProductDetailsSectionsProps {
    relatedProducts: Product[];
    productId: string;
}

const ProductDetailsSections = ({ relatedProducts, productId }: ProductDetailsSectionsProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { productReviews, loading } = useSelector((state: RootState) => state.reviews);
    
    const reviewsData = productReviews[productId] || { reviews: [], averageRating: 0, totalReviews: 0 };

    useEffect(() => {
        if (productId) {
            dispatch(fetchProductReviews(productId));
        }
    }, [productId, dispatch]);

    const highlights = [
        { icon: Zap, title: "Fast Delivery", value: "Free express shipping on orders over $50. Delivered within 2-5 business days." },
        { icon: Shield, title: "Quality Guarantee", value: "Every product is verified for quality. 30-day hassle-free returns guaranteed." },
        { icon: Globe, title: "Worldwide Shipping", value: "We deliver to 140+ countries with real-time tracking and insured packages." },
        { icon: Award, title: "Secure Payments", value: "SSL encrypted checkout. We accept all major cards, Apple Pay, and PayPal." }
    ];

    return (
        <div className="detail-sections-wrapper">
            {/* Highlights Grid */}
            <div className="specs-grid">
                {highlights.map((item, i) => (
                    <motion.div
                        key={i}
                        className="spec-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <item.icon className="spec-icon" size={32} />
                        <h3 className="spec-title">{item.title}</h3>
                        <p className="spec-value">{item.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Reviews Section */}
            <div className="mb-20">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="section-heading mb-0">Customer Reviews</h2>
                        <p className="text-white/40 text-sm mt-1">{reviewsData.totalReviews} reviews for this product</p>
                    </div>
                    {reviewsData.totalReviews > 0 && (
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                            <span className="text-xl font-bold">{reviewsData.averageRating.toFixed(1)}</span>
                            <div className="flex text-primary">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={14} 
                                        fill={i < Math.round(reviewsData.averageRating) ? "currentColor" : "none"} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </header>

                {loading && reviewsData.reviews.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                    </div>
                ) : reviewsData.reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviewsData.reviews.map((review, i) => (
                            <motion.div 
                                key={review.id} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-8"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                                        {(review.user.name || review.user.email)[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-bold flex items-center gap-2 text-white">
                                            {review.user.name || review.user.email.split('@')[0]}
                                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/40 font-normal">Verified Buyer</span>
                                        </div>
                                        <div className="flex text-primary gap-1">
                                            {[...Array(5)].map((_, j) => (
                                                <Star 
                                                    key={j} 
                                                    size={12} 
                                                    fill={j < review.rating ? "currentColor" : "none"} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="ml-auto text-[10px] text-white/20 uppercase tracking-widest font-medium">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <p className="text-white/60 italic leading-relaxed">"{review.comment}"</p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-12 text-center border-dashed border-white/10">
                        <p className="text-white/40 italic">No reviews yet. Be the first to share your experience!</p>
                    </div>
                )}
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-20 mb-16">
                    <h2 className="section-heading">You May Also Like</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((product, i) => (
                            <ProductCard key={product.id} product={product} index={i} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailsSections;
