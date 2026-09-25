import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Award,
    Building2,
    Eye,
    FolderOpen,
    Lightbulb,
    Mail,
    Phone,
    Plus,
    Search,
    Sparkles,
    Trophy,
    User,
    UserCheck,
    Users,
} from 'lucide-react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Column, PaginationData } from '@/components/ui/data-table';
import { DataTable } from '@/components/ui/data-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Direktori Peserta', href: '/superadmin/peserta-lomba' },
];

export interface InovasiItem {
    id: number;
    nama_inovasi: string;
    tahapan: string;
    is_inovasi_daerah: boolean;
    status: string;
    estimasi_skor_kematangan: number;
    periode_tahun: string | number;
    pengajuan_id?: number | null;
}

export interface PesertaItem {
    id: number;
    name: string;
    email: string;
    no_whatsapp?: string | null;
    pekerjaan?: string | null;
    tipe_inovator: 'dinas' | 'masyarakat' | string;
    opd_id?: number | null;
    opd_nama: string;
    status_aktif: boolean;
    created_at: string;
    total_inovasi: number;
    total_inovasi_daerah: number;
    inovasi_list: InovasiItem[];
}

interface Props {
    peserta: PesertaItem[] | PaginationData<PesertaItem>;
    periode?: {
        id: number;
        tahun: string | number;
        nama?: string;
    } | null;
    summary: {
        total_peserta: number;
        total_opd: number;
        total_masyarakat: number;
        total_inovasi: number;
    };
}

const statusBadgeStyles: Record<string, { label: string; className: string }> = {
    draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
    diajukan: { label: 'Diajukan', className: 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300' },
    divalidasi: { label: 'Divalidasi', className: 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-300' },
    revisi: { label: 'Revisi', className: 'bg-destructive/10 text-destructive border-destructive/20' },
    disetujui: { label: 'Disetujui', className: 'bg-primary/10 text-primary border-primary/30' },
    disahkan_opd: { label: 'Disahkan OPD', className: 'bg-primary/10 text-primary border-primary/30 font-semibold' },
    review_internal: { label: 'Review Internal', className: 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300' },
    siap_kirim: { label: 'Siap Kirim', className: 'bg-emerald-600 text-white font-bold' },
    terkirim: { label: 'Terkirim', className: 'bg-teal-700 text-white font-bold' },
};

export default function PesertaLombaIndex({ peserta, periode, summary }: Props) {
    const isPaginated = Boolean(peserta && typeof peserta === 'object' && 'data' in peserta);
    const pesertaList: PesertaItem[] = isPaginated
        ? ((peserta as PaginationData<PesertaItem>).data ?? [])
        : (Array.isArray(peserta) ? peserta : []);
    const pagination = isPaginated ? (peserta as PaginationData<PesertaItem>) : undefined;

    const [filterKategori, setFilterKategori] = useState<'all' | 'dinas' | 'masyarakat'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPeserta, setSelectedPeserta] = useState<PesertaItem | null>(null);

    // Filter list data
    const filteredPeserta = useMemo(() => {
        return pesertaList.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.opd_nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.no_whatsapp && p.no_whatsapp.includes(searchQuery)) ||
                p.inovasi_list.some((inv) =>
                    inv.nama_inovasi.toLowerCase().includes(searchQuery.toLowerCase())
                );

            if (!matchesSearch) return false;

            if (filterKategori === 'dinas') {
                return p.tipe_inovator !== 'masyarakat';
            }
            if (filterKategori === 'masyarakat') {
                return p.tipe_inovator === 'masyarakat';
            }
            return true;
        });
    }, [pesertaList, searchQuery, filterKategori]);

    const columns: Column<PesertaItem>[] = useMemo(
        () => [
            {
                header: 'Inisiator / Peserta',
                cell: (row) => {
                    const isMasyarakat = row.tipe_inovator === 'masyarakat';
                    return (
                        <div className="flex items-center gap-3 py-1">
                            <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${
                                    isMasyarakat
                                        ? 'bg-amber-500/10 text-amber-600'
                                        : 'bg-primary/10 text-primary'
                                }`}
                            >
                                {isMasyarakat ? (
                                    <User className="h-5 w-5" />
                                ) : (
                                    <Building2 className="h-5 w-5" />
                                )}
                            </div>
                            <div className="space-y-0.5">
                                <div className="font-bold text-foreground text-xs sm:text-sm">
                                    {row.name}
                                </div>
                                <div className="text-[11px] text-muted-foreground flex items-center gap-2 flex-wrap">
                                    <span className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        {row.email}
                                    </span>
                                    {row.no_whatsapp && (
                                        <>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {row.no_whatsapp}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                },
            },
            {
                header: 'Kategori Inovator',
                align: 'center',
                cell: (row) => {
                    const isMasyarakat = row.tipe_inovator === 'masyarakat';
                    return isMasyarakat ? (
                        <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[11px] font-semibold"
                        >
                            Masyarakat Umum
                        </Badge>
                    ) : (
                        <Badge
                            variant="outline"
                            className="bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30 text-[11px] font-semibold"
                        >
                            Perangkat Daerah (OPD)
                        </Badge>
                    );
                },
            },
            {
                header: 'Instansi / Unit Kerja',
                cell: (row) => (
                    <div className="text-xs text-foreground font-medium max-w-[200px] truncate" title={row.opd_nama}>
                        {row.opd_nama}
                    </div>
                ),
            },
            {
                header: 'Inovasi yang Diusulkan',
                cell: (row) => {
                    if (row.inovasi_list.length === 0) {
                        return (
                            <span className="text-xs text-muted-foreground italic">
                                Belum ada inovasi diajukan
                            </span>
                        );
                    }

                    const displayedItems = row.inovasi_list.slice(0, 2);
                    const remainingCount = row.inovasi_list.length - displayedItems.length;

                    return (
                        <div className="flex flex-wrap items-center gap-1.5 max-w-md">
                            {displayedItems.map((inv) => {
                                const style = statusBadgeStyles[inv.status] ?? {
                                    label: inv.status,
                                    className: 'bg-muted text-foreground',
                                };
                                return (
                                    <div
                                        key={inv.id}
                                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] bg-muted/60 border border-border text-foreground max-w-[220px]"
                                        title={`${inv.nama_inovasi} (Status: ${style.label}, Skor: ${inv.estimasi_skor_kematangan})`}
                                    >
                                        <Lightbulb className="h-3 w-3 text-primary shrink-0" />
                                        <span className="truncate">{inv.nama_inovasi}</span>
                                        <span
                                            className={`text-[9px] px-1 py-0.2 rounded font-bold shrink-0 ${style.className}`}
                                        >
                                            {style.label}
                                        </span>
                                    </div>
                                );
                            })}
                            {remainingCount > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedPeserta(row)}
                                    className="text-[10px] font-bold text-teal-600 hover:text-teal-700 bg-teal-50 dark:bg-teal-950/40 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800 cursor-pointer"
                                >
                                    +{remainingCount} lainnya
                                </button>
                            )}
                        </div>
                    );
                },
            },
            {
                header: 'Total Usulan',
                align: 'center',
                cell: (row) => (
                    <Badge
                        variant={row.total_inovasi > 0 ? 'default' : 'secondary'}
                        className={
                            row.total_inovasi > 0
                                ? 'bg-primary text-primary-foreground font-bold text-xs'
                                : 'text-muted-foreground text-xs'
                        }
                    >
                        {row.total_inovasi} Inovasi
                    </Badge>
                ),
            },
            {
                header: 'Aksi',
                align: 'right',
                cell: (row) => (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedPeserta(row)}
                        className="h-8 text-xs gap-1.5 font-medium hover:bg-primary/5 hover:text-primary"
                    >
                        <Eye className="h-3.5 w-3.5" />
                        Detail Peserta
                    </Button>
                ),
            },
        ],
        []
    );

    return (
        <>
            <Head title="Direktori Peserta Lomba Inovasi Daerah" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
                {/* Hero Banner INOVA-HUB */}
                <HeroBanner
                    badgeIcon={Users}
                    badgeText={`Direktori Peserta • Periode Lomba ${periode?.tahun || '2026'}`}
                    title="Data Peserta Lomba Inovasi Daerah"
                    description="Pantau seluruh inovator dari Perangkat Daerah (OPD) dan Masyarakat Umum yang berpartisipasi dalam Lomba Inovasi Daerah Kabupaten Sumbawa."
                    variant="teal"
                />

                {/* 4 Metric KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <Card className="border shadow-xs bg-card">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Total Peserta Terdaftar
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                    {summary.total_peserta}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600">
                                <Users className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-xs bg-card">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Peserta Perangkat Daerah
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                                    {summary.total_opd}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                <Building2 className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-xs bg-card">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Peserta Masyarakat
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                    {summary.total_masyarakat}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                                <User className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-xs bg-card">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Total Inovasi Dilombakan
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {summary.total_inovasi}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                                <Trophy className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Controls & Search */}
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border w-fit">
                            <button
                                type="button"
                                onClick={() => setFilterKategori('all')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                    filterKategori === 'all'
                                        ? 'bg-background text-foreground shadow-xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Semua ({summary.total_peserta ?? pagination?.total ?? pesertaList.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterKategori('dinas')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                    filterKategori === 'dinas'
                                        ? 'bg-background text-foreground shadow-xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                OPD / Dinas ({summary.total_opd})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterKategori('masyarakat')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                    filterKategori === 'masyarakat'
                                        ? 'bg-background text-foreground shadow-xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Masyarakat ({summary.total_masyarakat})
                            </button>
                        </div>

                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari nama peserta, OPD, atau inovasi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-9 w-full rounded-lg border bg-background pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    {/* Data Table Peserta */}
                    <DataTable
                        columns={columns}
                        data={filteredPeserta}
                        pagination={pagination}
                        searchPlaceholder="Cari peserta..."
                        pageSize={10}
                        emptyTitle="Belum Ada Peserta Terdaftar"
                        emptyDescription="Belum ada inovator yang sesuai dengan filter atau pencarian saat ini."
                    />
                </div>
            </div>

            {/* Modal Detail Profil & Inovasi Peserta */}
            <Dialog open={Boolean(selectedPeserta)} onOpenChange={(open) => !open && setSelectedPeserta(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-primary" />
                            <DialogTitle className="text-base font-bold text-foreground">
                                Profil Peserta: {selectedPeserta?.name}
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-xs">
                            Rincian identitas peserta dan seluruh usulan inovasi yang didaftarkan pada Lomba Inovasi Daerah.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPeserta && (
                        <div className="space-y-4 py-2 text-xs">
                            {/* Identitas Card */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-muted/40 border">
                                <div>
                                    <span className="text-muted-foreground text-[11px] block">Nama Lengkap</span>
                                    <span className="font-bold text-foreground">{selectedPeserta.name}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground text-[11px] block">Kategori Peserta</span>
                                    <Badge
                                        variant="outline"
                                        className={
                                            selectedPeserta.tipe_inovator === 'masyarakat'
                                                ? 'bg-amber-500/10 text-amber-700 border-amber-500/30 font-semibold'
                                                : 'bg-teal-500/10 text-teal-700 border-teal-500/30 font-semibold'
                                        }
                                    >
                                        {selectedPeserta.tipe_inovator === 'masyarakat'
                                            ? 'Masyarakat Umum'
                                            : 'Perangkat Daerah (OPD)'}
                                    </Badge>
                                </div>
                                <div>
                                    <span className="text-muted-foreground text-[11px] block">Instansi / Unit Kerja</span>
                                    <span className="font-semibold text-foreground">{selectedPeserta.opd_nama}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground text-[11px] block">Email & Kontak</span>
                                    <span className="text-foreground">
                                        {selectedPeserta.email} {selectedPeserta.no_whatsapp ? `(${selectedPeserta.no_whatsapp})` : ''}
                                    </span>
                                </div>
                            </div>

                            {/* Daftar Usulan Inovasi */}
                            <div className="space-y-2">
                                <h4 className="font-bold text-foreground text-xs flex items-center justify-between">
                                    <span>Daftar Usulan Inovasi ({selectedPeserta.inovasi_list.length})</span>
                                    <Badge variant="secondary" className="text-[10px]">
                                        Periode {periode?.tahun || '2026'}
                                    </Badge>
                                </h4>

                                {selectedPeserta.inovasi_list.length === 0 ? (
                                    <div className="p-6 text-center text-muted-foreground bg-muted/20 rounded-lg border">
                                        Peserta ini belum mendaftarkan usulan inovasi pada periode lomba aktif.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border border rounded-lg overflow-hidden bg-background">
                                        {selectedPeserta.inovasi_list.map((inv, idx) => {
                                            const badgeStyle = statusBadgeStyles[inv.status] ?? {
                                                label: inv.status,
                                                className: 'bg-muted text-foreground',
                                            };
                                            return (
                                                <div
                                                    key={inv.id}
                                                    className="p-3 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                                >
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-bold text-foreground">
                                                                #{idx + 1}. {inv.nama_inovasi}
                                                            </span>
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-[10px] ${badgeStyle.className}`}
                                                            >
                                                                {badgeStyle.label}
                                                            </Badge>
                                                            {inv.is_inovasi_daerah && (
                                                                <Badge className="bg-emerald-600 text-white text-[9px] font-semibold">
                                                                    Inovasi Daerah
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] text-muted-foreground flex items-center gap-3">
                                                            <span>Tahapan: <strong className="uppercase text-foreground">{inv.tahapan}</strong></span>
                                                            <span>•</span>
                                                            <span>Skor Kematangan: <strong className="text-primary">{inv.estimasi_skor_kematangan.toFixed(2)}</strong></span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        {inv.pengajuan_id && (
                                                            <Button asChild size="sm" variant="outline" className="h-7 text-[11px] gap-1">
                                                                <Link href={`/superadmin/pengajuan-lomba/${inv.pengajuan_id}/indikator`}>
                                                                    <FolderOpen className="h-3 w-3 text-primary" />
                                                                    20 Indikator
                                                                </Link>
                                                            </Button>
                                                        )}
                                                        <Button asChild size="sm" variant="ghost" className="h-7 text-[11px] gap-1">
                                                            <a href={`/inovasi/${inv.id}/print`} target="_blank" rel="noopener noreferrer">
                                                                Profil
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPeserta(null)}
                            className="text-xs"
                        >
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PesertaLombaIndex.layout = {
    breadcrumbs,
};
