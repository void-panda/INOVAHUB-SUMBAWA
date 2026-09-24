import { Head, useForm } from '@inertiajs/react';
import {
    Info,
    Layers,
    Pencil,
    Plus,
    Sliders,
    Trash2,
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
    bobot?: string | number;
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
        opsi: ParameterOption[];
    }>({
        kode: '',
        nama: '',
        variabel: '',
        informasi: '',
        bobot: '1',
        opsi: [
            { id: 'p1', label: '', bobot: 1 },
            { id: 'p2', label: '', bobot: 2 },
            { id: 'p3', label: '', bobot: 3 },
        ],
    });

    const calculateMaxBobot = (options: ParameterOption[]): string => {
        if (!options || options.length === 0) return '1';
        const max = Math.max(...options.map((o) => Number(o.bobot) || 0));
        return String(max > 0 ? max : 1);
    };

    const openCreateModal = useCallback(() => {
        setEditingItem(null);
        form.reset();
        const initialOpsi = [
            { id: 'p1', label: '', bobot: 1 },
            { id: 'p2', label: '', bobot: 2 },
            { id: 'p3', label: '', bobot: 3 },
        ];
        form.setData({
            kode: '',
            nama: '',
            variabel: '',
            informasi: '',
            bobot: calculateMaxBobot(initialOpsi),
            opsi: initialOpsi,
        });
        setDialogOpen(true);
    }, [form]);

    const openEditModal = useCallback((item: Indikator) => {
        setEditingItem(item);
        const existingOpsi = item.opsi_list || item.opsi;
        let initialOpsi: ParameterOption[] = [];

        if (existingOpsi && existingOpsi.length > 0) {
            initialOpsi = existingOpsi.map((o, idx) => ({
                id: o.id || `p${idx + 1}`,
                label: o.label || '',
                bobot: o.bobot ?? (idx + 1),
            }));
        } else {
            initialOpsi = [
                { id: 'p1', label: item.p1 ?? '', bobot: 1 },
                { id: 'p2', label: item.p2 ?? '', bobot: 2 },
                { id: 'p3', label: item.p3 ?? '', bobot: 3 },
            ];
        }

        form.setData({
            kode: item.kode,
            nama: item.nama,
            variabel: item.variabel ?? '',
            informasi: item.informasi ?? '',
            bobot: calculateMaxBobot(initialOpsi),
            opsi: initialOpsi,
        });
        setDialogOpen(true);
    }, [form]);

    const addOption = () => {
        const nextIdx = form.data.opsi.length + 1;
        const newOptions = [
            ...form.data.opsi,
            { id: `p${nextIdx}`, label: '', bobot: nextIdx },
        ];
        form.setData({
            ...form.data,
            opsi: newOptions,
            bobot: calculateMaxBobot(newOptions),
        });
    };

    const removeOption = (index: number) => {
        if (form.data.opsi.length <= 1) return;
        const next = form.data.opsi.filter((_, idx) => idx !== index);
        form.setData({
            ...form.data,
            opsi: next,
            bobot: calculateMaxBobot(next),
        });
    };

    const updateOption = (index: number, field: keyof ParameterOption, value: any) => {
        const next = [...form.data.opsi];
        next[index] = { ...next[index], [field]: value };
        form.setData({
            ...form.data,
            opsi: next,
            bobot: field === 'bobot' ? calculateMaxBobot(next) : form.data.bobot,
        });
    };

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
                <div className="font-semibold text-foreground text-xs sm:text-sm">{row.nama}</div>
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
            align: 'center',
            cell: (row) => (
                <span className="font-bold text-xs">
                    {Number(row.bobot ?? 1).toFixed(0)}
                </span>
            ),
        },
        {
            header: 'Kriteria Parameter & Bobot Poin',
            cell: (row) => {
                const list = row.opsi_list || row.opsi || [];
                if (list.length > 0) {
                    return (
                        <div className="flex flex-col gap-1.5 text-[11px] max-w-sm py-1">
                            {list.map((o, idx) => (
                                <div key={idx} className="flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.5 rounded font-bold text-[9px] bg-teal-500/10 text-teal-700 dark:text-teal-300 shrink-0 font-mono">
                                        {o.id || `P${idx + 1}`} ({o.bobot} pt)
                                    </span>
                                    <span className="truncate text-muted-foreground" title={o.label}>
                                        {o.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    );
                }

                const p1Text = row.p1 || '-';
                const p2Text = row.p2 || '-';
                const p3Text = row.p3 || '-';

                return (
                    <div className="flex flex-col gap-1 text-[11px] max-w-sm py-1">
                        <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded font-bold text-[9px] bg-amber-500/10 text-amber-700 dark:text-amber-300 shrink-0 font-mono">
                                P1 (1 pt)
                            </span>
                            <span className="truncate text-muted-foreground" title={p1Text}>
                                {p1Text}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded font-bold text-[9px] bg-teal-500/10 text-teal-700 dark:text-teal-300 shrink-0 font-mono">
                                P2 (2 pt)
                            </span>
                            <span className="truncate text-muted-foreground" title={p2Text}>
                                {p2Text}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded font-bold text-[9px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shrink-0 font-mono">
                                P3 (3 pt)
                            </span>
                            <span className="truncate text-muted-foreground" title={p3Text}>
                                {p3Text}
                            </span>
                        </div>
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
                    title="Master Data Indikator & Parameter Penilaian"
                    description="Kelola kriteria pemenuhan parameter ambang (P1, P2, P3) untuk Satuan Pemerintahan Daerah (SPD) dan Satuan Inovasi Daerah (SID)."
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
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-base md:text-lg font-bold">
                                {editingItem ? 'Edit' : 'Tambah'} Indikator {activeTab.toUpperCase()}
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Masukkan kode, nama indikator, dan susun kriteria opsi pemenuhan parameter.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="kode_suffix" className="text-xs font-semibold">
                                    Kode Indikator <span className="text-destructive">*</span>
                                </Label>
                                <div className="flex h-9 items-stretch mt-1 rounded-md border border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] transition-[color,box-shadow] overflow-hidden max-w-xs">
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

                            {/* DAFTAR OPSI PARAMETER */}
                            <div className="space-y-3 border-t border-border pt-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                                                DAFTAR OPSI PARAMETER
                                            </h4>
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 border-teal-300"
                                            >
                                                Maks Skor: {form.data.bobot} Poin
                                            </Badge>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                            Tiap opsi parameter akan muncul di dropdown pilihan inovator beserta nilai bobot poinnya.
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addOption}
                                        className="h-8 text-xs gap-1 border-dashed text-primary hover:bg-primary/5 cursor-pointer self-start sm:self-auto shrink-0"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Tambah Opsi Parameter
                                    </Button>
                                </div>

                                {/* Callout Otomatis Opsi Nol */}
                                <div className="flex items-start gap-2 p-2.5 rounded-md bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200">
                                    <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                                    <p className="text-[11px] leading-relaxed">
                                        <strong>Catatan:</strong> Opsi standar <em>"Tidak Dapat Diukur" (Bobot 0)</em> otomatis disediakan oleh sistem saat inovator melengkapi indikator. Anda hanya perlu menyusun opsi-opsi capaian parameter di bawah ini.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {form.data.opsi.map((opt, idx) => (
                                        <div key={idx} className="p-3.5 rounded-lg border border-border bg-card space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-foreground">Opsi {idx + 1}</span>
                                                    <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground px-1.5 py-0">
                                                        {opt.id || `p${idx + 1}`}
                                                    </Badge>
                                                </div>
                                                {form.data.opsi.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeOption(idx)}
                                                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                                        title="Hapus Opsi"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                                <div className="sm:col-span-9 space-y-1">
                                                    <Label className="text-xs font-semibold text-foreground">
                                                        Teks Kriteria / Deskripsi Pemenuhan <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        value={opt.label}
                                                        onChange={(e) => updateOption(idx, 'label', e.target.value)}
                                                        placeholder="Contoh: SK Kepala Perangkat Daerah / OPD"
                                                        className="text-xs h-9"
                                                        required
                                                    />
                                                </div>
                                                <div className="sm:col-span-3 space-y-1">
                                                    <Label className="text-xs font-semibold text-foreground">
                                                        Bobot Poin <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.5"
                                                        value={opt.bobot}
                                                        onChange={(e) => updateOption(idx, 'bobot', e.target.value)}
                                                        className="text-xs h-9"
                                                        required
                                                    />
                                                    <p className="text-[10px] text-muted-foreground">
                                                        Skor pilihan ini
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
