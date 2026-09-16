import { useState } from 'react';
import { Form, Head } from '@inertiajs/react';
import { RotateCw } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    captchaQuestion?: string;
};

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
            console.error('Failed to refresh CAPTCHA', e);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <>
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'captcha_input']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={6}
                                        >
                                            Forgot your password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Security CAPTCHA Field */}
                            <div className="grid gap-2 p-3.5 bg-muted/40 border border-border rounded-md">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="captcha_input" className="text-xs font-semibold text-foreground">
                                        Verifikasi Keamanan (CAPTCHA)
                                    </Label>
                                    <button
                                        type="button"
                                        onClick={refreshCaptcha}
                                        disabled={isRefreshing}
                                        title="Ganti Pertanyaan CAPTCHA"
                                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors p-1 rounded hover:bg-muted cursor-pointer"
                                    >
                                        <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                                        <span>Refresh</span>
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 mt-1">
                                    <div className="bg-primary/10 border border-primary/20 text-primary px-3 py-2 rounded-md font-mono text-sm font-bold shrink-0 select-none">
                                        {question}
                                    </div>
                                    <Input
                                        id="captcha_input"
                                        name="captcha_input"
                                        type="number"
                                        required
                                        tabIndex={3}
                                        placeholder="Jawaban angka..."
                                        className="bg-background text-sm"
                                    />
                                </div>
                                <InputError message={errors.captcha_input} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={4}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={5}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm">
                            Don't have an account?{' '}
                            <TextLink href={register()} tabIndex={7}>
                                Sign up
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Selamat Datang',
    description: 'Masukkan kredensial dan captcha keamanan Anda di bawah untuk masuk',
};
