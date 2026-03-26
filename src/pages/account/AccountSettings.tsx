import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Shield, Save, CheckCircle2, AlertCircle, Mail, Lock } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { updateProfile, clearError, changePassword } from '../../store/slices/userSlice';

const AccountSettings: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser, error } = useSelector((state: RootState) => state.user);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    
    // Profile Form
    const [profileData, setProfileData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        twoFactorEnabled: currentUser?.twoFactorEnabled || false
    });

    // Password Form
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    useEffect(() => {
        if (currentUser) {
            setProfileData({
                name: currentUser.name || '',
                email: currentUser.email,
                twoFactorEnabled: !!currentUser.twoFactorEnabled
            });
        }
    }, [currentUser]);

    const handleProfileSave = async () => {
        setIsSaving(true);
        dispatch(clearError());
        
        try {
            const resultAction = await dispatch(updateProfile(profileData));
            if (updateProfile.fulfilled.match(resultAction)) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            console.error('Failed to update profile:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordSave = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            setPasswordError('All password fields are required');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        setIsChangingPassword(true);
        setPasswordError(null);
        
        try {
            const resultAction = await dispatch(changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }));

            if (changePassword.fulfilled.match(resultAction)) {
                setPasswordSuccess(true);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setPasswordSuccess(false), 3000);
            } else {
                setPasswordError(resultAction.payload as string);
            }
        } catch (err) {
            setPasswordError('Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const toggle2FA = async () => {
        const nextValue = !profileData.twoFactorEnabled;
        setProfileData(prev => ({ ...prev, twoFactorEnabled: nextValue }));
        
        // Auto-save 2FA preference
        await dispatch(updateProfile({ twoFactorEnabled: nextValue }));
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <header className="space-y-2">
                <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">
                    Account <span className="text-primary">Settings</span>
                </h1>
                <p className="text-muted-foreground text-sm">Manage your personal information, security, and preferences.</p>
            </header>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm animate-in fade-in slide-in-from-top-4">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-12">
                {/* Personal Information */}
                <section className="space-y-6">
                    <h2 className="text-xl font-light text-white uppercase tracking-widest border-b border-white/5 pb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <Input 
                                label="Full Name" 
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                icon={<User size={18} />}
                                placeholder="Enter your full name"
                            />
                             <Input 
                                label="Email Address" 
                                value={profileData.email}
                                readOnly
                                icon={<Mail size={18} />}
                                placeholder="Enter your email"
                                className="opacity-60 cursor-not-allowed"
                            />
                        </div>
                        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 relative group overflow-hidden">
                                <User size={32} className="text-primary group-hover:scale-110 transition-transform" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                    <span className="text-[8px] font-black uppercase tracking-tighter text-white">Change</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-white uppercase">{currentUser?.name || 'Anonymous User'}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Customer ID: {currentUser?.id.slice(0, 8)}...</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security Section */}
                <section className="space-y-8">
                    <h2 className="text-xl font-light text-white uppercase tracking-widest border-b border-white/5 pb-4">Security & Authentication</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Password Change */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <Lock size={14} className="text-secondary" />
                                Change Password
                            </h3>
                            <div className="space-y-4">
                                <Input 
                                    label="Current Password" 
                                    type="password" 
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    placeholder="••••••••"
                                />
                                <Input 
                                    label="New Password" 
                                    type="password" 
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    placeholder="••••••••"
                                />
                                <Input 
                                    label="Confirm New Password" 
                                    type="password" 
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                />
                                
                                {passwordError && (
                                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{passwordError}</p>
                                )}
                                
                                <Button 
                                    variant="outline" 
                                    className="w-full border-white/10 hover:border-secondary hover:bg-secondary/5 text-xs uppercase tracking-widest h-12"
                                    onClick={handlePasswordSave}
                                    isLoading={isChangingPassword}
                                >
                                    {passwordSuccess ? 'Password Updated' : 'Update Password'}
                                </Button>
                            </div>
                        </div>

                        {/* 2FA Toggle */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <Shield size={14} className="text-primary" />
                                Two-Factor (2FA)
                            </h3>
                            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-white uppercase">Authentication Status</p>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${profileData.twoFactorEnabled ? 'text-green-500' : 'text-orange-500'}`}>
                                            {profileData.twoFactorEnabled ? 'Shield Active' : 'Unprotected'}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={toggle2FA}
                                        className={`w-14 h-7 rounded-full transition-all duration-500 p-1 flex items-center ${profileData.twoFactorEnabled ? 'bg-primary justify-end' : 'bg-white/10 justify-start'}`}
                                    >
                                        <motion.div 
                                            layout
                                            className="w-5 h-5 bg-white rounded-full shadow-lg"
                                        />
                                    </button>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed uppercase tracking-[0.05em] opacity-60">
                                    Two-factor authentication adds an extra layer of security to your account. When enabled, you'll need to provide a verification code during sensitive actions.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final Save Action */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                        Ensure all information is correct before saving.
                    </p>
                    <Button
                        size="lg"
                        onClick={handleProfileSave}
                        isLoading={isSaving}
                        className="w-full sm:w-[240px] h-14 text-sm uppercase tracking-[0.3em] font-black shadow-xl shadow-primary/10"
                    >
                        {saved ? (
                            <span className="flex items-center gap-2 animate-in zoom-in-50">
                                <CheckCircle2 size={18} />
                                Updated
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Save size={18} />
                                Save Profile
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
