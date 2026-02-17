import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface AnalyticsKPIProps {
    label: string;
    value: string | number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
    sparkline: number[];
    isLoading?: boolean;
}

const AnalyticsKPI: React.FC<AnalyticsKPIProps> = ({ label, value, change, trend, sparkline, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 space-y-4 animate-pulse">
                <div className="h-4 w-24 rounded bg-white/5" />
                <div className="h-8 w-32 rounded bg-white/5" />
                <div className="h-12 w-full rounded bg-white/5" />
            </div>
        );
    }

    const maxVal = Math.max(...sparkline);
    const minVal = Math.min(...sparkline);
    const range = maxVal - minVal;

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-[#111114] border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-all group overflow-hidden relative"
        >
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{label}</p>
                    <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-lg ${trend === 'up' ? 'text-emerald-500 bg-emerald-500/10' :
                        trend === 'down' ? 'text-rose-500 bg-rose-500/10' : 'text-gray-400 bg-gray-400/10'
                        }`}>
                        {trend === 'up' ? <ArrowUpRight size={14} /> :
                            trend === 'down' ? <ArrowDownRight size={14} /> : <Minus size={14} />}
                        {Math.abs(change)}%
                    </div>
                </div>

                <h3 className="text-3xl font-medium mt-2 text-white tracking-tight">{value}</h3>

                {/* Mini Sparkline Chart */}
                <div className="mt-6 h-12 w-full overflow-hidden">
                    <svg width="100%" height="100%" viewBox="0 0 100 24" preserveAspectRatio="none">
                        <motion.path
                            d={`M ${sparkline.map((val, i) => `${(i / (sparkline.length - 1)) * 100},${24 - ((val - minVal) / (range || 1)) * 20}`).join(' L ')}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className={trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-primary'}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                        <motion.path
                            d={`M ${sparkline.map((val, i) => `${(i / (sparkline.length - 1)) * 100},${24 - ((val - minVal) / (range || 1)) * 20}`).join(' L ')} L 100,24 L 0,24 Z`}
                            fill="currentColor"
                            className={trend === 'up' ? 'text-emerald-500/5' : trend === 'down' ? 'text-rose-500/5' : 'text-primary/5'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                        />
                    </svg>
                </div>
            </div>

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
        </motion.div>
    );
};

export default AnalyticsKPI;
