import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, KeyRound, Mail } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { home, login } from '@/routes';
import { email } from '@/routes/password';

// Kemang Satange SVG Motif Overlay
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

export default function ForgotPassword({ status }: { status?: string }) {
    const isSent = Boolean(status);

    return (
        <div className="bg-muted/40 min-h-screen py-10 px-4 sm:px-6 flex flex-col justify-center items-center">
            <Head title="Lupa Kata Sandi - INOVA-HUB" />

            <div className="w-full max-w-lg flex flex-col gap-6">
                {/* Logo Header */}
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
                    {/* Header Banner */}
                    <div className="relative bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-800 text-white p-6 sm:p-8 overflow-hidden">
                        <KemangSatangeMotif className="opacity-15 text-white" />
                        <div className="relative z-10 space-y-2">
                            <Badge className="bg-teal-500/25 hover:bg-teal-500/35 text-teal-100 border-teal-400/30 text-xs px-2.5 py-0.5 font-medium inline-flex items-center gap-1.5 backdrop-blur-sm">
                                <KeyRound className="size-3.5" />
                                Pemulihan Akses Akun
                            </Badge>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                                Lupa Kata Sandi?
                            </h1>
                            <p className="text-teal-100/90 text-sm max-w-md leading-relaxed">
                                Fitur ini dapat digunakan oleh semua pengguna (Inovator, Pendamping, Tim Penilai, & Pimpinan) untuk mengatur ulang kata sandi melalui email.
                            </p>
                        </div>
                    </div>

                    <CardContent className="p-6 sm:p-8 space-y-6">
                        {/* Status Alert if link sent */}
                        {isSent && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-sm">
                                <CheckCircle2 className="size-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                                <div>
                                    <p className="font-semibold">Tautan Terkirim!</p>
                                    <p className="text-xs mt-0.5 opacity-90">
                                        {status === 'passwords.sent' || status === 'We have emailed your password reset link.'
                                            ? 'Tautan atur ulang kata sandi telah berhasil dikirimkan ke alamat email Anda. Silakan periksa kotak masuk atau spam.'
                                            : status}
                                    </p>
                                </div>
                            </div>
                        )}

                        <Form {...email.form()} className="space-y-5">
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
                                            <Mail className="size-3.5 text-muted-foreground" />
                                            Alamat Email Akun
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoComplete="email"
                                            autoFocus
                                            placeholder="nama.akun@sumbawakab.go.id"
                                            className="h-10 text-sm"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Masukkan alamat email yang terdaftar pada sistem INOVA-HUB Sumbawa.
                                        </p>
                                        <InputError message={errors.email} />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-md shadow-teal-700/20 rounded-xl transition-all cursor-pointer"
                                        disabled={processing}
                                        data-test="email-password-reset-link-button"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <Spinner className="size-4" />
                                                <span>Mengirimkan Tautan...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <KeyRound className="size-4" />
                                                <span>Kirim Tautan Atur Ulang Sandi</span>
                                            </div>
                                        )}
                                    </Button>
                                </>
                            )}
                        </Form>

                        {/* Back to Login */}
                        <div className="pt-2 text-center text-sm text-muted-foreground border-t border-border/60">
                            <Link
                                href={login()}
                                className="inline-flex items-center gap-1.5 font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                            >
                                <ArrowLeft className="size-3.5" />
                                Kembali ke Halaman Masuk
                            </Link>
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

ForgotPassword.layout = null;
