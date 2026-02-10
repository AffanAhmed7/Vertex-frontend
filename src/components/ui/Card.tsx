import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    enableTilt?: boolean;
    glass?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    className,
    enableTilt = false,
    glass = true,
    ...props
}) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!enableTilt) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: enableTilt ? rotateX : 0,
                rotateY: enableTilt ? rotateY : 0,
                transformStyle: 'preserve-3d',
            }}
            className={cn(
                'relative rounded-2xl overflow-hidden shadow-premium transition-shadow',
                glass ? 'glass-panel' : 'bg-card',
                className
            )}
            {...(props as any)}
        >
            <div
                style={{
                    transform: enableTilt ? 'translateZ(20px)' : 'none',
                    transformStyle: 'preserve-3d',
                }}
                className="relative z-10"
            >
                {children}
            </div>

            {/* Gloss effect overlay */}
            {glass && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            )}
        </motion.div>
    );
};

export { Card };
