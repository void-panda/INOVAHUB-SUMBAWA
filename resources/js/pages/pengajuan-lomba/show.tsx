import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    Calculator,
    CheckCircle2,
    Eye,

    Lock,
    Send,
} from 'lucide-react';
import { useState } from 'react';
import { HeroBanner } from '@/components/hero-banner';
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
import { Textarea } from '@/components/ui/textarea';
import type { PengajuanLomba } from '@/types/models';
import { BerkasLombaCard, type DokumenUmumItem } from './components/berkas-lomba-card';
import { HasilPenilaianJuriCard, CatatanKualitatifJuriCard, type PenilaianItem } from './components/hasil-penilaian-juri-card';

type Props = {
    pengajuan: PengajuanLomba;
    canManageInovasiDaerah?: boolean;
    canRekomendasikan?: boolean;
    canNilaiJuri?: boolean;
    nilaiRataRataJuri?: number | null;
    jumlahJuriMenilai?: number;
    daftarPenilaianJuri?: PenilaianItem[];
    dokumenUmum?: DokumenUmumItem[];
    isInovator?: boolean;
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


export default function PengajuanLombaShow({
    pengajuan,
    canManageInovasiDaerah = false,
    canRekomendasikan = false,
    canNilaiJuri = false,
    nilaiRataRataJuri = null,
    jumlahJuriMenilai = 0,
    daftarPenilaianJuri = [],
    dokumenUmum = [],
    isInovator = false,
}: Props) {
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<string>('');
    const [actionCatatan, setActionCatatan] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const inovasi = pengajuan.inovasi;
    const currentStepIndex = statusOrder[pengajuan.status] ?? 1;

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const domainPrefix = currentPath.startsWith('/pendamping')
        ? '/pendamping'
        : currentPath.startsWith('/penilai')
            ? '/penilai'
            : currentPath.startsWith('/inovator')
                ? '/inovator'
                : currentPath.startsWith('/pimpinan')
                    ? '/pimpinan'
                    : '/superadmin';

    const openActionDialog = (type: string) => {
        setActionType(type);
        setActionCatatan('');
        setActionDialogOpen(true);
    };

    const handleExecuteAction = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const endpoints: Record<string, string> = {
            rekomendasikan: `${domainPrefix}/pengajuan-lomba/${pengajuan.id}/rekomendasikan`,
            sahkan_opd: `${domainPrefix}/pengajuan-lomba/${pengajuan.id}/sahkan-opd`,
            kirim: `${domainPrefix}/pengajuan-lomba/${pengajuan.id}/kirim`,
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
        router.post(`${domainPrefix}/pengajuan-lomba/${pengajuan.id}/tetapkan`, {
            status: !pengajuan.is_inovasi_daerah,
        });
    };

    const backHref = isInovator
        ? '/inovator/inovasi'
        : domainPrefix === '/pendamping'
            ? '/pendamping/validasi'
            : domainPrefix === '/penilai'
                ? '/penilai/skoring'
                : domainPrefix === '/pimpinan'
                    ? '/pimpinan/inovasi-daerah'
                    : '/superadmin/pengajuan-lomba';

    const backLabel = isInovator
        ? 'Kembali ke Inovasi Saya'
        : domainPrefix === '/pendamping'
            ? 'Kembali ke Lembar Validasi'
            : domainPrefix === '/penilai'
                ? 'Kembali ke Lembar Skoring'
                : domainPrefix === '/pimpinan'
                    ? 'Kembali ke Inovasi Daerah'
                    : 'Kembali ke Daftar Pengajuan';

    return (
        <>
            <Head title={`Pengajuan: ${inovasi?.nama_inovasi} - INOVA-HUB`} />

            <div className="flex flex-col space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
                {/* Header Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 text-xs w-fit">
                        <Link href={backHref}>
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>{backLabel}</span>
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
                    description={`Periode Lomba: ${pengajuan.periode_lomba?.nama ?? '2026'}. Inisiator: ${inovasi?.nama_inisiator} (${inovasi?.opd?.nama ?? 'Umum'}).`}
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
                                        className={`flex sm:flex-col items-center sm:items-start gap-3 p-3 rounded-lg border transition-all ${isCurrent
                                            ? 'bg-teal-50/80 border-teal-500/50 dark:bg-teal-950/30 text-teal-800 dark:text-teal-200 shadow-xs'
                                            : isPassed
                                                ? 'bg-muted/40 border-border text-foreground'
                                                : 'bg-muted/10 border-border/40 text-muted-foreground'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isCurrent
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

                            {/* Lihat Rekap Nilai Juri (BAPPERIDA saat Disahkan OPD / Review Internal) */}
                            {!canNilaiJuri && canManageInovasiDaerah && (pengajuan.status === 'disahkan_opd' || pengajuan.status === 'review_internal') && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="h-8 text-xs border-teal-600 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 gap-1.5 cursor-pointer"
                                >
                                    <Link href={`/penilai/skoring/${pengajuan.id}`}>
                                        <Eye className="h-3.5 w-3.5" />
                                        <span>Lihat Rekap Penilaian Juri</span>
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
                    <div className="lg:col-span-2">
                        <BerkasLombaCard
                            pengajuan={pengajuan}
                            dokumenUmum={dokumenUmum}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <HasilPenilaianJuriCard
                            pengajuan={pengajuan}
                            nilaiRataRataJuri={nilaiRataRataJuri}
                            jumlahJuriMenilai={jumlahJuriMenilai}
                            daftarPenilaianJuri={daftarPenilaianJuri}
                            canNilaiJuri={canNilaiJuri}
                        />
                    </div>
                </div>

                {/* Catatan & Penilaian Tim Juri Lomba (Full-Width) */}
                <CatatanKualitatifJuriCard
                    daftarPenilaianJuri={daftarPenilaianJuri}
                    nilaiRataRataJuri={nilaiRataRataJuri}
                />
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

