import { useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import { Building2, Lock, Mail, RotateCw, ShieldCheck, UserCheck, UserPlus } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home, login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
    captchaQuestion?: string;
};

// Kemang Satange SVG Motif Overlay for Hero & Sections
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

export default function Register({ passwordRules, captchaQuestion }: Props) {
    const [question, setQuestion] = useState(captchaQuestion || 'Berapa 5 + 3?');
    const [isRefreshing, setIsRefreshing] = useState(false);

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
                                Registrasi Akun Baru
                            </h1>
                            <p className="text-teal-100/90 text-sm max-w-xl leading-relaxed">
                                Daftarkan akun resmi untuk Perangkat Daerah maupun Masyarakat Umum guna mengumpulkan, mengelola, dan memverifikasi data inovasi pelayanan publik.
                            </p>
                        </div>
                    </div>

                    <CardContent className="p-6 sm:p-8">
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'password_confirmation', 'captcha_input']}
                            disableWhileProcessing
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                        {/* Nama Lengkap */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1.5">
                                                <UserCheck className="size-3.5 text-muted-foreground" />
                                                Nama Lengkap
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

                                        {/* Nama Pemda / Instansi */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="nama_pemda" className="text-sm font-medium flex items-center gap-1.5">
                                                <Building2 className="size-3.5 text-muted-foreground" />
                                                Instansi / Perangkat Daerah / Asal
                                            </Label>
                                            <Input
                                                id="nama_pemda"
                                                type="text"
                                                required
                                                tabIndex={2}
                                                name="nama_pemda"
                                                placeholder="Contoh: Dinas Kesehatan / Umum"
                                                className="h-10"
                                            />
                                            <InputError message={errors.nama_pemda} />
                                        </div>

                                        {/* Email */}
                                        <div className="grid gap-2 sm:col-span-2">
                                            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
                                                <Mail className="size-3.5 text-muted-foreground" />
                                                Alamat Email Aktif
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                tabIndex={3}
                                                autoComplete="email"
                                                name="email"
                                                placeholder="email.aktif@sumbawakab.go.id"
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
                                                tabIndex={4}
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
                                                tabIndex={5}
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
                                                        tabIndex={6}
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
                                                tabIndex={7}
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
                                                        <span>Daftar Akun Inovator</span>
                                                    </div>
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="pt-2 text-center text-sm text-muted-foreground border-t border-border/60">
                                        Sudah memiliki akun Inovator?{' '}
                                        <TextLink href={login()} tabIndex={8} className="font-semibold text-teal-700 dark:text-teal-400 hover:underline">
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
