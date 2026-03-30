import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ShieldCheck, Truck, RotateCcw, Star } from 'lucide-react';
import { Product } from '../../store/slices/productSlice';

interface ProductInfoProps {
    product: Product;
}

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { syncAddToCart } from '../../store/slices/cartSlice';
import { AppDispatch } from '../../store';

const ProductInfo = ({ product }: ProductInfoProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
        const defaults: Record<string, string> = {};
        product.variants?.forEach(v => {
            defaults[v.type] = v.options[0];
        });
        return defaults;
    });

    const handleVariantSelect = (type: string, value: string) => {
        setSelectedVariants(prev => ({ ...prev, [type]: value }));
    };

    const handleAddToCart = async () => {
        await dispatch(syncAddToCart({
            ...product,
            quantity: 1,
            selectedVariants
        })).unwrap();
    };

    const handleBuyNow = async () => {
        try {
            await handleAddToCart();
            navigate('/checkout');
        } catch (error) {
            // Error toast is already handled in the thunk
        }
    };

    return (
        <div className="product-info-panel">
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="product-tag">{product.category}</span>
                <h1 className="detail-name">{product.name}</h1>

                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={16}
                                fill={i < Math.floor(product.rating) ? "#00f2ff" : "transparent"}
                                color={i < Math.floor(product.rating) ? "#00f2ff" : "rgba(255,255,255,0.2)"}
                            />
                        ))}
                    </div>
                    <span className="text-white/40 text-sm">
                        {product.rating} ({product.numReviews > 0 ? `${product.numReviews} Reviews` : 'No reviews yet'})
                    </span>
                </div>

                <div className="detail-price">
                    ${product.price.toLocaleString()}
                    {product.category === 'Digital' && <span className="text-sm text-white/40 ml-2">/ year</span>}
                </div>

                <p className="text-white/50 text-sm leading-relaxed mb-8">{product.description}</p>

                {/* Dynamic Variant Selectors */}
                {product.variants && product.variants.map((variant) => (
                    <div key={variant.type} className="variants-section">
                        <span className="variant-label">{variant.label}</span>
                        <div className="variant-options">
                            {variant.options.map(option => (
                                <button
                                    key={option}
                                    className={`variant-chip ${selectedVariants[variant.type] === option ? 'active' : ''}`}
                                    onClick={() => handleVariantSelect(variant.type, option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Specs Table */}
                {product.specs && product.specs.length > 0 && (
                    <div className="specs-table">
                        {product.specs.map((spec, i) => (
                            <div key={i} className="spec-row">
                                <span className="spec-label">{spec.label}</span>
                                <span className="spec-val">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="product-actions">
                    <motion.button
                        className="btn-buy-now"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBuyNow}
                    >
                        {product.category === 'Digital' ? 'Subscribe Now' : 'Buy Now'}
                    </motion.button>
                    <button
                        className="btn-add-cart-outline flex items-center justify-center gap-3 transition-all active:scale-95"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart size={20} />
                        Add to Cart
                    </button>
                </div>

                <div className="trust-badges">
                    <div className="trust-badge-item">
                        <ShieldCheck size={20} />
                        <span>Secure Checkout</span>
                    </div>
                    <div className="trust-badge-item">
                        <Truck size={20} />
                        <span>{product.category === 'Digital' ? 'Instant Delivery' : 'Free Shipping'}</span>
                    </div>
                    <div className="trust-badge-item">
                        <RotateCcw size={20} />
                        <span>{product.category === 'Digital' ? '30-Day Refund' : '30-Day Returns'}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProductInfo;
