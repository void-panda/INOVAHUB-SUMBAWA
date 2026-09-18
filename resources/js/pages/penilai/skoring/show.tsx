import { useMemo, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    CheckCircle2,
    ExternalLink,
    Eye,
    FileCheck,
    FileText,
    FolderGit2,
    Info,
    Play,
    Printer,
    Save,
    Search,
    ShieldAlert,
    Video,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { BreadcrumbItem } from '@/types';

interface IndikatorSid {
    id: number;
    kode: string;
    nama: string;
    variabel: string | null;
    bobot: string | number;
    keterangan?: string | null;
    informasi?: string | null;
    p1: string | null;
    p2: string | null;
    p3: string | null;
    opsi_list?: { id: string; label: string; bobot: number }[] | null;
}

interface DokumenItem {
    id: number;
    indikator_sid_id?: number | null;
    nama_asal: string;
    nomor_surat?: string | null;
    tanggal_surat?: string | null;
    tentang?: string | null;
    jenis: string;
    mime?: string;
    path?: string;
    ukuran: number;
}

interface ExistingSkor {
    indikator_id: number;
    tier: number;
    skor: number;
    catatan: string | null;
    komentar_pendamping?: string | null;
}

interface InovasiDetail {
    id: number;
    inovasi_id: number;
    nama_inovasi: string;
    tahapan: string;
    status: string;
    nama_inisiator: string;
    inisiator?: string;
    bentuk_inovasi?: string;
    jenis_inovasi?: string;
    tematik?: string;
    urusan_utama?: string;
    rancang_bangun?: string;
    tujuan?: string;
    manfaat?: string;
    hasil_inovasi?: string;
    periode_lomba_id: number;
    estimasi_skor_kematangan: number | null;
    user?: { name: string; nama_pemda?: string } | null;
    opd?: { nama: string } | null;
    periode_lomba?: { tahun: number; nama: string } | null;
    dokumen_umum: DokumenItem[];
}

interface Props {
    pengajuan: { id: number; status: string };
    inovasi: InovasiDetail;
    sidList: IndikatorSid[];
    kelengkapan: Record<number, { parameter: string | null; catatan: string | null }>;
    dokumenIndikator: Record<number, DokumenItem[]>;
    existingSkorSid: ExistingSkor[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Antrean Penilaian', href: '/penilai/skoring' },
    { title: 'Lembar Evaluasi Inovasi', href: '#' },
];

export default function SkoringShow({
    inovasi,
    sidList = [],
    kelengkapan = {},
    dokumenIndikator = {},
    existingSkorSid = [],
}: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'unscored' | 'scored'>('all');

    // Inisialisasi skor awal
    const initialSidState = useMemo(() => {
        const state: Record<number, { tier: number; catatan: string }> = {};

        sidList.forEach((ind) => {
            const existing = existingSkorSid.find((s) => s.indikator_id === ind.id);
            if (existing) {
                state[ind.id] = {
                    tier: existing.tier,
                    catatan: existing.catatan || '',
                };
            } else {
                // Default tier mengambil klaim inovator jika ada, atau 0
                const inovatorClaim = kelengkapan[ind.id]?.parameter;
                let defaultTier = 0;
                if (inovatorClaim) {
                    const cleanClaim = String(inovatorClaim).toLowerCase();
                    if (cleanClaim === 'p3') defaultTier = 3;
                    else if (cleanClaim === 'p2') defaultTier = 2;
                    else if (cleanClaim === 'p1') defaultTier = 1;
                }
                state[ind.id] = {
                    tier: defaultTier,
                    catatan: '',
                };
            }
        });

        return state;
    }, [sidList, existingSkorSid, kelengkapan]);

    const [scoresSid, setScoresSid] = useState<Record<number, { tier: number; catatan: string }>>(initialSidState);

    const form = useForm({
        items_sid: [] as { indikator_id: number; tier: number; catatan?: string }[],
        is_final: false,
    });

    const handleTierChange = (indikatorId: number, tier: number) => {
        setScoresSid((prev) => ({
            ...prev,
            [indikatorId]: {
                tier,
                catatan: prev[indikatorId]?.catatan || '',
            },
        }));
    };

    const handleCatatanChange = (indikatorId: number, catatan: string) => {
        setScoresSid((prev) => ({
            ...prev,
            [indikatorId]: {
                tier: prev[indikatorId]?.tier ?? 0,
                catatan,
            },
        }));
    };

    // Live Calculation
    const totalSkorKematangan = useMemo(() => {
        return sidList.reduce((sum, ind) => {
            const selected = scoresSid[ind.id];
            const tier = selected ? selected.tier : 0;
            const bobot = Number(ind.bobot) || 1.0;
            return sum + tier * bobot;
        }, 0);
    }, [sidList, scoresSid]);

    const scoredCount = useMemo(() => {
        return sidList.filter((ind) => (scoresSid[ind.id]?.tier ?? 0) > 0).length;
    }, [sidList, scoresSid]);

    const filteredIndicators = useMemo(() => {
        return sidList.filter((ind) => {
            const matchSearch =
                ind.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ind.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (ind.variabel && ind.variabel.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchSearch) return false;

            const isScored = (scoresSid[ind.id]?.tier ?? 0) > 0;
            if (filterStatus === 'scored') return isScored;
            if (filterStatus === 'unscored') return !isScored;

            return true;
        });
    }, [sidList, searchQuery, filterStatus, scoresSid]);

    const handleSubmitScore = (isFinalSubmit: boolean) => {
        const itemsSid = sidList.map((ind) => {
            const selected = scoresSid[ind.id];
            return {
                indikator_id: ind.id,
                tier: selected ? selected.tier : 0,
                catatan: selected ? selected.catatan : null,
            };
        });

        form.transform(() => ({
            items_sid: itemsSid,
            is_final: isFinalSubmit,
        }));

        form.post(`/penilai/skoring/${inovasi.id}`);
    };

    // Dokumen umum
    const proposalDoc = inovasi.dokumen_umum.find(
        (d) => d.jenis === 'proposal' || d.jenis === 'rancang_bangun' || d.nama_asal.toLowerCase().includes('proposal')
    );
    const sertifikatDoc = inovasi.dokumen_umum.find(
        (d) => d.jenis === 'sertifikat' || d.jenis === 'piagam' || d.nama_asal.toLowerCase().includes('piagam')
    );
    const videoDoc = inovasi.dokumen_umum.find(
        (d) => d.jenis === 'video' || d.mime === 'url' || d.path?.includes('youtu')
    );

    return (
        <>
            <Head title={`Evaluasi Inovasi: ${inovasi.nama_inovasi}`} />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full pb-28">
                {/* Top Nav Action */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link href="/penilai/skoring">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Kembali ke Antrean
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs px-3 py-1 font-semibold uppercase tracking-wider bg-muted/60">
                            Status: {inovasi.status.replace('_', ' ')}
                        </Badge>
                        <Button asChild variant="outline" size="sm" className="gap-1.5 cursor-pointer">
                            <a href={`/inovasi/${inovasi.id}/print`} target="_blank" rel="noopener noreferrer">
                                <Printer className="h-3.5 w-3.5 text-muted-foreground" /> Cetak / PDF Lembar Inovasi
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Hero Header & Live Score Card */}
                <Card className="border-teal-500/20 bg-gradient-to-r from-teal-500/5 via-primary/5 to-emerald-500/5 shadow-xs overflow-hidden">
                    <CardHeader className="p-5 md:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs">
                                        Lomba Inovasi Daerah
                                    </Badge>
                                    {inovasi.periode_lomba && (
                                        <Badge variant="outline" className="text-xs">
                                            Tahun {inovasi.periode_lomba.tahun}
                                        </Badge>
                                    )}
                                    <Badge variant="secondary" className="capitalize text-xs">
                                        Tahap: {inovasi.tahapan}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2.5">
                                    <Award className="h-6 w-6 text-teal-600 shrink-0" />
                                    {inovasi.nama_inovasi}
                                </CardTitle>
                                <CardDescription className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                    Pengusul: <strong className="text-foreground">{inovasi.user?.nama_pemda || inovasi.user?.name || inovasi.nama_inisiator}</strong>
                                    {inovasi.opd?.nama && ` (${inovasi.opd.nama})`} • Urusan: <span className="font-medium text-foreground">{inovasi.urusan_utama || '-'}</span>
                                </CardDescription>
                            </div>

                            {/* Live Score Highlight */}
                            <div className="flex items-center gap-4 bg-background/90 backdrop-blur-xs p-4 rounded-xl border border-teal-500/30 shadow-xs shrink-0 self-start lg:self-center">
                                <div className="text-center px-2">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">
                                        Indikator Terisi
                                    </span>
                                    <span className="text-xl font-bold text-foreground">
                                        {scoredCount} <span className="text-xs font-normal text-muted-foreground">/ {sidList.length}</span>
                                    </span>
                                </div>
                                <div className="h-10 w-px bg-border" />
                                <div className="text-center px-3">
                                    <span className="text-[10px] uppercase font-bold text-teal-600 block tracking-wider">
                                        Skor Kematangan
                                    </span>
                                    <span className="text-3xl font-black text-teal-700 dark:text-teal-400">
                                        {totalSkorKematangan.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Ringkasan Dokumen Umum & Profil Singkat */}
                <Card className="border shadow-xs">
                    <CardHeader className="py-4 px-5 bg-muted/20 border-b">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                            <FolderGit2 className="h-4 w-4 text-teal-600" />
                            Dokumen Utama & Bukti Pendukung Umum
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Proposal / Rancang Bangun */}
                            <div className="p-3.5 rounded-xl border bg-muted/30 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <FileText className="h-5 w-5 text-teal-600 shrink-0" />
                                    <div className="min-w-0">
                                        <span className="text-xs font-bold block text-foreground truncate">
                                            Proposal / Rancang Bangun
                                        </span>
                                        <span className="text-[11px] text-muted-foreground block truncate">
                                            {proposalDoc ? proposalDoc.nama_asal : 'Belum diunggah'}
                                        </span>
                                    </div>
                                </div>
                                {proposalDoc && (
                                    <Button asChild size="sm" variant="outline" className="h-8 px-2.5 text-xs shrink-0">
                                        <a href={`/inovasi/dokumen/${proposalDoc.id}/preview`} target="_blank" rel="noopener noreferrer">
                                            <Eye className="h-3.5 w-3.5 mr-1" /> Lihat
                                        </a>
                                    </Button>
                                )}
                            </div>

                            {/* Piagam / Sertifikat */}
                            <div className="p-3.5 rounded-xl border bg-muted/30 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <Award className="h-5 w-5 text-amber-500 shrink-0" />
                                    <div className="min-w-0">
                                        <span className="text-xs font-bold block text-foreground truncate">
                                            Piagam / Penghargaan
                                        </span>
                                        <span className="text-[11px] text-muted-foreground block truncate">
                                            {sertifikatDoc ? sertifikatDoc.nama_asal : 'Tidak disertakan'}
                                        </span>
                                    </div>
                                </div>
                                {sertifikatDoc && (
                                    <Button asChild size="sm" variant="outline" className="h-8 px-2.5 text-xs shrink-0">
                                        <a href={`/inovasi/dokumen/${sertifikatDoc.id}/preview`} target="_blank" rel="noopener noreferrer">
                                            <Eye className="h-3.5 w-3.5 mr-1" /> Lihat
                                        </a>
                                    </Button>
                                )}
                            </div>

                            {/* Video Dokumentasi */}
                            <div className="p-3.5 rounded-xl border bg-muted/30 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <Video className="h-5 w-5 text-rose-500 shrink-0" />
                                    <div className="min-w-0">
                                        <span className="text-xs font-bold block text-foreground truncate">
                                            Video Dokumentasi
                                        </span>
                                        <span className="text-[11px] text-muted-foreground block truncate">
                                            {videoDoc ? (videoDoc.path || videoDoc.nama_asal) : 'Belum disertakan'}
                                        </span>
                                    </div>
                                </div>
                                {videoDoc && (
                                    <Button asChild size="sm" variant="outline" className="h-8 px-2.5 text-xs shrink-0">
                                        <a href={videoDoc.path?.startsWith('http') ? videoDoc.path : `/inovasi/dokumen/${videoDoc.id}/preview`} target="_blank" rel="noopener noreferrer">
                                            <Play className="h-3.5 w-3.5 mr-1" /> Buka
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Rancang bangun teaser */}
                        {inovasi.rancang_bangun && (
                            <div className="p-3.5 rounded-lg border border-border/70 bg-background text-xs">
                                <span className="font-bold text-foreground block mb-1 text-xs">Ringkasan Rancang Bangun & Pokok Perubahan:</span>
                                <p className="text-muted-foreground leading-relaxed line-clamp-3">
                                    {inovasi.rancang_bangun}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Filter & Search Bar Indikator */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border shadow-xs">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari kode (SID-01), nama indikator, atau variabel..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 text-xs h-9"
                        />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            size="sm"
                            variant={filterStatus === 'all' ? 'default' : 'outline'}
                            onClick={() => setFilterStatus('all')}
                            className="text-xs h-9 px-3"
                        >
                            Semua ({sidList.length})
                        </Button>
                        <Button
                            size="sm"
                            variant={filterStatus === 'unscored' ? 'default' : 'outline'}
                            onClick={() => setFilterStatus('unscored')}
                            className="text-xs h-9 px-3"
                        >
                            Belum Dinilai ({sidList.length - scoredCount})
                        </Button>
                        <Button
                            size="sm"
                            variant={filterStatus === 'scored' ? 'default' : 'outline'}
                            onClick={() => setFilterStatus('scored')}
                            className="text-xs h-9 px-3"
                        >
                            Sudah Dinilai ({scoredCount})
                        </Button>
                    </div>
                </div>

                {/* 20 Indikator SID List */}
                <div className="space-y-5">
                    {filteredIndicators.map((ind) => {
                        const selectedTier = scoresSid[ind.id]?.tier ?? 0;
                        const bobot = Number(ind.bobot) || 1.0;
                        const skorCalculated = (selectedTier * bobot).toFixed(2);
                        const inovatorClaim = kelengkapan[ind.id];
                        const docs = dokumenIndikator[ind.id] || [];

                        // Menemukan teks klaim inovator
                        let claimLabel = inovatorClaim?.parameter ? `Parameter ${inovatorClaim.parameter.toUpperCase()}` : 'Belum diisi inovator';
                        if (inovatorClaim?.parameter) {
                            const paramKey = inovatorClaim.parameter.toLowerCase();
                            if (paramKey === 'p1' && ind.p1) claimLabel = `P1: ${ind.p1}`;
                            else if (paramKey === 'p2' && ind.p2) claimLabel = `P2: ${ind.p2}`;
                            else if (paramKey === 'p3' && ind.p3) claimLabel = `P3: ${ind.p3}`;
                        }

                        return (
                            <Card key={ind.id} className="border shadow-xs hover:border-teal-500/40 transition-colors">
                                {/* Card Header */}
                                <CardHeader className="py-3 px-4 bg-muted/30 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                        <Badge variant="outline" className="font-mono text-xs font-bold bg-background">
                                            {ind.kode}
                                        </Badge>
                                        <h3 className="font-bold text-sm text-foreground">
                                            {ind.nama}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-xs text-muted-foreground">
                                            Bobot: <strong className="text-foreground">{bobot}</strong>
                                        </span>
                                        <Badge className={`${selectedTier > 0 ? 'bg-teal-600 text-white' : 'bg-muted text-muted-foreground'} font-bold text-xs`}>
                                            Skor Juri: {skorCalculated}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-4 md:p-5 space-y-4">
                                    {/* Informasi & Variabel */}
                                    {ind.variabel && (
                                        <div className="text-xs text-muted-foreground flex items-start gap-1.5 bg-muted/40 p-2.5 rounded-md">
                                            <Info className="h-4 w-4 shrink-0 text-teal-600 mt-0.5" />
                                            <div>
                                                <span className="font-semibold text-foreground">Variabel:</span> {ind.variabel}
                                                {ind.keterangan && <p className="mt-0.5">{ind.keterangan}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {/* PANEL 1: Klaim Inovator */}
                                    <div className="p-3.5 rounded-xl border border-teal-500/20 bg-teal-500/5 space-y-1.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                                                <FileCheck className="h-4 w-4 text-teal-600" />
                                                Klaim Parameter Inovator:
                                            </span>
                                            {inovatorClaim?.parameter && (
                                                <Badge variant="outline" className="text-[10px] font-bold border-teal-500/40 text-teal-700 dark:text-teal-300">
                                                    Klaim: {inovatorClaim.parameter.toUpperCase()}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-foreground font-medium pl-5">
                                            {claimLabel}
                                        </p>
                                        {inovatorClaim?.catatan && (
                                            <p className="text-[11px] text-muted-foreground pl-5 italic">
                                                Catatan Inovator: &ldquo;{inovatorClaim.catatan}&rdquo;
                                            </p>
                                        )}
                                    </div>

                                    {/* PANEL 2: Berkas Bukti Dukung yang Diunggah */}
                                    <div className="space-y-2">
                                        <span className="text-xs font-bold text-foreground block">
                                            Berkas Bukti Dukung Terlampir ({docs.length}):
                                        </span>

                                        {docs.length === 0 ? (
                                            <div className="flex items-center gap-2 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300 text-xs">
                                                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
                                                <span>Tidak ada berkas bukti dukung yang diunggah inovator untuk indikator ini.</span>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                                {docs.map((doc) => (
                                                    <div
                                                        key={doc.id}
                                                        className="p-3 rounded-lg border bg-background hover:bg-muted/30 transition-colors flex items-center justify-between gap-3 text-xs"
                                                    >
                                                        <div className="min-w-0 space-y-0.5">
                                                            <span className="font-semibold text-foreground block truncate" title={doc.nama_asal}>
                                                                {doc.nama_asal}
                                                            </span>
                                                            {(doc.nomor_surat || doc.tentang) && (
                                                                <p className="text-[11px] text-muted-foreground truncate">
                                                                    {doc.nomor_surat ? `No: ${doc.nomor_surat}` : ''} {doc.tentang ? `• ${doc.tentang}` : ''}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <Button asChild size="sm" variant="outline" className="h-7 px-2 text-[11px] gap-1">
                                                                <a href={`/inovasi/dokumen/${doc.id}/preview`} target="_blank" rel="noopener noreferrer">
                                                                    <Eye className="h-3 w-3" /> Preview
                                                                </a>
                                                            </Button>
                                                            <Button asChild size="sm" variant="ghost" className="h-7 px-1.5 text-[11px]">
                                                                <a href={`/inovasi/dokumen/${doc.id}/download`} target="_blank" rel="noopener noreferrer" title="Download berkas">
                                                                    <ExternalLink className="h-3 w-3" />
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* PANEL 3: Keputusan Penilaian Juri */}
                                    <div className="pt-2 border-t space-y-3">
                                        <span className="text-xs font-bold text-foreground block">
                                            Keputusan Penilaian Juri (Pilih Tier):
                                        </span>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                                            {/* Tier 0 */}
                                            <label
                                                onClick={() => handleTierChange(ind.id, 0)}
                                                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex flex-col justify-between ${selectedTier === 0
                                                    ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500 text-rose-950 dark:text-rose-200'
                                                    : 'border-border hover:bg-muted/40'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold">0 / Tidak Sah</span>
                                                    <input
                                                        type="radio"
                                                        name={`sid_${ind.id}`}
                                                        checked={selectedTier === 0}
                                                        onChange={() => handleTierChange(ind.id, 0)}
                                                    />
                                                </div>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                                                    Bukti tidak valid atau tidak ada data dukung (Skor 0).
                                                </p>
                                            </label>

                                            {/* Tier 1 */}
                                            <label
                                                onClick={() => handleTierChange(ind.id, 1)}
                                                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex flex-col justify-between ${selectedTier === 1
                                                    ? 'border-teal-600 bg-teal-500/10 ring-1 ring-teal-600'
                                                    : 'border-border hover:bg-muted/40'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-foreground">Parameter P1</span>
                                                    <input
                                                        type="radio"
                                                        name={`sid_${ind.id}`}
                                                        checked={selectedTier === 1}
                                                        onChange={() => handleTierChange(ind.id, 1)}
                                                    />
                                                </div>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                                                    {ind.p1 || 'Parameter ambang tingkat 1 (Rendah / Dasar).'}
                                                </p>
                                            </label>

                                            {/* Tier 2 */}
                                            <label
                                                onClick={() => handleTierChange(ind.id, 2)}
                                                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex flex-col justify-between ${selectedTier === 2
                                                    ? 'border-teal-600 bg-teal-500/10 ring-1 ring-teal-600'
                                                    : 'border-border hover:bg-muted/40'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-foreground">Parameter P2</span>
                                                    <input
                                                        type="radio"
                                                        name={`sid_${ind.id}`}
                                                        checked={selectedTier === 2}
                                                        onChange={() => handleTierChange(ind.id, 2)}
                                                    />
                                                </div>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                                                    {ind.p2 || 'Parameter ambang tingkat 2 (Sedang / Menengah).'}
                                                </p>
                                            </label>

                                            {/* Tier 3 */}
                                            <label
                                                onClick={() => handleTierChange(ind.id, 3)}
                                                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex flex-col justify-between ${selectedTier === 3
                                                    ? 'border-teal-600 bg-teal-500/10 ring-1 ring-teal-600'
                                                    : 'border-border hover:bg-muted/40'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-foreground">Parameter P3</span>
                                                    <input
                                                        type="radio"
                                                        name={`sid_${ind.id}`}
                                                        checked={selectedTier === 3}
                                                        onChange={() => handleTierChange(ind.id, 3)}
                                                    />
                                                </div>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                                                    {ind.p3 || 'Parameter ambang tingkat 3 (Tinggi / Maksimal).'}
                                                </p>
                                            </label>
                                        </div>

                                        {/* Catatan Penilai */}
                                        <Input
                                            className="text-xs h-9"
                                            placeholder="Catatan justifikasi / evaluasi juri untuk indikator ini (Opsional)..."
                                            value={scoresSid[ind.id]?.catatan || ''}
                                            onChange={(e) => handleCatatanChange(ind.id, e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {filteredIndicators.length === 0 && (
                        <div className="p-8 text-center bg-card border rounded-xl">
                            <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm font-semibold text-foreground">Tidak ada indikator yang sesuai kriteria pencarian.</p>
                            <p className="text-xs text-muted-foreground mt-1">Coba ganti kata kunci atau reset filter status penilaian.</p>
                        </div>
                    )}
                </div>

                {/* Bottom Action Floating Bar */}
                <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-md p-4 z-40 shadow-lg">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>Indikator Dinilai: <strong className="text-foreground">{scoredCount} / {sidList.length}</strong></span>
                            <span>•</span>
                            <span>Total Skor Kematangan: <strong className="text-teal-600 font-black text-base">{totalSkorKematangan.toFixed(2)}</strong></span>
                        </div>
                        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                            <Button
                                variant="outline"
                                onClick={() => handleSubmitScore(false)}
                                disabled={form.processing}
                                className="gap-1.5 text-xs font-semibold"
                            >
                                <Save className="h-4 w-4" />
                                Simpan Draft
                            </Button>
                            <Button
                                onClick={() => handleSubmitScore(true)}
                                disabled={form.processing}
                                className="gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Finalisasi Penilaian (Siap Kirim)
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

SkoringShow.layout = {
    breadcrumbs,
};
