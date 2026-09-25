import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    Calculator,
    CheckCircle2,
    Clock,
    Download,
    ExternalLink,
    Eye,
    FileText,
    HelpCircle,
    MessageSquare,
    Save,
    Sparkles,
    UserCheck,
    Video,
} from 'lucide-react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
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
    is_saya: boolean;
}

interface Props {
    pengajuan: { id: number; status: string };
    inovasi: InovasiDetail;
    penilaianSaya: { id: number; nilai: number; catatan: string | null } | null;
    daftarPenilaianJuri: PenilaianItem[];
    canInputNilai?: boolean;
    isBapperida?: boolean;
}

const statusBadge: Record<string, { label: string; className: string }> = {
    sedang_melengkapi_data: {
        label: 'Sedang melengkapi data',
        className: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800',
    },
    sudah_submit: {
        label: 'Sudah di Submit (Siap Dinilai)',
        className: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-800',
    },
    sudah_dinilai: {
        label: 'Sudah Dinilai',
        className: 'bg-emerald-600 text-white border-emerald-700 dark:bg-emerald-700',
    },
};

export default function SkoringShow({
    pengajuan,
    inovasi,
    penilaianSaya,
    daftarPenilaianJuri,
    canInputNilai = true,
    isBapperida = false,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Penilaian Lomba Inovasi', href: '/penilai/skoring' },
        { title: inovasi.nama_inovasi, href: `/penilai/skoring/${pengajuan.id}` },
    ];

    const form = useForm({
        nilai: penilaianSaya?.nilai !== undefined ? String(penilaianSaya.nilai) : '',
        catatan: penilaianSaya?.catatan ?? '',
    });

    const isDraft = inovasi.status_juri === 'sedang_melengkapi_data';

    const handleSubmitNilai = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(`/penilai/skoring/${pengajuan.id}/nilai-juri`, {
            preserveScroll: true,
        });
    };

    const formatBytes = (bytes: number): string => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };

    const st = statusBadge[inovasi.status_juri] || {
        label: inovasi.status_juri?.replace(/_/g, ' ') || 'Sedang melengkapi data',
        className: 'bg-muted text-muted-foreground',
    };

    return (
        <>
            <Head title={`Evaluasi Penilaian — ${inovasi.nama_inovasi}`} />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Navigasi Kembali */}
                <div>
                    <Link
                        href="/penilai/skoring"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Penilaian Lomba
                    </Link>
                </div>

                {/* Hero Banner */}
                <HeroBanner
                    badgeIcon={isBapperida ? MessageSquare : Calculator}
                    badgeText={isBapperida ? 'Rekapitulasi Penilaian Juri' : 'Lembar Penilaian Juri Lomba'}
                    title={inovasi.nama_inovasi}
                    description={`Pengusul: ${inovasi.user?.nama_pemda || inovasi.user?.name || '-'} • OPD: ${inovasi.opd?.nama || 'Masyarakat Umum'} • Periode: ${inovasi.periode_lomba?.tahun || 'Tahun Berjalan'}`}
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
                            <span className="font-semibold">{inovasi.jumlah_juri_menilai} dari ~5 Juri</span>
                            <span className="text-white/70 text-[11px]">telah menginput nilai</span>
                        </div>
                    </div>
                </HeroBanner>

                {/* Baris Status & Aksi Utama */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-card border rounded-lg p-3.5 shadow-xs">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">Status Inovasi:</span>
                        <Badge className={`text-xs font-medium px-2.5 py-0.5 ${st.className}`}>
                            {st.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize font-medium">
                            Tahapan: {inovasi.tahapan}
                        </Badge>
                    </div>

                    {!isBapperida && penilaianSaya && (
                        <div className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-muted-foreground">Nilai Anda:</span>
                            <strong className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                                {penilaianSaya.nilai}
                            </strong>
                        </div>
                    )}

                    {isBapperida && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MessageSquare className="h-4 w-4 text-teal-600" />
                            <span>Peran BAPPERIDA: <strong className="text-foreground">Monitoring & Penyelenggara</strong></span>
                        </div>
                    )}
                </div>

                {/* Grid 2 Kolom: Profil Inovasi (Kiri) & Berkas / Media (Kanan) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom Kiri: Profil & Deskripsi (2 spans) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Ringkasan Metadata Inovasi */}
                        <Card>
                            <CardHeader className="pb-3 border-b bg-muted/20">
                                <CardTitle className="text-sm md:text-base font-bold flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    Informasi Profil Inovasi
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Identitas dasar dan klasifikasi inovasi peserta lomba.
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
                                    <span className="font-semibold text-foreground">{inovasi.bentuk_inovasi || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Jenis Inovasi:</span>
                                    <span className="font-semibold text-foreground">{inovasi.jenis_inovasi || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Tematik Inovasi:</span>
                                    <span className="font-semibold text-foreground">{inovasi.tematik || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Urusan Utama:</span>
                                    <span className="font-semibold text-foreground">{inovasi.urusan_utama || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Waktu Uji Coba:</span>
                                    <span className="font-medium text-foreground">{inovasi.waktu_uji_coba || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-[11px]">Waktu Penerapan:</span>
                                    <span className="font-medium text-foreground">{inovasi.waktu_penerapan || '-'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rancang Bangun & Pokok Perubahan */}
                        <Card>
                            <CardHeader className="pb-3 border-b bg-muted/20">
                                <CardTitle className="text-sm md:text-base font-bold flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    Rancang Bangun & Pokok Perubahan
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Latar belakang, dasar pemikiran, dan mekanisme terobosan inovasi.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {inovasi.rancang_bangun ? (
                                    <div className="text-xs text-foreground/90 whitespace-pre-line leading-relaxed bg-muted/20 p-4 rounded-md border font-sans">
                                        {inovasi.rancang_bangun}
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">Belum ada uraian rancang bangun.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tujuan, Manfaat, dan Hasil Inovasi */}
                        <Card>
                            <CardHeader className="pb-3 border-b bg-muted/20">
                                <CardTitle className="text-sm md:text-base font-bold flex items-center gap-2">
                                    <Award className="h-4 w-4 text-primary" />
                                    Tujuan, Manfaat, & Hasil Inovasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4 text-xs">
                                <div>
                                    <h4 className="font-bold text-foreground mb-1">1. Tujuan Inovasi</h4>
                                    <div className="bg-muted/20 p-3 rounded-md border text-foreground/90 whitespace-pre-line">
                                        {inovasi.tujuan || <span className="text-muted-foreground italic">Tidak diisi</span>}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-foreground mb-1">2. Manfaat yang Diperoleh</h4>
                                    <div className="bg-muted/20 p-3 rounded-md border text-foreground/90 whitespace-pre-line">
                                        {inovasi.manfaat || <span className="text-muted-foreground italic">Tidak diisi</span>}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-foreground mb-1">3. Hasil / Dampak Nyata</h4>
                                    <div className="bg-muted/20 p-3 rounded-md border text-foreground/90 whitespace-pre-line">
                                        {inovasi.hasil_inovasi || <span className="text-muted-foreground italic">Tidak diisi</span>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kolom Kanan: Berkas Lomba, Unduhan Dokumen, & Video (1 span) */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-3 border-b bg-muted/20">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Download className="h-4 w-4 text-primary" />
                                    Dokumen & Berkas Peserta Lomba
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Unduh dokumen proposal, file presentasi PPT, piagam penghargaan, dan tautan video.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-3">
                                {/* Tautan Video Dokumentasi */}
                                {inovasi.link_video ? (
                                    <div className="p-3 rounded-md border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/20 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-teal-900 dark:text-teal-300">
                                            <Video className="h-4 w-4 text-teal-600" />
                                            Video Dokumentasi Inovasi
                                        </div>
                                        <a
                                            href={inovasi.link_video}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-between px-3 py-2 rounded-md bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors"
                                        >
                                            <span>Tonton Video</span>
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    </div>
                                ) : (
                                    <div className="p-3 rounded-md border border-dashed text-xs text-muted-foreground flex items-center gap-2">
                                        <Video className="h-4 w-4 opacity-50" />
                                        <span>Link video belum dicantumkan.</span>
                                    </div>
                                )}

                                {/* Daftar Dokumen Umum */}
                                {inovasi.dokumen_umum && inovasi.dokumen_umum.length > 0 ? (
                                    <div className="space-y-2">
                                        {inovasi.dokumen_umum.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors flex items-center justify-between gap-2"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                                                        <span className="font-semibold text-xs text-foreground truncate block">
                                                            {doc.nama_asal}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-2">
                                                        <span className="capitalize">{doc.jenis.replace(/_/g, ' ')}</span>
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
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors shrink-0"
                                                        title="Unduh Berkas"
                                                    >
                                                        <Download className="h-3 w-3" /> Unduh
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-3 rounded-md border border-dashed text-xs text-muted-foreground flex items-center gap-2">
                                        <FileText className="h-4 w-4 opacity-50" />
                                        <span>Belum ada berkas dokumen (Proposal/PPT/Piagam) diunggah.</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Petunjuk / Informasi Penjurian */}
                        <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                                    <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    Petunjuk Penilaian Lomba
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-blue-900/90 dark:text-blue-200/90 space-y-1.5 leading-relaxed">
                                <p>
                                    1. Nilai diinput dalam rentang angka <strong>0 s.d. 100</strong>.
                                </p>
                                <p>
                                    2. Setiap juri memiliki nilai dan catatan tersendiri secara independen.
                                </p>
                                <p>
                                    3. Nilai akhir inovasi dihitung otomatis dari <strong>rata-rata seluruh juri</strong>.
                                </p>
                                <p>
                                    4. Anda dapat memperbarui nilai dan catatan Anda kapan saja selama masa penjurian aktif.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Seksi Form Penilaian Juri (Khusus Juri / Tim Penilai) atau Info Monitoring Bapperida */}
                {canInputNilai ? (
                    <Card className="border-teal-500/30 shadow-sm">
                        <CardHeader className="pb-3 border-b bg-teal-50/40 dark:bg-teal-950/20">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                                        <UserCheck className="h-5 w-5 text-teal-600" />
                                        Form Penilaian Anda (Sebagai Juri)
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Berikan skor kematangan lomba dan catatan evaluasi kualitatif untuk inovasi ini.
                                    </CardDescription>
                                </div>
                                {penilaianSaya && (
                                    <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 self-start sm:self-auto">
                                        Tersimpan: Nilai {penilaianSaya.nilai}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {isDraft ? (
                                <div className="p-4 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200">
                                    <strong>Pemberitahuan:</strong> Inovasi ini berstatus <em>Sedang melengkapi data</em> oleh Inovator.
                                    Form penilaian akan aktif setelah Inovator resmi mengirimkan (submit) inovasinya ke lomba.
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitNilai} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="sm:col-span-1">
                                            <Label htmlFor="nilai" className="text-xs font-semibold">
                                                Nilai dari Tim Penilai (0 - 100) <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="nilai"
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="100"
                                                value={form.data.nilai}
                                                onChange={(e) => form.setData('nilai', e.target.value)}
                                                placeholder="Contoh: 85.5"
                                                className="text-sm font-semibold mt-1"
                                                required
                                            />
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                Skala penilaian standar lomba: 0.0 s.d. 100.0.
                                            </p>
                                            {form.errors.nilai && (
                                                <p className="text-xs text-destructive mt-1">{form.errors.nilai}</p>
                                            )}
                                        </div>

                                        <div className="sm:col-span-2">
                                            <Label htmlFor="catatan" className="text-xs font-semibold">
                                                Catatan Tim Penilai (Masukan / Saran Evaluasi)
                                            </Label>
                                            <Textarea
                                                id="catatan"
                                                rows={3}
                                                value={form.data.catatan}
                                                onChange={(e) => form.setData('catatan', e.target.value)}
                                                placeholder="Tuliskan catatan, evaluasi rancang bangun, dan saran perbaikan untuk inovator..."
                                                className="text-xs mt-1"
                                            />
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                Catatan ini dapat dibaca oleh inovator dan sesama anggota tim penilai.
                                            </p>
                                            {form.errors.catatan && (
                                                <p className="text-xs text-destructive mt-1">{form.errors.catatan}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-2 border-t">
                                        <Button
                                            type="submit"
                                            disabled={form.processing}
                                            className="gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
                                        >
                                            {form.processing ? (
                                                <>
                                                    <Spinner className="h-3.5 w-3.5" /> Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-3.5 w-3.5" /> Simpan Penilaian & Catatan
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-teal-500/20 bg-teal-50/20 dark:bg-teal-950/10">
                        <CardContent className="p-4 sm:p-5 flex items-start gap-3 text-xs">
                            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                                <MessageSquare className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                                <div className="font-semibold text-foreground">
                                    Mode Monitoring Penyelenggara Lomba (BAPPERIDA)
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    Sebagai penyelenggara lomba dan pembina inovasi daerah, BAPPERIDA bertindak independen sebagai pemantau dan tidak melakukan penginputan nilai juri. Rekapitulasi perolehan nilai dan evaluasi kualitatif juri di bawah ini diperbarui secara realtime saat para juri menilai.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Seksi Rekap Penilaian Seluruh Juri */}
                <Card>
                    <CardHeader className="pb-3 border-b bg-muted/20">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <CardTitle className="text-sm md:text-base font-bold flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                    Rekapitulasi Penilaian Tim Juri ({daftarPenilaianJuri.length} Juri)
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Daftar catatan dan skor dari seluruh juri penilai yang telah memberikan evaluasi.
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Rata-rata:</span>
                                <Badge className="text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5">
                                    {inovasi.nilai_rata_rata !== null ? `${inovasi.nilai_rata_rata} / 100` : 'Belum Ada'}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {daftarPenilaianJuri.length > 0 ? (
                            <div className="space-y-3">
                                {daftarPenilaianJuri.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`p-3.5 rounded-lg border transition-all ${item.is_saya
                                                ? 'bg-teal-50/40 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800'
                                                : 'bg-card border-border'
                                            }`}
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-xs text-foreground">
                                                    {item.nama_juri}
                                                </span>
                                                {item.is_saya && (
                                                    <Badge variant="outline" className="text-[10px] text-teal-700 dark:text-teal-300 border-teal-300">
                                                        Anda
                                                    </Badge>
                                                )}
                                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> {item.updated_at}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-background border px-2.5 py-1 rounded-md">
                                                <span className="text-[11px] text-muted-foreground font-medium">Skor:</span>
                                                <span className="font-extrabold text-sm text-primary">
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
                                <p className="mt-0.5">Jadilah juri pertama yang memberikan skor dan catatan untuk inovasi ini.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
