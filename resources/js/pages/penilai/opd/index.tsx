import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Award,
    Building2,
    CheckCircle2,
    ExternalLink,
    FileEdit,
    FolderOpen,
    Phone,
    Plus,
    Search,
    Trash2,
    Users,
} from 'lucide-react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type OpdItem = {
    id: number;
    nama: string;
    kode: string | null;
    kontak: string | null;
    users_count: number;
    inovasi_count: number;
    can_delete: boolean;
};

type Props = {
    opdList: PaginationData<OpdItem>;
    filters: {
        search?: string;
    };
    metrics: {
        total_opd: number;
        total_inovasi_opd: number;
        total_opd_aktif: number;
    };
};

export default function MasterOpdIndex({ opdList, filters, metrics }: Props) {
    const isPaginated = Boolean(opdList && typeof opdList === 'object' && 'data' in opdList);
    const tableData = isPaginated ? (opdList as PaginationData<OpdItem>).data ?? [] : (Array.isArray(opdList) ? opdList : []);
    const pagination = isPaginated ? (opdList as PaginationData<OpdItem>) : undefined;

    const [search, setSearch] = useState(filters.search || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingOpd, setEditingOpd] = useState<OpdItem | null>(null);
    const [deletingOpd, setDeletingOpd] = useState<OpdItem | null>(null);

    // Form Tambah
    const createForm = useForm({
        nama: '',
        kode: '',
        kontak: '',
    });

    // Form Edit
    const editForm = useForm({
        nama: '',
        kode: '',
        kontak: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/penilai/opd', { search: search || undefined }, { preserveState: true, replace: true });
    };

    const handleResetSearch = () => {
        setSearch('');
        router.get('/penilai/opd', {}, { preserveState: true, replace: true });
    };

    const handleOpenEdit = (opd: OpdItem) => {
        setEditingOpd(opd);
        editForm.setData({
            nama: opd.nama,
            kode: opd.kode || '',
            kontak: opd.kontak || '',
        });
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/penilai/opd', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingOpd) return;

        editForm.put(`/penilai/opd/${editingOpd.id}`, {
            onSuccess: () => {
                setEditingOpd(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingOpd) return;

        router.delete(`/penilai/opd/${deletingOpd.id}`, {
            onSuccess: () => {
                setDeletingOpd(null);
            },
        });
    };

    const columns: Column<OpdItem>[] = [
        {
            header: 'Kode',
            cell: (row) => (
                <Badge variant="outline" className="font-mono text-xs font-semibold px-2 py-0.5">
                    {row.kode || '-'}
                </Badge>
            ),
            className: 'w-[100px]',
        },
        {
            header: 'Nama Perangkat Daerah',
            cell: (row) => (
                <div className="flex flex-col gap-0.5">
                    <Link
                        href={`/inovasi-daerah?opd_id=${row.id}`}
                        className="font-semibold text-foreground text-sm hover:text-teal-700 dark:hover:text-teal-400 hover:underline transition-colors"
                        title={`Lihat inovasi dari ${row.nama}`}
                    >
                        {row.nama}
                    </Link>
                    {row.kontak && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="size-3" />
                            {row.kontak}
                        </span>
                    )}
                </div>
            ),
        },
        {
            header: 'Pengguna',
            cell: (row) => (
                <Badge variant="secondary" className="font-medium text-xs gap-1">
                    <Users className="size-3" />
                    {row.users_count} Akun
                </Badge>
            ),
            className: 'w-[120px] text-center',
        },
        {
            header: 'Inovasi Terdaftar',
            cell: (row) => (
                <Link
                    href={`/inovasi-daerah?opd_id=${row.id}`}
                    title={`Lihat ${row.inovasi_count} inovasi dari ${row.nama}`}
                    className="inline-flex items-center group cursor-pointer"
                >
                    <Badge
                        variant={row.inovasi_count > 0 ? 'default' : 'outline'}
                        className={
                            row.inovasi_count > 0
                                ? 'bg-teal-600 hover:bg-teal-700 text-white gap-1 text-xs transition-transform group-hover:scale-105'
                                : 'text-xs text-muted-foreground gap-1 hover:bg-muted'
                        }
                    >
                        <Award className="size-3" />
                        <span>{row.inovasi_count} Inovasi</span>
                        <ExternalLink className="size-2.5 ml-0.5 opacity-70 group-hover:opacity-100" />
                    </Badge>
                </Link>
            ),
            className: 'w-[140px] text-center',
        },
        {
            header: 'Aksi',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1.5">
                    <Button
                        size="sm"
                        variant="ghost"
                        asChild
                        className="h-8 px-2.5 text-xs text-teal-700 hover:text-teal-800 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/50"
                        title={`Buka portofolio inovasi ${row.nama}`}
                    >
                        <Link href={`/inovasi-daerah?opd_id=${row.id}`}>
                            <FolderOpen className="size-3.5 mr-1" />
                            Inovasi
                        </Link>
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEdit(row)}
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Ubah data OPD"
                    >
                        <FileEdit className="size-3.5 mr-1" />
                        Ubah
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        disabled={!row.can_delete}
                        title={row.can_delete ? 'Hapus Perangkat Daerah' : 'Tidak dapat dihapus karena sudah memiliki data inovasi/pengguna'}
                        onClick={() => setDeletingOpd(row)}
                        className="h-8 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-40"
                    >
                        <Trash2 className="size-3.5" />
                    </Button>
                </div>
            ),
            className: 'w-[180px] text-right',
        },
    ];

    return (
        <div className="space-y-6">
            <Head title="Master Perangkat Daerah - INOVA-HUB" />

            {/* Hero Banner */}
            <HeroBanner
                badgeIcon={Building2}
                badgeText="Master Data Administrasi"
                title="Master Perangkat Daerah (OPD)"
                description="Kelola daftar resmi seluruh Organisasi Perangkat Daerah (OPD), Badan, Dinas, dan Unit Kerja di lingkungan Pemerintah Kabupaten Sumbawa."
            >
                <div className="pt-3">
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-white text-teal-800 hover:bg-teal-50 shadow-sm font-semibold text-xs h-9 px-4 rounded-lg cursor-pointer"
                    >
                        <Plus className="size-4 mr-1.5" />
                        Tambah Perangkat Daerah
                    </Button>
                </div>
            </HeroBanner>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="rounded-xl border-border/80 shadow-xs">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Total Perangkat Daerah</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{metrics.total_opd}</div>
                        <p className="text-xs text-muted-foreground mt-0.5">Dinas, Badan, & Lembaga terdaftar</p>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-border/80 shadow-xs">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">OPD Memiliki Inovasi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-teal-700 dark:text-teal-400">{metrics.total_inovasi_opd}</div>
                        <p className="text-xs text-muted-foreground mt-0.5">Telah mengusulkan inovasi daerah</p>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-border/80 shadow-xs">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground">OPD dengan Pengguna Aktif</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{metrics.total_opd_aktif}</div>
                        <p className="text-xs text-muted-foreground mt-0.5">Telah memiliki akun inovator / verifikator</p>
                    </CardContent>
                </Card>
            </div>

            {/* Table Perangkat Daerah */}
            <DataTable
                title="Daftar Perangkat Daerah Resmi"
                description="Daftar Organisasi Perangkat Daerah (OPD), Dinas, Badan, dan Unit Kerja di lingkungan Pemkab Sumbawa"
                columns={columns}
                data={tableData}
                pagination={pagination}
                searchPlaceholder="Cari nama, kode, atau kontak OPD..."
                searchKey={(row) => `${row.nama} ${row.kode || ''} ${row.kontak || ''}`}
                emptyTitle="Tidak Ada Perangkat Daerah"
                emptyDescription="Tidak ada Perangkat Daerah yang sesuai dengan kriteria pencarian."
            />

            {/* Modal Tambah OPD */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                            <Building2 className="size-5 text-teal-600" />
                            Tambah Perangkat Daerah Baru
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Masukkan nama resmi dan kode singkatan Organisasi Perangkat Daerah (OPD) Kabupaten Sumbawa.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="nama" className="text-xs font-semibold">
                                Nama Perangkat Daerah <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="nama"
                                value={createForm.data.nama}
                                onChange={(e) => createForm.setData('nama', e.target.value)}
                                placeholder="Contoh: Dinas Pariwisata dan Ekonomi Kreatif"
                                required
                                className="text-sm"
                            />
                            {createForm.errors.nama && (
                                <p className="text-xs text-destructive">{createForm.errors.nama}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="kode" className="text-xs font-semibold">
                                Kode Singkatan / Akronim
                            </Label>
                            <Input
                                id="kode"
                                value={createForm.data.kode}
                                onChange={(e) => createForm.setData('kode', e.target.value)}
                                placeholder="Contoh: DISPAR"
                                className="text-sm font-mono uppercase"
                            />
                            {createForm.errors.kode && (
                                <p className="text-xs text-destructive">{createForm.errors.kode}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="kontak" className="text-xs font-semibold">
                                Kontak / Nomor Telepon / Email Dinas
                            </Label>
                            <Input
                                id="kontak"
                                value={createForm.data.kontak}
                                onChange={(e) => createForm.setData('kontak', e.target.value)}
                                placeholder="Contoh: (0371) 21xxx / dinas@sumbawakab.go.id"
                                className="text-sm"
                            />
                            {createForm.errors.kontak && (
                                <p className="text-xs text-destructive">{createForm.errors.kontak}</p>
                            )}
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                                className="text-xs h-9"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                                className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-9"
                            >
                                {createForm.processing ? 'Menyimpan...' : 'Simpan Perangkat Daerah'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit OPD */}
            <Dialog open={editingOpd !== null} onOpenChange={(open) => !open && setEditingOpd(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                            <FileEdit className="size-5 text-teal-600" />
                            Ubah Data Perangkat Daerah
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Perbarui informasi nama resmi, kode, atau kontak Perangkat Daerah.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit_nama" className="text-xs font-semibold">
                                Nama Perangkat Daerah <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="edit_nama"
                                value={editForm.data.nama}
                                onChange={(e) => editForm.setData('nama', e.target.value)}
                                required
                                className="text-sm"
                            />
                            {editForm.errors.nama && (
                                <p className="text-xs text-destructive">{editForm.errors.nama}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit_kode" className="text-xs font-semibold">
                                Kode Singkatan / Akronim
                            </Label>
                            <Input
                                id="edit_kode"
                                value={editForm.data.kode}
                                onChange={(e) => editForm.setData('kode', e.target.value)}
                                className="text-sm font-mono uppercase"
                            />
                            {editForm.errors.kode && (
                                <p className="text-xs text-destructive">{editForm.errors.kode}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit_kontak" className="text-xs font-semibold">
                                Kontak / Nomor Telepon / Email Dinas
                            </Label>
                            <Input
                                id="edit_kontak"
                                value={editForm.data.kontak}
                                onChange={(e) => editForm.setData('kontak', e.target.value)}
                                className="text-sm"
                            />
                            {editForm.errors.kontak && (
                                <p className="text-xs text-destructive">{editForm.errors.kontak}</p>
                            )}
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingOpd(null)}
                                className="text-xs h-9"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                                className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-9"
                            >
                                {editForm.processing ? 'Menyimpan...' : 'Perbarui Perangkat Daerah'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Alert Dialog Konfirmasi Hapus */}
            <AlertDialog open={deletingOpd !== null} onOpenChange={(open) => !open && setDeletingOpd(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Perangkat Daerah?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                            Apakah Anda yakin ingin menghapus data Perangkat Daerah <strong>"{deletingOpd?.nama}"</strong>? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingOpd(null)}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Hapus Sekarang
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
