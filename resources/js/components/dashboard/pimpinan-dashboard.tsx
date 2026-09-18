import React from 'react';
import { Award, Building2, FileCheck, PieChart as PieChartIcon, ShieldCheck, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernBarChart, ModernDonutChart } from './role-charts';
import type { MetricSummary } from './types';

interface PimpinanDashboardProps {
    summary: MetricSummary;
    urusanChartData: { name: string; value: number; color?: string }[];
    tahapanDonutItems: { label: string; value: number; color: string }[];
}

export const PimpinanDashboard: React.FC<PimpinanDashboardProps> = ({
    summary,
    urusanChartData,
    tahapanDonutItems,
}) => {
    return (
        <div className="space-y-6">
            {/* Executive KPI Header Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="py-3 px-4 pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            Skor IID Sumbawa
                        </CardTitle>
                        <Award className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-3xl font-black text-primary">{summary.iid_score.toFixed(2)}</div>
                        <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-bold border ${summary.kategori_iga.bg}`}
                        >
                            {summary.kategori_iga.label}
                        </span>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="py-3 px-4 pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            Kelayakan Yandas
                        </CardTitle>
                        <ShieldCheck className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-3xl font-black text-primary">{summary.yandas_count} / 6</div>
                        <p className="text-xs font-semibold text-muted-foreground mt-1">
                            {summary.yandas_compliant ? 'Memenuhi Syarat Minimal (5/6)' : 'Belum Memenuhi 5/6'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="py-3 px-4 pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            Inovasi Siap IGA
                        </CardTitle>
                        <FileCheck className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-3xl font-black text-primary">{summary.siap_kirim_count}</div>
                        <p className="text-xs text-muted-foreground mt-1">Inovasi siap diekspor ke Kemendagri</p>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="py-3 px-4 pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            OPD Pengusul Aktif
                        </CardTitle>
                        <Building2 className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-3xl font-black text-foreground">{summary.opd_aktif_count}</div>
                        <p className="text-xs text-muted-foreground mt-1">Perangkat daerah berpartisipasi</p>
                    </CardContent>
                </Card>
            </div>

            {/* Visual Executive Analytics Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border shadow-xs">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Distribusi Sektor Inovasi Daerah
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Jumlah inovasi terdaftar berdasarkan Urusan Utama.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ModernBarChart data={urusanChartData} height={200} />
                    </CardContent>
                </Card>

                <Card className="border shadow-xs">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5 text-primary" />
                            Tahapan Kesiapan Inovasi
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Proporsi Inisiatif, Uji Coba, & Penerapan Resmi.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ModernDonutChart items={tahapanDonutItems} totalLabel="Total Usulan" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
