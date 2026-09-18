import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Bell,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    FileEdit,
    FolderOpen,
    Info,
    MessageSquare,
    Search,
    Send,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { HeroBanner } from '@/components/hero-banner';
import { ParameterModal, type IndikatorSidItem } from '@/components/inovasi/parameter-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

type KelengkapanItem = {
    id: number;
    pengajuan_lomba_id: number;
    indikator_sid_id: number;
    parameter: string | null;
    catatan: string | null;
};

type SkorItem = {
    id: number;
    pengajuan_lomba_id: number;
    indikator_id: number;
    tier: number;
    skor: number;
    catatan?: string | null;
    komentar_pendamping?: string | null;
    pendamping_id?: number | null;
    komentar_at?: string | null;
    pendamping?: { id: number; name: string } | null;
};

type PengajuanInfo = {
    id: number;
    inovasi_id: number;
    nama_inovasi: string;
    status: string;
    tahapan: string;
    is_arsip?: boolean;
    is_inovasi_daerah?: boolean;
};

type Props = {
    pengajuan: PengajuanInfo;
    indikatorList: IndikatorSidItem[];
    kelengkapan: Record<number, KelengkapanItem>;
    skorList: Record<number, SkorItem>;
    dokumenInfo: Record<number, { count: number; types: string[] }>;
    progress: {
        filled: number;
        total: number;
        persen: number;
    };
    skorEstimasi: number;
    skorMaks: number;
    canComment?: boolean;
};

const statusBadgeMap: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }
> = {
    dalam_pendampingan: {
        label: 'Dalam Pendampingan',
        variant: 'outline',
        className: 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20',
    },
    disahkan_opd: {
        label: 'Disahkan OPD',
        variant: 'outline',
        className: 'border-blue-500 text-blue-700 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-950/20',
    },
    review_internal: {
        label: 'Review Internal',
        variant: 'secondary',
        className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300',
    },
    siap_kirim: {
        label: 'Siap Kirim',
        variant: 'default',
        className: 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold',
    },
    terkirim: {
        label: 'Terkirim',
        variant: 'default',
        className: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
};

const parameterTierMap: Record<string, { label: string; badgeClass: string; tier: number }> = {
    p1: { label: 'P1 (Tier 1)', badgeClass: 'bg-primary/10 text-primary border-primary/30', tier: 1 },
    p2: { label: 'P2 (Tier 2)', badgeClass: 'bg-primary/10 text-primary border-primary/30', tier: 2 },
    p3: { label: 'P3 (Tier 3)', badgeClass: 'bg-primary/10 text-primary border-primary/30', tier: 3 },
};

export default function IndikatorIndex({
    pengajuan,
    indikatorList,
    kelengkapan,
    skorList,
    dokumenInfo,
    progress,
    skorEstimasi,
    skorMaks,
    canComment = false,
}: Props) {
    const [paramModalOpen, setParamModalOpen] = useState(false);
    const [selectedIndikator, setSelectedIndikator] = useState<IndikatorSidItem | null>(null);

    // Comment Modal State for Pendamping
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [commentIndikator, setCommentIndikator] = useState<IndikatorSidItem | null>(null);
    const [commentText, setCommentText] = useState('');
    const [isSavingComment, setIsSavingComment] = useState(false);

    // Ping State
    const [isPinging, setIsPinging] = useState(false);

    const [filterStatus, setFilterStatus] = useState<'all' | 'incomplete' | 'complete'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedInfo, setExpandedInfo] = useState<Record<number, boolean>>({});

    const isLocked = pengajuan.status !== 'dalam_pendampingan' || Boolean(pengajuan.is_arsip);

    const openParamModal = (ind: IndikatorSidItem) => {
        setSelectedIndikator(ind);
        setParamModalOpen(true);
    };

    const openCommentModal = (ind: IndikatorSidItem) => {
        setCommentIndikator(ind);
        const existingComment = skorList[ind.id]?.komentar_pendamping || '';
        setCommentText(existingComment);
        setCommentModalOpen(true);
    };

    const saveKomentarPendamping = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentIndikator) return;

        setIsSavingComment(true);
        router.post(
            `/pengajuan-lomba/${pengajuan.id}/indikator/${commentIndikator.id}/komentar`,
            { komentar_pendamping: commentText.trim() || null },
            {
                onFinish: () => {
                    setIsSavingComment(false);
                    setCommentModalOpen(false);
                    setCommentIndikator(null);
                },
            }
        );
    };

    const handlePingPendamping = () => {
        setIsPinging(true);
        router.post(
            `/pengajuan-lomba/${pengajuan.id}/ping`,
            {},
            {
                onFinish: () => setIsPinging(false),
            }
        );
    };

    const toggleExpandInfo = (id: number) => {
        setExpandedInfo((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const currentKelengkapan = selectedIndikator ? kelengkapan[selectedIndikator.id] : null;

    const displayedIndikator = indikatorList.filter((ind) => {
        const kel = kelengkapan[ind.id];
        const dok = dokumenInfo[ind.id] ?? { count: 0, types: [] };
        const isComplete = Boolean(kel?.parameter) && dok.count > 0;

        if (filterStatus === 'incomplete' && isComplete) {
            return false;
        }
        if (filterStatus === 'complete' && !isComplete) {
            return false;
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const matchKode = ind.kode.toLowerCase().includes(query);
            const matchNama = ind.nama.toLowerCase().includes(query);
            const matchVariabel = (ind.variabel || '').toLowerCase().includes(query);
            return matchKode || matchNama || matchVariabel;
        }

        return true;
    });

    const st = statusBadgeMap[pengajuan.status] ?? {
        label: pengajuan.status,
        variant: 'secondary',
    };

    return (
        <>
            <Head title={`20 Indikator SID - ${pengajuan.nama_inovasi}`} />

            <div className="flex flex-col space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
                {/* Navigation Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 text-xs">
                            <Link href="/inovasi">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                <span>Kembali ke Inovasi</span>
                            </Link>
                        </Button>
                        <Badge variant={st.variant} className={st.className}>
                            {st.label}
                        </Badge>
                        {pengajuan.is_inovasi_daerah && (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-xs">
                                Inovasi Daerah
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Tombol Ping Pendamping */}
                        {!isLocked && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1.5 text-xs text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                                onClick={handlePingPendamping}
                                disabled={isPinging}
                                title="Kirim notifikasi ke tim pendamping untuk meninjau indikator"
                            >
                                <Bell className="h-3.5 w-3.5 text-amber-600" />
                                <span>{isPinging ? 'Mengirim...' : 'Ping Pendamping'}</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Hero Banner Sumbawa */}
                <HeroBanner
                    title={`Lembar 20 Indikator SID: ${pengajuan.nama_inovasi}`}
                    subtitle="Pilih parameter mutu indikator (P1/P2/P3) dan lampirkan bukti dukung resmi IGA. Review pendamping tampil langsung di baris indikator terkait."
                    badgeText="Quality Assurance IGA 2026"
                />

                {/* Progress & Estimasi Score Summary */}
                <Card className="border-border bg-card">
                    <CardContent className="p-4 sm:p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            {/* Progres Pengisian */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-foreground">Progres Pengisian Indikator</span>
                                    <span className="font-bold text-primary">
                                        {progress.filled} dari {progress.total} SID ({progress.persen}%)
                                    </span>
                                </div>
                                <Progress value={progress.persen} className="h-2.5" />
                                <p className="text-[11px] text-muted-foreground">
                                    {progress.total - progress.filled === 0
                                        ? 'Semua 20 indikator SID telah ditentukan parameternya.'
                                        : `${progress.total - progress.filled} indikator belum ditentukan parameternya.`}
                                </p>
                            </div>

                            {/* Simulasi Skor Kematangan */}
                            <div className="border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 space-y-1">
                                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    <Sparkles className="h-4 w-4 text-teal-600" />
                                    <span>Simulasi Skor Kematangan</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold tracking-tight text-teal-700 dark:text-teal-400">
                                        {skorEstimasi.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        / maks {skorMaks.toFixed(2)} poin
                                    </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    Kalkulasi berdasarkan bobot riil Permendagri & IGA 2026.
                                </p>
                            </div>

                            {/* Catatan Status Kunci */}
                            <div className="border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                                <div className="flex items-start gap-2">
                                    <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                    <div className="text-xs text-muted-foreground">
                                        {isLocked ? (
                                            <span>
                                                Lembar indikator berstatus <strong>read-only</strong> karena pengajuan telah
                                                disahkan atau diarsipkan.
                                            </span>
                                        ) : (
                                            <span>
                                                Pilih parameter capaian, unggah berkas bukti, lalu minta pendamping
                                                memverifikasi secara inline.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Filters & Search Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <Tabs
                        value={filterStatus}
                        onValueChange={(val) => setFilterStatus(val as typeof filterStatus)}
                        className="w-auto"
                    >
                        <TabsList className="h-8 text-xs">
                            <TabsTrigger value="all" className="text-xs">
                                Semua (20)
                            </TabsTrigger>
                            <TabsTrigger value="incomplete" className="text-xs">
                                Belum Lengkap
                            </TabsTrigger>
                            <TabsTrigger value="complete" className="text-xs">
                                Lengkap
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Cari kode atau nama indikator..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-8 pl-8 text-xs"
                        />
                    </div>
                </div>

                {/* Table of 20 SID Indicators */}
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="w-[80px] font-semibold">KODE</TableHead>
                                <TableHead className="min-w-[200px] font-semibold">INDIKATOR & DEFINISI</TableHead>
                                <TableHead className="w-[80px] text-center font-semibold">BOBOT</TableHead>
                                <TableHead className="w-[160px] text-center font-semibold">PARAMETER</TableHead>
                                <TableHead className="w-[130px] text-center font-semibold">BUKTI DUKUNG</TableHead>
                                <TableHead className="min-w-[220px] font-semibold">CATATAN PENDAMPING</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayedIndikator.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">
                                        Tidak ada indikator yang cocok dengan kriteria pencarian.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayedIndikator.map((ind) => {
                                    const kel = kelengkapan[ind.id];
                                    const dok = dokumenInfo[ind.id] ?? { count: 0, types: [] };
                                    const isExpanded = Boolean(expandedInfo[ind.id]);
                                    const skor = skorList[ind.id];

                                    const matchingOpsi = ind.opsi_list?.find((o: any) => o.id === kel?.parameter);
                                    let paramInfo: { label: string; fullLabel?: string; badgeClass: string; skor: string } | null = null;

                                    if (kel?.parameter) {
                                        if (kel.parameter === 'tidak_dapat_diukur') {
                                            paramInfo = {
                                                label: 'Tidak Dapat Diukur',
                                                badgeClass: 'bg-muted text-muted-foreground border-border',
                                                skor: '0.00',
                                            };
                                        } else if (matchingOpsi) {
                                            paramInfo = {
                                                label: matchingOpsi.label.length > 25 ? matchingOpsi.label.substring(0, 25) + '...' : matchingOpsi.label,
                                                fullLabel: matchingOpsi.label,
                                                badgeClass: 'bg-primary/10 text-primary border-primary/30',
                                                skor: (Number(matchingOpsi.bobot) * Number(ind.bobot)).toFixed(2),
                                            };
                                        } else if (parameterTierMap[kel.parameter.toLowerCase()]) {
                                            const t = parameterTierMap[kel.parameter.toLowerCase()];
                                            paramInfo = {
                                                label: t.label,
                                                badgeClass: t.badgeClass,
                                                skor: (t.tier * Number(ind.bobot)).toFixed(2),
                                            };
                                        } else {
                                            paramInfo = {
                                                label: kel.parameter,
                                                badgeClass: 'bg-primary/10 text-primary border-primary/30',
                                                skor: '0.00',
                                            };
                                        }
                                    }

                                    return (
                                        <TableRow key={ind.id} className="align-top hover:bg-muted/30">
                                            {/* Kode */}
                                            <TableCell className="font-mono font-bold text-xs text-primary pt-3.5">
                                                {ind.kode}
                                            </TableCell>

                                            {/* Indikator & Info */}
                                            <TableCell className="space-y-1.5 pt-3">
                                                <div className="font-semibold text-xs text-foreground leading-snug">
                                                    {ind.nama}
                                                </div>
                                                <div className="text-[11px] text-muted-foreground leading-relaxed">
                                                    {ind.variabel || '-'}
                                                </div>

                                                {/* Petunjuk Bukti Dukung Expandable */}
                                                {ind.informasi && (
                                                    <div className="pt-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleExpandInfo(ind.id)}
                                                            className="inline-flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-400 hover:underline font-medium"
                                                        >
                                                            <Info className="h-3 w-3" />
                                                            <span>
                                                                {isExpanded
                                                                    ? 'Tutup Petunjuk Teknis Bukti'
                                                                    : 'Petunjuk Teknis Bukti Dukung'}
                                                            </span>
                                                            {isExpanded ? (
                                                                <ChevronUp className="h-3 w-3" />
                                                            ) : (
                                                                <ChevronDown className="h-3 w-3" />
                                                            )}
                                                        </button>
                                                        {isExpanded && (
                                                            <div className="mt-1.5 p-2.5 rounded bg-muted/60 border border-border text-[11px] text-muted-foreground leading-relaxed">
                                                                {ind.informasi}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </TableCell>

                                            {/* Bobot */}
                                            <TableCell className="text-center font-bold text-xs pt-3.5">
                                                {Number(ind.bobot).toFixed(2)}
                                            </TableCell>

                                            {/* Parameter Button / Status */}
                                            <TableCell className="text-center pt-3">
                                                {paramInfo ? (
                                                    <div className="space-y-1">
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs ${paramInfo.badgeClass}`}
                                                            title={paramInfo.fullLabel}
                                                        >
                                                            {paramInfo.label}
                                                        </Badge>
                                                        <div className="text-[10px] text-muted-foreground">
                                                            Skor: {paramInfo.skor}
                                                        </div>
                                                        {!isLocked && (
                                                            <button
                                                                type="button"
                                                                onClick={() => openParamModal(ind)}
                                                                className="text-[11px] text-teal-600 hover:underline block mx-auto"
                                                            >
                                                                Ubah
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openParamModal(ind)}
                                                            disabled={isLocked}
                                                            className="h-7 text-xs border-dashed text-muted-foreground hover:text-foreground hover:border-solid"
                                                        >
                                                            Pilih Parameter
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>

                                            {/* Data Dukung */}
                                            <TableCell className="text-center pt-3">
                                                <Button
                                                    variant={dok.count > 0 ? 'secondary' : 'outline'}
                                                    size="sm"
                                                    asChild
                                                    className="h-8 text-xs gap-1.5"
                                                    title={`Kelola Dokumen ${ind.kode}`}
                                                >
                                                    <Link href={`/pengajuan-lomba/${pengajuan.id}/indikator/${ind.id}/dokumen`}>
                                                        <FolderOpen className="h-3.5 w-3.5 text-teal-600" />
                                                        <span>{dok.count} Berkas</span>
                                                    </Link>
                                                </Button>
                                                {dok.types.length > 0 && (
                                                    <div className="text-[10px] text-muted-foreground mt-1 truncate max-w-[120px] mx-auto">
                                                        {dok.types.join(', ')}
                                                    </div>
                                                )}
                                            </TableCell>

                                            {/* Komentar Pendamping Inline */}
                                            <TableCell className="pt-3 space-y-1">
                                                {skor?.komentar_pendamping ? (
                                                    <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded p-2 text-xs space-y-1">
                                                        <div className="text-foreground leading-relaxed">
                                                            {skor.komentar_pendamping}
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground flex items-center justify-between pt-1 border-t border-amber-200/50 dark:border-amber-800/50">
                                                            <span>Oleh: {skor.pendamping?.name ?? 'Pendamping'}</span>
                                                            {canComment && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openCommentModal(ind)}
                                                                    className="text-teal-700 dark:text-teal-400 hover:underline font-medium"
                                                                >
                                                                    Edit
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-[11px] text-muted-foreground italic flex items-center justify-between">
                                                        <span>Belum ada catatan.</span>
                                                        {canComment && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => openCommentModal(ind)}
                                                                className="h-6 text-[11px] px-2 text-teal-700 hover:bg-teal-50"
                                                            >
                                                                <MessageSquare className="h-3 w-3 mr-1" />
                                                                Beri Catatan
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal Pemilihan Parameter Mutu P1/P2/P3 */}
            <ParameterModal
                open={paramModalOpen}
                onOpenChange={setParamModalOpen}
                indikator={selectedIndikator}
                pengajuanId={pengajuan.id}
                currentParameter={currentKelengkapan?.parameter ?? null}
                currentCatatan={currentKelengkapan?.catatan ?? null}
                disabled={isLocked}
            />

            {/* Modal Input Catatan Pendamping */}
            <Dialog open={commentModalOpen} onOpenChange={setCommentModalOpen}>
                <DialogContent className="sm:max-w-[480px]">
                    <form onSubmit={saveKomentarPendamping}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-foreground text-base">
                                <MessageSquare className="h-4 w-4 text-teal-600" />
                                Catatan Review: {commentIndikator?.kode}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Berikan catatan review atau arahan perbaikan dokumen bukti untuk indikator ini.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-3">
                            <Textarea
                                placeholder="Tuliskan catatan evaluasi atau petunjuk berkas yang kurang..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="min-h-[100px] text-xs"
                                maxLength={1000}
                            />
                            <div className="text-[10px] text-muted-foreground text-right mt-1">
                                {commentText.length}/1000 karakter
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setCommentModalOpen(false)}
                                disabled={isSavingComment}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                className="bg-teal-600 hover:bg-teal-700 text-white"
                                disabled={isSavingComment}
                            >
                                {isSavingComment ? 'Menyimpan...' : 'Simpan Catatan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
