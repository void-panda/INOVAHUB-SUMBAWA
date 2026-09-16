import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Building2, ShieldCheck, Trash2, User, UserPlus, Users } from 'lucide-react';
import { HeroBanner } from '@/components/hero-banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Column } from '@/components/ui/data-table';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Penugasan Pendamping', href: '/penugasan-pendamping' },
];

type PendampingUser = { id: number; name: string; email: string; nama_pemda: string };
type OpdItem = { id: number; nama: string; kode: string | null };
type InovatorUser = { id: number; name: string; email: string; nama_pemda: string };
type PenugasanItem = {
    id: number;
    pendamping: PendampingUser;
    opd?: OpdItem | null;
    inovator?: InovatorUser | null;
};

type Props = {
    penugasan: PenugasanItem[];
    pendampingList: PendampingUser[];
    opdList: OpdItem[];
    inovatorList: InovatorUser[];
    periode?: { tahun: number; nama: string };
};

export default function PenugasanIndex({ penugasan, pendampingList, opdList, inovatorList, periode }: Props) {
    const [targetMode, setTargetMode] = useState<'opd' | 'inovator'>('opd');
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        pendamping_id: '',
        opd_id: '',
        inovator_id: '',
    });

    const quickAddForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'pendamping',
        opd_id: '',
        nama_pemda: 'Bappeda Litbang Kab. Sumbawa',
        status_aktif: true,
    });

    const handleQuickAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        quickAddForm.post('/penilai/users', {
            onSuccess: () => {
                setIsQuickAddOpen(false);
                quickAddForm.reset();
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/penugasan-pendamping', {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus penugasan pendamping ini?')) {
            destroy(`/penugasan-pendamping/${id}`);
        }
    };

    const columns: Column<PenugasanItem>[] = [
        {
            header: 'Pendamping Inovasi',
            cell: (row) => (
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="font-semibold text-foreground">{row.pendamping?.name}</div>
                        <div className="text-[11px] text-muted-foreground">{row.pendamping?.email}</div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Target Binaan (OPD / Inovator)',
            cell: (row) => (
                row.opd ? (
                    <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-medium text-foreground">{row.opd.nama}</span>
                    </div>
                ) : row.inovator ? (
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary shrink-0" />
                        <div>
                            <span className="font-medium text-foreground block">{row.inovator.name}</span>
                            <span className="text-[11px] text-muted-foreground">{row.inovator.nama_pemda}</span>
                        </div>
                    </div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                )
            ),
        },
        {
            header: 'Aksi',
            align: 'right',
            cell: (row) => (
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(row.id)}
                >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Hapus
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Manajemen Penugasan Pendamping" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Header Hero Banner */}
                <HeroBanner
                    badgeIcon={Users}
                    badgeText={`Assignment Control • Periode ${periode?.tahun || '2026'}`}
                    title="Penugasan Pendamping Inovasi"
                    description="Tetapkan Pendamping Inovasi untuk masing-masing Perangkat Daerah (OPD) binaan Kabupaten Sumbawa."
                />

                {/* Form Penugasan Baru */}
                <Card className="border border-border/80 shadow-sm overflow-hidden">
                    <CardHeader className="py-4 px-6 bg-muted/20 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                                <UserPlus className="h-4 w-4 text-primary" /> Tambah Penugasan Pendamping Baru
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Alokasikan Pendamping Inovasi untuk membina Perangkat Daerah (OPD) atau akun Inovator tertentu.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 md:p-6 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {/* Left Side: Pendamping Selection */}
                                <div className="lg:col-span-5 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="pendamping_id" className="text-xs font-semibold text-foreground">
                                            Pendamping Inovasi <span className="text-destructive">*</span>
                                        </Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsQuickAddOpen(true)}
                                            className="h-6 px-2 text-[11px] text-teal-600 hover:text-teal-700 dark:text-teal-400 gap-1 font-semibold hover:bg-teal-50 dark:hover:bg-teal-950/40"
                                        >
                                            <UserPlus className="h-3 w-3" />
                                            + Tambah Pendamping Baru
                                        </Button>
                                    </div>
                                    <Select
                                        value={data.pendamping_id}
                                        onValueChange={(val) => setData('pendamping_id', val)}
                                    >
                                        <SelectTrigger id="pendamping_id" className="h-10 text-xs w-full bg-background hover:bg-accent/40 transition-colors">
                                            <SelectValue placeholder="-- Pilih Pendamping Inovasi --" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            {pendampingList.map((p) => (
                                                <SelectItem key={p.id} value={String(p.id)}>
                                                    {p.name} ({p.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.pendamping_id && (
                                        <p className="text-destructive text-[11px] mt-1 font-medium">{errors.pendamping_id}</p>
                                    )}
                                    <p className="text-[11px] text-muted-foreground">
                                        Akun pendamping terdaftar yang bertugas memverifikasi kelayakan data inovasi.
                                    </p>
                                </div>

                                {/* Right Side: Target Selection */}
                                <div className="lg:col-span-7 space-y-3 pl-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-border/60 pt-4 lg:pt-0">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <Label className="text-xs font-semibold text-foreground">
                                            Target Binaan (Pilih Salah Satu) <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="flex rounded-lg border bg-muted/50 p-0.5 text-xs font-medium">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setTargetMode('opd');
                                                    setData((prev) => ({ ...prev, inovator_id: '' }));
                                                }}
                                                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                                                    targetMode === 'opd'
                                                        ? 'bg-background text-foreground shadow-xs font-semibold'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                            >
                                                <Building2 className="h-3.5 w-3.5 text-primary" />
                                                Target OPD
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setTargetMode('inovator');
                                                    setData((prev) => ({ ...prev, opd_id: '' }));
                                                }}
                                                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                                                    targetMode === 'inovator'
                                                        ? 'bg-background text-foreground shadow-xs font-semibold'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                            >
                                                <User className="h-3.5 w-3.5 text-emerald-600" />
                                                Inovator Spesifik
                                            </button>
                                        </div>
                                    </div>

                                    {targetMode === 'opd' ? (
                                        <div className="space-y-2">
                                            <Select
                                                value={data.opd_id}
                                                onValueChange={(val) => {
                                                    setData((prev) => ({ ...prev, opd_id: val, inovator_id: '' }));
                                                }}
                                            >
                                                <SelectTrigger id="opd_id" className="h-10 text-xs w-full bg-background hover:bg-accent/40 transition-colors">
                                                    <SelectValue placeholder="-- Pilih Perangkat Daerah (OPD) Binaan --" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-60">
                                                    {opdList.map((o) => (
                                                        <SelectItem key={o.id} value={String(o.id)}>
                                                            {o.nama}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.opd_id && (
                                                <p className="text-destructive text-[11px] mt-1 font-medium">{errors.opd_id}</p>
                                            )}
                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                                                Pendamping akan membina <strong>seluruh usulan inovasi</strong> dari OPD ini.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Select
                                                value={data.inovator_id}
                                                onValueChange={(val) => {
                                                    setData((prev) => ({ ...prev, inovator_id: val, opd_id: '' }));
                                                }}
                                            >
                                                <SelectTrigger id="inovator_id" className="h-10 text-xs w-full bg-background hover:bg-accent/40 transition-colors">
                                                    <SelectValue placeholder="-- Pilih Akun Inovator Spesifik --" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-60">
                                                    {inovatorList.map((inv) => (
                                                        <SelectItem key={inv.id} value={String(inv.id)}>
                                                            {inv.name} ({inv.nama_pemda})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.inovator_id && (
                                                <p className="text-destructive text-[11px] mt-1 font-medium">{errors.inovator_id}</p>
                                            )}
                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                <User className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                                Pendamping khusus untuk mendampingi akun inovator perorangan / masyarakat tertentu.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Footer Action */}
                            <div className="pt-4 border-t flex items-center justify-between gap-4">
                                <span className="text-xs text-muted-foreground italic hidden sm:inline">
                                    *) Pilih pendamping & target binaan sebelum menyimpan penugasan.
                                </span>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.pendamping_id || (!data.opd_id && !data.inovator_id)}
                                    className="gap-2"
                                >
                                    <UserPlus className="h-4 w-4" /> Simpan Penugasan Baru
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Daftar Penugasan dengan DataTable */}
                <DataTable
                    data={penugasan}
                    columns={columns}
                    searchPlaceholder="Cari pendamping atau OPD..."
                    searchKey={(row) => `${row.pendamping?.name} ${row.pendamping?.email} ${row.opd?.nama} ${row.inovator?.name}`}
                    emptyTitle="Belum Ada Penugasan"
                    emptyDescription="Belum ada penugasan pendamping yang terdaftar untuk periode aktif ini."
                />
            </div>

            {/* Quick Add Pendamping Dialog */}
            <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-bold">
                            <UserPlus className="h-5 w-5 text-teal-600" />
                            Tambah Akun Pendamping Baru
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Daftarkan staf Bappeda baru sebagai Pendamping Inovasi. Akun yang dibuat akan langsung tersedia di dropdown penugasan.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleQuickAddSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="quick-name" className="text-xs font-semibold">
                                Nama Lengkap & Gelar <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="quick-name"
                                placeholder="Contoh: Rina Rahmawati, S.STP"
                                value={quickAddForm.data.name}
                                onChange={(e) => quickAddForm.setData('name', e.target.value)}
                                className="h-9 text-xs"
                                required
                            />
                            {quickAddForm.errors.name && (
                                <p className="text-[11px] text-destructive">{quickAddForm.errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="quick-email" className="text-xs font-semibold">
                                Email (Login ID) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="quick-email"
                                type="email"
                                placeholder="pendamping@sumbawakab.go.id"
                                value={quickAddForm.data.email}
                                onChange={(e) => quickAddForm.setData('email', e.target.value)}
                                className="h-9 text-xs"
                                required
                            />
                            {quickAddForm.errors.email && (
                                <p className="text-[11px] text-destructive">{quickAddForm.errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="quick-password" className="text-xs font-semibold">
                                Password Awal <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="quick-password"
                                type="password"
                                placeholder="Minimal 8 karakter"
                                value={quickAddForm.data.password}
                                onChange={(e) => quickAddForm.setData('password', e.target.value)}
                                className="h-9 text-xs"
                                required
                            />
                            {quickAddForm.errors.password && (
                                <p className="text-[11px] text-destructive">{quickAddForm.errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="quick-opd" className="text-xs font-semibold">
                                Instansi / Unit Kerja
                            </Label>
                            <Select
                                value={quickAddForm.data.opd_id || 'none'}
                                onValueChange={(val) => quickAddForm.setData('opd_id', val === 'none' ? '' : val)}
                            >
                                <SelectTrigger id="quick-opd" className="h-9 text-xs">
                                    <SelectValue placeholder="Pilih Instansi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Bappeda Litbang Kab. Sumbawa (Default)</SelectItem>
                                    {opdList.map((opd) => (
                                        <SelectItem key={opd.id} value={String(opd.id)}>
                                            {opd.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsQuickAddOpen(false)}
                                className="text-xs"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={quickAddForm.processing}
                                className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                            >
                                {quickAddForm.processing ? 'Menyimpan...' : 'Daftarkan Pendamping'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

PenugasanIndex.layout = {
    breadcrumbs,
};
