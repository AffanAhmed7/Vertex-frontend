import { motion } from 'framer-motion';
import { Zap, Shield, Globe, Award, Star } from 'lucide-react';
import ProductCard from '../shop/ProductCard';
import { Product } from '../../store/slices/productSlice';

interface ProductDetailsSectionsProps {
    relatedProducts: Product[];
}

const ProductDetailsSections = ({ relatedProducts }: ProductDetailsSectionsProps) => {
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
                <h2 className="section-heading">Customer Reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { initials: 'AK', name: 'Alex K.', review: 'Excellent quality and fast shipping. The product exceeded my expectations. Would definitely purchase again.' },
                        { initials: 'SM', name: 'Sarah M.', review: 'Great value for the price. The packaging was premium and the product works exactly as described.' }
                    ].map((review, i) => (
                        <div key={i} className="glass-card p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl font-bold">{review.initials}</div>
                                <div>
                                    <div className="font-bold">{review.name}</div>
                                    <div className="flex text-[#00f2ff] gap-1">
                                        {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="#00f2ff" />)}
                                    </div>
                                </div>
                            </div>
                            <p className="text-white/60 italic leading-relaxed">"{review.review}"</p>
                        </div>
                    ))}
                </div>
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
