import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Award,
    Calculator,
    CheckCircle2,
    Clock,
    Download,
    ExternalLink,
    Eye,
    FileCheck,
    FileText,
    FolderOpen,
    History,
    Layers,
    Lock,
    MessageSquare,
    Send,
    ShieldAlert,
    Sparkles,
    Star,
    Video,
} from 'lucide-react';
import { useState } from 'react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import type { PengajuanLomba } from '@/types/models';

interface PenilaianItem {
    id: number;
    nama_juri: string;
    nilai: number;
    catatan: string | null;
    updated_at: string;
}

interface DokumenUmumItem {
    id: number;
    nama_asal: string;
    jenis: string;
    mime: string;
    path: string;
    ukuran: number;
}

type Props = {
    pengajuan: PengajuanLomba;
    canManageInovasiDaerah?: boolean;
    canRekomendasikan?: boolean;
    canNilaiJuri?: boolean;
    nilaiRataRataJuri?: number | null;
    jumlahJuriMenilai?: number;
    daftarPenilaianJuri?: PenilaianItem[];
    dokumenUmum?: DokumenUmumItem[];
};

const statusSteps = [
    { key: 'dalam_pendampingan', label: 'Dalam Pendampingan' },
    { key: 'disahkan_opd', label: 'Disahkan OPD' },
    { key: 'review_internal', label: 'Review Internal' },
    { key: 'siap_kirim', label: 'Siap Kirim' },
    { key: 'terkirim', label: 'Terkirim' },
];

const statusOrder: Record<string, number> = {
    dalam_pendampingan: 1,
    disahkan_opd: 2,
    review_internal: 3,
    siap_kirim: 4,
    terkirim: 5,
};

function formatBytes(bytes: number): string {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function PengajuanLombaShow({
    pengajuan,
    canManageInovasiDaerah = false,
    canRekomendasikan = false,
    canNilaiJuri = false,
    nilaiRataRataJuri = null,
    jumlahJuriMenilai = 0,
    daftarPenilaianJuri = [],
    dokumenUmum = [],
}: Props) {
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<string>('');
    const [actionCatatan, setActionCatatan] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const inovasi = pengajuan.inovasi;
    const currentStepIndex = statusOrder[pengajuan.status] ?? 1;

    const openActionDialog = (type: string) => {
        setActionType(type);
        setActionCatatan('');
        setActionDialogOpen(true);
    };

    const handleExecuteAction = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const endpoints: Record<string, string> = {
            rekomendasikan: `/pengajuan-lomba/${pengajuan.id}/rekomendasikan`,
            sahkan_opd: `/pengajuan-lomba/${pengajuan.id}/sahkan-opd`,
            kirim: `/pengajuan-lomba/${pengajuan.id}/kirim`,
        };

        const targetUrl = endpoints[actionType];
        if (!targetUrl) return;

        router.post(
            targetUrl,
            { catatan: actionCatatan.trim() || null },
            {
                onFinish: () => {
                    setIsProcessing(false);
                    setActionDialogOpen(false);
                },
            }
        );
    };

    const toggleInovasiDaerah = () => {
        router.post(`/pengajuan-lomba/${pengajuan.id}/tetapkan`, {
            status: !pengajuan.is_inovasi_daerah,
        });
    };

    return (
        <>
            <Head title={`Pengajuan: ${inovasi?.nama_inovasi} - INOVA-HUB`} />

            <div className="flex flex-col space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
                {/* Header Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 text-xs w-fit">
                        <Link href="/pengajuan-lomba">
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Kembali ke Daftar Pengajuan</span>
                        </Link>
                    </Button>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Wewenang Tim Penilai: Inovasi Daerah */}
                        {canManageInovasiDaerah && (
                            <Button
                                variant={pengajuan.is_inovasi_daerah ? 'secondary' : 'outline'}
                                size="sm"
                                onClick={toggleInovasiDaerah}
                                className="h-8 gap-1.5 text-xs cursor-pointer"
                            >
                                <Award className="h-3.5 w-3.5" />
                                <span>{pengajuan.is_inovasi_daerah ? 'Batalkan Penetapan Daerah' : 'Tetapkan Sebagai Inovasi Daerah'}</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Hero Banner Sumbawa */}
                <HeroBanner
                    title={inovasi?.nama_inovasi ?? 'Detail Pengajuan Lomba'}
                    subtitle={`Periode Lomba: ${pengajuan.periode_lomba?.nama ?? '2026'}. Inisiator: ${inovasi?.nama_inisiator} (${inovasi?.opd?.nama ?? 'Umum'}).`}
                    badgeText="Berkas Pengajuan Lomba Inovasi"
                />

                {/* 5-Step Status Workflow Stepper */}
                <Card className="border-border bg-card">
                    <CardContent className="p-4 sm:p-6">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                            Alur Status Penjaminan Mutu & Pengajuan (5 Langkah)
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                            {statusSteps.map((step, idx) => {
                                const stepNumber = idx + 1;
                                const isPassed = currentStepIndex > stepNumber;
                                const isCurrent = currentStepIndex === stepNumber;

                                return (
                                    <div
                                        key={step.key}
                                        className={`flex sm:flex-col items-center sm:items-start gap-3 p-3 rounded-lg border transition-all ${
                                            isCurrent
                                                ? 'bg-teal-50/80 border-teal-500/50 dark:bg-teal-950/30 text-teal-800 dark:text-teal-200 shadow-xs'
                                                : isPassed
                                                ? 'bg-muted/40 border-border text-foreground'
                                                : 'bg-muted/10 border-border/40 text-muted-foreground'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                                    isCurrent
                                                        ? 'bg-teal-600 text-white'
                                                        : isPassed
                                                        ? 'bg-primary/20 text-primary'
                                                        : 'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                {isPassed ? (
                                                    <CheckCircle2 className="h-4 w-4 text-teal-600" />
                                                ) : (
                                                    stepNumber
                                                )}
                                            </div>
                                            <span className="font-semibold text-xs">{step.label}</span>
                                        </div>

                                        <div className="text-[11px] text-muted-foreground pl-8 sm:pl-0">
                                            {isCurrent && <span className="font-medium text-teal-700 dark:text-teal-400">Tahap Berjalan</span>}
                                            {isPassed && <span>Selesai</span>}
                                            {!isCurrent && !isPassed && <span>Menunggu</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Workflow Actions Bar (Role-Based) */}
                <Card className="border-border bg-card">
                    <CardContent className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="text-xs font-semibold text-foreground">Aksi Tahapan Lomba</div>
                            <div className="text-[11px] text-muted-foreground">
                                Lakukan transisi status sesuai wewenang peran Anda pada proses penjaminan mutu.
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Rekomendasikan ke OPD (Pendamping) */}
                            {canRekomendasikan && pengajuan.status === 'dalam_pendampingan' && (
                                <Button
                                    size="sm"
                                    onClick={() => openActionDialog('rekomendasikan')}
                                    className="h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
                                >
                                    Rekomendasikan ke OPD
                                </Button>
                            )}

                            {/* Buka Lembar Penilaian Juri (Hanya Tim Penilai / Juri saat Disahkan OPD / Review Internal) */}
                            {canNilaiJuri && (pengajuan.status === 'disahkan_opd' || pengajuan.status === 'review_internal') && (
                                <Button
                                    size="sm"
                                    asChild
                                    className="h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white gap-1.5 shadow-xs cursor-pointer"
                                >
                                    <Link href={`/penilai/skoring/${pengajuan.id}`}>
                                        <Calculator className="h-3.5 w-3.5" />
                                        <span>Buka Lembar Penilaian Juri</span>
                                    </Link>
                                </Button>
                            )}

                            {/* Lihat Lembar Nilai Juri Terkunci (Hanya BAPPERIDA / Tim Penilai saat Siap Kirim / Terkirim) */}
                            {canManageInovasiDaerah && (pengajuan.status === 'siap_kirim' || pengajuan.status === 'terkirim') && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="h-8 text-xs border-teal-600 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 gap-1.5 cursor-pointer"
                                >
                                    <Link href={`/penilai/skoring/${pengajuan.id}`}>
                                        <Lock className="h-3.5 w-3.5" />
                                        <span>Lihat Lembar Nilai Juri (Terkunci)</span>
                                    </Link>
                                </Button>
                            )}

                            {/* Kirim ke Kemendagri (Hanya BAPPERIDA saat Siap Kirim) */}
                            {canManageInovasiDaerah && pengajuan.status === 'siap_kirim' && (
                                <Button
                                    size="sm"
                                    onClick={() => openActionDialog('kirim')}
                                    className="h-8 text-xs bg-blue-700 hover:bg-blue-800 text-white gap-1.5 shadow-xs cursor-pointer"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    <span>Finalisasi Terkirim Kemendagri</span>
                                </Button>
                            )}

                            {/* Status Terkirim Badge */}
                            {pengajuan.status === 'terkirim' && (
                                <Badge
                                    variant="outline"
                                    className="h-8 px-3 text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 gap-1.5 font-medium"
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                    <span>Telah Terkirim ke Portal Kemendagri</span>
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Details Grid: Profil Inovasi & Berkas Lomba vs Hasil Penilaian Juri */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Ringkasan Profil Inovasi Master & Berkas Dukung */}
                    <Card className="lg:col-span-2 border-border bg-card">
                        <CardHeader className="p-4 pb-3 border-b border-border">
                            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                                <FileText className="h-4 w-4 text-teal-600" />
                                Profil Inovasi & Berkas Lomba
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Informasi lengkap inovasi dan berkas administrasi peserta lomba.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Nama Inovasi:</span>
                                    <span className="font-semibold text-foreground">{inovasi?.nama_inovasi}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Inisiator & OPD:</span>
                                    <span className="font-semibold text-foreground">
                                        {inovasi?.nama_inisiator} ({inovasi?.opd?.nama ?? 'Publik'})
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Tahapan Inovasi:</span>
                                    <span className="capitalize font-semibold text-foreground">{inovasi?.tahapan}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Urusan Utama:</span>
                                    <span className="font-semibold text-foreground">{inovasi?.urusan_utama ?? '-'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Waktu Penerapan:</span>
                                    <span className="font-semibold text-foreground">
                                        {inovasi?.waktu_penerapan?.slice(0, 10) || '-'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Status Penetapan Daerah:</span>
                                    {pengajuan.is_inovasi_daerah ? (
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-semibold gap-1 inline-flex items-center">
                                            <Award className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                            <span>Ditetapkan Inovasi Daerah</span>
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="text-[10px] text-muted-foreground font-normal">
                                            Peserta Usulan Lomba
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Rancang Bangun */}
                            {inovasi?.rancang_bangun && (
                                <div className="pt-3 border-t border-border space-y-1.5">
                                    <span className="text-[11px] font-semibold text-foreground block">
                                        Rancang Bangun & Pokok Perubahan:
                                    </span>
                                    <p className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-md border">
                                        {inovasi.rancang_bangun}
                                    </p>
                                </div>
                            )}

                            {/* Berkas Dokumen Pendukung Lomba */}
                            <div className="pt-3 border-t border-border space-y-3">
                                <span className="text-xs font-semibold text-foreground block">
                                    Berkas Dokumen Pendukung Lomba
                                </span>

                                {/* Video Dokumentasi */}
                                {inovasi?.link_video ? (
                                    <div className="p-3 rounded-md border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/20 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-teal-900 dark:text-teal-300">
                                            <Video className="h-4 w-4 text-teal-600 shrink-0" />
                                            <span>Video Dokumentasi Inovasi</span>
                                        </div>
                                        <a
                                            href={inovasi.link_video}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors shrink-0"
                                        >
                                            <span>Tonton Video</span>
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                ) : (
                                    <div className="p-2.5 rounded-md border border-dashed text-xs text-muted-foreground flex items-center gap-2">
                                        <Video className="h-3.5 w-3.5 opacity-50" />
                                        <span>Tautan video dokumentasi belum dicantumkan.</span>
                                    </div>
                                )}

                                {/* Daftar Berkas Umum (Proposal, PPT, Piagam) */}
                                {dokumenUmum && dokumenUmum.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {dokumenUmum.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors flex items-center justify-between gap-2"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <FileText className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                                                        <span className="font-semibold text-xs text-foreground truncate block" title={doc.nama_asal}>
                                                            {doc.nama_asal}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 capitalize">
                                                            {doc.jenis.replace(/_/g, ' ')}
                                                        </Badge>
                                                        <span>•</span>
                                                        <span>{formatBytes(doc.ukuran)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 shrink-0">
                                                    <a
                                                        href={`/inovasi/dokumen/${doc.id}/preview`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                                        title="Pratinjau Dokumen"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </a>
                                                    <a
                                                        href={`/inovasi/dokumen/${doc.id}/download`}
                                                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                                        title="Unduh Berkas"
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-2.5 rounded-md border border-dashed text-xs text-muted-foreground flex items-center gap-2">
                                        <FileText className="h-3.5 w-3.5 opacity-50" />
                                        <span>Belum ada dokumen umum (Proposal/PPT/Piagam) diunggah.</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Hasil Penilaian Tim Juri Lomba (Eye-Catching Focal Point) */}
                    <Card className="border-border bg-card flex flex-col">
                        <CardHeader className="p-4 pb-3 border-b border-border">
                            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                                <Award className="h-4 w-4 text-teal-600" />
                                Hasil Penilaian Juri Lomba
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Evaluasi performa dan skor kumulatif juri.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                            {/* Score Display Card */}
                            <div className="text-center p-5 bg-teal-50/60 dark:bg-teal-950/30 rounded-xl border border-teal-200/80 dark:border-teal-900/60 space-y-1.5">
                                <div className="text-xs font-semibold text-teal-800 dark:text-teal-300">
                                    Nilai Rata-rata Tim Juri
                                </div>
                                <div className="text-4xl font-extrabold tracking-tight text-teal-700 dark:text-teal-400">
                                    {nilaiRataRataJuri !== null ? Number(nilaiRataRataJuri).toFixed(2) : '-'}
                                </div>
                                <div className="text-[11px] text-muted-foreground">
                                    Skala Penilaian 0 - 100 Poin
                                </div>
                            </div>

                            {/* Status Penilaian & Breakdown Juri */}
                            <div className="space-y-3 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Status Evaluasi:</span>
                                    {jumlahJuriMenilai > 0 ? (
                                        <Badge className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 font-semibold">
                                            Sudah Dinilai ({jumlahJuriMenilai} Juri)
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 text-[10px] font-semibold">
                                            Menunggu Penilaian Juri
                                        </Badge>
                                    )}
                                </div>

                                <div className="space-y-1.5 pt-2 border-t border-border">
                                    <div className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                                        <span>Rincian Nilai Juri</span>
                                        <span>{daftarPenilaianJuri.length} Terdaftar</span>
                                    </div>
                                    {daftarPenilaianJuri.length > 0 ? (
                                        <div className="space-y-1.5">
                                            {daftarPenilaianJuri.map((juri) => (
                                                <div
                                                    key={juri.id}
                                                    className="flex items-center justify-between p-2 rounded-md bg-muted/40 border text-xs"
                                                >
                                                    <span className="font-medium text-foreground truncate pr-2">
                                                        {juri.nama_juri}
                                                    </span>
                                                    <Badge variant="secondary" className="font-bold text-teal-700 dark:text-teal-300 shrink-0">
                                                        {juri.nilai}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[11px] text-muted-foreground italic py-1">
                                            Belum ada nilai yang dicatat oleh juri.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Tombol Cepat Menilai (Hanya untuk Tim Penilai / Juri) */}
                            {canNilaiJuri && (pengajuan.status === 'disahkan_opd' || pengajuan.status === 'review_internal') && (
                                <Button asChild className="w-full text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer mt-2">
                                    <Link href={`/penilai/skoring/${pengajuan.id}`}>
                                        <Calculator className="h-3.5 w-3.5 mr-1.5" />
                                        Masuk ke Form Penilaian Juri
                                    </Link>
                                </Button>
                            )}

                            {/* Keterangan Status Evaluasi untuk Inovator & Peran Non-Juri */}
                            {!canNilaiJuri && (
                                <div className="p-3 rounded-lg border border-teal-200/80 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/20 text-xs text-teal-900 dark:text-teal-200 mt-2 flex items-start gap-2">
                                    <Sparkles className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                                    <span className="leading-relaxed">
                                        {jumlahJuriMenilai > 0
                                            ? 'Penilaian telah dicatat oleh dewan juri. Silakan telusuri catatan evaluasi dan masukan tim juri pada tabel di bawah.'
                                            : 'Inovasi Anda sedang dalam antrean evaluasi Dewan Juri Lomba. Skor dan catatan akan otomatis tampil di sini setelah juri menilai.'}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Catatan & Penilaian Tim Juri Lomba (Full-Width) */}
                <Card className="border-border bg-card">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-teal-600" />
                                Catatan & Masukan Kualitatif Tim Juri ({daftarPenilaianJuri.length} Juri)
                            </CardTitle>
                            {nilaiRataRataJuri !== null && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Nilai Rata-rata:</span>
                                    <Badge className="bg-teal-600 text-white font-bold text-xs px-2.5 py-0.5">
                                        {nilaiRataRataJuri} / 100
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        {daftarPenilaianJuri.length > 0 ? (
                            <div className="space-y-3">
                                {daftarPenilaianJuri.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-3.5 rounded-lg border border-teal-200/60 dark:border-teal-900/60 bg-teal-50/20 dark:bg-teal-950/10 text-xs space-y-2"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-foreground">
                                                    {item.nama_juri}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> {item.updated_at}
                                                </span>
                                            </div>
                                            <Badge variant="outline" className="border-teal-500 text-teal-700 dark:text-teal-300 font-bold">
                                                Skor: {item.nilai}
                                            </Badge>
                                        </div>
                                        <div className="bg-background/80 p-2.5 rounded-md border text-foreground/90 whitespace-pre-line leading-relaxed">
                                            {item.catatan || <span className="text-muted-foreground italic">Tidak ada catatan evaluasi tertulis.</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground italic text-center py-4">
                                Belum ada masukan dan catatan evaluasi tertulis dari tim juri penilai lomba.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Kematangan 20 Indikator SID (Posisi Sekunder untuk Pelaporan IGA Kemendagri) */}
                <Card className="border-border bg-card">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-teal-600" />
                                Kematangan 20 Indikator SID (Standar IGA Kemendagri)
                            </CardTitle>
                            <Badge variant="outline" className="text-[10px] bg-muted/50">
                                Instrumen Mutu Pasca Lomba
                            </Badge>
                        </div>
                        <CardDescription className="text-xs">
                            Data indikator ini digunakan sebagai instrumen pembinaan mutu dan persiapan pelaporan resmi ke Kemendagri.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div className="p-3 bg-muted/30 rounded-lg border border-border">
                                <span className="text-[11px] text-muted-foreground block">Estimasi Skor Kematangan SID</span>
                                <span className="text-xl font-bold text-teal-700 dark:text-teal-400">
                                    {pengajuan.estimasi_skor_kematangan
                                        ? Number(pengajuan.estimasi_skor_kematangan).toFixed(2)
                                        : '0.00'}
                                </span>
                                <span className="text-[10px] text-muted-foreground block">Maksimal 111.00 Poin</span>
                            </div>

                            <div className="p-3 bg-muted/30 rounded-lg border border-border">
                                <span className="text-[11px] text-muted-foreground block">Kelengkapan Bukti Dukung</span>
                                <span className="text-xl font-bold text-foreground">
                                    {pengajuan.kelengkapan_indikator?.length ?? 0} <span className="text-xs font-normal text-muted-foreground">dari 20 SID</span>
                                </span>
                                <span className="text-[10px] text-muted-foreground block">
                                    {pengajuan.is_arsip ? 'Arsip Periode Lalu' : 'Periode Berjalan'}
                                </span>
                            </div>

                            <div className="flex flex-col justify-center">
                                <Button asChild variant="outline" className="w-full text-xs border-teal-600 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30 gap-1.5 cursor-pointer">
                                    <Link href={`/pengajuan-lomba/${pengajuan.id}/indikator`}>
                                        <FolderOpen className="h-3.5 w-3.5" />
                                        <span>Buka Lembar Kerja 20 Indikator SID</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Trail / Validasi Log History */}
                <Card className="border-border bg-card">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                            <History className="h-4 w-4 text-teal-600" />
                            Riwayat Transisi & Log Penjaminan Mutu
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        {(!pengajuan.validasi_logs || pengajuan.validasi_logs.length === 0) ? (
                            <p className="text-xs text-muted-foreground italic text-center py-4">
                                Belum ada riwayat aktivitas transisi tercatat.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {pengajuan.validasi_logs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex items-start gap-3 p-3 rounded-lg border border-border/70 bg-muted/20 text-xs"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-teal-600 shrink-0 mt-1.5" />
                                        <div className="flex-1 space-y-0.5">
                                            <div className="flex flex-wrap items-center justify-between gap-1">
                                                <span className="font-semibold text-foreground">
                                                    {log.user?.name ?? 'Sistem'}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground font-mono">
                                                    {log.created_at?.slice(0, 16)}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                                                Transisi: {log.status_sebelum ?? 'Draft'} ➔ {log.status_sesudah}
                                            </div>
                                            {log.catatan && (
                                                <p className="text-muted-foreground leading-relaxed pt-1">
                                                    {log.catatan}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Dialog Transisi Status */}
            <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
                <DialogContent className="sm:max-w-[460px]">
                    <form onSubmit={handleExecuteAction}>
                        <DialogHeader>
                            <DialogTitle className="text-foreground text-base">
                                {actionType === 'kirim'
                                    ? 'Finalisasi Terkirim ke Portal Kemendagri'
                                    : actionType === 'rekomendasikan'
                                    ? 'Rekomendasikan ke Kepala OPD'
                                    : 'Konfirmasi Transisi Status'}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                {actionType === 'kirim'
                                    ? 'Pastikan data inovasi dan nilai indikator telah disinkronkan ke sistem pusat IGA Kemendagri. Tindakan ini mencatat status inovasi menjadi Terkirim.'
                                    : 'Masukkan catatan verifikasi atau penjelasan untuk dicatat pada log audit sistem.'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-3">
                            <Textarea
                                placeholder={
                                    actionType === 'kirim'
                                        ? 'Catatan pengiriman (opsional, misal: ID registrasi Kemendagri)...'
                                        : 'Catatan verifikasi atau alasan rekomendasi...'
                                }
                                value={actionCatatan}
                                onChange={(e) => setActionCatatan(e.target.value)}
                                className="min-h-[90px] text-xs"
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setActionDialogOpen(false)}
                                disabled={isProcessing}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                className={
                                    actionType === 'kirim'
                                        ? 'bg-blue-700 hover:bg-blue-800 text-white'
                                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                                }
                                disabled={isProcessing}
                            >
                                {isProcessing
                                    ? 'Memproses...'
                                    : actionType === 'kirim'
                                    ? 'Konfirmasi Terkirim'
                                    : 'Konfirmasi Transisi'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

