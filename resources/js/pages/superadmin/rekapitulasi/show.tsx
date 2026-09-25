import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    Download,
    Eye,
    FileText,
    HelpCircle,
    MessageSquare,
    ShieldCheck,
    Sparkles,
    Video,
} from 'lucide-react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types';

interface DokumenItem {
    id: number;
    nama_asal: string;
    jenis: string;
    mime?: string;
    path?: string;
    ukuran: number;
}

interface InovasiDetail {
    id: number;
    inovasi_id: number;
    nama_inovasi: string;
    tahapan: string;
    status: string;
    status_juri: string;
    nama_inisiator: string;
    inisiator?: string;
    bentuk_inovasi?: string;
    jenis_inovasi?: string;
    tematik?: string;
    urusan_utama?: string;
    waktu_uji_coba?: string;
    waktu_penerapan?: string;
    rancang_bangun?: string;
    tujuan?: string;
    manfaat?: string;
    hasil_inovasi?: string;
    link_video?: string;
    nilai_rata_rata: number | null;
    jumlah_juri_menilai: number;
    user?: { name: string; nama_pemda?: string } | null;
    opd?: { nama: string } | null;
    periode_lomba?: { tahun: number; nama: string } | null;
    dokumen_umum: DokumenItem[];
}

interface PenilaianItem {
    id: number;
    juri_id: number;
    nama_juri: string;
    nilai: number;
    catatan: string | null;
    updated_at: string;
}

interface Props {
    pengajuan: { id: number; status: string };
    inovasi: InovasiDetail;
    daftarPenilaianJuri: PenilaianItem[];
}

export default function SuperadminRekapitulasiShow({ pengajuan, inovasi, daftarPenilaianJuri }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Rekapitulasi Hasil Juri', href: '/superadmin/rekapitulasi-nilai' },
        { title: inovasi.nama_inovasi, href: `/superadmin/rekapitulasi-nilai/${pengajuan.id}` },
    ];

    const formatBytes = (bytes: number): string => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };

    return (
        <>
            <Head title={`Rekapitulasi Penilaian Juri — ${inovasi.nama_inovasi}`} />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full pb-16">
                <div>
                    <Link
                        href="/superadmin/rekapitulasi-nilai"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Rekapitulasi Juri
                    </Link>
                </div>

                {/* Hero Banner Sumbawa */}
                <HeroBanner
                    badgeIcon={MessageSquare}
                    badgeText="Monitoring Penilaian Juri"
                    title={inovasi.nama_inovasi}
                    description={`Pengusul: ${inovasi.user?.nama_pemda || inovasi.user?.name || '-'} • OPD: ${inovasi.opd?.nama || 'Masyarakat Umum'} • Periode Lomba: ${inovasi.periode_lomba?.nama || 'Tahun Berjalan'}`}
                    variant="teal"
                >
                    <div className="flex flex-wrap items-center gap-3 bg-white/10 dark:bg-black/20 backdrop-blur-xs px-4 py-2.5 rounded-lg border border-white/15">
                        <div className="flex flex-col">
                            <span className="text-[11px] text-white/80 uppercase font-semibold tracking-wider">
                                Nilai Rata-rata Tim Juri
                            </span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                                <span className="text-2xl font-black text-white">
                                    {inovasi.nilai_rata_rata !== null ? inovasi.nilai_rata_rata : '-'}
                                </span>
                                <span className="text-xs text-white/70">/ 100</span>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-white/20 hidden sm:block" />
                        <div className="flex flex-col text-xs text-white/90">
                            <span className="font-semibold">{inovasi.jumlah_juri_menilai} Juri</span>
                            <span className="text-white/70 text-[11px]">telah memberikan evaluasi</span>
                        </div>
                    </div>
                </HeroBanner>

                {/* Banner Status Peran */}
                <Card className="border-teal-500/20 bg-teal-50/30 dark:bg-teal-950/20">
                    <CardContent className="p-4 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                            <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
                            <div>
                                <span className="font-semibold text-foreground">Mode Monitoring BAPPERIDA (Sekretariat Penyelenggara)</span>
                                <p className="text-muted-foreground text-[11px]">
                                    Lembar penilaian diisi secara independen oleh Tim Penilai. BAPPERIDA memantau perolehan skor dan catatan kualitatif sebagai bahan pelaporan daerah.
                                </p>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-xs font-semibold border-teal-500 text-teal-700 dark:text-teal-300">
                            Tahapan: {inovasi.tahapan}
                        </Badge>
                    </CardContent>
                </Card>

                {/* Grid Profil Inovasi vs Berkas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="pb-3 border-b bg-muted/20">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    Informasi Profil Inovasi
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Identitas dan klasifikasi inovasi peserta lomba.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Nama Inisiator:</span>
                                    <span className="font-semibold text-foreground">{inovasi.nama_inisiator || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Klasifikasi Inisiator:</span>
                                    <span className="font-semibold text-foreground capitalize">{inovasi.inisiator?.replace(/_/g, ' ') || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Bentuk Inovasi:</span>
                                    <span className="font-semibold text-foreground capitalize">{inovasi.bentuk_inovasi?.replace(/_/g, ' ') || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Jenis Inovasi:</span>
                                    <span className="font-semibold text-foreground capitalize">{inovasi.jenis_inovasi || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Urusan Pemerintahan:</span>
                                    <span className="font-semibold text-foreground">{inovasi.urusan_utama || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Tema Inovasi:</span>
                                    <span className="font-semibold text-foreground">{inovasi.tematik || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Waktu Uji Coba:</span>
                                    <span className="font-semibold text-foreground">{inovasi.waktu_uji_coba || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Waktu Penerapan:</span>
                                    <span className="font-semibold text-foreground">{inovasi.waktu_penerapan || '-'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rancang Bangun & Substansi */}
                        <Card>
                            <CardHeader className="pb-3 border-b bg-muted/20">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    Rancang Bangun & Pokok Perubahan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4 text-xs">
                                <div>
                                    <span className="font-bold text-foreground block mb-1">Rancang Bangun:</span>
                                    <div className="bg-muted/30 p-3 rounded-md text-foreground/90 whitespace-pre-line leading-relaxed">
                                        {inovasi.rancang_bangun || <span className="text-muted-foreground italic">Belum diisi.</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <span className="font-bold text-foreground block mb-1">Tujuan Inovasi:</span>
                                        <div className="bg-muted/30 p-3 rounded-md text-foreground/90 whitespace-pre-line leading-relaxed">
                                            {inovasi.tujuan || <span className="text-muted-foreground italic">Belum diisi.</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-bold text-foreground block mb-1">Manfaat Inovasi:</span>
                                        <div className="bg-muted/30 p-3 rounded-md text-foreground/90 whitespace-pre-line leading-relaxed">
                                            {inovasi.manfaat || <span className="text-muted-foreground italic">Belum diisi.</span>}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan: Media & Berkas Dokumen */}
                    <div className="space-y-6">
                        {/* Video Dokumentasi */}
                        {inovasi.link_video ? (
                            <Card>
                                <CardHeader className="pb-2 bg-muted/20 border-b">
                                    <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                                        <Video className="h-4 w-4 text-red-500" />
                                        Video Dokumentasi Inovasi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-3">
                                    <a
                                        href={inovasi.link_video}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                                    >
                                        Buka Video di Tab Baru &rarr;
                                    </a>
                                </CardContent>
                            </Card>
                        ) : null}

                        {/* Berkas Dokumen Pendukung */}
                        <Card>
                            <CardHeader className="pb-2 bg-muted/20 border-b">
                                <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                                    <FileText className="h-4 w-4 text-teal-600" />
                                    Berkas Dokumen Pendukung ({inovasi.dokumen_umum.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-3">
                                {inovasi.dokumen_umum.length > 0 ? (
                                    <div className="space-y-2">
                                        {inovasi.dokumen_umum.map((doc) => (
                                            <div key={doc.id} className="p-2.5 rounded-md border flex items-center justify-between gap-2 text-xs">
                                                <div className="min-w-0 flex-1">
                                                    <span className="font-semibold text-foreground truncate block">{doc.nama_asal}</span>
                                                    <span className="text-[10px] text-muted-foreground">{doc.jenis.replace(/_/g, ' ')} • {formatBytes(doc.ukuran)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <a
                                                        href={`/inovasi/dokumen/${doc.id}/preview`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1 rounded text-muted-foreground hover:text-foreground"
                                                        title="Pratinjau"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </a>
                                                    <a
                                                        href={`/inovasi/dokumen/${doc.id}/download`}
                                                        className="p-1 rounded text-muted-foreground hover:text-foreground"
                                                        title="Unduh"
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground">Belum ada berkas diunggah.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Rekapitulasi Catatan & Nilai Seluruh Juri */}
                <Card>
                    <CardHeader className="pb-3 border-b bg-muted/20">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <CardTitle className="text-sm md:text-base font-bold flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-teal-600" />
                                    Rekapitulasi Evaluasi & Nilai Tim Juri ({daftarPenilaianJuri.length} Juri)
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Daftar masukan kualitatif dan skor dari para penilai independen.
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Rata-rata:</span>
                                <Badge className="text-xs font-bold bg-teal-600 text-white px-2.5 py-0.5">
                                    {inovasi.nilai_rata_rata !== null ? `${inovasi.nilai_rata_rata} / 100` : 'Belum Ada'}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {daftarPenilaianJuri.length > 0 ? (
                            <div className="space-y-3">
                                {daftarPenilaianJuri.map((item) => (
                                    <div key={item.id} className="p-3.5 rounded-lg border bg-card">
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-xs text-foreground">{item.nama_juri}</span>
                                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> {item.updated_at}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-background border px-2.5 py-1 rounded-md">
                                                <span className="text-[11px] text-muted-foreground font-medium">Skor Juri:</span>
                                                <span className="font-extrabold text-sm text-teal-700 dark:text-teal-400">
                                                    {item.nilai}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-foreground/90 bg-background/60 p-2.5 rounded-md border border-muted whitespace-pre-line leading-relaxed">
                                            {item.catatan || <span className="text-muted-foreground italic">Tidak ada catatan evaluasi tertulis.</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center border border-dashed rounded-lg text-muted-foreground text-xs">
                                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                <p className="font-semibold text-foreground">Belum Ada Penilaian Masuk</p>
                                <p className="mt-0.5">Tim juri belum memberikan skor untuk inovasi ini.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SuperadminRekapitulasiShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Rekapitulasi Hasil Juri', href: '/superadmin/rekapitulasi-nilai' },
    ],
};
