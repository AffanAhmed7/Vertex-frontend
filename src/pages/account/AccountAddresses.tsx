import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Trash2, Edit3, ShieldCheck, AlertCircle, User, Globe, Phone } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { fetchAddresses, addNewAddress, deleteExistingAddress, updateExistingAddress, clearError } from '../../store/slices/userSlice';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const AccountAddresses: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { addresses, loading, error } = useSelector((state: RootState) => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newAddress, setNewAddress] = useState({
        fullName: '',
        street: '',
        city: '',
        postalCode: '',
        country: '',
        phone: '',
        type: 'SHIPPING' as 'SHIPPING' | 'BILLING',
        isDefault: false
    });

    useEffect(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        setAddressToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (addressToDelete) {
            await dispatch(deleteExistingAddress(addressToDelete));
            setIsDeleteModalOpen(false);
            setAddressToDelete(null);
        }
    };

    const handleEdit = (address: any) => {
        setEditingAddressId(address.id);
        setNewAddress({
            fullName: address.fullName,
            street: address.street,
            city: address.city,
            postalCode: address.postalCode,
            country: address.country,
            phone: address.phone || '',
            type: address.type,
            isDefault: address.isDefault
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingAddressId(null);
        setNewAddress({
            fullName: '',
            street: '',
            city: '',
            postalCode: '',
            country: '',
            phone: '',
            type: 'SHIPPING',
            isDefault: false
        });
    };

    const handleSaveAddress = async () => {
        setIsSubmitting(true);
        dispatch(clearError());
        try {
            const addressData = {
                ...newAddress,
                phone: newAddress.phone.trim() || undefined
            };

            let resultAction;
            if (editingAddressId) {
                resultAction = await dispatch(updateExistingAddress({ id: editingAddressId, data: addressData }));
            } else {
                resultAction = await dispatch(addNewAddress(addressData));
            }

            if (addNewAddress.fulfilled.match(resultAction) || updateExistingAddress.fulfilled.match(resultAction)) {
                setIsModalOpen(false);
                resetForm();
            }
        } catch (err) {
            console.error('Failed to save address:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-12">
            {/* Main Header Card */}
            <Card className="p-0 bg-card/40 border-white/5" glass>
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">
                            Address <span className="text-primary">Book</span>
                        </h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mt-2">Manage your shipping and billing addresses</p>
                    </div>
                    <Button 
                        onClick={() => { dispatch(clearError()); resetForm(); setIsModalOpen(true); }} 
                        className="group bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 h-12 px-8 uppercase tracking-widest text-[10px] font-black"
                    >
                        <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" />
                        Add New Address
                    </Button>
                </div>

                {error && (
                    <div className="m-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-[10px] uppercase font-black tracking-widest">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {loading && addresses.length === 0 ? (
                    <div className="flex items-center justify-center p-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="p-8">
                        {addresses.length === 0 ? (
                            <div className="py-12 text-center italic text-muted-foreground text-sm opacity-50 border-2 border-dashed border-white/5 rounded-2xl">
                                No addresses found.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <AnimatePresence mode="popLayout">
                                    {addresses.map((address, i) => (
                                        <motion.div
                                            key={address.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Card className="p-0 bg-white/5 border-white/5 space-y-0 group hover:border-primary/40 transition-all hover:bg-white/[0.07]" glass={false}>
                                                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                                    <div className="flex items-center gap-3 text-primary/60">
                                                        <MapPin size={16} />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{address.type} ADDRESS</span>
                                                    </div>
                                                    {address.isDefault && (
                                                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-[0.2em] border border-primary/20">
                                                            Primary Default
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="p-6 space-y-4">
                                                    <div className="space-y-1">
                                                        <p className="text-base font-bold text-white uppercase tracking-tight">{address.fullName}</p>
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                                {address.street}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                                {address.city}, {address.postalCode}
                                                            </p>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest pt-2">
                                                            {address.country}
                                                        </p>
                                                    </div>

                                                    {address.phone && (
                                                        <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest pt-2 border-t border-white/5">
                                                            <Phone size={12} className="text-primary/40" />
                                                            {address.phone}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="px-6 py-4 bg-white/5 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleEdit(address)}
                                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-colors flex items-center gap-2"
                                                    >
                                                        <Edit3 size={12} /> Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(address.id)}
                                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-red-500 transition-colors flex items-center gap-2"
                                                    >
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Modal for adding/editing address */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); resetForm(); }}
                title={editingAddressId ? "Edit Address" : "Add New Address"}
            >
                <div className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            label="Full Name" 
                            placeholder="Alex Sterling" 
                            className="md:col-span-2" 
                            value={newAddress.fullName}
                            onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                            icon={<User size={18} />}
                        />
                        <Input 
                            label="Street Address" 
                            placeholder="128 Tech Plaza" 
                            className="md:col-span-2" 
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                            icon={<MapPin size={18} />}
                        />
                        <Input 
                            label="City" 
                            placeholder="San Francisco" 
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                            icon={<MapPin size={18} />}
                        />
                        <Input 
                            label="Postal Code" 
                            placeholder="94103" 
                            value={newAddress.postalCode}
                            onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                            icon={<MapPin size={18} />}
                        />
                        <Input 
                            label="Country" 
                            placeholder="USA" 
                            className="md:col-span-2" 
                            value={newAddress.country}
                            onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                            icon={<Globe size={18} />}
                        />
                        <Input 
                            label="Phone Number" 
                            placeholder="+1 (555) 000-0000" 
                            className="md:col-span-2" 
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                            icon={<Phone size={18} />}
                        />
                        <div className="md:col-span-2 flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="accent-primary"
                                    checked={newAddress.isDefault}
                                    onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                                />
                                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Set as Default Address</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <ShieldCheck size={18} className="text-primary" />
                        <span className="text-xs text-muted-foreground">This address will be verified for shipping.</span>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <Button className="flex-grow" onClick={handleSaveAddress} isLoading={isSubmitting}>
                            {editingAddressId ? "Save Changes" : "Save Address"}
                        </Button>
                        <Button variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancel</Button>
                    </div>
                </div>
            </Modal>

            {/* Simplified Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setAddressToDelete(null); }}
                title="Remove Address?"
            >
                <div className="space-y-6 pt-4">
                    <p className="text-sm text-muted-foreground">Are you sure you want to delete this address? This action cannot be undone.</p>
                    <div className="flex gap-4">
                        <Button 
                            className="flex-grow bg-red-500 hover:bg-red-600 text-white border-0" 
                            onClick={confirmDelete}
                        >
                            Delete
                        </Button>
                        <Button variant="outline" className="flex-grow" onClick={() => { setIsDeleteModalOpen(false); setAddressToDelete(null); }}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AccountAddresses;
