import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';




export const ChartPlaceholder: React.FC<{
    title: string;
    subtitle?: string;
    type: 'line' | 'bar' | 'donut';
    data?: number[];
    labels?: string[];
    multiplier?: number;
    timeFrame?: 'All Time' | 'Year' | 'Month' | 'Week' | 'Day';
}> = ({ title, subtitle, type, data, labels, multiplier = 1, timeFrame = 'Month' }) => {
    const isRevenue = title.toLowerCase().includes('revenue');
    const isCategory = title.toLowerCase().includes('category');
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

    // Full X-axis labels based on timeframe or category
    const allLabels = React.useMemo(() => {
        if (labels) return labels;

        switch (timeFrame) {
            case 'Day': return ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];
            case 'Week': return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            case 'Year': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            case 'All Time': return ['Mar', 'May', 'Jul', 'Sep', 'Nov', 'Jan'];
            case 'Month':
            default: return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        }
    }, [timeFrame, isCategory, labels]);

    // MATHEMATICALLY SOUND NORMALIZATION ENGINE
    const { normalizedData, yAxisMax } = React.useMemo(() => {
        // Use real data if provided; fall back to placeholder only when no prop at all
        const hasRealData = data !== undefined && data.length > 0;
        const baseData = hasRealData ? data! : [];
        if (baseData.length === 0) return { normalizedData: [], yAxisMax: 10 };

        const rawScaled = baseData.map((val: number) => Math.max(0, val * (data ? 1 : multiplier)));
        const sum = rawScaled.reduce((acc, v) => acc + v, 0);

        if (isCategory) {
            // For category distribution, we calculate true percentages
            const catItems = rawScaled.map((v, i) => {
                const relativeShare = sum > 0 ? (v / sum) * 100 : 0;
                return {
                    original: baseData[i],
                    scaled: v,
                    relativeShare
                };
            });

            // Set Y-axis max based on the highest category percentage, rounded up to nearest 10
            const maxShare = Math.max(...catItems.map(d => d.relativeShare), 10);
            const yMax = Math.ceil(maxShare / 10) * 10;

            // Map the percentage height to the visual container (90% to leave room for tooltips)
            const finalData = catItems.map(d => ({
                ...d,
                percentage: yMax > 0 ? (d.relativeShare / yMax) * 90 : 0
            }));

            return { normalizedData: finalData, yAxisMax: yMax };

        } else {
            // For volume metrics like Revenue, maintain absolute values
            const maxVal = Math.max(...rawScaled, 10);
            // Dynamic rounding for clean Y-axis labels
            const getRoundingFactor = (val: number) => {
                if (val > 1000) return 500;
                if (val > 100) return 50;
                return 20;
            };
            const roundingFactor = getRoundingFactor(maxVal);
            const yMax = Math.ceil(maxVal / roundingFactor) * roundingFactor;

            const finalData = rawScaled.map((v, i) => ({
                original: baseData[i],
                scaled: v,
                relativeShare: sum > 0 ? (v / sum) * 100 : 0,
                percentage: yMax > 0 ? (v / yMax) * 90 : 0
            }));

            return { normalizedData: finalData, yAxisMax: yMax };
        }
    }, [isRevenue, isCategory, multiplier, data, labels]);

    const dataPoints = normalizedData.map(d => d.percentage);

    // Bezier Curve Logic for Line Chart
    const getBezierPath = (points: number[]) => {
        if (points.length < 2) return "";
        const step = 400 / (points.length - 1);
        return points.reduce((acc, val, i) => {
            const x = i * step;
            const y = 100 - val;
            if (i === 0) return `M 0,${y}`;

            const prevX = (i - 1) * step;
            const prevY = 100 - points[i - 1];
            const cp1x = prevX + (x - prevX) / 2;
            const cp2x = prevX + (x - prevX) / 2;

            return `${acc} C ${cp1x},${prevY} ${cp2x},${y} ${x},${y}`;
        }, "");
    };

    return (
        <div className="bg-[#0c0c0e]/50 backdrop-blur-3xl border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 flex flex-col relative group overflow-hidden shadow-2xl h-full">
            {/* Cinematic Gradient Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] -mr-32 -mt-32 pointer-events-none group-hover:bg-primary/10 transition-colors duration-1000" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[120px] -ml-32 -mb-32 pointer-events-none group-hover:bg-primary/10 transition-colors duration-1000" />

            <div className="mb-6 md:mb-8 flex flex-col items-center gap-1">
                <h3 className="text-lg md:text-xl font-medium text-white flex items-center gap-3 tracking-wide text-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_#00f2ff] animate-pulse hidden xs:block" />
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-[10px] md:text-sm font-medium text-muted-foreground mt-1 text-center opacity-60">{subtitle}</p>
                )}
            </div>

            <div className="flex-1 flex min-h-[180px] md:min-h-[220px] relative">
                {/* Y-Axis Labels */}
                <div className="w-10 md:w-12 flex flex-col justify-between pb-8 border-r border-white/5 pr-2 md:pr-3 mr-2">
                    {[100, 75, 50, 25, 0].map(percent => {
                        const displayVal = yAxisMax * (percent / 100);

                        return (
                            <span key={percent} className="text-[9px] md:text-[10px] font-medium text-white/40 text-right leading-none">
                                {isCategory ? `${Math.round(displayVal)}%` : displayVal >= 1000 ? `${(displayVal / 1000).toFixed(displayVal >= 10000 ? 0 : 1)}k` : Math.round(displayVal)}
                            </span>
                        );
                    })}
                </div>

                <div className="flex-1 relative flex flex-col justify-end pb-8">
                    {/* High-Visibility Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none pb-8">
                        {[0, 25, 50, 75, 100].map(i => <div key={i} className="border-t border-dashed border-white w-full" />)}
                    </div>

                    {/* Empty state when no data for selected period */}
                    {normalizedData.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pb-8">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-20">
                                <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" stroke="#00f2ff" strokeWidth="1.5" strokeLinejoin="round"/>
                            </svg>
                            <p className="text-[9px] text-white/20 font-medium uppercase tracking-widest">No metrics</p>
                        </div>
                    )}

                    {type === 'bar' && (
                        <div className="w-full h-full relative z-10 px-1 md:px-2 mt-auto">
                            <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none" className="overflow-visible">
                                <defs>
                                    <linearGradient id="bar-gradient-ultra" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#00f2ff" stopOpacity="1" />
                                        <stop offset="100%" stopColor="#00f2ff" stopOpacity="0.1" />
                                    </linearGradient>
                                </defs>
                                {normalizedData.map((item, i: number) => {
                                    const val = item.percentage;
                                    const barWidth = (400 / normalizedData.length) * 0.55;
                                    const x = (i / normalizedData.length) * 400 + (barWidth * 0.4);
                                    return (
                                        <g key={i} className="group/bar" onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                                            <rect
                                                x={x}
                                                width={barWidth}
                                                height="100"
                                                fill="rgba(255,255,255,0.02)"
                                                rx="4"
                                                className="transition-all duration-300 group-hover/bar:fill-white/8"
                                            />
                                            <motion.rect
                                                x={x}
                                                width={barWidth}
                                                initial={{ height: 0, y: 100 }}
                                                animate={{
                                                    height: val,
                                                    y: 100 - val,
                                                    fill: hoveredIndex === i ? '#00f2ff' : 'url(#bar-gradient-ultra)'
                                                }}
                                                transition={{ delay: i * 0.04, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                                                rx="4"
                                                className={`transition-all duration-300 ${hoveredIndex === i ? 'opacity-100' : 'opacity-80'}`}
                                            />

                                            {/* Glassmorphic Tooltip */}
                                            <AnimatePresence>
                                                {hoveredIndex === i && (
                                                    <motion.g
                                                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: 5 }}
                                                    >
                                                        <foreignObject x={x - 30} y={100 - val - 48} width={barWidth + 60} height="38" className="overflow-visible">
                                                            <div className="bg-[#111]/90 backdrop-blur-2xl border border-white/10 rounded-lg px-2 py-1 flex flex-col items-center justify-center h-full shadow-2xl">
                                                                {allLabels[i] && <span className="text-white/50 text-[8px] font-medium leading-none mb-0.5 truncate w-full text-center">{allLabels[i]}</span>}
                                                                <span className="text-white text-[10px] font-semibold">
                                                                    {isCategory ? `${Math.round(item.relativeShare)}%` : `$${Math.round(item.scaled).toLocaleString()}`}
                                                                </span>
                                                            </div>
                                                        </foreignObject>
                                                    </motion.g>
                                                )}
                                            </AnimatePresence>

                                            {isCategory && (
                                                <text
                                                    x={x + barWidth / 2}
                                                    y="120"
                                                    textAnchor="middle"
                                                    className={`text-[9px] font-medium transition-all duration-300 ${hoveredIndex === i ? 'fill-primary' : 'fill-white/40'}`}
                                                >
                                                    {allLabels[i] ?? ''}
                                                </text>
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    )}

                    {type === 'line' && (
                        <div className="w-full h-full relative z-10 px-1 md:px-2 mt-auto">
                            <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none" className="overflow-visible">
                                <defs>
                                    <linearGradient id="area-fade-minimal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
                                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                                    </linearGradient>
                                </defs>

                                {/* Subtle Area Fill */}
                                <motion.path
                                    d={`${getBezierPath(dataPoints)} L 400,100 L 0,100 Z`}
                                    fill="url(#area-fade-minimal)"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 1.2 }}
                                />

                                {/* Elegant Thin Line */}
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

                                {normalizedData.map((item, i: number) => {
                                    const val = item.percentage;
                                    const x = (i / (normalizedData.length - 1)) * 400;
                                    return (
                                        <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                                            <circle
                                                cx={x}
                                                cy={100 - val}
                                                r="14"
                                                fill="transparent"
                                                className="cursor-pointer"
                                            />
                                            <motion.circle
                                                cx={x}
                                                cy={100 - val}
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
                                                        <foreignObject x={x - 45} y={100 - val - 52} width="90" height="40" className="overflow-visible">
                                                            <div className="bg-[#111]/90 backdrop-blur-2xl border border-white/10 rounded-lg px-2 py-1 flex flex-col items-center justify-center h-full shadow-2xl">
                                                                {allLabels[i] && <span className="text-white/50 text-[8px] font-medium leading-none mb-0.5 text-center truncate w-full">{allLabels[i]}</span>}
                                                                <span className="text-white text-[10px] font-semibold">
                                                                    ${Math.round(item.scaled).toLocaleString()}
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
                    )}
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center text-[10px] md:text-sm font-medium text-muted-foreground border-t border-white/5 pt-5 min-h-[40px] overflow-hidden">
                {!isCategory ? (
                    <div className="flex w-full justify-between gap-2 overflow-x-auto no-scrollbar">
                        {allLabels.slice(0, 7).map((label: string, i: number) => (
                            <div key={i} className="flex items-center gap-1.5 text-white/30 whitespace-nowrap">
                                <span className="w-1 h-1 rounded-full bg-primary/20" />
                                {label}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-white/20 uppercase tracking-[0.2em] text-[8px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                        Infrastructure Intelligence
                    </div>
                )}
            </div>
        </div>
    );
};
