import { Head, useForm, router } from '@inertiajs/react';
import { CalendarDays, CheckCircle2, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Column } from '@/components/ui/data-table';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Periode {
    id: number;
    tahun: number;
    nama: string;
    aktif: boolean;
    inovasi_count: number;
    created_at: string;
}

interface Props {
    periodes: Periode[];
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Manajemen Periode Lomba', href: '/penilai/periode' },
];

export default function PeriodeLombaIndex({ periodes }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm({
        tahun: new Date().getFullYear(),
        nama: `IGA ${new Date().getFullYear()}`,
        set_aktif: true,
    });

    const openCreateModal = () => {
        const nextYear = new Date().getFullYear();
        form.setData({
            tahun: nextYear,
            nama: `IGA ${nextYear}`,
            set_aktif: periodes.length === 0,
        });
        setDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/penilai/periode', {
            onSuccess: () => setDialogOpen(false),
        });
    };

    const handleSetAktif = (periode: Periode) => {
        if (periode.aktif) return;
        if (confirm(`Apakah Anda yakin ingin mengaktifkan periode "${periode.nama}" (${periode.tahun})? Periode lain akan otomatis dinonaktifkan.`)) {
            router.patch(`/penilai/periode/${periode.id}/set-aktif`);
        }
    };

    const columns: Column<Periode>[] = [
        {
            header: 'Tahun',
            accessorKey: 'tahun',
            sortable: true,
            cell: (row) => (
                <span className="font-mono text-base font-bold text-primary">
                    {row.tahun}
                </span>
            ),
        },
        {
            header: 'Nama Periode Lomba',
            accessorKey: 'nama',
            sortable: true,
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{row.nama}</span>
                    {row.aktif && (
                        <Badge variant="default" className="bg-primary text-primary-foreground gap-1 text-xs">
                            <Sparkles className="h-3 w-3" /> Periode Aktif
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            header: 'Jumlah Inovasi',
            accessorKey: 'inovasi_count',
            sortable: true,
            align: 'center',
            cell: (row) => (
                <Badge variant="outline" className="font-semibold">
                    {row.inovasi_count} Inovasi
                </Badge>
            ),
        },
        {
            header: 'Status',
            accessorKey: 'aktif',
            align: 'center',
            cell: (row) => (
                row.aktif ? (
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
                        Aktif
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="text-muted-foreground">
                        Arsip / Inaktif
                    </Badge>
                )
            ),
        },
        {
            header: 'Aksi',
            align: 'right',
            cell: (row) => (
                !row.aktif ? (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1 border-primary/40 text-primary hover:bg-primary/10"
                        onClick={() => handleSetAktif(row)}
                    >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Aktifkan Periode
                    </Button>
                ) : (
                    <span className="text-xs text-primary font-medium flex items-center justify-end gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Sedang Berjalan
                    </span>
                )
            ),
        },
    ];

    return (
        <>
            <Head title="Manajemen Periode Lomba" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                <HeroBanner
                    badgeIcon={CalendarDays}
                    badgeText="Timeline & Lifecycle"
                    title="Manajemen Periode Lomba & Pengarsipan"
                    description="Kelola jadwal kompetisi IGA Kabupaten Sumbawa tahunan, atur siklus aktif/arsip otomatis, dan pantau partisipasi total per siklus."
                >
                    <Button onClick={openCreateModal} className="gap-2 bg-background text-foreground hover:bg-background/90 shadow-xs cursor-pointer">
                        <Plus className="h-4 w-4" />
                        Buka Periode Lomba Baru
                    </Button>
                </HeroBanner>

                <DataTable
                    data={periodes}
                    columns={columns}
                    searchPlaceholder="Cari tahun atau nama periode lomba..."
                    searchKey={(row) => `${row.tahun} ${row.nama}`}
                    emptyTitle="Belum Ada Periode Lomba"
                    emptyDescription="Klik tombol 'Buka Periode Lomba Baru' untuk membuat periode pertama."
                />
            </div>

            {/* Create Periode Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-primary" />
                                Buka Periode Lomba Baru
                            </DialogTitle>
                            <DialogDescription>
                                Masukkan tahun pelaksanaan dan nama event IGA Kabupaten Sumbawa.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="tahun">Tahun Pelaksanaan <span className="text-destructive">*</span></Label>
                                <Input
                                    id="tahun"
                                    type="number"
                                    min="2020"
                                    max="2100"
                                    value={form.data.tahun}
                                    onChange={(e) => {
                                        const year = parseInt(e.target.value) || new Date().getFullYear();
                                        form.setData({
                                            ...form.data,
                                            tahun: year,
                                            nama: `IGA ${year}`,
                                        });
                                    }}
                                    required
                                />
                                {form.errors.tahun && <p className="text-xs text-destructive mt-1">{form.errors.tahun}</p>}
                            </div>

                            <div>
                                <Label htmlFor="nama">Nama Periode / Event <span className="text-destructive">*</span></Label>
                                <Input
                                    id="nama"
                                    value={form.data.nama}
                                    onChange={(e) => form.setData('nama', e.target.value)}
                                    placeholder="e.g. IGA 2026"
                                    required
                                />
                                {form.errors.nama && <p className="text-xs text-destructive mt-1">{form.errors.nama}</p>}
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="set_aktif"
                                    checked={form.data.set_aktif}
                                    onChange={(e) => form.setData('set_aktif', e.target.checked)}
                                    className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                                />
                                <Label htmlFor="set_aktif" className="text-sm font-normal cursor-pointer">
                                    Setel sebagai <strong>Periode Aktif</strong> (menonaktifkan periode lainnya)
                                </Label>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                Simpan Periode
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

PeriodeLombaIndex.layout = {
    breadcrumbs,
};
