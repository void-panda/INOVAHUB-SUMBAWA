import { useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    CheckCircle2,
    Info,
    Landmark,
    Lock,
    Mail,
    RotateCw,
    ShieldCheck,
    Sparkles,
    UserCheck,
    UserPlus,
    Users,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { home, login } from '@/routes';
import { store } from '@/routes/register';

type OpdItem = {
    id: number;
    nama: string;
    kode: string | null;
};

type Props = {
    passwordRules: string;
    captchaQuestion?: string;
    opdList?: OpdItem[];
};

// Kemang Satange SVG Motif Overlay for Hero Banner
const KemangSatangeMotif = ({ className = 'opacity-10' }: { className?: string }) => (
    <svg
        className={`absolute right-0 top-0 bottom-0 h-full w-auto max-w-[60%] pointer-events-none fill-current select-none ${className}`}
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
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

export default function Register({ passwordRules, captchaQuestion, opdList = [] }: Props) {
    const [tipeInovator, setTipeInovator] = useState<'dinas' | 'masyarakat'>('dinas');
    const [selectedOpdId, setSelectedOpdId] = useState<string>('');
    const [customOpdName, setCustomOpdName] = useState<string>('');
    const [masyarakatAsal, setMasyarakatAsal] = useState<string>('');
    const [question, setQuestion] = useState(captchaQuestion || 'Berapa 5 + 3?');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const selectedOpdObj = opdList.find((o) => String(o.id) === selectedOpdId);
    const resolvedOpdName = selectedOpdObj ? selectedOpdObj.nama : '';

    const refreshCaptcha = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch('/captcha/refresh');
            const data = await res.json();
            if (data.question) {
                setQuestion(data.question);
            }
        } catch (e) {
            console.error('Gagal memperbarui CAPTCHA', e);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="bg-muted/40 min-h-screen py-10 px-4 sm:px-6 flex flex-col justify-center items-center">
            <Head title="Pendaftaran Akun Inovator - INOVA-HUB" />

            <div className="w-full max-w-2xl flex flex-col gap-6">
                {/* Header Logo */}
                <div className="flex flex-col items-center gap-2">
                    <Link
                        href={home()}
                        className="flex items-center gap-2.5 font-semibold text-foreground hover:opacity-90 transition-opacity"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700 dark:text-teal-400 border border-teal-500/20 shadow-sm">
                            <AppLogoIcon className="size-6 fill-current" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-lg font-bold tracking-tight">INOVA-HUB</span>
                            <span className="text-xs text-muted-foreground -mt-1 font-normal">Kabupaten Sumbawa</span>
                        </div>
                    </Link>
                </div>

                {/* Card Form */}
                <Card className="rounded-2xl border-border/70 shadow-xl shadow-teal-950/5 overflow-hidden p-0 gap-0">
                    {/* Header Banner Kemang Satange INOVA-HUB */}
                    <div className="relative bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-800 text-white p-6 sm:p-8 overflow-hidden">
                        <KemangSatangeMotif className="opacity-15 text-white" />
                        <div className="relative z-10 space-y-2">
                            <Badge className="bg-teal-500/25 hover:bg-teal-500/35 text-teal-100 border-teal-400/30 text-xs px-2.5 py-0.5 font-medium inline-flex items-center gap-1.5 backdrop-blur-sm">
                                <ShieldCheck className="size-3.5" />
                                Pendaftaran Akun Inovator Daerah
                            </Badge>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                                Registrasi Akun Inovator
                            </h1>
                            <p className="text-teal-100/90 text-sm max-w-xl leading-relaxed">
                                Pilih kategori pendaftar di bawah ini untuk mengumpulkan, mengelola, dan memverifikasi data inovasi pelayanan publik Kabupaten Sumbawa.
                            </p>
                        </div>
                    </div>

                    <CardContent className="p-6 sm:p-8">
                        {/* Selector Jalur Pendaftar: Perangkat Daerah vs Masyarakat */}
                        <div className="mb-6 space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Kategori Pendaftar Inovasi
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-muted/60 rounded-xl border border-border/70">
                                <button
                                    type="button"
                                    onClick={() => setTipeInovator('dinas')}
                                    className={cn(
                                        'flex items-start gap-3 p-3 rounded-lg text-left transition-all border cursor-pointer',
                                        tipeInovator === 'dinas'
                                            ? 'bg-background text-foreground border-teal-600/40 shadow-sm ring-2 ring-teal-600/20'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-background/50'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'p-2 rounded-lg shrink-0 mt-0.5',
                                            tipeInovator === 'dinas'
                                                ? 'bg-teal-600/10 text-teal-700 dark:text-teal-400'
                                                : 'bg-muted text-muted-foreground'
                                        )}
                                    >
                                        <Building2 className="size-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-semibold flex items-center gap-1.5">
                                            Perangkat Daerah (OPD)
                                            {tipeInovator === 'dinas' && (
                                                <CheckCircle2 className="size-3.5 text-teal-600 dark:text-teal-400" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-normal">
                                            Dinas, Badan, Kantor, Kecamatan, Puskesmas & Unit Pemda
                                        </p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setTipeInovator('masyarakat')}
                                    className={cn(
                                        'flex items-start gap-3 p-3 rounded-lg text-left transition-all border cursor-pointer',
                                        tipeInovator === 'masyarakat'
                                            ? 'bg-background text-foreground border-teal-600/40 shadow-sm ring-2 ring-teal-600/20'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-background/50'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'p-2 rounded-lg shrink-0 mt-0.5',
                                            tipeInovator === 'masyarakat'
                                                ? 'bg-teal-600/10 text-teal-700 dark:text-teal-400'
                                                : 'bg-muted text-muted-foreground'
                                        )}
                                    >
                                        <Users className="size-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-semibold flex items-center gap-1.5">
                                            Masyarakat Umum
                                            {tipeInovator === 'masyarakat' && (
                                                <CheckCircle2 className="size-3.5 text-teal-600 dark:text-teal-400" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-normal">
                                            Warga, Kampus, Komunitas, UMKM, Sanggar & Desa
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'password_confirmation', 'captcha_input']}
                            disableWhileProcessing
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Hidden fields for backend handling */}
                                    <input type="hidden" name="tipe_inovator" value={tipeInovator} />
                                    <input
                                        type="hidden"
                                        name="opd_id"
                                        value={tipeInovator === 'dinas' && selectedOpdId !== 'custom' ? selectedOpdId : ''}
                                    />

                                    {/* Context-aware notification for Masyarakat */}
                                    {tipeInovator === 'masyarakat' && (
                                        <div className="p-3.5 bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60 rounded-xl text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
                                            <Sparkles className="size-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                                            <div className="space-y-0.5">
                                                <span className="font-semibold">Terbuka untuk Inovasi Non-Pemerintah</span>
                                                <p className="text-teal-800/85 dark:text-teal-300/85 leading-relaxed">
                                                    Inisiatif masyarakat, riset kampus, inovasi desa, dan teknologi tepat guna akan diverifikasi serta berpeluang diikutsertakan dalam ajang Innovative Government Award (IGA).
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                        {/* JALUR OPD: Form Fields */}
                                        {tipeInovator === 'dinas' ? (
                                            <>
                                                {/* Nama PIC / Pengelola OPD */}
                                                <div className="grid gap-2 sm:col-span-2">
                                                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1.5">
                                                        <UserCheck className="size-3.5 text-muted-foreground" />
                                                        Nama Lengkap Pengelola / PIC Inovasi
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="name"
                                                        name="name"
                                                        placeholder="Contoh: Budi Pratama, S.Kom"
                                                        className="h-10"
                                                    />
                                                    <InputError message={errors.name} />
                                                </div>

                                                {/* Pilihan Perangkat Daerah (OPD) */}
                                                <div className="grid gap-2 sm:col-span-2">
                                                    <Label htmlFor="opd_select" className="text-sm font-medium flex items-center justify-between">
                                                        <span className="flex items-center gap-1.5">
                                                            <Building2 className="size-3.5 text-muted-foreground" />
                                                            Nama Perangkat Daerah / Instansi
                                                        </span>
                                                        <span className="text-xs text-muted-foreground font-normal">
                                                            Pilih dari daftar resmi
                                                        </span>
                                                    </Label>

                                                    <Select
                                                        value={selectedOpdId}
                                                        onValueChange={(val) => {
                                                            setSelectedOpdId(val);
                                                        }}
                                                    >
                                                        <SelectTrigger id="opd_select" className="h-10 w-full text-sm">
                                                            <SelectValue placeholder="-- Pilih Perangkat Daerah Resmi Kab. Sumbawa --" />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-72">
                                                            {opdList.map((opd) => (
                                                                <SelectItem key={opd.id} value={String(opd.id)} className="text-sm">
                                                                    <div className="flex items-center justify-between gap-2 w-full">
                                                                        <span>{opd.nama}</span>
                                                                        {opd.kode && (
                                                                            <span className="text-xs text-muted-foreground font-mono">
                                                                                [{opd.kode}]
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                            <SelectItem value="custom" className="text-sm font-medium text-teal-700 dark:text-teal-400">
                                                                + Unit Kerja / Lembaga Lainnya (Ketik Manual)
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>

                                                    {/* Hidden input for nama_pemda when selecting from standard list */}
                                                    {selectedOpdId !== 'custom' && (
                                                        <input type="hidden" name="nama_pemda" value={resolvedOpdName} />
                                                    )}

                                                    {/* Manual entry fallback if 'custom' is selected */}
                                                    {selectedOpdId === 'custom' && (
                                                        <div className="mt-2 space-y-1.5">
                                                            <Input
                                                                id="custom_nama_pemda"
                                                                name="nama_pemda"
                                                                type="text"
                                                                required
                                                                value={customOpdName}
                                                                onChange={(e) => setCustomOpdName(e.target.value)}
                                                                placeholder="Tuliskan nama instansi/unit (Contoh: Puskesmas Alas Barat / Bagian Organisasi Setda)"
                                                                className="h-10"
                                                            />
                                                            <p className="text-xs text-muted-foreground">
                                                                Masukkan nama unit kerja atau kecamatan jika belum tercantum pada daftar utama di atas.
                                                            </p>
                                                        </div>
                                                    )}

                                                    {selectedOpdObj && (
                                                        <div className="flex items-center gap-2 text-xs text-teal-700 dark:text-teal-400 bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-900/60 px-3 py-1.5 rounded-lg">
                                                            <CheckCircle2 className="size-3.5 shrink-0" />
                                                            <span>
                                                                Unit resmi terpilih: <strong>{selectedOpdObj.nama}</strong>
                                                            </span>
                                                        </div>
                                                    )}

                                                    <InputError message={errors.nama_pemda} />
                                                </div>

                                                {/* Jabatan / Unit Kerja (pekerjaan) */}
                                                <div className="grid gap-2 sm:col-span-2">
                                                    <Label htmlFor="pekerjaan" className="text-sm font-medium flex items-center justify-between">
                                                        <span className="flex items-center gap-1.5">
                                                            <Briefcase className="size-3.5 text-muted-foreground" />
                                                            Jabatan / Bidang Penugasan
                                                        </span>
                                                        <span className="text-xs text-muted-foreground font-normal">(Opsional)</span>
                                                    </Label>
                                                    <Input
                                                        id="pekerjaan"
                                                        type="text"
                                                        tabIndex={2}
                                                        name="pekerjaan"
                                                        placeholder="Contoh: Kasubag Perencanaan / Staf Pengelola Inovasi"
                                                        className="h-10"
                                                    />
                                                    <InputError message={errors.pekerjaan} />
                                                </div>
                                            </>
                                        ) : (
                                            /* JALUR MASYARAKAT: Form Fields */
                                            <>
                                                {/* Nama Lengkap Inovator */}
                                                <div className="grid gap-2 sm:col-span-2">
                                                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1.5">
                                                        <UserCheck className="size-3.5 text-muted-foreground" />
                                                        Nama Lengkap Inovator
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="name"
                                                        name="name"
                                                        placeholder="Contoh: Muhammad Ilham"
                                                        className="h-10"
                                                    />
                                                    <InputError message={errors.name} />
                                                </div>

                                                {/* Asal Lembaga / Komunitas / Kampus / Desa */}
                                                <div className="grid gap-2 sm:col-span-2">
                                                    <Label htmlFor="nama_pemda" className="text-sm font-medium flex items-center gap-1.5">
                                                        <Landmark className="size-3.5 text-muted-foreground" />
                                                        Asal Lembaga / Komunitas / Kampus / Desa
                                                    </Label>
                                                    <Input
                                                        id="nama_pemda"
                                                        type="text"
                                                        required
                                                        tabIndex={2}
                                                        name="nama_pemda"
                                                        value={masyarakatAsal}
                                                        onChange={(e) => setMasyarakatAsal(e.target.value)}
                                                        placeholder="Contoh: Universitas Samawa / Desa Beru / Komunitas UMKM / Mandiri"
                                                        className="h-10"
                                                    />
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Info className="size-3.5 shrink-0" />
                                                        Tuliskan nama kampus, sekolah, sanggar, UMKM, nama desa domisili, atau ketik <strong>Mandiri</strong> jika perorangan.
                                                    </p>
                                                    <InputError message={errors.nama_pemda} />
                                                </div>

                                                {/* Profesi / Bidang Kegiatan */}
                                                <div className="grid gap-2 sm:col-span-2">
                                                    <Label htmlFor="pekerjaan" className="text-sm font-medium flex items-center gap-1.5">
                                                        <Briefcase className="size-3.5 text-muted-foreground" />
                                                        Profesi / Pekerjaan / Bidang Kegiatan
                                                    </Label>
                                                    <Input
                                                        id="pekerjaan"
                                                        type="text"
                                                        tabIndex={3}
                                                        name="pekerjaan"
                                                        placeholder="Contoh: Mahasiswa / Peneliti / Wiraswasta / Petani / Penggiat Lingkungan"
                                                        className="h-10"
                                                    />
                                                    <InputError message={errors.pekerjaan} />
                                                </div>
                                            </>
                                        )}

                                        {/* Email Aktif */}
                                        <div className="grid gap-2 sm:col-span-2">
                                            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
                                                <Mail className="size-3.5 text-muted-foreground" />
                                                Alamat Email Aktif
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                tabIndex={4}
                                                autoComplete="email"
                                                name="email"
                                                placeholder={
                                                    tipeInovator === 'dinas'
                                                        ? 'email.resmi@sumbawakab.go.id'
                                                        : 'email.aktif@gmail.com'
                                                }
                                                className="h-10"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Tautan verifikasi akun resmi akan dikirimkan ke alamat email ini setelah pendaftaran.
                                            </p>
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Password */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="password" className="text-sm font-medium flex items-center gap-1.5">
                                                <Lock className="size-3.5 text-muted-foreground" />
                                                Kata Sandi
                                            </Label>
                                            <PasswordInput
                                                id="password"
                                                required
                                                tabIndex={5}
                                                autoComplete="new-password"
                                                name="password"
                                                placeholder="Minimal 8 karakter"
                                                passwordrules={passwordRules}
                                                className="h-10"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation" className="text-sm font-medium flex items-center gap-1.5">
                                                <Lock className="size-3.5 text-muted-foreground" />
                                                Konfirmasi Kata Sandi
                                            </Label>
                                            <PasswordInput
                                                id="password_confirmation"
                                                required
                                                tabIndex={6}
                                                autoComplete="new-password"
                                                name="password_confirmation"
                                                placeholder="Ulangi kata sandi"
                                                passwordrules={passwordRules}
                                                className="h-10"
                                            />
                                            <InputError message={errors.password_confirmation} />
                                        </div>

                                        {/* CAPTCHA Field */}
                                        <div className="sm:col-span-2 grid gap-2.5 p-4 bg-muted/50 border border-border/80 rounded-xl">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="captcha_input" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                                    <ShieldCheck className="size-3.5 text-teal-600 dark:text-teal-400" />
                                                    Verifikasi Keamanan (CAPTCHA)
                                                </Label>
                                                <button
                                                    type="button"
                                                    onClick={refreshCaptcha}
                                                    disabled={isRefreshing}
                                                    className="inline-flex items-center gap-1 text-xs text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 transition-colors cursor-pointer disabled:opacity-50 font-medium"
                                                >
                                                    <RotateCw className={`size-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                                                    Ganti Soal
                                                </button>
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                                <div className="px-3.5 py-2 bg-background border border-border rounded-lg font-mono text-sm font-semibold tracking-wider text-center select-none shadow-xs text-foreground min-w-[140px]">
                                                    {question}
                                                </div>
                                                <div className="flex-1">
                                                    <Input
                                                        id="captcha_input"
                                                        type="number"
                                                        name="captcha_input"
                                                        required
                                                        tabIndex={7}
                                                        placeholder="Masukkan hasil perhitungan angka..."
                                                        className="h-10 bg-background text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <InputError message={errors.captcha_input} />
                                        </div>

                                        {/* Submit Button */}
                                        <div className="sm:col-span-2 pt-2">
                                            <Button
                                                type="submit"
                                                className="w-full h-11"
                                                tabIndex={8}
                                                data-test="register-user-button"
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <div className="flex items-center gap-2">
                                                        <Spinner className="size-4" />
                                                        <span>Mendaftarkan Akun...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <UserPlus className="size-4" />
                                                        <span>
                                                            {tipeInovator === 'dinas'
                                                                ? 'Daftar sebagai Inovator OPD'
                                                                : 'Daftar sebagai Inovator Masyarakat'}
                                                        </span>
                                                    </div>
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="pt-2 text-center text-sm text-muted-foreground border-t border-border/60">
                                        Sudah memiliki akun Inovator?{' '}
                                        <TextLink href={login()} tabIndex={9} className="font-semibold text-teal-700 dark:text-teal-400 hover:underline">
                                            Masuk di sini
                                        </TextLink>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                {/* Footer copyright */}
                <p className="text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} BAPPERIDA Kabupaten Sumbawa. Seluruh hak cipta dilindungi.
                </p>
            </div>
        </div>
    );
}

// Disable default single-column auth wrapper so Card Layout has full responsive width
Register.layout = null;
