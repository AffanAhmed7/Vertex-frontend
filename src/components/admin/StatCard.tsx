import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, LayoutDashboard, Package, Users, Target, DollarSign } from 'lucide-react';

const icons = {
    DollarSign: DollarSign,
    Package: Package,
    Users: Users,
    Target: Target,
};

interface StatCardProps {
    label: string;
    value: string | number;
    trend: number;
    trendDirection: 'up' | 'down';
    icon: keyof typeof icons;
    isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendDirection, icon, isLoading }) => {
    const Icon = icons[icon] || LayoutDashboard;

    if (isLoading) {
        return (
            <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 space-y-4 animate-pulse">
                <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-white/5" />
                    <div className="w-16 h-4 rounded bg-white/5" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-24 rounded bg-white/5" />
                    <div className="h-8 w-32 rounded bg-white/5" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-[#111114] border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-all group overflow-hidden relative"
        >
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

            <div className="flex justify-between items-start relative z-10">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Icon size={22} />
                </div>

                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trendDirection === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'
                    }`}>
                    {trendDirection === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trend}%
                </div>
            </div>

            <div className="mt-6 relative z-10">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{label}</p>
                <h3 className="text-3xl font-medium mt-1 text-white tracking-tight">{value}</h3>
            </div>
        </motion.div>
    );
};

export default StatCard;
