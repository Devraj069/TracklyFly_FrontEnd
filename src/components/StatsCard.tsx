import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface StatsCardProps {
    label: string;
    value: string | number;
    change?: string;
    isPositive?: boolean;
    icon: React.ElementType;
    className?: string;
    delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
    label,
    value,
    change,
    isPositive,
    icon: Icon,
    className,
    delay = 0
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className={cn(
                "premium-card p-6 relative group border border-slate-800",
                "bg-slate-900/40 backdrop-blur-xl",
                className
            )}
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className="w-16 h-16 text-primary-500" />
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500 ring-1 ring-primary-500/20 group-hover:ring-primary-500/40 transition-all">
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors uppercase tracking-widest">{label}</span>
                </div>

                <div className="flex items-baseline gap-4">
                    <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
                    {change && (
                        <span className={cn(
                            "text-xs font-bold px-2 py-0.5 rounded-full border",
                            isPositive
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                        )}>
                            {isPositive ? '↑' : '↓'} {change}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default StatsCard;
