import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, MessageSquare, AlertCircle, CheckCircle2, History, ChevronRight } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { submitProductReview, clearReviewError, fetchUserReviews } from '../../store/slices/reviewSlice';

const AccountReviews: React.FC = () => {
    const { orders } = useSelector((state: RootState) => state.user);
    const { userReviews, loading: reviewLoading, error: reviewError } = useSelector((state: RootState) => state.reviews);
    const dispatch = useDispatch<AppDispatch>();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        dispatch(fetchUserReviews());
    }, [dispatch]);

    // Get IDs of products already reviewed
    const reviewedProductIds = new Set(userReviews.map(r => r.productId));

    // Flatten orders and filter out already reviewed items
    const pendingItems = orders
        .flatMap(o => o.items)
        .filter(item => !reviewedProductIds.has(item.productId));

    const handleOpenReview = (item: any) => {
        setSelectedItem(item);
        setRating(5);
        setComment('');
        setSuccess(false);
        dispatch(clearReviewError());
        setIsModalOpen(true);
    };

    const handleSubmitReview = async () => {
        if (!selectedItem) return;
        
        const resultAction = await dispatch(submitProductReview({
            productId: selectedItem.productId,
            data: { rating, comment }
        }));

        if (submitProductReview.fulfilled.match(resultAction)) {
            setSuccess(true);
            dispatch(fetchUserReviews()); // Refresh list
            setTimeout(() => {
                setIsModalOpen(false);
                setSuccess(false);
            }, 2000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-16 py-8">
            {/* Header */}
            <header className="space-y-4 text-center md:text-left">
                <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">
                    Product <span className="text-primary">Reviews</span>
                </h1>
                <p className="text-muted-foreground text-sm max-w-xl">
                    Managed your feedback. Review your recent purchases and browse your history to help the community.
                </p>
            </header>

            {/* Pending Reviews Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-xl font-light text-white uppercase tracking-wider">Pending Reviews</h2>
                    {pendingItems.length > 0 && (
                        <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 font-bold uppercase tracking-widest">
                            {pendingItems.length} Waiting
                        </span>
                    )}
                </div>

                {pendingItems.length > 0 ? (
                    <div className="divide-y divide-white/5 bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden">
                        {pendingItems.map((item, i) => (
                            <motion.div
                                key={`${item.id}-${i}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 hover:bg-white/[0.02] transition-colors group"
                            >
                                <div className="w-20 h-20 rounded-xl bg-white/5 overflow-hidden shrink-0 border border-white/5">
                                    <img src={item.product?.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                </div>
                                
                                <div className="flex-grow space-y-1">
                                    <h3 className="text-white font-medium">{item.product?.name}</h3>
                                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                        <span>Ordered Product</span>
                                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                        <div className="flex text-primary/40 gap-0.5">
                                            {[...Array(5)].map((_, idx) => (
                                                <Star key={idx} size={10} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Button 
                                    variant="outline" 
                                    className="h-10 px-6 border-white/10 hover:border-primary/50 hover:bg-primary/5 text-xs font-bold uppercase tracking-[0.2em] group-hover:translate-x-1 transition-all"
                                    onClick={() => handleOpenReview(item)}
                                >
                                    Write Review
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground/40">
                            <MessageSquare size={24} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">No items awaiting feedback</p>
                            <Button variant="link" className="text-primary text-[10px] uppercase tracking-widest mt-2 p-0 h-auto">Shop for more products</Button>
                        </div>
                    </div>
                )}
            </section>

            {/* My Reviews Section */}
            <section className="space-y-6 pb-20">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <History size={20} className="text-primary/60" />
                    <h2 className="text-xl font-light text-white uppercase tracking-wider">Review History</h2>
                </div>

                {userReviews.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground/40 text-[10px] uppercase tracking-[0.2em] font-bold">
                        Your review history is currently empty.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {userReviews.map((review, i) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-primary/20 transition-all group"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-14 h-14 rounded-lg bg-white/5 overflow-hidden border border-white/10 shrink-0">
                                        <img src={review.product?.image} alt="" className="w-full h-full object-cover opacity-80" />
                                    </div>

                                    <div className="flex-grow space-y-3">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{review.product?.name}</h3>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex text-primary gap-0.5">
                                                        {[...Array(5)].map((_, idx) => (
                                                            <Star key={idx} size={10} fill={idx < review.rating ? "currentColor" : "none"} />
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="relative">
                                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary/20 rounded-full"></div>
                                            <p className="text-sm text-white/60 leading-relaxed pl-5 italic font-light pr-4">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* Review Submission Modal (unchanged logic) */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Submit Product Review"
            >
                {success ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"
                        >
                            <CheckCircle2 size={32} />
                        </motion.div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-green-500">Review Submitted</h3>
                            <p className="text-xs text-muted-foreground">Thank you for your feedback!</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 pt-4">
                        {selectedItem && (
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden">
                                    <img src={selectedItem.product?.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white uppercase">{selectedItem.product?.name}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Ordered Product</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Your Rating</label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setRating(s)}
                                        className={`p-1 transition-colors ${rating >= s ? 'text-primary' : 'text-white/10'}`}
                                    >
                                        <Star size={24} fill={rating >= s ? 'currentColor' : 'none'} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Feedback</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors min-h-[120px] resize-none"
                                placeholder="Describe your experience with this product..."
                            />
                        </div>

                        {reviewError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-[10px] uppercase font-black tracking-widest">
                                <AlertCircle size={14} />
                                {reviewError}
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <Button 
                                className="flex-grow uppercase tracking-widest font-black" 
                                onClick={handleSubmitReview} 
                                isLoading={reviewLoading}
                                disabled={!comment.trim()}
                            >
                                Send Review
                            </Button>
                            <Button variant="outline" className="uppercase tracking-widest" onClick={() => setIsModalOpen(false)}>Back</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AccountReviews;
