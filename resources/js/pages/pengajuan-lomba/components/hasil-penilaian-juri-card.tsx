import { Link } from '@inertiajs/react';
import { Award, Calculator, Clock, MessageSquare, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PengajuanLomba } from '@/types/models';

export interface PenilaianItem {
    id: number;
    nama_juri: string;
    nilai: number;
    catatan: string | null;
    updated_at: string;
}

interface HasilPenilaianJuriCardProps {
    pengajuan: PengajuanLomba;
    nilaiRataRataJuri?: number | null;
    jumlahJuriMenilai?: number;
    daftarPenilaianJuri?: PenilaianItem[];
    canNilaiJuri?: boolean;
}

export function HasilPenilaianJuriCard({
    pengajuan,
    nilaiRataRataJuri = null,
    jumlahJuriMenilai = 0,
    daftarPenilaianJuri = [],
    canNilaiJuri = false,
}: HasilPenilaianJuriCardProps) {
    return (
        <Card className="border-border bg-card flex flex-col h-full">
            <CardHeader className="p-4 pb-3 border-b border-border">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Award className="h-4 w-4 text-teal-600" />
                    Hasil Penilaian Juri Lomba
                </CardTitle>
                <CardDescription className="text-xs">
                    Evaluasi performa dan skor kumulatif juri.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                {/* Score Display Card */}
                <div className="text-center p-5 bg-teal-50/60 dark:bg-teal-950/30 rounded-xl border border-teal-200/80 dark:border-teal-900/60 space-y-1.5">
                    <div className="text-xs font-semibold text-teal-800 dark:text-teal-300">
                        Nilai Rata-rata Tim Juri
                    </div>
                    <div className="text-4xl font-extrabold tracking-tight text-teal-700 dark:text-teal-400">
                        {nilaiRataRataJuri !== null ? Number(nilaiRataRataJuri).toFixed(2) : '-'}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                        Skala Penilaian 0 - 100 Poin
                    </div>
                </div>

                {/* Status Penilaian & Breakdown Juri */}
                <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status Evaluasi:</span>
                        {jumlahJuriMenilai > 0 ? (
                            <Badge className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 font-semibold">
                                Sudah Dinilai ({jumlahJuriMenilai} Juri)
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 text-[10px] font-semibold">
                                Menunggu Penilaian Juri
                            </Badge>
                        )}
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-border">
                        <div className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                            <span>Rincian Nilai Juri</span>
                            <span>{daftarPenilaianJuri.length} Terdaftar</span>
                        </div>
                        {daftarPenilaianJuri.length > 0 ? (
                            <div className="space-y-1.5">
                                {daftarPenilaianJuri.map((juri) => (
                                    <div
                                        key={juri.id}
                                        className="flex items-center justify-between p-2 rounded-md bg-muted/40 border text-xs"
                                    >
                                        <span className="font-medium text-foreground truncate pr-2">
                                            {juri.nama_juri}
                                        </span>
                                        <Badge variant="secondary" className="font-bold text-teal-700 dark:text-teal-300 shrink-0">
                                            {juri.nilai}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[11px] text-muted-foreground italic py-1">
                                Belum ada nilai yang dicatat oleh juri.
                            </p>
                        )}
                    </div>
                </div>

                {/* Tombol Cepat Menilai (Hanya untuk Tim Penilai / Juri) */}
                {canNilaiJuri && (pengajuan.status === 'disahkan_opd' || pengajuan.status === 'review_internal') && (
                    <Button asChild className="w-full text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer mt-2">
                        <Link href={`/penilai/skoring/${pengajuan.id}`}>
                            <Calculator className="h-3.5 w-3.5 mr-1.5" />
                            Masuk ke Form Penilaian Juri
                        </Link>
                    </Button>
                )}

                {/* Keterangan Status Evaluasi untuk Inovator & Peran Non-Juri */}
                {!canNilaiJuri && (
                    <div className="p-3 rounded-lg border border-teal-200/80 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/20 text-xs text-teal-900 dark:text-teal-200 mt-2 flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                            {jumlahJuriMenilai > 0
                                ? 'Penilaian telah dicatat oleh dewan juri. Silakan telusuri catatan evaluasi dan masukan tim juri pada tabel di bawah.'
                                : 'Inovasi Anda sedang dalam antrean evaluasi Dewan Juri Lomba. Skor dan catatan akan otomatis tampil di sini setelah juri menilai.'}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

interface CatatanKualitatifJuriCardProps {
    daftarPenilaianJuri?: PenilaianItem[];
    nilaiRataRataJuri?: number | null;
}

export function CatatanKualitatifJuriCard({
    daftarPenilaianJuri = [],
    nilaiRataRataJuri = null,
}: CatatanKualitatifJuriCardProps) {
    return (
        <Card className="border-border bg-card">
            <CardHeader className="p-4 pb-2 border-b border-border">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-teal-600" />
                        Catatan & Masukan Kualitatif Tim Juri ({daftarPenilaianJuri.length} Juri)
                    </CardTitle>
                    {nilaiRataRataJuri !== null && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Nilai Rata-rata:</span>
                            <Badge className="bg-teal-600 text-white font-bold text-xs px-2.5 py-0.5">
                                {nilaiRataRataJuri} / 100
                            </Badge>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4">
                {daftarPenilaianJuri.length > 0 ? (
                    <div className="space-y-3">
                        {daftarPenilaianJuri.map((item) => (
                            <div
                                key={item.id}
                                className="p-3.5 rounded-lg border border-teal-200/60 dark:border-teal-900/60 bg-teal-50/20 dark:bg-teal-950/10 text-xs space-y-2"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-foreground">
                                            {item.nama_juri}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {item.updated_at}
                                        </span>
                                    </div>
                                    <Badge variant="outline" className="border-teal-500 text-teal-700 dark:text-teal-300 font-bold">
                                        Skor: {item.nilai}
                                    </Badge>
                                </div>
                                <div className="bg-background/80 p-2.5 rounded-md border text-foreground/90 whitespace-pre-line leading-relaxed">
                                    {item.catatan || <span className="text-muted-foreground italic">Tidak ada catatan evaluasi tertulis.</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground italic text-center py-4">
                        Belum ada masukan dan catatan evaluasi tertulis dari tim juri penilai lomba.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
