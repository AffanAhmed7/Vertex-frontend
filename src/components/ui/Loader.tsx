import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'rectangular' | 'circular' | 'text';
}

const Skeleton: React.FC<SkeletonProps> = ({ variant = 'rectangular', className, ...props }) => {
    return (
        <div
            className={cn(
                'relative overflow-hidden bg-muted/50',
                variant === 'circular' && 'rounded-full',
                variant === 'rectangular' && 'rounded-lg',
                variant === 'text' && 'h-4 w-full rounded',
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
};

const Spinner: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('animate-spin text-primary', className)}
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
};

export { Skeleton, Spinner };
