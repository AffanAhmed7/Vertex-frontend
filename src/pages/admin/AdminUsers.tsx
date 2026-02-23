import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Shield, ShieldAlert, Trash2, Filter } from 'lucide-react';
import { RootState } from '../../store';
import { deleteUser, updateUserRole, updateUserStatus, addUser, updateUser, AdminUser } from '../../store/slices/adminSlice';
import AdminTable from '../../components/admin/AdminTable';
import UserFormModal from '../../components/admin/UserFormModal';

const AdminUsers: React.FC = () => {
    const dispatch = useDispatch();
    const { users, loading, searchQuery } = useSelector((state: RootState) => state.admin);
    const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'suspend'; user: AdminUser } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [filterRole, setFilterRole] = useState<AdminUser['role'] | 'All'>('All');
    const [filterStatus, setFilterStatus] = useState<AdminUser['status'] | 'All'>('All');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'All' || u.role === filterRole;
        const matchesStatus = filterStatus === 'All' || u.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

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
                        <p className="font-semibold text-white group-hover:text-primary transition-colors">{name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'role',
            label: 'Access Clearance',
            render: (role: string, u: AdminUser) => (
                <div
                    className="flex items-center gap-2 group/select relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Shield size={14} className={role === 'Admin' ? 'text-primary' : 'text-muted-foreground opacity-50'} />
                    <select
                        value={role}
                        onChange={(e) => {
                            e.stopPropagation();
                            dispatch(updateUserRole({ id: u.id, role: e.target.value as AdminUser['role'] }));
                        }}
                        className="bg-transparent text-xs font-medium text-white/60 focus:outline-none cursor-pointer hover:text-white transition-colors outline-none"
                    >
                        <option value="Admin" className="bg-[#1a1a1e]">Admin</option>
                        <option value="Editor" className="bg-[#1a1a1e]">Editor</option>
                        <option value="Viewer" className="bg-[#1a1a1e]">Viewer</option>
                        <option value="Customer" className="bg-[#1a1a1e]">Customer</option>
                    </select>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Auth State',
            render: (status: AdminUser['status']) => {
                const colors = {
                    'Active': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
                    'Suspended': 'text-rose-500 bg-rose-500/10 border-rose-500/20',
                    'Pending': 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                };
                return (
                    <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${colors[status]}`}>
                        {status}
                    </span>
                );
            }
        },
        {
            key: 'lastLogin',
            label: 'Last Access',
            render: (time: string) => <span className="text-xs text-muted-foreground font-medium">{time}</span>
        },
        {
            key: 'actions',
            label: 'Operations',
            render: (_: any, u: AdminUser) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setConfirmAction({ type: 'suspend', user: u });
                        }}
                        className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-amber-500 transition-all shadow-lg active:scale-95"
                    >
                        <ShieldAlert size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setConfirmAction({ type: 'delete', user: u });
                        }}
                        className="p-2 hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-500 transition-all shadow-lg active:scale-95"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )
        }
    ];

    const mobileRender = (u: AdminUser) => {
        const colors = {
            'Active': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
            'Suspended': 'text-rose-500 bg-rose-500/10 border-rose-500/20',
            'Pending': 'text-amber-500 bg-amber-500/10 border-amber-500/20'
        };
        return (
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-white">
                        {u.name[0]}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">{u.name}</h4>
                        <p className="text-xs text-muted-foreground">{u.role}</p>
                    </div>
                </div>
                <div className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${colors[u.status]}`}>
                    {u.status}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">Entity Control</h1>
                    <p className="text-[9px] text-[#00f2ff]/40 uppercase tracking-[0.4em] font-black">Admin Access <span className="text-white/10 mx-2">/</span> User Management</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 relative">
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                            className={`p-2.5 bg-white/5 border border-white/10 rounded-xl text-muted-foreground hover:text-white transition-all shadow-lg active:scale-95 ${isFilterMenuOpen ? 'border-primary/50 text-primary' : ''}`}
                        >
                            <Filter size={20} />
                        </button>

                        <AnimatePresence>
                            {isFilterMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-56 bg-[#1a1a1e] border border-white/10 rounded-2xl p-4 shadow-2xl z-50 space-y-4"
                                >
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-muted-foreground">Clearance Level</p>
                                        <div className="grid grid-cols-2 gap-1">
                                            {['All', 'Admin', 'Editor', 'Viewer', 'Customer'].map(role => (
                                                <button
                                                    key={role}
                                                    onClick={() => setFilterRole(role as any)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterRole === role ? 'bg-primary/20 text-primary shadow-lg shadow-primary/10' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}`}
                                                >
                                                    {role}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2 border-t border-white/5 pt-3">
                                        <p className="text-xs font-medium text-muted-foreground">Entity Status</p>
                                        <div className="grid grid-cols-2 gap-1">
                                            {['All', 'Active', 'Suspended'].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => setFilterStatus(status as any)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === status ? 'bg-primary/20 text-primary shadow-lg shadow-primary/10' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={() => {
                            setSelectedUser(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white/[0.03] border border-white/5 text-white/70 rounded-full text-xs font-medium hover:bg-white/10 hover:text-white transition-all shadow-xl active:scale-95"
                    >
                        <UserPlus size={16} /> New Entity
                    </button>
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={filteredUsers}
                isLoading={loading}
                mobileCardRender={mobileRender}
                onRowClick={(u) => {
                    setSelectedUser(u);
                    setIsModalOpen(true);
                }}
            />

            <UserFormModal
                isOpen={isModalOpen}
                initialData={users.find(u => u.id === selectedUser?.id) || null}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(data: AdminUser) => {
                    if (data.id) {
                        dispatch(updateUser(data));
                    } else {
                        const { id, ...userData } = data;
                        dispatch(addUser({
                            ...userData,
                            id: `ENT-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
                            lastLogin: 'Never',
                        } as AdminUser));
                    }
                }}
            />

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmAction && (
                    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmAction(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm bg-[#0a0a0b] border border-white/5 rounded-3xl p-8 shadow-2xl space-y-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto">
                                <ShieldAlert size={32} />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold tracking-tight">High Priority Action</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Are you certain you want to {confirmAction.type} clearance for <span className="text-white font-bold">{confirmAction.user.name}</span>?
                                    This action will be logged in infrastructure protocols.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setConfirmAction(null)}
                                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-medium transition-all text-white/50 hover:text-white"
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
                                    className="flex-1 px-4 py-3 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-lg shadow-rose-500/20"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;
