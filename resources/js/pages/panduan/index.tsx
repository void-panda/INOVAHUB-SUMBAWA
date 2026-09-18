import { Head } from '@inertiajs/react';
import {
    BookOpen,
    Clock,
    FileText,
    HelpCircle,
    Info,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    UserCheck,
    Users,
} from 'lucide-react';
import { HeroBanner } from '@/components/hero-banner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { BreadcrumbItem } from '@/types';

interface FAQ {
    question: string;
    answer: string;
}

interface Helpdesk {
    instansi: string;
    bidang: string;
    alamat: string;
    email: string;
    telepon: string;
    jam_layanan: string;
}

interface Props {
    userRoles: string[];
    faqList: FAQ[];
    kontakHelpdesk: Helpdesk;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Panduan & Helpdesk',
        href: '/panduan',
    },
];

export default function PanduanIndex({ userRoles, faqList, kontakHelpdesk }: Props) {
    const isPendamping = userRoles.includes('pendamping');
    const isPenilai = userRoles.includes('tim_penilai');
    const isPimpinan = userRoles.includes('pimpinan');

    const defaultTab = isPenilai
        ? 'penilai'
        : isPendamping
            ? 'pendamping'
            : isPimpinan
                ? 'pimpinan'
                : 'inovator';

    return (
        <>
            <Head title="Panduan Pengguna & Helpdesk INOVA-HUB" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full pb-16">
                {/* Header Hero Banner */}
                <HeroBanner
                    badgeIcon={BookOpen}
                    badgeText="Knowledge Base & Helpdesk"
                    title="Panduan Pengguna & Bantuan INOVA-HUB"
                    description="Petunjuk penggunaan aplikasi, alur pembinaan & pendampingan 8 langkah, FAQ IGA 2026, dan kontak bantuan Bidang Riset & Inovasi Daerah BAPPERIDA Kab. Sumbawa."
                >
                    <div className="flex flex-wrap gap-1.5">
                        {userRoles.map((role) => (
                            <Badge key={role} variant="outline" className="capitalize text-xs font-semibold px-3 py-1 bg-background/20 text-primary-foreground border-primary-foreground/20">
                                Role: {role.replace('_', ' ')}
                            </Badge>
                        ))}
                    </div>
                </HeroBanner>

                {/* Banner Alur Status 8 Langkah */}
                <Card className="bg-primary/5 border-primary/20 shadow-xs">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2 text-primary">
                            <Info className="h-5 w-5" />
                            Alur Validasi Berjenjang 8 Langkah (TOR §5)
                        </CardTitle>
                        <CardDescription>
                            Perjalanan status satu data inovasi sebelum dikirim ke sistem resmi Kemendagri:
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
                            <div className="p-2 bg-background rounded-lg border flex flex-col items-center">
                                <span className="font-bold text-muted-foreground">1. Draft</span>
                                <span className="text-[10px] text-muted-foreground mt-1">Inovator</span>
                            </div>
                            <div className="p-2 bg-background rounded-lg border flex flex-col items-center">
                                <span className="font-bold text-primary">2. Diajukan</span>
                                <span className="text-[10px] text-muted-foreground mt-1">Inovator</span>
                            </div>
                            <div className="p-2 bg-background rounded-lg border flex flex-col items-center">
                                <span className="font-bold text-primary">3. Divalidasi</span>
                                <span className="text-[10px] text-muted-foreground mt-1">Pendamping</span>
                            </div>
                            <div className="p-2 bg-background rounded-lg border flex flex-col items-center">
                                <span className="font-bold text-destructive">4a. Revisi</span>
                                <span className="text-[10px] text-muted-foreground mt-1">Inovator</span>
                            </div>
                            <div className="p-2 bg-background rounded-lg border flex flex-col items-center">
                                <span className="font-bold text-primary">4b. Disetujui</span>
                                <span className="text-[10px] text-muted-foreground mt-1">Pendamping</span>
                            </div>
                            <div className="p-2 bg-background rounded-lg border flex flex-col items-center">
                                <span className="font-bold text-primary">5. Disahkan OPD</span>
                                <span className="text-[10px] text-muted-foreground mt-1">Verifikator OPD</span>
                            </div>
                            <div className="p-2 bg-background rounded-lg border flex flex-col items-center">
                                <span className="font-bold text-indigo-600">6. Review Internal</span>
                                <span className="text-[10px] text-muted-foreground mt-1">Tim Penilai</span>
                            </div>
                            <div className="p-2 bg-background rounded-lg border flex flex-col items-center">
                                <span className="font-bold text-purple-600">7-8. Siap Kirim</span>
                                <span className="text-[10px] text-muted-foreground mt-1">BAPPERIDA</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs Panduan Per Role */}
                <Tabs defaultValue={defaultTab} className="w-full space-y-4">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                        <TabsTrigger value="inovator" className="gap-1.5 text-xs">
                            <FileText className="h-4 w-4" />
                            Inovator
                        </TabsTrigger>
                        <TabsTrigger value="pendamping" className="gap-1.5 text-xs">
                            <UserCheck className="h-4 w-4" />
                            Pendamping
                        </TabsTrigger>
                        <TabsTrigger value="penilai" className="gap-1.5 text-xs">
                            <ShieldCheck className="h-4 w-4" />
                            Tim Penilai
                        </TabsTrigger>
                        <TabsTrigger value="pimpinan" className="gap-1.5 text-xs">
                            <Users className="h-4 w-4" />
                            Pimpinan
                        </TabsTrigger>
                        <TabsTrigger value="faq" className="gap-1.5 text-xs">
                            <HelpCircle className="h-4 w-4" />
                            FAQ & Bantuan
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB INOVATOR */}
                    <TabsContent value="inovator">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg text-foreground">
                                    Panduan Penggunaan untuk Inovator (OPD & Masyarakat)
                                </CardTitle>
                                <CardDescription>
                                    Langkah-langkah pengisian profil inovasi, pengunggahan dokumen dukung, serta perbaikan revisi.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">01</span>
                                        Input Profil Inovasi Baru
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                                        Klik menu <strong>"Inovasi Saya"</strong> &rarr; <strong>"Tambah Inovasi"</strong>. Lengkapi form 4 tahap meliputi identitas, klasifikasi urusan utama/wajib, titik koordinat geografis Sumbawa, serta linimasa waktu uji coba & penerapan resmi. Simpan sebagai <strong>Draft</strong> terlebih dahulu.
                                    </p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">02</span>
                                        Pengunggahan Dokumen Dukung
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                                        Buka detail inovasi Anda, lalu unggah dokumen pendukung seperti Proposal, SK penetapan, Piagam Penghargaan, Dokumentasi/Video, serta Anggaran. Pastikan file dalam format PDF/JPG/PNG dengan ukuran maksimal 10MB.
                                    </p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">03</span>
                                        Pengajuan Validasi & Perbaikan Revisi
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                                        Jika data telah lengkap, tekan tombol <strong>"Ajukan Validasi"</strong>. Pendamping Inovasi binaan Anda akan menerima notifikasi otomatis. Jika Pendamping meminta revisi, periksa catatan revisi di detail inovasi dan perbaiki sesuai arahan sebelum mengajukan ulang.
                                    </p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">04</span>
                                        Fitur "Ajukan Kembali" dari Arsip Periode Lama
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                                        Untuk inovasi periode lalu yang tersimpan di Arsip, Anda dapat memilih tombol <strong>"Ajukan Kembali"</strong>. Sistem akan menyalin data profil ke periode berjalan. Anda wajib mengisi kolom <strong>"Penjelasan Pengembangan dari Versi Sebelumnya"</strong> untuk memperbarui inovasi di tahun berjalan.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB PENDAMPING */}
                    <TabsContent value="pendamping">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg text-foreground">
                                    Panduan Penggunaan untuk Pendamping Inovasi & Verifikator OPD
                                </CardTitle>
                                <CardDescription>
                                    Tata cara verifikasi mutu data inovasi, pemberian catatan revisi, dan pengesahan OPD.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">01</span>
                                        Memeriksa Daftar Antrean Validasi
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                                        Buka menu <strong>"Antrean Validasi"</strong>. Pilih inovasi yang berstatus <em>"Diajukan Validasi"</em>. Klik <strong>"Mulai Validasi"</strong> untuk meninjau kelengkapan profil dan dokumen dukung.
                                    </p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">02</span>
                                        Menyetujui atau Meminta Revisi
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                                        Gunakan checklist verifikasi. Jika ada dokumen/data kurang lengkap, beri catatan revisi spesifik pada kolom yang tersedia dan tekan <strong>"Minta Revisi"</strong>. Jika sudah sesuai, klik <strong>"Setujui Data"</strong>.
                                    </p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">03</span>
                                        Pengesahan OPD (Verifikator OPD)
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                                        Setelah data divalidasi oleh Pendamping, Kepala OPD / Verifikator OPD melakukan tombol <strong>"Disahkan OPD"</strong> sebagai pengesahan representasi resmi Perangkat Daerah.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB TIM PENILAI */}
                    <TabsContent value="penilai">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg text-foreground">
                                    Panduan Penggunaan untuk Tim Penilai & Superadmin BAPPERIDA
                                </CardTitle>
                                <CardDescription>
                                    Instruksi skoring SPD/SID, simulasi IID, kelola master indikator/periode, dan ekspor Kemendagri.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">01</span>
                                        Skoring SPD & SID Internal
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                                        Buka menu <strong>"Penilaian Skoring"</strong>. Pilih indikator SPD (Satuan Pemerintahan Daerah) & SID (Satuan Inovasi Daerah). Pilih tier parameter P1/P2/P3 yang dicapai. Sistem akan menghitung skor otomatis secara real-time.
                                    </p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">02</span>
                                        Simulasi Skoring IID (What-If Analysis)
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                                        Buka menu <strong>"Simulasi IID"</strong>. Lakukan uji coba skenario penambahan/pengurangan inovasi atau perubahan status untuk memprediksi kategori skor akhir daerah (Sangat Inovatif, Inovatif, Kurang Inovatif).
                                    </p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">03</span>
                                        Ekspor Data Kemendagri & Cetak Profil
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                                        Gunakan menu <strong>"Ekspor Laporan"</strong> untuk mengunduh berkas format resmi Kemendagri (Excel/CSV/JSON) untuk disalin ke sistem pusat, serta mencetak lembar Profil Inovasi Daerah.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB PIMPINAN */}
                    <TabsContent value="pimpinan">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg text-foreground">
                                    Panduan untuk Pimpinan Daerah (Bupati / Wabup / Sekda)
                                </CardTitle>
                                <CardDescription>
                                    Fitur pemantauan dashboard eksekutif read-only secara real-time.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Alert className="bg-primary/5">
                                    <Info className="h-4 w-4" />
                                    <AlertTitle className="text-xs font-bold">Akses Executive Dashboard Read-Only</AlertTitle>
                                    <AlertDescription className="text-xs text-muted-foreground">
                                        Pimpinan Daerah dapat memantau seluruh progres inovasi per OPD, persentase pemenuhan 6 urusan wajib pelayanan dasar, serta prediksi skor Indeks Inovasi Daerah (IID) Kabupaten Sumbawa secara langsung tanpa perlu melakukan input data teknis.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB FAQ & HELPDESK */}
                    <TabsContent value="faq">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <HelpCircle className="h-5 w-5 text-primary" />
                                            Pertanyaan Sering Diajukan (FAQ)
                                        </CardTitle>
                                        <CardDescription>
                                            Jawaban atas pertanyaan seputar penggunaan INOVA-HUB dan penilaian IGA 2026.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {faqList.map((faq, index) => (
                                            <div key={index} className="rounded-lg border p-4 bg-card space-y-1.5">
                                                <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                                                        {index + 1}
                                                    </span>
                                                    {faq.question}
                                                </h4>
                                                <p className="text-xs text-muted-foreground leading-relaxed pl-7">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Helpdesk Contact Box */}
                            <div>
                                <Card className="border-primary/30 shadow-xs">
                                    <CardHeader className="bg-primary/5 pb-3">
                                        <CardTitle className="text-base font-bold text-primary flex items-center gap-2">
                                            <Mail className="h-5 w-5" />
                                            Pusat Bantuan Helpdesk
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            BAPPERIDA Kabupaten Sumbawa
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-4 text-xs">
                                        <div className="space-y-1">
                                            <span className="font-semibold text-foreground block">{kontakHelpdesk.instansi}</span>
                                            <span className="text-muted-foreground block">{kontakHelpdesk.bidang}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-start gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                                            <span>{kontakHelpdesk.alamat}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-4 w-4 shrink-0 text-primary" />
                                            <a href={`mailto:${kontakHelpdesk.email}`} className="hover:underline text-primary">
                                                {kontakHelpdesk.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="h-4 w-4 shrink-0 text-primary" />
                                            <span>{kontakHelpdesk.telepon}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4 shrink-0 text-primary" />
                                            <span>{kontakHelpdesk.jam_layanan}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

PanduanIndex.layout = {
    breadcrumbs,
};
