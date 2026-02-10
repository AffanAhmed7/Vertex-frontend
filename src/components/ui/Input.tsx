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
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, onFocus, onBlur, ...props }, ref) => {
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
            <div className="relative w-full space-y-1">
                <div className="relative">
                    <motion.label
                        animate={{
                            y: isActive ? -22 : 0,
                            scale: isActive ? 0.85 : 1,
                            color: isFocused ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                        }}
                        initial={false}
                        className="absolute left-3 top-3.5 z-10 origin-left pointer-events-none text-muted-foreground transition-colors"
                    >
                        {label}
                    </motion.label>
                    <input
                        ref={ref}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className={cn(
                            'w-full bg-muted/30 border-b-2 border-transparent px-3 pb-2 pt-6 rounded-t-lg transition-all focus:outline-none focus:border-primary focus:bg-muted/50 text-foreground',
                            error && 'border-destructive focus:border-destructive',
                            className
                        )}
                        {...props}
                    />

                    {/* Animated focus line */}
                    <motion.div
                        initial={false}
                        animate={{ scaleX: isFocused ? 1 : 0 }}
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-center"
                    />
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-xs text-destructive px-1"
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
