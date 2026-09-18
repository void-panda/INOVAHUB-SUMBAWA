import { Head, Link, router } from '@inertiajs/react';
import {
    Award,
    CheckCircle2,
    Clock,
    Eye,
    FileText,
    FolderOpen,
    Info,
    Layers,
    Plus,
    Printer,
    RefreshCw,
    Send,
    Sparkles,
    Trophy,
} from 'lucide-react';
import { useState } from 'react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Column } from '@/components/ui/data-table';
import { DataTable } from '@/components/ui/data-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import type { BreadcrumbItem } from '@/types';
import type { Inovasi, PeriodeLomba } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inovasi Daerah', href: '/inovasi-daerah' },
];

const statusBadgeMap: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }
> = {
    dalam_pendampingan: {
        label: 'Dalam Pendampingan',
        variant: 'outline',
        className: 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20',
    },
    disahkan_opd: {
        label: 'Disahkan OPD',
        variant: 'outline',
        className: 'border-blue-500 text-blue-700 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-950/20',
    },
    review_internal: {
        label: 'Review Internal',
        variant: 'secondary',
        className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300',
    },
    siap_kirim: {
        label: 'Siap Kirim',
        variant: 'default',
        className: 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold',
    },
    terkirim: {
        label: 'Terkirim',
        variant: 'default',
        className: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    // legacy
    draft: { label: 'Draft', variant: 'secondary' },
    diajukan: { label: 'Diajukan', variant: 'default' },
    divalidasi: { label: 'Divalidasi', variant: 'secondary' },
    revisi: { label: 'Perlu Revisi', variant: 'destructive' },
    disetujui: { label: 'Disetujui', variant: 'outline' },
};

type Props = {
    inovasi: Inovasi[];
    periode?: PeriodeLomba | null;
};

export default function InovasiDaerahPage({ inovasi, periode }: Props) {
    const [activeTab, setActiveTab] = useState<'aktif' | 'arsip' | 'semua'>('aktif');

    // State untuk Ajukan Kembali dari Arsip
    const [selectedArsipInovasi, setSelectedArsipInovasi] = useState<Inovasi | null>(null);
    const [isAjukanKembaliModalOpen, setIsAjukanKembaliModalOpen] = useState(false);
    const [penjelasanPengembangan, setPenjelasanPengembangan] = useState('');
    const [isSubmittingAjukanKembali, setIsSubmittingAjukanKembali] = useState(false);

    // Filter daftar inovasi
    const inovasiAktif = inovasi.filter((item) =>
        item.pengajuan_lomba?.some((p) => p.periode_lomba?.aktif && !p.is_arsip)
    );

    const inovasiArsip = inovasi.filter((item) =>
        item.pengajuan_lomba?.some((p) => p.is_arsip || !p.periode_lomba?.aktif) &&
        !item.pengajuan_lomba?.some((p) => p.periode_lomba?.aktif && !p.is_arsip)
    );

    const displayedInovasi =
        activeTab === 'aktif'
            ? inovasiAktif
            : activeTab === 'arsip'
                ? inovasiArsip
                : inovasi;

    // Metrik ringkasan
    const totalDaerah = inovasi.length;
    const totalAktif = inovasiAktif.length;

    // Rata-rata skor kematangan
    const scores = inovasi
        .map((i) => {
            const p = i.pengajuan_lomba?.find((pl) => pl.periode_lomba?.aktif && !pl.is_arsip);
            return p?.estimasi_skor_kematangan ?? null;
        })
        .filter((s): s is number => s !== null && !isNaN(s));

    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    const siapKirimCount = inovasi.filter((item) =>
        item.pengajuan_lomba?.some(
            (p) => (p.status === 'siap_kirim' || p.status === 'terkirim') && p.periode_lomba?.aktif && !p.is_arsip
        )
    ).length;

    const handleOpenAjukanKembali = (item: Inovasi) => {
        setSelectedArsipInovasi(item);
        setPenjelasanPengembangan('');
        setIsAjukanKembaliModalOpen(true);
    };

    const submitAjukanKembali = () => {
        if (!selectedArsipInovasi) return;
        const lastPengajuan = selectedArsipInovasi.pengajuan_lomba?.[0];
        if (!lastPengajuan) return;

        setIsSubmittingAjukanKembali(true);
        router.post(
            `/pengajuan-lomba/${lastPengajuan.id}/ajukan-kembali`,
            { penjelasan_pengembangan: penjelasanPengembangan.trim() },
            {
                onFinish: () => {
                    setIsSubmittingAjukanKembali(false);
                    setIsAjukanKembaliModalOpen(false);
                    setSelectedArsipInovasi(null);
                },
            }
        );
    };

    const columns: Column<Inovasi>[] = [
        {
            header: 'Nama Inovasi',
            accessorKey: 'nama_inovasi',
            sortable: true,
            cell: (row) => {
                const activePengajuan = row.pengajuan_lomba?.find((p) => p.periode_lomba?.aktif && !p.is_arsip);
                const lastPengajuan = row.pengajuan_lomba?.[0];
                const pengajuan = activePengajuan ?? lastPengajuan;

                return (
                    <div className="space-y-1.5 py-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-foreground text-sm leading-snug">
                                {row.nama_inovasi}
                            </span>
                            <Badge
                                variant="outline"
                                className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 text-[11px] gap-1 font-semibold shrink-0"
                            >
                                <Award className="h-3 w-3 text-emerald-600" />
                                Inovasi Daerah
                            </Badge>
                        </div>
                        <div className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <span>ID: #{row.id}</span>
                            <span>•</span>
                            <span>Inisiator: <strong className="text-foreground/80 font-medium">{row.nama_inisiator || '-'}</strong></span>
                            <span>•</span>
                            <span>Urusan: {row.urusan_utama || '-'}</span>
                            {pengajuan?.periode_lomba && (
                                <>
                                    <span>•</span>
                                    <span className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-400 font-medium">
                                        <Trophy className="h-3 w-3 text-teal-600" />
                                        IGA {pengajuan.periode_lomba.tahun}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            header: 'Status Validasi',
            cell: (row) => {
                const activePengajuan = row.pengajuan_lomba?.find((p) => p.periode_lomba?.aktif && !p.is_arsip);
                const lastPengajuan = row.pengajuan_lomba?.[0];
                const pengajuan = activePengajuan ?? lastPengajuan;

                if (!pengajuan) {
                    return (
                        <Badge variant="secondary" className="text-[11px] text-muted-foreground">
                            Belum Ada Periode
                        </Badge>
                    );
                }

                if (pengajuan.is_arsip) {
                    return (
                        <Badge variant="secondary" className="text-[11px] bg-muted/80 text-muted-foreground">
                            Arsip Periode {pengajuan.periode_lomba?.tahun}
                        </Badge>
                    );
                }

                const badge = statusBadgeMap[pengajuan.status] ?? {
                    label: pengajuan.status,
                    className: 'bg-muted text-foreground',
                };

                return (
                    <div className="space-y-1">
                        <Badge variant={badge.variant ?? 'outline'} className={`text-[11px] ${badge.className}`}>
                            {badge.label}
                        </Badge>
                        <div className="text-[10px] text-muted-foreground">
                            Tahun {pengajuan.periode_lomba?.tahun}
                        </div>
                    </div>
                );
            },
        },
        {
            header: 'Progres 20 Indikator SID',
            cell: (row) => {
                const activePengajuan = row.pengajuan_lomba?.find((p) => p.periode_lomba?.aktif && !p.is_arsip);
                const lastPengajuan = row.pengajuan_lomba?.[0];
                const pengajuan = activePengajuan ?? lastPengajuan;

                if (!pengajuan) {
                    return <span className="text-xs text-muted-foreground">-</span>;
                }

                const filledCount = pengajuan.kelengkapan_indikator?.filter((k) => k.parameter !== null).length ?? 0;
                const totalIndikator = 20;
                const percentage = Math.round((filledCount / totalIndikator) * 100);

                return (
                    <div className="w-[150px] space-y-1.5">
                        <div className="flex justify-between text-xs">
                            <span className="text-[11px] font-medium text-foreground">
                                {filledCount} / {totalIndikator} SID
                            </span>
                            <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">
                                {percentage}%
                            </span>
                        </div>
                        <Progress value={percentage} className="h-1.5 bg-muted" />
                    </div>
                );
            },
        },
        {
            header: 'Skor Kematangan',
            align: 'center',
            cell: (row) => {
                const activePengajuan = row.pengajuan_lomba?.find((p) => p.periode_lomba?.aktif && !p.is_arsip);
                const lastPengajuan = row.pengajuan_lomba?.[0];
                const pengajuan = activePengajuan ?? lastPengajuan;
                const score = pengajuan?.estimasi_skor_kematangan;

                if (score === undefined || score === null) {
                    return (
                        <span className="text-xs text-muted-foreground italic">Belum Dihitung</span>
                    );
                }

                const numScore = Number(score);
                const scoreColor =
                    numScore >= 80
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : numScore >= 50
                            ? 'bg-teal-50 text-teal-800 border-teal-300 dark:bg-teal-950/40 dark:text-teal-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300';

                return (
                    <div className="flex flex-col items-center gap-0.5">
                        <Badge variant="outline" className={`font-bold text-xs px-2 py-0.5 ${scoreColor}`}>
                            <Sparkles className="h-3 w-3 mr-1 text-emerald-600 dark:text-emerald-400" />
                            {numScore.toFixed(2)}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">Maks: 111.00</span>
                    </div>
                );
            },
        },
        {
            header: 'Berkas Profil',
            align: 'center',
            cell: (row) => (
                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${(row.dokumen?.length ?? 0) > 0
                            ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400'
                            : 'bg-muted text-muted-foreground'
                        }`}
                    title={`${row.dokumen?.length ?? 0} berkas dokumen umum tersimpan`}
                >
                    <FileText className="h-3.5 w-3.5" />
                    {row.dokumen?.length ?? 0}
                </span>
            ),
        },
        {
            header: 'Aksi',
            align: 'right',
            cell: (row) => {
                const activePengajuan = row.pengajuan_lomba?.find((p) => p.periode_lomba?.aktif && !p.is_arsip);
                const lastPengajuan = row.pengajuan_lomba?.[0];

                return (
                    <div className="flex items-center justify-end gap-1.5">
                        {/* Tombol Utama: Buka 20 Indikator SID */}
                        {activePengajuan && (
                            <Button
                                variant="default"
                                size="sm"
                                asChild
                                className="h-8 px-3 text-xs gap-1.5 bg-teal-600 hover:bg-teal-700 text-white shadow-xs font-semibold"
                                title="Buka lembar kerja 20 Indikator SID untuk melengkapi data & parameter"
                            >
                                <Link href={`/pengajuan-lomba/${activePengajuan.id}/indikator`}>
                                    <FolderOpen className="h-3.5 w-3.5" />
                                    <span>20 Indikator</span>
                                </Link>
                            </Button>
                        )}

                        {/* Tombol Alur Pengajuan */}
                        {activePengajuan && (
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-8 px-2.5 text-xs gap-1 text-foreground"
                                title="Pantau riwayat alur validasi & status lomba"
                            >
                                <Link href={`/pengajuan-lomba/${activePengajuan.id}`}>
                                    <Eye className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Alur</span>
                                </Link>
                            </Button>
                        )}

                        {/* Jika arsip: Tombol Ajukan Kembali */}
                        {!activePengajuan && lastPengajuan?.is_arsip && (
                            <Button
                                variant="default"
                                size="sm"
                                className="h-8 px-2.5 text-xs gap-1.5 bg-amber-600 hover:bg-amber-700 text-white shadow-xs font-medium"
                                onClick={() => handleOpenAjukanKembali(row)}
                                title="Ajukan kembali inovasi dari arsip ke periode aktif"
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                <span>Ajukan Kembali</span>
                            </Button>
                        )}

                        {/* Tombol Cetak Profil */}
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            title="Cetak lembar profil inovasi daerah"
                        >
                            <a href={`/inovasi/${row.id}/print`} target="_blank" rel="noopener noreferrer">
                                <Printer className="h-3.5 w-3.5" />
                            </a>
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Inovasi Daerah Kabupaten Sumbawa" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
                {/* Hero Banner INOVA-HUB */}
                <HeroBanner
                    badgeIcon={Award}
                    badgeText="Penjaminan Mutu & Kompetisi IGA"
                    title="Inovasi Daerah Kabupaten Sumbawa"
                    description="Portofolio resmi inovasi yang telah ditetapkan oleh Tim Penilai / BAPPERIDA untuk melengkapi 20 Indikator SID dan berpartisipasi pada Innovative Government Award."
                    variant="teal"
                >
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl h-9 text-xs font-semibold"
                        >
                            <Link href="/inovasi">
                                <Layers className="h-3.5 w-3.5 mr-1" /> Inovasi Saya
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl h-9 text-xs font-semibold"
                        >
                            <a href="/inovasi-daerah/print-rekap" target="_blank" rel="noopener noreferrer">
                                <Printer className="h-3.5 w-3.5 mr-1" /> Export PDF Rekap
                            </a>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl h-9 text-xs font-semibold"
                        >
                            <Link href="/inovasi/create">
                                <Plus className="h-3.5 w-3.5 mr-1" /> Input Inovasi Baru
                            </Link>
                        </Button>
                    </div>
                </HeroBanner>

                {/* 4 Metric Cards Inovasi Daerah */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <Card className="border shadow-xs bg-card">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Total Inovasi Daerah
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                    {totalDaerah}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                                <Award className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-xs bg-card">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Sedang Dilombakan ({periode?.tahun ?? '2026'})
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-teal-600 dark:text-teal-400">
                                    {totalAktif}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600">
                                <Trophy className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-xs bg-card">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Rata-rata Skor Kematangan
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                                    {avgScore.toFixed(2)}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                <Sparkles className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-xs bg-card">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Siap / Terkirim Kemendagri
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {siapKirimCount}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs & Data Table */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border">
                            {(
                                [
                                    { key: 'aktif', label: 'Sedang Dilombakan', count: totalAktif },
                                    { key: 'arsip', label: 'Riwayat / Arsip', count: inovasiArsip.length },
                                    { key: 'semua', label: 'Semua Inovasi Daerah', count: totalDaerah },
                                ] as const
                            ).map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === tab.key
                                            ? 'bg-background text-foreground shadow-xs'
                                            : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <span>{tab.label}</span>
                                    <span
                                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.key
                                                ? 'bg-primary/10 text-primary font-bold'
                                                : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs gap-1.5 font-medium border-border hover:bg-muted"
                        >
                            <a href="/inovasi-daerah/print-rekap" target="_blank" rel="noopener noreferrer">
                                <Printer className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                                <span>Cetak Rekapitulasi PDF</span>
                            </a>
                        </Button>
                    </div>

                    <DataTable
                        columns={columns}
                        data={displayedInovasi}
                        searchable
                        searchPlaceholder="Cari nama inovasi daerah, inisiator, atau urusan..."
                        pageSize={10}
                        emptyMessage={
                            activeTab === 'aktif'
                                ? 'Belum ada inovasi daerah yang sedang didaftarkan pada periode lomba aktif saat ini.'
                                : activeTab === 'arsip'
                                    ? 'Tidak ada arsip inovasi daerah dari periode sebelumnya.'
                                    : 'Belum ada data inovasi yang ditetapkan sebagai Inovasi Daerah.'
                        }
                    />
                </div>
            </div>

            {/* Modal Dialog Ajukan Kembali dari Arsip */}
            <Dialog open={isAjukanKembaliModalOpen} onOpenChange={setIsAjukanKembaliModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-bold">
                            <RefreshCw className="h-5 w-5 text-teal-600" />
                            Ajukan Kembali Inovasi Daerah
                        </DialogTitle>
                        <DialogDescription className="text-xs pt-1">
                            Sesuai regulasi IGA Kemendagri, pengajuan inovasi dari periode sebelumnya ke periode aktif wajib menyertakan <strong>penjelasan pengembangan</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedArsipInovasi && (
                        <div className="space-y-4 py-2 text-xs">
                            <div className="p-3 rounded-lg bg-muted/50 border space-y-1">
                                <span className="font-bold text-foreground text-sm block">
                                    {selectedArsipInovasi.nama_inovasi}
                                </span>
                                <span className="text-muted-foreground block text-[11px]">
                                    Inisiator: {selectedArsipInovasi.nama_inisiator || '-'}
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="penjelasan_pengembangan" className="text-xs font-semibold">
                                    Penjelasan Pengembangan / Peningkatan <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="penjelasan_pengembangan"
                                    rows={4}
                                    value={penjelasanPengembangan}
                                    onChange={(e) => setPenjelasanPengembangan(e.target.value)}
                                    placeholder="Jelaskan fitur baru, peningkatan jangkauan penerima manfaat, efisiensi anggaran, atau integrasi sistem yang telah dikembangkan sejak tahun lalu..."
                                    className="text-xs"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsAjukanKembaliModalOpen(false)}
                            disabled={isSubmittingAjukanKembali}
                            className="text-xs"
                        >
                            Batal
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold gap-1.5 shadow-xs"
                            onClick={submitAjukanKembali}
                            disabled={isSubmittingAjukanKembali || !penjelasanPengembangan.trim()}
                        >
                            <Send className="h-3.5 w-3.5" />
                            {isSubmittingAjukanKembali ? 'Mengajukan...' : 'Konfirmasi Ajukan Kembali'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

InovasiDaerahPage.layout = {
    breadcrumbs,
};
