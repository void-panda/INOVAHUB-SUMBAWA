import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Download,
    FileCheck,
    FileText,
    FolderOpen,
    Printer,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { BreadcrumbItem } from '@/types';
import type { PengajuanLomba } from '@/types/models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pendampingan & Validasi', href: '/pendamping/inovasi' },
    { title: 'Review Inovasi', href: '#' },
];

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
    // legacy support
    draft: 0,
    diajukan: 1,
    divalidasi: 1,
    revisi: 1,
    disetujui: 2,
};

const statusLabel: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
    dalam_pendampingan: { label: 'Dalam Pendampingan', variant: 'secondary', className: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300' },
    disahkan_opd: { label: 'Disahkan OPD', variant: 'outline', className: 'border-teal-500 text-teal-700 dark:text-teal-400 font-bold' },
    review_internal: { label: 'Review Internal', variant: 'secondary', className: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300' },
    siap_kirim: { label: 'Siap Kirim', variant: 'default', className: 'bg-emerald-600 text-white' },
    terkirim: { label: 'Terkirim', variant: 'default', className: 'bg-blue-600 text-white' },
    // legacy support:
    draft: { label: 'Draft', variant: 'secondary' },
    diajukan: { label: 'Diajukan', variant: 'default' },
    divalidasi: { label: 'Divalidasi', variant: 'secondary' },
    revisi: { label: 'Perlu Revisi', variant: 'destructive' },
    disetujui: { label: 'Disetujui', variant: 'outline', className: 'border-emerald-500 text-emerald-600 dark:text-emerald-400' },
};

type Dokumen = {
    id: number;
    nama_asal: string;
    mime: string;
    ukuran: number;
};

type Log = {
    id: number;
    status_sebelum: string;
    status_sesudah: string;
    catatan: string | null;
    created_at: string;
    user?: { name: string; email?: string } | null;
};

type InovasiDetail = {
    id: number;
    nama_inovasi: string;
    tahapan: string;
    status?: string;
    nama_inisiator?: string;
    koordinat?: string;
    urusan_utama?: string | null;
    urusan_wajib?: string | null;
    waktu_uji_coba?: string | null;
    waktu_penerapan?: string;
    waktu_pengembangan?: string | null;
    estimasi_skor_kematangan?: number | null;
    user?: { name: string; nama_pemda?: string };
    opd?: { nama: string };
    dokumen?: Dokumen[];
    validasi_logs?: Log[];
};

type Props = {
    pengajuan?: PengajuanLomba | null;
    inovasi?: InovasiDetail | null;
    auth: {
        user: { id: number; name?: string };
        permissions?: string[];
    };
};

function formatBytes(bytes: number = 0) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatUrusanWajib(val: string | string[] | null | undefined): string {
    if (!val) return '-';
    if (Array.isArray(val)) return val.length > 0 ? val.join(', ') : '-';
    if (typeof val === 'string') {
        const trimmed = val.trim();
        if (!trimmed) return '-';
        if (trimmed.startsWith('[')) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) return parsed.length > 0 ? parsed.join(', ') : '-';
                if (typeof parsed === 'string') return parsed;
            } catch {
                // Return trimmed raw string if JSON parsing fails
            }
        }
        return trimmed;
    }
    return String(val);
}

export default function ValidasiShow({ pengajuan, inovasi, auth }: Props) {
    const activePengajuan = pengajuan;
    const activeInovasi = inovasi || (pengajuan?.inovasi as unknown as InovasiDetail);

    const [showSahkanCard, setShowSahkanCard] = useState(false);
    const [sptjmChecked, setSptjmChecked] = useState(false);

    const sahkanForm = useForm({ catatan: '' });

    const targetPengajuanId = activePengajuan?.id ?? activeInovasi?.id;
    const currentStatus = (activePengajuan?.status ?? activeInovasi?.status ?? 'dalam_pendampingan') as string;
    const currentStepIndex = statusOrder[currentStatus] ?? 1;

    const canApproveOpd = auth.permissions?.includes('approve-opd') || auth.permissions?.includes('validate-inovasi');
    const st = statusLabel[currentStatus] || { label: currentStatus, variant: 'secondary' };

    const dokumenList = activeInovasi?.dokumen || (activePengajuan?.dokumen as unknown as Dokumen[]) || [];
    const validasiLogsList = activeInovasi?.validasi_logs || ((activePengajuan as any)?.validasiLogs as Log[]) || [];

    const handleSahkan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetPengajuanId) return;

        sahkanForm.post(`/pendamping/inovasi/${targetPengajuanId}/sahkan-opd`, {
            onSuccess: () => {
                setShowSahkanCard(false);
            },
        });
    };

    const namaInovasi = activeInovasi?.nama_inovasi ?? 'Review Inovasi';
    const pengusulNama = activeInovasi?.user?.nama_pemda || activeInovasi?.user?.name || activePengajuan?.user?.name || '-';
    const opdNama = activeInovasi?.opd?.nama || (activeInovasi?.user as any)?.opd?.nama || 'Perangkat Daerah';
    const skorKematangan = activePengajuan?.estimasi_skor_kematangan ?? activeInovasi?.estimasi_skor_kematangan;

    return (
        <>
            <Head title={`Review Inovasi: ${namaInovasi}`} />

            <div className="flex flex-col space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
                {/* Hero Banner INOVA-HUB */}
                <HeroBanner
                    badgeIcon={ShieldCheck}
                    badgeText="Verifikasi & Validasi"
                    title={namaInovasi}
                    description={`Pengusul: ${pengusulNama} (${opdNama})`}
                    variant="teal"
                >
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl h-9 text-xs"
                        >
                            <Link href="/pendamping/inovasi">
                                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Kembali ke Antrean
                            </Link>
                        </Button>

                        {targetPengajuanId && (
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-white border-emerald-400/30 rounded-xl h-9 text-xs font-semibold shadow-xs"
                            >
                                <Link href={`/pengajuan-lomba/${targetPengajuanId}/indikator`}>
                                    <FolderOpen className="h-3.5 w-3.5 mr-1 text-emerald-300" /> Lembar 20 Indikator SID
                                </Link>
                            </Button>
                        )}

                        {activeInovasi?.id && (
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl h-9 text-xs"
                            >
                                <a href={`/inovasi/${activeInovasi.id}/print`} target="_blank" rel="noopener noreferrer">
                                    <Printer className="h-3.5 w-3.5 mr-1" /> Cetak Lembar Profil
                                </a>
                            </Button>
                        )}

                        <Badge variant={st.variant} className={`text-xs px-3 py-1 ${st.className || 'bg-white text-teal-900'}`}>
                            {st.label}
                        </Badge>
                    </div>
                </HeroBanner>

                {/* 5-Step Status Workflow Stepper */}
                <Card className="border-border bg-card shadow-xs">
                    <CardContent className="p-4 sm:p-5">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
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
                                        className={`flex sm:flex-col items-center sm:items-start gap-2.5 p-3 rounded-lg border transition-all ${
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
                                            {isCurrent && <span className="font-medium text-teal-700 dark:text-teal-400">Sedang Berjalan</span>}
                                            {isPassed && <span>Selesai</span>}
                                            {!isCurrent && !isPassed && <span>Menunggu</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Pendamping Quick Action Bar */}
                <Card className="border-teal-500/20 bg-teal-50/30 dark:bg-teal-950/20 shadow-xs">
                    <CardHeader className="py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <FileCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                                    Tindakan Pendamping & Verifikator OPD
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    {currentStatus === 'dalam_pendampingan' || currentStatus === 'diajukan' || currentStatus === 'divalidasi'
                                        ? 'Periksa 20 Indikator SID inovasi, berikan catatan bimbingan, dan lakukan pengesahan resmi (SPTJM).'
                                        : 'Inovasi telah melalui tahap pengesahan OPD dan saat ini berada di tahapan review / pengiriman berikutnya.'}
                                </CardDescription>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                {targetPengajuanId && (
                                    <Button
                                        asChild
                                        size="sm"
                                        className="h-8 gap-1.5 text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-xs font-semibold"
                                    >
                                        <Link href={`/pengajuan-lomba/${targetPengajuanId}/indikator`}>
                                            <FolderOpen className="size-3.5" />
                                            <span>Buka 20 Indikator SID</span>
                                        </Link>
                                    </Button>
                                )}

                                {(currentStatus === 'dalam_pendampingan' || currentStatus === 'disetujui') && canApproveOpd && (
                                    <Button
                                        onClick={() => setShowSahkanCard(true)}
                                        size="sm"
                                        variant="outline"
                                        className="h-8 gap-1.5 text-xs border-teal-600 text-teal-700 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950/50 font-semibold"
                                    >
                                        <FileCheck className="size-3.5 text-teal-600" />
                                        <span>Sahkan OPD (SPTJM)</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    {skorKematangan !== undefined && skorKematangan !== null && (
                        <CardContent className="pt-0 pb-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-800 dark:text-emerald-300">
                                <Sparkles className="size-3.5 text-emerald-600" />
                                <span className="font-semibold">Estimasi Skor Kematangan:</span>
                                <span className="font-bold text-sm">{Number(skorKematangan).toFixed(2)}</span>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* Sahkan OPD Form Box */}
                {showSahkanCard && (
                    <Card className="border-teal-600 bg-teal-50/40 dark:bg-teal-950/30 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-teal-800 dark:text-teal-300 flex items-center gap-2 text-base font-bold">
                                <FileCheck className="h-5 w-5" />
                                Pengesahan Akhir Perangkat Daerah (OPD) & SPTJM
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Dengan mengesahkan, Anda mengonfirmasi bahwa data inovasi ini sah, akurat, dan secara resmi mewakili Perangkat Daerah Kabupaten Sumbawa.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSahkan} className="space-y-4">
                                <div className="rounded-lg border border-teal-200 bg-teal-50/80 p-4 dark:border-teal-900 dark:bg-teal-950/50">
                                    <div className="flex items-start space-x-3">
                                        <input
                                            type="checkbox"
                                            id="sptjm_check"
                                            checked={sptjmChecked}
                                            onChange={(e) => setSptjmChecked(e.target.checked)}
                                            className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                            required
                                        />
                                        <label htmlFor="sptjm_check" className="text-xs leading-relaxed font-medium text-foreground cursor-pointer">
                                            <span className="font-bold text-teal-800 dark:text-teal-300 block mb-1">
                                                Pernyataan SPTJM (Surat Pernyataan Tanggung Jawab Mutlak):
                                            </span>
                                            "Saya bertindak atas nama Perangkat Daerah (OPD) Kabupaten Sumbawa menyatakan bahwa seluruh dokumen dan data inovasi ini adalah sah, benar, dan dapat dipertanggungjawabkan untuk diikutkan dalam penilaian Indeks Inovasi Daerah (IID)."
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="catatan_sahkan" className="text-xs font-semibold">Catatan Pengesahan (Opsional)</Label>
                                    <Textarea
                                        id="catatan_sahkan"
                                        rows={3}
                                        value={sahkanForm.data.catatan}
                                        onChange={(e) => sahkanForm.setData('catatan', e.target.value)}
                                        placeholder="Misal: Disahkan oleh Kepala Dinas / Sekretaris OPD..."
                                        className="mt-1.5 text-xs"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowSahkanCard(false)} className="text-xs">
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold gap-1.5 shadow-xs"
                                        disabled={sahkanForm.processing || !sptjmChecked}
                                    >
                                        <FileCheck className="h-4 w-4" />
                                        Sahkan Inovasi (SPTJM Confirmed)
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Detail Profil Inovasi Card */}
                <Card className="border-border shadow-xs">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">{namaInovasi}</CardTitle>
                        <CardDescription>
                            Diajukan oleh: <span className="font-semibold">{pengusulNama}</span> ({opdNama})
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-muted/60 p-3 rounded-lg border border-border/50">
                                <span className="text-muted-foreground block text-xs">Tahapan</span>
                                <span className="font-semibold capitalize">{activeInovasi?.tahapan || '-'}</span>
                            </div>
                            <div className="bg-muted/60 p-3 rounded-lg border border-border/50">
                                <span className="text-muted-foreground block text-xs">Nama Inisiator</span>
                                <span className="font-semibold">{activeInovasi?.nama_inisiator || '-'}</span>
                            </div>
                            <div className="bg-muted/60 p-3 rounded-lg border border-border/50">
                                <span className="text-muted-foreground block text-xs">Koordinat (Lat, Lng)</span>
                                <span className="font-semibold">{activeInovasi?.koordinat || '-'}</span>
                            </div>
                            <div className="bg-muted/60 p-3 rounded-lg border border-border/50">
                                <span className="text-muted-foreground block text-xs">Urusan Utama</span>
                                <span className="font-semibold">{activeInovasi?.urusan_utama || '-'}</span>
                            </div>
                            <div className="bg-muted/60 p-3 rounded-lg border border-border/50">
                                <span className="text-muted-foreground block text-xs">Urusan Wajib Yandas</span>
                                <span className="font-semibold">{formatUrusanWajib(activeInovasi?.urusan_wajib)}</span>
                            </div>
                            <div className="bg-muted/60 p-3 rounded-lg border border-border/50">
                                <span className="text-muted-foreground block text-xs">Waktu Penerapan</span>
                                <span className="font-semibold">{activeInovasi?.waktu_penerapan || '-'}</span>
                            </div>
                        </div>

                        {/* Dokumen Dukung Umum */}
                        <div>
                            <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                                <FileText className="size-4 text-teal-600" />
                                <span>Dokumen Dukung Umum ({dokumenList.length})</span>
                            </h3>
                            {dokumenList.length === 0 ? (
                                <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg border border-dashed text-center">
                                    Tidak ada dokumen umum yang diunggah.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {dokumenList.map((dok) => (
                                        <div key={dok.id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/20 transition-colors">
                                            <div className="flex items-center gap-2.5 truncate">
                                                <FileText className="size-4 shrink-0 text-muted-foreground" />
                                                <span className="text-sm truncate font-medium">{dok.nama_asal}</span>
                                                <span className="text-xs text-muted-foreground shrink-0">({formatBytes(dok.ukuran)})</span>
                                            </div>
                                            <a href={`/inovasi/dokumen/${dok.id}/download`} target="_blank" rel="noreferrer">
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                    <Download className="size-4" />
                                                </Button>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Riwayat Validasi & Audit Trail */}
                        <div>
                            <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                                <Clock className="size-4 text-teal-600" />
                                <span>Riwayat Validasi & Audit Trail</span>
                            </h3>
                            {validasiLogsList.length === 0 ? (
                                <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg border border-dashed text-center">
                                    Belum ada catatan riwayat validasi.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {validasiLogsList.map((log) => (
                                        <div key={log.id} className="border-l-2 border-teal-600 pl-4 py-1 text-sm space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold">{log.user?.name || 'Sistem'}</span>
                                                <span className="text-xs text-muted-foreground">{log.created_at}</span>
                                            </div>
                                            <div className="text-xs">
                                                Status: <Badge variant="outline" className="mx-1">{log.status_sebelum}</Badge> → <Badge variant="default" className="mx-1">{log.status_sesudah}</Badge>
                                            </div>
                                            {log.catatan && (
                                                <p className="text-muted-foreground bg-muted p-2 rounded text-xs mt-1">
                                                    "{log.catatan}"
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ValidasiShow.layout = {
    breadcrumbs,
};
