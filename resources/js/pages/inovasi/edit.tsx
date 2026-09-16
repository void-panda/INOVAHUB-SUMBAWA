import { useEffect, useRef, useState, useTransition } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    Download,
    ExternalLink,
    FileText,
    FolderOpen,
    Lock,
    Printer,
    Save,
    Send,
    Trash2,
    UploadCloud,
    Video,
} from 'lucide-react';

import { HeroBanner } from '@/components/hero-banner';
import { RantaiVersi, type VersiNode } from '@/components/rantai-versi';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { InovasiListItem } from '@/pages/inovasi/index';
import {
    INISIATOR_OPTIONS,
    KRITERIA_IGA_OPTIONS,
    TEMATIK_OPTIONS,
    countWords,
} from '@/pages/inovasi/inovasi-fields';

type Dokumen = {
    id: number;
    jenis: string;
    path: string;
    nama_asal?: string;
    mime?: string;
    ukuran?: number;
};

type Log = {
    id: number;
    status_sebelum: string;
    status_sesudah: string;
    catatan: string | null;
    created_at: string;
    user: { name: string };
};

type InovasiDetail = InovasiListItem & {
    koordinat: string;
    nama_inisiator: string;
    inisiator?: string;
    bentuk_inovasi?: string;
    jenis_inovasi?: string;
    klasifikasi?: string;
    tematik?: string | null;
    kriteria_inovasi?: string | null;
    lokasi?: string | null;
    urusan_wajib: string | null;
    waktu_uji_coba: string | null;
    waktu_pengembangan: string | null;
    anggaran_sebelum?: number | string | null;
    anggaran_sesudah?: number | string | null;
    is_penghargaan?: boolean;
    nama_penghargaan?: string | null;
    rancang_bangun?: string | null;
    tujuan?: string | null;
    manfaat?: string | null;
    inovasi_asal_id?: number | null;
    dokumen?: Dokumen[];
    validasi_logs?: Log[];
    status?: string;
    opd?: { id: number; nama: string; kode?: string };
    periode_lomba?: { id: number; nama: string; tahun: number };
    pengajuan_aktif?: any;
    pengajuan_lomba?: any[];
};

type Option = {
    value: string;
    label: string;
};

type Props = {
    inovasi: InovasiDetail;
    urusanList: Option[];
    urusanWajibList: string[];
    rantaiVersi?: VersiNode;
    tipeInovator?: 'dinas' | 'masyarakat';
};

const statusLabel: Record<string, string> = {
    draft: 'Draft',
    diajukan: 'Diajukan',
    divalidasi: 'Divalidasi',
    revisi: 'Revisi',
    disetujui: 'Disetujui',
    disahkan_opd: 'Disahkan OPD',
    review_internal: 'Review Internal',
    siap_kirim: 'Siap Kirim',
    terkirim: 'Terkirim',
};

const statusBadgeColor: Record<string, string> = {
    draft: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-300',
    diajukan: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300',
    divalidasi: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-300',
    revisi: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300',
    disetujui: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-300',
    disahkan_opd: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300',
    review_internal: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300',
    siap_kirim: 'bg-teal-600/15 text-teal-800 dark:text-teal-200 border-teal-400',
    terkirim: 'bg-emerald-600/20 text-emerald-800 dark:text-emerald-200 border-emerald-400',
};

const TAB_KEYS = ['identitas', 'klasifikasi', 'anggaran', 'narasi', 'dokumen', 'riwayat'] as const;
type TabKey = typeof TAB_KEYS[number];

const TAB_METADATA: Record<TabKey, { label: string; stepNumber: number }> = {
    identitas: { label: 'Identitas Inovasi', stepNumber: 1 },
    klasifikasi: { label: 'Klasifikasi & Urusan', stepNumber: 2 },
    anggaran: { label: 'Waktu & Anggaran', stepNumber: 3 },
    narasi: { label: 'Rancang Bangun & Narasi', stepNumber: 4 },
    dokumen: { label: 'Dokumen Profil', stepNumber: 5 },
    riwayat: { label: 'Riwayat Validasi', stepNumber: 6 },
};

function formatBytes(bytes?: number): string {
    if (!bytes || bytes === 0) return 'Tautan Link';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatRupiahInput(val: number | string | null | undefined): string {
    if (val === null || val === undefined || val === '') return '';
    const num = typeof val === 'number' ? val : Number(val.toString().replace(/\D/g, ''));
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('id-ID').format(num);
}

export default function EditInovasi({
    inovasi,
    urusanList,
    urusanWajibList,
    rantaiVersi,
    tipeInovator = 'dinas',
}: Props) {
    const isMasyarakat = tipeInovator === 'masyarakat';
    const minWordCount = isMasyarakat ? 100 : 300;
    const currentStatus = inovasi.status || 'draft';
    const isReadOnly = ['siap_kirim', 'terkirim'].includes(currentStatus);
    const canSubmit = ['draft', 'revisi'].includes(currentStatus);

    const initialUrusanWajib = inovasi.urusan_wajib
        ? inovasi.urusan_wajib.includes(',')
            ? inovasi.urusan_wajib.split(',').map((s) => s.trim())
            : [inovasi.urusan_wajib]
        : [];

    const { data, setData, errors, processing, isDirty, post, transform, setDefaults } = useForm({
        nama_inovasi: inovasi.nama_inovasi || '',
        tahapan: inovasi.tahapan || 'inisiatif',
        inisiator: inovasi.inisiator || 'opd',
        bentuk_inovasi: inovasi.bentuk_inovasi || 'pelayanan_publik',
        jenis_inovasi: inovasi.jenis_inovasi || 'non_digital',
        klasifikasi: inovasi.klasifikasi || 'non_tematik',
        tematik: inovasi.tematik || '',
        kriteria_inovasi: inovasi.kriteria_inovasi || '',
        nama_inisiator: inovasi.nama_inisiator || '',
        koordinat: inovasi.koordinat || '',
        lokasi: inovasi.lokasi || '',
        urusan_utama: inovasi.urusan_utama || '',
        urusan_wajib: initialUrusanWajib,
        waktu_uji_coba: inovasi.waktu_uji_coba ? inovasi.waktu_uji_coba.slice(0, 10) : '',
        waktu_penerapan: inovasi.waktu_penerapan ? inovasi.waktu_penerapan.slice(0, 10) : '',
        waktu_pengembangan: inovasi.waktu_pengembangan ? inovasi.waktu_pengembangan.slice(0, 10) : '',
        anggaran_sebelum: inovasi.anggaran_sebelum ?? '',
        anggaran_sesudah: inovasi.anggaran_sesudah ?? '',
        is_penghargaan: Boolean(inovasi.is_penghargaan),
        nama_penghargaan: inovasi.nama_penghargaan || '',
        rancang_bangun: inovasi.rancang_bangun || '',
        tujuan: inovasi.tujuan || '',
        manfaat: inovasi.manfaat || '',
        hasil_inovasi: inovasi.hasil_inovasi || '',
        proposal: null as File | null,
        sertifikat: null as File | null,
        link_video: '',
        nama_video: '',
    });

    const [activeTab, setActiveTab] = useState<TabKey>('identitas');
    const [isSubmittingValidation, setIsSubmittingValidation] = useState(false);
    const [, startTransition] = useTransition();

    // Synchronize form defaults and data when inovasi props change (e.g. after server update)
    useEffect(() => {
        const updatedWajib = inovasi.urusan_wajib
            ? inovasi.urusan_wajib.includes(',')
                ? inovasi.urusan_wajib.split(',').map((s) => s.trim())
                : [inovasi.urusan_wajib]
            : [];

        const synced = {
            nama_inovasi: inovasi.nama_inovasi || '',
            tahapan: inovasi.tahapan || 'inisiatif',
            inisiator: inovasi.inisiator || 'opd',
            bentuk_inovasi: inovasi.bentuk_inovasi || 'pelayanan_publik',
            jenis_inovasi: inovasi.jenis_inovasi || 'non_digital',
            klasifikasi: inovasi.klasifikasi || 'non_tematik',
            tematik: inovasi.tematik || '',
            kriteria_inovasi: inovasi.kriteria_inovasi || '',
            nama_inisiator: inovasi.nama_inisiator || '',
            koordinat: inovasi.koordinat || '',
            lokasi: inovasi.lokasi || '',
            urusan_utama: inovasi.urusan_utama || '',
            urusan_wajib: updatedWajib,
            waktu_uji_coba: inovasi.waktu_uji_coba ? inovasi.waktu_uji_coba.slice(0, 10) : '',
            waktu_penerapan: inovasi.waktu_penerapan ? inovasi.waktu_penerapan.slice(0, 10) : '',
            waktu_pengembangan: inovasi.waktu_pengembangan ? inovasi.waktu_pengembangan.slice(0, 10) : '',
            anggaran_sebelum: inovasi.anggaran_sebelum ?? '',
            anggaran_sesudah: inovasi.anggaran_sesudah ?? '',
            is_penghargaan: Boolean(inovasi.is_penghargaan),
            nama_penghargaan: inovasi.nama_penghargaan || '',
            rancang_bangun: inovasi.rancang_bangun || '',
            tujuan: inovasi.tujuan || '',
            manfaat: inovasi.manfaat || '',
            hasil_inovasi: inovasi.hasil_inovasi || '',
            proposal: null as File | null,
            sertifikat: null as File | null,
            link_video: '',
            nama_video: '',
        };
        setDefaults(synced);
        setData(synced);
    }, [inovasi]);

    // Drag-and-drop state for Profile Documents
    const [isDraggingProposal, setIsDraggingProposal] = useState(false);
    const [isDraggingSertifikat, setIsDraggingSertifikat] = useState(false);
    const proposalInputRef = useRef<HTMLInputElement>(null);
    const sertifikatInputRef = useRef<HTMLInputElement>(null);

    // Profile Documents Extraction
    const documentsList = inovasi.dokumen ?? [];
    const proposalDoc = documentsList.find(
        (d) => d.jenis === 'proposal' || d.nama_asal?.toLowerCase().includes('proposal')
    );
    const sertifikatDoc = documentsList.find(
        (d) =>
            d.jenis === 'penghargaan' ||
            d.jenis === 'piagam' ||
            d.jenis === 'sertifikat' ||
            d.nama_asal?.toLowerCase().includes('penghargaan') ||
            d.nama_asal?.toLowerCase().includes('piagam')
    );
    const videoDoc = documentsList.find(
        (d) => d.jenis === 'video' || d.mime === 'url'
    );

    const logsList = inovasi.validasi_logs ?? [];
    const latestRevisionLog = logsList
        .filter((l) => l.status_sesudah === 'revisi')
        .slice(-1)[0];

    const wordCount = countWords(data.rancang_bangun);
    const isWordCountValid = wordCount >= minWordCount;

    const currentTabIndex = TAB_KEYS.indexOf(activeTab);
    const prevTab = currentTabIndex > 0 ? TAB_KEYS[currentTabIndex - 1] : null;
    const nextTab = currentTabIndex < TAB_KEYS.length - 1 ? TAB_KEYS[currentTabIndex + 1] : null;

    const toggleWajib = (urusan: string, checked: boolean) => {
        if (isReadOnly) return;
        setData(
            'urusan_wajib',
            checked
                ? [...data.urusan_wajib, urusan]
                : data.urusan_wajib.filter((item) => item !== urusan)
        );
    };

    const handleSave = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (isReadOnly || processing) return;

        transform((currentData) => ({
            ...currentData,
            _method: 'put',
        }));

        post(`/inovasi/${inovasi.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setData((prev) => {
                    const next = {
                        ...prev,
                        proposal: null,
                        sertifikat: null,
                        link_video: '',
                    };
                    setDefaults(next);
                    return next;
                });
                if (proposalInputRef.current) proposalInputRef.current.value = '';
                if (sertifikatInputRef.current) sertifikatInputRef.current.value = '';
            },
        });
    };

    // Keyboard shortcut Ctrl+S / Cmd+S
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (!isReadOnly && !processing) {
                    handleSave();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [data, isReadOnly, processing]);

    const submitForValidation = () => {
        setIsSubmittingValidation(true);
        router.post(
            `/inovasi/${inovasi.id}/submit`,
            {},
            {
                onFinish: () => setIsSubmittingValidation(false),
            }
        );
    };

    const deleteDokumen = (dokId: number) => {
        if (isReadOnly) return;
        startTransition(() => {
            router.delete(`/inovasi/dokumen/${dokId}`, { preserveScroll: true });
        });
    };

    // In-Card Tab Footer
    const renderTabFooter = () => (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t mt-6 bg-muted/15 p-4 rounded-xl">
            <div className="flex items-center gap-2">
                {prevTab ? (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab(prevTab)}
                        className="text-xs gap-1.5 hover:bg-accent"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Sebelumnya: {TAB_METADATA[prevTab].label}
                    </Button>
                ) : (
                    <span className="text-xs text-muted-foreground font-medium">
                        Bagian 1 dari 6
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                {isDirty && !isReadOnly && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
                        Perubahan belum disimpan
                    </span>
                )}

                {!isReadOnly && (
                    <Button
                        type="button"
                        onClick={() => handleSave()}
                        disabled={processing}
                        className="gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xs"
                    >
                        {processing ? <Spinner /> : <Save className="h-3.5 w-3.5" />}
                        <span>Simpan</span>
                        <kbd className="hidden md:inline-block ml-1 px-1.5 py-0.5 text-[11px] font-mono bg-black/20 text-white rounded">Ctrl+S</kbd>
                    </Button>
                )}

                {nextTab && (
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setActiveTab(nextTab)}
                        className="text-xs gap-1.5 font-semibold"
                    >
                        Lanjut: {TAB_METADATA[nextTab].label} <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Head title={`Profil Inovasi - ${inovasi.nama_inovasi}`} />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Hero Banner INOVA-HUB */}
                <HeroBanner
                    title={inovasi.nama_inovasi}
                    description={`Pengelolaan profil usulan inovasi daerah ${inovasi.opd?.nama || 'Kabupaten Sumbawa'} terintegrasi standar IGA Kemendagri 2026.`}
                >
                    <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-white/20">
                        <Link
                            href="/inovasi"
                            className="text-xs text-teal-100 hover:text-white underline inline-flex items-center gap-1"
                        >
                            ← Kembali ke Daftar Inovasi Saya
                        </Link>
                        <span className="text-white/40" aria-hidden="true">•</span>
                        <span className="text-xs text-teal-100">
                            Periode Lomba: {inovasi.periode_lomba?.nama || `Tahun ${new Date().getFullYear()}`}
                        </span>
                        <span className="text-white/40" aria-hidden="true">•</span>
                        <span className="text-xs text-teal-100">
                            Estimasi Skor: <strong>{inovasi.estimasi_skor_kematangan ?? 0} Poin</strong>
                        </span>
                    </div>
                </HeroBanner>

                {/* Status Bar & Alert Notices */}
                <div className="grid gap-4">
                    <Card className="border-border shadow-xs bg-card">
                        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                                        Status Validasi INOVA-HUB:
                                    </span>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge
                                            variant="outline"
                                            className={`text-xs font-bold px-2.5 py-0.5 uppercase ${statusBadgeColor[currentStatus] || ''
                                                }`}
                                        >
                                            {statusLabel[currentStatus] ?? currentStatus}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs font-semibold capitalize">
                                            Tahapan: {data.tahapan}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs capitalize">
                                            {data.bentuk_inovasi?.replace('_', ' ')}
                                        </Badge>
                                        {isDirty && !isReadOnly && (
                                            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-400/40 text-xs font-bold">
                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" aria-hidden="true" />
                                                Perubahan Belum Disimpan
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Fast Action Buttons */}
                            <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="gap-1.5 text-xs hover:bg-accent"
                                    title="Cetak format profil standar PDF"
                                >
                                    <Link href={`/inovasi/${inovasi.id}/print`} target="_blank">
                                        <Printer className="h-3.5 w-3.5" /> Cetak Profil
                                    </Link>
                                </Button>

                                <Button
                                    variant="default"
                                    size="sm"
                                    asChild
                                    className="gap-1.5 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs"
                                    title="Buka 20 Indikator SID & Bukti Dukung"
                                >
                                    <Link href={`/inovasi/${inovasi.id}/indikator`}>
                                        <FolderOpen className="h-3.5 w-3.5" />
                                        <span>20 Indikator SID</span>
                                    </Link>
                                </Button>

                                {!isReadOnly && (
                                    <Button
                                        onClick={() => handleSave()}
                                        disabled={processing}
                                        className="gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xs"
                                    >
                                        {processing ? <Spinner /> : <Save className="h-3.5 w-3.5" />}
                                        <span>Simpan Perubahan</span>
                                    </Button>
                                )}

                                {canSubmit && (
                                    <Button
                                        onClick={submitForValidation}
                                        disabled={isSubmittingValidation}
                                        className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                                    >
                                        {isSubmittingValidation ? <Spinner /> : <Send className="h-3.5 w-3.5" />}
                                        Ajukan Validasi
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notice for Revision */}
                    {currentStatus === 'revisi' && latestRevisionLog && (
                        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-xs">
                            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div className="space-y-1 text-xs">
                                <div className="font-bold text-sm text-amber-800 dark:text-amber-300">
                                    Catatan Revisi dari Pendamping Inovasi ({latestRevisionLog.user?.name}):
                                </div>
                                <p className="italic bg-background/50 p-2.5 rounded-md border border-amber-500/20 leading-relaxed font-sans text-foreground">
                                    "{latestRevisionLog.catatan}"
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Silakan perbaiki data profil atau berkas dokumen pendukung sesuai catatan di atas, kemudian klik tombol <strong>"Ajukan Validasi"</strong> kembali.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Notice for Read-only Mode */}
                    {isReadOnly && (
                        <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-900 dark:text-blue-200 flex items-start gap-3 shadow-xs">
                            <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div className="space-y-1 text-xs">
                                <div className="font-bold text-sm text-blue-800 dark:text-blue-300">
                                    Inovasi Sedang Dalam Tahap {statusLabel[currentStatus] ?? currentStatus}
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    Data profil inovasi dan dokumen pendukung dikunci (mode baca saja) karena sedang dalam alur verifikasi atau pengesahan. Perubahan data hanya dapat dilakukan apabila status dikembalikan ke <strong>Revisi</strong> oleh Pendamping Inovasi.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Form Tabs Container */}
                <form onSubmit={handleSave}>
                    <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabKey)} className="w-full space-y-6">
                        <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto p-1.5 bg-muted/60 border rounded-xl gap-1">
                            <TabsTrigger
                                value="identitas"
                                className="text-xs py-2.5 data-[state=active]:bg-background data-[state=active]:font-bold data-[state=active]:shadow-xs"
                            >
                                I. Identitas
                            </TabsTrigger>
                            <TabsTrigger
                                value="klasifikasi"
                                className="text-xs py-2.5 data-[state=active]:bg-background data-[state=active]:font-bold data-[state=active]:shadow-xs"
                            >
                                II. Klasifikasi
                            </TabsTrigger>
                            <TabsTrigger
                                value="anggaran"
                                className="text-xs py-2.5 data-[state=active]:bg-background data-[state=active]:font-bold data-[state=active]:shadow-xs"
                            >
                                III. Anggaran
                            </TabsTrigger>
                            <TabsTrigger
                                value="narasi"
                                className="text-xs py-2.5 data-[state=active]:bg-background data-[state=active]:font-bold data-[state=active]:shadow-xs"
                            >
                                IV. Narasi
                            </TabsTrigger>
                            <TabsTrigger
                                value="dokumen"
                                className="text-xs py-2.5 data-[state=active]:bg-background data-[state=active]:font-bold data-[state=active]:shadow-xs"
                            >
                                V. Dokumen
                            </TabsTrigger>
                            <TabsTrigger
                                value="riwayat"
                                className="text-xs py-2.5 data-[state=active]:bg-background data-[state=active]:font-bold data-[state=active]:shadow-xs"
                            >
                                VI. Riwayat
                            </TabsTrigger>
                        </TabsList>

                        {/* TAB 1: IDENTITAS & INISIATOR */}
                        <TabsContent value="identitas">
                            <Card className="border-border shadow-xs">
                                <CardHeader className="border-b bg-muted/20 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-base font-bold">
                                                Bagian I: Identitas, Inisiator & Bentuk Inovasi
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                Informasi dasar judul inovasi, perangkat daerah, inisiator, bentuk, dan tahapan penerapan.
                                            </CardDescription>
                                        </div>
                                        {isReadOnly && (
                                            <Badge variant="secondary" className="text-xs font-normal text-muted-foreground">
                                                Mode Baca Saja
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 space-y-5">
                                    {/* Perangkat Daerah / OPD Pemilik (Locked / Fixed) */}
                                    <div className="p-3.5 rounded-lg border bg-muted/30 border-border grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-xs font-bold uppercase text-muted-foreground block">
                                                Instansi / Perangkat Daerah Pengusul
                                            </span>
                                            <div className="font-bold text-sm text-foreground">
                                                {inovasi.opd?.nama || 'Kabupaten Sumbawa'}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Terikat otomatis dengan akun OPD pengusul.
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs font-bold uppercase text-muted-foreground block">
                                                Pemerintah Daerah
                                            </span>
                                            <div className="font-semibold text-sm text-foreground">
                                                Pemerintah Kabupaten Sumbawa (Kode: 52.04)
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Portal Indeks Inovasi Daerah (IID) Kemendagri.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Nama Inovasi */}
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="nama_inovasi" className="font-semibold text-xs text-foreground">
                                            Nama Inovasi Daerah <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="nama_inovasi"
                                            value={data.nama_inovasi}
                                            disabled={isReadOnly}
                                            aria-invalid={Boolean(errors.nama_inovasi)}
                                            aria-describedby={errors.nama_inovasi ? 'nama_inovasi-error' : undefined}
                                            onChange={(e) => setData('nama_inovasi', e.target.value)}
                                            placeholder="Contoh: SI-SABALONG Pelayanan Adduk Tipe A Terintegrasi"
                                            className="text-xs sm:text-sm font-medium"
                                        />
                                        {errors.nama_inovasi && (
                                            <p id="nama_inovasi-error" role="alert" className="text-xs text-destructive font-medium">
                                                {errors.nama_inovasi}
                                            </p>
                                        )}
                                    </div>

                                    {/* Inisiator Inovasi Daerah (Accessible Native Radiogroup) */}
                                    <div className="grid gap-2">
                                        <Label id="label-inisiator" className="font-semibold text-xs text-foreground">
                                            Inisiator Inovasi Daerah <span className="text-destructive">*</span>
                                        </Label>
                                        <div role="radiogroup" aria-labelledby="label-inisiator" className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                                            {INISIATOR_OPTIONS.map((opt) => {
                                                const isSelected = (data.inisiator || 'opd') === opt.value;
                                                return (
                                                    <label
                                                        key={opt.value}
                                                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${isReadOnly ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                                                            } focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${isSelected
                                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                                : 'border-border bg-card hover:bg-muted/40'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="inisiator"
                                                            value={opt.value}
                                                            checked={isSelected}
                                                            disabled={isReadOnly}
                                                            onChange={() => setData('inisiator', opt.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-bold text-xs text-foreground">{opt.label}</span>
                                                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                                                                {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                                            </div>
                                                        </div>
                                                        <p className="text-[11px] text-muted-foreground leading-relaxed">{opt.desc}</p>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Nama Inisiator */}
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="nama_inisiator" className="font-semibold text-xs text-foreground">
                                            Nama Inisiator / Penggagas Inovasi <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="nama_inisiator"
                                            value={data.nama_inisiator}
                                            disabled={isReadOnly}
                                            aria-invalid={Boolean(errors.nama_inisiator)}
                                            aria-describedby={errors.nama_inisiator ? 'nama_inisiator-error' : undefined}
                                            onChange={(e) => setData('nama_inisiator', e.target.value)}
                                            placeholder="Contoh: Tim Efisiensi Pelayanan Disdukcapil Sumbawa"
                                            className="text-xs sm:text-sm"
                                        />
                                        {errors.nama_inisiator && (
                                            <p id="nama_inisiator-error" role="alert" className="text-xs text-destructive font-medium">
                                                {errors.nama_inisiator}
                                            </p>
                                        )}
                                    </div>

                                    {/* Tahapan Inovasi (Accessible Native Radiogroup) */}
                                    <div className="grid gap-2">
                                        <Label id="label-tahapan" className="font-semibold text-xs text-foreground">
                                            Tahapan Inovasi <span className="text-destructive">*</span>
                                        </Label>
                                        <div role="radiogroup" aria-labelledby="label-tahapan" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {[
                                                {
                                                    id: 'inisiatif',
                                                    title: 'Inisiatif',
                                                    desc: 'Gagasan / rancangan baru yang belum diuji coba',
                                                },
                                                {
                                                    id: 'ujicoba',
                                                    title: 'Uji Coba',
                                                    desc: 'Tahap prototipe dan piloting pengujian lapangan',
                                                },
                                                {
                                                    id: 'penerapan',
                                                    title: 'Penerapan',
                                                    desc: 'Telah diterapkan dan menghasilkan dampak nyata',
                                                },
                                            ].map((t) => {
                                                const isSelected = data.tahapan === t.id;
                                                return (
                                                    <label
                                                        key={t.id}
                                                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${isReadOnly ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                                                            } focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${isSelected
                                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                                : 'border-border bg-card hover:bg-muted/40'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="tahapan"
                                                            value={t.id}
                                                            checked={isSelected}
                                                            disabled={isReadOnly}
                                                            onChange={() => setData('tahapan', t.id)}
                                                            className="sr-only"
                                                        />
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <span className="font-bold text-xs text-foreground">{t.title}</span>
                                                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                                                                {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Bentuk Inovasi (Accessible Native Radiogroup) */}
                                    <div className="grid gap-2">
                                        <Label id="label-bentuk" className="font-semibold text-xs text-foreground">
                                            Bentuk Inovasi Daerah <span className="text-destructive">*</span>
                                        </Label>
                                        <div role="radiogroup" aria-labelledby="label-bentuk" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {[
                                                {
                                                    id: 'pelayanan_publik',
                                                    title: 'Inovasi Pelayanan Publik',
                                                    desc: 'Penyediaan dan peningkatan kualitas layanan langsung kepada masyarakat',
                                                },
                                                {
                                                    id: 'tata_kelola',
                                                    title: 'Inovasi Tata Kelola Pemda',
                                                    desc: 'Manajemen internal, efisiensi birokrasi, dan kinerja kelembagaan Pemda',
                                                },
                                                {
                                                    id: 'lainnya',
                                                    title: 'Inovasi Daerah Lainnya',
                                                    desc: 'Inovasi kewenangan daerah di luar pelayanan publik & tata kelola',
                                                },
                                            ].map((b) => {
                                                const isSelected = data.bentuk_inovasi === b.id;
                                                return (
                                                    <label
                                                        key={b.id}
                                                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${isReadOnly ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                                                            } focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${isSelected
                                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                                : 'border-border bg-card hover:bg-muted/40'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="bentuk_inovasi"
                                                            value={b.id}
                                                            checked={isSelected}
                                                            disabled={isReadOnly}
                                                            onChange={() => setData('bentuk_inovasi', b.id)}
                                                            className="sr-only"
                                                        />
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <span className="font-bold text-xs text-foreground">{b.title}</span>
                                                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                                                                {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Jenis Inovasi (Accessible Native Radiogroup) */}
                                    <div className="grid gap-2">
                                        <Label id="label-jenis" className="font-semibold text-xs text-foreground">
                                            Jenis Inovasi <span className="text-destructive">*</span>
                                        </Label>
                                        <div role="radiogroup" aria-labelledby="label-jenis" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                {
                                                    id: 'digital',
                                                    title: 'Inovasi Digital',
                                                    desc: 'Memanfaatkan aplikasi, platform web, otomasi sistem, atau IoT',
                                                },
                                                {
                                                    id: 'non_digital',
                                                    title: 'Inovasi Non-Digital',
                                                    desc: 'Metode manual, rekayasa sosial, SOP tata kerja, atau alat fisik',
                                                },
                                            ].map((j) => {
                                                const isSelected = data.jenis_inovasi === j.id;
                                                return (
                                                    <label
                                                        key={j.id}
                                                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${isReadOnly ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                                                            } focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${isSelected
                                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                                : 'border-border bg-card hover:bg-muted/40'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="jenis_inovasi"
                                                            value={j.id}
                                                            checked={isSelected}
                                                            disabled={isReadOnly}
                                                            onChange={() => setData('jenis_inovasi', j.id)}
                                                            className="sr-only"
                                                        />
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <span className="font-bold text-xs text-foreground">{j.title}</span>
                                                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                                                                {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground leading-relaxed">{j.desc}</p>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {renderTabFooter()}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 2: KLASIFIKASI & URUSAN */}
                        <TabsContent value="klasifikasi">
                            <Card className="border-border shadow-xs">
                                <CardHeader className="border-b bg-muted/20 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-base font-bold">
                                                Bagian II: Klasifikasi, Tematik & Urusan Pemerintahan
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                Kategori klasifikasi tematik IGA, 7 kriteria inovasi daerah, serta pemetaan urusan pemerintahan.
                                            </CardDescription>
                                        </div>
                                        {isReadOnly && (
                                            <Badge variant="secondary" className="text-xs font-normal text-muted-foreground">
                                                Mode Baca Saja
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 space-y-6">
                                    {isMasyarakat && (
                                        <div className="p-3.5 rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-900 dark:text-teal-200 text-xs flex items-start gap-2.5 shadow-xs">
                                            <AlertCircle className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-bold block text-teal-800 dark:text-teal-300">
                                                    Catatan Pendampingan Inovasi Masyarakat:
                                                </span>
                                                <p className="text-muted-foreground mt-0.5 leading-relaxed">
                                                    Klasifikasi tematik prioritas dan pemetaan urusan pemerintahan ini akan dilengkapi / diverifikasi bersama Pendamping Inovasi saat proses telaah usulan.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Klasifikasi (Accessible Native Radiogroup) */}
                                    <div className="grid gap-2">
                                        <Label id="label-klasifikasi" className="font-semibold text-xs text-foreground">
                                            Klasifikasi Inovasi <span className="text-destructive">*</span>
                                        </Label>
                                        <div role="radiogroup" aria-labelledby="label-klasifikasi" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <label
                                                className={`p-3.5 rounded-xl border text-left transition-all ${isReadOnly ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                                                    } focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${data.klasifikasi === 'non_tematik'
                                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                        : 'border-border bg-card hover:bg-muted/40'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="klasifikasi"
                                                    value="non_tematik"
                                                    checked={data.klasifikasi === 'non_tematik'}
                                                    disabled={isReadOnly}
                                                    onChange={() => setData('klasifikasi', 'non_tematik')}
                                                    className="sr-only"
                                                />
                                                <div className="font-bold text-xs text-foreground mb-0.5">Non-Tematik (Umum)</div>
                                                <p className="text-xs text-muted-foreground">Inovasi di luar 7 tema prioritas nasional/daerah</p>
                                            </label>

                                            <label
                                                className={`p-3.5 rounded-xl border text-left transition-all ${isReadOnly ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                                                    } focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${data.klasifikasi === 'tematik'
                                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                        : 'border-border bg-card hover:bg-muted/40'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="klasifikasi"
                                                    value="tematik"
                                                    checked={data.klasifikasi === 'tematik'}
                                                    disabled={isReadOnly}
                                                    onChange={() => setData('klasifikasi', 'tematik')}
                                                    className="sr-only"
                                                />
                                                <div className="font-bold text-xs text-foreground mb-0.5">Tematik Prioritas</div>
                                                <p className="text-xs text-muted-foreground">Mendukung tema prioritas (Stunting, Kemiskinan, Investasi, dll)</p>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Dropdown Tema Inovasi */}
                                    {data.klasifikasi === 'tematik' && (
                                        <div className="grid gap-1.5 p-4 rounded-xl border bg-primary/5 border-primary/20">
                                            <Label htmlFor="tematik" className="font-semibold text-xs text-foreground">
                                                Pilihan Tema Inovasi Daerah <span className="text-destructive">*</span>
                                            </Label>
                                            <Select
                                                value={data.tematik || ''}
                                                disabled={isReadOnly}
                                                onValueChange={(val) => setData('tematik', val)}
                                            >
                                                <SelectTrigger id="tematik" className="w-full text-xs bg-background">
                                                    <SelectValue placeholder="Pilih Tema Prioritas IGA" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {TEMATIK_OPTIONS.map((t) => (
                                                        <SelectItem key={t.value} value={t.value} className="text-xs">
                                                            {t.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* 7 Kriteria Inovasi Daerah */}
                                    <div className="space-y-2 p-4 rounded-xl border bg-muted/20">
                                        <div className="font-bold text-xs text-foreground">
                                            7 Kriteria Inovasi Daerah (PP No. 38 Tahun 2017 & IGA 2026)
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Pastikan inovasi yang diusulkan memenuhi seluruh kriteria kelayakan di bawah ini:
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                                            {KRITERIA_IGA_OPTIONS.map((k, idx) => (
                                                <div key={k.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-card border text-xs">
                                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-mono font-bold text-foreground select-none">
                                                        {idx + 1}
                                                    </span>
                                                    <div>
                                                        <div className="font-semibold text-foreground text-xs">{k.label}</div>
                                                        <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{k.desc}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Urusan Utama & Urusan Wajib */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="urusan_utama" className="font-semibold text-xs">Urusan Utama Inovasi</Label>
                                            <Select
                                                value={data.urusan_utama || ''}
                                                disabled={isReadOnly}
                                                onValueChange={(val) => setData('urusan_utama', val)}
                                            >
                                                <SelectTrigger id="urusan_utama" className="w-full text-xs bg-background">
                                                    <SelectValue placeholder="Pilih Urusan Utama" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {urusanList.map((u) => (
                                                        <SelectItem key={u.value} value={u.value} className="text-xs">
                                                            {u.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="font-semibold text-xs">Urusan Wajib Pelayanan Dasar</Label>
                                            <div className="space-y-1.5 p-3 rounded-lg border bg-muted/10 max-h-44 overflow-y-auto">
                                                {urusanWajibList.map((wajib) => {
                                                    const isChecked = data.urusan_wajib.includes(wajib);
                                                    return (
                                                        <label
                                                            key={wajib}
                                                            className="flex items-center gap-2 text-xs cursor-pointer hover:text-foreground"
                                                        >
                                                            <Checkbox
                                                                checked={isChecked}
                                                                disabled={isReadOnly}
                                                                onCheckedChange={(checked) => toggleWajib(wajib, Boolean(checked))}
                                                            />
                                                            <span className={isChecked ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
                                                                {wajib}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {renderTabFooter()}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 3: WAKTU, LOKASI & ANGGARAN */}
                        <TabsContent value="anggaran">
                            <Card className="border-border shadow-xs">
                                <CardHeader className="border-b bg-muted/20 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-base font-bold">
                                                Bagian III: Waktu, Lokasi & Rincian Anggaran
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                Linimasa penerapan, koordinat lokasi pelaksanaan, perbandingan anggaran, dan riwayat penghargaan.
                                            </CardDescription>
                                        </div>
                                        {isReadOnly && (
                                            <Badge variant="secondary" className="text-xs font-normal text-muted-foreground">
                                                Mode Baca Saja
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 space-y-6">
                                    {isMasyarakat && (
                                        <div className="p-3.5 rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-900 dark:text-teal-200 text-xs flex items-start gap-2.5 shadow-xs">
                                            <AlertCircle className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-bold block text-teal-800 dark:text-teal-300">
                                                    Catatan Pendampingan Inovasi Masyarakat:
                                                </span>
                                                <p className="text-muted-foreground mt-0.5 leading-relaxed">
                                                    Estimasi anggaran dan linimasa pengujian dapat dilengkapi bersama Pendamping Inovasi dari OPD pengampu.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Waktu Uji Coba & Penerapan */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="waktu_uji_coba" className="font-semibold text-xs">
                                                Waktu Uji Coba Inovasi
                                            </Label>
                                            <Input
                                                id="waktu_uji_coba"
                                                type="date"
                                                disabled={isReadOnly}
                                                value={data.waktu_uji_coba}
                                                onChange={(e) => setData('waktu_uji_coba', e.target.value)}
                                                className="text-xs"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="waktu_penerapan" className="font-semibold text-xs">
                                                Waktu Penerapan Resmi <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="waktu_penerapan"
                                                type="date"
                                                disabled={isReadOnly}
                                                value={data.waktu_penerapan}
                                                onChange={(e) => setData('waktu_penerapan', e.target.value)}
                                                className="text-xs"
                                            />
                                        </div>
                                    </div>

                                    {/* Titik Koordinat & Lokasi */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="koordinat" className="font-semibold text-xs">
                                                Titik Koordinat (Latitude, Longitude) <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="koordinat"
                                                disabled={isReadOnly}
                                                value={data.koordinat}
                                                onChange={(e) => setData('koordinat', e.target.value)}
                                                placeholder="-8.5037, 117.4241"
                                                className="text-xs font-mono"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="lokasi" className="font-semibold text-xs">
                                                Lokasi / Cakupan Wilayah Penerapan
                                            </Label>
                                            <Input
                                                id="lokasi"
                                                disabled={isReadOnly}
                                                value={data.lokasi}
                                                onChange={(e) => setData('lokasi', e.target.value)}
                                                placeholder="Contoh: Seluruh Kecamatan di Kabupaten Sumbawa"
                                                className="text-xs"
                                            />
                                        </div>
                                    </div>

                                    {/* Anggaran Sebelum & Sesudah with Accessible Rp Adornment */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border bg-muted/10">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="anggaran_sebelum" className="font-semibold text-xs text-foreground">
                                                Anggaran Sebelum Penerapan
                                            </Label>
                                            <div className="relative flex items-center rounded-md border border-input bg-background shadow-xs focus-within:ring-1 focus-within:ring-primary overflow-hidden">
                                                <span className="px-3 py-2 text-xs font-bold text-muted-foreground bg-muted/50 border-r select-none" aria-hidden="true">
                                                    Rp
                                                </span>
                                                <input
                                                    id="anggaran_sebelum"
                                                    type="text"
                                                    disabled={isReadOnly}
                                                    aria-label="Anggaran sebelum penerapan dalam Rupiah"
                                                    value={formatRupiahInput(data.anggaran_sebelum)}
                                                    onChange={(e) => {
                                                        const raw = e.target.value.replace(/\D/g, '');
                                                        setData('anggaran_sebelum', raw ? Number(raw) : '');
                                                    }}
                                                    placeholder="0"
                                                    className="w-full px-3 py-2 text-xs sm:text-sm font-mono bg-transparent border-none outline-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-75"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">Biaya operasional/program sebelum adanya inovasi.</p>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="anggaran_sesudah" className="font-semibold text-xs text-emerald-700 dark:text-emerald-400">
                                                Anggaran Sesudah Penerapan
                                            </Label>
                                            <div className="relative flex items-center rounded-md border border-input bg-background shadow-xs focus-within:ring-1 focus-within:ring-emerald-500 overflow-hidden">
                                                <span className="px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-r border-emerald-500/20 select-none" aria-hidden="true">
                                                    Rp
                                                </span>
                                                <input
                                                    id="anggaran_sesudah"
                                                    type="text"
                                                    disabled={isReadOnly}
                                                    aria-label="Anggaran sesudah penerapan dalam Rupiah"
                                                    value={formatRupiahInput(data.anggaran_sesudah)}
                                                    onChange={(e) => {
                                                        const raw = e.target.value.replace(/\D/g, '');
                                                        setData('anggaran_sesudah', raw ? Number(raw) : '');
                                                    }}
                                                    placeholder="0"
                                                    className="w-full px-3 py-2 text-xs sm:text-sm font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-transparent border-none outline-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-75"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">Efisiensi anggaran setelah inovasi diterapkan.</p>
                                        </div>
                                    </div>

                                    {/* Status Prestasi & Penghargaan */}
                                    <div className="space-y-3 p-4 rounded-xl border bg-card">
                                        <div className="flex items-center justify-between">
                                            <Label className="font-semibold text-xs text-foreground">
                                                Apakah Inovasi Pernah Memperoleh Prestasi / Penghargaan?
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    disabled={isReadOnly}
                                                    variant={data.is_penghargaan ? 'default' : 'outline'}
                                                    onClick={() => setData('is_penghargaan', true)}
                                                    className="h-7 text-xs px-3"
                                                >
                                                    Ya
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    disabled={isReadOnly}
                                                    variant={!data.is_penghargaan ? 'default' : 'outline'}
                                                    onClick={() => {
                                                        setData('is_penghargaan', false);
                                                        setData('nama_penghargaan', '');
                                                    }}
                                                    className="h-7 text-xs px-3"
                                                >
                                                    Tidak
                                                </Button>
                                            </div>
                                        </div>

                                        {data.is_penghargaan && (
                                            <div className="grid gap-1.5 pt-2 border-t">
                                                <Label htmlFor="nama_penghargaan" className="text-xs font-semibold">
                                                    Rincian Nama & Tahun Penghargaan yang Pernah Diraih
                                                </Label>
                                                <Input
                                                    id="nama_penghargaan"
                                                    disabled={isReadOnly}
                                                    value={data.nama_penghargaan}
                                                    onChange={(e) => setData('nama_penghargaan', e.target.value)}
                                                    placeholder="Contoh: Top 45 KIPP KemenPAN-RB Tahun 2024"
                                                    className="text-xs sm:text-sm"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {renderTabFooter()}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 4: RANCANG BANGUN & NARASI */}
                        <TabsContent value="narasi">
                            <Card className="border-border shadow-xs">
                                <CardHeader className="border-b bg-muted/20 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-base font-bold">
                                                Bagian IV: Deskripsi Rancang Bangun & Narasi Dampak
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                Uraikan latar belakang masalah, cara kerja, tujuan, manfaat nyata, dan hasil output inovasi.
                                            </CardDescription>
                                        </div>
                                        {isReadOnly && (
                                            <Badge variant="secondary" className="text-xs font-normal text-muted-foreground">
                                                Mode Baca Saja
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 space-y-6">
                                    {/* Rancang Bangun Inovasi with Accessible Live Word Counter */}
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <Label htmlFor="rancang_bangun" className="font-semibold text-xs text-foreground">
                                                Rancang Bangun Inovasi Daerah (Latar Belakang, Cara Kerja & Kebaruan) <span className="text-destructive">*</span>
                                            </Label>
                                            <Badge
                                                variant="outline"
                                                aria-live="polite"
                                                className={`text-xs font-mono font-bold transition-colors ${isWordCountValid
                                                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                    : 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                                    }`}
                                            >
                                                {isWordCountValid ? (
                                                    <span>{wordCount} / {minWordCount} Kata (Memenuhi Standar)</span>
                                                ) : (
                                                    <span>{wordCount} / Minimal {minWordCount} Kata</span>
                                                )}
                                            </Badge>
                                        </div>

                                        <Textarea
                                            id="rancang_bangun"
                                            rows={8}
                                            disabled={isReadOnly}
                                            value={data.rancang_bangun}
                                            onChange={(e) => setData('rancang_bangun', e.target.value)}
                                            placeholder="Tuliskan latar belakang masalah yang dihadapi, ide orisinal/kebaruan yang digagas, tahapan operasional cara kerja inovasi, dan keterlibatan stakeholder..."
                                            className="text-xs sm:text-sm leading-relaxed"
                                        />

                                        {!isWordCountValid && (
                                            <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-500/10 p-2.5 rounded-md flex items-center gap-1.5">
                                                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                                                <span>
                                                    {isMasyarakat
                                                        ? 'Uraikan penjelasan ide inovasi minimal 100 kata agar tim pendamping dapat memahami konsep dengan jelas.'
                                                        : 'Pedoman Umum IGA Kemendagri mewajibkan narasi Rancang Bangun minimal 300 kata untuk mendapatkan skor indikator maksimal (Indikator SID 1.1).'}
                                                </span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Tujuan Inovasi */}
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="tujuan" className="font-semibold text-xs text-foreground">
                                            Tujuan Inovasi <span className="text-destructive">*</span>
                                        </Label>
                                        <Textarea
                                            id="tujuan"
                                            rows={3}
                                            disabled={isReadOnly}
                                            value={data.tujuan}
                                            onChange={(e) => setData('tujuan', e.target.value)}
                                            placeholder="Jelaskan sasaran dan target konkret yang ingin dicapai melalui inovasi ini..."
                                            className="text-xs sm:text-sm"
                                        />
                                    </div>

                                    {/* Manfaat yang Diperoleh */}
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="manfaat" className="font-semibold text-xs text-foreground">
                                            Manfaat yang Diperoleh Bagi Masyarakat / Pemda <span className="text-destructive">*</span>
                                        </Label>
                                        <Textarea
                                            id="manfaat"
                                            rows={3}
                                            disabled={isReadOnly}
                                            value={data.manfaat}
                                            onChange={(e) => setData('manfaat', e.target.value)}
                                            placeholder="Uraikan dampak positif, kemudahan yang dirasakan pengguna layanan, serta peningkatan mutu..."
                                            className="text-xs sm:text-sm"
                                        />
                                    </div>

                                    {/* Hasil Inovasi / Output */}
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="hasil_inovasi" className="font-semibold text-xs text-foreground">
                                            Hasil Inovasi / Output Nyata <span className="text-destructive">*</span>
                                        </Label>
                                        <Textarea
                                            id="hasil_inovasi"
                                            rows={3}
                                            disabled={isReadOnly}
                                            value={data.hasil_inovasi}
                                            onChange={(e) => setData('hasil_inovasi', e.target.value)}
                                            placeholder="Sebutkan output kuantitatif / kualitatif yang telah terealisasi (misal: jumlah penerima manfaat, indeks kepuasan, efisiensi waktu)..."
                                            className="text-xs sm:text-sm"
                                        />
                                    </div>

                                    {renderTabFooter()}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 5: DOKUMEN PENDUKUNG PROFIL (HANYA 3 DOKUMEN) */}
                        <TabsContent value="dokumen">
                            <div className="space-y-6">
                                <Card className="border-border shadow-xs">
                                    <CardHeader className="border-b bg-muted/20 pb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-base font-bold">
                                                    Bagian V: Dokumen Pendukung Profil Inovasi
                                                </CardTitle>
                                                <CardDescription className="text-xs">
                                                    Khusus berkas proposal, piagam sertifikat penghargaan, dan tautan link video dokumentasi penerapan.
                                                </CardDescription>
                                            </div>
                                            {isReadOnly && (
                                                <Badge variant="secondary" className="text-xs font-normal text-muted-foreground">
                                                    Mode Baca Saja
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-6 space-y-6">
                                        {/* 1. Dokumen Proposal / Rancang Bangun (Accessible Label Dropzone) */}
                                        <div className="p-4 rounded-xl border bg-card space-y-3">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <div className="space-y-0.5">
                                                    <div className="font-bold text-xs text-foreground">
                                                        1. Dokumen Proposal / Rancang Bangun Inovasi (PDF / DOCX)
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Berkas dokumen proposal lengkap memuat latar belakang, metodologi, dan cara kerja.
                                                    </p>
                                                </div>
                                                {proposalDoc && (
                                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs font-semibold">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" aria-hidden="true" />
                                                        Terunggah
                                                    </Badge>
                                                )}
                                            </div>

                                            {proposalDoc ? (
                                                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 text-xs">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <FileText className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                                                        <div className="min-w-0">
                                                            <div className="font-semibold text-foreground truncate">{proposalDoc.nama_asal}</div>
                                                            <div className="text-xs text-muted-foreground">Ukuran: {formatBytes(proposalDoc.ukuran)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <Button variant="outline" size="sm" asChild className="h-7 text-xs gap-1">
                                                            <Link href={`/inovasi/dokumen/${proposalDoc.id}/download`}>
                                                                <Download className="h-3.5 w-3.5" /> Unduh
                                                            </Link>
                                                        </Button>
                                                        {!isReadOnly && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                                                                onClick={() => deleteDokumen(proposalDoc.id)}
                                                                title="Hapus file proposal"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                !isReadOnly && (
                                                    <div className="space-y-2">
                                                        <input
                                                            ref={proposalInputRef}
                                                            type="file"
                                                            id="proposal-upload"
                                                            accept=".pdf,.doc,.docx"
                                                            className="sr-only"
                                                            onChange={(e) => {
                                                                if (e.target.files?.[0]) setData('proposal', e.target.files[0]);
                                                            }}
                                                        />
                                                        {data.proposal ? (
                                                            <div className="flex items-center justify-between p-2.5 rounded-lg border bg-primary/5 border-primary/20 text-xs">
                                                                <div className="flex items-center gap-2 truncate">
                                                                    <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
                                                                    <span className="font-semibold truncate">{data.proposal.name}</span>
                                                                    <span className="text-muted-foreground">({formatBytes(data.proposal.size)})</span>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 text-xs text-destructive hover:bg-destructive/10"
                                                                    onClick={() => setData('proposal', null)}
                                                                >
                                                                    Batal
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <label
                                                                htmlFor="proposal-upload"
                                                                tabIndex={0}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                                        e.preventDefault();
                                                                        proposalInputRef.current?.click();
                                                                    }
                                                                }}
                                                                onDragOver={(e) => {
                                                                    e.preventDefault();
                                                                    setIsDraggingProposal(true);
                                                                }}
                                                                onDragLeave={(e) => {
                                                                    e.preventDefault();
                                                                    setIsDraggingProposal(false);
                                                                }}
                                                                onDrop={(e) => {
                                                                    e.preventDefault();
                                                                    setIsDraggingProposal(false);
                                                                    if (e.dataTransfer.files?.[0]) {
                                                                        setData('proposal', e.dataTransfer.files[0]);
                                                                    }
                                                                }}
                                                                className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all block focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${isDraggingProposal
                                                                    ? 'border-primary bg-primary/10 scale-[1.01]'
                                                                    : 'border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40'
                                                                    }`}
                                                            >
                                                                <UploadCloud className="h-7 w-7 text-primary mx-auto mb-1.5 opacity-80" aria-hidden="true" />
                                                                <div className="text-xs font-semibold text-foreground">
                                                                    Tarik & lepas file Proposal di sini, atau <span className="text-primary underline">klik untuk mencari berkas</span>
                                                                </div>
                                                                <div className="text-xs text-muted-foreground mt-1">Format PDF, DOC, DOCX (Maksimal 20MB)</div>
                                                            </label>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {/* 2. Sertifikat / Piagam Penghargaan (Accessible Label Dropzone) */}
                                        <div className="p-4 rounded-xl border bg-card space-y-3">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <div className="space-y-0.5">
                                                    <div className="font-bold text-xs text-foreground">
                                                        2. Sertifikat / Piagam Penghargaan Inovasi (PDF / JPG / PNG)
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Bukti sertifikat atau piagam prestasi penghargaan yang pernah diraih (jika ada).
                                                    </p>
                                                </div>
                                                {sertifikatDoc && (
                                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs font-semibold">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" aria-hidden="true" />
                                                        Terunggah
                                                    </Badge>
                                                )}
                                            </div>

                                            {sertifikatDoc ? (
                                                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 text-xs">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <FileText className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                                                        <div className="min-w-0">
                                                            <div className="font-semibold text-foreground truncate">{sertifikatDoc.nama_asal}</div>
                                                            <div className="text-xs text-muted-foreground">Ukuran: {formatBytes(sertifikatDoc.ukuran)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <Button variant="outline" size="sm" asChild className="h-7 text-xs gap-1">
                                                            <Link href={`/inovasi/dokumen/${sertifikatDoc.id}/download`}>
                                                                <Download className="h-3.5 w-3.5" /> Unduh
                                                            </Link>
                                                        </Button>
                                                        {!isReadOnly && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                                                                onClick={() => deleteDokumen(sertifikatDoc.id)}
                                                                title="Hapus file sertifikat"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                !isReadOnly && (
                                                    <div className="space-y-2">
                                                        <input
                                                            ref={sertifikatInputRef}
                                                            type="file"
                                                            id="sertifikat-upload"
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            className="sr-only"
                                                            onChange={(e) => {
                                                                if (e.target.files?.[0]) setData('sertifikat', e.target.files[0]);
                                                            }}
                                                        />
                                                        {data.sertifikat ? (
                                                            <div className="flex items-center justify-between p-2.5 rounded-lg border bg-primary/5 border-primary/20 text-xs">
                                                                <div className="flex items-center gap-2 truncate">
                                                                    <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
                                                                    <span className="font-semibold truncate">{data.sertifikat.name}</span>
                                                                    <span className="text-muted-foreground">({formatBytes(data.sertifikat.size)})</span>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-6 text-xs text-destructive hover:bg-destructive/10"
                                                                    onClick={() => setData('sertifikat', null)}
                                                                >
                                                                    Batal
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <label
                                                                htmlFor="sertifikat-upload"
                                                                tabIndex={0}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                                        e.preventDefault();
                                                                        sertifikatInputRef.current?.click();
                                                                    }
                                                                }}
                                                                onDragOver={(e) => {
                                                                    e.preventDefault();
                                                                    setIsDraggingSertifikat(true);
                                                                }}
                                                                onDragLeave={(e) => {
                                                                    e.preventDefault();
                                                                    setIsDraggingSertifikat(false);
                                                                }}
                                                                onDrop={(e) => {
                                                                    e.preventDefault();
                                                                    setIsDraggingSertifikat(false);
                                                                    if (e.dataTransfer.files?.[0]) {
                                                                        setData('sertifikat', e.dataTransfer.files[0]);
                                                                    }
                                                                }}
                                                                className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all block focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${isDraggingSertifikat
                                                                    ? 'border-primary bg-primary/10 scale-[1.01]'
                                                                    : 'border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40'
                                                                    }`}
                                                            >
                                                                <UploadCloud className="h-7 w-7 text-primary mx-auto mb-1.5 opacity-80" aria-hidden="true" />
                                                                <div className="text-xs font-semibold text-foreground">
                                                                    Tarik & lepas file Sertifikat di sini, atau <span className="text-primary underline">klik untuk mencari berkas</span>
                                                                </div>
                                                                <div className="text-xs text-muted-foreground mt-1">Format PDF, JPG, JPEG, PNG (Maksimal 20MB)</div>
                                                            </label>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {/* 3. Link Video Dokumentasi */}
                                        <div className="p-4 rounded-xl border bg-card space-y-3">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <div className="space-y-0.5">
                                                    <div className="font-bold text-xs text-foreground">
                                                        3. Link Video Dokumentasi Penerapan (YouTube / Drive)
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Tautan video visualisasi proses dan penerapan inovasi di lapangan.
                                                    </p>
                                                </div>
                                                {videoDoc && (
                                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs font-semibold">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" aria-hidden="true" />
                                                        Tersimpan
                                                    </Badge>
                                                )}
                                            </div>

                                            {videoDoc ? (
                                                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 text-xs">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <Video className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                                                        <div className="min-w-0">
                                                            <div className="font-semibold text-foreground truncate">{videoDoc.nama_asal || 'Video Dokumentasi Inovasi'}</div>
                                                            <a
                                                                href={videoDoc.path}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-primary hover:underline font-mono truncate block"
                                                            >
                                                                {videoDoc.path}
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <Button variant="outline" size="sm" asChild className="h-7 text-xs gap-1">
                                                            <a href={videoDoc.path} target="_blank" rel="noopener noreferrer">
                                                                <ExternalLink className="h-3.5 w-3.5" /> Buka Video
                                                            </a>
                                                        </Button>
                                                        {!isReadOnly && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                                                                onClick={() => deleteDokumen(videoDoc.id)}
                                                                title="Hapus tautan video"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                !isReadOnly && (
                                                    <div className="space-y-2">
                                                        <Input
                                                            type="url"
                                                            id="link_video"
                                                            aria-label="Tautan link video dokumentasi penerapan"
                                                            placeholder="https://www.youtube.com/watch?v=... atau https://drive.google.com/..."
                                                            value={data.link_video}
                                                            onChange={(e) => setData('link_video', e.target.value)}
                                                            className="text-xs"
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {renderTabFooter()}
                                    </CardContent>
                                </Card>

                                {/* Callout Navigasi 20 Indikator SID */}
                                <Card className="border-border bg-teal-500/5 border-teal-500/30 shadow-xs">
                                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-teal-600 text-white font-bold text-xs">
                                                    Lembar Kerja 20 Indikator SID
                                                </Badge>
                                                <span className="font-bold text-sm text-foreground">
                                                    Unggah Dokumen Bukti Dukung Indikator
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground max-w-xl">
                                                Dokumen teknis indikator (SK Tim Pengelola, Regulasi Perbup/SK Kepala Dinas, Bukti Bimtek/Sosialisasi, Kemanfaatan, dll) diunggah langsung per-indikator pada lembar kerja 20 Indikator SID.
                                            </p>
                                        </div>

                                        <Button
                                            asChild
                                            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs gap-2 shrink-0 shadow-xs"
                                        >
                                            <Link href={`/inovasi/${inovasi.id}/indikator`}>
                                                <FolderOpen className="h-4 w-4" /> Buka Lembar 20 Indikator SID
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* TAB 6: RIWAYAT & VALIDASI */}
                        <TabsContent value="riwayat">
                            <div className="space-y-6">
                                {/* Rantai Versi (Jika Ada) */}
                                {rantaiVersi && (
                                    <Card className="shadow-xs border-border">
                                        <CardHeader className="border-b bg-muted/20 pb-4">
                                            <CardTitle className="text-base font-bold">
                                                Silsilah Pohon Riwayat Versi Inovasi
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <RantaiVersi tree={rantaiVersi} />
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Log Transisi Validasi */}
                                <Card className="shadow-xs border-border">
                                    <CardHeader className="border-b bg-muted/20 pb-4">
                                        <CardTitle className="text-base font-bold">
                                            Riwayat Log Alur Validasi 8 Langkah
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Catatan audit trail setiap perubahan status dan verifikasi oleh Pendamping Inovasi & Bappeda.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="p-6">
                                        {(!inovasi.validasi_logs || inovasi.validasi_logs.length === 0) ? (
                                            <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
                                                Belum ada riwayat aktivitas validasi pada inovasi ini.
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {(inovasi.validasi_logs ?? [])
                                                    .slice()
                                                    .reverse()
                                                    .map((log) => (
                                                        <div
                                                            key={log.id}
                                                            className="border rounded-xl p-3.5 text-xs space-y-1.5 bg-card hover:bg-muted/10 transition-colors"
                                                        >
                                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                                <span className="font-bold text-foreground">
                                                                    {log.user?.name || 'Sistem'}
                                                                </span>
                                                                <span className="text-muted-foreground text-xs font-mono">
                                                                    {new Date(log.created_at).toLocaleString('id-ID')}
                                                                </span>
                                                            </div>
                                                            <div className="text-muted-foreground flex items-center gap-1.5 flex-wrap">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {statusLabel[log.status_sebelum] ?? log.status_sebelum}
                                                                </Badge>
                                                                <span aria-hidden="true">→</span>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`text-xs font-bold ${statusBadgeColor[log.status_sesudah] || ''
                                                                        }`}
                                                                >
                                                                    {statusLabel[log.status_sesudah] ?? log.status_sesudah}
                                                                </Badge>
                                                            </div>
                                                            {log.catatan && (
                                                                <div className="mt-1.5 p-2 rounded-md bg-muted/40 border text-xs italic text-foreground">
                                                                    "{log.catatan}"
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                            </div>
                                        )}

                                        {renderTabFooter()}
                                    </CardContent>
                                </Card>

                                {/* Tombol Hapus Draft Permanen */}
                                {currentStatus === 'draft' && (
                                    <Card className="border-destructive/30 bg-destructive/5 shadow-xs">
                                        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="space-y-0.5">
                                                <div className="font-bold text-xs text-destructive flex items-center gap-1.5">
                                                    <Trash2 className="h-4 w-4" />
                                                    Hapus Usulan Inovasi (Khusus Status Draft)
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Menghapus seluruh profil inovasi dan berkas dokumen pendukung secara permanen.
                                                </p>
                                            </div>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm" className="text-xs gap-1.5 shrink-0">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        Hapus Inovasi Ini
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Hapus usulan inovasi ini?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Seluruh data profil dan berkas dokumen pendukung terkait akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold"
                                                            onClick={() => router.delete(`/inovasi/${inovasi.id}`)}
                                                        >
                                                            Ya, Hapus Permanen
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </form>
            </div>
        </>
    );
}

EditInovasi.layout = {
    breadcrumbs: [
        {
            title: 'Inovasi Saya',
            href: '/inovasi',
        },
        {
            title: 'Profil & Edit Inovasi',
            href: '#',
        },
    ],
};