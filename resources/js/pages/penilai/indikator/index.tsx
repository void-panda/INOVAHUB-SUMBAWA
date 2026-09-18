import { Head, useForm } from '@inertiajs/react';
import { Layers, Pencil, Plus, Sliders, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Column } from '@/components/ui/data-table';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

    const [optionsList, setOptionsList] = useState<ParameterOption[]>([
        { id: 'p1', label: '', bobot: 1 },
        { id: 'p2', label: '', bobot: 2 },
        { id: 'p3', label: '', bobot: 3 },
    ]);

    const form = useForm<{
        kode: string;
        nama: string;
        variabel: string;
        informasi: string;
        bobot: string;
        p1: string;
        p2: string;
        p3: string;
        opsi: ParameterOption[];
    }>({
        kode: '',
        nama: '',
        variabel: '',
        informasi: '',
        bobot: '1.00',
        p1: '',
        p2: '',
        p3: '',
        opsi: [],
    });

    const openCreateModal = () => {
        setEditingItem(null);
        form.reset();
        form.setData('kode', activeTab === 'spd' ? 'SPD-' : 'SID-');
        setOptionsList([
            { id: 'p1', label: '', bobot: 1 },
            { id: 'p2', label: '', bobot: 2 },
            { id: 'p3', label: '', bobot: 3 },
        ]);
        setDialogOpen(true);
    };

    const openEditModal = (item: Indikator) => {
        setEditingItem(item);
        let initialOpsi: ParameterOption[] = [];
        if (item.opsi_list && item.opsi_list.length > 0) {
            initialOpsi = item.opsi_list.map((o) => ({ id: o.id, label: o.label, bobot: o.bobot }));
        } else if (item.opsi && item.opsi.length > 0) {
            initialOpsi = item.opsi.map((o) => ({ id: o.id, label: o.label, bobot: o.bobot }));
        } else {
            if (item.p1) initialOpsi.push({ id: 'p1', label: item.p1, bobot: 1 });
            if (item.p2) initialOpsi.push({ id: 'p2', label: item.p2, bobot: 2 });
            if (item.p3) initialOpsi.push({ id: 'p3', label: item.p3, bobot: 3 });
        }
        if (initialOpsi.length === 0) {
            initialOpsi = [
                { id: 'p1', label: '', bobot: 1 },
                { id: 'p2', label: '', bobot: 2 },
                { id: 'p3', label: '', bobot: 3 },
            ];
        }
        setOptionsList(initialOpsi);
        form.setData({
            kode: item.kode,
            nama: item.nama,
            variabel: item.variabel ?? '',
            informasi: item.informasi ?? '',
            bobot: String(item.bobot),
            p1: item.p1 ?? '',
            p2: item.p2 ?? '',
            p3: item.p3 ?? '',
            opsi: initialOpsi,
        });
        setDialogOpen(true);
    };

    const addOption = () => {
        const nextIdx = optionsList.length + 1;
        setOptionsList((prev) => [
            ...prev,
            { id: `p${nextIdx}`, label: '', bobot: nextIdx },
        ]);
    };

    const updateOption = (index: number, field: 'label' | 'bobot', value: any) => {
        setOptionsList((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const removeOption = (index: number) => {
        if (optionsList.length <= 1) return;
        setOptionsList((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = activeTab === 'spd'
            ? (editingItem ? `/penilai/indikator/spd/${editingItem.id}` : '/penilai/indikator/spd')
            : (editingItem ? `/penilai/indikator/sid/${editingItem.id}` : '/penilai/indikator/sid');

        const validOpsi = optionsList
            .filter((o) => o.label.trim() !== '')
            .map((o, idx) => ({
                id: o.id || `p${idx + 1}`,
                label: o.label.trim(),
                bobot: Number(o.bobot) || (idx + 1),
            }));

        form.transform((data) => ({
            ...data,
            p1: validOpsi[0]?.label ?? '',
            p2: validOpsi[1]?.label ?? '',
            p3: validOpsi[2]?.label ?? '',
            opsi: validOpsi,
        }));

        if (editingItem) {
            form.put(url, {
                onSuccess: () => setDialogOpen(false),
            });
        } else {
            form.post(url, {
                onSuccess: () => setDialogOpen(false),
            });
        }
    };

    const currentList = activeTab === 'spd' ? spdList : sidList;

    const columns: Column<Indikator>[] = [
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
            header: 'Aksi',
            align: 'right',
            cell: (row) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs gap-1"
                    onClick={() => openEditModal(row)}
                >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Master Indikator Penilaian" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Header Hero Banner */}
                <HeroBanner
                    badgeIcon={Sliders}
                    badgeText="Master Configuration"
                    title="Master Data Indikator & Bobot Penilaian"
                    description="Kelola bobot dan parameter ambang P1/P2/P3 indikator Satuan Pemerintahan Daerah (SPD) dan Satuan Inovasi Daerah (SID) secara dinamis."
                >
                    <Button onClick={openCreateModal} className="gap-2 bg-background text-foreground hover:bg-background/90 shadow-xs cursor-pointer">
                        <Plus className="h-4 w-4" /> Tambah Indikator {activeTab.toUpperCase()}
                    </Button>
                </HeroBanner>

                {/* Tab Switcher */}
                <div className="flex rounded-lg border bg-muted/60 p-1 w-fit text-sm">
                    <button
                        onClick={() => setActiveTab('sid')}
                        className={`px-4 py-2 rounded-md font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                            activeTab === 'sid'
                                ? 'bg-background text-foreground shadow-xs'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Layers className="h-4 w-4 text-primary" />
                        Indikator SID ({sidList.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('spd')}
                        className={`px-4 py-2 rounded-md font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                            activeTab === 'spd'
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
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>
                                {editingItem ? 'Edit' : 'Tambah'} Indikator {activeTab.toUpperCase()}
                            </DialogTitle>
                            <DialogDescription>
                                Masukkan kode, nama, bobot, dan opsi parameter dinamis indikator.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="kode">Kode Indikator <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="kode"
                                        value={form.data.kode}
                                        onChange={(e) => form.setData('kode', e.target.value)}
                                        placeholder="e.g. SID-01"
                                        required
                                    />
                                    {form.errors.kode && <p className="text-xs text-destructive mt-1">{form.errors.kode}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="bobot">Bobot Indikator <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="bobot"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.data.bobot}
                                        onChange={(e) => form.setData('bobot', e.target.value)}
                                        required
                                    />
                                    {form.errors.bobot && <p className="text-xs text-destructive mt-1">{form.errors.bobot}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="nama">Nama Indikator <span className="text-destructive">*</span></Label>
                                <Input
                                    id="nama"
                                    value={form.data.nama}
                                    onChange={(e) => form.setData('nama', e.target.value)}
                                    placeholder="e.g. Regulasi Inovasi Daerah"
                                    required
                                />
                                {form.errors.nama && <p className="text-xs text-destructive mt-1">{form.errors.nama}</p>}
                            </div>

                            <div>
                                <Label htmlFor="variabel">Variabel / Catatan Ambang</Label>
                                <Input
                                    id="variabel"
                                    value={form.data.variabel}
                                    onChange={(e) => form.setData('variabel', e.target.value)}
                                    placeholder="Opsional, penjelasan variabel..."
                                />
                            </div>

                            {activeTab === 'sid' && (
                                <div>
                                    <Label htmlFor="informasi">Petunjuk Teknis Bukti Dukung (Informasi)</Label>
                                    <Textarea
                                        id="informasi"
                                        rows={2}
                                        value={form.data.informasi}
                                        onChange={(e) => form.setData('informasi', e.target.value)}
                                        placeholder="Petunjuk teknis dokumen atau bukti yang harus diunggah..."
                                        className="text-xs"
                                    />
                                </div>
                            )}

                            {/* Dynamic Parameter Options Section */}
                            <div className="space-y-3 border-t pt-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                                            Daftar Opsi Parameter & Bobot Poin
                                        </Label>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                            Tiap opsi parameter akan muncul di dropdown inovator dengan bobot poin masing-masing.
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addOption}
                                        className="h-7 text-xs gap-1 border-dashed text-primary hover:bg-primary/5"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Tambah Opsi
                                    </Button>
                                </div>

                                <div className="space-y-2.5">
                                    {optionsList.map((opt, idx) => (
                                        <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg border bg-muted/20">
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-[11px] font-semibold text-foreground">
                                                        Teks Opsi {idx + 1}
                                                    </Label>
                                                    <Badge variant="outline" className="text-[10px] font-mono">
                                                        ID: {opt.id || `p${idx + 1}`}
                                                    </Badge>
                                                </div>
                                                <Textarea
                                                    rows={2}
                                                    value={opt.label}
                                                    onChange={(e) => updateOption(idx, 'label', e.target.value)}
                                                    placeholder="Masukkan kriteria atau dokumen pemenuhan opsi ini..."
                                                    className="text-xs resize-none"
                                                    required
                                                />
                                            </div>
                                            <div className="w-24 space-y-1">
                                                <Label className="text-[11px] font-semibold text-foreground">
                                                    Bobot Poin
                                                </Label>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    value={opt.bobot}
                                                    onChange={(e) => updateOption(idx, 'bobot', e.target.value)}
                                                    className="text-xs"
                                                    required
                                                />
                                            </div>
                                            {optionsList.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeOption(idx)}
                                                    className="mt-5 text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0"
                                                    title="Hapus Opsi"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="mt-4">
                            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                Simpan Indikator
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
