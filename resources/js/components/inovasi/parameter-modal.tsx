import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Check, Info, Settings, Sparkles, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

export type IndikatorSidItem = {
    id: number;
    kode: string;
    nama: string;
    variabel: string | null;
    informasi?: string | null;
    bobot: string | number;
    p1: string | null;
    p2: string | null;
    p3: string | null;
};

interface ParameterModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    indikator: IndikatorSidItem | null;
    inovasiId?: number;
    pengajuanId?: number;
    postUrl?: string;
    currentParameter: string | null;
    currentCatatan: string | null;
    disabled?: boolean;
}

export function ParameterModal({
    open,
    onOpenChange,
    indikator,
    inovasiId,
    pengajuanId,
    postUrl,
    currentParameter,
    currentCatatan,
    disabled = false,
}: ParameterModalProps) {
    const [selectedParam, setSelectedParam] = useState<string | null>(currentParameter);
    const [catatan, setCatatan] = useState<string>(currentCatatan || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setSelectedParam(currentParameter);
            setCatatan(currentCatatan || '');
        }
    }, [open, currentParameter, currentCatatan]);

    if (!indikator) return null;

    const bobot = Number(indikator.bobot);

    const parameterOptions = [
        {
            value: 'p1',
            tier: 1,
            label: 'Parameter P1 (Tier 1)',
            desc: indikator.p1 || 'Tingkat capaian dasar / bukti dukung minimal',
            skor: (bobot * 1).toFixed(2),
            badgeClass: 'bg-primary/10 text-primary border-primary/20',
        },
        {
            value: 'p2',
            tier: 2,
            label: 'Parameter P2 (Tier 2)',
            desc: indikator.p2 || 'Tingkat capaian menengah / bukti dukung berkembang',
            skor: (bobot * 2).toFixed(2),
            badgeClass: 'bg-primary/15 text-primary border-primary/30',
        },
        {
            value: 'p3',
            tier: 3,
            label: 'Parameter P3 (Tier 3)',
            desc: indikator.p3 || 'Tingkat capaian maksimal / bukti dukung paripurna',
            skor: (bobot * 3).toFixed(2),
            badgeClass: 'bg-primary text-primary-foreground font-bold border-primary',
        },
        {
            value: null,
            tier: 0,
            label: 'Tidak Dapat Diukur / Belum Terpenuhi',
            desc: 'Inovasi belum memiliki bukti dukung memadai untuk indikator ini',
            skor: '0.00',
            badgeClass: 'bg-muted text-muted-foreground border-border',
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (disabled) return;

        setIsSaving(true);
        const targetUrl =
            postUrl ||
            (pengajuanId
                ? `/pengajuan-lomba/${pengajuanId}/indikator/${indikator.id}/parameter`
                : `/inovasi/${inovasiId}/indikator/${indikator.id}/parameter`);

        router.post(
            targetUrl,
            {
                parameter: selectedParam,
                catatan: catatan.trim() || null,
            },
            {
                onFinish: () => setIsSaving(false),
                onSuccess: () => onOpenChange(false),
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-primary text-primary-foreground font-bold text-xs">
                                {indikator.kode}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                Bobot: {bobot.toFixed(2)}
                            </Badge>
                        </div>
                        <DialogTitle className="text-base font-bold text-foreground mt-1">
                            {indikator.nama}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            {indikator.variabel || 'Pilih opsi capaian parameter mutu yang paling sesuai dengan bukti dukung inovasi.'}
                        </DialogDescription>
                        {indikator.informasi && (
                            <div className="mt-2.5 p-3 rounded-md bg-muted/50 border border-border text-xs text-foreground">
                                <div className="font-semibold flex items-center gap-1.5 mb-1 text-primary">
                                    <Info className="h-3.5 w-3.5 shrink-0" />
                                    <span>Petunjuk Bukti Dukung Resmi IGA:</span>
                                </div>
                                <p className="leading-relaxed text-[11px] text-muted-foreground">
                                    {indikator.informasi}
                                </p>
                            </div>
                        )}
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <Label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                            Pilih Opsi Parameter Capaian:
                        </Label>

                        <div
                            role="radiogroup"
                            aria-label="Pilihan Opsi Parameter Capaian Mutu"
                            className="grid gap-2.5"
                        >
                            {parameterOptions.map((opt) => {
                                const isSelected = selectedParam === opt.value;
                                return (
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        disabled={disabled}
                                        key={opt.value ?? 'none'}
                                        onClick={() => !disabled && setSelectedParam(opt.value)}
                                        onKeyDown={(e) => {
                                            if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
                                                e.preventDefault();
                                                setSelectedParam(opt.value);
                                            }
                                        }}
                                        className={`w-full text-left relative flex flex-col p-3 rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary'
                                                : 'border-border hover:border-primary/50 hover:bg-muted/40'
                                        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2.5">
                                                <div
                                                    className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                                        isSelected
                                                            ? 'border-primary bg-primary text-primary-foreground'
                                                            : 'border-muted-foreground/40 bg-background'
                                                    }`}
                                                >
                                                    {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                                                </div>
                                                <span className="font-semibold text-xs text-foreground">
                                                    {opt.label}
                                                </span>
                                            </div>
                                            <Badge variant="outline" className={`text-[11px] font-bold ${opt.badgeClass}`}>
                                                Skor: {opt.skor}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1.5 pl-6.5 leading-relaxed">
                                            {opt.desc}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <Label htmlFor="catatan_param" className="text-xs font-semibold">
                                Catatan / Keterangan Penjelasan (Opsional)
                            </Label>
                            <Textarea
                                id="catatan_param"
                                rows={3}
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                placeholder="Jelaskan nomor SK, nama dokumen, atau rincian pemenuhan parameter di atas..."
                                disabled={disabled}
                                className="text-xs"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={isSaving}
                        >
                            Tutup
                        </Button>
                        {!disabled && (
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-semibold"
                            >
                                {isSaving ? <Spinner /> : <Settings className="h-3.5 w-3.5" />}
                                Simpan Pilihan Parameter
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
