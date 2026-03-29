import React from 'react';
import { motion } from 'framer-motion';

interface DateRangeSelectorProps {
    activeRange: '24h' | '7d' | '30d' | '1y' | 'all';
    onRangeChange: (range: '24h' | '7d' | '30d' | '1y' | 'all') => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ activeRange, onRangeChange }) => {
    const ranges: { id: typeof activeRange; label: string }[] = [
        { id: '24h', label: 'Day' },
        { id: '7d', label: 'Week' },
        { id: '30d', label: 'Month' },
        { id: '1y', label: 'Year' },
        { id: 'all', label: 'All Time' },
    ];

    return (
        <div className="flex items-center bg-[#111114] border border-white/10 rounded-xl p-1 relative h-[36px]">
            {ranges.map((range) => (
                <button
                    key={range.id}
                    onClick={() => onRangeChange(range.id)}
                    className={`relative z-10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors rounded-lg h-full flex items-center ${activeRange === range.id ? 'text-white' : 'text-white/40 hover:text-white'
                        }`}
                >
                    {range.label}
                    {activeRange === range.id && (
                        <motion.div
                            layoutId="activeRange"
                            className="absolute inset-0 bg-white/10 rounded-lg -z-10 shadow-[0_0_15px_rgba(255,255,255,0.02)] border border-white/5"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
};

export default DateRangeSelector;
