import { Head, Link } from '@inertiajs/react';
import { Calculator } from 'lucide-react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Column } from '@/components/ui/data-table';
import { DataTable } from '@/components/ui/data-table';
import type { BreadcrumbItem } from '@/types';

interface InovasiItem {
    id: number;
    inovasi_id: number;
    nama_inovasi: string;
    tahapan: string;
    status: string;
    status_juri: 'sedang_melengkapi_data' | 'sudah_submit' | 'sudah_dinilai' | string;
    nilai_saya: number | null;
    catatan_saya: string | null;
    nilai_rata_rata: number | null;
    jumlah_juri_menilai: number;
    estimasi_skor_kematangan: number | null;
    created_at: string;
    user?: { name: string; nama_pemda?: string };
    opd?: { nama: string };
    periode_lomba?: { tahun: number; nama: string };
}

interface PaginatedInovasi {
    data: InovasiItem[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    inovasi?: PaginatedInovasi;
    pengajuanList?: PaginatedInovasi;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Penilaian Lomba Inovasi', href: '/penilai/skoring' },
];

const statusBadge: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary'; className?: string }> = {
    sedang_melengkapi_data: {
        label: 'Sedang melengkapi data',
        variant: 'outline',
        className: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80',
    },
    sudah_submit: {
        label: 'Sudah di Submit',
        variant: 'secondary',
        className: 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/80',
    },
    sudah_dinilai: {
        label: 'Sudah dinilai',
        variant: 'default',
        className: 'bg-emerald-600 text-white dark:bg-emerald-700',
    },
};

export default function SkoringIndex({ inovasi, pengajuanList }: Props) {
    const listData = inovasi?.data ?? pengajuanList?.data ?? [];
    const columns: Column<InovasiItem>[] = [
        {
            header: 'Nama Inovasi',
            accessorKey: 'nama_inovasi',
            sortable: true,
            cell: (row) => (
                <div>
                    <div className="font-semibold text-foreground">{row.nama_inovasi}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                        Tahapan: <span className="capitalize font-medium">{row.tahapan}</span>
                    </div>
                </div>
            ),
        },
        {
            header: 'Pengusul / OPD',
            cell: (row) => (
                <div>
                    <div className="font-medium text-foreground text-xs">{row.user?.nama_pemda || row.user?.name}</div>
                    <div className="text-[11px] text-muted-foreground">{row.opd?.nama || 'Perangkat Daerah'}</div>
                </div>
            ),
        },
        {
            header: 'Status Penilaian',
            accessorKey: 'status_juri',
            sortable: true,
            cell: (row) => {
                const st = statusBadge[row.status_juri] || {
                    label: row.status_juri?.replace(/_/g, ' ') || 'Sedang melengkapi data',
                    variant: 'secondary' as const,
                };
                return (
                    <div className="flex flex-col items-start gap-1">
                        <Badge variant={st.variant} className={`text-xs ${st.className || ''}`}>
                            {st.label}
                        </Badge>
                        {row.nilai_saya !== null && row.nilai_saya !== undefined && (
                            <span className="text-[10px] text-muted-foreground font-medium">
                                Nilai Anda: <strong className="text-emerald-700 dark:text-emerald-400">{row.nilai_saya}</strong>
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            header: 'Nilai Rata-rata',
            accessorKey: 'nilai_rata_rata',
            sortable: true,
            align: 'center',
            cell: (row) => (
                <div className="flex flex-col items-center">
                    <span className="font-bold text-base text-primary">
                        {row.nilai_rata_rata !== null && row.nilai_rata_rata !== undefined
                            ? row.nilai_rata_rata
                            : '-'}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                        {row.jumlah_juri_menilai > 0
                            ? `${row.jumlah_juri_menilai} Juri`
                            : 'Belum ada nilai'}
                    </span>
                </div>
            ),
        },
        {
            header: 'Aksi Evaluasi',
            align: 'right',
            cell: (row) => (
                <Link href={`/penilai/skoring/${row.id}`}>
                    <Button
                        size="sm"
                        variant={row.status_juri === 'sudah_dinilai' ? 'outline' : 'default'}
                        className="gap-1.5 h-8 text-xs cursor-pointer"
                    >
                        <Calculator className="h-3.5 w-3.5" />
                        {row.status_juri === 'sudah_dinilai'
                            ? 'Ubah Nilai'
                            : row.status_juri === 'sedang_melengkapi_data'
                                ? 'Lihat Profil'
                                : 'Beri Nilai'}
                    </Button>
                </Link>
            ),
        },
    ];

    const filterOptions = [
        { label: 'Semua Peserta Lomba', value: 'all' },
        { label: 'Sedang Melengkapi Data', value: 'sedang_melengkapi_data' },
        { label: 'Sudah di Submit', value: 'sudah_submit' },
        { label: 'Sudah Dinilai', value: 'sudah_dinilai' },
    ];

    return (
        <>
            <Head title="Penilaian Lomba Inovasi Daerah" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Header Hero Banner */}
                <HeroBanner
                    badgeIcon={Calculator}
                    badgeText="Penjurian Lomba Inovasi"
                    title="Penilaian Lomba Inovasi Daerah"
                    description="Evaluasi profil inovasi, telaah berkas dukung lomba (PPT, video, proposal), dan input penilaian tim juri independen periode aktif."
                    variant="teal"
                />

                <DataTable
                    data={listData}
                    columns={columns}
                    searchPlaceholder="Cari nama inovasi atau pengusul..."
                    filterOptions={filterOptions}
                    filterKey={(row) => row.status_juri}
                    emptyTitle="Belum Ada Inovasi Peserta Lomba"
                    emptyDescription="Belum ada usulan inovasi yang terdaftar pada periode lomba aktif ini."
                />
            </div>
        </>
    );
}

SkoringIndex.layout = {
    breadcrumbs,
};
