import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { Product } from '../../store/slices/productSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { syncAddToCart } from '../../store/slices/cartSlice';

interface ProductCardProps {
    product: Product;
    index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(syncAddToCart({
            ...product,
            quantity: 1,
            selectedVariants: {} // Default empty variants for quick add
        }));
    };

    return (
        <Link to={`/product/${product.id}`}>
            <motion.div
                className="glass-card product-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{
                    scale: 1.02,
                    rotateX: 2,
                    rotateY: 2,
                    transition: { duration: 0.4 }
                }}
                viewport={{ once: true }}
                style={{ perspective: 1000 }}
            >
                <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />

                    <div className="hover-actions">
                        <button 
                            className="btn-primary-shop"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                        <button className="btn-icon">
                            <Heart size={18} />
                        </button>
                    </div>
                </div>

                <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-footer">
                        <span className="product-price">${product.price}</span>
                        <div className="rating-badge">
                            <Star size={12} fill="#00f2ff" color="#00f2ff" />
                            <span>{product.rating}</span>
                        </div>
                    </div>

                    <p className="text-xs text-white/40 mt-3 line-clamp-2">
                        {product.description}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
};

export default ProductCard;
