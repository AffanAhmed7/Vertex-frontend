import React from 'react';
import { RefreshCcw, TrendingUp, Users, AlertCircle, Sparkles } from 'lucide-react';

interface AnalyticsInsightsProps {
    data: {
        retentionRate: number;
        repeatPurchase: number;
        refundRate: number;
        inventoryHealth: number;
        insightText: string;
    };
}

const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({ data }) => {
    const panels = [
        { label: 'Retention', value: `${data.retentionRate}%`, icon: Users, color: 'text-primary' },
        { label: 'Repeat Purchase', value: `${data.repeatPurchase}%`, icon: RefreshCcw, color: 'text-blue-500' },
        { label: 'Refund Rate', value: `${data.refundRate}%`, icon: AlertCircle, color: 'text-rose-500' },
        { label: 'Stock Health', value: `${data.inventoryHealth}%`, icon: TrendingUp, color: 'text-emerald-500' },
    ];

    return (
        <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 space-y-8">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Sparkles size={18} />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Executive Insights</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {panels.map((panel) => (
                    <div key={panel.label} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <panel.icon size={16} className={panel.color} />
                            <span className="text-xs font-bold text-white italic">{panel.value}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black leading-tight">
                            {panel.label}
                        </p>
                    </div>
                ))}
            </div>

            <div className="pt-6 border-t border-white/5 space-y-3">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Priority Observation</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.insightText}
                </p>
                <div className="pt-2">
                    <button className="text-[10px] font-black uppercase tracking-widest text-white hover:text-primary transition-colors flex items-center gap-2">
                        View Detailed Report <TrendingUp size={12} className="inline" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsInsights;
