import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, Building2, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernBarChart, ModernDonutChart, ModernRadialGauge } from './role-charts';
import type { MetricSummary, TopOpdItem } from './types';

interface PenilaiDashboardProps {
    summary: MetricSummary;
    simulasiBrief: {
        spd_score: number;
        sid_score: number;
        skor_jumlah_inovasi: number;
        total_skor: number;
    };
    urusanChartData: { name: string; value: number; color?: string }[];
    statusDonutItems: { label: string; value: number; color: string }[];
    topOpd: TopOpdItem[];
}

export const PenilaiDashboard: React.FC<PenilaiDashboardProps> = ({
    summary,
    simulasiBrief,
    urusanChartData,
    statusDonutItems,
    topOpd,
}) => {
    return (
        <div className="space-y-6">
            {/* Macro KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="py-3 px-4 pb-2">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            Estimasi Skor IID Sumbawa
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-3xl font-black text-primary">{summary.iid_score.toFixed(2)}</div>
                        <div className="mt-2">
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${summary.kategori_iga.bg}`}
                            >
                                {summary.kategori_iga.label}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="py-3 px-4 pb-2">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            Total Inovasi Terdaftar
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-3xl font-bold text-foreground">{summary.total_inovasi}</div>
                        <p className="text-xs text-muted-foreground mt-1.5">Usulan periode berjalan</p>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="py-3 px-4 pb-2">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            Siap Kirim (Kemendagri)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-3xl font-bold text-primary">{summary.siap_kirim_count}</div>
                        <p className="text-xs text-muted-foreground mt-1.5">Siap diekspor ke sistem pusat</p>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="py-3 px-4 pb-2">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            OPD Pengusul Aktif
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-3xl font-bold text-foreground">{summary.opd_aktif_count}</div>
                        <p className="text-xs text-muted-foreground mt-1.5">Perangkat Daerah terdaftar</p>
                    </CardContent>
                </Card>
            </div>

            {/* Visual Analytics Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart Sektor */}
                <Card className="border shadow-xs lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Distribusi Sektor Inovasi per Urusan Utama
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Visualisasi bar chart sektor terbanyak Kabupaten Sumbawa.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ModernBarChart data={urusanChartData} height={210} />
                    </CardContent>
                </Card>

                {/* Gauge Component Breakdown */}
                <Card className="border shadow-xs flex flex-col justify-center">
                    <CardHeader className="pb-0 text-center">
                        <CardTitle className="text-base font-semibold">Capaian SPD & SID (TOR §8)</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center p-2">
                        <ModernRadialGauge
                            value={simulasiBrief.spd_score}
                            max={63}
                            label="Skor SPD"
                            sublabel={`Max 63 pts • SID: ${simulasiBrief.sid_score.toFixed(1)}/187 pts`}
                            color="hsl(var(--primary))"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Status Donut & Leaderboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Donut Status Breakdown */}
                <Card className="border shadow-xs">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5 text-primary" />
                            Proporsi 8 Alur Status Inovasi (TOR §5)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ModernDonutChart items={statusDonutItems} totalLabel="Total Usulan" />
                    </CardContent>
                </Card>

                {/* Top OPD Leaderboard */}
                <Card className="border shadow-xs">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                Top 5 OPD Paling Inovatif
                            </CardTitle>
                            <Link
                                href="/simulasi"
                                className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                            >
                                Lihat Full <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 p-4 pt-0">
                        {topOpd.length === 0 ? (
                            <p className="text-xs text-muted-foreground">Belum ada data peringkat OPD.</p>
                        ) : (
                            topOpd.map((opd, idx) => (
                                <div
                                    key={opd.id}
                                    className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-primary text-primary-foreground font-bold text-xs h-7 w-7 rounded-md p-0 flex items-center justify-center">
                                            #{idx + 1}
                                        </Badge>
                                        <div>
                                            <div className="font-semibold text-xs text-foreground leading-tight">
                                                {opd.nama}
                                            </div>
                                            <div className="text-[11px] text-muted-foreground mt-0.5">
                                                {opd.approved_count} Inovasi Disetujui
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-primary block">
                                            {opd.avg_skor.toFixed(2)}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">Rata-Rata Skor</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
