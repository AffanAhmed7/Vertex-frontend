import React from 'react';
import { motion } from 'framer-motion';

interface ChartProps {
    title: string;
    subtitle?: string;
    data: any[];
    isLoading?: boolean;
    totalValue?: number;
}

import { AnimatePresence } from 'framer-motion';

export const RevenueChart: React.FC<ChartProps> = ({ title, subtitle, data, isLoading }) => {
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

    const maxVal = React.useMemo(() => {
        if (!data || data.length === 0) return 10;
        const rawValues = data.map(d => d.value);
        const rawSecondaries = data.map(d => d.secondary || 0);
        return Math.max(...rawValues, ...rawSecondaries, 10);
    }, [data]);

    const normalizedData = React.useMemo(() => {
        if (!data || data.length === 0) return [];
        return data.map(d => ({
            ...d,
            percentage: (d.value / maxVal) * 85,
            secondaryPercentage: ((d.secondary || 0) / maxVal) * 85
        }));
    }, [data, maxVal]);

    if (isLoading || !data || data.length === 0) {
        return <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-8 min-h-[400px] animate-pulse" />;
    }

    const dataPoints = normalizedData.map(d => d.percentage);
    const secondaryPoints = normalizedData.map(d => d.secondaryPercentage);

    const getBezierPath = (points: number[]) => {
        if (points.length < 2) return "";
        const step = 400 / (points.length - 1);
        return points.reduce((acc, val, i) => {
            const x = i * step;
            const y = 100 - val;
            if (i === 0) return `M ${x},${y}`;

            const prevX = (i - 1) * step;
            const prevY = 100 - points[i - 1];
            const cp1x = prevX + (x - prevX) / 2;
            const cp2x = prevX + (x - prevX) / 2;

            return `${acc} C ${cp1x},${prevY} ${cp2x},${y} ${x},${y}`;
        }, "");
    };

    const yAxisTicks = [1, 0.75, 0.5, 0.25, 0];

    return (
        <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-8 flex flex-col relative group overflow-hidden shadow-2xl min-h-[400px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] -mr-32 -mt-32 pointer-events-none group-hover:bg-primary/10 transition-colors duration-1000" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[120px] -ml-32 -mb-32 pointer-events-none group-hover:bg-primary/10 transition-colors duration-1000" />

            {/* Header & Legend */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10 relative">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-medium text-white flex items-center gap-3 tracking-wide">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_#00f2ff] animate-pulse" />
                        {title}
                    </h3>
                    {subtitle ? (
                        <p className="text-sm font-medium text-muted-foreground mt-1">{subtitle}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground font-medium mt-1">Temporal Revenue Matrix</p>
                    )}
                </div>

                <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#00f2ff]" />
                        <span className="text-white">Current Period</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500/60" />
                        <span className="text-muted-foreground">Previous Period</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex min-h-[220px] relative mt-8">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between text-[10px] sm:text-xs font-medium text-muted-foreground w-12 pb-14 pt-0 z-10">
                    {yAxisTicks.map(tick => (
                        <span key={tick}>${Math.round((maxVal * tick) / 1000)}k</span>
                    ))}
                </div>

                <div className="flex-1 flex flex-col relative">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none pb-14 mt-1.5 z-0">
                        {yAxisTicks.map(i => <div key={i} className="border-t border-dashed border-white w-full" />)}
                    </div>

                    <div className="w-full h-[180px] relative z-10 px-2 mt-auto">
                        <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none" className="overflow-visible">
                            <defs>
                                <linearGradient id="area-fade-primary" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Secondary Line (Previous Period) */}
                            <motion.path
                                d={getBezierPath(secondaryPoints)}
                                fill="none"
                                stroke="#6366f1"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                strokeOpacity="0.5"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2.2, ease: [0.23, 1, 0.32, 1] }}
                            />

                            {/* Primary Area Fill */}
                            <motion.path
                                d={`${getBezierPath(dataPoints)} V 100 H 0 Z`}
                                fill="url(#area-fade-primary)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 1.2 }}
                            />

                            {/* Primary Line */}
                            <motion.path
                                d={getBezierPath(dataPoints)}
                                fill="none"
                                stroke="#0ea5e9"
                                strokeWidth="2"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2.2, ease: [0.23, 1, 0.32, 1] }}
                            />

                            {/* Interactive Data Points */}
                            {normalizedData.map((item, i: number) => {
                                const val1 = item.percentage;
                                const val2 = item.secondaryPercentage;
                                const x = (i / (normalizedData.length - 1)) * 400;
                                const highestY = Math.max(val1, val2);

                                return (
                                    <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                                        <circle
                                            cx={x}
                                            cy={100 - val1}
                                            r="24"
                                            fill="transparent"
                                            className="cursor-pointer"
                                        />

                                        <motion.circle
                                            cx={x}
                                            cy={100 - val2}
                                            r={hoveredIndex === i ? 4 : 0}
                                            fill={hoveredIndex === i ? '#6366f1' : 'transparent'}
                                            stroke="#6366f1"
                                            strokeWidth={hoveredIndex === i ? 2 : 0}
                                            animate={{ r: hoveredIndex === i ? 4 : 0 }}
                                            transition={{ duration: 0.15 }}
                                        />

                                        <motion.circle
                                            cx={x}
                                            cy={100 - val1}
                                            r={hoveredIndex === i ? 5 : 3}
                                            fill={hoveredIndex === i ? '#0ea5e9' : '#0c0c0e'}
                                            stroke="#0ea5e9"
                                            strokeWidth={hoveredIndex === i ? 3 : 2}
                                            animate={{ r: hoveredIndex === i ? 5 : 3 }}
                                            transition={{ duration: 0.15 }}
                                        />

                                        <AnimatePresence>
                                            {hoveredIndex === i && (
                                                <motion.g
                                                    initial={{ opacity: 0, scale: 0.9, y: 12 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9, y: 12 }}
                                                >
                                                    <foreignObject x={x - 60} y={100 - highestY - 70} width="120" height="60" className="overflow-visible pointer-events-none">
                                                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex flex-col justify-center h-full shadow-2xl px-3 gap-0.5 pointer-events-none">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-white text-xs font-semibold tracking-tight">
                                                                    ${item.value >= 1000 ? `${(item.value / 1000).toFixed(1)}k` : item.value}
                                                                </span>
                                                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-muted-foreground text-[10px] font-medium tracking-tight">
                                                                    ${item.secondary >= 1000 ? `${(item.secondary / 1000).toFixed(1)}k` : item.secondary}
                                                                </span>
                                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60" />
                                                            </div>
                                                            <span className="text-white/30 text-[9px] font-medium mt-0.5 border-t border-white/5 pt-0.5 uppercase tracking-wider">
                                                                {item.name}
                                                            </span>
                                                        </div>
                                                    </foreignObject>
                                                </motion.g>
                                            )}
                                        </AnimatePresence>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>

                    {/* X-Axis Labels */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center text-xs font-medium text-muted-foreground border-t border-white/5 pt-4 px-2 z-10 h-10 mt-2">
                        {data.map((d, index) => (
                            <span key={d.name} className={`transition-all duration-300 ${hoveredIndex === index ? 'text-primary drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]' : 'text-white/40'}`}>
                                {d.name.length > 5 ? d.name.substring(0, 3) : d.name}
                            </span>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export const TrafficSourceChart: React.FC<ChartProps> = ({ title, subtitle, data, isLoading, totalValue }) => {
    if (isLoading || !data) return <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 h-[400px] animate-pulse" />;

    const colors = ['#0ea5e9', '#8b5cf6', '#d946ef', '#f43f5e'];
    const displayTotal = totalValue || data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 flex flex-col h-[400px]">
            <div className="mb-8 flex flex-col gap-1">
                <h3 className="text-sm font-medium text-white">{title}</h3>
                {subtitle && <p className="text-xs font-medium text-muted-foreground">{subtitle}</p>}
            </div>

            <div className="flex-1 flex items-center justify-around gap-8">
                <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="rotate-[-90deg]">
                        {data.map((item, i) => {
                            const prevValues = data.slice(0, i).reduce((acc, curr) => acc + curr.value, 0);
                            const strokeDasharray = `${(item.value / 100) * 251.2} 251.2`;
                            const strokeDashoffset = -(prevValues / 100) * 251.2;

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
                                    style={{ filter: `drop-shadow(0 0 4px ${colors[i % colors.length]}40)` }}
                                    className="hover:stroke-white transition-all cursor-pointer"
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-semibold tracking-tighter text-white">
                            {displayTotal >= 1000 ? `${(displayTotal / 1000).toFixed(1)}k` : displayTotal}
                        </span>
                        <span className="text-sm text-muted-foreground font-medium mt-1">Visitors</span>
                    </div>
                </div>

                <div className="space-y-4 flex-1 max-w-[150px]">
                    {data.map((item, i) => (
                        <div key={item.name} className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                                    {item.name}
                                </span>
                                <span className="text-sm font-medium text-white">{item.value}%</span>
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

export const PerformanceChart: React.FC<ChartProps> = ({ title, subtitle, data, isLoading }) => {
    if (isLoading || !data) return <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 h-[400px] animate-pulse" />;

    const maxSales = Math.max(...data.map(d => d.sales), 10);

    return (
        <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 flex flex-col h-[400px]">
            <div className="mb-10 flex flex-col gap-1">
                <h3 className="text-sm font-medium text-white">{title}</h3>
                {subtitle && <p className="text-xs font-medium text-muted-foreground">{subtitle}</p>}
            </div>

            <div className="flex-1 space-y-7">
                {data.map((item, i) => (
                    <div key={item.name} className="space-y-2.5">
                        <div className="flex justify-between items-end">
                            <div className="space-y-0.5">
                                <span className="text-sm font-medium text-white tracking-wide">{item.name}</span>
                                <div className="text-xs text-muted-foreground font-medium">{item.sales.toLocaleString()} Unit Sales</div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className={`text-sm font-medium ${item.growth > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {item.growth > 0 ? '+' : ''}{item.growth}%
                                </span>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-white/[0.02] border border-white/5 rounded-full overflow-hidden relative group backdrop-blur-sm">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.sales / maxSales) * 100}%` }}
                                transition={{ delay: i * 0.1, duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                                className="h-full bg-gradient-to-r from-primary/40 to-primary rounded-full relative"
                            >
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ProductSalesTable: React.FC<{ data: any[], isLoading?: boolean }> = ({ data, isLoading }) => {
    if (isLoading || !data) {
        return <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-8 min-h-[400px] animate-pulse" />;
    }

    return (
        <div className="bg-[#111114] border border-white/5 rounded-[2.5rem] p-8 flex flex-col relative group shadow-2xl min-h-[400px]">
            {/* Cinematic Gradient Background */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-[120px] -ml-32 -mt-32 pointer-events-none transition-colors duration-1000" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/5 blur-[120px] -mr-32 -mb-32 pointer-events-none transition-colors duration-1000" />

            <div className="mb-8 flex flex-col gap-1 z-10 relative">
                <div className="flex justify-between items-center w-full">
                    <h3 className="text-xl font-medium text-white flex items-center gap-3 tracking-wide">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_#00f2ff] animate-pulse" />
                        Intelligence Matrix: Product Yield
                    </h3>
                </div>
                <p className="text-sm font-medium text-muted-foreground mt-1">Real-time compilation of top performing assets and revenue channels</p>
            </div>

            <div className="flex-1 w-full relative z-10 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-white/10 text-xs text-muted-foreground font-semibold tracking-wider uppercase">
                            <th className="pb-4 pt-2 px-4 font-medium">Asset Designation</th>
                            <th className="pb-4 pt-2 px-4 font-medium">Network Status</th>
                            <th className="pb-4 pt-2 px-4 font-medium text-right">Units Cleared</th>
                            <th className="pb-4 pt-2 px-4 font-medium text-right">Revenue Yield</th>
                            <th className="pb-4 pt-2 px-4 font-medium text-right">Velocity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.map((product, idx) => (
                            <motion.tr
                                key={product.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className="group/row hover:bg-white/[0.02] transition-colors"
                            >
                                <td className="py-4 px-4 w-1/3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg outline outline-1 outline-white/10 bg-white/5 flex items-center justify-center group-hover/row:outline-primary/50 transition-all shadow-inner">
                                            <span className="text-xs font-bold text-white/70 group-hover/row:text-primary transition-colors">{product.name.substring(0, 1)}</span>
                                        </div>
                                        <span className="text-sm font-medium text-white group-hover/row:text-primary transition-colors truncate">{product.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 w-1/6">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase border ${product.status?.toLowerCase().includes('stock') && !product.status?.toLowerCase().includes('low') || product.status?.toLowerCase() === 'active' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${product.status?.toLowerCase().includes('stock') && !product.status?.toLowerCase().includes('low') || product.status?.toLowerCase() === 'active' ? 'bg-teal-400 shadow-[0_0_8px_#2dd4bf]' : 'bg-rose-400 shadow-[0_0_8px_#fb7185]'}`} />
                                        {product.status || 'Active'}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-right w-1/6">
                                    <span className="text-sm font-medium text-white/90">{product.sales?.toLocaleString() || 0}</span>
                                </td>
                                <td className="py-4 px-4 text-right w-1/6">
                                    <span className="text-sm font-semibold text-white tracking-tight">${product.revenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
                                </td>
                                <td className="py-4 px-4 text-right w-1/6">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <span className={`text-sm font-medium ${product.growth > 0 ? 'text-teal-400' : 'text-rose-400'}`}>
                                            {product.growth > 0 ? '+' : ''}{product.growth || 0}%
                                        </span>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
