import { Form, Head, Link } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, LogOut, MailCheck, Send } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { home, logout } from '@/routes';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <div className="bg-muted/40 min-h-screen py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
            <Head title="Verifikasi Alamat Email - INOVA-HUB" />

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
                    {/* Header Card Accent */}
                    <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-800 text-white p-6 sm:p-8 text-center space-y-3">
                        <div className="mx-auto w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-inner">
                            <MailCheck className="size-6 text-white" />
                        </div>
                        <div className="space-y-1">
                            <Badge className="bg-teal-500/25 text-teal-100 border-teal-400/30 text-xs px-2.5 py-0.5 font-medium">
                                Langkah Terakhir
                            </Badge>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                                Verifikasi Alamat Email
                            </h1>
                        </div>
                    </div>

                    <CardContent className="p-6 sm:p-8 space-y-6">
                        {/* Status Alert */}
                        {status === 'verification-link-sent' && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 text-sm">
                                <CheckCircle2 className="size-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                                <div>
                                    <p className="font-semibold">Tautan Verifikasi Terkirim!</p>
                                    <p className="text-xs mt-0.5 opacity-90">
                                        Tautan verifikasi baru telah berhasil dikirimkan ke alamat email Anda. Silakan periksa kembali kotak masuk Anda.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                            <p>
                                Terima kasih telah mendaftar di sistem <strong className="text-foreground font-semibold">INOVA-HUB Kabupaten Sumbawa</strong>.
                            </p>
                            <p>
                                Untuk menjaga keaslian data dan mengaktifkan akun Inovator Anda, kami telah mengirimkan tautan konfirmasi ke alamat email yang Anda daftarkan. Silakan klik tombol verifikasi pada email tersebut.
                            </p>
                        </div>

                        {/* Tips Alert */}
                        <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-muted/60 border border-border/80 text-xs text-muted-foreground">
                            <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                            <span>
                                Belum menerima email? Periksa folder <strong>Spam</strong> atau <strong>Promosi</strong>. Jika tetap tidak ada, klik tombol di bawah untuk mengirim ulang.
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <Form action="/email/verification-notification" method="post" className="space-y-4 pt-2">
                            {({ processing }) => (
                                <>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-md shadow-teal-700/20 rounded-xl transition-all cursor-pointer"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <Spinner className="size-4" />
                                                <span>Mengirimkan Tautan...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Send className="size-4" />
                                                <span>Kirim Ulang Email Verifikasi</span>
                                            </div>
                                        )}
                                    </Button>

                                    <div className="text-center pt-2">
                                        <Link
                                            href={logout()}
                                            method="post"
                                            as="button"
                                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer"
                                        >
                                            <LogOut className="size-3.5" />
                                            Keluar dari Akun
                                        </Link>
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

VerifyEmail.layout = (page: React.ReactNode) => page;
