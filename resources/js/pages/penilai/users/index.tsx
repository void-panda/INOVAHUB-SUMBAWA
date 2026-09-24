import { useState, useMemo } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Award,
    CheckCircle2,
    Eye,
    KeyRound,
    Lock,
    Mail,
    Plus,
    RefreshCw,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Trash2,
    UserCheck,
    UserCog,
    UserPlus,
    Users,
    XCircle,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

type UserItem = {
    id: number;
    name: string;
    email: string;
    nama_pemda: string;
    tipe_inovator: string;
    opd_id: number | null;
    opd_nama: string | null;
    status_aktif: boolean;
    roles: string[];
    role_utama: string;
    created_at: string;
};

type OpdItem = {
    id: number;
    nama: string;
    kode: string | null;
};

type Props = {
    users: UserItem[] | PaginationData<UserItem>;
    roles: string[];
    opdList: OpdItem[];
    metrics: {
        total: number;
        bapperida?: number;
        pendamping: number;
        penilai: number;
        inovator: number;
        pimpinan: number;
    };
};

const roleLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; className: string }> = {
    bapperida: {
        label: 'Superadmin (BAPPERIDA)',
        variant: 'default',
        className: 'bg-emerald-700 hover:bg-emerald-800 text-white font-bold',
    },
    tim_penilai: {
        label: 'Tim Penilai',
        variant: 'default',
        className: 'bg-teal-600 hover:bg-teal-700 text-white font-semibold',
    },
    pendamping: {
        label: 'Pendamping Inovasi',
        variant: 'outline',
        className: 'border-teal-500 text-teal-700 dark:text-teal-400 bg-teal-50/60 dark:bg-teal-950/30 font-semibold',
    },
    inovator: {
        label: 'Inovator (OPD/Masyarakat)',
        variant: 'secondary',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
    },
    pimpinan: {
        label: 'Pimpinan Daerah',
        variant: 'outline',
        className: 'border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50/60 dark:bg-purple-950/30 font-semibold',
    },
};

export default function UserManagementIndex({ users, roles, opdList, metrics }: Props) {
    const isPaginated = Boolean(users && typeof users === 'object' && 'data' in users);
    const userList: UserItem[] = isPaginated
        ? ((users as PaginationData<UserItem>).data ?? [])
        : (Array.isArray(users) ? users : []);
    const pagination = isPaginated ? (users as PaginationData<UserItem>) : undefined;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

    // Form Tambah User
    const addForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'pendamping',
        opd_id: '',
        nama_pemda: '',
        status_aktif: true,
    });

    // Form Edit User
    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'pendamping',
        opd_id: '',
        nama_pemda: '',
        status_aktif: true,
    });

    const handleOpenAdd = () => {
        addForm.reset();
        addForm.setData('role', 'pendamping');
        setIsAddModalOpen(true);
    };

    const handleOpenEdit = (user: UserItem) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role_utama || 'pendamping',
            opd_id: user.opd_id ? String(user.opd_id) : '',
            nama_pemda: user.nama_pemda || '',
            status_aktif: user.status_aktif,
        });
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/penilai/users', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                addForm.reset();
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        editForm.put(`/penilai/users/${editingUser.id}`, {
            onSuccess: () => {
                setEditingUser(null);
                editForm.reset();
            },
        });
    };

    const confirmDelete = () => {
        if (!deletingUser) return;
        router.delete(`/penilai/users/${deletingUser.id}`, {
            onSuccess: () => setDeletingUser(null),
        });
    };

    const toggleStatus = (user: UserItem) => {
        router.patch(`/penilai/users/${user.id}/toggle-status`);
    };

    const columns: Column<UserItem>[] = useMemo(
        () => [
        {
            header: 'Nama & Email',
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                        {row.name}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3 text-muted-foreground/70" />
                        {row.email}
                    </span>
                </div>
            ),
        },
        {
            header: 'Peran / Role',
            cell: (row) => {
                const badgeInfo = roleLabels[row.role_utama] || {
                    label: row.role_utama,
                    variant: 'secondary',
                    className: '',
                };
                return (
                    <Badge variant={badgeInfo.variant} className={`text-xs ${badgeInfo.className}`}>
                        {badgeInfo.label}
                    </Badge>
                );
            },
        },
        {
            header: 'Instansi / OPD',
            cell: (row) => (
                <div className="text-xs text-foreground">
                    <p className="font-medium">{row.opd_nama || row.nama_pemda || 'Pemerintah Kab. Sumbawa'}</p>
                    {row.opd_nama && (
                        <p className="text-[11px] text-muted-foreground">Perangkat Daerah Resmi</p>
                    )}
                </div>
            ),
        },
        {
            header: 'Status Akun',
            cell: (row) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStatus(row)}
                    className="h-7 px-2 text-xs gap-1.5 hover:bg-muted"
                    title="Klik untuk mengubah status aktif"
                >
                    {row.status_aktif ? (
                        <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-700 dark:text-emerald-400 font-medium">Aktif</span>
                        </>
                    ) : (
                        <>
                            <XCircle className="h-3.5 w-3.5 text-destructive" />
                            <span className="text-destructive font-medium">Nonaktif</span>
                        </>
                    )}
                </Button>
            ),
        },
        {
            header: 'Aksi',
            cell: (row) => (
                <div className="flex items-center gap-1.5">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(row)}
                        className="h-8 px-2.5 text-xs gap-1"
                    >
                        <UserCog className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Edit</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingUser(row)}
                        className="h-8 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Hapus Pengguna"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            ),
        },
    ], [toggleStatus, handleOpenEdit, setDeletingUser]);

    const filterOptions = [
        { label: 'Semua Peran', value: 'all' },
        { label: 'Superadmin (BAPPERIDA)', value: 'bapperida' },
        { label: 'Tim Penilai', value: 'tim_penilai' },
        { label: 'Pendamping Inovasi', value: 'pendamping' },
        { label: 'Inovator OPD/Masyarakat', value: 'inovator' },
        { label: 'Pimpinan Daerah', value: 'pimpinan' },
    ];

    return (
        <>
            <Head title="Kelola Pengguna & Hak Akses - INOVA-HUB" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
                {/* Header Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Manajemen Akun & Hak Akses Pengguna
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Kelola akun staf BAPPERIDA (Superadmin), Tim Penilai, Pendamping Inovasi, Inovator OPD, dan Pimpinan Daerah.
                        </p>
                    </div>

                    <Button
                        onClick={handleOpenAdd}
                        size="sm"
                        className="h-9 gap-1.5 text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-xs font-semibold"
                    >
                        <UserPlus className="h-4 w-4" />
                        <span>Tambah Pengguna Baru</span>
                    </Button>
                </div>

                {/* Hero Banner Sumbawa */}
                <HeroBanner
                    badgeIcon={Users}
                    badgeText="Administrasi Akun & RBAC"
                    title="Kelola Pengguna & Penetapan Role"
                    description="Daftarkan pendamping baru untuk mendampingi OPD atau perbarui hak akses pengguna sistem INOVA-HUB Kabupaten Sumbawa."
                    variant="teal"
                />

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
                    <Card className="border-border bg-card shadow-2xs">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <Shield className="h-3.5 w-3.5 text-emerald-700" />
                                BAPPERIDA (Admin)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">
                                {metrics.bapperida ?? 0}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">Superadmin sistem</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-card shadow-2xs">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <Award className="h-3.5 w-3.5 text-teal-600" />
                                Tim Penilai
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-bold text-teal-700 dark:text-teal-400">
                                {metrics.penilai}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">Juri penilai lomba</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-card shadow-2xs">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                                Pendamping
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-bold text-teal-700 dark:text-teal-400">
                                {metrics.pendamping}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">Staf pembina & verifikasi</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-card shadow-2xs">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <Users className="h-3.5 w-3.5 text-blue-600" />
                                Inovator
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                                {metrics.inovator}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">OPD & Masyarakat</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-card shadow-2xs col-span-2 sm:col-span-1">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <UserCheck className="h-3.5 w-3.5 text-purple-600" />
                                Total Pengguna
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-bold text-foreground">
                                {metrics.total}
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1">Akun terdaftar</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Pengguna */}
                <Card className="border-border bg-card shadow-2xs">
                    <CardContent className="p-4 sm:p-6">
                        <DataTable
                            data={userList}
                            columns={columns}
                            pagination={pagination}
                            searchPlaceholder="Cari nama pengguna, email, atau OPD..."
                            filterOptions={filterOptions}
                            filterKey={(row) => row.role_utama}
                            emptyTitle="Tidak Ada Pengguna"
                            emptyDescription="Belum ada data pengguna yang sesuai dengan filter pencarian."
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Modal Tambah Pengguna Baru */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-bold">
                            <UserPlus className="h-5 w-5 text-teal-600" />
                            Tambah Pengguna Baru
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Isi formulir berikut untuk mendaftarkan akun staf BAPPERIDA, Tim Penilai, Pendamping, atau Inovator baru.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitAdd} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="add-name" className="text-xs font-semibold">
                                Nama Lengkap <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="add-name"
                                placeholder="Contoh: Budi Santoso, S.STP"
                                value={addForm.data.name}
                                onChange={(e) => addForm.setData('name', e.target.value)}
                                className="h-9 text-xs"
                                required
                            />
                            {addForm.errors.name && (
                                <p className="text-[11px] text-destructive">{addForm.errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="add-email" className="text-xs font-semibold">
                                Email (Login ID) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="add-email"
                                type="email"
                                placeholder="nama@sumbawakab.go.id"
                                value={addForm.data.email}
                                onChange={(e) => addForm.setData('email', e.target.value)}
                                className="h-9 text-xs"
                                required
                            />
                            {addForm.errors.email && (
                                <p className="text-[11px] text-destructive">{addForm.errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="add-password" className="text-xs font-semibold">
                                Password Awal <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="add-password"
                                type="password"
                                placeholder="Minimal 8 karakter"
                                value={addForm.data.password}
                                onChange={(e) => addForm.setData('password', e.target.value)}
                                className="h-9 text-xs"
                                required
                            />
                            {addForm.errors.password && (
                                <p className="text-[11px] text-destructive">{addForm.errors.password}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="add-role" className="text-xs font-semibold">
                                    Peran / Role <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={addForm.data.role}
                                    onValueChange={(val) => addForm.setData('role', val)}
                                >
                                    <SelectTrigger id="add-role" className="h-9 text-xs">
                                        <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bapperida">Superadmin (BAPPERIDA)</SelectItem>
                                        <SelectItem value="tim_penilai">Tim Penilai</SelectItem>
                                        <SelectItem value="pendamping">Pendamping Inovasi</SelectItem>
                                        <SelectItem value="inovator">Inovator (OPD/Masyarakat)</SelectItem>
                                        <SelectItem value="pimpinan">Pimpinan Daerah</SelectItem>
                                    </SelectContent>
                                </Select>
                                {addForm.errors.role && (
                                    <p className="text-[11px] text-destructive">{addForm.errors.role}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="add-opd" className="text-xs font-semibold">
                                    Perangkat Daerah (OPD)
                                </Label>
                                <Select
                                    value={addForm.data.opd_id}
                                    onValueChange={(val) => addForm.setData('opd_id', val)}
                                >
                                    <SelectTrigger id="add-opd" className="h-9 text-xs">
                                        <SelectValue placeholder="Pilih OPD (Opsional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">-- Bukan OPD Tertentu / Umum --</SelectItem>
                                        {opdList.map((opd) => (
                                            <SelectItem key={opd.id} value={String(opd.id)}>
                                                {opd.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-xs"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={addForm.processing}
                                className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                            >
                                {addForm.processing ? 'Menyimpan...' : 'Simpan Pengguna'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Pengguna */}
            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-bold">
                            <UserCog className="h-5 w-5 text-teal-600" />
                            Edit Data & Hak Akses Pengguna
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Perbarui informasi profil, penugasan OPD, atau ubah peran pengguna di sistem.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitEdit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-name" className="text-xs font-semibold">
                                Nama Lengkap <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                className="h-9 text-xs"
                                required
                            />
                            {editForm.errors.name && (
                                <p className="text-[11px] text-destructive">{editForm.errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-email" className="text-xs font-semibold">
                                Email (Login ID) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) => editForm.setData('email', e.target.value)}
                                className="h-9 text-xs"
                                required
                            />
                            {editForm.errors.email && (
                                <p className="text-[11px] text-destructive">{editForm.errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-password" className="text-xs font-semibold">
                                Password Baru <span className="text-muted-foreground font-normal">(Kosongkan jika tidak diubah)</span>
                            </Label>
                            <Input
                                id="edit-password"
                                type="password"
                                placeholder="Biarkan kosong jika tetap menggunakan password lama"
                                value={editForm.data.password}
                                onChange={(e) => editForm.setData('password', e.target.value)}
                                className="h-9 text-xs"
                            />
                            {editForm.errors.password && (
                                <p className="text-[11px] text-destructive">{editForm.errors.password}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-role" className="text-xs font-semibold">
                                    Peran / Role <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={editForm.data.role}
                                    onValueChange={(val) => editForm.setData('role', val)}
                                >
                                    <SelectTrigger id="edit-role" className="h-9 text-xs">
                                        <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bapperida">Superadmin (BAPPERIDA)</SelectItem>
                                        <SelectItem value="tim_penilai">Tim Penilai</SelectItem>
                                        <SelectItem value="pendamping">Pendamping Inovasi</SelectItem>
                                        <SelectItem value="inovator">Inovator (OPD/Masyarakat)</SelectItem>
                                        <SelectItem value="pimpinan">Pimpinan Daerah</SelectItem>
                                    </SelectContent>
                                </Select>
                                {editForm.errors.role && (
                                    <p className="text-[11px] text-destructive">{editForm.errors.role}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-opd" className="text-xs font-semibold">
                                    Perangkat Daerah (OPD)
                                </Label>
                                <Select
                                    value={editForm.data.opd_id || 'none'}
                                    onValueChange={(val) => editForm.setData('opd_id', val === 'none' ? '' : val)}
                                >
                                    <SelectTrigger id="edit-opd" className="h-9 text-xs">
                                        <SelectValue placeholder="Pilih OPD" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">-- Bukan OPD Tertentu / Umum --</SelectItem>
                                        {opdList.map((opd) => (
                                            <SelectItem key={opd.id} value={String(opd.id)}>
                                                {opd.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingUser(null)}
                                className="text-xs"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={editForm.processing}
                                className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                            >
                                {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Alert Dialog Konfirmasi Hapus */}
            <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                            <ShieldAlert className="h-5 w-5" />
                            Hapus Pengguna Sistem?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs">
                            Apakah Anda yakin ingin menghapus akun pengguna <strong>{deletingUser?.name}</strong> ({deletingUser?.email})?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-xs">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="text-xs bg-destructive hover:bg-destructive/90 text-white font-semibold"
                        >
                            Hapus Pengguna
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
