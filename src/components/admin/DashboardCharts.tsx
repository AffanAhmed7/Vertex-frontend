import React from 'react';
import { motion } from 'framer-motion';

const REVENUE_DATA = [32, 45, 38, 52, 48, 65, 59, 74, 88, 82, 95, 110];
const LOAD_DATA = [45, 52, 48, 70, 85, 60, 40, 55, 75, 90, 65, 50];

export const ChartPlaceholder: React.FC<{ title: string; type: 'line' | 'bar' | 'donut' }> = ({ title, type }) => {
    const isRevenue = title.toLowerCase().includes('revenue');
    const data = isRevenue ? REVENUE_DATA : LOAD_DATA;

    return (
        <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 flex flex-col" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <h3 className="text-sm font-medium text-white/50 uppercase tracking-[0.2em] mb-6">{title}</h3>

            <div className="flex-1 flex items-end justify-between gap-2 min-h-[200px] relative">
                {/* Simulated Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between opacity-[0.03] pointer-events-none">
                    {[1, 2, 3, 4].map(i => <div key={i} className="border-t border-white" />)}
                </div>

                {type === 'bar' && data.map((val, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${val}%` }}
                        transition={{ delay: i * 0.05, duration: 0.8, ease: "easeOut" }}
                        className="flex-1 bg-[#00f2ff]/10 hover:bg-[#00f2ff]/30 border-t border-x border-[#00f2ff]/20 rounded-t-sm transition-colors relative group"
                    >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1a1a1e] border border-white/10 text-[#00f2ff] text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-2xl z-20 pointer-events-none">
                            {val}%
                        </div>
                    </motion.div>
                ))}

                {type === 'line' && (
                    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                        <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none" className="overflow-visible">
                            <defs>
                                <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#00f2ff" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <motion.path
                                d={`M ${data.map((val, i) => `${(i / (data.length - 1)) * 400},${100 - val}`).join(' L ')}`}
                                fill="none"
                                stroke="#00f2ff"
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />
                            <motion.path
                                d={`M ${data.map((val, i) => `${(i / (data.length - 1)) * 400},${100 - val}`).join(' L ')} V 100 H 0 Z`}
                                fill="url(#line-gradient)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 1 }}
                            />
                            {/* Data Points */}
                            {data.map((val, i) => (
                                <motion.circle
                                    key={i}
                                    cx={(i / (data.length - 1)) * 400}
                                    cy={100 - val}
                                    r="3"
                                    className="fill-[#111114] stroke-[#00f2ff] stroke-2 hover:r-4 transition-all cursor-pointer"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.5 + (i * 0.05) }}
                                />
                            ))}
                        </svg>
                    </div>
                )}

                {type === 'donut' && (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="relative w-40 h-40">
                            <svg viewBox="0 0 100 100" className="rotate-[-90deg]">
                                <circle
                                    cx="50" cy="50" r="40"
                                    fill="transparent"
                                    stroke="rgba(255,255,255,0.05)"
                                    strokeWidth="8"
                                />
                                <motion.circle
                                    cx="50" cy="50" r="40"
                                    fill="transparent"
                                    stroke="#00f2ff"
                                    strokeWidth="8"
                                    strokeDasharray="251.2"
                                    initial={{ strokeDashoffset: 251.2 }}
                                    animate={{ strokeDashoffset: 251.2 * 0.35 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-light tracking-tight text-white">65<span className="text-sm opacity-50 ml-0.5">%</span></span>
                                <span className="text-[9px] text-[#00f2ff]/40 uppercase tracking-[0.3em] font-black mt-1">Uptime</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 flex justify-between text-[9px] text-white/20 font-black uppercase tracking-[0.3em] border-t border-white/5 pt-4">
                <span>{type === 'bar' ? 'Infrastructure Nodes' : 'Q1 2026'}</span>
                <span>{type === 'bar' ? 'Peak Load' : 'Q4 2026'}</span>
            </div>
        </div>
    );
};
