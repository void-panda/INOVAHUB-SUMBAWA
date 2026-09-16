import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    ArrowRight,
    ArrowUpRight,
    Award,
    BarChart3,
    BookOpen,
    Building2,
    Check,
    CheckCircle2,
    Clock,
    ExternalLink,
    FileCheck,
    FileEdit,
    FileText,
    FolderKanban,
    FolderOpen,
    HelpCircle,
    Info,
    Layers,
    PieChart as PieChartIcon,
    Plus,
    Printer,
    ShieldCheck,
    Sliders,
    Sparkles,
    TrendingUp,
    UserCheck,
} from 'lucide-react';
import { ModernBarChart, ModernDonutChart, ModernRadialGauge } from '@/components/dashboard/role-charts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { dashboard } from '@/routes';
import { create } from '@/routes/inovasi';
import type { Auth } from '@/types';

const getTahapanBadge = (tahapan: string) => {
    switch (tahapan) {
        case 'penerapan':
            return <Badge className="bg-primary text-primary-foreground text-[10px] font-semibold">Penerapan (Siap IGA)</Badge>;
        case 'ujicoba':
            return <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950/30 text-[10px]">Uji Coba</Badge>;
        case 'inisiatif':
        default:
            return <Badge variant="secondary" className="text-muted-foreground text-[10px]">Inisiatif</Badge>;
    }
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'draft':
            return <Badge variant="secondary" className="text-[10px]">Draft</Badge>;
        case 'diajukan':
            return <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950/30 text-[10px]">Diajukan</Badge>;
        case 'divalidasi':
            return <Badge variant="outline" className="text-indigo-600 border-indigo-300 bg-indigo-50 dark:bg-indigo-950/30 text-[10px]">Divalidasi</Badge>;
        case 'revisi':
            return <Badge variant="destructive" className="text-[10px] font-bold gap-1"><AlertCircle className="h-3 w-3" /> Perlu Revisi</Badge>;
        case 'disetujui':
            return <Badge variant="outline" className="text-primary border-primary/40 bg-primary/10 text-[10px] font-semibold">Disetujui</Badge>;
        case 'disahkan_opd':
            return <Badge variant="outline" className="text-primary border-primary/40 bg-primary/10 text-[10px] font-semibold">Disahkan OPD</Badge>;
        case 'review_internal':
            return <Badge variant="outline" className="text-purple-600 border-purple-300 bg-purple-50 dark:bg-purple-950/30 text-[10px]">Review Internal</Badge>;
        case 'siap_kirim':
            return <Badge className="bg-primary text-primary-foreground text-[10px] font-bold">Siap Kirim</Badge>;
        case 'terkirim':
            return <Badge className="bg-primary text-primary-foreground text-[10px] font-bold">Terkirim</Badge>;
        default:
            return <Badge variant="outline" className="text-[10px] capitalize">{status.replace('_', ' ')}</Badge>;
    }
};

interface MetricSummary {
    total_inovasi: number;
    siap_kirim_count: number;
    opd_aktif_count: number;
    iid_score: number;
    kategori_iga: {
        label: string;
        color: string;
        bg: string;
        badge: 'default' | 'secondary' | 'outline' | 'destructive';
    };
    yandas_compliant: boolean;
    yandas_count: number;
}

interface DashboardMetrics {
    user_role: string;
    role_data: Record<string, any>;
    periode: { id: number; tahun: string; nama: string } | null;
    summary: MetricSummary;
    status_counts: Record<string, number>;
    tahapan_counts: {
        inisiatif: number;
        ujicoba: number;
        penerapan: number;
    };
    urusan_distribution: { urusan: string; count: number }[];
    top_opd: {
        id: number;
        kode: string;
        nama: string;
        total_inovasi: number;
        approved_count: number;
        avg_skor: number;
    }[];
    recent_logs: {
        id: number;
        user_nama: string;
        inovasi_nama: string;
        status_sebelum: string;
        status_sesudah: string;
        catatan: string | null;
        created_at: string;
    }[];
    recent_inovasi: {
        id: number;
        nama_inovasi: string;
        status: string;
        tahapan: string;
        opd_nama: string;
        created_at: string;
    }[];
    linimasa: {
        id: number;
        nama: string;
        mulai: string;
        selesai: string;
        is_current: boolean;
        is_passed: boolean;
    }[];
    performance: {
        total_validasi_logs: number;
        revisi_rate: number;
        avg_turnaround_hours: number;
    };
    simulasi_brief: {
        spd_score: number;
        sid_score: number;
        skor_jumlah_inovasi: number;
        total_skor: number;
    };
}

interface Props {
    metrics?: DashboardMetrics;
}

const statusLabel: Record<string, string> = {
    draft: 'Draft',
    diajukan: 'Diajukan',
    divalidasi: 'Divalidasi',
    revisi: 'Revisi',
    disetujui: 'Disetujui',
    disahkan_opd: 'Disahkan OPD',
    review_internal: 'Review Internal',
    siap_kirim: 'Siap Kirim',
    terkirim: 'Terkirim',
};

const statusColors: Record<string, string> = {
    draft: '#94a3b8',
    diajukan: '#3b82f6',
    divalidasi: '#6366f1',
    revisi: '#f59e0b',
    disetujui: '#10b981',
    disahkan_opd: '#14b8a6',
    review_internal: '#8b5cf6',
    siap_kirim: '#059669',
    terkirim: '#0284c7',
};

export default function Dashboard({ metrics }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth.user;
    const userRole = metrics?.user_role ?? 'inovator';
    const roleData = metrics?.role_data ?? {};

    const summary = metrics?.summary ?? {
        total_inovasi: 0,
        siap_kirim_count: 0,
        opd_aktif_count: 0,
        iid_score: 0,
        kategori_iga: { label: 'Tidak Dapat Dinilai', color: 'rose', bg: 'bg-rose-500/10 text-rose-600 border-rose-500/30', badge: 'destructive' },
        yandas_compliant: false,
        yandas_count: 0,
    };

    const statusCounts = metrics?.status_counts ?? {};
    const tahapanCounts = metrics?.tahapan_counts ?? { inisiatif: 0, ujicoba: 0, penerapan: 0 };
    const urusanDistribution = metrics?.urusan_distribution ?? [];
    const topOpd = metrics?.top_opd ?? [];
    const recentLogs = metrics?.recent_logs ?? [];
    const linimasa = metrics?.linimasa ?? [];
    const simulasiBrief = metrics?.simulasi_brief ?? { spd_score: 0, sid_score: 0, skor_jumlah_inovasi: 0, total_skor: 0 };

    // Format chart data
    const urusanChartData = urusanDistribution.map((item, idx) => ({
        name: item.urusan.length > 15 ? item.urusan.substring(0, 15) + '...' : item.urusan,
        value: item.count,
        color: ['bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'][idx % 6],
    }));

    const tahapanDonutItems = [
        { label: 'Penerapan (Siap IGA)', value: tahapanCounts.penerapan, color: '#10b981' },
        { label: 'Uji Coba Lapangan', value: tahapanCounts.ujicoba, color: '#3b82f6' },
        { label: 'Inisiatif Baru', value: tahapanCounts.inisiatif, color: '#f59e0b' },
    ];

    const statusDonutItems = Object.entries(statusCounts).map(([key, count]) => ({
        label: statusLabel[key] ?? key,
        value: count,
        color: statusColors[key] ?? '#64748b',
    }));

    return (
        <>
            <Head title={`Dashboard Analytics - ${userRole.toUpperCase()}`} />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full pb-16">
                {/* 1. Hero Banner */}
                <div className="relative overflow-hidden rounded-md border border-primary/20 bg-gradient-to-r from-primary via-primary/95 to-primary/85 p-6 md:p-8 shadow-xs text-primary-foreground">
                    {/* Kemang Satange Motif Silhouette */}
                    <svg
                        className="absolute right-0 top-0 bottom-0 h-full w-auto max-w-[55%] opacity-10 pointer-events-none text-primary-foreground fill-current select-none"
                        viewBox="0 0 400 200"
                        preserveAspectRatio="xMidYMid slice"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g transform="translate(260, 100) scale(1.15)">
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                                <g key={angle} transform={`rotate(${angle})`}>
                                    <path d="M0 0 C-10 -30 -25 -50 0 -80 C25 -50 10 -30 0 0" />
                                    <circle cx="0" cy="-45" r="4" fill="currentColor" />
                                    <path d="M-5 -25 L0 -35 L5 -25 L0 -15 Z" />
                                </g>
                            ))}
                            <circle cx="0" cy="0" r="22" fill="none" stroke="currentColor" strokeWidth="3" />
                            <circle cx="0" cy="0" r="55" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                            <polygon points="0,-85 60,-60 85,0 60,60 0,85 -60,60 -85,0 -60,-60" fill="none" stroke="currentColor" strokeWidth="2" />
                        </g>
                    </svg>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge className="bg-primary-foreground/15 text-primary-foreground border-none backdrop-blur-md text-xs font-bold">
                                    <Sparkles className="mr-1 h-3.5 w-3.5" />
                                    {userRole === 'inovator' && 'Portal Inovator OPD & Masyarakat'}
                                    {userRole === 'pendamping' && 'Portal Pendamping & Verifikator OPD'}
                                    {userRole === 'pimpinan' && 'Executive Dashboard Pimpinan Daerah'}
                                    {userRole === 'tim_penilai' && 'Dashboard Analytics Makro Sumbawa'}
                                </Badge>
                                {metrics?.periode && (
                                    <Badge className="bg-background text-foreground font-extrabold text-xs">
                                        Periode Lomba: {metrics.periode.nama}
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary-foreground">
                                Selamat datang, {user?.name}!
                            </h1>
                            <p className="text-xs md:text-sm text-primary-foreground/80 leading-relaxed">
                                Database Inovasi Daerah Sumbawa yang Lengkap dan Akurat — Quality Assurance Layer IGA 2026.
                            </p>
                        </div>

                        {/* Action buttons filtered by role */}
                        <div className="flex flex-wrap gap-2.5 shrink-0">
                            {userRole === 'inovator' && (
                                <Button asChild className="gap-2 bg-background hover:bg-background/90 text-foreground font-bold shadow-xs">
                                    <Link href={create()}>
                                        <Sparkles className="h-4 w-4 text-primary" /> Input Inovasi Baru
                                    </Link>
                                </Button>
                            )}
                            {userRole === 'pendamping' && (
                                <Button asChild className="gap-2 bg-background hover:bg-background/90 text-foreground font-bold shadow-xs">
                                    <Link href="/pendamping">
                                        <ShieldCheck className="h-4 w-4 text-primary" /> Verifikasi Usulan
                                    </Link>
                                </Button>
                            )}
                            {(userRole === 'tim_penilai' || userRole === 'pimpinan') && (
                                <Button asChild className="gap-2 bg-background hover:bg-background/90 text-foreground font-bold shadow-xs">
                                    <Link href="/simulasi">
                                        <Sliders className="h-4 w-4 text-primary" /> Simulasi IID & Yandas
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. ROLE SPECIFIC DASHBOARDS */}

                {/* ======================================================== */}
                {/* ROLE: INOVATOR                                           */}
                {/* ======================================================== */}
                {userRole === 'inovator' && (
                    <>
                        {/* 1. Inovator Specific KPI Cards (5 Metrics) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <Card className="border-border bg-card shadow-xs">
                                <CardHeader className="py-3 px-4 pb-2">
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Total Inovasi</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-2xl md:text-3xl font-black text-foreground">{roleData.total_my_inovasi ?? 0}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Terdaftar atas nama/OPD Anda</p>
                                </CardContent>
                            </Card>

                            <Card className={`border-border bg-card shadow-xs ${(roleData.revisi_count ?? 0) > 0 ? 'border-destructive/40 bg-destructive/5' : ''}`}>
                                <CardHeader className="py-3 px-4 pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Perlu Revisi</CardTitle>
                                    {(roleData.revisi_count ?? 0) > 0 && (
                                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                                    )}
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className={`text-2xl md:text-3xl font-black ${(roleData.revisi_count ?? 0) > 0 ? 'text-destructive' : 'text-foreground'}`}>
                                        {roleData.revisi_count ?? 0}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {(roleData.revisi_count ?? 0) > 0 ? 'Membutuhkan perbaikan segera' : 'Tidak ada catatan revisi'}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-xs">
                                <CardHeader className="py-3 px-4 pb-2">
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Dalam Validasi</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-2xl md:text-3xl font-black text-primary">{roleData.proses_count ?? 0}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Sedang direview pendamping</p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-xs">
                                <CardHeader className="py-3 px-4 pb-2">
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Disetujui / Valid</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-2xl md:text-3xl font-black text-primary">{roleData.disetujui_count ?? 0}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Kualitas siap IGA Kemendagri</p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-xs">
                                <CardHeader className="py-3 px-4 pb-2">
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Rata-Rata Kematangan</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-2xl md:text-3xl font-black text-primary">
                                        {Number(roleData.avg_skor_kematangan ?? 0).toFixed(2)}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Skor akumulasi 20 SID</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* 2. Revisi Action Center (When revisions are pending) */}
                        {roleData.revisi_alerts && roleData.revisi_alerts.length > 0 && (
                            <Card className="border-destructive/30 bg-destructive/5 shadow-xs">
                                <CardHeader className="pb-3 border-b border-destructive/10">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-bold text-destructive flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 shrink-0" />
                                            Perlu Tindak Lanjut: Catatan Revisi dari Pendamping Inovasi ({roleData.revisi_alerts.length})
                                        </CardTitle>
                                        <Badge variant="destructive" className="text-xs">
                                            Wajib Diperbaiki
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-xs text-destructive/80 mt-1">
                                        Segera lengkapi bukti dukung atau perbaiki isian data indikator berikut agar dapat divalidasi ulang oleh pendamping.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-3 space-y-3">
                                    {roleData.revisi_alerts.map((alert: any) => (
                                        <div
                                            key={alert.id}
                                            className="p-3.5 rounded-lg bg-background border border-destructive/20 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-sm text-foreground">{alert.nama_inovasi}</span>
                                                    <Badge variant="destructive" className="text-[10px]">Revisi</Badge>
                                                    {alert.created_at && (
                                                        <span className="text-[11px] text-muted-foreground">• {alert.created_at}</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground bg-muted/40 p-2 rounded border border-border/40 leading-relaxed">
                                                    <strong className="text-foreground">Catatan Validator:</strong> {alert.catatan}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs gap-1.5 cursor-pointer">
                                                    <Link href={`/inovasi/${alert.inovasi_id}/indikator`}>
                                                        <FolderOpen className="h-3.5 w-3.5" /> Buka Lembar Kerja SID
                                                    </Link>
                                                </Button>
                                                <Button asChild size="sm" variant="outline" className="text-xs gap-1.5 cursor-pointer">
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
                                            Pantau kelengkapan berkas dukung, skor kematangan, dan status validasi berjenjang untuk usulan Anda.
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                                            <Link href="/inovasi">
                                                Lihat Semua Inovasi ({roleData.total_my_inovasi ?? 0})
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {!roleData.my_inovasi_list || roleData.my_inovasi_list.length === 0 ? (
                                    <div className="text-center py-12 px-4 space-y-3">
                                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Sparkles className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-foreground text-sm">Belum Ada Inovasi Terdaftar</h3>
                                            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                                Mulai daftarkan inovasi perangkat daerah atau masyarakat Anda untuk periode lomba saat ini.
                                            </p>
                                        </div>
                                        <Button asChild size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                                            <Link href={create()}>
                                                <Plus className="h-4 w-4" /> Daftarkan Inovasi Baru
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {roleData.my_inovasi_list.map((item: any) => {
                                            const filledIndikator = item.indikator_filled ?? 0;
                                            const percentComplete = Math.min(100, Math.round((filledIndikator / 20) * 100));
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
                                                            {getTahapanBadge(item.tahapan)}
                                                            {getStatusBadge(item.status)}
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
                                                            <a href={`/inovasi/${item.id}/print`} target="_blank" rel="noopener noreferrer">
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
                                            <span className="text-[10px] uppercase font-bold text-muted-foreground">1. Draft</span>
                                            <span className="text-xl font-black text-foreground mt-0.5">
                                                {roleData.status_counts?.draft ?? 0}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">Inovator</span>
                                        </div>

                                        <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900 flex flex-col items-center justify-center">
                                            <span className="text-[10px] uppercase font-bold text-blue-600">2. Diajukan</span>
                                            <span className="text-xl font-black text-blue-700 dark:text-blue-400 mt-0.5">
                                                {roleData.status_counts?.diajukan ?? 0}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">Menunggu Validator</span>
                                        </div>

                                        <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-lg border border-indigo-200 dark:border-indigo-900 flex flex-col items-center justify-center">
                                            <span className="text-[10px] uppercase font-bold text-indigo-600">3. Divalidasi</span>
                                            <span className="text-xl font-black text-indigo-700 dark:text-indigo-400 mt-0.5">
                                                {roleData.status_counts?.divalidasi ?? 0}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">Pendamping</span>
                                        </div>

                                        <div className={`p-3 rounded-lg border flex flex-col items-center justify-center ${(roleData.status_counts?.revisi ?? 0) > 0 ? 'bg-destructive/10 border-destructive/30' : 'bg-muted/40'}`}>
                                            <span className="text-[10px] uppercase font-bold text-destructive">4a. Revisi</span>
                                            <span className={`text-xl font-black mt-0.5 ${(roleData.status_counts?.revisi ?? 0) > 0 ? 'text-destructive' : 'text-foreground'}`}>
                                                {roleData.status_counts?.revisi ?? 0}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">Perlu Perbaikan</span>
                                        </div>

                                        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 flex flex-col items-center justify-center">
                                            <span className="text-[10px] uppercase font-bold text-primary">4b. Disetujui</span>
                                            <span className="text-xl font-black text-primary mt-0.5">
                                                {roleData.status_counts?.disetujui ?? 0}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">Lolos Pendamping</span>
                                        </div>

                                        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 flex flex-col items-center justify-center">
                                            <span className="text-[10px] uppercase font-bold text-primary">5. Disahkan OPD</span>
                                            <span className="text-xl font-black text-primary mt-0.5">
                                                {roleData.status_counts?.disahkan_opd ?? 0}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">Verifikator OPD</span>
                                        </div>

                                        <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900 flex flex-col items-center justify-center">
                                            <span className="text-[10px] uppercase font-bold text-purple-600">6. Review</span>
                                            <span className="text-xl font-black text-purple-700 dark:text-purple-400 mt-0.5">
                                                {roleData.status_counts?.review_internal ?? 0}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">Tim Penilai</span>
                                        </div>

                                        <div className="p-3 bg-primary/15 rounded-lg border border-primary/30 flex flex-col items-center justify-center">
                                            <span className="text-[10px] uppercase font-bold text-primary">7-8. Siap Kirim</span>
                                            <span className="text-xl font-black text-primary mt-0.5">
                                                {(roleData.status_counts?.siap_kirim ?? 0) + (roleData.status_counts?.terkirim ?? 0)}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">Kemendagri</span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-muted/30 rounded-lg border text-xs text-muted-foreground flex items-center gap-2 mt-2">
                                        <Info className="h-4 w-4 text-primary shrink-0" />
                                        <span>
                                            Setelah inovasi berstatus <strong>Disetujui</strong>, Verifikator OPD akan melakukan pengesahan sebelum dinilai oleh Tim Penilai Bappeda.
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
                                                className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-colors ${item.is_current
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
                    </>
                )}

                {/* ======================================================== */}
                {/* ROLE: PENDAMPING                                         */}
                {/* ======================================================== */}
                {userRole === 'pendamping' && (
                    <>
                        {/* Pendamping Specific KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="border-border bg-card shadow-xs">
                                <CardHeader className="py-3 px-4 pb-2">
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Antrean Diajukan</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-3xl font-black text-primary">{roleData.needs_review ?? 0}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Membutuhkan verifikasi segera</p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-xs">
                                <CardHeader className="py-3 px-4 pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Dalam Revisi</CardTitle>
                                    {(roleData.in_revisi ?? 0) > 0 && (
                                        <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                                    )}
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className={`text-3xl font-black ${(roleData.in_revisi ?? 0) > 0 ? 'text-destructive' : 'text-foreground'}`}>
                                        {roleData.in_revisi ?? 0}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Menunggu pembaruan dari inovator</p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-xs">
                                <CardHeader className="py-3 px-4 pb-2">
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Selesai Divalidasi</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-3xl font-black text-primary">{roleData.verified_count ?? 0}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Telah disetujui / disahkan OPD</p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-xs">
                                <CardHeader className="py-3 px-4 pb-2">
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Total Dalam Binaan</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-3xl font-black text-foreground">{roleData.total_assigned ?? 0}</div>
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
                                    <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                                        <Link href="/pendamping">Buka Halaman Verifikasi Full</Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {!roleData.pending_list || roleData.pending_list.length === 0 ? (
                                    <p className="text-xs text-muted-foreground py-4 text-center">Tidak ada antrean verifikasi saat ini. Pekerjaan Anda selesai!</p>
                                ) : (
                                    <div className="space-y-3">
                                        {roleData.pending_list.map((item: any) => (
                                            <div key={item.id} className="p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors flex items-center justify-between gap-4">
                                                <div>
                                                    <div className="font-bold text-xs text-foreground">{item.nama_inovasi}</div>
                                                    <div className="text-[11px] text-muted-foreground mt-0.5">{item.opd_nama} • Diajukan: {item.created_at}</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={item.status === 'diajukan' ? 'default' : 'outline'} className="text-[10px] uppercase">
                                                        {statusLabel[item.status] ?? item.status}
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
                    </>
                )}

                {/* ======================================================== */}
                {/* ROLE: PIMPINAN (EXECUTIVE READ-ONLY)                     */}
                {/* ======================================================== */}
                {userRole === 'pimpinan' && (
                    <>
                        {/* Executive KPI Header Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="border-border bg-card shadow-xs">
                                <CardHeader className="py-3 px-4 pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Skor IID Sumbawa</CardTitle>
                                    <Award className="h-5 w-5 text-primary" />
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-3xl font-black text-primary">{summary.iid_score.toFixed(2)}</div>
                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-bold border ${summary.kategori_iga.bg}`}>
                                        {summary.kategori_iga.label}
                                    </span>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-xs">
                                <CardHeader className="py-3 px-4 pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Kelayakan Yandas</CardTitle>
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
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Inovasi Siap IGA</CardTitle>
                                    <FileCheck className="h-5 w-5 text-primary" />
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-3xl font-black text-primary">{summary.siap_kirim_count}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Inovasi siap diekspor ke Kemendagri</p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-xs">
                                <CardHeader className="py-3 px-4 pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">OPD Pengusul Aktif</CardTitle>
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
                                    <CardDescription className="text-xs">Jumlah inovasi terdaftar berdasarkan Urusan Utama.</CardDescription>
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
                                    <CardDescription className="text-xs">Proporsi Inisiatif, Uji Coba, & Penerapan Resmi.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ModernDonutChart items={tahapanDonutItems} totalLabel="Total Usulan" />
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}

                {/* ======================================================== */}
                {/* ROLE: TIM PENILAI / ADMIN Bappeda (MACRO FULL)         */}
                {/* ======================================================== */}
                {userRole === 'tim_penilai' && (
                    <>
                        {/* Macro KPI Metric Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="border-border bg-card shadow-xs">
                                <CardHeader className="py-3 px-4 pb-2">
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Estimasi Skor IID Sumbawa</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-3xl font-black text-primary">{summary.iid_score.toFixed(2)}</div>
                                    <div className="mt-2">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${summary.kategori_iga.bg}`}>
                                            {summary.kategori_iga.label}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-xs">
                                <CardHeader className="py-3 px-4 pb-2">
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Total Inovasi Terdaftar</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-3xl font-bold text-foreground">{summary.total_inovasi}</div>
                                    <p className="text-xs text-muted-foreground mt-1.5">
                                        Usulan periode berjalan
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-xs">
                                <CardHeader className="py-3 px-4 pb-2">
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Siap Kirim (Kemendagri)</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-3xl font-bold text-primary">{summary.siap_kirim_count}</div>
                                    <p className="text-xs text-muted-foreground mt-1.5">
                                        Siap diekspor ke sistem pusat
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card shadow-xs">
                                <CardHeader className="py-3 px-4 pb-2">
                                    <CardTitle className="text-xs font-bold text-muted-foreground uppercase">OPD Pengusul Aktif</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className="text-3xl font-bold text-foreground">{summary.opd_aktif_count}</div>
                                    <p className="text-xs text-muted-foreground mt-1.5">
                                        Perangkat Daerah terdaftar
                                    </p>
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
                                    <CardDescription className="text-xs">Visualisasi bar chart sektor terbanyak Kabupaten Sumbawa.</CardDescription>
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
                                        <Link href="/simulasi" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                                            Lihat Full <ArrowUpRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3 p-4 pt-0">
                                    {topOpd.length === 0 ? (
                                        <p className="text-xs text-muted-foreground">Belum ada data peringkat OPD.</p>
                                    ) : (
                                        topOpd.map((opd, idx) => (
                                            <div key={opd.id} className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Badge className="bg-primary text-primary-foreground font-bold text-xs h-7 w-7 rounded-md p-0 flex items-center justify-center">
                                                        #{idx + 1}
                                                    </Badge>
                                                    <div>
                                                        <div className="font-semibold text-xs text-foreground leading-tight">{opd.nama}</div>
                                                        <div className="text-[11px] text-muted-foreground mt-0.5">{opd.approved_count} Inovasi Disetujui</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-bold text-primary block">{opd.avg_skor.toFixed(2)}</span>
                                                    <span className="text-[10px] text-muted-foreground">Rata-Rata Skor</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}

                {/* 3. Monitoring 8 Status Steps Indicator Bar (Visible to Pimpinan & Tim Penilai) */}
                {(userRole === 'tim_penilai' || userRole === 'pimpinan') && (
                    <Card className="border shadow-xs">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-primary" />
                                    Monitoring 8 Alur Status Inovasi (TOR §5)
                                </CardTitle>
                                <Link href="/inovasi" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                                    Lihat Semua Inovasi <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                                {Object.entries(statusCounts).map(([statusKey, count]) => (
                                    <div key={statusKey} className="p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors text-center">
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground block truncate">
                                            {statusLabel[statusKey] ?? statusKey}
                                        </span>
                                        <span className="text-xl font-black text-foreground block mt-1">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* 4. Recent Audit Trail Log (All Roles View filtered by scope) */}
                <Card className="border shadow-xs">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Audit Trail & Log Validasi Terbaru
                        </CardTitle>
                        <CardDescription className="text-xs">Catatan transisi status dan verifikasi berjenjang INOVA-HUB.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 p-4 pt-0">
                        {recentLogs.length === 0 ? (
                            <p className="text-xs text-muted-foreground">Belum ada riwayat aktivitas validasi.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {recentLogs.map((log) => (
                                    <div key={log.id} className="p-3 rounded-md border-l-4 border-primary bg-muted/20 text-xs space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-foreground">{log.user_nama}</span>
                                            <span className="text-[10px] text-muted-foreground">{log.created_at}</span>
                                        </div>
                                        <div className="text-muted-foreground truncate font-medium">{log.inovasi_nama}</div>
                                        <div className="text-[11px] flex items-center gap-1">
                                            <Badge variant="outline" className="text-[10px]">{log.status_sebelum}</Badge>
                                            <span>→</span>
                                            <Badge variant="secondary" className="text-[10px] font-bold">{log.status_sesudah}</Badge>
                                        </div>
                                        {log.catatan && <p className="text-[11px] text-muted-foreground italic">"{log.catatan}"</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
