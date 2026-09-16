import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Award, Calculator, CheckCircle2, FileCheck, Info, Save, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StepWizard, StepItem } from '@/components/ui/step-wizard';
import type { BreadcrumbItem } from '@/types';

interface Indikator {
    id: number;
    kode: string;
    nama: string;
    variabel: string | null;
    bobot: string | number;
    p1: string | null;
    p2: string | null;
    p3: string | null;
}

interface ExistingSkor {
    indikator_id: number;
    tier: number;
    skor: number;
    catatan: string | null;
}

interface InovasiDetail {
    id: number;
    nama_inovasi: string;
    tahapan: string;
    status: string;
    nama_inisiator: string;
    periode_lomba_id: number;
    estimasi_skor_kematangan: number | null;
    user?: { name: string; nama_pemda?: string };
    opd?: { nama: string };
    dokumen: { id: number; nama_asal: string; ukuran: number }[];
}

interface Props {
    inovasi: InovasiDetail;
    spdList: Indikator[];
    sidList: Indikator[];
    existingSkorSid: ExistingSkor[];
    existingSkorSpd: ExistingSkor[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Antrean Penilaian', href: '/penilai/skoring' },
    { title: 'Lembar Evaluasi Skoring', href: '#' },
];

const SKORING_STEPS: StepItem[] = [
    { id: 0, title: '20 Indikator SID', description: 'Satuan Inovasi' },
    { id: 1, title: '36 Indikator SPD', description: 'Satuan Pemda' },
    { id: 2, title: 'Ringkasan & Finalisasi', description: 'Konfirmasi Skor' },
];

export default function SkoringShow({
    inovasi,
    spdList = [],
    sidList = [],
    existingSkorSid = [],
    existingSkorSpd = [],
}: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    // State map for selected tiers: { [indikator_id]: tier }
    const initialSidState: Record<number, { tier: number; catatan: string }> = {};
    (existingSkorSid || []).forEach((item) => {
        initialSidState[item.indikator_id] = {
            tier: item.tier,
            catatan: item.catatan || '',
        };
    });

    const initialSpdState: Record<number, { tier: number; catatan: string }> = {};
    (existingSkorSpd || []).forEach((item) => {
        initialSpdState[item.indikator_id] = {
            tier: item.tier,
            catatan: item.catatan || '',
        };
    });

    const [scoresSid, setScoresSid] = useState<Record<number, { tier: number; catatan: string }>>(initialSidState);
    const [scoresSpd, setScoresSpd] = useState<Record<number, { tier: number; catatan: string }>>(initialSpdState);

    const form = useForm({
        items_sid: [] as { indikator_id: number; tier: number; catatan?: string }[],
        items_spd: [] as { indikator_id: number; tier: number; catatan?: string }[],
        is_final: false,
    });

    const handleTierChangeSid = (indikatorId: number, tier: number) => {
        setScoresSid((prev) => ({
            ...prev,
            [indikatorId]: {
                tier,
                catatan: prev[indikatorId]?.catatan || '',
            },
        }));
    };

    const handleCatatanChangeSid = (indikatorId: number, catatan: string) => {
        setScoresSid((prev) => ({
            ...prev,
            [indikatorId]: {
                tier: prev[indikatorId]?.tier || 1,
                catatan,
            },
        }));
    };

    const handleTierChangeSpd = (indikatorId: number, tier: number) => {
        setScoresSpd((prev) => ({
            ...prev,
            [indikatorId]: {
                tier,
                catatan: prev[indikatorId]?.catatan || '',
            },
        }));
    };

    const handleCatatanChangeSpd = (indikatorId: number, catatan: string) => {
        setScoresSpd((prev) => ({
            ...prev,
            [indikatorId]: {
                tier: prev[indikatorId]?.tier || 1,
                catatan,
            },
        }));
    };

    // Live Calculation
    const calculateTotalSid = () => {
        return sidList.reduce((sum, ind) => {
            const selected = scoresSid[ind.id];
            const tier = selected ? selected.tier : 1;
            const bobot = Number(ind.bobot) || 1.0;
            return sum + tier * bobot;
        }, 0);
    };

    const calculateTotalSpd = () => {
        return spdList.reduce((sum, ind) => {
            const selected = scoresSpd[ind.id];
            const tier = selected ? selected.tier : 1;
            const bobot = Number(ind.bobot) || 1.0;
            return sum + tier * bobot;
        }, 0);
    };

    const totalSid = calculateTotalSid();
    const totalSpd = calculateTotalSpd();

    const handleSubmitScore = (isFinalSubmit: boolean) => {
        const itemsSid = sidList.map((ind) => {
            const selected = scoresSid[ind.id];
            return {
                indikator_id: ind.id,
                tier: selected ? selected.tier : 1,
                catatan: selected ? selected.catatan : null,
            };
        });

        const itemsSpd = spdList.map((ind) => {
            const selected = scoresSpd[ind.id];
            return {
                indikator_id: ind.id,
                tier: selected ? selected.tier : 1,
                catatan: selected ? selected.catatan : null,
            };
        });

        form.transform(() => ({
            items_sid: itemsSid,
            items_spd: itemsSpd,
            is_final: isFinalSubmit,
        }));

        form.post(`/penilai/skoring/${inovasi.id}`);
    };

    return (
        <>
            <Head title={`Evaluasi Skoring: ${inovasi.nama_inovasi}`} />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full pb-24 mb-20">
                <div className="flex items-center justify-between">
                    <Link href="/penilai/skoring">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Antrean
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm px-3 py-1 font-semibold capitalize">
                            Status: {inovasi.status.replace('_', ' ')}
                        </Badge>
                        <Button asChild variant="outline" size="sm" className="gap-1.5 cursor-pointer">
                            <a href={`/inovasi/${inovasi.id}/print`} target="_blank" rel="noopener noreferrer">
                                <Printer className="h-3.5 w-3.5" /> Cetak / PDF
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Floating / Sticky Live Score Summary */}
                <Card className="border-primary/50 bg-primary/5 shadow-xs">
                    <CardHeader className="py-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Award className="h-6 w-6 text-primary" />
                                    {inovasi.nama_inovasi}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Pengusul: <span className="font-semibold text-foreground">{inovasi.user?.nama_pemda || inovasi.user?.name}</span> ({inovasi.opd?.nama || 'OPD'})
                                </CardDescription>
                            </div>

                            <div className="flex items-center gap-4 bg-background p-3 rounded-md border shadow-xs">
                                <div className="text-center px-2">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Skor SID</span>
                                    <span className="text-xl font-bold text-primary">{totalSid.toFixed(2)}</span>
                                </div>
                                <div className="h-8 w-px bg-border" />
                                <div className="text-center px-2">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Skor SPD</span>
                                    <span className="text-xl font-bold text-primary">{totalSpd.toFixed(2)}</span>
                                </div>
                                <div className="h-8 w-px bg-border" />
                                <div className="text-center px-2">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Estimasi Kematangan</span>
                                    <span className="text-2xl font-black text-primary">{totalSid.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Step Form Wizard Header */}
                        <div className="pt-2 border-t mt-3">
                            <StepWizard
                                steps={SKORING_STEPS}
                                currentStep={currentStep}
                                onStepClick={(stepIndex) => setCurrentStep(stepIndex)}
                            />
                        </div>
                    </CardHeader>
                </Card>

                {/* STEP 1: SID Indicators */}
                {currentStep === 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-primary/5 p-4 rounded-xl border border-primary/20">
                            <div>
                                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                                    <Calculator className="h-5 w-5 text-primary" />
                                    Step 1: Evaluasi 20 Indikator SID (Satuan Inovasi Daerah)
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Pilih parameter ambang P1 (skor 1), P2 (skor 2), atau P3 (skor 3) untuk setiap indikator inovasi.
                                </p>
                            </div>
                            <Button
                                onClick={() => setCurrentStep(1)}
                                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 text-xs font-semibold"
                            >
                                Lanjut ke Evaluasi SPD (Step 2)
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>

                        {sidList.map((ind) => {
                            const selectedTier = scoresSid[ind.id]?.tier || 1;
                            const bobot = Number(ind.bobot) || 1.0;
                            const skorCalculated = (selectedTier * bobot).toFixed(2);

                            return (
                                <Card key={ind.id} className="border hover:border-primary/40 transition-colors">
                                    <CardHeader className="py-3 px-4 bg-muted/30 border-b flex flex-row items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="font-mono text-xs font-bold">
                                                {ind.kode}
                                            </Badge>
                                            <h3 className="font-semibold text-sm text-foreground">
                                                {ind.nama}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-muted-foreground">Bobot: <strong className="text-foreground">{bobot}</strong></span>
                                            <Badge className="bg-primary text-primary-foreground font-bold">
                                                Skor: {skorCalculated}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-3">
                                        {ind.variabel && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/40 p-2 rounded">
                                                <Info className="h-3.5 w-3.5 shrink-0 text-primary" />
                                                Variabel: {ind.variabel}
                                            </p>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {/* Tier 1 */}
                                            <label
                                                onClick={() => handleTierChangeSid(ind.id, 1)}
                                                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${selectedTier === 1
                                                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                                                    : 'border-border hover:bg-muted/40'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-foreground">Parameter P1 (Skor 1)</span>
                                                    <input
                                                        type="radio"
                                                        name={`sid_${ind.id}`}
                                                        checked={selectedTier === 1}
                                                        onChange={() => handleTierChangeSid(ind.id, 1)}
                                                    />
                                                </div>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {ind.p1 || 'Parameter ambang tingkat 1 (Rendah / Dasar).'}
                                                </p>
                                            </label>

                                            {/* Tier 2 */}
                                            <label
                                                onClick={() => handleTierChangeSid(ind.id, 2)}
                                                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${selectedTier === 2
                                                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                                                    : 'border-border hover:bg-muted/40'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-foreground">Parameter P2 (Skor 2)</span>
                                                    <input
                                                        type="radio"
                                                        name={`sid_${ind.id}`}
                                                        checked={selectedTier === 2}
                                                        onChange={() => handleTierChangeSid(ind.id, 2)}
                                                    />
                                                </div>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {ind.p2 || 'Parameter ambang tingkat 2 (Sedang / Menengah).'}
                                                </p>
                                            </label>

                                            {/* Tier 3 */}
                                            <label
                                                onClick={() => handleTierChangeSid(ind.id, 3)}
                                                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${selectedTier === 3
                                                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                                                    : 'border-border hover:bg-muted/40'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-foreground">Parameter P3 (Skor 3)</span>
                                                    <input
                                                        type="radio"
                                                        name={`sid_${ind.id}`}
                                                        checked={selectedTier === 3}
                                                        onChange={() => handleTierChangeSid(ind.id, 3)}
                                                    />
                                                </div>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {ind.p3 || 'Parameter ambang tingkat 3 (Tinggi / Maksimal).'}
                                                </p>
                                            </label>
                                        </div>

                                        <div>
                                            <Input
                                                className="text-xs"
                                                placeholder="Catatan / Justifikasi penilai (Opsional)..."
                                                value={scoresSid[ind.id]?.catatan || ''}
                                                onChange={(e) => handleCatatanChangeSid(ind.id, e.target.value)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        <div className="flex justify-end pt-4 pb-16">
                            <Button
                                onClick={() => setCurrentStep(1)}
                                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
                            >
                                Lanjut ke Evaluasi SPD (Step 2)
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 2: SPD Indicators */}
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-primary/5 p-4 rounded-lg border border-primary/20">
                            <div>
                                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                                    <Award className="h-5 w-5 text-primary" />
                                    Step 2: Evaluasi 36 Indikator SPD (Satuan Pemerintahan Daerah)
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Pilih parameter ambang P1 (skor 1), P2 (skor 2), atau P3 (skor 3) untuk tata kelola pemerintahan daerah.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentStep(0)}
                                    className="gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Kembali ke SID
                                </Button>
                                <Button
                                    onClick={() => setCurrentStep(2)}
                                    className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                                >
                                    Lanjut ke Ringkasan (Step 3)
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {spdList.map((ind) => {
                            const selectedTier = scoresSpd[ind.id]?.tier || 1;
                            const bobot = Number(ind.bobot) || 1.0;
                            const skorCalculated = (selectedTier * bobot).toFixed(2);

                            return (
                                <Card key={ind.id} className="border hover:border-primary/40 transition-colors">
                                    <CardHeader className="py-3 px-4 bg-muted/30 border-b flex flex-row items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="font-mono text-xs font-bold">
                                                {ind.kode}
                                            </Badge>
                                            <h3 className="font-semibold text-sm text-foreground">
                                                {ind.nama}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-muted-foreground">Bobot: <strong className="text-foreground">{bobot}</strong></span>
                                            <Badge className="bg-primary text-primary-foreground font-bold">
                                                Skor: {skorCalculated}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-3">
                                        {ind.variabel && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/40 p-2 rounded">
                                                <Info className="h-3.5 w-3.5 shrink-0 text-primary" />
                                                Variabel: {ind.variabel}
                                            </p>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <label
                                                onClick={() => handleTierChangeSpd(ind.id, 1)}
                                                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${selectedTier === 1
                                                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                                                    : 'border-border hover:bg-muted/40'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-foreground">Parameter P1 (Skor 1)</span>
                                                    <input
                                                        type="radio"
                                                        name={`spd_${ind.id}`}
                                                        checked={selectedTier === 1}
                                                        onChange={() => handleTierChangeSpd(ind.id, 1)}
                                                    />
                                                </div>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {ind.p1 || 'Parameter ambang tingkat 1 (Rendah / Dasar).'}
                                                </p>
                                            </label>

                                            <label
                                                onClick={() => handleTierChangeSpd(ind.id, 2)}
                                                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${selectedTier === 2
                                                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                                                    : 'border-border hover:bg-muted/40'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-foreground">Parameter P2 (Skor 2)</span>
                                                    <input
                                                        type="radio"
                                                        name={`spd_${ind.id}`}
                                                        checked={selectedTier === 2}
                                                        onChange={() => handleTierChangeSpd(ind.id, 2)}
                                                    />
                                                </div>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {ind.p2 || 'Parameter ambang tingkat 2 (Sedang / Menengah).'}
                                                </p>
                                            </label>

                                            <label
                                                onClick={() => handleTierChangeSpd(ind.id, 3)}
                                                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${selectedTier === 3
                                                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                                                    : 'border-border hover:bg-muted/40'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-foreground">Parameter P3 (Skor 3)</span>
                                                    <input
                                                        type="radio"
                                                        name={`spd_${ind.id}`}
                                                        checked={selectedTier === 3}
                                                        onChange={() => handleTierChangeSpd(ind.id, 3)}
                                                    />
                                                </div>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {ind.p3 || 'Parameter ambang tingkat 3 (Tinggi / Maksimal).'}
                                                </p>
                                            </label>
                                        </div>

                                        <div>
                                            <Input
                                                className="text-xs"
                                                placeholder="Catatan / Justifikasi penilai (Opsional)..."
                                                value={scoresSpd[ind.id]?.catatan || ''}
                                                onChange={(e) => handleCatatanChangeSpd(ind.id, e.target.value)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        <div className="flex justify-between pt-4 pb-16">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(0)}
                                className="gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke SID
                            </Button>
                            <Button
                                onClick={() => setCurrentStep(2)}
                                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                Lanjut ke Ringkasan (Step 3)
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Ringkasan & Finalisasi Skoring */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <Card className="border-primary/40 shadow-xs">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                    Step 3: Ringkasan & Rekapitulasi Skor Final
                                </CardTitle>
                                <CardDescription>
                                    Tinjau total skor akumulasi SID dan SPD sebelum menyimpan draft atau melakukan finalisasi penilaian.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-muted/40 p-4 rounded-lg border text-center">
                                        <span className="text-xs font-semibold text-muted-foreground block uppercase">
                                            Total Skor SID (20 Indikator)
                                        </span>
                                        <span className="text-3xl font-black text-foreground mt-1 block">
                                            {totalSid.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="bg-muted/40 p-4 rounded-lg border text-center">
                                        <span className="text-xs font-semibold text-muted-foreground block uppercase">
                                            Total Skor SPD (36 Indikator)
                                        </span>
                                        <span className="text-3xl font-black text-foreground mt-1 block">
                                            {totalSpd.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/30 text-center">
                                        <span className="text-xs font-semibold text-primary block uppercase">
                                            Estimasi Skor Kematangan
                                        </span>
                                        <span className="text-3xl font-black text-primary mt-1 block">
                                            {totalSid.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentStep(1)}
                                        className="gap-2"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Kembali ke SPD
                                    </Button>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => handleSubmitScore(false)}
                                            disabled={form.processing}
                                            className="gap-2"
                                        >
                                            <Save className="h-4 w-4" />
                                            Simpan Draft Penilaian
                                        </Button>
                                        <Button
                                            onClick={() => handleSubmitScore(true)}
                                            disabled={form.processing}
                                            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                                        >
                                            <FileCheck className="h-4 w-4" />
                                            Finalisasi Penilaian (Siap Kirim)
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Bottom Action Floating Bar */}
                <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-xs p-4 z-40">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="text-xs text-muted-foreground hidden sm:block">
                            Estimasi Total Skor: <span className="font-bold text-foreground text-sm">{totalSid.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            <Button
                                variant="outline"
                                onClick={() => handleSubmitScore(false)}
                                disabled={form.processing}
                                className="gap-2"
                            >
                                <Save className="h-4 w-4" />
                                Simpan Draft Penilaian
                            </Button>
                            <Button
                                onClick={() => handleSubmitScore(true)}
                                disabled={form.processing}
                                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                <FileCheck className="h-4 w-4" />
                                Finalisasi Penilaian (Siap Kirim)
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

SkoringShow.layout = {
    breadcrumbs,
};
