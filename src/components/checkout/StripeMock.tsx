import React from 'react';
import { CreditCard, Lock, Calendar, ShieldCheck } from 'lucide-react';
import { Input } from '../ui/Input';

const StripeMock: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Payment Details</h3>
                <div className="flex gap-2">
                    <div className="w-10 h-6 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                        <span className="text-[8px] font-bold text-muted-foreground uppercase">Visa</span>
                    </div>
                    <div className="w-10 h-6 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                        <span className="text-[8px] font-bold text-muted-foreground uppercase">Master</span>
                    </div>
                    <div className="w-10 h-6 bg-white/5 border border-white/10 rounded flex items-center justify-center">
                        <span className="text-[8px] font-bold text-muted-foreground uppercase">Amex</span>
                    </div>
                </div>
            </div>

            <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-4">
                {/* Card Number */}
                <Input
                    label="Card Number"
                    placeholder="0000 0000 0000 0000"
                    icon={<CreditCard size={18} />}
                />

                <div className="grid grid-cols-2 gap-4">
                    {/* Expiry */}
                    <Input
                        label="Expiry Date"
                        placeholder="MM/YY"
                        icon={<Calendar size={18} />}
                    />

                    {/* CVC */}
                    <Input
                        label="CVC"
                        placeholder="123"
                        icon={<Lock size={18} />}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                <ShieldCheck size={20} className="text-primary shrink-0" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Your payment information is encrypted and processed securely by <span className="text-foreground font-semibold">Stripe</span>. We do not store your full card details on our servers.
                </p>
            </div>
        </div>
    );
};

export default StripeMock;
