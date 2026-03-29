import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../store';
import { setProducts, setOrders, setStats, setRecentOrders, setRecentActivity } from '../../store/slices/adminSlice';
import { fetchAdminProducts, fetchAdminOrders, fetchSalesHistory, fetchCategories } from '../../services/adminService';
import StatCard from '../../components/admin/StatCard';
import { ChartPlaceholder } from '../../components/admin/DashboardCharts';
import { Filter, Download, MoreHorizontal, ArrowRight } from 'lucide-react';

const AdminOverview: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { recentOrders, recentActivity, searchQuery, orders: allOrders, products } = useSelector((state: RootState) => state.admin);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [timeFrame, setTimeFrame] = useState<'All Time' | 'Year' | 'Month' | 'Week' | 'Day'>('Month');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [salesHistory, setSalesHistory] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    const getTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h`;
        return `${Math.floor(hours / 24)}d`;
    };

    // Fetch real data on mount
    useEffect(() => {
        const load = async () => {
            try {
                const [prods, ords, cats] = await Promise.all([
                    fetchAdminProducts(),
                    fetchAdminOrders(),
                    fetchCategories()
                ]);
                dispatch(setProducts(prods));
                dispatch(setOrders(ords));
                setCategories(cats);

                // Initial stats computation (will be refined by semanticData memo)
                const totalRevenue = ords.reduce((acc: number, o: any) => acc + (o.subtotal || 0), 0);
                const activeOrders = ords.filter((o: any) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
                const uniqueCustomers = new Set(ords.map((o: any) => o.customerEmail || o.userId)).size;
                const conversionRate = ords.length > 0 ? ((ords.filter((o: any) => o.status === 'Delivered').length / ords.length) * 100).toFixed(1) : '0.0';

                dispatch(setStats([
                    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, trend: 0, icon: 'DollarSign', key: 'revenue' },
                    { label: 'Active Orders', value: activeOrders.toLocaleString(), trend: 0, icon: 'ShoppingBag', key: 'orders' },
                    { label: 'Platform Reach', value: uniqueCustomers.toLocaleString(), trend: 0, icon: 'Users', key: 'reach' },
                    { label: 'Conversion', value: `${conversionRate}%`, trend: 0, icon: 'Target', key: 'conversion' },
                ]));

                // Compute recent orders
                const recent = [...ords].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map((o: any) => ({
                    id: o.id.substring(0, 8),
                    customer: o.customerName || (o.user?.name || 'Customer'),
                    product: o.items?.[0]?.name || 'Multiple Items',
                    amount: Number(o.total),
                    status: o.status === 'PAID' ? 'Paid' : o.status === 'SHIPPED' ? 'Shipped' : o.status === 'CREATED' ? 'Pending' : o.status,
                }));
                dispatch(setRecentOrders(recent));

                // Compute recent activity
                const activity = ords.slice(0, 3).map((o: any, i: number) => ({
                    id: String(i + 1),
                    type: 'order' as const,
                    time: getTimeAgo(o.date),
                    message: `Order ${o.id.substring(0, 8)} — ${o.status} — $${o.total}`,
                }));
                dispatch(setRecentActivity(activity));

            } catch (err) {
                console.error('Failed to load overview data', err);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [dispatch]);

    // Re-fetch sales history whenever the timeframe changes
    useEffect(() => {
        const daysMap: Record<string, number> = {
            'Day': 1,
            'Week': 7,
            'Month': 30,
            'Year': 365,
            'All Time': 1095,
        };
        const days = daysMap[timeFrame] ?? 30;
        fetchSalesHistory(days)
            .then(setSalesHistory)
            .catch(err => console.error('Failed to fetch sales history', err));
    }, [timeFrame]);

    // Derived state: All orders matching search + status filters (not bound by timeframe for the manifest)
    const baseFilteredOrders = React.useMemo(() => {
        return allOrders.filter((o: any) => {
            // 1. Status Filter
            if (filterStatus) {
                const target = filterStatus === 'Paid' ? 'Processing' : filterStatus;
                if (o.status !== target) return false;
            }
            // 2. Search Filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const idMatch = o.id?.toLowerCase().includes(query);
                const custMatch = o.userId?.toLowerCase().includes(query);
                if (!idMatch && !custMatch) return false;
            }
            return true;
        }).map((o: any) => ({
            id: o.id,
            customer: o.userId?.substring(0, 8) || 'Anonymous',
            product: o.items?.[0]?.name || 'Unknown Item',
            amount: o.subtotal,
            status: o.status === 'Processing' ? 'Paid' : o.status,
            date: o.date
        }));
    }, [allOrders, filterStatus, searchQuery]);

    // UI Table orders (limited to top 10)
    const filteredOrders = React.useMemo(() => {
        return baseFilteredOrders.slice(0, 10);
    }, [baseFilteredOrders]);

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
        sections.push(['--- FILTERED DEPLOYMENT MANIFEST (FULL) ---']);
        sections.push(['Order ID', 'Customer (UID)', 'Primary Product', 'Value', 'Status', 'Timestamp']);
        
        // Use the FULL baseFilteredOrders list for export, not just the top 10 from the UI
        baseFilteredOrders.forEach(o => {
            sections.push([o.id, o.customer, o.product, `$${o.amount.toFixed(2)}`, o.status, o.date]);
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

    // REAL DATA ENGINE: Calculate real stats + growth vs previous equivalent period
    const semanticData = React.useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Define stable rolling window boundaries (aligned to midnight)
        const startOfWeek   = new Date(startOfToday.getTime() - 6 * 86400000); // 7 days total (today + 6 prev)
        const startOfMonth  = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear   = new Date(now.getFullYear(), 0, 1);

        // Current-period boundaries
        const currentStart = timeFrame === 'Day' ? startOfToday
            : timeFrame === 'Week'  ? startOfWeek
            : timeFrame === 'Month' ? startOfMonth
            : timeFrame === 'Year'  ? startOfYear
            : new Date(0);

        // Previous-period boundaries (same length, just before currentStart)
        const getPrevBounds = (): [Date, Date] => {
            if (timeFrame === 'Day') {
                const s = new Date(startOfToday.getTime() - 86400000);
                return [s, startOfToday];
            }
            if (timeFrame === 'Week') {
                const s = new Date(startOfWeek.getTime() - 7 * 86400000);
                return [s, startOfWeek];
            }
            if (timeFrame === 'Month') {
                const s = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const e = new Date(now.getFullYear(), now.getMonth(), 1);
                return [s, e];
            }
            if (timeFrame === 'Year') {
                const s = new Date(now.getFullYear() - 1, 0, 1);
                const e = new Date(now.getFullYear(), 0, 1);
                return [s, e];
            }
            return [new Date(0), new Date(0)];
        };

        const [prevStart, prevEnd] = getPrevBounds();

        const filterByTime = (dateStr: string | undefined) => {
            if (!dateStr) return false;
            const orderTime = new Date(dateStr).getTime();
            return orderTime >= currentStart.getTime();
        };

        const filterPrev = (dateStr: string | undefined) => {
            if (!dateStr || timeFrame === 'All Time') return false;
            const orderTime = new Date(dateStr).getTime();
            return orderTime >= prevStart.getTime() && orderTime < prevEnd.getTime();
        };

        // Current period data
        const filteredByTime = allOrders.filter((o: any) => {
            if (!filterByTime(o.date) || o.status === 'Cancelled' || o.status === 'REFUNDED') return false;
            
            // Apply Status Filter
            if (filterStatus) {
                const target = filterStatus === 'Paid' ? 'Processing' : filterStatus;
                if (o.status !== target) return false;
            }
            // Apply Search Filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const idMatch = o.id?.toLowerCase().includes(query);
                const custMatch = o.userId?.toLowerCase().includes(query); 
                if (!idMatch && !custMatch) return false;
            }
            return true;
        });
        
        // Stats
        const periodRevenue    = filteredByTime.reduce((acc: number, o: any) => acc + Number(o.subtotal || 0), 0);
        const totalOrdersInPeriod = filteredByTime.length;
        
        // "Active" Orders definition for the Current Snapshot
        const activeOrdersCount = filteredByTime.filter((o: any) => 
            o.status !== 'Delivered' && o.status !== 'DELIVERED'
        ).length;

        const periodReach      = new Set(filteredByTime.map((o: any) => o.userId)).size;
        const periodConversion = totalOrdersInPeriod > 0
            ? ((filteredByTime.filter((o: any) => o.status?.toLowerCase() === 'delivered').length / totalOrdersInPeriod) * 100)
            : 0;

        // Previous period data
        const prevOrders     = allOrders.filter((o: any) => {
            if (!filterPrev(o.date) || o.status === 'Cancelled' || o.status === 'REFUNDED') return false;
            
            // Apply Status Filter
            if (filterStatus) {
                const target = filterStatus === 'Paid' ? 'Processing' : filterStatus;
                if (o.status !== target) return false;
            }
            // Apply Search Filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const idMatch = o.id?.toLowerCase().includes(query);
                const custMatch = o.userId?.toLowerCase().includes(query);
                if (!idMatch && !custMatch) return false;
            }
            return true;
        });
        
        const prevRevenue    = prevOrders.reduce((acc: number, o: any) => acc + Number(o.subtotal || 0), 0);
        const prevOrderCount = prevOrders.length;
        const prevReach      = new Set(prevOrders.map((o: any) => o.userId)).size;
        const prevConversion = prevOrderCount > 0
            ? ((prevOrders.filter((o: any) => o.status?.toLowerCase() === 'delivered').length / prevOrderCount) * 100)
            : 0;

        // Growth % helper
        const growth = (curr: number, prev: number): number => {
            if (prev === 0) return curr > 0 ? 100 : 0;
            if (curr === 0) return -100;
            return Math.round(((curr - prev) / prev) * 100);
        };

        const periodLabel = timeFrame === 'All Time' ? 'All Time'
            : timeFrame === 'Day'   ? 'vs Yesterday'
            : timeFrame === 'Week'  ? 'vs Last Week'
            : timeFrame === 'Month' ? 'vs Last Month'
            : 'vs Last Year';

        const semanticStats = [
            { 
                label: 'Total Revenue', 
                value: `$${periodRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 
                trend: Math.abs(growth(periodRevenue, prevRevenue)), 
                trendDirection: growth(periodRevenue, prevRevenue) >= 0 ? 'up' : 'down',
                icon: 'DollarSign', 
                trendLabel: periodLabel 
            },
            { 
                label: 'Active Orders', 
                value: activeOrdersCount.toLocaleString(), 
                trend: Math.abs(growth(totalOrdersInPeriod, prevOrderCount)), 
                trendDirection: growth(totalOrdersInPeriod, prevOrderCount) >= 0 ? 'up' : 'down',
                icon: 'ShoppingBag', 
                trendLabel: periodLabel 
            },
            { 
                label: 'Platform Reach', 
                value: periodReach.toLocaleString(), 
                trend: Math.abs(growth(periodReach, prevReach)), 
                trendDirection: growth(periodReach, prevReach) >= 0 ? 'up' : 'down',
                icon: 'Users', 
                trendLabel: periodLabel 
            },
            { 
                label: 'Conversion', 
                value: `${periodConversion.toFixed(1)}%`, 
                trend: Math.abs(growth(periodConversion, prevConversion)), 
                trendDirection: growth(periodConversion, prevConversion) >= 0 ? 'up' : 'down',
                icon: 'Target', 
                trendLabel: periodLabel 
            },
        ];

        // ── Chart data ──────────────────────────────────────────────────
        let filteredHistory = salesHistory
            .filter(s => filterByTime(s.date))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let chartData: number[] = [];
        let chartLabels: string[] = [];

        if (filteredHistory.length > 0) {
            chartData   = filteredHistory.map(s => Number(s.totalRevenue));
            chartLabels = filteredHistory.map(s => {
                const d = new Date(s.date);
                if (timeFrame === 'Week') return d.toLocaleDateString(undefined, { weekday: 'short' });
                if (timeFrame === 'Day')  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                // Month / Year / All Time: include month name so tooltip is clear
                return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            });
        }

        // Fallback to live order aggregation when no daily snapshots yet
        if (chartData.length === 0) {
            const liveMap: Record<string, number> = {};
            filteredByTime.forEach((o: any) => {
                const date = new Date(o.date);
                let key = '';
                if (timeFrame === 'Day') {
                    key = date.toLocaleTimeString(undefined, { hour: '2-digit', hour12: false });
                } else if (timeFrame === 'Year' || timeFrame === 'All Time') {
                    key = date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
                } else if (timeFrame === 'Week') {
                    key = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                } else {
                    // Month — include full date so tooltip is unambiguous
                    key = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                }
                liveMap[key] = (liveMap[key] || 0) + Number(o.subtotal);
            });

            const sortedKeys = Object.keys(liveMap).sort((a, b) => {
                if (timeFrame === 'Day') return parseInt(a) - parseInt(b);
                if (timeFrame === 'Week') {
                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    // extract weekday abbreviation ("Mon", "Tue"…) from keys like "Mon, Mar 25"
                    const da = days.findIndex(d => a.startsWith(d));
                    const db = days.findIndex(d => b.startsWith(d));
                    return da - db;
                }
                return new Date(a).getTime() - new Date(b).getTime();
            });

            chartData   = sortedKeys.map(k => liveMap[k]);
            chartLabels = sortedKeys.map(k => (timeFrame === 'Day' ? `${k}:00` : k));
        }

        // ── Category distribution ────────────────────────────────────────
        const catMap: Record<string, number> = {};
        filteredByTime.forEach((o: any) => {
            o.items?.forEach((item: any) => {
                const product = products.find((p: any) => p.id === item.id || p.id === item.productId);
                const catName = product?.category || 'Other';
                catMap[catName] = (catMap[catName] || 0) + Number(item.price * item.quantity || 0);
            });
        });

        const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const catData    = sortedCats.map(c => c[1]);
        const catLabels  = sortedCats.map(c => c[0]);

        return {
            semanticStats,
            chartLabels: chartLabels.length > 0 ? chartLabels : undefined,
            chartData:   chartData.length   > 0 ? chartData   : undefined,
            catData:     catData.length     > 0 ? catData     : undefined,
            catLabels:   catLabels.length   > 0 ? catLabels   : undefined,
        };
    }, [allOrders, salesHistory, timeFrame, products, categories, filterStatus, searchQuery]);

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
                
                <div className="flex flex-wrap items-center gap-3">
                    {/* Timeframe Selector Pills */}
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1 backdrop-blur-sm">
                        {(['Day', 'Week', 'Month', 'Year', 'All Time'] as const).map((period) => (
                            <button
                                key={period}
                                onClick={() => setTimeFrame(period)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all ${
                                    timeFrame === period 
                                    ? 'bg-[#00f2ff] text-black shadow-[0_0_15px_rgba(0,242,255,0.3)]' 
                                    : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                                }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-medium transition-all ${isFilterMenuOpen ? 'bg-white/10 border-[#00f2ff]/50 text-white' : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'}`}
                        >
                            <Filter size={14} className={filterStatus ? 'text-[#00f2ff]' : ''} />
                            {filterStatus || 'Status'}
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
                        className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 text-white/70 rounded-xl text-xs font-medium transition-all hover:bg-white/[0.05] disabled:opacity-50"
                    >
                        {isExporting ? <div className="w-4 h-4 border-2 border-[#00f2ff]/20 border-t-[#00f2ff] rounded-full animate-spin" /> : <Download size={14} />}
                        {isExporting ? 'Exporting...' : 'Export'}
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

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                <motion.div variants={itemVariants}>
                    <ChartPlaceholder
                        title={`Revenue Stream (${timeFrame === 'Day' ? 'Today' : timeFrame === 'Week' ? '7D' : timeFrame === 'Month' ? '30D' : timeFrame === 'Year' ? '1Y' : 'All Time'})`}
                        subtitle={`Total: ${semanticData.semanticStats[0]?.value || '$0.00'} • ${timeFrame === 'Month' ? new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : timeFrame}`}
                        type="line"
                        data={semanticData.chartData}
                        labels={semanticData.chartLabels}
                        timeFrame={timeFrame}
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <ChartPlaceholder
                        title={`Category Success (${timeFrame === 'Day' ? 'Today' : timeFrame === 'Week' ? '7D' : timeFrame === 'Month' ? '30D' : timeFrame === 'Year' ? '1Y' : 'All Time'})`}
                        subtitle={`System Conversion: ${semanticData.semanticStats[3]?.value || '0.0%'} • Active Ops: ${semanticData.semanticStats[1]?.value || '0'}`}
                        type="bar"
                        data={semanticData.catData}
                        labels={semanticData.catLabels}
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
