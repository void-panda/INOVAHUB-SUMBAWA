import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STATUS_LABELS } from './badges';

interface StatusPipelineCardProps {
    statusCounts: Record<string, number>;
}

export const StatusPipelineCard: React.FC<StatusPipelineCardProps> = ({ statusCounts }) => {
    return (
        <Card className="border shadow-xs">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Layers className="h-5 w-5 text-primary" />
                        Monitoring 8 Alur Status Inovasi (TOR §5)
                    </CardTitle>
                    <Link
                        href="/inovasi"
                        className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                    >
                        Lihat Semua Inovasi <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                    {Object.entries(statusCounts).map(([statusKey, count]) => (
                        <div
                            key={statusKey}
                            className="p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors text-center"
                        >
                            <span className="text-[10px] uppercase font-bold text-muted-foreground block truncate">
                                {STATUS_LABELS[statusKey] ?? statusKey}
                            </span>
                            <span className="text-xl font-black text-foreground block mt-1">{count}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
