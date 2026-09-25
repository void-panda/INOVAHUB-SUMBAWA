import { useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import { CheckCircle2, Lock, LogIn, Mail, RotateCw, ShieldCheck } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home, register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    captchaQuestion?: string;
};

// Kemang Satange SVG Motif Overlay for Header Banner
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

export default function Login({ status, canResetPassword, captchaQuestion }: Props) {
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
            <Head title="Masuk ke Sistem - INOVA-HUB" />

            <div className="w-full max-w-lg flex flex-col gap-6">
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

                {/* Card Container */}
                <Card className="rounded-2xl border-border/70 shadow-xl shadow-teal-950/5 overflow-hidden p-0 gap-0">
                    {/* Header Banner Kemang Satange INOVA-HUB */}
                    <div className="relative bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-800 text-white p-6 sm:p-8 overflow-hidden">
                        <KemangSatangeMotif className="opacity-15 text-white" />
                        <div className="relative z-10 space-y-2">
                            <Badge className="bg-teal-500/25 hover:bg-teal-500/35 text-teal-100 border-teal-400/30 text-xs px-2.5 py-0.5 font-medium inline-flex items-center gap-1.5 backdrop-blur-sm">
                                <ShieldCheck className="size-3.5" />
                                Portal Akses Terpadu
                            </Badge>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                                Masuk ke Sistem
                            </h1>
                            <p className="text-teal-100/90 text-sm max-w-md leading-relaxed">
                                Silakan masuk menggunakan akun resmi Anda untuk mengelola dan memonitor inovasi daerah Kabupaten Sumbawa.
                            </p>
                        </div>
                    </div>

                    <CardContent className="p-6 sm:p-8 space-y-6">
                        {/* Status Alert Notification */}
                        {status && (
                            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                                <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                                <span>
                                    {status === 'passwords.reset' || status === 'Your password has been reset.'
                                        ? 'Kata sandi Anda telah berhasil diatur ulang. Silakan masuk menggunakan kata sandi baru Anda.'
                                        : status}
                                </span>
                            </div>
                        )}

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'captcha_input']}
                            className="flex flex-col gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Email */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
                                            <Mail className="size-3.5 text-muted-foreground" />
                                            Alamat Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="nama.akun@sumbawakab.go.id"
                                            className="h-10 text-sm"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password */}
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-sm font-medium flex items-center gap-1.5">
                                                <Lock className="size-3.5 text-muted-foreground" />
                                                Kata Sandi
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-xs font-medium text-teal-700 dark:text-teal-400 hover:underline"
                                                    tabIndex={3}
                                                >
                                                    Lupa kata sandi?
                                                </TextLink>
                                            )}
                                        </div>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="Masukkan kata sandi akun"
                                            className="h-10 text-sm"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Security CAPTCHA Box */}
                                    <div className="grid gap-2.5 p-4 bg-muted/50 border border-border/80 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="captcha_input" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                                <ShieldCheck className="size-3.5 text-teal-600 dark:text-teal-400" />
                                                Verifikasi Keamanan (CAPTCHA)
                                            </Label>
                                            <button
                                                type="button"
                                                onClick={refreshCaptcha}
                                                disabled={isRefreshing}
                                                title="Ganti Soal CAPTCHA"
                                                className="inline-flex items-center gap-1 text-xs text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 transition-colors cursor-pointer disabled:opacity-50 font-medium"
                                            >
                                                <RotateCw className={`size-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                                                <span>Ganti Soal</span>
                                            </button>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                            <div className="px-3.5 py-2 bg-background border border-border rounded-lg font-mono text-sm font-semibold tracking-wider text-center select-none shadow-xs text-foreground min-w-[130px]">
                                                {question}
                                            </div>
                                            <div className="flex-1">
                                                <Input
                                                    id="captcha_input"
                                                    name="captcha_input"
                                                    type="number"
                                                    required
                                                    tabIndex={4}
                                                    placeholder="Jawaban angka..."
                                                    className="h-10 bg-background text-sm"
                                                />
                                            </div>
                                        </div>
                                        <InputError message={errors.captcha_input} />
                                    </div>

                                    {/* Remember Me */}
                                    <div className="flex items-center space-x-2.5 pt-1">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={5}
                                        />
                                        <Label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer font-normal">
                                            Ingat sesi saya di perangkat ini
                                        </Label>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full h-11 mt-1 bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-md shadow-teal-700/20 rounded-xl transition-all cursor-pointer"
                                        tabIndex={6}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <Spinner className="size-4" />
                                                <span>Memverifikasi Akses...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <LogIn className="size-4" />
                                                <span>Masuk ke Sistem</span>
                                            </div>
                                        )}
                                    </Button>
                                </>
                            )}
                        </Form>

                        {/* Footer Info */}
                        <div className="pt-2 text-center text-sm text-muted-foreground border-t border-border/60">
                            Belum memiliki akun Inovator?{' '}
                            <TextLink href={register()} tabIndex={7} className="font-semibold text-teal-700 dark:text-teal-400 hover:underline">
                                Daftar sekarang
                            </TextLink>
                        </div>
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

Login.layout = null;
