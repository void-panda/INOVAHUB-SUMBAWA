import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Award,
    BookOpen,
    CheckCircle2,
    ChevronRight,
    FileText,
    LogIn,
    ShieldCheck,
    Sparkles,
    UserPlus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';
import type { Auth } from '@/types';

// Kemang Satange SVG Motif Overlay for Hero & Sections
const KemangSatangeMotif = ({ className = 'opacity-10' }: { className?: string }) => (
    <svg
        className={`absolute right-0 top-0 bottom-0 h-full w-auto max-w-[55%] pointer-events-none text-current fill-current select-none ${className}`}
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
    >
        <g transform="translate(260, 100) scale(1.15)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <g key={angle} transform={`rotate(${angle})`}>
                    <path d="M0 0 C-10 -30 -25 -50 0 -80 C25 -50 10 -30 0 0" />
                    <circle cx="0" cy="-45" r="4" fill="currentColor" />
                    <path d="M-5 -25 L0 -35 L5 -25 L0 -15 Z" />
                </g>
            ))}
            <circle cx="0" cy="0" r="22" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="0" cy="0" r="55" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            <polygon points="0,-85 60,-60 85,0 60,60 0,85 -60,60 -85,0 -60,-60" fill="none" stroke="currentColor" strokeWidth="2" />
        </g>
        <g transform="translate(370, 35) scale(0.65)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <g key={angle} transform={`rotate(${angle})`}>
                    <path d="M0 0 C-10 -30 -25 -50 0 -80 C25 -50 10 -30 0 0" />
                </g>
            ))}
            <circle cx="0" cy="0" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
        </g>
    </svg>
);

interface AlurStep {
    step: number;
    no: string;
    title: string;
    status: string;
    phase: string;
    actor: string;
    desc: string;
    output: string;
}

export default function Welcome() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [activeStep, setActiveStep] = useState<number>(1);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const alurTahapan: AlurStep[] = [
        {
            step: 1,
            no: '01',
            title: 'Draft Inovasi',
            status: 'draft',
            phase: 'Fase 1: Inisiasi Usulan',
            actor: 'Inovator (OPD / Masyarakat)',
            desc: 'Inovator mengisi profil 22 parameter, rancang bangun inovasi (minimal 300 kata), serta mengunggah dokumen pendukung umum (proposal & piagam).',
            output: 'Profil usulan & dokumen dukung tersimpan',
        },
        {
            step: 2,
            no: '02',
            title: 'Diajukan',
            status: 'diajukan',
            phase: 'Fase 1: Inisiasi Usulan',
            actor: 'Inovator',
            desc: 'Usulan inovasi diserahkan secara resmi untuk memasuki antrean validasi berjenjang oleh Pendamping Inovasi.',
            output: 'Tercatat dalam antrean verifikasi mutu',
        },
        {
            step: 3,
            no: '03',
            title: 'Divalidasi',
            status: 'divalidasi',
            phase: 'Fase 2: Pendampingan & Verifikasi',
            actor: 'Pendamping Inovasi',
            desc: 'Pendamping Inovasi memeriksa keabsahan berkas, petunjuk teknis bukti dukung 20 Indikator SID, dan kesesuaian parameter P1/P2/P3.',
            output: 'Pemeriksaan kepatuhan 20 Indikator SID',
        },
        {
            step: 4,
            no: '04',
            title: 'Revisi / Disetujui',
            status: 'revisi / disetujui',
            phase: 'Fase 2: Pendampingan & Verifikasi',
            actor: 'Inovator & Pendamping',
            desc: 'Jika terdapat kekurangan, pendamping memberikan catatan spesifik per-field. Jika telah lengkap, usulan disetujui dan siap diteruskan.',
            output: 'Catatan koreksi atau rekomendasi persetujuan',
        },
        {
            step: 5,
            no: '05',
            title: 'Disahkan OPD',
            status: 'disahkan_opd',
            phase: 'Fase 2: Pendampingan & Verifikasi',
            actor: 'Kepala / Verifikator OPD',
            desc: 'Kepala Perangkat Daerah atau pejabat berwenang menerbitkan pengesahan resmi dan mengonfirmasi pernyataan tanggung jawab mutlak (SPTJM).',
            output: 'Persetujuan resmi & konfirmasi SPTJM OPD',
        },
        {
            step: 6,
            no: '06',
            title: 'Review Internal',
            status: 'review_internal',
            phase: 'Fase 3: Evaluasi Tim Penilai',
            actor: 'Tim Penilai Internal',
            desc: 'Tim Penilai mengaudit skor kematangan SPD & SID, simulasi skor daerah, serta kepatuhan 6 Urusan Wajib Pelayanan Dasar.',
            output: 'Skoring SPD/SID & verifikasi 6 Urusan Yandas',
        },
        {
            step: 7,
            no: '07',
            title: 'Siap Kirim',
            status: 'siap_kirim',
            phase: 'Fase 3: Evaluasi Tim Penilai & BAPPERIDA',
            actor: 'Superadmin BAPPERIDA',
            desc: 'Inovasi dinyatakan matang secara substantif dan administratif, lolos quality-assurance gate daerah, dan data dikunci untuk pelaporan.',
            output: 'Data terkunci & paket ekspor siap transfer',
        },
        {
            step: 8,
            no: '08',
            title: 'Terkirim Pusat',
            status: 'terkirim',
            phase: 'Fase 4: Integrasi Nasional',
            actor: 'BAPPERIDA & Kemendagri',
            desc: 'Data inovasi Kabupaten Sumbawa disinkronkan ke sistem resmi Indeks Inovasi Daerah BSKDN Kemendagri untuk penilaian IGA 2026.',
            output: 'Tersinkronisasi di sistem pusat Kemendagri',
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-teal-500/20 selection:text-teal-700 dark:selection:text-teal-300">
            <Head title="INOVA-HUB - Pembinaan Terintegrasi Inovasi Pelayanan Publik Kab. Sumbawa" />

            {/* Skip to Main Content (WCAG 2.4.1 Bypass Blocks) */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-primary focus:text-primary-foreground focus:font-semibold focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-ring focus:outline-hidden"
            >
                Lewati ke konten utama
            </a>

            {/* Top Navigation */}
            <header
                className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                    isScrolled
                        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-border/80 shadow-xs'
                        : 'bg-transparent border-b border-teal-600/30 backdrop-blur-xs'
                }`}
            >
                <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Brand Link */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-lg p-1.5 -ml-1.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary group"
                        aria-label="INOVA-HUB Kabupaten Sumbawa - Beranda"
                    >
                        <div
                            className={`flex aspect-square size-9 items-center justify-center rounded-lg transition-all ${
                                isScrolled
                                    ? 'bg-primary text-primary-foreground shadow-2xs'
                                    : 'bg-white/15 text-white border border-white/25 shadow-xs backdrop-blur-xs'
                            }`}
                        >
                            <AppLogoIcon className="size-6 text-current" aria-hidden="true" />
                        </div>
                        <div className="grid text-left">
                            <span
                                className={`font-bold text-base tracking-tight leading-none transition-colors ${
                                    isScrolled
                                        ? 'text-teal-700 dark:text-teal-300'
                                        : 'text-white'
                                }`}
                            >
                                INOVA-HUB
                            </span>
                            <span
                                className={`text-[11px] font-medium mt-0.5 leading-tight transition-colors ${
                                    isScrolled
                                        ? 'text-muted-foreground'
                                        : 'text-teal-100/85'
                                }`}
                            >
                                BAPPERIDA Kab. Sumbawa
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Actions */}
                    <nav aria-label="Navigasi Utama" className="flex items-center gap-2 sm:gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className={`text-xs hidden sm:inline-flex focus-visible:ring-2 focus-visible:ring-primary transition-colors ${
                                isScrolled
                                    ? 'text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-800'
                                    : 'text-white hover:bg-white/15 hover:text-white'
                            }`}
                        >
                            <Link href="/panduan">
                                <BookOpen
                                    className={`h-4 w-4 mr-1.5 ${
                                        isScrolled ? 'text-primary' : 'text-teal-200'
                                    }`}
                                    aria-hidden="true"
                                />
                                Panduan & Regulasi
                            </Link>
                        </Button>

                        {auth.user ? (
                            <Button
                                size="sm"
                                asChild
                                className={`text-xs gap-1.5 shadow-2xs font-semibold focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                                    isScrolled
                                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                        : 'bg-white hover:bg-teal-50 text-teal-900 font-bold shadow-md'
                                }`}
                            >
                                <Link href={dashboard()}>
                                    Buka Dashboard <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </Link>
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className={`text-xs focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                                        isScrolled
                                            ? 'border-input text-teal-700 dark:text-teal-300 hover:bg-accent'
                                            : 'bg-white/10 hover:bg-white/20 text-white border-white/30'
                                    }`}
                                >
                                    <Link href={login()}>
                                        <LogIn className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" /> Masuk
                                    </Link>
                                </Button>
                                <Button
                                    size="sm"
                                    asChild
                                    className={`text-xs font-semibold focus-visible:ring-2 focus-visible:ring-primary transition-all ${
                                        isScrolled
                                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xs'
                                            : 'bg-white hover:bg-teal-50 text-teal-900 font-bold shadow-md'
                                    }`}
                                >
                                    <Link href={register()}>
                                        <UserPlus className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" /> Daftar Akun
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            {/* Main Content Area */}
            <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-hidden -mt-16">
                {/* Hero Banner Section (Teal Signature Gradient + Motif Kemang Satange) */}
                <section
                    aria-labelledby="hero-title"
                    className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-950 text-white pt-24 pb-16 md:pt-32 md:pb-24 border-b border-teal-600/30"
                >
                    <KemangSatangeMotif className="opacity-15 text-white" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="max-w-3xl space-y-6">
                            {/* Official Badge */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-teal-100 text-xs font-semibold">
                                <Award className="h-4 w-4 text-amber-300 shrink-0" aria-hidden="true" />
                                <span>Portal Resmi Penjaminan Mutu IGA 2026 • Kabupaten Sumbawa</span>
                            </div>

                            {/* Headline */}
                            <h1
                                id="hero-title"
                                className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.18]"
                            >
                                INOVA-HUB <br />
                                <span className="text-teal-200 text-2xl sm:text-3xl md:text-4xl font-bold">
                                    Pembinaan Terintegrasi Inovasi Pelayanan Publik
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-sm md:text-base text-teal-50/90 leading-relaxed max-w-2xl">
                                Sistem penjaminan mutu dan pendampingan berjenjang Pemerintah Kabupaten Sumbawa untuk menjaring, memvalidasi 20 indikator kematangan, dan mengoptimalkan skor <strong>Indeks Inovasi Daerah (IID)</strong> sebelum pelaporan ke Kementerian Dalam Negeri.
                            </p>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 pt-2 flex-wrap">
                                {auth.user ? (
                                    <Button
                                        size="lg"
                                        asChild
                                        className="text-sm font-bold gap-2 h-11 px-6 bg-white text-teal-950 hover:bg-teal-50 shadow-md focus-visible:ring-2 focus-visible:ring-white"
                                    >
                                        <Link href={dashboard()}>
                                            Menuju Dashboard Kerja <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            size="lg"
                                            asChild
                                            className="text-sm font-bold gap-2 h-11 px-6 bg-white text-teal-950 hover:bg-teal-50 shadow-md focus-visible:ring-2 focus-visible:ring-white"
                                        >
                                            <Link href={login()}>
                                                Masuk ke Sistem <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            asChild
                                            className="text-sm font-semibold h-11 px-6 bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white"
                                        >
                                            <Link href="/panduan">
                                                <FileText className="h-4 w-4 mr-1.5" aria-hidden="true" /> Pelajari Petunjuk Teknis
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Quick Highlight Strips */}
                            <div className="pt-4 border-t border-white/15 grid grid-cols-3 gap-4 max-w-lg text-xs">
                                <div>
                                    <span className="text-white font-bold block text-sm sm:text-base">20 Indikator</span>
                                    <span className="text-teal-200/80 text-[11px]">Satuan Inovasi SID</span>
                                </div>
                                <div>
                                    <span className="text-white font-bold block text-sm sm:text-base">8 Langkah</span>
                                    <span className="text-teal-200/80 text-[11px]">Validasi Berjenjang</span>
                                </div>
                                <div>
                                    <span className="text-white font-bold block text-sm sm:text-base">6 Urusan</span>
                                    <span className="text-teal-200/80 text-[11px]">Wajib Yandas IGA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Accessible Footer */}
            <footer className="border-t bg-card py-8 text-xs text-muted-foreground">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="size-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-[10px] shadow-2xs">
                            <AppLogoIcon className="size-4 text-primary-foreground" aria-hidden="true" />
                        </div>
                        <span>
                            <strong>INOVA-HUB</strong> • Bidang Riset dan Inovasi Daerah (BAPPERIDA) Kab. Sumbawa
                        </span>
                    </div>
                    <div className="text-center sm:text-right">
                        Pedoman Teknis Innovative Government Award (IGA) 2026
                    </div>
                </div>
            </footer>
        </div>
    );
}

