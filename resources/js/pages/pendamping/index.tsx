import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    Building2,
    CheckCircle2,
    Clock,
    Eye,
    FileCheck,
    FolderOpen,
    Info,
    Layers,
    ShieldCheck,
    Trophy,
} from 'lucide-react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Column } from '@/components/ui/data-table';
import { DataTable } from '@/components/ui/data-table';
import { Progress } from '@/components/ui/progress';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Antrean Validasi', href: '/pendamping/validasi' },
];

const statusLabelMap: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }
> = {
    draft: { label: 'Draft', variant: 'secondary' },
    dalam_pendampingan: {
        label: 'Dalam Pendampingan',
        variant: 'outline',
        className: 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 font-semibold',
    },
    disahkan_opd: {
        label: 'Disahkan OPD',
        variant: 'outline',
        className: 'border-teal-500 text-teal-700 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-teal-950/20',
    },
    review_internal: {
        label: 'Review Internal Tim Penilai',
        variant: 'secondary',
        className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 font-medium',
    },
    siap_kirim: {
        label: 'Siap Kirim ke Kemendagri',
        variant: 'default',
        className: 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold',
    },
    terkirim: {
        label: 'Terkirim ke Kemendagri',
        variant: 'default',
        className: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold',
    },
};

type InovasiItem = {
    id: number;
    inovasi_id: number;
    nama_inovasi: string;
    nama_inisiator: string;
    tahapan: string;
    urusan_utama: string;
    status: string;
    estimasi_skor_kematangan: number;
    filled_indikator: number;
    total_indikator: number;
    opd_nama: string;
    inisiator_nama: string;
    created_at: string;
    periode_tahun: number;
};

type Props = {
    inovasiList: {
        data: InovasiItem[];
        current_page: number;
        last_page: number;
        total: number;
    };
    counts: {
        all?: number;
        dalam_pendampingan?: number;
        disahkan_opd?: number;
        lanjutan?: number;
    };
    filters: { status: string; search: string };
    penugasan: { id: number; opd?: { nama: string } }[];
    periode?: { tahun: number; nama: string };
};

export default function PendampingIndex({ inovasiList, counts, filters, penugasan, periode }: Props) {
    const activeStatus = filters.status ?? 'all';

    const handleTabChange = (statusKey: string) => {
        router.get(
            '/pendamping/inovasi',
            {
                status: statusKey,
                search: filters.search || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const columns: Column<InovasiItem>[] = [
        {
            header: 'Inovasi & Inisiator',
            accessorKey: 'nama_inovasi',
            sortable: true,
            cell: (row) => (
                <div className="space-y-1 py-0.5">
                    <div className="font-semibold text-foreground text-sm leading-snug">
                        {row.nama_inovasi}
                    </div>
                    <div className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span>Inisiator: <strong className="text-foreground/80 font-medium">{row.nama_inisiator || '-'}</strong></span>
                        <span>•</span>
                        <span>Urusan: {row.urusan_utama || '-'}</span>
                        <span>•</span>
                        <span className="text-teal-700 dark:text-teal-400 font-medium">Periode {row.periode_tahun}</span>
                    </div>
                </div>
            ),
        },
        {
            header: 'OPD Binaan',
            cell: (row) => (
                <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-medium text-foreground text-xs">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>{row.opd_nama}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground capitalize">
                        Tahapan: {row.tahapan}
                    </div>
                </div>
            ),
        },
        {
            header: 'Kelengkapan 20 Indikator SID',
            cell: (row) => {
                const percent = Math.min(100, Math.round((row.filled_indikator / row.total_indikator) * 100));
                const isComplete = row.filled_indikator >= row.total_indikator;

                return (
                    <div className="space-y-1.5 min-w-[150px]">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-foreground text-[11px] flex items-center gap-1">
                                {isComplete ? (
                                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                ) : (
                                    <Clock className="h-3 w-3 text-amber-600" />
                                )}
                                {row.filled_indikator} / {row.total_indikator} Terisi
                            </span>
                            <span className="text-[11px] text-muted-foreground font-semibold">{percent}%</span>
                        </div>
                        <Progress value={percent} className="h-1.5" />
                    </div>
                );
            },
        },
        {
            header: 'Skor Kematangan',
            align: 'center',
            cell: (row) => {
                const score = row.estimasi_skor_kematangan ?? 0;
                return (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-bold text-xs border border-teal-200 dark:border-teal-800">
                        <Trophy className="h-3 w-3 text-teal-600" />
                        <span>{score.toFixed(1)}</span>
                    </div>
                );
            },
        },
        {
            header: 'Status',
            accessorKey: 'status',
            sortable: true,
            cell: (row) => {
                const st = statusLabelMap[row.status] || { label: row.status, variant: 'secondary' };
                return (
                    <Badge variant={st.variant} className={st.className}>
                        {st.label}
                    </Badge>
                );
            },
        },
        {
            header: 'Aksi Pemeriksaan',
            align: 'right',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1.5">
                    {/* Tombol Utama: Buka 20 Indikator SID */}
                    <Button
                        size="sm"
                        variant="default"
                        asChild
                        className="h-8 px-2.5 text-xs gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-xs"
                        title="Periksa dokumen bukti dukung & beri catatan pada 20 Indikator SID"
                    >
                        <Link href={`/inovasi-daerah/${row.id}/indikator`}>
                            <FolderOpen className="h-3.5 w-3.5" />
                            <span>20 Indikator</span>
                        </Link>
                    </Button>

                    {/* Tombol Sekunder: Ringkasan & Form Pengesahan OPD */}
                    <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="h-8 px-2 text-xs gap-1 text-foreground hover:bg-muted"
                        title="Lihat proposal profil inovasi & form pengesahan resmi OPD"
                    >
                        <Link href={`/pendamping/validasi/${row.id}`}>
                            <Eye className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Detail & Sahkan</span>
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    const tabs = [
        {
            key: 'all',
            label: 'Semua Antrean Aktif',
            count: counts.all ?? 0,
            activeColor: 'text-foreground',
        },
        {
            key: 'dalam_pendampingan',
            label: 'Perlu Pendampingan',
            count: counts.dalam_pendampingan ?? 0,
            activeColor: 'text-amber-700 dark:text-amber-400',
        },
    ];

    return (
        <>
            <Head title="Antrean Validasi Pendamping Inovasi" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
                {/* Hero Banner INOVA-HUB */}
                <HeroBanner
                    badgeIcon={ShieldCheck}
                    badgeText={`Meja Kerja Pendamping Inovasi • Periode ${periode?.tahun || '2026'}`}
                    title="Antrean Validasi & Pembinaan Mutu Data"
                    description="Meja kerja utama Anda untuk memverifikasi dokumen bukti dukung 20 Indikator SID, memberi catatan bimbingan revisi, dan mengesahkan inovasi binaan sebelum disalin ke portal resmi Kemendagri."
                    variant="teal"
                    extraContent={
                        penugasan.length > 0 ? (
                            <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                                <span className="text-white/80 font-medium">OPD Binaan Anda:</span>
                                {penugasan.map((p, idx) => (
                                    <Badge
                                        key={idx}
                                        variant="outline"
                                        className="bg-white/15 hover:bg-white/20 text-white border-white/30 text-xs font-semibold backdrop-blur-xs"
                                    >
                                        <Building2 className="h-3 w-3 mr-1" />
                                        {p.opd?.nama ?? 'Semua Perangkat Daerah'}
                                    </Badge>
                                ))}
                            </div>
                        ) : null
                    }
                >
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl h-9 text-xs font-semibold shadow-xs"
                        >
                            <Link href="/pendamping/inovasi-daerah">
                                <Award className="h-3.5 w-3.5 mr-1 text-emerald-300" /> Buka Inovasi Daerah
                            </Link>
                        </Button>
                    </div>
                </HeroBanner>

                {/* 4 Kartu Metrik Kerja Riil */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <Card className="border shadow-xs bg-card">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Total Inovasi Binaan
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                    {counts.all ?? 0}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600">
                                <Layers className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-xs bg-card">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Perlu Pendampingan
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                    {counts.dalam_pendampingan ?? 0}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                                <Clock className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>

                    <Link href="/inovasi-daerah" className="block group">
                        <Card className="border shadow-xs bg-card hover:border-teal-500/50 transition-colors cursor-pointer h-full">
                            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-teal-600 transition-colors">
                                        <span>Telah Disahkan OPD</span>
                                        <ArrowRight className="h-3 w-3" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-teal-600 dark:text-teal-400">
                                        {counts.disahkan_opd ?? 0}
                                    </div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 group-hover:bg-teal-500/20 transition-colors">
                                    <FileCheck className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Card className="border shadow-xs bg-card">
                        <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground block">
                                    Melaju ke Tim Kabupaten
                                </span>
                                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                                    {counts.lanjutan ?? 0}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600">
                                <Trophy className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Banner Panduan Inovasi Selesai */}
                <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-teal-500/20 bg-teal-500/5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2.5">
                        <Info className="h-4 w-4 text-teal-600 shrink-0" />
                        <span>
                            Inovasi binaan yang telah Anda sahkan (Disahkan OPD, Review Internal, Siap Kirim, Terkirim) otomatis keluar dari antrean aktif ini dan dapat dipantau riwayatnya di menu <strong className="text-foreground font-semibold">Inovasi Daerah</strong>.
                        </span>
                    </div>
                    <Button variant="outline" size="sm" asChild className="h-7 text-xs border-teal-500/30 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10 shrink-0">
                        <Link href="/inovasi-daerah">
                            Lihat Inovasi Daerah
                            <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </Button>
                </div>

                {/* Tab Filter Tugas & Tabel Antrean */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border">
                            {tabs.map((tab) => {
                                const isActive = activeStatus === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => handleTabChange(tab.key)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                                            isActive
                                                ? 'bg-background text-foreground shadow-xs'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span
                                            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                                isActive
                                                    ? 'bg-teal-600 text-white font-bold'
                                                    : 'bg-muted text-muted-foreground'
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={inovasiList.data}
                        searchPlaceholder="Cari nama inovasi, nama inisiator, atau urusan..."
                        pageSize={15}
                        emptyTitle="Belum Ada Antrean Inovasi"
                        emptyDescription={
                            activeStatus === 'dalam_pendampingan'
                                ? 'Tidak ada inovasi yang saat ini membutuhkan tindakan pendampingan atau revisi. Seluruh data binaan Anda dalam kondisi beres.'
                                : activeStatus === 'disahkan_opd'
                                    ? 'Belum ada inovasi binaan yang disahkan ke tingkat OPD.'
                                    : 'Belum ada usulan inovasi dari OPD binaan yang ditugaskan kepada Anda pada periode lomba ini.'
                        }
                    />
                </div>
            </div>
        </>
    );
}

PendampingIndex.layout = {
    breadcrumbs,
};
