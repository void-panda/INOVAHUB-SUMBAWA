import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';
import { send } from '@/routes/verification';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Perbarui nama, alamat email, kontak WhatsApp, dan pekerjaan inovator Anda"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="no_whatsapp">Nomor WhatsApp</Label>

                                <Input
                                    id="no_whatsapp"
                                    type="tel"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.no_whatsapp ?? ''}
                                    name="no_whatsapp"
                                    autoComplete="tel"
                                    placeholder="Contoh: 081234567890"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.no_whatsapp}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="pekerjaan">Pekerjaan Inovator</Label>

                                <select
                                    id="pekerjaan"
                                    name="pekerjaan"
                                    defaultValue={auth.user.pekerjaan ?? ''}
                                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 text-foreground cursor-pointer"
                                >
                                    <option value="" className="bg-background text-muted-foreground">
                                        -- Pilih Pekerjaan Inovator --
                                    </option>
                                    <option value="Pelajar" className="bg-background text-foreground">Pelajar</option>
                                    <option value="Mahasiswa" className="bg-background text-foreground">Mahasiswa</option>
                                    <option value="Pegawai Swasta" className="bg-background text-foreground">Pegawai Swasta</option>
                                    <option value="ASN" className="bg-background text-foreground">ASN</option>
                                    <option value="Lainnya" className="bg-background text-foreground">Lainnya</option>
                                </select>

                                <InputError
                                    className="mt-2"
                                    message={errors.pekerjaan}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="text-muted-foreground -mt-4 text-sm">
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Click here to re-send the
                                                verification email.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                A new verification link has been
                                                sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
