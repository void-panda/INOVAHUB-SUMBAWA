import React from 'react';
import { Link } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Clock,
    FileEdit,
    FileText,
    FolderOpen,
    Info,
    Layers,
    Plus,
    Printer,
    Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { create } from '@/routes/inovasi';
import { StatusBadge, TahapanBadge } from './badges';
import type { InovasiSummaryItem, RevisiAlertItem, TimelineItem } from './types';

interface InovatorDashboardProps {
    roleData: {
        total_my_inovasi?: number;
        revisi_count?: number;
        proses_count?: number;
        disetujui_count?: number;
        avg_skor_kematangan?: number;
        revisi_alerts?: RevisiAlertItem[];
        my_inovasi_list?: InovasiSummaryItem[];
        status_counts?: Record<string, number>;
    };
    linimasa: TimelineItem[];
}

export const InovatorDashboard: React.FC<InovatorDashboardProps> = ({ roleData, linimasa }) => {
    const totalMyInovasi = roleData.total_my_inovasi ?? 0;
    const revisiCount = roleData.revisi_count ?? 0;
    const prosesCount = roleData.proses_count ?? 0;
    const disetujuiCount = roleData.disetujui_count ?? 0;
    const avgSkorKematangan = Number(roleData.avg_skor_kematangan ?? 0).toFixed(2);
    const revisiAlerts = roleData.revisi_alerts ?? [];
    const myInovasiList = roleData.my_inovasi_list ?? [];
    const statusCounts = roleData.status_counts ?? {};

    return (
        <div className="space-y-6">
            {/* 1. Inovator Specific KPI Cards (5 Metrics) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="py-3 px-4 pb-2">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            Total Inovasi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-2xl md:text-3xl font-black text-foreground">{totalMyInovasi}</div>
                        <p className="text-xs text-muted-foreground mt-1">Terdaftar atas nama/OPD Anda</p>
                    </CardContent>
                </Card>

                <Card
                    className={`border-border bg-card shadow-xs ${
                        revisiCount > 0 ? 'border-destructive/40 bg-destructive/5' : ''
                    }`}
                >
                    <CardHeader className="py-3 px-4 pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            Perlu Revisi
                        </CardTitle>
                        {revisiCount > 0 && <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />}
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div
                            className={`text-2xl md:text-3xl font-black ${
                                revisiCount > 0 ? 'text-destructive' : 'text-foreground'
                            }`}
                        >
                            {revisiCount}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {revisiCount > 0 ? 'Membutuhkan perbaikan segera' : 'Tidak ada catatan revisi'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="py-3 px-4 pb-2">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            Dalam Validasi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-2xl md:text-3xl font-black text-primary">{prosesCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Sedang direview pendamping</p>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="py-3 px-4 pb-2">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            Disetujui / Valid
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-2xl md:text-3xl font-black text-primary">{disetujuiCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Kualitas siap IGA Kemendagri</p>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="py-3 px-4 pb-2">
                        <CardTitle className="text-xs font-bold text-muted-foreground uppercase">
                            Rata-Rata Kematangan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className="text-2xl md:text-3xl font-black text-primary">{avgSkorKematangan}</div>
                        <p className="text-xs text-muted-foreground mt-1">Skor akumulasi 20 SID</p>
                    </CardContent>
                </Card>
            </div>

            {/* 2. Revisi Action Center (When revisions are pending) */}
            {revisiAlerts.length > 0 && (
                <Card className="border-destructive/30 bg-destructive/5 shadow-xs">
                    <CardHeader className="pb-3 border-b border-destructive/10">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-bold text-destructive flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 shrink-0" />
                                Perlu Tindak Lanjut: Catatan Revisi dari Pendamping Inovasi ({revisiAlerts.length})
                            </CardTitle>
                            <Badge variant="destructive" className="text-xs">
                                Wajib Diperbaiki
                            </Badge>
                        </div>
                        <CardDescription className="text-xs text-destructive/80 mt-1">
                            Segera lengkapi bukti dukung atau perbaiki isian data indikator berikut agar dapat
                            divalidasi ulang oleh pendamping.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-3 space-y-3">
                        {revisiAlerts.map((alert) => (
                            <div
                                key={alert.id}
                                className="p-3.5 rounded-lg bg-background border border-destructive/20 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-sm text-foreground">
                                            {alert.nama_inovasi}
                                        </span>
                                        <Badge variant="destructive" className="text-[10px]">
                                            Revisi
                                        </Badge>
                                        {alert.created_at && (
                                            <span className="text-[11px] text-muted-foreground">
                                                • {alert.created_at}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground bg-muted/40 p-2 rounded border border-border/40 leading-relaxed">
                                        <strong className="text-foreground">Catatan Validator:</strong>{' '}
                                        {alert.catatan}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                        asChild
                                        size="sm"
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs gap-1.5 cursor-pointer"
                                    >
                                        <Link href={`/inovasi/${alert.inovasi_id}/indikator`}>
                                            <FolderOpen className="h-3.5 w-3.5" /> Buka Lembar Kerja SID
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm"
                                        variant="outline"
                                        className="text-xs gap-1.5 cursor-pointer"
                                    >
                                        <Link href={`/inovasi/${alert.inovasi_id}/edit`}>
                                            <FileEdit className="h-3.5 w-3.5" /> Edit Profil
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* 3. Inovasi Saya & Kesiapan 20 Indikator SID (Main Workspace Table) */}
            <Card className="border shadow-xs">
                <CardHeader className="pb-3 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Layers className="h-5 w-5 text-primary" />
                                Inovasi Saya & Progres Kesiapan 20 Indikator SID
                            </CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                                Pantau kelengkapan berkas dukung, skor kematangan, dan status validasi berjenjang
                                untuk usulan Anda.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                                <Link href="/inovasi">
                                    Lihat Semua Inovasi ({totalMyInovasi})
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {myInovasiList.length === 0 ? (
                        <div className="text-center py-12 px-4 space-y-3">
                            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Sparkles className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-foreground text-sm">Belum Ada Inovasi Terdaftar</h3>
                                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                    Mulai daftarkan inovasi perangkat daerah atau masyarakat Anda untuk periode lomba
                                    saat ini.
                                </p>
                            </div>
                            <Button
                                asChild
                                size="sm"
                                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                <Link href={create()}>
                                    <Plus className="h-4 w-4" /> Daftarkan Inovasi Baru
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {myInovasiList.map((item) => {
                                const filledIndikator = item.indikator_filled ?? 0;
                                const percentComplete = Math.min(
                                    100,
                                    Math.round((filledIndikator / 20) * 100)
                                );
                                const skor = Number(item.skor_kematangan ?? 0);

                                return (
                                    <div
                                        key={item.id}
                                        className="p-4 hover:bg-muted/30 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                                    >
                                        {/* Col 1: Innovation info */}
                                        <div className="space-y-1.5 min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Link
                                                    href={`/inovasi/${item.id}/indikator`}
                                                    className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                                                >
                                                    {item.nama_inovasi}
                                                </Link>
                                                <TahapanBadge tahapan={item.tahapan} />
                                                <StatusBadge status={item.status} />
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                                <span>Diperbarui: {item.updated_at}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1 font-medium text-foreground">
                                                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {item.dokumen_count ?? 0} Dokumen Pendukung
                                                </span>
                                            </div>
                                        </div>

                                        {/* Col 2: Indicator progress and maturity score */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 lg:w-72">
                                            <div className="w-full space-y-1.5">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-muted-foreground text-[11px] font-medium">
                                                        Kelengkapan 20 SID
                                                    </span>
                                                    <span className="font-bold text-foreground text-[11px]">
                                                        {filledIndikator}/20 ({percentComplete}%)
                                                    </span>
                                                </div>
                                                <Progress value={percentComplete} className="h-2" />
                                            </div>

                                            <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-md text-center shrink-0 min-w-[75px]">
                                                <span className="text-[10px] text-muted-foreground font-semibold block uppercase">
                                                    Skor SID
                                                </span>
                                                <span className="text-sm font-black text-primary block">
                                                    {skor.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Col 3: Actions */}
                                        <div className="flex items-center gap-1.5 shrink-0 self-end lg:self-center">
                                            <Button
                                                asChild
                                                size="sm"
                                                className="h-8 px-2.5 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                                            >
                                                <Link href={`/inovasi/${item.id}/indikator`}>
                                                    <FolderOpen className="h-3.5 w-3.5" />
                                                    <span className="hidden sm:inline">20 Indikator</span>
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                                className="h-8 px-2.5 text-xs gap-1.5 cursor-pointer"
                                            >
                                                <Link href={`/inovasi/${item.id}/edit`}>
                                                    <FileEdit className="h-3.5 w-3.5" />
                                                    <span className="hidden sm:inline">Edit Profil</span>
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 px-2 text-xs cursor-pointer text-muted-foreground hover:text-foreground"
                                            >
                                                <a
                                                    href={`/inovasi/${item.id}/print`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Printer className="h-3.5 w-3.5" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 4. Monitoring Pipelines & Competition Timeline (2-Column Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visual Pipeline Alur Validasi 8 Langkah */}
                <Card className="border shadow-xs">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Alur Validasi Berjenjang 8 Langkah (TOR §5)
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Distribusi perjalanan status inovasi Anda dalam quality assurance layer IGA 2026.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                            <div className="p-3 bg-muted/40 rounded-lg border flex flex-col items-center justify-center">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                                    1. Draft
                                </span>
                                <span className="text-xl font-black text-foreground mt-0.5">
                                    {statusCounts.draft ?? 0}
                                </span>
                                <span className="text-[10px] text-muted-foreground">Inovator</span>
                            </div>

                            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900 flex flex-col items-center justify-center">
                                <span className="text-[10px] uppercase font-bold text-blue-600">2. Diajukan</span>
                                <span className="text-xl font-black text-blue-700 dark:text-blue-400 mt-0.5">
                                    {statusCounts.diajukan ?? 0}
                                </span>
                                <span className="text-[10px] text-muted-foreground">Menunggu Validator</span>
                            </div>

                            <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-lg border border-indigo-200 dark:border-indigo-900 flex flex-col items-center justify-center">
                                <span className="text-[10px] uppercase font-bold text-indigo-600">
                                    3. Divalidasi
                                </span>
                                <span className="text-xl font-black text-indigo-700 dark:text-indigo-400 mt-0.5">
                                    {statusCounts.divalidasi ?? 0}
                                </span>
                                <span className="text-[10px] text-muted-foreground">Pendamping</span>
                            </div>

                            <div
                                className={`p-3 rounded-lg border flex flex-col items-center justify-center ${
                                    (statusCounts.revisi ?? 0) > 0
                                        ? 'bg-destructive/10 border-destructive/30'
                                        : 'bg-muted/40'
                                }`}
                            >
                                <span className="text-[10px] uppercase font-bold text-destructive">
                                    4a. Revisi
                                </span>
                                <span
                                    className={`text-xl font-black mt-0.5 ${
                                        (statusCounts.revisi ?? 0) > 0 ? 'text-destructive' : 'text-foreground'
                                    }`}
                                >
                                    {statusCounts.revisi ?? 0}
                                </span>
                                <span className="text-[10px] text-muted-foreground">Perlu Perbaikan</span>
                            </div>

                            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 flex flex-col items-center justify-center">
                                <span className="text-[10px] uppercase font-bold text-primary">
                                    4b. Disetujui
                                </span>
                                <span className="text-xl font-black text-primary mt-0.5">
                                    {statusCounts.disetujui ?? 0}
                                </span>
                                <span className="text-[10px] text-muted-foreground">Lolos Pendamping</span>
                            </div>

                            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 flex flex-col items-center justify-center">
                                <span className="text-[10px] uppercase font-bold text-primary">
                                    5. Disahkan OPD
                                </span>
                                <span className="text-xl font-black text-primary mt-0.5">
                                    {statusCounts.disahkan_opd ?? 0}
                                </span>
                                <span className="text-[10px] text-muted-foreground">Verifikator OPD</span>
                            </div>

                            <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900 flex flex-col items-center justify-center">
                                <span className="text-[10px] uppercase font-bold text-purple-600">6. Review</span>
                                <span className="text-xl font-black text-purple-700 dark:text-purple-400 mt-0.5">
                                    {statusCounts.review_internal ?? 0}
                                </span>
                                <span className="text-[10px] text-muted-foreground">Tim Penilai</span>
                            </div>

                            <div className="p-3 bg-primary/15 rounded-lg border border-primary/30 flex flex-col items-center justify-center">
                                <span className="text-[10px] uppercase font-bold text-primary">
                                    7-8. Siap Kirim
                                </span>
                                <span className="text-xl font-black text-primary mt-0.5">
                                    {(statusCounts.siap_kirim ?? 0) + (statusCounts.terkirim ?? 0)}
                                </span>
                                <span className="text-[10px] text-muted-foreground">Kemendagri</span>
                            </div>
                        </div>

                        <div className="p-3 bg-muted/30 rounded-lg border text-xs text-muted-foreground flex items-center gap-2 mt-2">
                            <Info className="h-4 w-4 text-primary shrink-0" />
                            <span>
                                Setelah inovasi berstatus <strong>Disetujui</strong>, Verifikator OPD akan melakukan
                                pengesahan sebelum dinilai oleh Tim Penilai / BAPPERIDA.
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Linimasa & Panduan Kesiapan */}
                <Card className="border shadow-xs">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Linimasa IGA Sumbawa 2026
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Jadwal tahapan pengusulan, pendampingan, validasi, dan penutupan penginputan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-3">
                        {linimasa.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-4 text-center">
                                Belum ada linimasa kompetisi terdaftar untuk periode aktif saat ini.
                            </p>
                        ) : (
                            linimasa.map((item) => (
                                <div
                                    key={item.id}
                                    className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                                        item.is_current
                                            ? 'border-primary bg-primary/10 shadow-xs'
                                            : item.is_passed
                                            ? 'bg-muted/20 border-border opacity-70'
                                            : 'bg-muted/40 border-border'
                                    }`}
                                >
                                    <div className="space-y-0.5">
                                        <span className="font-bold text-foreground block">{item.nama}</span>
                                        <span className="text-muted-foreground text-[11px]">
                                            {item.mulai} s.d. {item.selesai}
                                        </span>
                                    </div>
                                    <div>
                                        {item.is_current ? (
                                            <Badge className="bg-primary text-primary-foreground text-[10px] font-bold gap-1">
                                                <Sparkles className="h-3 w-3" /> Sedang Berjalan
                                            </Badge>
                                        ) : item.is_passed ? (
                                            <Badge variant="secondary" className="text-[10px]">
                                                Selesai
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[10px]">
                                                Mendatang
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Quick Checklist Banner */}
                        <div className="p-3.5 bg-primary/5 rounded-lg border border-primary/20 space-y-2 mt-3">
                            <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                3 Kunci Meraih Skor Kematangan Maksimal:
                            </div>
                            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                                <li>Pastikan Rancang Bangun memuat minimal 300 kata penjelasan komprehensif.</li>
                                <li>Unggah SK Regulasi & SK Penetapan Inovasi dengan nomor surat yang sah.</li>
                                <li>Lengkapi 20 Indikator SID dengan bukti dukung PDF faktual & parameter P3.</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
