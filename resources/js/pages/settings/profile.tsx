import { useState } from 'react';
import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Building2, UserCheck, Users } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { edit } from '@/routes/profile';
import type { Auth, Opd } from '@/types';

type PageProps = {
    auth: Auth;
    opdList?: Opd[];
};

const PEKERJAAN_OPTIONS = [
    'Pelajar',
    'Mahasiswa',
    'Pegawai Swasta',
    'ASN',
    'Wiraswasta',
    'Peneliti / Akademisi',
    'Lainnya',
];

export default function Profile({
    mustVerifyEmail,
    status,
    opdList = [],
}: {
    mustVerifyEmail: boolean;
    status?: string;
    opdList?: Opd[];
}) {
    const { auth } = usePage<PageProps>().props;

    const [pekerjaan, setPekerjaan] = useState<string>(auth.user.pekerjaan ?? '');
    const [selectedOpdId, setSelectedOpdId] = useState<string>(
        auth.user.opd_id ? String(auth.user.opd_id) : ''
    );
    const [nip, setNip] = useState<string>(auth.user.nip ?? '');
    const [namaPemdaManual, setNamaPemdaManual] = useState<string>(
        auth.user.nama_pemda && auth.user.nama_pemda !== 'Inovator Sumbawa'
            ? auth.user.nama_pemda
            : ''
    );

    const isAsn = pekerjaan === 'ASN';
    const selectedOpdObj = opdList.find((o) => String(o.id) === selectedOpdId);

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Perbarui identitas profil, kontak, serta data instansi atau pekerjaan Anda."
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
                            {/* Hidden field to submit reactive Select values */}
                            <input type="hidden" name="pekerjaan" value={pekerjaan} />
                            <input
                                type="hidden"
                                name="opd_id"
                                value={isAsn ? selectedOpdId : ''}
                            />

                            {/* Nama Lengkap */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Lengkap</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Nama Lengkap"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            {/* Alamat Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Alamat Email</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="alamat.email@contoh.com"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            {/* Nomor WhatsApp */}
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

                            {/* Pekerjaan / Profesi */}
                            <div className="grid gap-2 pt-2 border-t border-border/60">
                                <Label htmlFor="pekerjaan_select" className="text-sm font-semibold">
                                    Profesi / Pekerjaan
                                </Label>
                                <p className="text-xs text-muted-foreground -mt-1">
                                    Pilih profesi Anda. Pilihan ASN akan mengidentifikasi inovasi Anda sebagai perwakilan Perangkat Daerah (OPD).
                                </p>

                                <Select
                                    value={pekerjaan}
                                    onValueChange={(val) => {
                                        setPekerjaan(val);
                                        if (val !== 'ASN') {
                                            setSelectedOpdId('');
                                            setNip('');
                                        }
                                    }}
                                >
                                    <SelectTrigger id="pekerjaan_select" className="w-full mt-1">
                                        <SelectValue placeholder="-- Pilih Profesi / Pekerjaan --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PEKERJAAN_OPTIONS.map((item) => (
                                            <SelectItem key={item} value={item}>
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.pekerjaan} />
                            </div>

                            {/* Conditional Section: ASN (OPD & NIP) vs Non-ASN (Asal Lembaga) */}
                            {isAsn ? (
                                <div className="space-y-4 rounded-xl border border-teal-500/30 bg-teal-50/50 p-4.5 dark:bg-teal-950/20">
                                    <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-medium text-sm">
                                        <Building2 className="size-4.5 shrink-0" />
                                        <span>Identitas Perangkat Daerah (ASN Pemkab Sumbawa)</span>
                                    </div>

                                    {/* Dropdown OPD */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="opd_select">Perangkat Daerah (OPD) / Unit Kerja</Label>
                                        <Select
                                            value={selectedOpdId}
                                            onValueChange={(val) => setSelectedOpdId(val)}
                                        >
                                            <SelectTrigger id="opd_select" className="w-full bg-background">
                                                <SelectValue placeholder="-- Pilih Perangkat Daerah Resmi --" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-72">
                                                {opdList.map((opd) => (
                                                    <SelectItem key={opd.id} value={String(opd.id)}>
                                                        {opd.nama} {opd.kode ? `[${opd.kode}]` : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {selectedOpdObj && (
                                            <p className="text-xs text-teal-700 dark:text-teal-400">
                                                Terpilih: <strong>{selectedOpdObj.nama}</strong>
                                            </p>
                                        )}
                                        <InputError message={errors.opd_id} />
                                    </div>

                                    {/* NIP */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="nip">Nomor Induk Pegawai (NIP)</Label>
                                        <Input
                                            id="nip"
                                            name="nip"
                                            value={nip}
                                            onChange={(e) => setNip(e.target.value)}
                                            placeholder="Contoh: 198507152010011002 (18 digit)"
                                            maxLength={20}
                                            className="bg-background"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Masukkan 18 digit NIP resmi Anda.
                                        </p>
                                        <InputError message={errors.nip} />
                                    </div>
                                </div>
                            ) : pekerjaan ? (
                                <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4.5">
                                    <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                                        <Users className="size-4.5 shrink-0 text-teal-600 dark:text-teal-400" />
                                        <span>Identitas Inovator Masyarakat Umum</span>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="nama_pemda">Asal Lembaga / Kampus / Sekolah / Usaha / Mandiri</Label>
                                        <Input
                                            id="nama_pemda"
                                            name="nama_pemda"
                                            value={namaPemdaManual}
                                            onChange={(e) => setNamaPemdaManual(e.target.value)}
                                            placeholder="Contoh: Universitas Samawa / SMKN 1 Sumbawa / Mandiri"
                                            className="bg-background"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Nama instansi, komunitas, kampus, atau kelompok tempat Anda bernaung (opsional).
                                        </p>
                                        <InputError message={errors.nama_pemda} />
                                    </div>
                                </div>
                            ) : null}

                            {/* Badge Tipe Inovator Info */}
                            {pekerjaan && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border/50">
                                    <UserCheck className="size-4 text-teal-600 dark:text-teal-400 shrink-0" />
                                    <span>
                                        Status sistem:{' '}
                                        <strong className="text-foreground">
                                            {isAsn
                                                ? 'Inovator Perangkat Daerah (OPD)'
                                                : 'Inovator Masyarakat'}
                                        </strong>
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-2">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Simpan Perubahan
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
