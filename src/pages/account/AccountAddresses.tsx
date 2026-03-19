import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Trash2, Edit3, ShieldCheck, AlertCircle } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { fetchAddresses, addNewAddress, deleteExistingAddress, clearError } from '../../store/slices/userSlice';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const AccountAddresses: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { addresses, loading, error } = useSelector((state: RootState) => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newAddress, setNewAddress] = useState({
        fullName: '',
        street: '',
        city: '',
        postalCode: '',
        country: '',
        type: 'SHIPPING' as 'SHIPPING' | 'BILLING',
        isDefault: false
    });

    useEffect(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to remove this address?')) {
            dispatch(deleteExistingAddress(id));
        }
    };

    const handleSaveAddress = async () => {
        setIsSubmitting(true);
        dispatch(clearError());
        try {
            const resultAction = await dispatch(addNewAddress(newAddress));
            if (addNewAddress.fulfilled.match(resultAction)) {
                setIsModalOpen(false);
                setNewAddress({
                    fullName: '',
                    street: '',
                    city: '',
                    postalCode: '',
                    country: '',
                    type: 'SHIPPING',
                    isDefault: false
                });
            }
        } catch (err) {
            console.error('Failed to save address:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">
                        Address <span className="text-primary">Book</span>
                    </h1>
                    <p className="text-muted-foreground">Manage your global shipping nodes and billing infrastructure.</p>
                </div>
                <Button onClick={() => { dispatch(clearError()); setIsModalOpen(true); }} className="group">
                    <Plus size={18} className="mr-2" />
                    New Address
                </Button>
            </header>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {loading && addresses.length === 0 ? (
                <div className="flex items-center justify-center p-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                </div>
            ) : (
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
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {address.street}<br />
                                            {address.city}, {address.postalCode}<br />
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
            )}

            {/* Modal for adding address */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Register New Deployment Node"
            >
                <div className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            label="Full Name" 
                            placeholder="Alex Sterling" 
                            className="md:col-span-2" 
                            value={newAddress.fullName}
                            onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                        />
                        <Input 
                            label="Street Address" 
                            placeholder="128 Tech Plaza" 
                            className="md:col-span-2" 
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                        />
                        <Input 
                            label="City" 
                            placeholder="San Francisco" 
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        />
                        <Input 
                            label="Postal Code" 
                            placeholder="94103" 
                            value={newAddress.postalCode}
                            onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                        />
                        <Input 
                            label="Country" 
                            placeholder="USA" 
                            className="md:col-span-2" 
                            value={newAddress.country}
                            onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                        />
                        <div className="md:col-span-2 flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="accent-primary"
                                    checked={newAddress.isDefault}
                                    onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                                />
                                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Set as Default Node</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <ShieldCheck size={18} className="text-primary" />
                        <span className="text-xs text-muted-foreground">This address will be verified against our global shipping database.</span>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <Button className="flex-grow" onClick={handleSaveAddress} isLoading={isSubmitting}>Save Address</Button>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AccountAddresses;
