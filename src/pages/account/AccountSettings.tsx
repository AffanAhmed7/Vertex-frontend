import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Shield, Bell, Key, Save, CheckCircle2 } from 'lucide-react';
import { RootState } from '../../store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const AccountSettings: React.FC = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1500);
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <header className="space-y-2">
                <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">
                    Profile <span className="text-primary">Settings</span>
                </h1>
                <p className="text-muted-foreground">Manage your personal infrastructure and security protocols.</p>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {/* Personal Information */}
                <Card className="p-8 border-white/5" glass>
                    <div className="flex items-center gap-3 mb-8 text-primary">
                        <User size={20} />
                        <h2 className="text-lg font-medium text-white">Personal Information</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Full Name" defaultValue={currentUser?.name} />
                        <Input label="Email Address" defaultValue={currentUser?.email} />
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-3">Avatar Integration</label>
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <User size={32} className="text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <Button variant="outline" size="sm">Change Avatar</Button>
                                    <p className="text-[10px] text-muted-foreground">JPG, PNG or SVG. Max size 2MB.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Security & Authentication */}
                <Card className="p-8 border-white/5" glass>
                    <div className="flex items-center gap-3 mb-8 text-secondary">
                        <Shield size={20} />
                        <h2 className="text-lg font-medium text-white">Security & Authentication</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Current Password" type="password" placeholder="••••••••" />
                        <div className="hidden md:block" />
                        <Input label="New Password" type="password" placeholder="••••••••" />
                        <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                    </div>
                    <div className="mt-8 p-4 bg-secondary/5 border border-secondary/10 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Key size={18} className="text-secondary" />
                            <div>
                                <p className="text-xs font-bold">Two-Factor Authentication</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Currently Disabled</p>
                            </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-secondary/20 text-secondary hover:bg-secondary/10">Enable</Button>
                    </div>
                </Card>

                {/* Notification Preferences */}
                <Card className="p-8 border-white/5" glass>
                    <div className="flex items-center gap-3 mb-8 text-yellow-400">
                        <Bell size={20} />
                        <h2 className="text-lg font-medium text-white">Communications</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            { title: 'Order Status Updates', desc: 'Real-time notifications about your module provisioning and delivery.' },
                            { title: 'Security Alerts', desc: 'Critical alerts regarding your account access and security changes.' },
                            { title: 'Promotional Transmissions', desc: 'Updates on new hardware cycles and exclusive partner discounts.' }
                        ].map((pref, i) => (
                            <label key={i} className="flex items-start justify-between gap-6 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold group-hover:text-primary transition-colors">{pref.title}</p>
                                    <p className="text-xs text-muted-foreground">{pref.desc}</p>
                                </div>
                                <input type="checkbox" defaultChecked className="mt-1 accent-primary w-4 h-4" />
                            </label>
                        ))}
                    </div>
                </Card>

                {/* Sticky Action Bar */}
                <div className="flex justify-end pt-4">
                    <Button
                        size="lg"
                        onClick={handleSave}
                        isLoading={isSaving}
                        className="min-w-[200px]"
                    >
                        {saved ? (
                            <span className="flex items-center gap-2">
                                <CheckCircle2 size={18} />
                                Protocols Updated
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Save size={18} />
                                Save Protocols
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
