import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Edit3, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { StepWizard, StepItem } from '@/components/ui/step-wizard';
import { InovasiFields, InovasiFormData } from '@/pages/inovasi/inovasi-fields';

type Option = {
    value: string;
    label: string;
};

interface EditProfilModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    inovasi: {
        id: number;
        nama_inovasi: string;
        tahapan: string;
        bentuk_inovasi?: string;
        jenis_inovasi?: string;
        klasifikasi?: string;
        tematik?: string | null;
        kriteria_inovasi?: string | null;
        nama_inisiator: string;
        koordinat: string;
        lokasi?: string | null;
        urusan_utama: string | null;
        urusan_wajib: string | null;
        waktu_uji_coba: string | null;
        waktu_penerapan: string | null;
        waktu_pengembangan: string | null;
        anggaran_sebelum?: number | string | null;
        anggaran_sesudah?: number | string | null;
        is_penghargaan?: boolean;
        nama_penghargaan?: string | null;
        rancang_bangun?: string | null;
        tujuan?: string | null;
        manfaat?: string | null;
        hasil_inovasi?: string | null;
        status: string;
    };
    urusanList: Option[];
    urusanWajibList: string[];
}

const FORM_STEPS: StepItem[] = [
    { id: 0, title: 'Identitas & Bentuk', description: 'Nama, Tahapan & Jenis' },
    { id: 1, title: 'Klasifikasi & Lokasi', description: 'Tematik & Kriteria IGA' },
    { id: 2, title: 'Linimasa & Anggaran', description: 'Jadwal & Biaya' },
    { id: 3, title: 'Rancang Bangun', description: 'Deskripsi & Tujuan' },
];

export function EditProfilModal({
    open,
    onOpenChange,
    inovasi,
    urusanList,
    urusanWajibList,
}: EditProfilModalProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const form = useForm<InovasiFormData>({
        nama_inovasi: inovasi.nama_inovasi,
        tahapan: inovasi.tahapan,
        bentuk_inovasi: inovasi.bentuk_inovasi || 'pelayanan_publik',
        jenis_inovasi: inovasi.jenis_inovasi || 'non_digital',
        klasifikasi: inovasi.klasifikasi || 'non_tematik',
        tematik: inovasi.tematik || null,
        kriteria_inovasi: inovasi.kriteria_inovasi || 'kriteria_2',
        nama_inisiator: inovasi.nama_inisiator,
        koordinat: inovasi.koordinat ?? '',
        lokasi: inovasi.lokasi ?? '',
        urusan_utama: inovasi.urusan_utama,
        urusan_wajib: inovasi.urusan_wajib?.split(',').filter(Boolean) ?? [],
        waktu_uji_coba: inovasi.waktu_uji_coba?.slice(0, 10) ?? null,
        waktu_penerapan: inovasi.waktu_penerapan?.slice(0, 10) ?? '',
        waktu_pengembangan: inovasi.waktu_pengembangan?.slice(0, 10) ?? null,
        anggaran_sebelum: inovasi.anggaran_sebelum ?? null,
        anggaran_sesudah: inovasi.anggaran_sesudah ?? null,
        is_penghargaan: Boolean(inovasi.is_penghargaan),
        nama_penghargaan: inovasi.nama_penghargaan ?? '',
        rancang_bangun: inovasi.rancang_bangun ?? '',
        tujuan: inovasi.tujuan ?? '',
        manfaat: inovasi.manfaat ?? '',
        hasil_inovasi: inovasi.hasil_inovasi ?? '',
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
        } else if (currentStep === 2) {
            if (!form.data.waktu_penerapan) {
                form.setError('waktu_penerapan', 'Waktu penerapan resmi wajib diisi.');
                return;
            }
        }

        form.clearErrors();
        setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length - 1));
    };

    const handlePrevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const save = () => {
        form.put(`/inovasi/${inovasi.id}`, {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="flex items-center gap-2 text-foreground text-lg font-bold">
                        <Edit3 className="h-5 w-5 text-primary" />
                        Edit Profil Inovasi Daerah (Standar IGA)
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Perbarui data identitas utama, klasifikasi urusan, linimasa anggaran, dan deskripsi rancang bangun inovasi.
                    </DialogDescription>

                    <div className="pt-2">
                        <StepWizard
                            steps={FORM_STEPS}
                            currentStep={currentStep}
                            onStepClick={(stepIndex) => setCurrentStep(stepIndex)}
                        />
                    </div>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    <InovasiFields
                        step={currentStep}
                        form={formControl}
                        errors={form.errors}
                        urusanList={urusanList}
                        urusanWajibList={urusanWajibList}
                    />
                </div>

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

                    {currentStep < FORM_STEPS.length - 1 ? (
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
                            onClick={save}
                            disabled={form.processing}
                            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
                        >
                            {form.processing ? <Spinner /> : <Save className="h-4 w-4" />}
                            Simpan Perubahan
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
