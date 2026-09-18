import { useState, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Building2,
    Check,
    CheckCircle2,
    FolderKanban,
    Info,
    Lightbulb,
    Pencil,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    User,
    UserPlus,
    Users,
    X,
} from 'lucide-react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Column } from '@/components/ui/data-table';
import { DataTable } from '@/components/ui/data-table';
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

type PendampingUser = { id: number; name: string; email: string; nama_pemda?: string; opd_id?: number | null };
type OpdItem = { id: number; nama: string; kode: string | null };
type InovatorUser = { id: number; name: string; email: string; nama_pemda: string };

type InovasiListItem = {
    id: number;
    nama_inovasi: string;
    tahapan: string;
    inisiator?: string | null;
    opd_nama: string;
    inovator_nama: string;
    current_pendamping_id?: number | null;
    current_pendamping_name?: string | null;
    penugasan_id?: number | null;
};

type PenugasanItem = {
    id: number;
    pendamping_id: number;
    pendamping: PendampingUser;
    inovasi_id?: number | null;
    inovasi?: {
        id: number;
        nama_inovasi: string;
        opd?: OpdItem | null;
        user?: { id: number; name: string } | null;
    } | null;
    opd?: OpdItem | null;
    inovator?: InovatorUser | null;
};

type Props = {
    penugasan: PenugasanItem[];
    pendampingList: PendampingUser[];
    inovasiList: InovasiListItem[];
    opdList: OpdItem[];
    inovatorList: InovatorUser[];
    periode?: { tahun: number; nama: string };
};

type PendampingSummaryRow = {
    pendamping: PendampingUser;
    assignedItems: PenugasanItem[];
    totalInovasi: number;
};

export default function PenugasanIndex({
    penugasan = [],
    pendampingList = [],
    inovasiList = [],
    opdList = [],
    periode,
}: Props) {
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [searchInovasiQuery, setSearchInovasiQuery] = useState('');
    const [filterInovasiStatus, setFilterInovasiStatus] = useState<'all' | 'unassigned' | 'assigned'>('unassigned');
    const [selectedInovasiIds, setSelectedInovasiIds] = useState<number[]>([]);

    // Confirmation Alert Dialog States
    const [isConfirmAssignOpen, setIsConfirmAssignOpen] = useState(false);
    const [isConfirmManageOpen, setIsConfirmManageOpen] = useState(false);
    const [unassignTarget, setUnassignTarget] = useState<{
        id: number;
        inovasiName?: string;
        pendampingName?: string;
    } | null>(null);

    // State for managing specific pendamping modal
    const [manageModalPendamping, setManageModalPendamping] = useState<PendampingUser | null>(null);
    const [manageModalInovasiIds, setManageModalInovasiIds] = useState<number[]>([]);
    const [manageModalSearch, setManageModalSearch] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm<{
        pendamping_id: string;
        inovasi_ids: number[];
    }>({
        pendamping_id: '',
        inovasi_ids: [],
    });

    const quickAddForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'pendamping',
        opd_id: '',
        nama_pemda: 'BAPPERIDA Kab. Sumbawa',
        status_aktif: true,
    });

    // Grouping penugasan per Pendamping
    const groupedData: PendampingSummaryRow[] = useMemo(() => {
        return pendampingList.map((p) => {
            const assigned = penugasan.filter((item) => item.pendamping_id === p.id);
            return {
                pendamping: p,
                assignedItems: assigned,
                totalInovasi: assigned.filter((item) => item.inovasi_id).length,
            };
        });
    }, [pendampingList, penugasan]);

    // Inovasi filtered for create form
    const filteredInovasiList = useMemo(() => {
        return inovasiList.filter((inv) => {
            const matchesSearch =
                inv.nama_inovasi.toLowerCase().includes(searchInovasiQuery.toLowerCase()) ||
                inv.opd_nama.toLowerCase().includes(searchInovasiQuery.toLowerCase()) ||
                inv.inovator_nama.toLowerCase().includes(searchInovasiQuery.toLowerCase());

            if (!matchesSearch) return false;

            if (filterInovasiStatus === 'unassigned') {
                return !inv.current_pendamping_id;
            }
            if (filterInovasiStatus === 'assigned') {
                return Boolean(inv.current_pendamping_id);
            }
            return true;
        });
    }, [inovasiList, searchInovasiQuery, filterInovasiStatus]);

    // Selected Pendamping Object
    const selectedPendampingObj = useMemo(() => {
        return pendampingList.find((p) => String(p.id) === data.pendamping_id) || null;
    }, [pendampingList, data.pendamping_id]);

    // Check if any newly selected inovasi is currently assigned to another pendamping
    const reassignedCount = useMemo(() => {
        if (!data.pendamping_id) return 0;
        const currentPId = Number(data.pendamping_id);
        return inovasiList.filter(
            (inv) =>
                selectedInovasiIds.includes(inv.id) &&
                inv.current_pendamping_id &&
                inv.current_pendamping_id !== currentPId
        ).length;
    }, [inovasiList, selectedInovasiIds, data.pendamping_id]);

    const handleSelectPendamping = (val: string) => {
        setData('pendamping_id', val);
        const pId = Number(val);
        // Pre-select inovasi currently assigned to this pendamping
        if (pId) {
            const currentlyAssigned = inovasiList
                .filter((inv) => inv.current_pendamping_id === pId)
                .map((inv) => inv.id);
            setSelectedInovasiIds(currentlyAssigned);
            setData('inovasi_ids', currentlyAssigned);
        } else {
            setSelectedInovasiIds([]);
            setData('inovasi_ids', []);
        }
    };

    const toggleInovasiSelection = (id: number) => {
        setSelectedInovasiIds((prev) => {
            const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
            setData('inovasi_ids', next);
            return next;
        });
    };

    const selectAllUnassigned = () => {
        const unassignedIds = inovasiList
            .filter((inv) => !inv.current_pendamping_id)
            .map((inv) => inv.id);

        const merged = Array.from(new Set([...selectedInovasiIds, ...unassignedIds]));
        setSelectedInovasiIds(merged);
        setData('inovasi_ids', merged);
    };

    const resetSelection = () => {
        setSelectedInovasiIds([]);
        setData('inovasi_ids', []);
    };

    const handleOpenConfirmAssign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.pendamping_id || selectedInovasiIds.length === 0) return;
        setIsConfirmAssignOpen(true);
    };

    const handleExecuteAssign = () => {
        setIsConfirmAssignOpen(false);
        post('/penugasan-pendamping', {
            onSuccess: () => {
                reset();
                setSelectedInovasiIds([]);
            },
        });
    };

    const handleQuickAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        quickAddForm.post('/penilai/users', {
            onSuccess: () => {
                setIsQuickAddOpen(false);
                quickAddForm.reset();
            },
        });
    };

    const handleOpenUnassign = (id: number, inovasiName?: string, pendampingName?: string) => {
        setUnassignTarget({ id, inovasiName, pendampingName });
    };

    const handleExecuteUnassign = () => {
        if (!unassignTarget) return;
        router.delete(`/penugasan-pendamping/${unassignTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setUnassignTarget(null),
        });
    };

    const openManageModal = (pendamping: PendampingUser) => {
        setManageModalPendamping(pendamping);
        const currentlyAssigned = inovasiList
            .filter((inv) => inv.current_pendamping_id === pendamping.id)
            .map((inv) => inv.id);
        setManageModalInovasiIds(currentlyAssigned);
        setManageModalSearch('');
    };

    const handleOpenConfirmManage = () => {
        setIsConfirmManageOpen(true);
    };

    const handleExecuteManage = () => {
        if (!manageModalPendamping) return;
        setIsConfirmManageOpen(false);

        router.post(
            '/penugasan-pendamping',
            {
                pendamping_id: String(manageModalPendamping.id),
                inovasi_ids: manageModalInovasiIds,
            },
            {
                onSuccess: () => setManageModalPendamping(null),
            }
        );
    };

    const toggleManageInovasi = (id: number) => {
        setManageModalInovasiIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const columns: Column<PendampingSummaryRow>[] = [
        {
            header: 'Pendamping Inovasi',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="font-bold text-foreground text-xs md:text-sm">
                            {row.pendamping.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                            {row.pendamping.email}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Daftar Inovasi Binaan',
            cell: (row) => {
                const inovasiItems = row.assignedItems.filter((item) => item.inovasi);

                if (inovasiItems.length === 0) {
                    return (
                        <span className="text-xs text-muted-foreground italic">
                            Belum ada inovasi yang ditugaskan
                        </span>
                    );
                }

                return (
                    <div className="flex flex-wrap gap-1.5 max-w-xl">
                        {inovasiItems.map((item) => (
                            <div
                                key={item.id}
                                className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-all"
                            >
                                <Lightbulb className="h-3 w-3 shrink-0 text-primary/70" />
                                <span className="max-w-[220px] truncate" title={item.inovasi?.nama_inovasi}>
                                    {item.inovasi?.nama_inovasi}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleOpenUnassign(
                                            item.id,
                                            item.inovasi?.nama_inovasi,
                                            row.pendamping.name
                                        )
                                    }
                                    title="Lepas Penugasan Inovasi Ini"
                                    className="h-4 w-4 rounded-full flex items-center justify-center text-primary/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    <X className="h-3 w-3 stroke-[2.5]" />
                                </button>
                            </div>
                        ))}
                    </div>
                );
            },
        },
        {
            header: 'Total Binaan',
            align: 'center',
            cell: (row) => (
                <Badge
                    variant={row.totalInovasi > 0 ? 'default' : 'outline'}
                    className={
                        row.totalInovasi > 0
                            ? 'bg-primary text-primary-foreground font-bold text-xs'
                            : 'text-muted-foreground text-xs'
                    }
                >
                    {row.totalInovasi} Inovasi
                </Badge>
            ),
        },
        {
            header: 'Aksi',
            align: 'right',
            cell: (row) => (
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1.5 font-medium hover:bg-primary/5 hover:text-primary hover:border-primary/50"
                    onClick={() => openManageModal(row.pendamping)}
                >
                    <FolderKanban className="h-3.5 w-3.5 text-primary" />
                    Kelola Inovasi
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Manajemen Penugasan Pendamping Inovasi" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Header Hero Banner */}
                <HeroBanner
                    badgeIcon={Users}
                    badgeText={`Assignment Control • Periode ${periode?.tahun || '2026'}`}
                    title="Penugasan Pendamping Inovasi"
                    description="Alokasikan Pendamping Inovasi untuk membina usulan Inovasi Daerah Kabupaten Sumbawa secara fleksibel dan tepat sasaran."
                />

                {/* Form Penugasan Inovasi Baru */}
                <Card className="border border-border/80 shadow-sm overflow-hidden">
                    <CardHeader className="py-4 px-6 bg-muted/20 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                                <UserPlus className="h-4 w-4 text-primary" /> Alokasikan Penugasan Inovasi
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Pilih pendamping dan centang satu atau lebih inovasi yang akan didampingi.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 md:p-6 space-y-6">
                        <form onSubmit={handleOpenConfirmAssign} className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {/* Left Side: Pendamping Selection */}
                                <div className="lg:col-span-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="pendamping_id"
                                            className="text-xs font-bold text-foreground uppercase tracking-wider"
                                        >
                                            Pilih Pendamping <span className="text-destructive">*</span>
                                        </Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsQuickAddOpen(true)}
                                            className="h-6 px-2 text-[11px] text-teal-600 hover:text-teal-700 dark:text-teal-400 gap-1 font-semibold hover:bg-teal-50 dark:hover:bg-teal-950/40"
                                        >
                                            <UserPlus className="h-3 w-3" />
                                            + Pendamping Baru
                                        </Button>
                                    </div>
                                    <Select
                                        value={data.pendamping_id}
                                        onValueChange={handleSelectPendamping}
                                    >
                                        <SelectTrigger
                                            id="pendamping_id"
                                            className="h-10 text-xs w-full bg-background hover:bg-accent/40 transition-colors"
                                        >
                                            <SelectValue placeholder="-- Pilih Pendamping Inovasi --" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-64">
                                            {pendampingList.map((p) => {
                                                const assignedCount = inovasiList.filter(
                                                    (inv) => inv.current_pendamping_id === p.id
                                                ).length;
                                                return (
                                                    <SelectItem key={p.id} value={String(p.id)}>
                                                        {p.name} ({assignedCount} binaan aktif)
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    {errors.pendamping_id && (
                                        <p className="text-destructive text-[11px] font-medium">
                                            {errors.pendamping_id}
                                        </p>
                                    )}
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                        Pilih pendamping yang bertugas membina dan memvalidasi usulan inovasi daerah.
                                    </p>

                                    {data.pendamping_id && (
                                        <div className="p-3 rounded-lg border bg-primary/5 border-primary/20 space-y-1.5">
                                            <div className="text-xs font-semibold text-primary flex items-center gap-1.5">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                <span>Pendamping Terpilih:</span>
                                            </div>
                                            <div className="text-xs font-bold text-foreground">
                                                {selectedPendampingObj?.name}
                                            </div>
                                            <div className="text-[11px] text-muted-foreground">
                                                Inovasi dipilih saat ini:{' '}
                                                <strong className="text-foreground">
                                                    {selectedInovasiIds.length} inovasi
                                                </strong>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Side: Multi-select Inovasi */}
                                <div className="lg:col-span-8 space-y-3 pl-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-border/60 pt-4 lg:pt-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <Label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                                                Pilih Inovasi Binaan <span className="text-destructive">*</span>
                                            </Label>
                                            <p className="text-[11px] text-muted-foreground">
                                                Centang usulan inovasi yang akan dialokasikan ke pendamping terpilih.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={selectAllUnassigned}
                                                className="h-7 text-[11px] text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/40"
                                            >
                                                Pilih Semua Belum Ditugaskan
                                            </Button>
                                            {selectedInovasiIds.length > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={resetSelection}
                                                    className="h-7 text-[11px] text-muted-foreground hover:text-foreground"
                                                >
                                                    Reset
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Search & Filter bar for innovations */}
                                    <div className="flex flex-col sm:flex-row items-center gap-2">
                                        <div className="relative flex-1 w-full">
                                            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                            <Input
                                                placeholder="Cari judul inovasi, OPD, atau nama inovator..."
                                                value={searchInovasiQuery}
                                                onChange={(e) => setSearchInovasiQuery(e.target.value)}
                                                className="h-9 pl-8 text-xs w-full bg-background"
                                            />
                                        </div>
                                        <div className="flex rounded-md border bg-muted/40 p-0.5 text-xs font-medium w-full sm:w-auto shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setFilterInovasiStatus('unassigned')}
                                                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                                                    filterInovasiStatus === 'unassigned'
                                                        ? 'bg-background text-foreground shadow-xs font-semibold'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                            >
                                                Belum Ditugaskan (
                                                {inovasiList.filter((i) => !i.current_pendamping_id).length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFilterInovasiStatus('assigned')}
                                                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                                                    filterInovasiStatus === 'assigned'
                                                        ? 'bg-background text-foreground shadow-xs font-semibold'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                            >
                                                Sudah Ditugaskan (
                                                {inovasiList.filter((i) => i.current_pendamping_id).length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFilterInovasiStatus('all')}
                                                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                                                    filterInovasiStatus === 'all'
                                                        ? 'bg-background text-foreground shadow-xs font-semibold'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                            >
                                                Semua ({inovasiList.length})
                                            </button>
                                        </div>
                                    </div>

                                    {/* Inovasi Checkbox List */}
                                    <div className="border rounded-lg max-h-72 overflow-y-auto divide-y divide-border/60 bg-background/50">
                                        {filteredInovasiList.length === 0 ? (
                                            <div className="p-8 text-center text-xs text-muted-foreground">
                                                Tidak ada usulan inovasi yang cocok dengan pencarian/filter.
                                            </div>
                                        ) : (
                                            filteredInovasiList.map((inv) => {
                                                const isSelected = selectedInovasiIds.includes(inv.id);
                                                const isAssignedToThisPendamping =
                                                    data.pendamping_id &&
                                                    inv.current_pendamping_id === Number(data.pendamping_id);
                                                const isAssignedToOther =
                                                    inv.current_pendamping_id &&
                                                    (!data.pendamping_id ||
                                                        inv.current_pendamping_id !== Number(data.pendamping_id));

                                                return (
                                                    <div
                                                        key={inv.id}
                                                        onClick={() => toggleInovasiSelection(inv.id)}
                                                        className={`flex items-start gap-3 p-3 text-xs transition-colors cursor-pointer hover:bg-muted/40 ${
                                                            isSelected
                                                                ? 'bg-primary/5 border-l-2 border-l-primary'
                                                                : ''
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => {}}
                                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer shrink-0"
                                                        />
                                                        <div className="flex-1 space-y-1">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="font-bold text-foreground">
                                                                    {inv.nama_inovasi}
                                                                </span>
                                                                {isAssignedToThisPendamping ? (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold shrink-0"
                                                                    >
                                                                        Binaan Pendamping Ini
                                                                    </Badge>
                                                                ) : isAssignedToOther ? (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] font-medium shrink-0"
                                                                    >
                                                                        Didampingi: {inv.current_pendamping_name}
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-semibold shrink-0"
                                                                    >
                                                                        Belum Ditugaskan
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <Building2 className="h-3 w-3 text-primary" />
                                                                    {inv.opd_nama}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <User className="h-3 w-3 text-emerald-600" />
                                                                    {inv.inovator_nama}
                                                                </span>
                                                                <Badge
                                                                  variant="secondary"
                                                                    className="text-[10px] uppercase font-semibold h-4 px-1.5"
                                                                >
                                                                    {inv.tahapan}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Action Footer */}
                            <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="text-xs text-muted-foreground">
                                    {selectedInovasiIds.length > 0 ? (
                                        <span className="text-foreground font-medium">
                                            ✓ <strong>{selectedInovasiIds.length}</strong> usulan inovasi akan
                                            dialokasikan ke pendamping terpilih.
                                        </span>
                                    ) : (
                                        <span>*) Pilih pendamping dan minimal 1 inovasi sebelum menyimpan.</span>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.pendamping_id || selectedInovasiIds.length === 0}
                                    className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-5"
                                >
                                    <UserPlus className="h-4 w-4" /> Simpan Penugasan Inovasi
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Rekap Penugasan per Pendamping */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm md:text-base font-bold text-foreground">
                                Rekap Penugasan per Pendamping Inovasi
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Ringkasan daftar inovasi yang sedang didampingi oleh masing-masing pendamping.
                            </p>
                        </div>
                    </div>

                    <DataTable
                        data={groupedData}
                        columns={columns}
                        searchPlaceholder="Cari nama atau email pendamping..."
                        searchKey={(row) => `${row.pendamping.name} ${row.pendamping.email}`}
                        emptyTitle="Belum Ada Pendamping Terdaftar"
                        emptyDescription="Belum ada data pendamping yang tersedia untuk periode ini."
                    />
                </div>
            </div>

            {/* Dialog Kelola Inovasi Binaan Spesifik Pendamping */}
            <Dialog
                open={Boolean(manageModalPendamping)}
                onOpenChange={(open) => !open && setManageModalPendamping(null)}
            >
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <FolderKanban className="h-5 w-5 text-primary" />
                            <DialogTitle className="text-base font-bold text-foreground">
                                Kelola Inovasi Binaan: {manageModalPendamping?.name}
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-xs">
                            Pilih dan sesuaikan daftar usulan inovasi yang didampingi oleh{' '}
                            <strong>{manageModalPendamping?.name}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Cari inovasi untuk ditugaskan..."
                                value={manageModalSearch}
                                onChange={(e) => setManageModalSearch(e.target.value)}
                                className="h-9 pl-8 text-xs w-full"
                            />
                        </div>

                        <div className="border rounded-lg max-h-80 overflow-y-auto divide-y divide-border/60">
                            {inovasiList
                                .filter((inv) =>
                                    inv.nama_inovasi
                                        .toLowerCase()
                                        .includes(manageModalSearch.toLowerCase()) ||
                                    inv.opd_nama.toLowerCase().includes(manageModalSearch.toLowerCase())
                                )
                                .map((inv) => {
                                    const isSelected = manageModalInovasiIds.includes(inv.id);
                                    const isAssignedToOther =
                                        inv.current_pendamping_id &&
                                        inv.current_pendamping_id !== manageModalPendamping?.id;

                                    return (
                                        <div
                                            key={inv.id}
                                            onClick={() => toggleManageInovasi(inv.id)}
                                            className={`flex items-start gap-3 p-3 text-xs transition-colors cursor-pointer hover:bg-muted/40 ${
                                                isSelected ? 'bg-primary/5' : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => {}}
                                                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer shrink-0"
                                            />
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="font-bold text-foreground">
                                                        {inv.nama_inovasi}
                                                    </span>
                                                    {isAssignedToOther ? (
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] font-medium shrink-0"
                                                        >
                                                            Didampingi: {inv.current_pendamping_name}
                                                        </Badge>
                                                    ) : isSelected ? (
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold shrink-0"
                                                        >
                                                            Terpilih
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-muted text-muted-foreground text-[10px] shrink-0"
                                                        >
                                                            Belum Ditugaskan
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground">
                                                    {inv.opd_nama} • Inisiator: {inv.inovator_nama}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setManageModalPendamping(null)}
                            className="text-xs"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleOpenConfirmManage}
                            className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                        >
                            Simpan Perubahan ({manageModalInovasiIds.length} Inovasi)
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Quick Add Pendamping Dialog */}
            <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-bold">
                            <UserPlus className="h-5 w-5 text-primary" />
                            Tambah Akun Pendamping Baru
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Daftarkan staf BAPPERIDA baru sebagai Pendamping Inovasi. Akun yang dibuat akan
                            langsung tersedia di dropdown penugasan.
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
                                onValueChange={(val) =>
                                    quickAddForm.setData('opd_id', val === 'none' ? '' : val)
                                }
                            >
                                <SelectTrigger id="quick-opd" className="h-9 text-xs">
                                    <SelectValue placeholder="Pilih Instansi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        BAPPERIDA Kab. Sumbawa (Default)
                                    </SelectItem>
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
                                className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                            >
                                {quickAddForm.processing ? 'Menyimpan...' : 'Daftarkan Pendamping'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 1. Alert Konfirmasi Simpan Penugasan Form Utama */}
            <AlertDialog
                open={isConfirmAssignOpen}
                onOpenChange={setIsConfirmAssignOpen}
            >
                <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-teal-600" />
                            <AlertDialogTitle className="text-base font-bold text-foreground">
                                Konfirmasi Alokasi Penugasan
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-xs space-y-2 pt-1 text-muted-foreground leading-relaxed">
                            <p>
                                Anda akan mengalokasikan{' '}
                                <strong className="text-foreground">
                                    {selectedInovasiIds.length} usulan inovasi
                                </strong>{' '}
                                kepada pendamping{' '}
                                <strong className="text-foreground">
                                    {selectedPendampingObj?.name}
                                </strong>
                                .
                            </p>
                            {reassignedCount > 0 && (
                                <div className="p-2.5 rounded-md border bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] flex items-start gap-2">
                                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                                    <span>
                                        <strong>{reassignedCount}</strong> inovasi yang sebelumnya didampingi
                                        oleh pendamping lain akan otomatis dialihkan ke pendamping ini.
                                    </span>
                                </div>
                            )}
                            <p>Apakah Anda yakin ingin menyimpan penugasan ini?</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel size="sm" className="text-xs">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            size="sm"
                            onClick={handleExecuteAssign}
                            className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                        >
                            Ya, Simpan Penugasan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* 2. Alert Konfirmasi Simpan Perubahan Modal Kelola Inovasi */}
            <AlertDialog
                open={isConfirmManageOpen}
                onOpenChange={setIsConfirmManageOpen}
            >
                <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-2">
                            <FolderKanban className="h-5 w-5 text-teal-600" />
                            <AlertDialogTitle className="text-base font-bold text-foreground">
                                Konfirmasi Perubahan Inovasi Binaan
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-xs space-y-2 pt-1 text-muted-foreground leading-relaxed">
                            <p>
                                Daftar inovasi binaan untuk{' '}
                                <strong className="text-foreground">
                                    {manageModalPendamping?.name}
                                </strong>{' '}
                                akan diperbarui menjadi{' '}
                                <strong className="text-foreground">
                                    {manageModalInovasiIds.length} inovasi
                                </strong>
                                .
                            </p>
                            {manageModalInovasiIds.length === 0 && (
                                <div className="p-2.5 rounded-md border bg-destructive/10 border-destructive/20 text-destructive text-[11px] flex items-start gap-2">
                                    <AlertTriangle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
                                    <span>
                                        <strong>Perhatian:</strong> Anda tidak memilih inovasi apa pun. Semua
                                        penugasan pendampingan untuk pendamping ini akan dihapus/dilepas.
                                    </span>
                                </div>
                            )}
                            <p>Lanjutkan penyimpanan perubahan?</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel size="sm" className="text-xs">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            size="sm"
                            onClick={handleExecuteManage}
                            className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                        >
                            Ya, Simpan Perubahan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* 3. Alert Konfirmasi Lepas Penugasan Tunggal */}
            <AlertDialog
                open={Boolean(unassignTarget)}
                onOpenChange={(open) => !open && setUnassignTarget(null)}
            >
                <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            <AlertDialogTitle className="text-base font-bold text-foreground">
                                Konfirmasi Lepas Penugasan Inovasi
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-xs space-y-2 pt-1 text-muted-foreground leading-relaxed">
                            <p>
                                Apakah Anda yakin ingin melepas usulan inovasi{' '}
                                <strong className="text-foreground">
                                    "{unassignTarget?.inovasiName || 'terpilih'}"
                                </strong>{' '}
                                {unassignTarget?.pendampingName && (
                                    <>
                                        dari pendampingan{' '}
                                        <strong className="text-foreground">
                                            {unassignTarget.pendampingName}
                                        </strong>
                                    </>
                                )}
                                ?
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                                Inovasi ini akan berstatus "Belum Ditugaskan" dan tetap dapat dialokasikan kembali kapan saja.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel size="sm" className="text-xs">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            size="sm"
                            variant="destructive"
                            onClick={handleExecuteUnassign}
                            className="text-xs font-semibold"
                        >
                            Ya, Lepas Penugasan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

PenugasanIndex.layout = {
    breadcrumbs,
};
