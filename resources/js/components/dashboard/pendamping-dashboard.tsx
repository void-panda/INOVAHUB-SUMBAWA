import React from 'react';
import { Link } from '@inertiajs/react';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STATUS_LABELS } from './badges';

interface PendingReviewItem {
    id: number;
    nama_inovasi: string;
    opd_nama?: string;
    created_at?: string;
    status: string;
}

interface PendampingDashboardProps {
    roleData: {
        needs_review?: number;
        in_revisi?: number;
        verified_count?: number;
        total_assigned?: number;
        pending_list?: PendingReviewItem[];
    };
}

export const PendampingDashboard: React.FC<PendampingDashboardProps> = ({ roleData }) => {
    const needsReview = roleData.needs_review ?? 0;
    const inRevisi = roleData.in_revisi ?? 0;
    const verifiedCount = roleData.verified_count ?? 0;
    const totalAssigned = roleData.total_assigned ?? 0;
    const pendingList = roleData.pending_list ?? [];

    return (
        <div className="space-y-6">
            {/* Pendamping Specific KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="py-3 px-4 pb-2">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            Antrean Diajukan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-3xl font-black text-primary">{needsReview}</div>
                        <p className="text-xs text-muted-foreground mt-1">Membutuhkan verifikasi segera</p>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="py-3 px-4 pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            Dalam Revisi
                        </CardTitle>
                        {inRevisi > 0 && <AlertCircle className="h-4 w-4 text-destructive shrink-0" />}
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className={`text-3xl font-black ${inRevisi > 0 ? 'text-destructive' : 'text-foreground'}`}>
                            {inRevisi}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Menunggu pembaruan dari inovator</p>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="py-3 px-4 pb-2">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            Selesai Divalidasi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-3xl font-black text-primary">{verifiedCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Telah disetujui / disahkan OPD</p>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="py-3 px-4 pb-2">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            Total Dalam Binaan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-3xl font-black text-foreground">{totalAssigned}</div>
                        <p className="text-xs text-muted-foreground mt-1">Alokasi usulan ditugaskan</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Action Pending Items Table */}
            <Card className="border shadow-xs">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            Inovasi Perlu Tindakan Cepat (Antrean Verifikasi)
                        </CardTitle>
                        <Button
                            asChild
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                        >
                            <Link href="/pendamping">Buka Halaman Verifikasi Full</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {pendingList.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-4 text-center">
                            Tidak ada antrean verifikasi saat ini. Pekerjaan Anda selesai!
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {pendingList.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors flex items-center justify-between gap-4"
                                >
                                    <div>
                                        <div className="font-bold text-xs text-foreground">{item.nama_inovasi}</div>
                                        <div className="text-[11px] text-muted-foreground mt-0.5">
                                            {item.opd_nama} • Diajukan: {item.created_at}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={item.status === 'diajukan' ? 'default' : 'outline'}
                                            className="text-[10px] uppercase"
                                        >
                                            {STATUS_LABELS[item.status] ?? item.status}
                                        </Badge>
                                        <Button asChild size="sm" variant="outline" className="text-xs">
                                            <Link href="/pendamping">Verifikasi</Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
