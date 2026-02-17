import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Filter, RefreshCw } from 'lucide-react';
import { RootState } from '../../store';
import { setAnalyticsLoading, setDateRange } from '../../store/slices/adminSlice';
import AnalyticsKPI from '../../components/admin/AnalyticsKPI';
import { RevenueChart, TrafficSourceChart, PerformanceChart } from '../../components/admin/AnalyticsCharts';
import AnalyticsInsights from '../../components/admin/AnalyticsInsights';
import DateRangeSelector from '../../components/admin/DateRangeSelector';

const AdminAnalytics: React.FC = () => {
    const dispatch = useDispatch();
    const { analytics } = useSelector((state: RootState) => state.admin);

    const handleRangeChange = (range: any) => {
        dispatch(setAnalyticsLoading(true));
        dispatch(setDateRange(range));

        // Simulate API delay
        setTimeout(() => {
            dispatch(setAnalyticsLoading(false));
        }, 1200);
    };

    useEffect(() => {
        // Initial load simulation
        dispatch(setAnalyticsLoading(true));
        setTimeout(() => {
            dispatch(setAnalyticsLoading(false));
        }, 800);
    }, [dispatch]);

    return (
        <div className="space-y-8 pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-light tracking-[0.1em] text-white uppercase leading-none">Intelligence Hub</h1>
                    <p className="text-[9px] text-[#00f2ff]/40 uppercase tracking-[0.4em] font-black">
                        Executive Analytics <span className="mx-2 text-white/10">/</span> Operational Performance
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <DateRangeSelector
                        activeRange={analytics.dateRange}
                        onRangeChange={handleRangeChange}
                    />

                    <div className="flex items-center gap-2">
                        <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-muted-foreground hover:text-white transition-all">
                            <Filter size={20} />
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 bg-white/[0.03] border border-white/5 text-white/70 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all shadow-xl">
                            <Download size={18} /> Export
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {analytics.kpis.map((kpi) => (
                    <AnalyticsKPI
                        key={kpi.id}
                        {...kpi}
                        isLoading={analytics.loading}
                    />
                ))}
            </div>

            {/* Main Charts & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Revenue Over Time */}
                <div className="lg:col-span-8">
                    <RevenueChart
                        title="Revenue Performance Trend"
                        data={analytics.revenueData}
                        isLoading={analytics.loading}
                    />
                </div>

                {/* Insights Panel */}
                <div className="lg:col-span-4">
                    <AnalyticsInsights data={analytics.insights} />
                </div>
            </div>

            {/* Secondary Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrafficSourceChart
                    title="Traffic Distribution Matrix"
                    data={analytics.trafficSources}
                    isLoading={analytics.loading}
                />
                <PerformanceChart
                    title="Top Performing Infrastructure"
                    data={analytics.topProducts}
                    isLoading={analytics.loading}
                />
            </div>

            {/* Simulated Refresh Indicator */}
            <AnimatePresence>
                {analytics.loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed bottom-8 right-8 bg-[#111114] border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 backdrop-blur-xl"
                    >
                        <RefreshCw className="text-primary animate-spin" size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest text-white">Refreshing Data...</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminAnalytics;
