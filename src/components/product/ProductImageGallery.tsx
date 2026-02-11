import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const goToPrev = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="gallery-container">
            {/* Main Image */}
            <div className="gallery-main">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={selectedIndex}
                        src={images[selectedIndex]}
                        alt={`${productName} - View ${selectedIndex + 1}`}
                        className="gallery-main-image"
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                    />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button className="gallery-nav gallery-nav-prev" onClick={goToPrev} aria-label="Previous image">
                            <ChevronLeft size={20} />
                        </button>
                        <button className="gallery-nav gallery-nav-next" onClick={goToNext} aria-label="Next image">
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                <div className="gallery-counter">
                    {selectedIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="gallery-thumbnails">
                {images.map((img, i) => (
                    <button
                        key={i}
                        className={`gallery-thumb ${i === selectedIndex ? 'active' : ''}`}
                        onClick={() => setSelectedIndex(i)}
                    >
                        <img src={img} alt={`${productName} thumbnail ${i + 1}`} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductImageGallery;
