import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Trash2, Edit3, ShieldCheck } from 'lucide-react';
import { RootState } from '../../store';
import { removeAddress } from '../../store/slices/userSlice';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const AccountAddresses: React.FC = () => {
    const dispatch = useDispatch();
    const { addresses } = useSelector((state: RootState) => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = (id: string) => {
        dispatch(removeAddress(id));
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase italic underline decoration-primary decoration-4 underline-offset-8">
                        Address <span className="text-primary italic">Book</span>
                    </h1>
                    <p className="text-muted-foreground">Manage your global shipping nodes and billing infrastructure.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="group">
                    <Plus size={18} className="mr-2" />
                    New Address
                </Button>
            </header>

            {/* Address Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {addresses.map((address, i) => (
                        <motion.div
                            key={address.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="p-6 bg-card/40 border-white/5 space-y-6 group hover:border-primary/20 transition-all" glass>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2 text-primary">
                                        <MapPin size={18} />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{address.type}</span>
                                    </div>
                                    {address.isDefault && (
                                        <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-black uppercase tracking-tight">
                                            Default
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <p className="text-lg font-bold">{address.fullName}</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {address.street}
                                        {address.city}, {address.postalCode}
                                        {address.country}
                                    </p>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-primary">
                                        <Edit3 size={14} className="mr-1" /> Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(address.id)}
                                        className="h-8 px-2 text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 size={14} className="mr-1" /> Remove
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal for adding address */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Register New Deployment Node"
            >
                <div className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Full Name" placeholder="Alex Sterling" className="md:col-span-2" />
                        <Input label="Street Address" placeholder="128 Tech Plaza" className="md:col-span-2" />
                        <Input label="City" placeholder="San Francisco" />
                        <Input label="Postal Code" placeholder="94103" />
                        <Input label="Country" placeholder="USA" className="md:col-span-2" />
                    </div>
                    <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <ShieldCheck size={18} className="text-primary" />
                        <span className="text-xs text-muted-foreground">This address will be verified against our global shipping database.</span>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <Button className="flex-grow" onClick={() => setIsModalOpen(false)}>Save Address</Button>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AccountAddresses;
