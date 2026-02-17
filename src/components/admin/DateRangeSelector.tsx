import React from 'react';
import { motion } from 'framer-motion';

interface DateRangeSelectorProps {
    activeRange: '7d' | '30d' | '90d' | 'custom';
    onRangeChange: (range: '7d' | '30d' | '90d' | 'custom') => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ activeRange, onRangeChange }) => {
    const ranges: { id: typeof activeRange; label: string }[] = [
        { id: '7d', label: '7 Days' },
        { id: '30d', label: '30 Days' },
        { id: '90d', label: '90 Days' },
        { id: 'custom', label: 'Custom' },
    ];

    return (
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 relative">
            {ranges.map((range) => (
                <button
                    key={range.id}
                    onClick={() => onRangeChange(range.id)}
                    className={`relative z-10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${activeRange === range.id ? 'text-white' : 'text-muted-foreground hover:text-white'
                        }`}
                >
                    {range.label}
                    {activeRange === range.id && (
                        <motion.div
                            layoutId="activeRange"
                            className="absolute inset-0 bg-white/10 rounded-lg -z-10 shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
};

export default DateRangeSelector;
