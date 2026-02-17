import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, Shield, ShieldAlert, Trash2 } from 'lucide-react';
import { RootState } from '../../store';
import { deleteUser, updateUserRole, updateUserStatus, AdminUser } from '../../store/slices/adminSlice';
import AdminTable from '../../components/admin/AdminTable';

const AdminUsers: React.FC = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state: RootState) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'suspend'; user: AdminUser } | null>(null);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            key: 'name',
            label: 'System Entity',
            render: (name: string, u: AdminUser) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white group-hover:bg-primary/20 transition-all">
                        {name[0]}
                    </div>
                    <div>
                        <p className="font-bold text-white group-hover:text-primary transition-colors">{name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{u.email}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'role',
            label: 'Access Clearance',
            render: (role: string, u: AdminUser) => (
                <div className="flex items-center gap-2">
                    <Shield size={14} className={role === 'Admin' ? 'text-primary' : 'text-muted-foreground opacity-50'} />
                    <select
                        value={role}
                        onChange={(e) => dispatch(updateUserRole({ id: u.id, role: e.target.value as AdminUser['role'] }))}
                        className="bg-transparent text-xs font-bold text-white uppercase focus:outline-none cursor-pointer"
                    >
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                        <option value="Customer">Customer</option>
                    </select>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Auth State',
            render: (status: string) => (
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${status === 'Active' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'
                    }`}>
                    {status}
                </span>
            )
        },
        {
            key: 'lastLogin',
            label: 'Last Access',
            render: (time: string) => <span className="text-xs text-muted-foreground font-bold">{time}</span>
        },
        {
            key: 'actions',
            label: 'Operations',
            render: (_: any, u: AdminUser) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setConfirmAction({ type: 'suspend', user: u })}
                        className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-amber-500 transition-all shadow-lg active:scale-95"
                    >
                        <ShieldAlert size={14} />
                    </button>
                    <button
                        onClick={() => setConfirmAction({ type: 'delete', user: u })}
                        className="p-2 hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-500 transition-all shadow-lg active:scale-95"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )
        }
    ];

    const mobileRender = (u: AdminUser) => (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-white">
                    {u.name[0]}
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white">{u.name}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{u.role}</p>
                </div>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${u.status === 'Active' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'
                }`}>
                {u.status}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">Entity Control</h1>
                    <p className="text-[9px] text-[#00f2ff]/40 uppercase tracking-[0.4em] font-black">Admin Access <span className="text-white/10 mx-2">/</span> User Management</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-white/5 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:border-primary/50 outline-none transition-all w-full md:w-64"
                            placeholder="Identify entity (Name/Email)..."
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white/[0.03] border border-white/5 text-white/70 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all shadow-xl active:scale-95">
                        <UserPlus size={16} /> New Entity
                    </button>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={filteredUsers}
                isLoading={loading}
                mobileCardRender={mobileRender}
            />

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmAction && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmAction(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[400]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 m-auto w-full max-w-sm h-fit bg-[#0a0a0b] border border-white/5 rounded-3xl p-8 shadow-2xl z-[401] space-y-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto">
                                <ShieldAlert size={32} />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-black italic tracking-tighter uppercase">High Priority Action</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Are you certain you want to {confirmAction.type} clearance for <span className="text-white font-bold">{confirmAction.user.name}</span>?
                                    This action will be logged in infrastructure protocols.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setConfirmAction(null)}
                                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirmAction.type === 'delete') {
                                            dispatch(deleteUser(confirmAction.user.id));
                                        } else {
                                            dispatch(updateUserStatus({ id: confirmAction.user.id, status: 'Suspended' }));
                                        }
                                        setConfirmAction(null);
                                    }}
                                    className="flex-1 px-4 py-3 bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-rose-500/20"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;
