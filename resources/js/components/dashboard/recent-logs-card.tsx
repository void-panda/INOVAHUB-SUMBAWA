import React from 'react';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AuditLogItem } from './types';

interface RecentLogsCardProps {
    logs: AuditLogItem[];
}

export const RecentLogsCard: React.FC<RecentLogsCardProps> = ({ logs }) => {
    return (
        <Card className="border shadow-xs">
            <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Audit Trail & Log Validasi Terbaru
                </CardTitle>
                <CardDescription className="text-xs">
                    Catatan transisi status dan verifikasi berjenjang INOVA-HUB.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0">
                {logs.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Belum ada riwayat aktivitas validasi.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {logs.map((log) => (
                            <div
                                key={log.id}
                                className="p-3 rounded-md border-l-4 border-primary bg-muted/20 text-xs space-y-1.5"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-foreground">{log.user_nama}</span>
                                    <span className="text-[10px] text-muted-foreground">{log.created_at}</span>
                                </div>
                                <div className="text-muted-foreground truncate font-medium">{log.inovasi_nama}</div>
                                <div className="text-[11px] flex items-center gap-1">
                                    <Badge variant="outline" className="text-[10px]">
                                        {log.status_sebelum}
                                    </Badge>
                                    <span>→</span>
                                    <Badge variant="secondary" className="text-[10px] font-bold">
                                        {log.status_sesudah}
                                    </Badge>
                                </div>
                                {log.catatan && (
                                    <p className="text-[11px] text-muted-foreground italic">"{log.catatan}"</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
