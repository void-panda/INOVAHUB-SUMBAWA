import { useRef } from 'react';
import {
    AlertCircle,
    Check,
    FileText,
    Printer,
    Share2,
    UploadCloud,
    Video,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';

export type InovasiFormData = {
    nama_inovasi: string;
    tahapan: string;
    inisiator: string;
    kategori_inovasi?: string | null;
    bentuk_inovasi: string;
    jenis_inovasi: string;
    klasifikasi: string;
    tematik: string | null;
    kriteria_inovasi: string | null;
    nama_inisiator: string;
    koordinat: string;
    lokasi: string;
    urusan_utama: string | null;
    urusan_wajib: string[];
    waktu_uji_coba: string | null;
    waktu_penerapan: string;
    waktu_pengembangan: string | null;
    anggaran_sebelum: number | string | null;
    anggaran_sesudah: number | string | null;
    is_penghargaan: boolean;
    nama_penghargaan: string;
    rancang_bangun: string;
    tujuan: string;
    manfaat: string;
    hasil_inovasi: string;
    proposal: File | null;
    ppt?: File | null;
    sertifikat: File | null;
    link_video: string;
    nama_video: string;
    link_medsos?: string;
    dokumen: File[];
};

export const KATEGORI_INOVASI_OPTIONS = [
    { value: 'masyarakat', label: 'Masyarakat', desc: 'Inisiatif warga, kelompok tani/nelayan, komunitas' },
    { value: 'opd', label: 'OPD', desc: 'Organisasi Perangkat Daerah / Instansi Pemkab' },
    { value: 'mahasiswa', label: 'Mahasiswa', desc: 'Karya inovatif mahasiswa / perguruan tinggi' },
    { value: 'pelajar', label: 'Pelajar', desc: 'Karya inovatif siswa SMA/SMK/SMP sederajat' },
];

export const INISIATOR_OPTIONS = [
    { value: 'kepala_daerah', label: 'Kepala Daerah', desc: 'Inisiatif gagasan langsung Kepala Daerah' },
    { value: 'anggota_dprd', label: 'Anggota DPRD', desc: 'Inisiatif gagasan Anggota DPRD' },
    { value: 'opd', label: 'OPD', desc: 'Inisiatif Organisasi Perangkat Daerah' },
    { value: 'asn', label: 'ASN', desc: 'Inisiatif perorangan Aparatur Sipil Negara' },
    { value: 'masyarakat', label: 'Masyarakat', desc: 'Inisiatif kelompok atau anggota masyarakat' },
];

export const TAHAPAN_OPTIONS = [
    {
        value: 'inisiatif',
        title: 'Inisiatif',
        desc: 'Tahap gagasan / rancangan awal ide baru',
    },
    {
        value: 'ujicoba',
        title: 'Uji Coba',
        desc: 'Sedang diuji coba dalam lingkup terbatas',
    },
    {
        value: 'penerapan',
        title: 'Penerapan',
        desc: 'Telah diterapkan resmi minimal 1 tahun',
    },
];

export const BENTUK_OPTIONS = [
    {
        value: 'pelayanan_publik',
        title: 'Pelayanan Publik',
        desc: 'Inovasi langsung bersentuhan dengan masyarakat luas',
    },
    {
        value: 'tata_kelola',
        title: 'Tata Kelola Pemda',
        desc: 'Inovasi manajemen internal, kinerja & birokrasi',
    },
    {
        value: 'lainnya',
        title: 'Bentuk Lainnya',
        desc: 'Inovasi kewenangan urusan pemerintahan lainnya',
    },
];

export const JENIS_OPTIONS = [
    {
        value: 'digital',
        title: 'Inovasi Digital',
        desc: 'Berbasis aplikasi web, mobile app, sistem terintegrasi, atau IoT',
    },
    {
        value: 'non_digital',
        title: 'Inovasi Non-Digital',
        desc: 'Berbasis tata laksana, mekanik, rekayasa fisik, produk, atau SOP',
    },
];

export const TEMATIK_OPTIONS = [
    { value: 'stunting', label: 'Penurunan Stunting & Kesehatan Ibu-Anak' },
    { value: 'kemiskinan', label: 'Penanggulangan Kemiskinan Ekstrem' },
    { value: 'investasi', label: 'Peningkatan Investasi & Kemudahan Berusaha' },
    { value: 'digitalisasi', label: 'Digitalisasi Pelayanan Publik & Pemerintahan' },
    { value: 'inflasi', label: 'Pengendalian Inflasi Daerah & Ketahanan Pangan' },
    { value: 'tkdn', label: 'Penggunaan Produk Dalam Negeri (P3DN/TKDN)' },
    { value: 'lingkungan', label: 'Pengurangan Risiko Bencana & Lingkungan Hidup' },
    { value: 'lainnya', label: 'Tematik Lainnya' },
];

export const KRITERIA_IGA_OPTIONS = [
    {
        id: 'kriteria_1',
        title: 'Kebaruan Sebagian atau Keseluruhan (Novelty)',
        label: 'Kebaruan / Novelty',
        desc: 'Mengandung unsur kebaruan ide, modifikasi, atau adaptasi metodologi kerja yang belum pernah ada sebelumnya.',
    },
    {
        id: 'kriteria_2',
        title: 'Kemanfaatan Nyata Bagi Masyarakat atau Pemda',
        label: 'Kemanfaatan Nyata',
        desc: 'Memberikan dampak positif terukur terhadap penyelesaian masalah publik atau efisiensi penyelenggaraan pemerintahan.',
    },
    {
        id: 'kriteria_3',
        title: 'Replikasi & Keberlanjutan Inovasi',
        label: 'Dapat Direplikasi',
        desc: 'Memiliki potensi dan kemudahan untuk diadaptasi oleh OPD lain, instansi vertikal, atau pemerintah daerah lain.',
    },
    {
        id: 'kriteria_4',
        title: 'Pemberdayaan Masyarakat & Partisipasi Publik',
        label: 'Pemberdayaan Masyarakat',
        desc: 'Melibatkan peran aktif masyarakat, komunitas, atau kelompok rentan dalam pelaksanaan inovasi.',
    },
    {
        id: 'kriteria_5',
        title: 'Peningkatan PAD & Efisiensi Belanja APBD',
        label: 'Efisiensi Belanja & PAD',
        desc: 'Memberikan kontribusi terhadap optimalisasi pendapatan daerah atau penghematan anggaran belanja.',
    },
    {
        id: 'kriteria_6',
        title: 'Kelestarian Lingkungan & Mitigasi Bencana',
        label: 'Kelestarian Lingkungan',
        desc: 'Mendukung ekonomi hijau, pengelolaan sampah, energi terbarukan, atau kesiapsiagaan kebencanaan.',
    },
    {
        id: 'kriteria_7',
        title: 'Peningkatan Kualitas Tata Kelola & Akuntabilitas',
        label: 'Tata Kelola & Akuntabilitas',
        desc: 'Memperbaiki tata laksana internal OPD, sistem pengawasan, integritas, dan keterbukaan informasi.',
    },
];

type Option = {
    value: string;
    label: string;
};

type Props = {
    step: number;
    form: {
        data: InovasiFormData;
        setData: (key: keyof InovasiFormData, value: unknown) => void;
    };
    errors: Record<string, string>;
    urusanList: Option[];
    urusanWajibList: string[];
    tipeInovator?: 'dinas' | 'masyarakat';
};

function formatBytes(bytes: number): string {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function countWords(text: string): number {
    if (!text) return 0;
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
}

export function InovasiFields({
    step,
    form,
    errors,
    urusanList,
    urusanWajibList,
    tipeInovator = 'dinas',
}: Props) {
    const { data, setData } = form;
    const proposalRef = useRef<HTMLInputElement>(null);
    const pptRef = useRef<HTMLInputElement>(null);
    const sertifikatRef = useRef<HTMLInputElement>(null);

    const isMasyarakat = tipeInovator === 'masyarakat';
    const minWordCount = isMasyarakat ? 100 : 300;
    const wordCount = countWords(data.rancang_bangun);
    const isWordCountValid = wordCount >= minWordCount;

    const toggleWajib = (urusan: string, checked: boolean) => {
        setData(
            'urusan_wajib',
            checked
                ? [...data.urusan_wajib, urusan]
                : data.urusan_wajib.filter((item) => item !== urusan),
        );
    };

    // Shared Header Banner Wilayah
    const renderWilayahHeader = () => (
        <div className="p-3.5 rounded-lg border bg-muted/30 border-border grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground block">
                    Pemerintah Daerah
                </span>
                <div className="font-bold text-sm text-foreground">
                    Pemerintah Kabupaten Sumbawa (Kode: 52.04)
                </div>
                <p className="text-xs text-muted-foreground">
                    Portal Indeks Inovasi Daerah (IID) Kemendagri.
                </p>
            </div>
            <div className="space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground block">
                    Wilayah / Regional
                </span>
                <div className="font-semibold text-sm text-foreground">
                    Provinsi Nusa Tenggara Barat
                </div>
                <p className="text-xs text-muted-foreground">
                    {isMasyarakat ? 'Jalur Partisipasi Inovasi Masyarakat (INOVA-HUB)' : 'Database Inovasi Daerah Sumbawa (INOVA-HUB).'}
                </p>
            </div>
        </div>
    );

    // Shared Berkas Dokumen Section
    const renderDokumenSection = () => (
        <div className="grid gap-4">
            {/* 1. Profil Inovasi (Pengganti Proposal) */}
            <div className="p-3.5 rounded-lg border bg-muted/10 space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="font-semibold text-xs text-foreground">
                        Profil Inovasi (PDF / DOCX - Format Bebas)
                    </Label>
                    {data.proposal && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-destructive hover:bg-destructive/10"
                            onClick={() => setData('proposal', null)}
                        >
                            Hapus
                        </Button>
                    )}
                </div>
                <input
                    ref={proposalRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files?.[0]) setData('proposal', e.target.files[0]);
                    }}
                />
                {data.proposal ? (
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted border border-border text-xs">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-medium truncate">{data.proposal.name}</span>
                        <span className="text-muted-foreground">({formatBytes(data.proposal.size)})</span>
                    </div>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => proposalRef.current?.click()}
                        className="w-full text-xs border-dashed gap-1.5"
                    >
                        <UploadCloud className="h-4 w-4 text-primary" />
                        Pilih Berkas Profil Inovasi (PDF / DOCX)
                    </Button>
                )}
            </div>

            {/* 2. PPT Presentasi */}
            <div className="p-3.5 rounded-lg border bg-muted/10 space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="font-semibold text-xs text-foreground">
                        PPT Presentasi Inovasi (PPT / PPTX / PDF - Maks. 50MB)
                    </Label>
                    {data.ppt && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-destructive hover:bg-destructive/10"
                            onClick={() => setData('ppt', null)}
                        >
                            Hapus
                        </Button>
                    )}
                </div>
                <input
                    ref={pptRef}
                    type="file"
                    accept=".ppt,.pptx,.pdf"
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files?.[0]) setData('ppt', e.target.files[0]);
                    }}
                />
                {data.ppt ? (
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted border border-border text-xs">
                        <FileText className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium truncate">{data.ppt.name}</span>
                        <span className="text-muted-foreground">({formatBytes(data.ppt.size)})</span>
                    </div>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => pptRef.current?.click()}
                        className="w-full text-xs border-dashed gap-1.5"
                    >
                        <UploadCloud className="h-4 w-4 text-primary" />
                        Pilih Berkas PPT Presentasi (PPT / PPTX / PDF)
                    </Button>
                )}
            </div>

            {/* 3. Sertifikat / Piagam Penghargaan */}
            <div className="p-3.5 rounded-lg border bg-muted/10 space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="font-semibold text-xs text-foreground">
                        Sertifikat / Piagam Penghargaan (PDF / JPG / PNG - Opsional)
                    </Label>
                    {data.sertifikat && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-destructive hover:bg-destructive/10"
                            onClick={() => setData('sertifikat', null)}
                        >
                            Hapus
                        </Button>
                    )}
                </div>
                <input
                    ref={sertifikatRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files?.[0]) setData('sertifikat', e.target.files[0]);
                    }}
                />
                {data.sertifikat ? (
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted border border-border text-xs">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-medium truncate">{data.sertifikat.name}</span>
                        <span className="text-muted-foreground">({formatBytes(data.sertifikat.size)})</span>
                    </div>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => sertifikatRef.current?.click()}
                        className="w-full text-xs border-dashed gap-1.5"
                    >
                        <UploadCloud className="h-4 w-4 text-primary" />
                        Pilih Berkas Piagam / Sertifikat (PDF / JPG / PNG)
                    </Button>
                )}
            </div>

            {/* 4. Link Video Dokumentasi */}
            <div className="p-3.5 rounded-lg border bg-muted/10 space-y-2">
                <Label htmlFor="link_video" className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                    <Video className="h-3.5 w-3.5 text-primary" />
                    Tautan / Link Video Dokumentasi Penerapan (YouTube / Google Drive - Opsional)
                </Label>
                <Input
                    id="link_video"
                    placeholder="Contoh: https://youtube.com/watch?v=... atau https://drive.google.com/..."
                    value={data.link_video}
                    onChange={(e) => setData('link_video', e.target.value)}
                    className="text-xs"
                />
            </div>

            {/* 5. Link Postingan Sosial Media */}
            <div className="p-3.5 rounded-lg border bg-muted/10 space-y-2">
                <Label htmlFor="link_medsos" className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                    <Share2 className="h-3.5 w-3.5 text-primary" />
                    Tautan / Link Postingan Sosial Media (Instagram, TikTok, YouTube, Facebook - Opsional)
                </Label>
                <Input
                    id="link_medsos"
                    placeholder="Contoh: https://www.instagram.com/p/... atau https://vt.tiktok.com/..."
                    value={data.link_medsos || ''}
                    onChange={(e) => setData('link_medsos', e.target.value)}
                    className="text-xs"
                />
            </div>
        </div>
    );

    // Fungsi Cetak Ringkasan ke PDF
    const handlePrintRingkasan = () => {
        const printWindow = window.open('', '_blank', 'width=900,height=750');
        if (!printWindow) return;

        const formatTanggal = (dStr?: string | null) => {
            if (!dStr) return '-';
            try {
                const d = new Date(dStr);
                return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            } catch {
                return dStr;
            }
        };

        const todayFormatted = new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        const katLabel = KATEGORI_INOVASI_OPTIONS.find((k) => k.value === data.kategori_inovasi)?.label || data.kategori_inovasi || (isMasyarakat ? 'Masyarakat' : 'OPD');
        const inisiatorLabel = INISIATOR_OPTIONS.find((i) => i.value === data.inisiator)?.label || data.inisiator || '-';
        const bentukLabel = BENTUK_OPTIONS.find((b) => b.value === data.bentuk_inovasi)?.title || data.bentuk_inovasi || '-';
        const jenisLabel = JENIS_OPTIONS.find((j) => j.value === data.jenis_inovasi)?.title || data.jenis_inovasi || '-';
        const tahapanLabel = TAHAPAN_OPTIONS.find((t) => t.value === data.tahapan)?.title || data.tahapan || '-';

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <title>Ringkasan Profil Inovasi - ${data.nama_inovasi || 'INOVA-HUB'}</title>
                <style>
                    @page { size: A4 portrait; margin: 15mm 15mm 15mm 15mm; }
                    body {
                        font-family: 'Times New Roman', Times, serif;
                        font-size: 11pt;
                        color: #111;
                        line-height: 1.35;
                        margin: 0;
                        padding: 0;
                    }
                    .kop-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 8px;
                        border-bottom: 3px double #000;
                        padding-bottom: 6px;
                    }
                    .kop-table td { vertical-align: middle; }
                    .kop-text { text-align: center; }
                    .kop-text h3 { margin: 0; font-size: 12pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
                    .kop-text h2 { margin: 1px 0; font-size: 14pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
                    .kop-text p { margin: 1px 0; font-size: 9.5pt; font-style: italic; }
                    .doc-header { text-align: center; margin: 12px 0 16px; }
                    .doc-header h4 { margin: 0; font-size: 12pt; text-transform: uppercase; text-decoration: underline; font-weight: bold; }
                    .doc-header span { font-size: 9.5pt; color: #444; }
                    .section-title {
                        font-size: 10.5pt;
                        font-weight: bold;
                        background: #f0f0f0;
                        padding: 4px 8px;
                        border: 1px solid #333;
                        margin-top: 10px;
                        border-bottom: none;
                    }
                    table.data-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 10px;
                    }
                    table.data-table th, table.data-table td {
                        border: 1px solid #333;
                        padding: 5px 8px;
                        font-size: 10pt;
                        vertical-align: top;
                    }
                    table.data-table td.label-col {
                        width: 28%;
                        font-weight: bold;
                        background-color: #fafafa;
                    }
                    .prose-text {
                        text-align: justify;
                        white-space: pre-wrap;
                        line-height: 1.4;
                    }
                    .ttd-container {
                        width: 100%;
                        margin-top: 25px;
                        border-collapse: collapse;
                    }
                    .ttd-container td {
                        width: 50%;
                        vertical-align: top;
                        font-size: 10pt;
                    }
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <table class="kop-table">
                    <tr>
                        <td class="kop-text">
                            <h3>Pemerintah Kabupaten Sumbawa</h3>
                            <h2>Badan Perencanaan Pembangunan, Penelitian dan Pengembangan Daerah</h2>
                            <p>Sistem INOVA-HUB (Repository & Pembinaan Inovasi Daerah Kabupaten Sumbawa)</p>
                            <p>Jalan Garuda No. 1 Sumbawa Besar - Nusa Tenggara Barat | Kode Wilayah: 52.04</p>
                        </td>
                    </tr>
                </table>

                <div class="doc-header">
                    <h4>Lembar Ringkasan Profil Usulan Inovasi Daerah</h4>
                    <span>Dicetak otomatis dari Sistem INOVA-HUB Sumbawa pada ${todayFormatted}</span>
                </div>

                <div class="section-title">I. IDENTITAS & KLASIFIKASI INOVASI</div>
                <table class="data-table">
                    <tr>
                        <td class="label-col">Nama Inovasi</td>
                        <td style="font-weight: bold; font-size: 10.5pt;">${data.nama_inovasi || '-'}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Kategori Inovasi Daerah</td>
                        <td>${katLabel}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Inisiator & Nama Penggagas</td>
                        <td>${inisiatorLabel} — ${data.nama_inisiator || '-'}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Tahapan Inovasi</td>
                        <td>${tahapanLabel}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Bentuk & Jenis Inovasi</td>
                        <td>${bentukLabel} / ${jenisLabel}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Klasifikasi / Tematik</td>
                        <td>${data.klasifikasi === 'tematik' ? `Tematik (${data.tematik || 'Umum'})` : 'Non-Tematik'}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Lokasi & Titik Koordinat</td>
                        <td>${data.lokasi || '-'} (Koordinat: ${data.koordinat || '-'})</td>
                    </tr>
                    <tr>
                        <td class="label-col">Waktu Penerapan Resmi</td>
                        <td>${formatTanggal(data.waktu_penerapan)}</td>
                    </tr>
                </table>

                <div class="section-title">II. SUBSTANSI & RANCANG BANGUN INOVASI</div>
                <table class="data-table">
                    <tr>
                        <td class="label-col">Rancang Bangun & Pokok Perubahan</td>
                        <td class="prose-text">${data.rancang_bangun || '-'}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Tujuan Inovasi</td>
                        <td class="prose-text">${data.tujuan || '-'}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Manfaat Inovasi</td>
                        <td class="prose-text">${data.manfaat || '-'}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Hasil Inovasi</td>
                        <td class="prose-text">${data.hasil_inovasi || '-'}</td>
                    </tr>
                </table>

                <div class="section-title">III. KELENGKAPAN BERKAS DOKUMEN PENDUKUNG UMUM</div>
                <table class="data-table">
                    <tr>
                        <td class="label-col">Profil Inovasi</td>
                        <td>${data.proposal ? data.proposal.name : '(Belum dilampirkan / menyusul)'}</td>
                    </tr>
                    <tr>
                        <td class="label-col">PPT Presentasi Inovasi</td>
                        <td>${data.ppt ? data.ppt.name : '(Belum dilampirkan / menyusul)'}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Sertifikat / Penghargaan</td>
                        <td>${data.sertifikat ? data.sertifikat.name : (data.is_penghargaan ? data.nama_penghargaan : '-')}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Tautan Video Dokumentasi</td>
                        <td>${data.link_video ? data.link_video : '-'}</td>
                    </tr>
                    <tr>
                        <td class="label-col">Tautan Postingan Media Sosial</td>
                        <td>${data.link_medsos ? data.link_medsos : '-'}</td>
                    </tr>
                </table>

                <table class="ttd-container">
                    <tr>
                        <td>
                            Mengetahui,<br>
                            Bappeda Kabupaten Sumbawa<br>
                            Admin / Verifikator Inovasi
                            <br><br><br><br>
                            ( .................................................... )
                        </td>
                        <td style="text-align: right;">
                            Sumbawa Besar, ${todayFormatted}<br>
                            Inovator / Pengusul Inovasi Daerah,<br>
                            ${katLabel}
                            <br><br><br><br>
                            <strong>${data.nama_inisiator || '( .................................................... )'}</strong>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 300);
    };

    // Shared Ringkasan Section
    const renderRingkasanSection = () => (
        <div className="rounded-xl border bg-card p-4 text-xs space-y-3 mt-4">
            <div className="flex items-center justify-between border-b pb-2">
                <div className="font-bold text-sm text-foreground">
                    Ringkasan Profil Usulan Inovasi
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePrintRingkasan}
                    className="gap-1.5 text-xs border-primary/30 hover:bg-primary/10 text-primary h-7"
                >
                    <Printer className="h-3.5 w-3.5" />
                    Cetak PDF Ringkasan
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 leading-relaxed">
                <div>
                    <span className="text-muted-foreground block text-[11px]">Nama Inovasi:</span>
                    <span className="font-bold text-foreground text-xs">{data.nama_inovasi || '-'}</span>
                </div>
                <div>
                    <span className="text-muted-foreground block text-[11px]">Kategori Inovasi Daerah:</span>
                    <Badge variant="secondary" className="capitalize text-[10px] font-semibold mt-0.5">
                        {KATEGORI_INOVASI_OPTIONS.find((k) => k.value === data.kategori_inovasi)?.label || data.kategori_inovasi || (isMasyarakat ? 'Masyarakat' : 'OPD')}
                    </Badge>
                </div>
                <div>
                    <span className="text-muted-foreground block text-[11px]">Nama Inisiator:</span>
                    <span className="font-semibold text-foreground text-xs">{data.nama_inisiator || '-'}</span>
                </div>
                <div>
                    <span className="text-muted-foreground block text-[11px]">Tahapan & Bentuk:</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="secondary" className="capitalize text-[10px]">
                            {data.tahapan}
                        </Badge>
                        <Badge variant="outline" className="capitalize text-[10px]">
                            {data.bentuk_inovasi?.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="capitalize text-[10px]">
                            {data.jenis_inovasi?.replace('_', ' ')}
                        </Badge>
                    </div>
                </div>
                {!isMasyarakat && (
                    <div>
                        <span className="text-muted-foreground block text-[11px]">Klasifikasi & Tematik:</span>
                        <span className="font-medium text-foreground text-xs">
                            {data.klasifikasi === 'tematik' ? `Tematik (${data.tematik || 'Umum'})` : 'Non-Tematik'}
                        </span>
                    </div>
                )}
                <div>
                    <span className="text-muted-foreground block text-[11px]">Waktu Penerapan Resmi:</span>
                    <span className="font-semibold text-foreground text-xs">{data.waktu_penerapan || '-'}</span>
                </div>
                <div>
                    <span className="text-muted-foreground block text-[11px]">Panjang Rancang Bangun:</span>
                    <span className={`font-mono font-bold text-xs ${isWordCountValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {wordCount} / {minWordCount} kata
                    </span>
                </div>
                <div>
                    <span className="text-muted-foreground block text-[11px]">Berkas Dokumen Terlampir:</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                        {data.proposal && <Badge variant="outline" className="text-[10px] text-primary">Profil Inovasi</Badge>}
                        {data.ppt && <Badge variant="outline" className="text-[10px] text-emerald-600">PPT Presentasi</Badge>}
                        {data.sertifikat && <Badge variant="outline" className="text-[10px] text-amber-600">Sertifikat</Badge>}
                        {data.link_video && <Badge variant="outline" className="text-[10px] text-blue-600">Video</Badge>}
                        {data.link_medsos && <Badge variant="outline" className="text-[10px] text-pink-600">Medsos</Badge>}
                        {!data.proposal && !data.ppt && !data.sertifikat && !data.link_video && !data.link_medsos && (
                            <span className="text-[11px] text-muted-foreground italic">Belum ada berkas terunggah</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    /* =========================================================================
       FORM FLOW KHUSUS INOVATOR MASYARAKAT (3 STEPS)
       ========================================================================= */
    if (isMasyarakat) {
        return (
            <div className="grid gap-6">
                {/* STEP 0 (Masyarakat): Identitas & Bentuk Inovasi */}
                {step === 0 && (
                    <div className="space-y-5">
                        <div className="border-b pb-3">
                            <h3 className="text-base font-bold text-foreground">
                                I. Identitas & Bentuk Inovasi
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Lengkapi identitas penggagas, judul inovasi, tahapan, serta jenis inovasi yang Anda kembangkan.
                            </p>
                        </div>

                        {renderWilayahHeader()}

                        {/* Nama Inovasi */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="nama_inovasi" className="font-semibold text-xs text-foreground">
                                Nama Inovasi <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="nama_inovasi"
                                name="nama_inovasi"
                                value={data.nama_inovasi}
                                onChange={(e) => setData('nama_inovasi', e.target.value)}
                                placeholder="Contoh: Mesin Pengolah Limbah Jagung Ramah Lingkungan"
                                className="text-xs sm:text-sm"
                            />
                            {errors.nama_inovasi && (
                                <p className="text-xs text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3 shrink-0" />
                                    {errors.nama_inovasi}
                                </p>
                            )}
                        </div>

                        {/* Inisiator Inovasi Daerah */}
                        <div className="grid gap-2 pt-1">
                            <Label className="font-semibold text-xs text-foreground">
                                Inisiator Inovasi Daerah <span className="text-destructive">*</span>
                            </Label>
                            <div
                                role="radiogroup"
                                aria-label="Inisiator Inovasi Daerah"
                                className="grid grid-cols-2 sm:grid-cols-5 gap-2.5"
                            >
                                {INISIATOR_OPTIONS.map((opt) => {
                                    const isSelected = (data.inisiator || 'masyarakat') === opt.value;
                                    return (
                                        <button
                                            type="button"
                                            role="radio"
                                            aria-checked={isSelected}
                                            key={opt.value}
                                            onClick={() => setData('inisiator', opt.value)}
                                            className={`p-3 rounded-lg border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex flex-col justify-between ${
                                                isSelected
                                                    ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
                                                    : 'border-border hover:border-primary/40 hover:bg-muted/30'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between w-full mb-1">
                                                <span className="font-bold text-xs text-foreground">{opt.label}</span>
                                                <div
                                                    className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                                                        isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                                                    }`}
                                                >
                                                    {isSelected && <Check className="h-2 w-2 stroke-[3]" />}
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                {opt.desc}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Kategori Inovasi Daerah */}
                        <div className="grid gap-2 pt-1">
                            <Label className="font-semibold text-xs text-foreground">
                                Kategori Inovasi Daerah <span className="text-destructive">*</span>
                            </Label>
                            <div
                                role="radiogroup"
                                aria-label="Kategori Inovasi Daerah"
                                className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
                            >
                                {KATEGORI_INOVASI_OPTIONS.map((opt) => {
                                    const isSelected = (data.kategori_inovasi || 'masyarakat') === opt.value;
                                    return (
                                        <button
                                            type="button"
                                            role="radio"
                                            aria-checked={isSelected}
                                            key={opt.value}
                                            onClick={() => setData('kategori_inovasi', opt.value)}
                                            className={`p-3 rounded-lg border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex flex-col justify-between ${
                                                isSelected
                                                    ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
                                                    : 'border-border hover:border-primary/40 hover:bg-muted/30'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between w-full mb-1">
                                                <span className="font-bold text-xs text-foreground">{opt.label}</span>
                                                <div
                                                    className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                                                        isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                                                    }`}
                                                >
                                                    {isSelected && <Check className="h-2 w-2 stroke-[3]" />}
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                {opt.desc}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.kategori_inovasi && (
                                <p className="text-xs text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3 shrink-0" />
                                    {errors.kategori_inovasi}
                                </p>
                            )}
                        </div>

                        {/* Nama Inisiator */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="nama_inisiator" className="font-semibold text-xs text-foreground">
                                Nama Inisiator / Penggagas <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="nama_inisiator"
                                name="nama_inisiator"
                                value={data.nama_inisiator}
                                onChange={(e) => setData('nama_inisiator', e.target.value)}
                                placeholder="Nama perorangan, kelompok tani/nelayan, atau komunitas penggagas"
                                className="text-xs sm:text-sm"
                            />
                            {errors.nama_inisiator && (
                                <p className="text-xs text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3 shrink-0" />
                                    {errors.nama_inisiator}
                                </p>
                            )}
                        </div>

                        {/* Tahapan Inovasi */}
                        <div className="grid gap-2 pt-1">
                            <Label className="font-semibold text-xs text-foreground">
                                Tahapan Inovasi <span className="text-destructive">*</span>
                            </Label>
                            <div
                                role="radiogroup"
                                aria-label="Tahapan Inovasi"
                                className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
                            >
                                {TAHAPAN_OPTIONS.map((opt) => {
                                    const isSelected = data.tahapan === opt.value;
                                    return (
                                        <button
                                            type="button"
                                            role="radio"
                                            aria-checked={isSelected}
                                            key={opt.value}
                                            onClick={() => setData('tahapan', opt.value)}
                                            className={`p-3 rounded-lg border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex flex-col justify-between ${
                                                isSelected
                                                    ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
                                                    : 'border-border hover:border-primary/40 hover:bg-muted/30'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between w-full mb-1">
                                                <span className="font-bold text-xs text-foreground">{opt.title}</span>
                                                <div
                                                    className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                                                        isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                                                    }`}
                                                >
                                                    {isSelected && <Check className="h-2 w-2 stroke-[3]" />}
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                {opt.desc}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bentuk Inovasi */}
                        <div className="grid gap-2 pt-1">
                            <Label className="font-semibold text-xs text-foreground">
                                Bentuk Inovasi <span className="text-destructive">*</span>
                            </Label>
                            <div
                                role="radiogroup"
                                aria-label="Bentuk Inovasi"
                                className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
                            >
                                {BENTUK_OPTIONS.map((opt) => {
                                    const isSelected = (data.bentuk_inovasi || 'pelayanan_publik') === opt.value;
                                    return (
                                        <button
                                            type="button"
                                            role="radio"
                                            aria-checked={isSelected}
                                            key={opt.value}
                                            onClick={() => setData('bentuk_inovasi', opt.value)}
                                            className={`p-3 rounded-lg border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex flex-col justify-between ${
                                                isSelected
                                                    ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
                                                    : 'border-border hover:border-primary/40 hover:bg-muted/30'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between w-full mb-1">
                                                <span className="font-bold text-xs text-foreground">{opt.title}</span>
                                                <div
                                                    className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                                                        isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                                                    }`}
                                                >
                                                    {isSelected && <Check className="h-2 w-2 stroke-[3]" />}
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                {opt.desc}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Jenis Inovasi */}
                        <div className="grid gap-2 pt-1">
                            <Label className="font-semibold text-xs text-foreground">
                                Jenis Inovasi <span className="text-destructive">*</span>
                            </Label>
                            <div
                                role="radiogroup"
                                aria-label="Jenis Inovasi"
                                className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                            >
                                {JENIS_OPTIONS.map((opt) => {
                                    const isSelected = (data.jenis_inovasi || 'non_digital') === opt.value;
                                    return (
                                        <button
                                            type="button"
                                            role="radio"
                                            aria-checked={isSelected}
                                            key={opt.value}
                                            onClick={() => setData('jenis_inovasi', opt.value)}
                                            className={`p-3 rounded-lg border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex flex-col justify-between ${
                                                isSelected
                                                    ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
                                                    : 'border-border hover:border-primary/40 hover:bg-muted/30'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between w-full mb-1">
                                                <span className="font-bold text-xs text-foreground">{opt.title}</span>
                                                <div
                                                    className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                                                        isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                                                    }`}
                                                >
                                                    {isSelected && <Check className="h-2 w-2 stroke-[3]" />}
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                {opt.desc}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 1 (Masyarakat): Lokasi & Waktu Penerapan */}
                {step === 1 && (
                    <div className="space-y-5">
                        <div className="border-b pb-3">
                            <h3 className="text-base font-bold text-foreground">
                                II. Lokasi & Waktu Penerapan Inovasi
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Tentukan lokasi wilayah dan tanggal mulai diterapkannya inovasi Anda di lingkungan masyarakat.
                            </p>
                        </div>

                        {/* Koordinat & Lokasi */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-1.5">
                                <Label htmlFor="koordinat" className="font-semibold text-xs text-foreground">
                                    Koordinat Geografis (Lat, Lng) <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="koordinat"
                                    name="koordinat"
                                    value={data.koordinat}
                                    onChange={(e) => setData('koordinat', e.target.value)}
                                    placeholder="Contoh: -8.4931, 117.4193"
                                    className="text-xs sm:text-sm font-mono"
                                />
                                <p className="text-[11px] text-muted-foreground">
                                    Dapat disalin dari titik lokasi Google Maps.
                                </p>
                                {errors.koordinat && (
                                    <p className="text-xs text-destructive">{errors.koordinat}</p>
                                )}
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="lokasi" className="font-semibold text-xs text-foreground">
                                    Lokasi / Wilayah Penerapan <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="lokasi"
                                    name="lokasi"
                                    value={data.lokasi}
                                    onChange={(e) => setData('lokasi', e.target.value)}
                                    placeholder="Contoh: Dusun Labuhan, Desa Labuhan Sumbawa, Kec. Labuhan Badas"
                                    className="text-xs sm:text-sm"
                                />
                                <p className="text-[11px] text-muted-foreground">
                                    Nama desa, kelurahan, atau kecamatan tempat inovasi berjalan.
                                </p>
                                {errors.lokasi && (
                                    <p className="text-xs text-destructive">{errors.lokasi}</p>
                                )}
                            </div>
                        </div>

                        {/* Waktu Penerapan */}
                        <div className="grid gap-1.5 pt-2">
                            <Label htmlFor="waktu_penerapan" className="font-semibold text-xs text-foreground">
                                Tanggal Mulai Penerapan di Masyarakat <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="waktu_penerapan"
                                type="date"
                                required
                                value={data.waktu_penerapan}
                                onChange={(e) => setData('waktu_penerapan', e.target.value)}
                                className="text-xs font-semibold sm:max-w-xs"
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Tanggal awal mula inovasi digunakan / dirasakan manfaatnya oleh masyarakat.
                            </p>
                            {errors.waktu_penerapan && (
                                <p className="text-xs text-destructive">
                                    {errors.waktu_penerapan}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 2 (Masyarakat): Deskripsi, Berkas & Review */}
                {step === 2 && (
                    <div className="space-y-5">
                        <div className="border-b pb-3">
                            <h3 className="text-base font-bold text-foreground">
                                III. Deskripsi & Berkas Pendukung Inovasi
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Uraikan ringkasan ide rancang bangun (minimal 100 kata), tujuan, manfaat, dan lampirkan dokumen/video jika ada.
                            </p>
                        </div>

                        {/* Rancang Bangun */}
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <Label htmlFor="rancang_bangun" className="font-semibold text-xs text-foreground">
                                    Rancang Bangun / Penjelasan Ide Inovasi <span className="text-destructive">*</span>
                                </Label>
                                <Badge
                                    variant="outline"
                                    className={`text-[11px] font-mono font-bold transition-colors ${
                                        isWordCountValid
                                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                            : 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                    }`}
                                >
                                    {isWordCountValid ? (
                                        <span>{wordCount} / 100 Kata (Memenuhi Standar)</span>
                                    ) : (
                                        <span>{wordCount} / Minimal 100 Kata</span>
                                    )}
                                </Badge>
                            </div>

                            <Textarea
                                id="rancang_bangun"
                                rows={6}
                                value={data.rancang_bangun}
                                onChange={(e) => setData('rancang_bangun', e.target.value)}
                                placeholder="Jelaskan latar belakang masalah di masyarakat, cara kerja inovasi yang dibuat, dan bagaimana inovasi ini menyelesaikan masalah tersebut..."
                                className="text-xs sm:text-sm leading-relaxed"
                            />

                            {!isWordCountValid && (
                                <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2 rounded-md flex items-center gap-1.5">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    <span>
                                        Uraikan penjelasan ide inovasi minimal 100 kata agar tim pendamping dapat memahami konsep dengan jelas.
                                    </span>
                                </p>
                            )}
                            {errors.rancang_bangun && (
                                <p className="text-xs text-destructive">{errors.rancang_bangun}</p>
                            )}
                        </div>

                        {/* Tujuan Inovasi */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="tujuan" className="font-semibold text-xs text-foreground">
                                Tujuan Inovasi (Opsional)
                            </Label>
                            <Textarea
                                id="tujuan"
                                rows={2}
                                value={data.tujuan}
                                onChange={(e) => setData('tujuan', e.target.value)}
                                placeholder="Apa tujuan utama yang ingin dicapai melalui inovasi ini?"
                                className="text-xs sm:text-sm"
                            />
                        </div>

                        {/* Manfaat Inovasi */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="manfaat" className="font-semibold text-xs text-foreground">
                                Manfaat Bagi Masyarakat (Opsional)
                            </Label>
                            <Textarea
                                id="manfaat"
                                rows={2}
                                value={data.manfaat}
                                onChange={(e) => setData('manfaat', e.target.value)}
                                placeholder="Apa dampak positif atau kemudahan yang dirasakan warga sekitar?"
                                className="text-xs sm:text-sm"
                            />
                        </div>

                        {/* Hasil Inovasi */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="hasil_inovasi" className="font-semibold text-xs text-foreground">
                                Hasil Nyata / Output (Opsional)
                            </Label>
                            <Textarea
                                id="hasil_inovasi"
                                rows={2}
                                value={data.hasil_inovasi}
                                onChange={(e) => setData('hasil_inovasi', e.target.value)}
                                placeholder="Contoh: Jumlah warga yang terbantu, penghematan waktu/biaya warga, dll."
                                className="text-xs sm:text-sm"
                            />
                        </div>

                        {/* Upload Berkas Pendukung */}
                        {renderDokumenSection()}

                        {/* Ringkasan Profil */}
                        {renderRingkasanSection()}
                    </div>
                )}
            </div>
        );
    }

    /* =========================================================================
       FORM FLOW STANDAR INOVATOR DINAS / OPD (5 STEPS)
       ========================================================================= */
    return (
        <div className="grid gap-6">
            {/* STEP 1: Identitas, Tahapan, Bentuk & Jenis Inovasi */}
            {step === 0 && (
                <div className="space-y-5">
                    <div className="border-b pb-3">
                        <h3 className="text-base font-bold text-foreground">
                            I. Identitas & Bentuk Inovasi Daerah
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Isi nama pengusul, judul inovasi, inisiator, tahapan, bentuk, serta jenis inovasi sesuai standar Pedoman IGA Kemendagri.
                        </p>
                    </div>

                    {renderWilayahHeader()}

                    {/* Nama Inovasi */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="nama_inovasi" className="font-semibold text-xs text-foreground">
                            Nama Inovasi <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="nama_inovasi"
                            name="nama_inovasi"
                            value={data.nama_inovasi}
                            onChange={(e) => setData('nama_inovasi', e.target.value)}
                            placeholder="Contoh: SI-SABALONG Pelayanan Adduk Tipe A Terintegrasi"
                            className="text-xs sm:text-sm"
                        />
                        {errors.nama_inovasi && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3 shrink-0" />
                                {errors.nama_inovasi}
                            </p>
                        )}
                    </div>

                    {/* Inisiator Inovasi Daerah */}
                    <div className="grid gap-2 pt-1">
                        <Label className="font-semibold text-xs text-foreground">
                            Inisiator Inovasi Daerah <span className="text-destructive">*</span>
                        </Label>
                        <div
                            role="radiogroup"
                            aria-label="Inisiator Inovasi Daerah"
                            className="grid grid-cols-2 sm:grid-cols-5 gap-2.5"
                        >
                            {INISIATOR_OPTIONS.map((opt) => {
                                const isSelected = (data.inisiator || 'opd') === opt.value;
                                return (
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        key={opt.value}
                                        onClick={() => setData('inisiator', opt.value)}
                                        className={`p-3 rounded-lg border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex flex-col justify-between ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
                                                : 'border-border hover:border-primary/40 hover:bg-muted/30'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1">
                                            <span className="font-bold text-xs text-foreground">{opt.label}</span>
                                            <div
                                                className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                                                    isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                                                }`}
                                            >
                                                {isSelected && <Check className="h-2 w-2 stroke-[3]" />}
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            {opt.desc}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Kategori Inovasi Daerah */}
                    <div className="grid gap-2 pt-1">
                        <Label className="font-semibold text-xs text-foreground">
                            Kategori Inovasi Daerah <span className="text-destructive">*</span>
                        </Label>
                        <div
                            role="radiogroup"
                            aria-label="Kategori Inovasi Daerah"
                            className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
                        >
                            {KATEGORI_INOVASI_OPTIONS.map((opt) => {
                                const isSelected = (data.kategori_inovasi || 'opd') === opt.value;
                                return (
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        key={opt.value}
                                        onClick={() => setData('kategori_inovasi', opt.value)}
                                        className={`p-3 rounded-lg border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex flex-col justify-between ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
                                                : 'border-border hover:border-primary/40 hover:bg-muted/30'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1">
                                            <span className="font-bold text-xs text-foreground">{opt.label}</span>
                                            <div
                                                className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                                                    isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                                                }`}
                                            >
                                                {isSelected && <Check className="h-2 w-2 stroke-[3]" />}
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            {opt.desc}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                        {errors.kategori_inovasi && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3 shrink-0" />
                                {errors.kategori_inovasi}
                            </p>
                        )}
                    </div>

                    {/* Nama Inisiator */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="nama_inisiator" className="font-semibold text-xs text-foreground">
                            Nama Inisiator / Penggagas <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="nama_inisiator"
                            name="nama_inisiator"
                            value={data.nama_inisiator}
                            onChange={(e) => setData('nama_inisiator', e.target.value)}
                            placeholder="Nama OPD / Bidang / Personel penggagas inovasi"
                            className="text-xs sm:text-sm"
                        />
                        {errors.nama_inisiator && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3 shrink-0" />
                                {errors.nama_inisiator}
                            </p>
                        )}
                    </div>

                    {/* Tahapan Inovasi */}
                    <div className="grid gap-2 pt-1">
                        <Label className="font-semibold text-xs text-foreground">
                            Tahapan Inovasi <span className="text-destructive">*</span>
                        </Label>
                        <div
                            role="radiogroup"
                            aria-label="Tahapan Inovasi"
                            className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
                        >
                            {TAHAPAN_OPTIONS.map((opt) => {
                                const isSelected = data.tahapan === opt.value;
                                return (
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        key={opt.value}
                                        onClick={() => setData('tahapan', opt.value)}
                                        className={`p-3 rounded-lg border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex flex-col justify-between ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
                                                : 'border-border hover:border-primary/40 hover:bg-muted/30'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1">
                                            <span className="font-bold text-xs text-foreground">{opt.title}</span>
                                            <div
                                                className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                                                    isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                                                }`}
                                            >
                                                {isSelected && <Check className="h-2 w-2 stroke-[3]" />}
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            {opt.desc}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bentuk Inovasi */}
                    <div className="grid gap-2 pt-1">
                        <Label className="font-semibold text-xs text-foreground">
                            Bentuk Inovasi Daerah <span className="text-destructive">*</span>
                        </Label>
                        <div
                            role="radiogroup"
                            aria-label="Bentuk Inovasi Daerah"
                            className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
                        >
                            {BENTUK_OPTIONS.map((opt) => {
                                const isSelected = (data.bentuk_inovasi || 'pelayanan_publik') === opt.value;
                                return (
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        key={opt.value}
                                        onClick={() => setData('bentuk_inovasi', opt.value)}
                                        className={`p-3 rounded-lg border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex flex-col justify-between ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
                                                : 'border-border hover:border-primary/40 hover:bg-muted/30'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1">
                                            <span className="font-bold text-xs text-foreground">{opt.title}</span>
                                            <div
                                                className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                                                    isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                                                }`}
                                            >
                                                {isSelected && <Check className="h-2 w-2 stroke-[3]" />}
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            {opt.desc}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Jenis Inovasi */}
                    <div className="grid gap-2 pt-1">
                        <Label className="font-semibold text-xs text-foreground">
                            Jenis Inovasi <span className="text-destructive">*</span>
                        </Label>
                        <div
                            role="radiogroup"
                            aria-label="Jenis Inovasi"
                            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                        >
                            {JENIS_OPTIONS.map((opt) => {
                                const isSelected = (data.jenis_inovasi || 'non_digital') === opt.value;
                                return (
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        key={opt.value}
                                        onClick={() => setData('jenis_inovasi', opt.value)}
                                        className={`p-3 rounded-lg border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex flex-col justify-between ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
                                                : 'border-border hover:border-primary/40 hover:bg-muted/30'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1">
                                            <span className="font-bold text-xs text-foreground">{opt.title}</span>
                                            <div
                                                className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                                                    isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                                                }`}
                                            >
                                                {isSelected && <Check className="h-2 w-2 stroke-[3]" />}
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            {opt.desc}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Urusan Utama & Urusan Irisan */}
                    <div className="grid gap-2 pt-1">
                        <Label htmlFor="urusan_utama" className="font-semibold text-xs text-foreground">
                            Urusan Pemerintahan Utama
                        </Label>
                        <Select
                            value={data.urusan_utama ?? ''}
                            onValueChange={(v) => setData('urusan_utama', v || null)}
                        >
                            <SelectTrigger id="urusan_utama" className="text-xs sm:text-sm">
                                <SelectValue placeholder="Pilih urusan utama yang menaungi inovasi" />
                            </SelectTrigger>
                            <SelectContent>
                                {urusanList.map(({ value, label }) => (
                                    <SelectItem key={value} value={value} className="text-xs">
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2 pt-1">
                        <Label className="font-semibold text-xs text-foreground">
                            Urusan Wajib Pelayanan Dasar / Urusan Terkait (Opsional)
                        </Label>
                        <div className="grid gap-2 sm:grid-cols-2 rounded-lg border p-3 bg-muted/20">
                            {urusanWajibList.map((urusan) => (
                                <div key={urusan} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`wajib-${urusan}`}
                                        checked={data.urusan_wajib.includes(urusan)}
                                        onCheckedChange={(checked) =>
                                            toggleWajib(urusan, Boolean(checked))
                                        }
                                    />
                                    <Label htmlFor={`wajib-${urusan}`} className="font-normal text-xs cursor-pointer">
                                        {urusan}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: Klasifikasi, Tematik & Lokasi */}
            {step === 1 && (
                <div className="space-y-5">
                    <div className="border-b pb-3">
                        <h3 className="text-base font-bold text-foreground">
                            II. Klasifikasi, Tematik & Lokasi Inovasi
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Tentukan apakah inovasi termasuk kategori tematik prioritas, pilih kriteria rancang bangun utama, dan lokasi penerapannya.
                        </p>
                    </div>

                    {/* Klasifikasi Tematik vs Non-Tematik */}
                    <div className="grid gap-2">
                        <Label className="font-semibold text-xs text-foreground">
                            Klasifikasi Inovasi <span className="text-destructive">*</span>
                        </Label>
                        <div
                            role="radiogroup"
                            aria-label="Klasifikasi Inovasi"
                            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                        >
                            {[
                                {
                                    value: 'tematik',
                                    title: 'Inovasi Tematik Prioritas',
                                    desc: 'Mendukung isu prioritas nasional (Stunting, Kemiskinan, Inflasi, Investasi, dll)',
                                },
                                {
                                    value: 'non_tematik',
                                    title: 'Inovasi Non-Tematik (Umum)',
                                    desc: 'Inovasi reguler penyelenggaraan urusan pemerintahan daerah',
                                },
                            ].map((opt) => {
                                const isSelected = (data.klasifikasi || 'non_tematik') === opt.value;
                                return (
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        key={opt.value}
                                        onClick={() => setData('klasifikasi', opt.value)}
                                        className={`p-3 rounded-lg border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex flex-col justify-between ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
                                                : 'border-border hover:border-primary/40 hover:bg-muted/30'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full mb-1">
                                            <span className="font-bold text-xs text-foreground">{opt.title}</span>
                                            <div
                                                className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                                                    isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                                                }`}
                                            >
                                                {isSelected && <Check className="h-2 w-2 stroke-[3]" />}
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            {opt.desc}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pilihan Sub Tematik jika Tematik dipilih */}
                    {data.klasifikasi === 'tematik' && (
                        <div className="grid gap-1.5 p-3.5 rounded-lg border border-primary/30 bg-primary/5">
                            <Label htmlFor="tematik" className="font-semibold text-xs text-foreground">
                                Pilih Kategori Tematik Prioritas <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={data.tematik ?? ''}
                                onValueChange={(v) => setData('tematik', v || null)}
                            >
                                <SelectTrigger id="tematik" className="text-xs sm:text-sm bg-background">
                                    <SelectValue placeholder="Pilih fokus tematik inovasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TEMATIK_OPTIONS.map((item) => (
                                        <SelectItem key={item.value} value={item.value} className="text-xs">
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Kriteria Rancang Bangun Utama IGA */}
                    <div className="grid gap-2 pt-1">
                        <div className="flex items-center justify-between">
                            <Label className="font-semibold text-xs text-foreground">
                                Jenis / Ciri Kriteria Rancang Bangun Utama (Pedoman IGA)
                            </Label>
                            <span className="text-[11px] text-muted-foreground">Pilih 1 kriteria paling menonjol</span>
                        </div>

                        <div className="p-3 rounded-md bg-muted/40 border text-xs text-muted-foreground">
                            Pilih 1 karakteristik atau kebaruan (*novelty*) yang menjadi keunggulan utama inovasi Anda untuk pelaporan indeks inovasi daerah.
                        </div>

                        <div
                            role="radiogroup"
                            aria-label="Kriteria Inovasi IGA"
                            className="grid gap-2 pt-1"
                        >
                            {KRITERIA_IGA_OPTIONS.map((kriteria) => {
                                const isSelected = data.kriteria_inovasi === kriteria.id;
                                return (
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        key={kriteria.id}
                                        onClick={() => setData('kriteria_inovasi', kriteria.id)}
                                        className={`p-3 rounded-lg border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
                                                : 'border-border hover:border-primary/40 hover:bg-muted/30'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-start gap-2.5">
                                                <div
                                                    className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                                        isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40 bg-background'
                                                    }`}
                                                >
                                                    {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-xs text-foreground block">
                                                        {kriteria.title}
                                                    </span>
                                                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                                                        {kriteria.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Koordinat & Lokasi */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="grid gap-1.5">
                            <Label htmlFor="koordinat" className="font-semibold text-xs text-foreground">
                                Koordinat Geografis (Lat, Lng) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="koordinat"
                                name="koordinat"
                                value={data.koordinat}
                                onChange={(e) => setData('koordinat', e.target.value)}
                                placeholder="Contoh: -8.4931, 117.4193"
                                className="text-xs sm:text-sm font-mono"
                            />
                            {errors.koordinat && (
                                <p className="text-xs text-destructive">{errors.koordinat}</p>
                            )}
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="lokasi" className="font-semibold text-xs text-foreground">
                                Lokasi / Wilayah Penerapan (Opsional)
                            </Label>
                            <Input
                                id="lokasi"
                                name="lokasi"
                                value={data.lokasi}
                                onChange={(e) => setData('lokasi', e.target.value)}
                                placeholder="Contoh: Seluruh Puskesmas se-Kabupaten Sumbawa"
                                className="text-xs sm:text-sm"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: Linimasa & Anggaran */}
            {step === 2 && (
                <div className="space-y-5">
                    <div className="border-b pb-3">
                        <h3 className="text-base font-bold text-foreground">
                            III. Linimasa Implementasi & Anggaran
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Tentukan tanggal uji coba, penerapan resmi, serta estimasi efisiensi dan perubahan anggaran.
                        </p>
                    </div>

                    {/* Tanggal Implementasi */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="waktu_uji_coba" className="font-semibold text-xs text-foreground">
                                Tanggal Uji Coba
                            </Label>
                            <Input
                                id="waktu_uji_coba"
                                type="date"
                                value={data.waktu_uji_coba ?? ''}
                                onChange={(e) =>
                                    setData('waktu_uji_coba', e.target.value || null)
                                }
                                className="text-xs"
                            />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="waktu_penerapan" className="font-semibold text-xs text-foreground">
                                Tanggal Penerapan Resmi <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="waktu_penerapan"
                                type="date"
                                required
                                value={data.waktu_penerapan}
                                onChange={(e) => setData('waktu_penerapan', e.target.value)}
                                className="text-xs font-semibold"
                            />
                            {errors.waktu_penerapan && (
                                <p className="text-xs text-destructive">
                                    {errors.waktu_penerapan}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="waktu_pengembangan" className="font-semibold text-xs text-foreground">
                                Tanggal Pengembangan
                            </Label>
                            <Input
                                id="waktu_pengembangan"
                                type="date"
                                value={data.waktu_pengembangan ?? ''}
                                onChange={(e) =>
                                    setData('waktu_pengembangan', e.target.value || null)
                                }
                                className="text-xs"
                            />
                        </div>
                    </div>

                    {/* Estimasi Anggaran Sebelum vs Sesudah */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-3.5 rounded-lg border bg-muted/20 space-y-2">
                            <Label htmlFor="anggaran_sebelum" className="font-semibold text-xs text-foreground">
                                Anggaran Sebelum Inovasi (Rp)
                            </Label>
                            <Input
                                id="anggaran_sebelum"
                                type="number"
                                min={0}
                                value={data.anggaran_sebelum ?? ''}
                                onChange={(e) =>
                                    setData('anggaran_sebelum', e.target.value ? Number(e.target.value) : null)
                                }
                                placeholder="Contoh: 150000000"
                                className="text-xs sm:text-sm font-mono"
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Biaya operasional tahunan sebelum inovasi diterapkan.
                            </p>
                        </div>

                        <div className="p-3.5 rounded-lg border bg-muted/20 space-y-2">
                            <Label htmlFor="anggaran_sesudah" className="font-semibold text-xs text-foreground">
                                Anggaran Sesudah Inovasi (Rp)
                            </Label>
                            <Input
                                id="anggaran_sesudah"
                                type="number"
                                min={0}
                                value={data.anggaran_sesudah ?? ''}
                                onChange={(e) =>
                                    setData('anggaran_sesudah', e.target.value ? Number(e.target.value) : null)
                                }
                                placeholder="Contoh: 85000000"
                                className="text-xs sm:text-sm font-mono"
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Biaya operasional tahunan setelah adanya efisiensi inovasi.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4: Deskripsi / Rancang Bangun (Min 300 kata) & Manfaat */}
            {step === 3 && (
                <div className="space-y-5">
                    <div className="border-b pb-3">
                        <h3 className="text-base font-bold text-foreground">
                            IV. Deskripsi Rancang Bangun & Manfaat Inovasi
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Uraikan rancang bangun inovasi (minimal 300 kata sesuai pedoman penilaian IGA), tujuan, manfaat, serta output hasil nyata.
                        </p>
                    </div>

                    {/* Rancang Bangun Inovasi with Live Word Counter */}
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <Label htmlFor="rancang_bangun" className="font-semibold text-xs text-foreground">
                                Rancang Bangun Inovasi Daerah (Latar Belakang, Cara Kerja & Kebaruan) <span className="text-destructive">*</span>
                            </Label>
                            <Badge
                                variant="outline"
                                className={`text-[11px] font-mono font-bold transition-colors ${
                                    isWordCountValid
                                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                        : 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                }`}
                            >
                                {isWordCountValid ? (
                                    <span>{wordCount} / 300 Kata (Memenuhi Standar)</span>
                                ) : (
                                    <span>{wordCount} / Minimal 300 Kata</span>
                                )}
                            </Badge>
                        </div>

                        <Textarea
                            id="rancang_bangun"
                            rows={8}
                            value={data.rancang_bangun}
                            onChange={(e) => setData('rancang_bangun', e.target.value)}
                            placeholder="Tuliskan latar belakang masalah yang dihadapi, ide orisinal/kebaruan yang digagas, tahapan operasional cara kerja inovasi, dan keterlibatan stakeholder..."
                            className="text-xs sm:text-sm leading-relaxed"
                        />

                        {!isWordCountValid && (
                            <p className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2 rounded-md flex items-center gap-1.5">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                <span>
                                    Pedoman Umum IGA Kemendagri mewajibkan narasi Rancang Bangun minimal 300 kata untuk mendapatkan skor indikator maksimal (Indikator SID 1.1).
                                </span>
                            </p>
                        )}
                        {errors.rancang_bangun && (
                            <p className="text-xs text-destructive">{errors.rancang_bangun}</p>
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
                            value={data.manfaat}
                            onChange={(e) => setData('manfaat', e.target.value)}
                            placeholder="Uraikan dampak positif, kemudahan yang dirasakan pengguna layanan, serta peningkatan mutu..."
                            className="text-xs sm:text-sm"
                        />
                    </div>

                    {/* Hasil Inovasi */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="hasil_inovasi" className="font-semibold text-xs text-foreground">
                            Hasil Inovasi / Output Nyata <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="hasil_inovasi"
                            rows={3}
                            value={data.hasil_inovasi}
                            onChange={(e) => setData('hasil_inovasi', e.target.value)}
                            placeholder="Sebutkan output kuantitatif / kualitatif yang telah terealisasi (misal: jumlah penerima manfaat, indeks kepuasan, efisiensi waktu)..."
                            className="text-xs sm:text-sm"
                        />
                    </div>
                </div>
            )}

            {/* STEP 5: Dokumen & Review */}
            {step === 4 && (
                <div className="space-y-5">
                    <div className="border-b pb-3">
                        <h3 className="text-base font-bold text-foreground">
                            V. Dokumen & Ringkasan Draft
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Unggah profil inovasi, PPT presentasi, sertifikat/piagam, video, dan link media sosial sebelum menyimpan draft inovasi.
                        </p>
                    </div>

                    {renderDokumenSection()}

                    {renderRingkasanSection()}
                </div>
            )}
        </div>
    );
}