import { Head, useForm } from '@inertiajs/react';
import { Layers, Pencil, Plus, Sliders } from 'lucide-react';
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

interface Indikator {
    id: number;
    kode: string;
    nama: string;
    variabel: string | null;
    bobot: string | number;
    p1: string | null;
    p2: string | null;
    p3: string | null;
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

    const form = useForm({
        kode: '',
        nama: '',
        variabel: '',
        bobot: '1.00',
        p1: '',
        p2: '',
        p3: '',
    });

    const openCreateModal = () => {
        setEditingItem(null);
        form.reset();
        form.setData('kode', activeTab === 'spd' ? 'SPD-' : 'SID-');
        setDialogOpen(true);
    };

    const openEditModal = (item: Indikator) => {
        setEditingItem(item);
        form.setData({
            kode: item.kode,
            nama: item.nama,
            variabel: item.variabel ?? '',
            bobot: String(item.bobot),
            p1: item.p1 ?? '',
            p2: item.p2 ?? '',
            p3: item.p3 ?? '',
        });
        setDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = activeTab === 'spd'
            ? (editingItem ? `/penilai/indikator/spd/${editingItem.id}` : '/penilai/indikator/spd')
            : (editingItem ? `/penilai/indikator/sid/${editingItem.id}` : '/penilai/indikator/sid');

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
                <DialogContent className="max-w-lg">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>
                                {editingItem ? 'Edit' : 'Tambah'} Indikator {activeTab.toUpperCase()}
                            </DialogTitle>
                            <DialogDescription>
                                Masukkan kode, nama, bobot, dan opsi parameter indikator.
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

                            <div className="space-y-2 border-t pt-3">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                                    Deskripsi Parameter (P1, P2, P3)
                                </Label>
                                <div>
                                    <Label htmlFor="p1" className="text-xs">Parameter P1 (Skor 1 - Rendah)</Label>
                                    <Textarea
                                        id="p1"
                                        rows={2}
                                        value={form.data.p1}
                                        onChange={(e) => form.setData('p1', e.target.value)}
                                        placeholder="Contoh: Belum memiliki SK / Surat Keterangan..."
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="p2" className="text-xs">Parameter P2 (Skor 2 - Sedang)</Label>
                                    <Textarea
                                        id="p2"
                                        rows={2}
                                        value={form.data.p2}
                                        onChange={(e) => form.setData('p2', e.target.value)}
                                        placeholder="Contoh: Telah memiliki Surat Peraturan Kepala Dinas..."
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="p3" className="text-xs">Parameter P3 (Skor 3 - Tinggi)</Label>
                                    <Textarea
                                        id="p3"
                                        rows={2}
                                        value={form.data.p3}
                                        onChange={(e) => form.setData('p3', e.target.value)}
                                        placeholder="Contoh: Ditetapkan melalui Peraturan Bupati / Perda..."
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
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
