import { useState, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Pencil, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

export type ParameterOption = {
    id: string;
    label: string;
    bobot: number;
};

export type IndikatorSidItem = {
    id: number;
    kode: string;
    nama: string;
    variabel: string | null;
    informasi?: string | null;
    bobot: string | number;
    p1?: string | null;
    p2?: string | null;
    p3?: string | null;
    opsi?: ParameterOption[] | null;
    opsi_list?: ParameterOption[];
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
    const [selectedParam, setSelectedParam] = useState<string>('');
    const [catatan, setCatatan] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setSelectedParam(currentParameter || '');
            setCatatan(currentCatatan || '');
        }
    }, [open, currentParameter, currentCatatan]);

    const options: ParameterOption[] = useMemo(() => {
        if (!indikator) return [];

        const p1Label = indikator.p1 || (indikator.opsi?.[0]?.label ?? indikator.opsi_list?.[0]?.label ?? 'Bukti Standar Minimal');
        const p2Label = indikator.p2 || (indikator.opsi?.[1]?.label ?? indikator.opsi_list?.[1]?.label ?? 'Bukti Standar Menengah');
        const p3Label = indikator.p3 || (indikator.opsi?.[2]?.label ?? indikator.opsi_list?.[2]?.label ?? 'Bukti Standar Tertinggi');

        return [
            { id: 'p1', label: `Parameter P1 (1 Poin): ${p1Label}`, bobot: 1 },
            { id: 'p2', label: `Parameter P2 (2 Poin): ${p2Label}`, bobot: 2 },
            { id: 'p3', label: `Parameter P3 (3 Poin): ${p3Label}`, bobot: 3 },
        ];
    }, [indikator]);

    const activeScoreInfo = useMemo(() => {
        if (!selectedParam || selectedParam === 'tidak_dapat_diukur' || selectedParam === '0') {
            return {
                poin: 0,
                skor: 0,
                text: '0 Poin (Tidak Dapat Diukur)',
            };
        }

        const tierMap: Record<string, number> = { p1: 1, p2: 2, p3: 3 };
        const poin = tierMap[selectedParam.toLowerCase()] ?? (options.find((o) => o.id === selectedParam)?.bobot ?? 0);

        return {
            poin,
            skor: poin,
            text: `${poin} Poin`,
        };
    }, [selectedParam, options]);

    if (!indikator) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (disabled) return;

        setIsSaving(true);
        const targetUrl =
            postUrl ||
            (pengajuanId
                ? `/inovasi-daerah/${pengajuanId}/indikator/${indikator.id}/parameter`
                : `/inovasi/${inovasiId}/indikator/${indikator.id}/parameter`);

        router.post(
            targetUrl,
            {
                parameter: selectedParam === '' ? null : selectedParam,
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
            <DialogContent className="max-w-md md:max-w-lg overflow-hidden p-6">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="pb-1">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                            <Pencil className="h-4 w-4 text-primary stroke-[2.5]" />
                            <DialogTitle className="text-sm md:text-base font-extrabold uppercase tracking-wider">
                                Ubah Data Indikator
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    {/* Subheader detail indikator (sesuai Gambar 2) */}
                    <div className="mt-3 space-y-1">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                            {indikator.nama}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {indikator.variabel ||
                                indikator.informasi ||
                                'Pilih opsi capaian parameter mutu yang paling sesuai dengan bukti dukung inovasi.'}
                        </p>
                    </div>

                    {indikator.informasi && indikator.variabel && (
                        <div className="mt-2.5 p-2.5 rounded-md bg-muted/50 border border-border text-xs text-foreground">
                            <div className="font-semibold flex items-center gap-1.5 mb-1 text-primary">
                                <Info className="h-3.5 w-3.5 shrink-0" />
                                <span>Petunjuk Bukti Dukung:</span>
                            </div>
                            <p className="leading-relaxed text-[11px] text-muted-foreground">
                                {indikator.informasi}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4 pt-4">
                        {/* Select Opsi Parameter (sesuai Gambar 2) */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="opsi-parameter"
                                className="text-xs font-bold uppercase tracking-wider text-foreground block"
                            >
                                Opsi Parameter
                            </Label>
                            <div className="relative">
                                <select
                                    id="opsi-parameter"
                                    value={selectedParam}
                                    onChange={(e) => setSelectedParam(e.target.value)}
                                    disabled={disabled}
                                    className="w-full h-10 px-3 text-xs md:text-sm rounded-md border border-input bg-background text-foreground shadow-xs transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">-- Pilih Parameter --</option>
                                    <option value="tidak_dapat_diukur">Tidak Dapat Diukur</option>
                                    {options.map((opt) => (
                                        <option key={opt.id} value={opt.id}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Real-time score indicator */}
                        {selectedParam !== '' && (
                            <div className="flex items-center justify-between p-2.5 rounded-lg border border-primary/20 bg-primary/5 text-xs">
                                <span className="text-muted-foreground font-medium">Estimasi Skor:</span>
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-bold">
                                    {activeScoreInfo.text}
                                </Badge>
                            </div>
                        )}

                        {/* Catatan / Keterangan Penjelasan */}
                        <div className="space-y-1.5 pt-1">
                            <Label htmlFor="catatan_param" className="text-xs font-semibold text-foreground">
                                Catatan / Keterangan Penjelasan (Opsional)
                            </Label>
                            <Textarea
                                id="catatan_param"
                                rows={3}
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                placeholder="Jelaskan nomor surat/SK, tautan berkas, atau keterangan relevan..."
                                disabled={disabled}
                                className="text-xs resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex sm:justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSaving}
                            className="text-xs"
                        >
                            Batal
                        </Button>
                        {!disabled && (
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-4"
                            >
                                {isSaving ? <Spinner className="mr-1.5 h-3.5 w-3.5" /> : null}
                                Simpan Parameter
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
