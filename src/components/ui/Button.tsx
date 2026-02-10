import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        const variants = {
            primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-emerald',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-glow-cyan',
            outline: 'border border-primary text-primary hover:bg-primary/10',
            ghost: 'text-foreground hover:bg-muted',
        };

        const sizes = {
            sm: 'h-9 px-3 text-xs',
            md: 'h-11 px-6 text-sm font-medium',
            lg: 'h-14 px-8 text-base font-semibold',
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02, translateY: -1 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    'relative inline-flex items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...(props as any)}
            >
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Loading...</span>
                    </div>
                ) : (
                    children
                )}

                {/* Subtle inner glow for primary buttons */}
                {variant === 'primary' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                )}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
