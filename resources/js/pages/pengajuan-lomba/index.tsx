import { Head, Link, router } from '@inertiajs/react';
import {
    Award,
    Eye,
    FileText,
    Filter,
    FolderOpen,
    Search,
    Send,
} from 'lucide-react';
import { useState } from 'react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { PengajuanLomba, PeriodeLomba } from '@/types/models';

type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    pengajuan: PaginatedData<PengajuanLomba>;
    periodes: PeriodeLomba[];
    activePeriode?: PeriodeLomba | null;
    filters: {
        periode_id?: string;
        status?: string;
        is_inovasi_daerah?: string;
        search?: string;
    };
};

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
};

export default function PengajuanLombaIndex({
    pengajuan,
    periodes,
    activePeriode,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedPeriode, setSelectedPeriode] = useState(filters.periode_id || (activePeriode?.id?.toString() ?? ''));
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [selectedDaerah, setSelectedDaerah] = useState(filters.is_inovasi_daerah || 'all');

    const handleFilterChange = (newParams: Record<string, string>) => {
        const currentParams = {
            periode_id: selectedPeriode,
            status: selectedStatus === 'all' ? '' : selectedStatus,
            is_inovasi_daerah: selectedDaerah === 'all' ? '' : selectedDaerah,
            search,
            ...newParams,
        };

        const cleanedParams = Object.fromEntries(
            Object.entries(currentParams).filter(([_, v]) => v !== '' && v !== 'all')
        );

        router.get('/pengajuan-lomba', cleanedParams, { preserveState: true, replace: true });
    };

    return (
        <>
            <Head title="Pengajuan Lomba Inovasi Daerah - INOVA-HUB Sumbawa" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
                {/* Hero Banner Sumbawa */}
                <HeroBanner
                    title="Pengajuan Lomba Inovasi Daerah"
                    subtitle="Daftar inovasi yang didaftarkan ke kompetisi tahunan Innovative Government Award (IGA). Pantau alur 5 status dari pendampingan hingga terkirim ke Kemendagri."
                    badgeText="Lomba & Kematangan SID"
                />

                {/* Filter Toolbar */}
                <Card className="border-border bg-card">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {/* Search */}
                            <div>
                                <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                                    Pencarian
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                    <Input
                                        placeholder="Nama inovasi, inisiator..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleFilterChange({ search })}
                                        className="h-8 pl-8 text-xs"
                                    />
                                </div>
                            </div>

                            {/* Periode */}
                            <div>
                                <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                                    Periode Lomba
                                </label>
                                <select
                                    value={selectedPeriode}
                                    onChange={(e) => {
                                        setSelectedPeriode(e.target.value);
                                        handleFilterChange({ periode_id: e.target.value });
                                    }}
                                    className="w-full h-8 text-xs rounded-md border border-input bg-background px-2.5 text-foreground"
                                >
                                    <option value="">Semua Periode</option>
                                    {periodes.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nama} ({p.tahun}) {p.aktif ? '• Aktif' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                                    Status Pengajuan
                                </label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => {
                                        setSelectedStatus(e.target.value);
                                        handleFilterChange({ status: e.target.value });
                                    }}
                                    className="w-full h-8 text-xs rounded-md border border-input bg-background px-2.5 text-foreground"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="dalam_pendampingan">Dalam Pendampingan</option>
                                    <option value="disahkan_opd">Disahkan OPD</option>
                                    <option value="review_internal">Review Internal</option>
                                    <option value="siap_kirim">Siap Kirim</option>
                                    <option value="terkirim">Terkirim</option>
                                </select>
                            </div>

                            {/* Status Daerah */}
                            <div>
                                <label className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                                    Kategori Inovasi
                                </label>
                                <select
                                    value={selectedDaerah}
                                    onChange={(e) => {
                                        setSelectedDaerah(e.target.value);
                                        handleFilterChange({ is_inovasi_daerah: e.target.value });
                                    }}
                                    className="w-full h-8 text-xs rounded-md border border-input bg-background px-2.5 text-foreground"
                                >
                                    <option value="all">Semua Kategori</option>
                                    <option value="true">Inovasi Daerah</option>
                                    <option value="false">Inovasi Biasa</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table Data */}
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="min-w-[240px] font-semibold">NAMA INOVASI & OPD</TableHead>
                                <TableHead className="w-[120px] font-semibold">PERIODE</TableHead>
                                <TableHead className="w-[160px] font-semibold">STATUS PENGAJUAN</TableHead>
                                <TableHead className="w-[120px] text-center font-semibold">SKOR SID</TableHead>
                                <TableHead className="w-[160px] text-right font-semibold">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pengajuan.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-xs text-muted-foreground">
                                        Tidak ada data pengajuan lomba yang sesuai filter.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pengajuan.data.map((item) => {
                                    const st = statusBadgeMap[item.status] ?? {
                                        label: item.status,
                                        variant: 'secondary',
                                    };
                                    const inovasi = item.inovasi;

                                    return (
                                        <TableRow key={item.id} className="hover:bg-muted/30">
                                            {/* Nama Inovasi & OPD */}
                                            <TableCell className="space-y-1">
                                                <div className="font-semibold text-xs text-foreground flex items-center gap-2">
                                                    <span>{inovasi?.nama_inovasi}</span>
                                                    {item.is_inovasi_daerah ? (
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] gap-1"
                                                        >
                                                            <Award className="h-2.5 w-2.5 text-emerald-600" />
                                                            Inovasi Daerah
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-[10px] text-muted-foreground">
                                                            Inovasi Biasa
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground">
                                                    {inovasi?.opd?.nama ?? inovasi?.user?.nama_pemda ?? 'Inisiator Publik'} • Inisiator: {inovasi?.nama_inisiator}
                                                </div>
                                            </TableCell>

                                            {/* Periode */}
                                            <TableCell className="text-xs">
                                                <div className="font-medium text-foreground">
                                                    {item.periode_lomba?.tahun ?? '-'}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {item.is_arsip ? 'Arsip' : 'Aktif'}
                                                </div>
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell>
                                                <Badge variant={st.variant} className={st.className}>
                                                    {st.label}
                                                </Badge>
                                            </TableCell>

                                            {/* Skor */}
                                            <TableCell className="text-center">
                                                <div className="font-mono font-bold text-xs text-teal-700 dark:text-teal-400">
                                                    {item.estimasi_skor_kematangan ? item.estimasi_skor_kematangan.toFixed(2) : '-'}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground">
                                                    {item.kelengkapan_indikator?.length ?? 0}/20 Diisi
                                                </div>
                                            </TableCell>

                                            {/* Aksi */}
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* Detail Pengajuan */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        className="h-7 px-2.5 text-xs gap-1"
                                                        title="Detail Pengajuan"
                                                    >
                                                        <Link href={`/pengajuan-lomba/${item.id}`}>
                                                            <Eye className="h-3 w-3" />
                                                            <span>Detail</span>
                                                        </Link>
                                                    </Button>

                                                    {/* 20 Indikator SID */}
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        asChild
                                                        className="h-7 px-2.5 text-xs gap-1 bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                                                        title="Buka 20 Indikator SID"
                                                    >
                                                        <Link href={`/pengajuan-lomba/${item.id}/indikator`}>
                                                            <FolderOpen className="h-3 w-3" />
                                                            <span>Indikator</span>
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
