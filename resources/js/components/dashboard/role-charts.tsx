import React from 'react';

interface BarChartProps {
    data: { name: string; value: number; color?: string }[];
    maxValue?: number;
    height?: number;
}

export const ModernBarChart: React.FC<BarChartProps> = ({ data, maxValue, height = 220 }) => {
    const computedMax = maxValue ?? Math.max(...data.map((d) => d.value), 1);

    return (
        <div className="w-full flex flex-col justify-end gap-3 pt-4 pb-2" style={{ height: `${height}px` }}>
            <div className="flex items-end justify-between gap-2 h-full px-2">
                {data.map((item, idx) => {
                    const percentage = Math.round((item.value / computedMax) * 100);
                    const barHeight = Math.max(percentage, 6);

                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                            <div className="text-[10px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                                {item.value}
                            </div>
                            <div className="w-full max-w-[42px] bg-muted/40 rounded-t-lg overflow-hidden flex items-end h-full">
                                <div
                                    className={`w-full rounded-t-lg transition-all duration-500 group-hover:brightness-110 ${item.color ?? 'bg-primary'}`}
                                    style={{ height: `${barHeight}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-semibold text-muted-foreground mt-2 truncate max-w-[60px] text-center">
                                {item.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

interface DonutChartProps {
    items: { label: string; value: number; color: string }[];
    totalLabel?: string;
    size?: number;
}

export const ModernDonutChart: React.FC<DonutChartProps> = ({ items, totalLabel = 'Total Inovasi', size = 160 }) => {
    const total = items.reduce((acc, curr) => acc + curr.value, 0);

    let cumulativePercent = 0;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {total === 0 ? (
                        <circle cx="50" cy="50" r="38" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-muted/30" />
                    ) : (
                        items.map((item, idx) => {
                            if (item.value === 0) return null;
                            const percent = item.value / total;
                            const strokeDasharray = `${percent * 238.76} ${238.76 - percent * 238.76}`;
                            const strokeDashoffset = -cumulativePercent * 238.76;
                            cumulativePercent += percent;

                            return (
                                <circle
                                    key={idx}
                                    cx="50"
                                    cy="50"
                                    r="38"
                                    fill="transparent"
                                    stroke={item.color}
                                    strokeWidth="12"
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    className="transition-all duration-500 hover:opacity-80"
                                />
                            );
                        })
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                    <span className="text-2xl font-black text-foreground">{total}</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{totalLabel}</span>
                </div>
            </div>

            <div className="space-y-2 text-xs w-full max-w-[200px]">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-1.5 rounded-md hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-2 truncate">
                            <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-muted-foreground font-medium truncate">{item.label}</span>
                        </div>
                        <span className="font-bold text-foreground">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface GaugeChartProps {
    value: number; // e.g. score out of max
    max?: number;
    label: string;
    sublabel?: string;
    color?: string;
}

export const ModernRadialGauge: React.FC<GaugeChartProps> = ({
    value,
    max = 100,
    label,
    sublabel,
    color = 'hsl(var(--primary))',
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const strokeDasharray = `${(percentage / 100) * 188.4} 188.4`;

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
                <svg viewBox="0 0 80 80" className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="30" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                    <circle
                        cx="40"
                        cy="40"
                        r="30"
                        fill="transparent"
                        stroke={color}
                        strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black tracking-tight text-foreground">{value.toFixed(1)}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{label}</span>
                </div>
            </div>
            {sublabel && <span className="text-xs font-semibold text-muted-foreground mt-2 text-center">{sublabel}</span>}
        </div>
    );
};
