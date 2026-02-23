import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Download, RefreshCw, ShoppingCart, Package, Crown, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { RootState } from '../../store';
import { setAnalyticsLoading, setDateRange, refreshAnalytics } from '../../store/slices/adminSlice';
import AnalyticsInsights from '../../components/admin/AnalyticsInsights';
import DateRangeSelector from '../../components/admin/DateRangeSelector';

const AdminAnalytics: React.FC = () => {
    const dispatch = useDispatch();
    const { analytics } = useSelector((state: RootState) => state.admin);

    useEffect(() => {
        dispatch(setAnalyticsLoading(true));
        dispatch(refreshAnalytics());
        setTimeout(() => dispatch(setAnalyticsLoading(false)), 800);
    }, [dispatch]);

    const handleRangeChange = (range: any) => {
        dispatch(setAnalyticsLoading(true));
        dispatch(setDateRange(range));
        dispatch(refreshAnalytics());
        setTimeout(() => dispatch(setAnalyticsLoading(false)), 1200);
    };

    const handleExport = () => {
        if (!analytics.topProducts || analytics.topProducts.length === 0) return;
        const headers = ['Product', 'Units Sold', 'Revenue ($)', 'Growth (%)'];
        const rows = analytics.topProducts.map((p: any) => [
            `"${p.name}"`, p.sales, p.revenue, p.growth,
        ]);
        const csv = [headers.join(','), ...rows.map((r: any[]) => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `vertex-product-analytics-${analytics.dateRange}-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Derived data
    const topProducts = analytics.topProducts || [];
    const bestProduct = topProducts.length > 0 ? topProducts[0] : null;
    const totalRevenue = topProducts.reduce((acc: number, p: any) => acc + (p.revenue || 0), 0);
    const totalUnitsSold = topProducts.reduce((acc: number, p: any) => acc + (p.sales || 0), 0);

    // Find Average Order Value KPI from store
    const aovKpi = analytics.kpis.find((k: any) => k.id === '5');

    return (
        <div className="space-y-8 pb-12">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">Analytics</h1>
                    <p className="text-[9px] text-[#00f2ff]/40 uppercase tracking-[0.4em] font-black">
                        Product Performance <span className="mx-2 text-white/10">/</span> Revenue Intelligence
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <DateRangeSelector activeRange={analytics.dateRange} onRangeChange={handleRangeChange} />
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-5 h-[36px] bg-[#00f2ff]/10 border border-[#00f2ff]/20 text-[#00f2ff] rounded-xl text-sm font-medium hover:bg-[#00f2ff]/20 transition-all shadow-xl"
                    >
                        <Download size={14} />
                        Export
                    </button>
                </div>
            </div>

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Avg Order Value Card */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#111114] border border-white/5 rounded-2xl p-6 hover:border-emerald-500/20 transition-all group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] pointer-events-none" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <ShoppingCart size={18} className="text-emerald-400" />
                            </div>
                            {aovKpi && (
                                <div className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg ${aovKpi.trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                                    {aovKpi.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {Math.abs(aovKpi.change)}%
                                </div>
                            )}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Avg Order Value</p>
                        <p className="text-3xl font-semibold text-white tracking-tight">{aovKpi?.value || '$0'}</p>
                    </div>
                </motion.div>

                {/* Total Revenue Card */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-[#111114] border border-white/5 rounded-2xl p-6 hover:border-[#00f2ff]/20 transition-all group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f2ff]/5 blur-[60px] pointer-events-none" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/20 flex items-center justify-center">
                                <BarChart3 size={18} className="text-[#00f2ff]" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Total Product Revenue</p>
                        <p className="text-3xl font-semibold text-white tracking-tight">${totalRevenue.toLocaleString()}</p>
                    </div>
                </motion.div>

                {/* Total Units Sold Card */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#111114] border border-white/5 rounded-2xl p-6 hover:border-violet-500/20 transition-all group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-[60px] pointer-events-none" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                <Package size={18} className="text-violet-400" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Total Units Sold</p>
                        <p className="text-3xl font-semibold text-white tracking-tight">{totalUnitsSold.toLocaleString()}</p>
                    </div>
                </motion.div>
            </div>

            {/* ── Best Performing Product Highlight ── */}
            {bestProduct && !analytics.loading && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-gradient-to-r from-[#111114] via-[#111114] to-[#0e1a1f] border border-[#00f2ff]/10 rounded-2xl p-6 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-64 h-64 bg-[#00f2ff]/5 blur-[100px] -ml-32 -mt-32 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[80px] -mr-24 -mb-24 pointer-events-none" />
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00f2ff]/20 to-emerald-500/10 border border-[#00f2ff]/20 flex items-center justify-center shrink-0 shadow-lg shadow-[#00f2ff]/5">
                                <Crown size={24} className="text-[#00f2ff]" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00f2ff]/60">Top Performing Product</span>
                                </div>
                                <h3 className="text-xl font-semibold text-white tracking-tight">{bestProduct.name}</h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 sm:gap-8">
                            <div className="text-right">
                                <p className="text-xs font-medium text-muted-foreground mb-0.5">Revenue</p>
                                <p className="text-lg font-semibold text-white">${bestProduct.revenue?.toLocaleString()}</p>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="text-right">
                                <p className="text-xs font-medium text-muted-foreground mb-0.5">Units Sold</p>
                                <p className="text-lg font-semibold text-white">{bestProduct.sales?.toLocaleString()}</p>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="text-right">
                                <p className="text-xs font-medium text-muted-foreground mb-0.5">Growth</p>
                                <p className={`text-lg font-semibold ${bestProduct.growth > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {bestProduct.growth > 0 ? '+' : ''}{bestProduct.growth}%
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── Product-by-Product Breakdown Table ── */}
            {!analytics.loading && topProducts.length > 0 && (
                <div>
                    <p className="text-sm text-muted-foreground font-medium mb-4">Product Performance Breakdown</p>
                    <div className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-[#00f2ff]/3 blur-[120px] -ml-32 -mt-32 pointer-events-none" />
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-white/10 text-xs text-muted-foreground font-semibold tracking-wider uppercase">
                                        <th className="py-4 px-6 font-medium">#</th>
                                        <th className="py-4 px-6 font-medium">Product</th>
                                        <th className="py-4 px-6 font-medium">Status</th>
                                        <th className="py-4 px-6 font-medium text-right">Units Sold</th>
                                        <th className="py-4 px-6 font-medium text-right">Revenue</th>
                                        <th className="py-4 px-6 font-medium text-right">Growth</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {topProducts.map((product: any, idx: number) => (
                                        <motion.tr
                                            key={product.name}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.08, duration: 0.4 }}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="py-4 px-6">
                                                <span className={`text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center ${idx === 0 ? 'bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20' : 'bg-white/5 text-white/40 border border-white/5'}`}>
                                                    {idx + 1}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#00f2ff]/30 transition-all">
                                                        <span className="text-xs font-bold text-white/60 group-hover:text-[#00f2ff] transition-colors">{product.name.substring(0, 1)}</span>
                                                    </div>
                                                    <span className="text-sm font-medium text-white group-hover:text-[#00f2ff] transition-colors truncate">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase border ${product.status?.toLowerCase().includes('stock') && !product.status?.toLowerCase().includes('low') || product.status?.toLowerCase() === 'active' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${product.status?.toLowerCase().includes('stock') && !product.status?.toLowerCase().includes('low') || product.status?.toLowerCase() === 'active' ? 'bg-teal-400 shadow-[0_0_6px_#2dd4bf]' : 'bg-rose-400 shadow-[0_0_6px_#fb7185]'}`} />
                                                    {product.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <span className="text-sm font-medium text-white/90">{product.sales?.toLocaleString() || 0}</span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <span className="text-sm font-semibold text-white">${product.revenue?.toLocaleString() || 0}</span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <span className={`text-sm font-medium ${product.growth > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {product.growth > 0 ? '+' : ''}{product.growth}%
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Executive Insights + Customer Funnel Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Executive Insights */}
                <div>
                    <p className="text-sm text-muted-foreground font-medium mb-4">Executive Insights</p>
                    <AnalyticsInsights data={analytics.insights} />
                </div>

                {/* Customer Funnel */}
                {!analytics.loading && (
                    <div>
                        <p className="text-sm text-muted-foreground font-medium mb-4">Customer Funnel</p>
                        <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 h-full space-y-6">
                            {[
                                { label: 'Retention Rate', value: `${analytics.insights.retentionRate}%`, bar: analytics.insights.retentionRate, color: '#00f2ff', desc: 'Customers who return after first purchase' },
                                { label: 'Repeat Purchase', value: `${analytics.insights.repeatPurchase}%`, bar: analytics.insights.repeatPurchase, color: '#8b5cf6', desc: 'Repeat buyers as percentage of total' },
                                { label: 'Refund Rate', value: `${analytics.insights.refundRate}%`, bar: Math.min(analytics.insights.refundRate * 10, 100), color: '#f43f5e', desc: 'Orders refunded out of total orders' },
                            ].map((item, idx) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.1 }}
                                    className="space-y-3"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-white">{item.label}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                                        </div>
                                        <p className="text-xl font-semibold text-white tracking-tight">{item.value}</p>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.bar}%` }}
                                            transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1], delay: 0.4 + idx * 0.1 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: item.color, boxShadow: `0 0 12px ${item.color}30` }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Refresh Toast ── */}
            {analytics.loading && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="fixed bottom-8 right-8 bg-[#111114] border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 backdrop-blur-xl"
                >
                    <RefreshCw className="text-primary animate-spin" size={20} />
                    <span className="text-sm font-medium text-white">Refreshing Data...</span>
                </motion.div>
            )}

            {/* Loading skeleton for product table */}
            {analytics.loading && (
                <div className="space-y-4">
                    <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />
                    <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 space-y-4 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-white/5" />
                                <div className="h-4 flex-1 rounded bg-white/5" />
                                <div className="h-4 w-20 rounded bg-white/5" />
                                <div className="h-4 w-16 rounded bg-white/5" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAnalytics;
