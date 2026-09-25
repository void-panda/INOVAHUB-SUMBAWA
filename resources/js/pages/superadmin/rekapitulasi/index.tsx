import { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Eye, MessageSquare } from 'lucide-react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Column, PaginationData } from '@/components/ui/data-table';
import { DataTable } from '@/components/ui/data-table';
import type { BreadcrumbItem } from '@/types';

interface InovasiItem {
    id: number;
    inovasi_id: number;
    nama_inovasi: string;
    tahapan: string;
    status: string;
    status_juri: 'sedang_melengkapi_data' | 'sudah_submit' | string;
    nilai_rata_rata: number | null;
    jumlah_juri_menilai: number;
    estimasi_skor_kematangan: number | null;
    created_at: string;
    user?: { name: string; nama_pemda?: string };
    opd?: { nama: string };
    periode_lomba?: { tahun: number; nama: string };
}

interface Props {
    inovasi?: PaginationData<InovasiItem>;
    pengajuanList?: PaginationData<InovasiItem>;
    periodeAktif?: { id: number; tahun: number; nama: string } | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rekapitulasi Hasil Juri', href: '/superadmin/rekapitulasi-nilai' },
];

export default function SuperadminRekapitulasiIndex({ inovasi, pengajuanList, periodeAktif }: Props) {
    const pagination = inovasi ?? pengajuanList;
    const listData = pagination?.data ?? [];

    const columns: Column<InovasiItem>[] = useMemo(
        () => [
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
                header: 'Pengusul / Perangkat Daerah',
                cell: (row) => (
                    <div>
                        <div className="font-medium text-foreground text-xs">{row.user?.nama_pemda || row.user?.name}</div>
                        <div className="text-[11px] text-muted-foreground">{row.opd?.nama || 'Masyarakat Umum'}</div>
                    </div>
                ),
            },
            {
                header: 'Status Pengajuan',
                accessorKey: 'status_juri',
                sortable: true,
                cell: (row) => (
                    <div className="flex flex-col items-start gap-1">
                        <Badge
                            variant={row.status_juri === 'sedang_melengkapi_data' ? 'outline' : 'secondary'}
                            className={`text-xs ${
                                row.status_juri === 'sedang_melengkapi_data'
                                    ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80'
                                    : 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/80'
                            }`}
                        >
                            {row.status_juri === 'sedang_melengkapi_data' ? 'Draft / Melengkapi Data' : 'Telah Disubmit'}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-medium">
                            Progres Juri: <strong className="text-foreground">{row.jumlah_juri_menilai} Penilai</strong>
                        </span>
                    </div>
                ),
            },
            {
                header: 'Nilai Rata-rata Juri',
                accessorKey: 'nilai_rata_rata',
                sortable: true,
                align: 'center',
                cell: (row) => (
                    <div className="flex flex-col items-center">
                        <span className="font-extrabold text-base text-teal-700 dark:text-teal-400">
                            {row.nilai_rata_rata !== null && row.nilai_rata_rata !== undefined
                                ? row.nilai_rata_rata
                                : '-'}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                            {row.jumlah_juri_menilai > 0 ? `${row.jumlah_juri_menilai} Juri menilai` : 'Belum dinilai'}
                        </span>
                    </div>
                ),
            },
            {
                header: 'Aksi Monitoring',
                align: 'right',
                cell: (row) => (
                    <Link href={`/superadmin/rekapitulasi-nilai/${row.id}`}>
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 h-8 text-xs cursor-pointer border-teal-600/40 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40"
                        >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Lihat Rekap</span>
                        </Button>
                    </Link>
                ),
            },
        ],
        []
    );

    const filterOptions = [
        { label: 'Semua Peserta Lomba', value: 'all' },
        { label: 'Sedang Melengkapi Data', value: 'sedang_melengkapi_data' },
        { label: 'Sudah di Submit', value: 'sudah_submit' },
    ];

    return (
        <>
            <Head title="Rekapitulasi Hasil Penilaian Juri — BAPPERIDA" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                <HeroBanner
                    badgeIcon={MessageSquare}
                    badgeText="Monitoring Penjurian"
                    title="Rekapitulasi Hasil Penilaian Juri"
                    description={`Pantau perolehan skor, rekapitulasi nilai rata-rata, dan evaluasi kualitatif dari tim juri independen pada Periode Lomba ${periodeAktif?.nama ?? 'Aktif'}.`}
                    variant="teal"
                />

                <DataTable
                    data={listData}
                    columns={columns}
                    pagination={pagination}
                    searchPlaceholder="Cari nama inovasi atau pengusul..."
                    filterOptions={filterOptions}
                    filterKey={(row) => row.status_juri}
                    emptyTitle="Belum Ada Usulan Lomba"
                    emptyDescription="Belum ada inovasi yang terdaftar pada periode lomba ini."
                />
            </div>
        </>
    );
}

SuperadminRekapitulasiIndex.layout = {
    breadcrumbs,
};
