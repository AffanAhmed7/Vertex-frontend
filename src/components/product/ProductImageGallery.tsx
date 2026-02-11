import { motion } from 'framer-motion';

interface ProductImageProps {
    image: string;
    productName: string;
}

const ProductImageGallery = ({ image, productName }: ProductImageProps) => {
    return (
        <div className="gallery-container">
            <div className="gallery-main">
                <motion.img
                    src={image}
                    alt={productName}
                    className="gallery-main-image"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                />
            </div>
        </div>
    );
};

export default ProductImageGallery;
