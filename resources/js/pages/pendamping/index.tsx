import { Head, Link } from '@inertiajs/react';
import { Eye, ShieldCheck } from 'lucide-react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Column } from '@/components/ui/data-table';
import { DataTable } from '@/components/ui/data-table';

const statusLabelMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
    diajukan: { label: 'Diajukan', variant: 'default' },
    divalidasi: { label: 'Divalidasi', variant: 'secondary' },
    revisi: { label: 'Perlu Revisi', variant: 'destructive' },
    disetujui: { label: 'Disetujui', variant: 'outline', className: 'border-emerald-500 text-emerald-600 dark:text-emerald-400' },
    disahkan_opd: { label: 'Disahkan OPD', variant: 'outline', className: 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold' },
    review_internal: { label: 'Review Internal', variant: 'secondary' },
    siap_kirim: { label: 'Siap Kirim', variant: 'default', className: 'bg-emerald-600 text-white' },
    terkirim: { label: 'Terkirim', variant: 'default', className: 'bg-blue-600 text-white' },
};

type InovasiItem = {
    id: number;
    nama_inovasi: string;
    tahapan: string;
    status: string;
    nama_inisiator: string;
    created_at: string;
    user?: { name: string; nama_pemda: string };
    opd?: { nama: string };
};

type Props = {
    inovasiList: {
        data: InovasiItem[];
        current_page: number;
        last_page: number;
    };
    counts: Record<string, number>;
    filters: { status: string; search: string };
    penugasan: { id: number; opd?: { nama: string } }[];
    periode?: { tahun: number; nama: string };
};

export default function PendampingIndex({ inovasiList, counts, penugasan }: Props) {
    const columns: Column<InovasiItem>[] = [
        {
            header: 'Nama Inovasi',
            accessorKey: 'nama_inovasi',
            sortable: true,
            cell: (row) => (
                <div>
                    <div className="font-semibold text-foreground">{row.nama_inovasi}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                        Inisiator: {row.nama_inisiator}
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
            header: 'Tahapan',
            accessorKey: 'tahapan',
            sortable: true,
            cell: (row) => (
                <span className="capitalize font-medium text-foreground">
                    {row.tahapan}
                </span>
            ),
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
            header: 'Aksi',
            align: 'right',
            cell: (row) => (
                <Button size="sm" variant="outline" asChild className="h-8 text-xs gap-1.5">
                    <Link href={`/pendamping/inovasi/${row.id}`} prefetch>
                        <Eye className="h-3.5 w-3.5" /> Review
                    </Link>
                </Button>
            ),
        },
    ];

    const filterOptions = [
        { label: 'Semua Status', value: 'all' },
        { label: 'Diajukan', value: 'diajukan' },
        { label: 'Divalidasi', value: 'divalidasi' },
        { label: 'Perlu Revisi', value: 'revisi' },
        { label: 'Disetujui', value: 'disetujui' },
        { label: 'Disahkan OPD', value: 'disahkan_opd' },
    ];

    const opdBinaan = penugasan.map((p) => p.opd?.nama).filter(Boolean).join(', ');

    return (
        <>
            <Head title="Antrean Validasi Pendamping" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Header Hero Banner */}
                <HeroBanner
                    badgeIcon={ShieldCheck}
                    badgeText="Quality Assurance Gate"
                    title="Pendampingan & Validasi Mutu Data"
                    description="Verifikasi kelengkapan profil dan dokumen dukung inovasi binaan OPD sebelum disahkan dan disalin ke portal Kemendagri."
                >
                    {penugasan.length > 0 && (
                        <div className="text-xs bg-primary-foreground/15 border border-primary-foreground/30 px-4 py-2.5 rounded-md font-medium text-primary-foreground">
                            <span className="text-primary-foreground/80 block text-[10px] uppercase font-bold tracking-wider">OPD Binaan Anda</span>
                            <span className="font-semibold text-primary-foreground">{opdBinaan || 'Semua OPD'}</span>
                        </div>
                    )}
                </HeroBanner>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <Card className="p-3 border bg-card">
                        <div className="text-[11px] text-muted-foreground font-medium uppercase">Diajukan</div>
                        <div className="text-xl font-bold text-primary mt-1">{counts['diajukan'] ?? 0}</div>
                    </Card>
                    <Card className="p-3 border bg-card">
                        <div className="text-[11px] text-muted-foreground font-medium uppercase">Divalidasi</div>
                        <div className="text-xl font-bold text-amber-600 mt-1">{counts['divalidasi'] ?? 0}</div>
                    </Card>
                    <Card className="p-3 border bg-card">
                        <div className="text-[11px] text-muted-foreground font-medium uppercase">Perlu Revisi</div>
                        <div className="text-xl font-bold text-rose-600 mt-1">{counts['revisi'] ?? 0}</div>
                    </Card>
                    <Card className="p-3 border bg-card">
                        <div className="text-[11px] text-muted-foreground font-medium uppercase">Disetujui</div>
                        <div className="text-xl font-bold text-emerald-600 mt-1">{counts['disetujui'] ?? 0}</div>
                    </Card>
                    <Card className="p-3 border bg-card col-span-2 md:col-span-1">
                        <div className="text-[11px] text-muted-foreground font-medium uppercase">Disahkan OPD</div>
                        <div className="text-xl font-bold text-indigo-600 mt-1">{counts['disahkan_opd'] ?? 0}</div>
                    </Card>
                </div>

                <DataTable
                    data={inovasiList.data}
                    columns={columns}
                    searchPlaceholder="Cari nama inovasi, inisiator, atau pengusul..."
                    filterOptions={filterOptions}
                    filterKey={(row) => row.status}
                    emptyTitle="Tidak Ada Inovasi Dalam Antrean"
                    emptyDescription="Belum ada usulan inovasi yang perlu divalidasi pada kategori status ini."
                />
            </div>
        </>
    );
}

PendampingIndex.layout = {
    breadcrumbs: [
        { title: 'Pendampingan & Validasi', href: '/pendamping/inovasi' },
    ],
};
