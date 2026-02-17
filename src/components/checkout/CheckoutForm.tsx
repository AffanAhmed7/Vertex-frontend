import React from 'react';
import { Mail, User, MapPin, Globe, Phone } from 'lucide-react';
import { Input } from '../ui/Input';
import StripeMock from './StripeMock';

const CheckoutForm: React.FC = () => {
    return (
        <div className="space-y-12">
            {/* Contact Information */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        1
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground uppercase italic underline decoration-primary decoration-2 underline-offset-4">
                        Contact Information
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Input label="Email" placeholder="Email Address" className="pl-12 h-12 bg-white/5" />
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <div className="relative">
                        <Input label="Phone" placeholder="Phone Number" className="pl-12 h-12 bg-white/5" />
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                </div>
            </section>

            {/* Shipping Address */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        2
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground uppercase italic underline decoration-primary decoration-2 underline-offset-4">
                        Shipping Address
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative md:col-span-2">
                        <Input label="Full Name" placeholder="Full Name" className="pl-12 h-12 bg-white/5" />
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <div className="relative md:col-span-2">
                        <Input label="Address" placeholder="Street Address" className="pl-12 h-12 bg-white/5" />
                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <div className="relative">
                        <Input label="City" placeholder="City" className="pl-12 h-12 bg-white/5" />
                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <div className="relative">
                        <Input label="Postal Code" placeholder="Postal Code" className="pl-12 h-12 bg-white/5" />
                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <div className="relative md:col-span-2">
                        <Input label="Country" placeholder="Country" className="pl-12 h-12 bg-white/5" />
                        <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                </div>
            </section>

            {/* Payment Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        3
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground uppercase italic underline decoration-primary decoration-2 underline-offset-4">
                        Payment Method
                    </h2>
                </div>

                <StripeMock />
            </section>
        </div>
    );
};

export default CheckoutForm;
