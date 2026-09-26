import { Head, Link, router } from '@inertiajs/react';
import {
    Award,
    CheckCircle2,
    Eye,
    Layers,
    Plus,
    Send,
    Trophy,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Column, DataTable } from '@/components/ui/data-table';
import { CountdownTimer, type CountdownData } from '@/components/countdown-timer';
import type { PengajuanLomba, PeriodeLomba } from '@/types/models';

type Props = {
    pengajuan: PengajuanLomba[] | { data: PengajuanLomba[] };
    periodes: PeriodeLomba[];
    activePeriode?: PeriodeLomba | null;
    countdown?: CountdownData | null;
    filters: {
        periode_id?: string;
        is_inovasi_daerah?: string;
        kategori_inovasi?: string;
        search?: string;
    };
};

const KATEGORI_LABELS: Record<string, string> = {
    opd: 'OPD',
    masyarakat: 'Masyarakat',
    mahasiswa: 'Mahasiswa',
    pelajar: 'Pelajar',
};

export default function PengajuanLombaIndex({
    pengajuan,
    periodes,
    activePeriode,
    countdown,
    filters,
}: Props) {
    const rawData = useMemo<PengajuanLomba[]>(() => {
        if (Array.isArray(pengajuan)) {
            return pengajuan;
        }
        return pengajuan?.data ?? [];
    }, [pengajuan]);

    const [selectedPeriode, setSelectedPeriode] = useState(
        filters.periode_id || (activePeriode?.id?.toString() ?? '')
    );
    const [statusTab, setStatusTab] = useState<'semua' | 'submitted' | 'lolos'>('semua');
    const [selectedKategori, setSelectedKategori] = useState(filters.kategori_inovasi || 'all');

    // Filter berdasarkan status tab dan kategori inovasi
    const displayedData = useMemo(() => {
        return rawData.filter((item) => {
            if (statusTab === 'submitted' && item.is_inovasi_daerah) {
                return false;
            }
            if (statusTab === 'lolos' && !item.is_inovasi_daerah) {
                return false;
            }
            if (selectedKategori !== 'all') {
                const itemKat = (item.inovasi?.kategori_inovasi || 'opd').toLowerCase();
                if (itemKat !== selectedKategori) {
                    return false;
                }
            }
            return true;
        });
    }, [rawData, statusTab, selectedKategori]);

    // Metrik ringkasan
    const totalCount = rawData.length;
    const submittedCount = rawData.filter((item) => !item.is_inovasi_daerah).length;
    const lolosCount = rawData.filter((item) => item.is_inovasi_daerah).length;

    const handlePeriodeChange = (periodeId: string) => {
        setSelectedPeriode(periodeId);
        router.get(
            '/superadmin/pengajuan-lomba',
            periodeId ? { periode_id: periodeId } : {},
            { preserveState: true, replace: true }
        );
    };

    const columns: Column<PengajuanLomba>[] = [
        {
            header: 'Nama Inovasi & Inisiator',
            sortable: true,
            cell: (row) => {
                const inovasi = row.inovasi;
                const kategoriKey = (inovasi?.kategori_inovasi || 'opd').toLowerCase();
                const katLabel = KATEGORI_LABELS[kategoriKey] || inovasi?.kategori_inovasi || 'OPD';

                return (
                    <div className="space-y-1 py-1">
                        <div className="font-semibold text-xs text-foreground flex items-center gap-2 flex-wrap">
                            <span>{inovasi?.nama_inovasi}</span>
                            <Badge variant="secondary" className="text-[10px] uppercase font-medium tracking-wide">
                                {katLabel}
                            </Badge>
                            {row.is_inovasi_daerah && (
                                <Badge
                                    variant="outline"
                                    className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] gap-1"
                                >
                                    <Award className="h-2.5 w-2.5 text-emerald-600" />
                                    Inovasi Daerah
                                </Badge>
                            )}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                            {inovasi?.opd?.nama ?? inovasi?.user?.nama_pemda ?? 'Inisiator Publik'} • Inisiator: {inovasi?.nama_inisiator}
                        </div>
                    </div>
                );
            },
        },
        {
            header: 'Periode Lomba',
            align: 'left',
            cell: (row) => (
                <div className="text-xs space-y-0.5">
                    <div className="font-medium text-foreground">
                        {row.periode_lomba?.tahun ?? '-'}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                        {row.is_arsip ? 'Arsip Lomba' : 'Periode Aktif'}
                    </div>
                </div>
            ),
        },
        {
            header: 'Status Seleksi',
            align: 'left',
            cell: (row) => (
                row.is_inovasi_daerah ? (
                    <Badge
                        variant="outline"
                        className="border-emerald-500/50 text-emerald-700 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/30 font-bold gap-1 text-[11px]"
                    >
                        <Trophy className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Lolos Seleksi</span>
                    </Badge>
                ) : (
                    <Badge
                        variant="outline"
                        className="border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/20 font-semibold gap-1 text-[11px]"
                    >
                        <CheckCircle2 className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                        <span>Telah Disubmit</span>
                    </Badge>
                )
            ),
        },
        {
            header: 'Aksi',
            align: 'right',
            cell: (row) => (
                <div className="flex items-center justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-7 px-3 text-xs gap-1.5 font-medium shadow-2xs hover:bg-accent"
                        title="Lihat Lembar Pengajuan Lomba"
                    >
                        <Link href={`/superadmin/pengajuan-lomba/${row.id}`}>
                            <Eye className="h-3.5 w-3.5" />
                            <span>Detail</span>
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Pengajuan Lomba Inovasi Daerah - INOVA-HUB Sumbawa" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
                {/* Hero Banner Sumbawa */}
                <HeroBanner
                    title="Pengajuan Lomba Inovasi Daerah"
                    description="Daftar usulan inovasi yang didaftarkan ke ajang Lomba Inovasi Daerah Kabupaten Sumbawa. Pantau proses penjurian dan penetapan hasil seleksi."
                    badgeText={`Kompetisi Lomba ${activePeriode?.tahun ?? '2026'}`}
                    badgeIcon={Trophy}
                >
                    {countdown && (
                        <CountdownTimer countdown={countdown} variant="banner" />
                    )}
                </HeroBanner>

                {/* Metrik Ringkasan Status Seleksi */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    <Card
                        className={`cursor-pointer transition-all border shadow-xs ${
                            statusTab === 'semua'
                                ? 'border-primary/50 bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/20'
                                : 'hover:border-border/80 bg-card'
                        }`}
                        onClick={() => setStatusTab('semua')}
                    >
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Total Terdaftar Lomba
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                    {totalCount}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                <Layers className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer transition-all border shadow-xs ${
                            statusTab === 'submitted'
                                ? 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-500/20'
                                : 'hover:border-border/80 bg-card'
                        }`}
                        onClick={() => setStatusTab('submitted')}
                    >
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Telah Disubmit (Dalam Penjurian)
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                    {submittedCount}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={`cursor-pointer transition-all border shadow-xs ${
                            statusTab === 'lolos'
                                ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500/20'
                                : 'hover:border-border/80 bg-card'
                        }`}
                        onClick={() => setStatusTab('lolos')}
                    >
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Lolos Seleksi (Inovasi Daerah)
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {lolosCount}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                                <Trophy className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Toolbar Bersih & Terpadu Tepat di Atas DataTable */}
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        {/* Tab Status Seleksi */}
                        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/80 text-xs w-fit">
                            <button
                                type="button"
                                onClick={() => setStatusTab('semua')}
                                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                                    statusTab === 'semua'
                                        ? 'bg-background text-foreground shadow-xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <span>Semua</span>
                                <span
                                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                        statusTab === 'semua'
                                            ? 'bg-primary/10 text-primary font-bold'
                                            : 'bg-muted text-muted-foreground'
                                    }`}
                                >
                                    {totalCount}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusTab('submitted')}
                                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                                    statusTab === 'submitted'
                                        ? 'bg-background text-amber-700 dark:text-amber-300 shadow-xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <span>Telah Disubmit</span>
                                <span
                                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                        statusTab === 'submitted'
                                            ? 'bg-amber-500/10 text-amber-700 font-bold'
                                            : 'bg-muted text-muted-foreground'
                                    }`}
                                >
                                    {submittedCount}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusTab('lolos')}
                                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                                    statusTab === 'lolos'
                                        ? 'bg-background text-emerald-700 dark:text-emerald-300 shadow-xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <span>Lolos Seleksi</span>
                                <span
                                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                        statusTab === 'lolos'
                                            ? 'bg-emerald-500/10 text-emerald-700 font-bold'
                                            : 'bg-muted text-muted-foreground'
                                    }`}
                                >
                                    {lolosCount}
                                </span>
                            </button>
                        </div>

                        {/* Filter Dropdown: Kategori & Periode Lomba */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <select
                                value={selectedKategori}
                                onChange={(e) => setSelectedKategori(e.target.value)}
                                className="h-8 text-xs rounded-lg border border-input bg-background px-2.5 text-foreground cursor-pointer"
                            >
                                <option value="all">Semua Kategori</option>
                                <option value="opd">Kategori OPD</option>
                                <option value="masyarakat">Kategori Masyarakat</option>
                                <option value="mahasiswa">Kategori Mahasiswa</option>
                                <option value="pelajar">Kategori Pelajar</option>
                            </select>

                            <select
                                value={selectedPeriode}
                                onChange={(e) => handlePeriodeChange(e.target.value)}
                                className="h-8 text-xs rounded-lg border border-input bg-background px-2.5 text-foreground cursor-pointer"
                            >
                                <option value="">Semua Periode</option>
                                {periodes.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        Periode {p.tahun} {p.aktif ? '• Aktif' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <DataTable
                        data={displayedData}
                        columns={columns}
                        searchPlaceholder="Cari nama inovasi, inisiator, atau OPD..."
                        searchKey={(row) =>
                            `${row.inovasi?.nama_inovasi ?? ''} ${row.inovasi?.nama_inisiator ?? ''} ${row.inovasi?.opd?.nama ?? ''}`
                        }
                        pageSize={10}
                        emptyTitle="Belum Ada Inovasi yang Diajukan ke Lomba"
                        emptyDescription="Anda belum mendaftarkan usulan inovasi ke Lomba Inovasi Daerah. Daftarkan usulan yang sudah ada dari Bank Inovasi Anda atau buat inovasi baru untuk dilombakan."
                        emptyAction={
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                                <Button asChild variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 shadow-xs text-xs">
                                    <Link href="/inovasi">
                                        <Send className="h-3.5 w-3.5" />
                                        <span>Pilih dari Inovasi Saya</span>
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                                    <Link href="/inovasi/create">
                                        <Plus className="h-3.5 w-3.5" />
                                        <span>Input Inovasi Baru</span>
                                    </Link>
                                </Button>
                            </div>
                        }
                    />
                </div>
            </div>
        </>
    );
}
