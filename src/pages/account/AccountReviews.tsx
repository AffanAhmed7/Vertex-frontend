import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';
import { RootState } from '../../store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const AccountReviews: React.FC = () => {
    const { orders } = useSelector((state: RootState) => state.user);

    // Flatten orders for eligible products
    const eligibleItems = orders.flatMap(o => o.items);

    return (
        <div className="space-y-12">
            {/* Header */}
            <header className="space-y-2">
                <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">
                    Node <span className="text-primary">Reviews</span>
                </h1>
                <p className="text-muted-foreground">Share your technical feedback and integration performance with the Vertex community.</p>
            </header>

            {/* Content */}
            <div className="space-y-6">
                <h2 className="text-lg font-medium text-white">Pending Reviews</h2>

                {eligibleItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {eligibleItems.map((item, i) => (
                            <motion.div
                                key={`${item.id}-${i}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="p-6 bg-card/40 border-white/5 space-y-6" glass>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold truncate">{item.name}</h3>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Provisioned on order VTX-{Math.floor(Math.random() * 900000 + 100000)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-1 text-primary/40">
                                            {[...Array(5)].map((_, idx) => (
                                                <Star key={idx} size={16} />
                                            ))}
                                        </div>
                                        <Button variant="outline" size="sm" className="h-9 px-4 border-primary/20 text-primary hover:bg-primary/10">
                                            Review Module
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <Card className="p-20 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-white/10" glass={false}>
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                            <MessageSquare size={32} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold uppercase tracking-widest">Feedback Channel Empty</h3>
                            <p className="text-xs text-muted-foreground max-w-[240px]">You have no pending module reviews. Deploy more infrastructure to start your feedback loop.</p>
                        </div>
                        <Button variant="ghost" className="text-primary text-xs">Explore Modules &rarr;</Button>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default AccountReviews;
