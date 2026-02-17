import React from 'react';
import { motion } from 'framer-motion';

interface ChartProps {
    title: string;
    data: any[];
    isLoading?: boolean;
}

export const RevenueChart: React.FC<ChartProps> = ({ title, isLoading }) => {
    if (isLoading) {
        return <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 h-[400px] animate-pulse" />;
    }

    return (
        <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">{title}</h3>
                <div className="flex items-center gap-4 text-[10px] uppercase font-black tracking-tighter">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Current</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-white/20" /> Previous</div>
                </div>
            </div>

            <div className="flex-1 relative flex items-end justify-between gap-1">
                {/* SVG Line Chart Logic */}
                <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none" className="overflow-visible">
                    {/* Grid lines */}
                    {[0, 50, 100, 150, 200].map(y => (
                        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    ))}

                    {/* Secondary Path (Previous) */}
                    <motion.path
                        d="M 0,160 C 50,140 100,170 150,130 S 250,150 300,100 T 400,120"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2 }}
                    />

                    {/* Primary Path (Current) */}
                    <motion.path
                        d="M 0,100 C 50,80 100,120 150,60 S 250,80 300,40 T 400,20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />

                    {/* Gradient Area */}
                    <motion.path
                        d="M 0,100 C 50,80 100,120 150,60 S 250,80 300,40 T 400,20 V 200 H 0 Z"
                        fill="url(#revGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                    />

                    <defs>
                        <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" className="text-primary" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-primary" />
                        </linearGradient>
                    </defs>

                    {/* Data Points */}
                    {[0, 50, 100, 150, 200, 250, 300, 350, 400].map((x, i) => (
                        <motion.circle
                            key={i}
                            cx={x}
                            cy={100 - (Math.sin(i) * 40 + 40)}
                            r="4"
                            className="text-primary fill-[#111114]"
                            stroke="currentColor"
                            strokeWidth="2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 2 + i * 0.05 }}
                        />
                    ))}
                </svg>

                {/* X-Axis */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-muted-foreground font-black uppercase tracking-widest pt-4 translate-y-full">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day}>{day}</span>)}
                </div>
            </div>
        </div>
    );
};

export const TrafficSourceChart: React.FC<ChartProps> = ({ title, data, isLoading }) => {
    if (isLoading) return <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 h-[400px] animate-pulse" />;

    const colors = ['#0D9488', '#3B82F6', '#8B5CF6', '#F59E0B'];

    return (
        <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 flex flex-col h-[400px]">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8">{title}</h3>

            <div className="flex-1 flex items-center justify-around gap-8">
                <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="rotate-[-90deg]">
                        {data.map((item, i) => {
                            const total = data.reduce((acc, curr) => acc + curr.value, 0);
                            const prevValues = data.slice(0, i).reduce((acc, curr) => acc + curr.value, 0);
                            const strokeDasharray = `${(item.value / total) * 251.2} 251.2`;
                            const strokeDashoffset = -(prevValues / total) * 251.2;

                            return (
                                <motion.circle
                                    key={item.name}
                                    cx="50" cy="50" r="40"
                                    fill="transparent"
                                    stroke={colors[i % colors.length]}
                                    strokeWidth="10"
                                    strokeDasharray={strokeDasharray}
                                    initial={{ strokeDashoffset: 0 }}
                                    animate={{ strokeDashoffset }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    className="hover:stroke-white transition-all cursor-pointer"
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-black italic">14.2k</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Visitors</span>
                    </div>
                </div>

                <div className="space-y-4 flex-1 max-w-[150px]">
                    {data.map((item, i) => (
                        <div key={item.name} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                                    {item.name}
                                </span>
                                <span className="text-xs font-bold text-white">{item.value}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.value}%` }}
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: colors[i % colors.length] }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const PerformanceChart: React.FC<ChartProps> = ({ title, data, isLoading }) => {
    if (isLoading) return <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 h-[400px] animate-pulse" />;

    return (
        <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 flex flex-col h-[400px]">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8">{title}</h3>

            <div className="flex-1 space-y-6">
                {data.map((item, i) => (
                    <div key={item.name} className="space-y-2">
                        <div className="flex justify-between items-end">
                            <div className="space-y-0.5">
                                <span className="text-xs font-bold text-white italic">{item.name}</span>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.sales} Unit Sales</div>
                            </div>
                            <span className={`text-[10px] font-black ${item.growth > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {item.growth > 0 ? '+' : ''}{item.growth}%
                            </span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative group">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.sales / 1500) * 100}%` }}
                                transition={{ delay: i * 0.1, duration: 1 }}
                                className="h-full bg-primary rounded-full relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
