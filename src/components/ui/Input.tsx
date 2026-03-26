import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className, onFocus, onBlur, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);
        const [hasValue, setHasValue] = useState(false);

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            setHasValue(!!e.target.value);
            onBlur?.(e);
        };

        const isActive = isFocused || hasValue || !!props.value;

        return (
            <div className="relative w-full group">
                <div className="relative">
                    {/* Icon container */}
                    {icon && (
                        <div className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10",
                            isFocused ? "text-[#00f2ff]" : "text-white/30",
                            isActive && "top-[calc(50%+6px)]" // Shift icon slightly down when label floats up
                        )}>
                            {icon}
                        </div>
                    )}

                    {/* Floating label */}
                    <label
                        className={cn(
                            "absolute pointer-events-none transition-all duration-300 ease-out font-medium uppercase z-20",
                            icon ? "left-12" : "left-4",
                            isActive
                                ? "top-2 text-[9px] tracking-[0.25em] pb-1"
                                : "top-1/2 -translate-y-1/2 text-sm tracking-[0.05em] opacity-40",
                            isFocused ? "text-[#00f2ff]" : "text-white/50"
                        )}
                    >
                        {label}
                    </label>

                    <input
                        ref={ref}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className={cn(
                            'w-full bg-white/[0.03] border border-white/10 rounded-lg pb-3 transition-all duration-300 focus:outline-none text-white text-sm placeholder:opacity-0',
                            icon ? 'pl-12' : 'px-4',
                            'pt-7',
                            isFocused && 'border-[#00f2ff]/30 bg-white/[0.05]',
                            !isFocused && isActive && 'border-white/15',
                            error && 'border-red-500/50 focus:border-red-500',
                            className
                        )}
                        {...props}
                    />

                    {/* Focus glow line */}
                    <motion.div
                        initial={false}
                        animate={{ scaleX: isFocused ? 1 : 0, opacity: isFocused ? 1 : 0 }}
                        className="absolute bottom-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-[#00f2ff]/60 to-transparent origin-center"
                    />
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="text-xs text-red-400 mt-1.5 px-1"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
