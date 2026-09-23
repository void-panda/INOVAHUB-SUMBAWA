import { Head, useForm } from '@inertiajs/react';
import {
    Layers,
    Pencil,
    Plus,
    Sliders,
} from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import type { BreadcrumbItem } from '@/types';

export interface ParameterOption {
    id: string;
    label: string;
    bobot: number | string;
}

interface Indikator {
    id: number;
    kode: string;
    nama: string;
    variabel: string | null;
    informasi?: string | null;
    bobot: string | number;
    p1: string | null;
    p2: string | null;
    p3: string | null;
    opsi?: ParameterOption[] | null;
    opsi_list?: ParameterOption[];
}

interface Props {
    spdList: Indikator[];
    sidList: Indikator[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Master Indikator Penilaian', href: '/penilai/indikator' },
];

export default function MasterIndikatorIndex({ spdList, sidList }: Props) {
    const [activeTab, setActiveTab] = useState<'spd' | 'sid'>('sid');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Indikator | null>(null);

    const form = useForm<{
        kode: string;
        nama: string;
        variabel: string;
        informasi: string;
        bobot: string;
    }>({
        kode: '',
        nama: '',
        variabel: '',
        informasi: '',
        bobot: '1',
    });

    const openCreateModal = useCallback(() => {
        setEditingItem(null);
        form.reset();
        form.setData({
            kode: '',
            nama: '',
            variabel: '',
            informasi: '',
            bobot: '1',
        });
        setDialogOpen(true);
    }, [form]);

    const openEditModal = useCallback((item: Indikator) => {
        setEditingItem(item);
        const normalizedBobot = Number(item.bobot).toString();
        form.setData({
            kode: item.kode,
            nama: item.nama,
            variabel: item.variabel ?? '',
            informasi: item.informasi ?? '',
            bobot: normalizedBobot,
        });
        setDialogOpen(true);
    }, [form]);

    const bobotOptions = useMemo(() => {
        const baseOptions = activeTab === 'sid'
            ? [
                { value: '1', label: '1 — Bobot 1 (Standar / Operasional)' },
                { value: '2', label: '2 — Bobot 2 (Menengah / Signifikan)' },
                { value: '3', label: '3 — Bobot 3 (Tinggi / Kunci)' },
                { value: '4', label: '4 — Bobot 4 (Kritis / Maksimal)' },
            ]
            : [
                { value: '1', label: '1.0 — Bobot 1.0 (Standar)' },
                { value: '1.5', label: '1.5 — Bobot 1.5 (Menengah)' },
                { value: '2', label: '2.0 — Bobot 2.0 (Tinggi)' },
            ];

        if (form.data.bobot && !baseOptions.some((opt) => opt.value === form.data.bobot)) {
            return [
                ...baseOptions,
                { value: form.data.bobot, label: `${form.data.bobot} — Nilai Khusus` },
            ];
        }

        return baseOptions;
    }, [activeTab, form.data.bobot]);

    const currentPrefix = activeTab === 'spd' ? 'SPD-' : 'SID-';

    const kodeSuffix = useMemo(() => {
        if (!form.data.kode) return '';
        if (form.data.kode.startsWith(currentPrefix)) {
            return form.data.kode.slice(currentPrefix.length);
        }
        return form.data.kode.replace(/^(SPD-|SID-)/i, '');
    }, [form.data.kode, currentPrefix]);

    const handleSuffixChange = (val: string) => {
        const cleaned = val.replace(/^(SPD-|SID-)/i, '').trim();
        form.setData('kode', cleaned ? `${currentPrefix}${cleaned}` : '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = activeTab === 'spd'
            ? (editingItem ? `/penilai/indikator/spd/${editingItem.id}` : '/penilai/indikator/spd')
            : (editingItem ? `/penilai/indikator/sid/${editingItem.id}` : '/penilai/indikator/sid');

        if (editingItem) {
            form.put(url, {
                onSuccess: () => {
                    setDialogOpen(false);
                    setEditingItem(null);
                    form.reset();
                },
            });
        } else {
            form.post(url, {
                onSuccess: () => {
                    setDialogOpen(false);
                    form.reset();
                },
            });
        }
    };

    const currentList = activeTab === 'spd' ? spdList : sidList;

    const columns: Column<Indikator>[] = useMemo(() => [
        {
            header: 'Kode',
            accessorKey: 'kode',
            sortable: true,
            cell: (row) => (
                <Badge variant="outline" className="font-mono text-xs font-bold">
                    {row.kode}
                </Badge>
            ),
        },
        {
            header: 'Nama Indikator',
            accessorKey: 'nama',
            sortable: true,
            cell: (row) => (
                <div className="font-semibold text-foreground">{row.nama}</div>
            ),
        },
        {
            header: 'Variabel / Catatan Ambang',
            accessorKey: 'variabel',
            cell: (row) => (
                <span className="text-xs text-muted-foreground truncate max-w-xs block">
                    {row.variabel || '-'}
                </span>
            ),
        },
        {
            header: 'Bobot',
            accessorKey: 'bobot',
            sortable: true,
            align: 'center',
            cell: (row) => (
                <span className="font-bold text-primary">{row.bobot}</span>
            ),
        },
        {
            header: 'Opsi Parameter',
            cell: (row) => {
                const count = (row.opsi_list && row.opsi_list.length > 0)
                    ? row.opsi_list.length
                    : (row.opsi && row.opsi.length > 0)
                        ? row.opsi.length
                        : [row.p1, row.p2, row.p3].filter(Boolean).length;
                return (
                    <div className="flex items-center gap-1.5">
                        <Badge
                            variant="secondary"
                            className="font-medium text-xs bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200/60 dark:border-teal-800/60"
                        >
                            {count} Opsi
                        </Badge>
                    </div>
                );
            },
        },
        {
            header: 'Aksi',
            align: 'right',
            cell: (row) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs gap-1 cursor-pointer"
                    onClick={() => openEditModal(row)}
                >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
            ),
        },
    ], [openEditModal]);

    return (
        <>
            <Head title="Master Indikator Penilaian" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Header Hero Banner */}
                <HeroBanner
                    badgeIcon={Sliders}
                    badgeText="Master Configuration"
                    title="Master Data Indikator & Bobot Penilaian"
                    description="Kelola bobot dan parameter ambang indikator Satuan Pemerintahan Daerah (SPD) dan Satuan Inovasi Daerah (SID) secara dinamis."
                >
                    <Button
                        onClick={openCreateModal}
                        className="gap-2 bg-background text-foreground hover:bg-background/90 shadow-xs cursor-pointer"
                    >
                        <Plus className="h-4 w-4" /> Tambah Indikator {activeTab.toUpperCase()}
                    </Button>
                </HeroBanner>

                {/* Tab Switcher */}
                <div className="flex rounded-lg border bg-muted/60 p-1 w-fit text-sm">
                    <button
                        onClick={() => setActiveTab('sid')}
                        className={`px-4 py-2 rounded-md font-semibold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'sid'
                                ? 'bg-background text-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Layers className="h-4 w-4 text-primary" />
                        Indikator SID ({sidList.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('spd')}
                        className={`px-4 py-2 rounded-md font-semibold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'spd'
                                ? 'bg-background text-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Layers className="h-4 w-4 text-primary" />
                        Indikator SPD ({spdList.length})
                    </button>
                </div>

                <DataTable
                    data={currentList}
                    columns={columns}
                    searchPlaceholder={`Cari kode atau nama indikator ${activeTab.toUpperCase()}...`}
                    searchKey={(row) => `${row.kode} ${row.nama} ${row.variabel}`}
                    emptyTitle={`Belum Ada Indikator ${activeTab.toUpperCase()}`}
                    emptyDescription="Klik tombol 'Tambah Indikator' untuk membuat indikator baru."
                />
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-xl">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-base md:text-lg font-bold">
                                {editingItem ? 'Edit' : 'Tambah'} Indikator {activeTab.toUpperCase()}
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Masukkan kode, nama, dan bobot pengali indikator sesuai standar Kemendagri.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="kode_suffix" className="text-xs font-semibold">
                                        Kode Indikator <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="flex h-9 items-stretch mt-1 rounded-md border border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] transition-[color,box-shadow] overflow-hidden">
                                        <div className="flex items-center justify-center px-3 bg-muted/80 border-r border-input text-xs font-mono font-bold text-muted-foreground select-none">
                                            {currentPrefix}
                                        </div>
                                        <input
                                            id="kode_suffix"
                                            type="text"
                                            value={kodeSuffix}
                                            onChange={(e) => handleSuffixChange(e.target.value)}
                                            placeholder="01"
                                            className="flex-1 min-w-0 bg-transparent px-3 py-1 text-xs font-mono text-foreground focus:outline-none placeholder:text-muted-foreground"
                                            required
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        Prefix <code className="font-mono text-primary font-semibold">{currentPrefix}</code> disematkan otomatis.
                                    </p>
                                    {form.errors.kode && (
                                        <p className="text-xs text-destructive mt-1">{form.errors.kode}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="bobot" className="text-xs font-semibold">
                                        Bobot Pengali Indikator<span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={form.data.bobot}
                                        onValueChange={(val) => form.setData('bobot', val)}
                                    >
                                        <SelectTrigger id="bobot" className="text-xs mt-1 w-full bg-background cursor-pointer">
                                            <SelectValue placeholder="Pilih bobot pengali" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {bobotOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        {activeTab === 'sid'
                                            ? 'Pilihan baku Kemendagri: 1, 2, 3, atau 4 (mencegah input desimal bebas).'
                                            : 'Pilihan baku Kemendagri: 1.0, 1.5, atau 2.0.'}
                                    </p>
                                    {form.errors.bobot && (
                                        <p className="text-xs text-destructive mt-1">{form.errors.bobot}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="nama" className="text-xs font-semibold">
                                    Nama Indikator <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="nama"
                                    value={form.data.nama}
                                    onChange={(e) => form.setData('nama', e.target.value)}
                                    placeholder="e.g. Regulasi Inovasi Daerah"
                                    className="text-xs mt-1"
                                    required
                                />
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    Nama lengkap indikator penilaian kematangan inovasi daerah.
                                </p>
                                {form.errors.nama && (
                                    <p className="text-xs text-destructive mt-1">{form.errors.nama}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="variabel" className="text-xs font-semibold">
                                    Variabel / Catatan Ambang
                                </Label>
                                <Input
                                    id="variabel"
                                    value={form.data.variabel}
                                    onChange={(e) => form.setData('variabel', e.target.value)}
                                    placeholder="Opsional, penjelasan variabel..."
                                    className="text-xs mt-1"
                                />
                            </div>

                            {activeTab === 'sid' && (
                                <div>
                                    <Label htmlFor="informasi" className="text-xs font-semibold">
                                        Petunjuk Teknis Bukti Dukung (Informasi)
                                    </Label>
                                    <Textarea
                                        id="informasi"
                                        rows={3}
                                        value={form.data.informasi}
                                        onChange={(e) => form.setData('informasi', e.target.value)}
                                        placeholder="Petunjuk teknis dokumen atau bukti yang harus diunggah inovator..."
                                        className="text-xs mt-1"
                                    />
                                </div>
                            )}
                        </div>

                        <DialogFooter className="mt-4 gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setDialogOpen(false)}
                                disabled={form.processing}
                                className="text-xs"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                {form.processing ? (
                                    <>
                                        <Spinner className="mr-1.5 h-3.5 w-3.5" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Indikator'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

MasterIndikatorIndex.layout = {
    breadcrumbs,
};
