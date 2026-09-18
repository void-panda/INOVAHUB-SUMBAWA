import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Award,
    CheckCircle2,
    Clock,
    Eye,
    FileEdit,
    FileText,
    Info,
    Layers,
    Plus,
    Printer,
    Send,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { HeroBanner } from '@/components/hero-banner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { CountdownTimer, type CountdownData } from '@/components/countdown-timer';
import type { BreadcrumbItem } from '@/types';
import type { Auth } from '@/types/auth';
import type { Inovasi } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inovasi Saya', href: '/inovasi' },
];

const tahapanBadgeMap: Record<
    string,
    { label: string; className: string }
> = {
    penerapan: {
        label: 'Penerapan',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 font-medium',
    },
    ujicoba: {
        label: 'Uji Coba',
        className: 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-400',
    },
    inisiatif: {
        label: 'Inisiatif Baru',
        className: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400',
    },
};

export default function InovasiIndex({
    inovasi,
    countdown,
}: {
    inovasi: Inovasi[];
    countdown?: CountdownData | null;
}) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const [activeTahapanFilter, setActiveTahapanFilter] = useState<'semua' | 'penerapan' | 'ujicoba' | 'inisiatif'>('semua');
    const [selectedInovasiForLomba, setSelectedInovasiForLomba] = useState<Inovasi | null>(null);
    const [isLombaModalOpen, setIsLombaModalOpen] = useState(false);
    const [isSubmittingLomba, setIsSubmittingLomba] = useState(false);

    // Modal Hapus Draft Inovasi
    const [inovasiToDelete, setInovasiToDelete] = useState<Inovasi | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Metrik ringkasan portofolio inovasi
    const totalInovasi = inovasi.length;
    const penerapanCount = inovasi.filter((i) => i.tahapan === 'penerapan').length;
    const ujicobaCount = inovasi.filter((i) => i.tahapan === 'ujicoba').length;
    const inisiatifCount = inovasi.filter((i) => i.tahapan === 'inisiatif').length;

    // Filter berdasarkan tahapan
    const filteredInovasi = inovasi.filter((i) => {
        if (activeTahapanFilter === 'semua') return true;
        return i.tahapan === activeTahapanFilter;
    });

    const handleAjukanLomba = (item: Inovasi) => {
        if (countdown && !countdown.is_open) {
            alert(
                countdown.status === 'closed'
                    ? `Masa pendaftaran lomba inovasi periode ${countdown.periode_tahun} telah ditutup pada ${countdown.selesai}.`
                    : `Masa pendaftaran lomba inovasi periode ${countdown.periode_tahun} baru akan dibuka pada ${countdown.mulai}.`
            );
            return;
        }
        setSelectedInovasiForLomba(item);
        setIsLombaModalOpen(true);
    };

    const submitKeLomba = () => {
        if (!selectedInovasiForLomba) return;
        setIsSubmittingLomba(true);
        router.post(
            '/pengajuan-lomba',
            { inovasi_id: selectedInovasiForLomba.id },
            {
                onFinish: () => {
                    setIsSubmittingLomba(false);
                    setIsLombaModalOpen(false);
                    setSelectedInovasiForLomba(null);
                },
            }
        );
    };

    const confirmDeleteInovasi = (item: Inovasi) => {
        setInovasiToDelete(item);
    };

    const handleDeleteInovasi = () => {
        if (!inovasiToDelete) return;
        setIsDeleting(true);
        router.delete(`/inovasi/${inovasiToDelete.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setInovasiToDelete(null);
            },
        });
    };

    const columns: Column<Inovasi>[] = [
        {
            header: 'Nama Inovasi',
            accessorKey: 'nama_inovasi',
            sortable: true,
            cell: (row) => (
                <div className="space-y-1.5 py-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground text-sm leading-snug">
                            {row.nama_inovasi}
                        </span>
                        <Badge
                            variant="secondary"
                            className="text-[11px] text-muted-foreground font-normal shrink-0"
                        >
                            Inovasi Saya
                        </Badge>
                    </div>
                    <div className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <span>ID: #{row.id}</span>
                        <span>•</span>
                        <span>Inisiator: <strong className="text-foreground/80 font-medium">{row.nama_inisiator || '-'}</strong></span>
                        <span>•</span>
                        <span>Penerapan: {row.waktu_penerapan ? row.waktu_penerapan.slice(0, 10) : '-'}</span>
                    </div>
                </div>
            ),
        },
        {
            header: 'Tahapan',
            accessorKey: 'tahapan',
            sortable: true,
            cell: (row) => {
                const badge = tahapanBadgeMap[row.tahapan] ?? {
                    label: row.tahapan,
                    className: 'bg-muted text-muted-foreground',
                };
                return (
                    <Badge variant="outline" className={`text-xs gap-1 ${badge.className}`}>
                        {row.tahapan === 'penerapan' && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                        {badge.label}
                    </Badge>
                );
            },
        },
        {
            header: 'Urusan & Bentuk',
            accessorKey: 'urusan_utama',
            sortable: true,
            cell: (row) => (
                <div className="space-y-1 text-xs">
                    <span className="font-medium text-foreground block max-w-[200px] truncate" title={row.urusan_utama ?? '-'}>
                        {row.urusan_utama ?? '-'}
                    </span>
                    <span className="text-[11px] text-muted-foreground capitalize block">
                        {row.bentuk_inovasi ? row.bentuk_inovasi.replace(/_/g, ' ') : 'Pelayanan Publik'}
                    </span>
                </div>
            ),
        },
        {
            header: 'Status Pengajuan',
            cell: (row) => {
                const activePengajuan = row.pengajuan_lomba?.find((p) => p.periode_lomba?.aktif && !p.is_arsip);
                if (!activePengajuan) {
                    return (
                        <Badge variant="secondary" className="text-[11px] text-muted-foreground font-normal">
                            Belum Diajukan
                        </Badge>
                    );
                }
                return (
                    <div className="space-y-1">
                        <Badge variant="outline" className="text-[11px] border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/20 font-semibold">
                            Telah Disubmit
                        </Badge>
                        <div className="text-[10px] text-muted-foreground">
                            Periode {activePengajuan.periode_lomba?.tahun}
                        </div>
                    </div>
                );
            },
        },
        {
            header: 'Dokumen',
            align: 'center',
            cell: (row) => (
                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${(row.dokumen?.length ?? 0) > 0
                            ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400'
                            : 'bg-muted text-muted-foreground'
                        }`}
                    title={`${row.dokumen?.length ?? 0} berkas dokumen profil tersimpan`}
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

                return (
                    <div className="flex items-center justify-end gap-1.5">
                        {/* Tombol Ajukan Lomba jika belum terdaftar */}
                        {!activePengajuan && (
                            countdown && !countdown.is_open ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled
                                    className="h-8 px-2.5 text-xs gap-1.5 opacity-60 cursor-not-allowed bg-muted text-muted-foreground"
                                    title={countdown.status === 'closed' ? `Pendaftaran ditutup pada ${countdown.selesai}` : `Pendaftaran dibuka pada ${countdown.mulai}`}
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    <span>{countdown.status === 'closed' ? 'Lomba Ditutup' : 'Belum Dibuka'}</span>
                                </Button>
                            ) : (
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="h-8 px-2.5 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer"
                                    onClick={() => handleAjukanLomba(row)}
                                    title="Ajukan inovasi ini untuk dinilai oleh Tim Penilai / Juri"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    <span>Submit Lomba</span>
                                </Button>
                            )
                        )}

                        {/* Tombol Aksi: Lihat Detail jika telah disubmit, Edit jika masih draft */}
                        {activePengajuan ? (
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-8 px-2.5 text-xs gap-1 text-muted-foreground hover:text-foreground hover:bg-accent border-border"
                                title="Lihat detail profil inovasi (mode baca saja)"
                            >
                                <Link href={`/inovasi/${row.id}/edit`}>
                                    <Eye className="h-3.5 w-3.5" />
                                    <span>Lihat Detail</span>
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-8 px-2.5 text-xs gap-1"
                                title="Ubah profil inovasi"
                            >
                                <Link href={`/inovasi/${row.id}/edit`}>
                                    <FileEdit className="h-3.5 w-3.5" />
                                    <span>Edit</span>
                                </Link>
                            </Button>
                        )}

                        {/* Tombol Cetak Profil */}
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            title="Cetak lembar profil inovasi"
                        >
                            <a href={`/inovasi/${row.id}/print`} target="_blank" rel="noopener noreferrer">
                                <Printer className="h-3.5 w-3.5" />
                            </a>
                        </Button>

                        {/* Tombol Hapus Draft jika belum diajukan */}
                        {!activePengajuan && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => confirmDeleteInovasi(row)}
                                title="Hapus draf inovasi ini"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Head title="Inovasi Saya" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
                {/* Hero Banner INOVA-HUB */}
                <HeroBanner
                    badgeIcon={Layers}
                    badgeText="Repositori Bank Data"
                    title="Inovasi Saya"
                    description="Kelola seluruh ide, inisiatif, dan penerapan inovasi sebelum diusulkan menjadi Inovasi Daerah resmi Kabupaten Sumbawa."
                    variant="teal"
                >
                    <div className="flex items-center gap-2.5 flex-wrap">
                        {countdown && (
                            <CountdownTimer countdown={countdown} variant="banner" />
                        )}

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

                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-white border-emerald-400/40 rounded-xl h-9 text-xs font-semibold shadow-xs"
                        >
                            <Link href="/inovasi-daerah">
                                <Award className="h-3.5 w-3.5 mr-1 text-emerald-300" /> Buka Inovasi Daerah
                            </Link>
                        </Button>
                    </div>
                </HeroBanner>

                {/* 4 Metric Cards Inovasi Saya */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <Card
                        className={`cursor-pointer transition-all border shadow-xs ${activeTahapanFilter === 'semua'
                                ? 'border-primary/50 bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/20'
                                : 'hover:border-border/80 bg-card'
                            }`}
                        onClick={() => setActiveTahapanFilter('semua')}
                    >
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Total Inovasi Saya
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                    {totalInovasi}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                <Layers className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer transition-all border shadow-xs ${activeTahapanFilter === 'penerapan'
                                ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500/20'
                                : 'hover:border-border/80 bg-card'
                            }`}
                        onClick={() => setActiveTahapanFilter('penerapan')}
                    >
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Tahap Penerapan
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {penerapanCount}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer transition-all border shadow-xs ${activeTahapanFilter === 'ujicoba'
                                ? 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-500/20'
                                : 'hover:border-border/80 bg-card'
                            }`}
                        onClick={() => setActiveTahapanFilter('ujicoba')}
                    >
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Tahap Uji Coba
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                                    {ujicobaCount}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                                <Clock className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer transition-all border shadow-xs ${activeTahapanFilter === 'inisiatif'
                                ? 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-500/20'
                                : 'hover:border-border/80 bg-card'
                            }`}
                        onClick={() => setActiveTahapanFilter('inisiatif')}
                    >
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Tahap Inisiatif
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                    {inisiatifCount}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                                <Info className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Info Notice Box */}
                <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-50/30 dark:bg-teal-950/20 text-xs text-muted-foreground flex items-start gap-3">
                    <Info className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                        <strong className="text-foreground">Catatan Alur Penetapan Inovasi Daerah:</strong> Inovasi pada daftar ini berstatus <em>Inovasi Saya</em> (belum ditetapkan sebagai Inovasi Daerah). Untuk mengikutsertakan inovasi ke kompetisi IGA dan membuka lembar kerja 20 Indikator SID, klik tombol <strong>"Ajukan Seleksi"</strong>. Tim Penilai / BAPPERIDA akan memverifikasi dan menetapkannya sebagai <strong>Inovasi Daerah</strong>, dan inovasi akan berpindah ke menu <Link href="/inovasi-daerah" className="text-teal-700 dark:text-teal-400 font-semibold underline">Inovasi Daerah</Link>.
                    </div>
                </div>

                {/* Filter Tabs & Data Table */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border">
                            {(
                                [
                                    { key: 'semua', label: 'Semua Inovasi', count: totalInovasi },
                                    { key: 'penerapan', label: 'Penerapan', count: penerapanCount },
                                    { key: 'ujicoba', label: 'Uji Coba', count: ujicobaCount },
                                    { key: 'inisiatif', label: 'Inisiatif', count: inisiatifCount },
                                ] as const
                            ).map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTahapanFilter(tab.key)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTahapanFilter === tab.key
                                            ? 'bg-background text-foreground shadow-xs'
                                            : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <span>{tab.label}</span>
                                    <span
                                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTahapanFilter === tab.key
                                                ? 'bg-primary/10 text-primary font-bold'
                                                : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredInovasi}
                        searchable
                        searchPlaceholder="Cari nama inovasi, inisiator, atau urusan..."
                        pageSize={10}
                        emptyMessage="Belum ada data inovasi yang tersimpan."
                    />
                </div>
            </div>

            {/* Modal Dialog Ajukan ke Seleksi Lomba / Penetapan Inovasi Daerah */}
            <Dialog open={isLombaModalOpen} onOpenChange={setIsLombaModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-bold">
                            <Send className="h-5 w-5 text-teal-600" />
                            Ajukan ke Seleksi Inovasi Daerah
                        </DialogTitle>
                        <DialogDescription className="text-xs pt-1">
                            Ajukan inovasi ini ke periode lomba berjalan agar diverifikasi dan ditetapkan sebagai <strong>Inovasi Daerah Kabupaten Sumbawa</strong> oleh Tim Penilai / BAPPERIDA.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedInovasiForLomba && (
                        <div className="space-y-3 py-2 text-xs">
                            <div className="p-3.5 rounded-lg bg-muted/50 border space-y-1.5">
                                <span className="font-bold text-foreground text-sm block">
                                    {selectedInovasiForLomba.nama_inovasi}
                                </span>
                                <div className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                                    <span>Tahapan: <strong className="text-foreground capitalize">{selectedInovasiForLomba.tahapan}</strong></span>
                                    <span>•</span>
                                    <span>Inisiator: <strong className="text-foreground">{selectedInovasiForLomba.nama_inisiator || '-'}</strong></span>
                                </div>
                            </div>

                            <div className="p-3 rounded-lg border border-teal-200 bg-teal-50/50 dark:border-teal-900/50 dark:bg-teal-950/30 text-[11px] text-teal-900 dark:text-teal-200 leading-relaxed">
                                <strong>Ketentuan IGA:</strong> Setelah diajukan, berkas inovasi akan ditinjau oleh Tim Penilai. Jika memenuhi kriteria, statusnya akan ditetapkan menjadi Inovasi Daerah dan Anda dapat melengkapi 20 Indikator SID.
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsLombaModalOpen(false)}
                            disabled={isSubmittingLomba}
                            className="text-xs"
                        >
                            Batal
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold gap-1.5 shadow-xs"
                            onClick={submitKeLomba}
                            disabled={isSubmittingLomba}
                        >
                            <Send className="h-3.5 w-3.5" />
                            {isSubmittingLomba ? 'Mengajukan...' : 'Konfirmasi Ajukan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus Inovasi Draft */}
            <AlertDialog open={!!inovasiToDelete} onOpenChange={(open) => !open && setInovasiToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive flex items-center gap-2">
                            <Trash2 className="h-5 w-5" />
                            Hapus Draf Inovasi?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs leading-relaxed">
                            Apakah Anda yakin ingin menghapus data inovasi <strong>"{inovasiToDelete?.nama_inovasi}"</strong>? Tindakan ini akan menghapus draf profil beserta seluruh lampiran dokumen yang terkait.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting} className="text-xs">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteInovasi}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90 text-white text-xs font-semibold"
                        >
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus Inovasi'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

InovasiIndex.layout = {
    breadcrumbs,
};