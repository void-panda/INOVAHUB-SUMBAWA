import { Head, useForm, router } from '@inertiajs/react';
import { Calendar, CalendarDays, CheckCircle2, Clock, Pencil, Plus, Sparkles } from 'lucide-react';
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
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    rentang_waktu: string;
    status_waktu: 'active' | 'upcoming' | 'closed' | 'unconfigured';
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
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedPeriode, setSelectedPeriode] = useState<Periode | null>(null);

    const createForm = useForm({
        tahun: new Date().getFullYear(),
        nama: `IGA ${new Date().getFullYear()}`,
        tanggal_mulai: `${new Date().getFullYear()}-06-01`,
        tanggal_selesai: `${new Date().getFullYear()}-10-31`,
        set_aktif: true,
    });

    const editForm = useForm({
        nama: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
    });

    const openCreateModal = () => {
        const nextYear = new Date().getFullYear();
        createForm.setData({
            tahun: nextYear,
            nama: `IGA ${nextYear}`,
            tanggal_mulai: `${nextYear}-06-01`,
            tanggal_selesai: `${nextYear}-10-31`,
            set_aktif: periodes.length === 0,
        });
        setCreateDialogOpen(true);
    };

    const openEditModal = (periode: Periode) => {
        setSelectedPeriode(periode);
        editForm.setData({
            nama: periode.nama,
            tanggal_mulai: periode.tanggal_mulai ?? '',
            tanggal_selesai: periode.tanggal_selesai ?? '',
        });
        setEditDialogOpen(true);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/penilai/periode', {
            onSuccess: () => setCreateDialogOpen(false),
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPeriode) return;
        editForm.put(`/penilai/periode/${selectedPeriode.id}`, {
            onSuccess: () => setEditDialogOpen(false),
        });
    };

    const handleSetAktif = (periode: Periode) => {
        if (periode.aktif) return;
        if (confirm(`Apakah Anda yakin ingin mengaktifkan periode "${periode.nama}" (${periode.tahun})? Periode lain akan otomatis dinonaktifkan.`)) {
            router.patch(`/penilai/periode/${periode.id}/set-aktif`);
        }
    };

    const renderStatusWaktuBadge = (status: Periode['status_waktu']) => {
        switch (status) {
            case 'active':
                return (
                    <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-semibold gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Pendaftaran Dibuka
                    </Badge>
                );
            case 'upcoming':
                return (
                    <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-[10px] font-semibold gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        Akan Datang
                    </Badge>
                );
            case 'closed':
                return (
                    <Badge variant="outline" className="border-neutral-300 bg-neutral-100 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-400 text-[10px] font-semibold">
                        Pendaftaran Ditutup
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px]">
                        Belum Diatur
                    </Badge>
                );
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
            header: 'Rentang Waktu Lomba',
            accessorKey: 'rentang_waktu',
            sortable: true,
            cell: (row) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>{row.rentang_waktu}</span>
                    </div>
                    <div>{renderStatusWaktuBadge(row.status_waktu)}</div>
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
            header: 'Status Siklus',
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
                <div className="flex items-center justify-end gap-1.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs gap-1 cursor-pointer hover:bg-muted"
                        onClick={() => openEditModal(row)}
                        title="Edit rentang waktu & nama lomba"
                    >
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Edit</span>
                    </Button>

                    {!row.aktif ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs gap-1 border-primary/40 text-primary hover:bg-primary/10 cursor-pointer"
                            onClick={() => handleSetAktif(row)}
                        >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Aktifkan
                        </Button>
                    ) : (
                        <span className="text-xs text-primary font-medium flex items-center gap-1 px-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Sedang Berjalan
                        </span>
                    )}
                </div>
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
                    description="Kelola jadwal kompetisi IGA Kabupaten Sumbawa tahunan, atur interval tanggal pembukaan dan penutupan lomba, serta pantau partisipasi per siklus."
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
                    searchKey={(row) => `${row.tahun} ${row.nama} ${row.rentang_waktu}`}
                    emptyTitle="Belum Ada Periode Lomba"
                    emptyDescription="Klik tombol 'Buka Periode Lomba Baru' untuk membuat periode pertama."
                />
            </div>

            {/* Create Periode Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-md">
                    <form onSubmit={handleCreateSubmit}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-primary" />
                                Buka Periode Lomba Baru
                            </DialogTitle>
                            <DialogDescription>
                                Tentukan tahun pelaksanaan, nama event, serta interval waktu pembukaan hingga penutupan lomba.
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
                                    value={createForm.data.tahun}
                                    onChange={(e) => {
                                        const year = parseInt(e.target.value) || new Date().getFullYear();
                                        createForm.setData({
                                            ...createForm.data,
                                            tahun: year,
                                            nama: `IGA ${year}`,
                                            tanggal_mulai: `${year}-06-01`,
                                            tanggal_selesai: `${year}-10-31`,
                                        });
                                    }}
                                    required
                                />
                                {createForm.errors.tahun && <p className="text-xs text-destructive mt-1">{createForm.errors.tahun}</p>}
                            </div>

                            <div>
                                <Label htmlFor="nama">Nama Periode / Event <span className="text-destructive">*</span></Label>
                                <Input
                                    id="nama"
                                    value={createForm.data.nama}
                                    onChange={(e) => createForm.setData('nama', e.target.value)}
                                    placeholder="e.g. IGA 2026"
                                    required
                                />
                                {createForm.errors.nama && <p className="text-xs text-destructive mt-1">{createForm.errors.nama}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="tanggal_mulai">Tanggal Mulai Lomba <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="tanggal_mulai"
                                        type="date"
                                        value={createForm.data.tanggal_mulai}
                                        onChange={(e) => createForm.setData('tanggal_mulai', e.target.value)}
                                        required
                                    />
                                    {createForm.errors.tanggal_mulai && <p className="text-xs text-destructive mt-1">{createForm.errors.tanggal_mulai}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="tanggal_selesai">Tanggal Penutupan Lomba <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="tanggal_selesai"
                                        type="date"
                                        value={createForm.data.tanggal_selesai}
                                        onChange={(e) => createForm.setData('tanggal_selesai', e.target.value)}
                                        required
                                    />
                                    {createForm.errors.tanggal_selesai && <p className="text-xs text-destructive mt-1">{createForm.errors.tanggal_selesai}</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="set_aktif"
                                    checked={createForm.data.set_aktif}
                                    onChange={(e) => createForm.setData('set_aktif', e.target.checked)}
                                    className="rounded border-input text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                />
                                <Label htmlFor="set_aktif" className="text-sm font-normal cursor-pointer">
                                    Setel sebagai <strong>Periode Aktif</strong> (menonaktifkan periode lainnya)
                                </Label>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setCreateDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                Simpan Periode
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Periode Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <form onSubmit={handleEditSubmit}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Pencil className="h-5 w-5 text-primary" />
                                Edit Periode & Interval Waktu
                            </DialogTitle>
                            <DialogDescription>
                                Perbarui nama event atau perpanjang batas waktu pengumpulan/pendaftaran inovasi daerah.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="edit-tahun">Tahun Pelaksanaan</Label>
                                <Input
                                    id="edit-tahun"
                                    type="number"
                                    value={selectedPeriode?.tahun ?? ''}
                                    disabled
                                    className="bg-muted cursor-not-allowed"
                                />
                                <p className="text-[11px] text-muted-foreground mt-1">Tahun pelaksanaan tidak dapat diubah.</p>
                            </div>

                            <div>
                                <Label htmlFor="edit-nama">Nama Periode / Event <span className="text-destructive">*</span></Label>
                                <Input
                                    id="edit-nama"
                                    value={editForm.data.nama}
                                    onChange={(e) => editForm.setData('nama', e.target.value)}
                                    required
                                />
                                {editForm.errors.nama && <p className="text-xs text-destructive mt-1">{editForm.errors.nama}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="edit-tanggal_mulai">Tanggal Mulai Lomba <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="edit-tanggal_mulai"
                                        type="date"
                                        value={editForm.data.tanggal_mulai}
                                        onChange={(e) => editForm.setData('tanggal_mulai', e.target.value)}
                                        required
                                    />
                                    {editForm.errors.tanggal_mulai && <p className="text-xs text-destructive mt-1">{editForm.errors.tanggal_mulai}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="edit-tanggal_selesai">Tanggal Penutupan Lomba <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="edit-tanggal_selesai"
                                        type="date"
                                        value={editForm.data.tanggal_selesai}
                                        onChange={(e) => editForm.setData('tanggal_selesai', e.target.value)}
                                        required
                                    />
                                    {editForm.errors.tanggal_selesai && <p className="text-xs text-destructive mt-1">{editForm.errors.tanggal_selesai}</p>}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setEditDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                Simpan Perubahan
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
