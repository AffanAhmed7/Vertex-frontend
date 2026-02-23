import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../store';
import StatCard from '../../components/admin/StatCard';
import { ChartPlaceholder } from '../../components/admin/DashboardCharts';
import { Filter, Download, MoreHorizontal, ArrowRight } from 'lucide-react';

const AdminOverview: React.FC = () => {
    const navigate = useNavigate();
    const { stats, recentOrders, recentActivity, searchQuery } = useSelector((state: RootState) => state.admin);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [timeFrame, setTimeFrame] = useState<'All Time' | 'Month' | 'Week' | 'Day'>('Month');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const filteredOrders = React.useMemo(() => {
        let result = recentOrders as any[];

        // 1. Status Filter
        if (filterStatus) {
            result = result.filter(o => o.status === filterStatus);
        }

        // 2. Search Query Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(o =>
                o.id.toLowerCase().includes(query) ||
                o.customer.toLowerCase().includes(query) ||
                o.product.toLowerCase().includes(query)
            );
        }

        return result;
    }, [recentOrders, filterStatus, searchQuery]);

    const handleExport = () => {
        setIsExporting(true);

        const sections = [];

        // 1. KPI Sections
        sections.push(['--- DASHBOARD KPI SUMMARY ---']);
        sections.push(['Metric', 'Value', 'Trend Context']);
        semanticData.semanticStats.forEach(stat => {
            sections.push([stat.label, stat.value, stat.trendLabel]);
        });
        sections.push(['']);

        // 2. Orders Section
        sections.push(['--- FILTERED DEPLOYMENT MANIFEST ---']);
        sections.push(['Order ID', 'Customer', 'Product', 'Amount', 'Status']);
        filteredOrders.forEach(o => {
            sections.push([o.id, o.customer, o.product, o.amount, o.status]);
        });
        sections.push(['']);

        // 3. Activity Section
        sections.push(['--- RECENT OPERATIONAL ACTIVITY ---']);
        sections.push(['Timestamp', 'Type', 'Description']);
        alignedActivity.forEach(activity => {
            sections.push([activity.time, activity.type.toUpperCase(), activity.message]);
        });

        const csvContent = sections.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

        // Create Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `vertex_manifest_${filterStatus ? filterStatus.toLowerCase() + '_' : ''}${timeFrame.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);

        setTimeout(() => {
            link.click();
            document.body.removeChild(link);
            setIsExporting(false);
        }, 1200);
    };

    // Semantic Simulation Engine: Calculate real segment ratios from visible data
    const semanticData = React.useMemo(() => {
        const totalValue = recentOrders.reduce((acc, o) => acc + o.amount, 0);
        const filteredValue = filteredOrders.reduce((acc, o) => acc + o.amount, 0);
        const revenueRatio = totalValue > 0 ? filteredValue / totalValue : 0;

        const totalCount = recentOrders.length;
        const filteredCount = filteredOrders.length;
        const countRatio = totalCount > 0 ? filteredCount / totalCount : 0;

        // Precise Period Weights (Monthly baseline = 1.0)
        const periodScale = timeFrame === 'All Time' ? 12.0 : // Year scaling
            timeFrame === 'Week' ? 0.23 : // 7/30 days
                timeFrame === 'Day' ? 0.033 : 1.0; // 1/30 days

        const semanticStats = stats.map((stat: any) => {
            let displayValue = stat.value;
            const label = stat.label.toLowerCase();

            // 1. Classification: Volume (Cumulative) vs Efficiency (Ratio)
            const isRevenue = label.includes('revenue');
            const isOrders = label.includes('orders');
            const isReach = label.includes('reach') || label.includes('users');
            const isEfficiency = label.includes('rate') || label.includes('percent') || label.includes('conversion');

            // 2. Classification: Platform (Global) vs Operational (Segmented)
            // Platform Reach (Visitors) is usually a global property.
            const isPlatformMetric = isReach;

            // 3. Determine Ratios
            const segmentRatio = (!filterStatus || isPlatformMetric) ? 1 : (isRevenue ? revenueRatio : countRatio);

            // 4. Time Scaling: Volume metrics (Revenue, Orders, Reach) grow with time. 
            // Efficiency (Conversion) stays stable as a percentage of that volume.
            const shouldScaleByTime = isRevenue || isOrders || isReach;
            const finalTimeScale = shouldScaleByTime ? periodScale : 1.0;

            // 5. Contextual Trends: Scaling Trend Realism
            const trendVariance = timeFrame === 'All Time' ? 4.2 : // Lifetime growth
                timeFrame === 'Week' ? 0.35 : // Weekly fluctuation
                    timeFrame === 'Day' ? 0.08 : 1.0; // Daily pulse

            const simulatedTrend = (stat.trend * trendVariance).toFixed(1);
            const trendLabel = `% vs Last ${timeFrame === 'Day' ? 'Day' : timeFrame === 'Week' ? 'Week' : 'Month'}`;
            const finalTrendLabel = timeFrame === 'All Time' ? '% Growth' : trendLabel;

            if (typeof stat.value === 'string') {
                const isCurrency = stat.value.includes('$');
                const numeric = parseFloat(stat.value.replace(/[^0-9.]/g, ''));

                if (!isNaN(numeric)) {
                    if (isEfficiency) {
                        const effectiveRatio = !filterStatus ? 1 : (revenueRatio + countRatio) / 2;
                        const efficiencyVariance = 0.96 + (effectiveRatio * 0.04);
                        displayValue = `${(numeric * efficiencyVariance).toFixed(2)}%`;
                    } else {
                        const newValue = numeric * segmentRatio * finalTimeScale;
                        if (isCurrency) {
                            displayValue = `$${newValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        } else {
                            displayValue = Math.floor(newValue).toLocaleString();
                        }
                    }
                }
            } else if (typeof stat.value === 'number') {
                displayValue = Math.floor(stat.value * segmentRatio * finalTimeScale);
            }

            return { ...stat, value: displayValue, trend: parseFloat(simulatedTrend), trendLabel: finalTrendLabel };
        });

        return {
            semanticStats,
            revenueRatio: !filterStatus ? periodScale : revenueRatio * periodScale,
            countRatio: !filterStatus ? periodScale : countRatio * periodScale,
            distributionRatio: !filterStatus ? 1.0 : countRatio // Percentages/Ratios don't scale by time
        };
    }, [stats, recentOrders, filteredOrders, filterStatus, timeFrame]);

    // Align Activity Feed with visible Deployment IDs
    const alignedActivity = React.useMemo(() => {
        return recentActivity.map((activity: any, i: number) => {
            if (activity.type === 'order') {
                const correspondingOrder = recentOrders[i % recentOrders.length];
                return {
                    ...activity,
                    message: activity.message.replace(/VTX-\d+/, correspondingOrder.id)
                };
            }
            return activity;
        });
    }, [recentActivity, recentOrders]);

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

    const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);

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
                    <p className="text-xs text-[#00f2ff]/60 uppercase tracking-widest font-medium">Admin Interface <span className="text-white/10 mx-2">/</span> Operational Analytics</p>
                </div>
                <div className="flex items-center gap-3 relative">
                    {/* Timeframe Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setIsTimeMenuOpen(!isTimeMenuOpen)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-medium transition-all ${isTimeMenuOpen ? 'bg-white/10 border-[#00f2ff]/50 text-white shadow-[0_0_20px_rgba(0,242,255,0.1)]' : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'}`}
                        >
                            <span className="text-[#00f2ff]/60">Period:</span> {timeFrame}
                        </button>

                        <AnimatePresence>
                            {isTimeMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-40 bg-[#1a1a1e] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden"
                                >
                                    {(['All Time', 'Month', 'Week', 'Day'] as const).map(period => (
                                        <button
                                            key={period}
                                            onClick={() => {
                                                setTimeFrame(period);
                                                setIsTimeMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${timeFrame === period ? 'bg-[#00f2ff]/20 text-[#00f2ff]' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
                                        >
                                            {period}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all ${isFilterMenuOpen ? 'bg-white/10 border-[#00f2ff]/50 text-white shadow-[0_0_20px_rgba(0,242,255,0.1)]' : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'}`}
                        >
                            <Filter size={16} className={filterStatus ? 'text-[#00f2ff]' : ''} />
                            {filterStatus || 'Filter'}
                        </button>

                        <AnimatePresence>
                            {isFilterMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-48 bg-[#1a1a1e] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden"
                                >
                                    {['Paid', 'Shipped', 'Pending'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setFilterStatus(filterStatus === status ? null : status);
                                                setIsFilterMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${filterStatus === status ? 'bg-[#00f2ff]/20 text-[#00f2ff]' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                    {filterStatus && (
                                        <button
                                            onClick={() => { setFilterStatus(null); setIsFilterMenuOpen(false); }}
                                            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/5 transition-all mt-1 border-t border-white/5 pt-3"
                                        >
                                            Clear Filter
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 text-white/70 rounded-full text-xs font-medium transition-all shadow-xl disabled:opacity-50"
                    >
                        {isExporting ? <div className="w-4 h-4 border-2 border-[#00f2ff]/20 border-t-[#00f2ff] rounded-full animate-spin" /> : <Download size={16} />}
                        {isExporting ? 'Generating...' : 'Export Data'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {semanticData.semanticStats.map((stat: any) => (
                    <motion.div key={stat.label} variants={itemVariants} layout>
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
                    <ChartPlaceholder
                        title={`Revenue Stream (${timeFrame === 'Day' ? 'Today' : timeFrame === 'Week' ? '7D' : timeFrame === 'Month' ? '30D' : 'All Time'})`}
                        subtitle={`Total: ${semanticData.semanticStats.find((s: any) => s.label === 'Total Revenue')?.value} •  ${semanticData.semanticStats.find((s: any) => s.label === 'Total Revenue')?.trend > 0 ? '+' : ''}${semanticData.semanticStats.find((s: any) => s.label === 'Total Revenue')?.trend}% ${semanticData.semanticStats.find((s: any) => s.label === 'Total Revenue')?.trendLabel}`}
                        type="line"
                        filterStatus={filterStatus}
                        multiplier={semanticData.revenueRatio}
                        timeFrame={timeFrame}
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <ChartPlaceholder
                        title={`Category Success (${timeFrame === 'Day' ? 'Today' : timeFrame === 'Week' ? '7D' : timeFrame === 'Month' ? '30D' : 'All Time'})`}
                        subtitle={`System Conversion: ${semanticData.semanticStats.find((s: any) => s.label === 'Conversion')?.value} • Active Ops: ${semanticData.semanticStats.find((s: any) => s.label === 'Active Orders')?.value}`}
                        type="bar"
                        filterStatus={filterStatus}
                        multiplier={semanticData.distributionRatio}
                        timeFrame={timeFrame}
                    />
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#111114] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-white">Active Deployments</h3>
                        <button
                            onClick={() => navigate('/admin/orders')}
                            className="text-primary text-xs font-medium hover:text-white transition-all flex items-center gap-2"
                        >
                            View Logistics <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02] text-xs text-muted-foreground uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Node / Client</th>
                                    <th className="px-6 py-4 text-right">Value</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredOrders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-white">{order.customer}</div>
                                            <div className="text-xs font-medium text-muted-foreground truncate max-w-[150px]">{order.product}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-right text-white">${order.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-md ${order.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' :
                                                order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => navigate('/admin/orders')}
                                                className="p-1.5 text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                            >
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
                        <h3 className="text-lg font-medium text-white">Network Activity</h3>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div className="p-6 space-y-6 flex-1">
                        {alignedActivity.map((activity: any, i: number) => (
                            <div key={activity.id} className="flex gap-4 relative">
                                {i !== alignedActivity.length - 1 && (
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
                                    <span className="text-xs text-muted-foreground">{activity.time} ago</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate('/admin/analytics')}
                        className="w-full py-4 text-xs font-medium text-muted-foreground hover:text-white border-t border-white/5 transition-all text-center"
                    >
                        View Audit Log
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminOverview;
