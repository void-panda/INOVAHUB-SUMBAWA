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
    nama_inovasi: string;
    tahapan: string;
    status: string;
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

const statusBadge: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' }> = {
    dalam_pendampingan: { label: 'Diajukan / Pendampingan', variant: 'outline' },
    disahkan_opd: { label: 'Disahkan OPD (Siap Dinilai)', variant: 'outline' },
    review_internal: { label: 'Review Juri (Draft Skor)', variant: 'secondary' },
    siap_kirim: { label: 'Siap Kirim (Final Skor)', variant: 'default' },
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
            accessorKey: 'status',
            sortable: true,
            cell: (row) => {
                const st = statusBadge[row.status] || { label: row.status, variant: 'secondary' };
                return (
                    <Badge variant={st.variant} className="text-xs">
                        {st.label}
                    </Badge>
                );
            },
        },
        {
            header: 'Skor Kematangan',
            accessorKey: 'estimasi_skor_kematangan',
            sortable: true,
            align: 'center',
            cell: (row) => (
                <span className="font-bold text-base text-primary">
                    {row.estimasi_skor_kematangan !== null && row.estimasi_skor_kematangan !== undefined
                        ? row.estimasi_skor_kematangan
                        : '-'}
                </span>
            ),
        },
        {
            header: 'Aksi Evaluasi',
            align: 'right',
            cell: (row) => (
                <Link href={`/penilai/skoring/${row.id}`}>
                    <Button size="sm" className="gap-1.5 h-8 text-xs">
                        <Calculator className="h-3.5 w-3.5" />
                        {row.status === 'siap_kirim' ? 'Lihat Skor' : 'Buka Evaluasi'}
                    </Button>
                </Link>
            ),
        },
    ];

    const filterOptions = [
        { label: 'Semua Peserta Lomba', value: 'all' },
        { label: 'Diajukan / Pendampingan', value: 'dalam_pendampingan' },
        { label: 'Disahkan OPD', value: 'disahkan_opd' },
        { label: 'Review Juri (Draft)', value: 'review_internal' },
        { label: 'Siap Kirim (Final)', value: 'siap_kirim' },
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
                    description="Evaluasi 20 Indikator SID, validasi berkas bukti dukung, dan penetapan skor kematangan inovasi peserta lomba periode aktif."
                    variant="teal"
                />

                <DataTable
                    data={listData}
                    columns={columns}
                    searchPlaceholder="Cari nama inovasi atau pengusul..."
                    filterOptions={filterOptions}
                    filterKey={(row) => row.status}
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
