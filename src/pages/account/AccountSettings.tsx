import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Save, CheckCircle2, AlertCircle, Mail, Lock, ShieldQuestion, ChevronDown } from 'lucide-react';
import { RootState, AppDispatch } from '../../store';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { updateProfile, clearError, changePassword } from '../../store/slices/userSlice';

const SECURITY_QUESTIONS = [
    'What is your mother\'s maiden name?',
    'What city were you born in?',
    'What was the name of your first pet?',
    'What was the name of your first school?',
    'What is your favorite book?',
];

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

    // Security Question Form
    const [securityQuestion, setSecurityQuestion] = useState(currentUser?.securityQuestion || '');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [isSavingSecurity, setIsSavingSecurity] = useState(false);
    const [securitySaved, setSecuritySaved] = useState(false);
    const [securityError, setSecurityError] = useState<string | null>(null);

    useEffect(() => {
        if (currentUser) {
            setProfileData({
                name: currentUser.name || '',
                email: currentUser.email,
                twoFactorEnabled: !!currentUser.twoFactorEnabled
            });
            if (currentUser.securityQuestion) {
                setSecurityQuestion(currentUser.securityQuestion);
            }
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

    const handleSecurityQuestionSave = async () => {
        if (!securityQuestion) {
            setSecurityError('Please select a security question');
            return;
        }
        if (!securityAnswer.trim()) {
            setSecurityError('Please provide an answer');
            return;
        }

        setIsSavingSecurity(true);
        setSecurityError(null);

        try {
            const resultAction = await dispatch(updateProfile({
                securityQuestion,
                securityAnswer: securityAnswer.trim()
            }));

            if (updateProfile.fulfilled.match(resultAction)) {
                setSecuritySaved(true);
                setSecurityAnswer('');
                setTimeout(() => setSecuritySaved(false), 3000);
            } else {
                setSecurityError('Failed to save security question');
            }
        } catch (err) {
            setSecurityError('Failed to save security question');
        } finally {
            setIsSavingSecurity(false);
        }
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
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Active Member</p>
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
                                    variant="primary" 
                                    className="w-full rounded-full text-xs uppercase tracking-widest h-12 font-black"
                                    onClick={handlePasswordSave}
                                    isLoading={isChangingPassword}
                                >
                                    {passwordSuccess ? (
                                        <span className="flex items-center gap-2 animate-in zoom-in-50">
                                            <CheckCircle2 size={16} />
                                            Password Updated
                                        </span>
                                    ) : 'Update Password'}
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

                    {/* Security Question — only visible when 2FA is enabled */}
                    <AnimatePresence>
                        {profileData.twoFactorEnabled && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-6 pt-2">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                        <ShieldQuestion size={14} className="text-primary" />
                                        Security Question
                                    </h3>
                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl space-y-6">
                                        {currentUser?.hasSecurityQuestion && (
                                            <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
                                                <CheckCircle2 size={14} />
                                                Security question is set
                                            </div>
                                        )}
                                        
                                        <div className="space-y-4">
                                            {/* Custom Select */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    Select a Question
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={securityQuestion}
                                                        onChange={(e) => setSecurityQuestion(e.target.value)}
                                                        className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-xl px-4 pr-10 text-sm text-white appearance-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
                                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                                    >
                                                        <option value="" className="bg-[#0a0a0f] text-white/50">Choose a security question...</option>
                                                        {SECURITY_QUESTIONS.map((q) => (
                                                            <option key={q} value={q} className="bg-[#0a0a0f] text-white">{q}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                                </div>
                                            </div>

                                            <Input 
                                                label="Your Answer"
                                                type="password"
                                                value={securityAnswer}
                                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                                placeholder={currentUser?.hasSecurityQuestion ? '••••••••  (leave blank to keep current)' : 'Enter your answer'}
                                                icon={<Lock size={18} />}
                                            />

                                            {securityError && (
                                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{securityError}</p>
                                            )}

                                            <Button
                                                variant="primary"
                                                className="w-full sm:w-auto rounded-full text-xs uppercase tracking-widest h-12 font-black px-10"
                                                onClick={handleSecurityQuestionSave}
                                                isLoading={isSavingSecurity}
                                            >
                                                {securitySaved ? (
                                                    <span className="flex items-center gap-2 animate-in zoom-in-50">
                                                        <CheckCircle2 size={16} />
                                                        Saved
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        <ShieldQuestion size={16} />
                                                        Save Security Question
                                                    </span>
                                                )}
                                            </Button>
                                        </div>

                                        <p className="text-[11px] text-muted-foreground leading-relaxed uppercase tracking-[0.05em] opacity-60">
                                            Your security question will be used to verify your identity when performing sensitive account actions. Choose a question with an answer only you would know.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
                        className="w-full sm:w-[240px] h-14 text-sm uppercase tracking-[0.3em] font-black shadow-xl shadow-primary/10 rounded-full"
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
