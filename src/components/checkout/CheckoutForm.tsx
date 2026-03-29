import React from 'react';
import { Mail, User, MapPin, Globe, Phone } from 'lucide-react';
import { Input } from '../ui/Input';
import StripeMock from './StripeMock';

interface CheckoutFormProps {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    addresses?: any[];
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ formData, setFormData, addresses }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectAddress = (address: any) => {
        setFormData((prev: any) => ({
            ...prev,
            shippingName: address.fullName,
            shippingPhone: address.phone || prev.shippingPhone,
            shippingAddress: address.street,
            shippingCity: address.city,
            shippingZip: address.postalCode,
            shippingCountry: address.country
        }));
    };

    return (
        <div className="space-y-12">
            {/* Saved Addresses — subtle inline autofill */}
            {addresses && addresses.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium whitespace-nowrap">Saved:</span>
                    {addresses.map((addr) => (
                        <button
                            key={addr.id}
                            type="button"
                            onClick={() => handleSelectAddress(addr)}
                            className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.06] transition-all text-[11px] text-white/50 hover:text-white/80"
                        >
                            {addr.fullName.split(' ')[0]} — {addr.city}
                        </button>
                    ))}
                </div>
            )}

            {/* Contact Information */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        1
                    </div>
                    <h2 className="text-lg font-medium tracking-[0.1em] text-white uppercase">
                        Contact Information
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                        label="Email" 
                        name="email" 
                        value={formData.email || ''} 
                        onChange={handleChange} 
                        placeholder="Email Address" 
                        autoComplete="email"
                        icon={<Mail size={18} />}
                    />
                    <Input 
                        label="Phone" 
                        name="shippingPhone" 
                        value={formData.shippingPhone || ''} 
                        onChange={handleChange} 
                        placeholder="Phone Number" 
                        autoComplete="tel"
                        icon={<Phone size={18} />}
                    />
                </div>
            </section>

            {/* Shipping Address */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        2
                    </div>
                    <h2 className="text-lg font-medium tracking-[0.1em] text-white uppercase">
                        Shipping Address
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <Input 
                            label="Full Name" 
                            name="shippingName" 
                            value={formData.shippingName || ''} 
                            onChange={handleChange} 
                            placeholder="Full Name" 
                            autoComplete="name"
                            icon={<User size={18} />}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Input 
                            label="Address" 
                            name="shippingAddress" 
                            value={formData.shippingAddress || ''} 
                            onChange={handleChange} 
                            placeholder="Street Address" 
                            autoComplete="address-line1"
                            icon={<MapPin size={18} />}
                        />
                    </div>
                    <Input 
                        label="City" 
                        name="shippingCity" 
                        value={formData.shippingCity || ''} 
                        onChange={handleChange} 
                        placeholder="City" 
                        autoComplete="address-level2"
                        icon={<MapPin size={18} />}
                    />
                    <Input 
                        label="Zip Code" 
                        name="shippingZip" 
                        value={formData.shippingZip || ''} 
                        onChange={handleChange} 
                        placeholder="Zip Code" 
                        autoComplete="postal-code"
                        icon={<MapPin size={18} />}
                    />
                    <div className="md:col-span-2">
                        <Input 
                            label="Country" 
                            name="shippingCountry" 
                            value={formData.shippingCountry || ''} 
                            onChange={handleChange} 
                            placeholder="Country" 
                            autoComplete="country-name"
                            icon={<Globe size={18} />}
                        />
                    </div>
                </div>
            </section>

            {/* Payment Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        3
                    </div>
                    <h2 className="text-lg font-medium tracking-[0.1em] text-white uppercase">
                        Payment Method
                    </h2>
                </div>

                <StripeMock />
            </section>
        </div>
    );
};

export default CheckoutForm;
