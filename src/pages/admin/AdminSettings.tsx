import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, CreditCard, Truck, Bell, Save, Trash2, Check, RefreshCw } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { fetchSettings, updateSettings, factoryReset } from '../../services/adminService';
import { addToast } from '../../store/slices/toastSlice';
import { useDispatch } from 'react-redux';
import AdminVault from '../../components/admin/AdminVault';



const AdminSettings: React.FC = () => {
    const dispatch = useDispatch();
    const [settings, setSettings] = useState<any>(null);
    const [savedSettings, setSavedSettings] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isVaultOpen, setIsVaultOpen] = useState(false);
    const [vaultContext, setVaultContext] = useState<'save' | 'reset'>('save');

    // Load settings from backend
    React.useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchSettings();
                setSettings(data);
                setSavedSettings(data);
            } catch (err) {
                console.error('Failed to load settings', err);
            }
        };
        load();
    }, []);

    const hasChanges = settings && savedSettings && JSON.stringify(settings) !== JSON.stringify(savedSettings);

    const handleSaveInitiate = () => {
        setVaultContext('save');
        setIsVaultOpen(true);
    };

    const handleResetInitiate = () => {
        const confirmed = window.confirm("WARNING: This will permanently delete all store data (Orders, Products, Analytics). This action is IRREVERSIBLE. Are you sure you want to proceed?");
        if (!confirmed) return;
        
        setVaultContext('reset');
        setIsVaultOpen(true);
    };

    const handleVaultSuccess = async () => {
        if (vaultContext === 'save') {
            await handleSaveAction();
        } else {
            await handleResetAction();
        }
    };

    const handleSaveAction = async () => {
        setIsSaving(true);
        try {
            const res = await updateSettings(settings);
            setSavedSettings({ ...settings });
            setLastSaved(new Date());
            dispatch(addToast({ message: res.message || 'Settings updated successfully.', type: 'success' }));
        } catch (err) {
            dispatch(addToast({ message: 'Failed to update configuration.', type: 'error' }));
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetAction = async () => {
        try {
            const res = await factoryReset();
            dispatch(addToast({ message: res.message, type: 'success' }));
            // Reload page to reflect purged state
            window.location.reload();
        } catch (err) {
            dispatch(addToast({ message: 'Critical error during system reset.', type: 'error' }));
        }
    };

    const handleChange = (key: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    const getCurrencySymbol = (code: string) => {
        const symbols: Record<string, string> = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥',
            'PKR': '₨'
        };
        return symbols[code] || '$';
    };

    const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
        <button
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-[#00f2ff] focus:ring-offset-2 focus:ring-offset-[#111114] transition-colors duration-200 ease-in-out ${checked ? 'bg-[#00f2ff]' : 'bg-white/10'}`}
        >
            <span className="sr-only">Toggle setting</span>
            <span
                aria-hidden="true"
                className={`pointer-events-none absolute left-0 inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`}
            />
        </button>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">Platform Settings</h1>
                    <p className="text-[9px] text-[#00f2ff]/40 uppercase tracking-[0.4em] font-black">Admin Interface <span className="text-white/10 mx-2">/</span> Configuration</p>
                </div>

                {/* Floating Save Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: hasChanges || isSaving || lastSaved ? 1 : 0, y: hasChanges || isSaving || lastSaved ? 0 : 10 }}
                    className="flex items-center gap-4"
                >
                    {lastSaved && !hasChanges && !isSaving && (
                        <span className="text-xs text-emerald-500 font-medium flex items-center gap-1.5">
                            <Check size={12} /> Saved {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
                    {hasChanges && (
                        <span className="text-xs text-amber-500 font-medium">
                            Unsaved Changes
                        </span>
                    )}
                    <Button
                        onClick={handleSaveInitiate}
                        disabled={!hasChanges || isSaving}
                        className={`flex items-center gap-2 px-6 h-[40px] rounded-xl text-xs font-medium transition-all shadow-xl ${hasChanges ? 'bg-[#00f2ff] text-[#0e0e10] hover:bg-[#00f2ff]/90 hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]' : 'bg-white/5 text-white/40 cursor-not-allowed'}`}
                    >
                        {isSaving ? (
                            <><RefreshCw size={14} className="animate-spin" /> Saving...</>
                        ) : (
                            <><Save size={14} /> Save Config</>
                        )}
                    </Button>
                </motion.div>
            </div>

            {!settings ? (
                <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 rounded-full bg-[#00f2ff]/5 border border-[#00f2ff]/10">
                        <RefreshCw className="animate-spin text-[#00f2ff]" size={32} />
                    </div>
                    <p className="text-[10px] text-[#00f2ff]/40 uppercase tracking-[0.4em] font-black animate-pulse">Synchronizing Platform Core...</p>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                {/* Store Details */}
                <motion.div variants={itemVariants}>
                    <Card className="p-6 bg-[#111114] border-white/5 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-[#00f2ff]/10 text-[#00f2ff]">
                                <Store size={20} />
                            </div>
                            <h3 className="text-sm font-medium text-white">Store Details</h3>
                        </div>
                        <div className="space-y-5 flex-1">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/40">Store Name</label>
                                <input
                                    type="text"
                                    value={settings.storeName}
                                    onChange={(e) => handleChange('storeName', e.target.value)}
                                    className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f2ff]/50 focus:ring-1 focus:ring-[#00f2ff]/50 transition-all font-medium"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/40">Contact Email</label>
                                    <input
                                        type="email"
                                        value={settings.contactEmail}
                                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                                        className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f2ff]/50 focus:ring-1 focus:ring-[#00f2ff]/50 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/40">Support Phone</label>
                                    <input
                                        type="text"
                                        value={settings.supportPhone}
                                        onChange={(e) => handleChange('supportPhone', e.target.value)}
                                        className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f2ff]/50 focus:ring-1 focus:ring-[#00f2ff]/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/40">Store Currency</label>
                                <select
                                    value={settings.currency}
                                    onChange={(e) => handleChange('currency', e.target.value)}
                                    className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f2ff]/50 focus:ring-1 focus:ring-[#00f2ff]/50 transition-all font-medium appearance-none"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="JPY">JPY (¥)</option>
                                    <option value="PKR">PKR (₨)</option>
                                </select>
                            </div>
                        </div>

                    </Card>
                </motion.div>

                {/* Payment Processing */}
                <motion.div variants={itemVariants}>
                    <Card className="p-6 bg-[#111114] border-white/5 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-[#00f2ff]/10 text-[#00f2ff]">
                                <CreditCard size={20} />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Payment Processing</h3>
                        </div>
                        <div className="space-y-6 flex-1">
                            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Stripe Integration</h4>
                                    <p className="text-xs text-muted-foreground">Accept credit cards and Apple Pay</p>
                                </div>
                                <Toggle checked={settings.stripeEnabled} onChange={(v) => handleChange('stripeEnabled', v)} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">PayPal Express</h4>
                                    <p className="text-xs text-muted-foreground">Fast checkout via PayPal</p>
                                </div>
                                <Toggle checked={settings.paypalEnabled} onChange={(v) => handleChange('paypalEnabled', v)} />
                            </div>
                            <div className="pt-4 border-t border-white/5 space-y-3">
                                <label className="text-xs font-medium text-white/40">Accepted Cards</label>
                                <div className="flex gap-4">
                                    <div className="w-12 h-8 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/60">VISA</div>
                                    <div className="w-12 h-8 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/60">MC</div>
                                    <div className="w-12 h-8 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/60">AMEX</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Shipping & Delivery */}
                <motion.div variants={itemVariants}>
                    <Card className="p-6 bg-[#111114] border-white/5 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-[#00f2ff]/10 text-[#00f2ff]">
                                <Truck size={20} />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Shipping & Delivery</h3>
                        </div>
                        <div className="space-y-5 flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/40">Standard Rate ({settings.currency})</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-medium">{getCurrencySymbol(settings.currency)}</span>
                                        <input
                                            type="text"
                                            value={settings.shippingRate}
                                            onChange={(e) => handleChange('shippingRate', e.target.value)}
                                            className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f2ff]/50 focus:ring-1 focus:ring-[#00f2ff]/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-white/40">Free Threshold ({settings.currency})</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-medium">{getCurrencySymbol(settings.currency)}</span>
                                        <input
                                            type="text"
                                            value={settings.freeShippingThreshold}
                                            onChange={(e) => handleChange('freeShippingThreshold', e.target.value)}
                                            className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f2ff]/50 focus:ring-1 focus:ring-[#00f2ff]/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl mt-4">
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">International Shipping</h4>
                                    <p className="text-xs text-muted-foreground">Allow orders outside primary region</p>
                                </div>
                                <Toggle checked={settings.internationalShipping} onChange={(v) => handleChange('internationalShipping', v)} />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Notifications & Alerts */}
                <motion.div variants={itemVariants}>
                    <Card className="p-6 bg-[#111114] border-white/5 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-[#00f2ff]/10 text-[#00f2ff]">
                                <Bell size={20} />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Notifications & Alerts</h3>
                        </div>
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl hover:bg-white/[0.02] transition-colors">
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Order Confirmations</h4>
                                    <p className="text-xs text-muted-foreground">Send receipt to customer</p>
                                </div>
                                <Toggle checked={settings.orderEmails} onChange={(v) => handleChange('orderEmails', v)} />
                            </div>
                            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl hover:bg-white/[0.02] transition-colors">
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Low Inventory Alerts</h4>
                                    <p className="text-xs text-muted-foreground">Notify admin when stock {'<'} 10</p>
                                </div>
                                <Toggle checked={settings.lowInventoryAlerts} onChange={(v) => handleChange('lowInventoryAlerts', v)} />
                            </div>
                            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl hover:bg-white/[0.02] transition-colors">
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Admin Daily Summary</h4>
                                    <p className="text-xs text-muted-foreground">Sales and operations recap</p>
                                </div>
                                <Toggle checked={settings.dailySummary} onChange={(v) => handleChange('dailySummary', v)} />
                            </div>
                        </div>
                    </Card>
                </motion.div>
                </motion.div>
            )}


            {/* Danger Zone */}
            <motion.div variants={itemVariants} className="pt-8">
                <Card className="p-8 bg-[#1a0e0e] border-rose-500/20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-rose-500 flex items-center gap-2">
                                <Trash2 size={16} /> Data Management
                            </h4>
                            <p className="text-xs text-white/50 max-w-md">
                                Permanently delete all store data, orders, customers, and analytics. This action is irreversible and requires re-authentication.
                            </p>
                        </div>
                        <Button 
                            onClick={handleResetInitiate}
                            className="bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all duration-300 px-8 text-xs font-medium py-3"
                        >
                            Factory Reset
                        </Button>
                    </div>
                </Card>
            </motion.div>

            {/* OTP Vault */}
            <AdminVault
                isOpen={isVaultOpen}
                onClose={() => setIsVaultOpen(false)}
                onSuccess={handleVaultSuccess}
                actionLabel={vaultContext === 'save' ? 'save system configuration' : 'perform full platform reset'}
            />
        </div>
    );
};

export default AdminSettings;
