import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../../store';
import StatCard from '../../components/admin/StatCard';
import { ChartPlaceholder } from '../../components/admin/DashboardCharts';
import { Filter, Download, MoreHorizontal, ArrowRight } from 'lucide-react';

const AdminOverview: React.FC = () => {
    const { stats, recentOrders, recentActivity } = useSelector((state: RootState) => state.admin);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">Command Center</h1>
                    <p className="text-[9px] text-[#00f2ff]/40 uppercase tracking-[0.4em] font-black">Admin Interface <span className="text-white/10 mx-2">/</span> Operational Analytics</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-all">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 text-white/70 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all shadow-xl">
                        <Download size={16} /> Export Data
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <motion.div key={stat.label} variants={itemVariants}>
                        <StatCard
                            {...stat}
                            icon={stat.icon as any}
                            isLoading={isLoading}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <ChartPlaceholder title="Revenue Stream (12M)" type="line" />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <ChartPlaceholder title="System Load Distribution" type="bar" />
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#111114] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Active Deployments</h3>
                        <button className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                            View Logistics <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02] text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Node / Client</th>
                                    <th className="px-6 py-4 text-right">Value</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-white">{order.customer}</div>
                                            <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">{order.product}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-right text-white">${order.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${order.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' :
                                                order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="p-1.5 text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Activity Feed */}
                <motion.div variants={itemVariants} className="bg-[#111114] border border-white/5 rounded-2xl flex flex-col">
                    <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Network Activity</h3>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div className="p-6 space-y-6 flex-1">
                        {recentActivity.map((activity, i) => (
                            <div key={activity.id} className="flex gap-4 relative">
                                {i !== recentActivity.length - 1 && (
                                    <div className="absolute left-[11px] top-6 bottom-[-24px] w-[1px] bg-white/5" />
                                )}
                                <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] z-10 ${activity.type === 'order' ? 'bg-primary/20 text-primary border border-primary/20' :
                                    activity.type === 'user' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/20' :
                                        'bg-amber-500/20 text-amber-500 border border-amber-500/20'
                                    }`}>
                                    {activity.type[0].toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-white leading-relaxed">{activity.message}</p>
                                    <span className="text-[10px] text-muted-foreground uppercase font-medium">{activity.time} ago</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-4 text-xs font-bold text-muted-foreground hover:text-white border-t border-white/5 transition-all text-center">
                        View Audit Log
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminOverview;
