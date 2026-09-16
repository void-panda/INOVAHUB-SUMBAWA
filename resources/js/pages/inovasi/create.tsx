import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { StepWizard, StepItem } from '@/components/ui/step-wizard';
import { InovasiFields, InovasiFormData } from '@/pages/inovasi/inovasi-fields';

type Option = {
    value: string;
    label: string;
};

type Props = {
    urusanList: Option[];
    urusanWajibList: string[];
    tipeInovator?: 'dinas' | 'masyarakat';
};

const DINAS_STEPS: StepItem[] = [
    { id: 0, title: 'Identitas & Bentuk', description: 'Nama, Tahapan & Jenis' },
    { id: 1, title: 'Klasifikasi & Lokasi', description: 'Tematik & Kriteria IGA' },
    { id: 2, title: 'Linimasa & Anggaran', description: 'Jadwal & Biaya' },
    { id: 3, title: 'Rancang Bangun', description: 'Deskripsi & Tujuan' },
    { id: 4, title: 'Dokumen & Review', description: 'Berkas & Konfirmasi' },
];

const MASYARAKAT_STEPS: StepItem[] = [
    { id: 0, title: 'Identitas & Bentuk', description: 'Nama, Inisiator & Jenis' },
    { id: 1, title: 'Lokasi & Waktu', description: 'Koordinat & Penerapan' },
    { id: 2, title: 'Deskripsi & Berkas', description: 'Rancang Bangun & Dokumen' },
];

export default function CreateInovasi({
    urusanList,
    urusanWajibList,
    tipeInovator = 'dinas',
}: Props) {
    const isMasyarakat = tipeInovator === 'masyarakat';
    const formSteps = isMasyarakat ? MASYARAKAT_STEPS : DINAS_STEPS;
    const [currentStep, setCurrentStep] = useState(0);

    const form = useForm<InovasiFormData>({
        nama_inovasi: '',
        tahapan: 'inisiatif',
        inisiator: isMasyarakat ? 'masyarakat' : 'opd',
        bentuk_inovasi: 'pelayanan_publik',
        jenis_inovasi: 'non_digital',
        klasifikasi: 'non_tematik',
        tematik: null,
        kriteria_inovasi: isMasyarakat ? null : 'kriteria_2',
        nama_inisiator: '',
        koordinat: '',
        lokasi: '',
        urusan_utama: null,
        urusan_wajib: [],
        waktu_uji_coba: null,
        waktu_penerapan: '',
        waktu_pengembangan: null,
        anggaran_sebelum: null,
        anggaran_sesudah: null,
        is_penghargaan: false,
        nama_penghargaan: '',
        rancang_bangun: '',
        tujuan: '',
        manfaat: '',
        hasil_inovasi: '',
        proposal: null,
        sertifikat: null,
        link_video: '',
        nama_video: '',
        dokumen: [],
    });

    const formControl = {
        data: form.data,
        setData: (key: keyof InovasiFormData, value: unknown) =>
            form.setData(key, value as never),
    };

    const handleNextStep = () => {
        if (isMasyarakat) {
            // Validasi Step Masyarakat (3 Steps)
            if (currentStep === 0) {
                if (!form.data.nama_inovasi.trim() || !form.data.nama_inisiator.trim()) {
                    form.setError('nama_inovasi', !form.data.nama_inovasi.trim() ? 'Nama inovasi wajib diisi.' : '');
                    form.setError('nama_inisiator', !form.data.nama_inisiator.trim() ? 'Nama inisiator wajib diisi.' : '');
                    return;
                }
            } else if (currentStep === 1) {
                if (!form.data.koordinat.trim() || !form.data.lokasi.trim() || !form.data.waktu_penerapan) {
                    form.setError('koordinat', !form.data.koordinat.trim() ? 'Koordinat geografis wajib diisi.' : '');
                    form.setError('lokasi', !form.data.lokasi.trim() ? 'Lokasi penerapan wajib diisi.' : '');
                    form.setError('waktu_penerapan', !form.data.waktu_penerapan ? 'Waktu penerapan wajib diisi.' : '');
                    return;
                }
            }
        } else {
            // Validasi Step Dinas (5 Steps)
            if (currentStep === 0) {
                if (!form.data.nama_inovasi.trim() || !form.data.nama_inisiator.trim()) {
                    form.setError('nama_inovasi', !form.data.nama_inovasi.trim() ? 'Nama inovasi wajib diisi.' : '');
                    form.setError('nama_inisiator', !form.data.nama_inisiator.trim() ? 'Nama inisiator wajib diisi.' : '');
                    return;
                }
            } else if (currentStep === 1) {
                if (!form.data.koordinat.trim()) {
                    form.setError('koordinat', 'Koordinat geografis wajib diisi.');
                    return;
                }
                if (form.data.klasifikasi === 'tematik' && !form.data.tematik) {
                    form.setError('tematik', 'Kategori tematik prioritas wajib dipilih.');
                    return;
                }
            } else if (currentStep === 2) {
                if (!form.data.waktu_penerapan) {
                    form.setError('waktu_penerapan', 'Waktu penerapan resmi wajib diisi.');
                    return;
                }
            } else if (currentStep === 3) {
                if (!form.data.rancang_bangun.trim()) {
                    form.setError('rancang_bangun', 'Rancang bangun inovasi wajib diisi.');
                    return;
                }
            }
        }

        form.clearErrors();
        setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
    };

    const handlePrevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const submit = () => {
        form.post('/inovasi', {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title={isMasyarakat ? 'Input Inovasi Masyarakat' : 'Input Inovasi Daerah Baru'} />
            <Card className="mx-auto my-6 w-full max-w-4xl shadow-md border-primary/20">
                <CardHeader className="border-b bg-muted/20 pb-4">
                    <CardTitle className="text-xl font-bold flex items-center justify-between text-foreground">
                        {isMasyarakat ? 'Input Inovasi Jalur Partisipasi Masyarakat' : 'Input Inovasi Daerah Baru'}
                    </CardTitle>
                    <StepWizard
                        steps={formSteps}
                        currentStep={currentStep}
                        onStepClick={(stepIndex) => setCurrentStep(stepIndex)}
                    />
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        <InovasiFields
                            step={currentStep}
                            form={formControl}
                            errors={form.errors}
                            urusanList={urusanList}
                            urusanWajibList={urusanWajibList}
                            tipeInovator={tipeInovator}
                        />

                        {/* Step Form Bottom Action Controls */}
                        <div className="flex items-center justify-between pt-4 border-t gap-3">
                            {currentStep > 0 ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePrevStep}
                                    className="gap-2 text-xs"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Sebelumnya
                                </Button>
                            ) : <div />}

                            {currentStep < formSteps.length - 1 ? (
                                <Button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
                                >
                                    Selanjutnya
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={submit}
                                    disabled={form.processing}
                                    className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs"
                                    data-test="save-inovasi-button"
                                >
                                    {form.processing ? <Spinner /> : <Save className="h-4 w-4" />}
                                    Simpan sebagai Draft
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

CreateInovasi.layout = {
    breadcrumbs: [
        {
            title: 'Inovasi Saya',
            href: '/inovasi',
        },
        {
            title: 'Input Inovasi Baru',
            href: '/inovasi/create',
        },
    ],
};