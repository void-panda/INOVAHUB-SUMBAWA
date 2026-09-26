import { Link } from '@inertiajs/react';
import { FolderOpen, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PengajuanLomba } from '@/types/models';

interface KematanganSidCardProps {
    pengajuan: PengajuanLomba;
}

export function KematanganSidCard({ pengajuan }: KematanganSidCardProps) {
    return (
        <Card className="border-border bg-card">
            <CardHeader className="p-4 pb-2 border-b border-border">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-teal-600" />
                        Kematangan 20 Indikator SID (Standar IGA Kemendagri)
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px] bg-muted/50">
                        Instrumen Mutu Pasca Lomba
                    </Badge>
                </div>
                <CardDescription className="text-xs">
                    Data indikator ini digunakan sebagai instrumen pembinaan mutu dan persiapan pelaporan resmi ke Kemendagri.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="p-3 bg-muted/30 rounded-lg border border-border">
                        <span className="text-[11px] text-muted-foreground block">Estimasi Skor Kematangan SID</span>
                        <span className="text-xl font-bold text-teal-700 dark:text-teal-400">
                            {pengajuan.estimasi_skor_kematangan
                                ? Number(pengajuan.estimasi_skor_kematangan).toFixed(0)
                                : '0'}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">Maksimal 60 Poin (Skala IGA)</span>
                    </div>

                    <div className="p-3 bg-muted/30 rounded-lg border border-border">
                        <span className="text-[11px] text-muted-foreground block">Kelengkapan Bukti Dukung</span>
                        <span className="text-xl font-bold text-foreground">
                            {pengajuan.kelengkapan_indikator?.length ?? 0} <span className="text-xs font-normal text-muted-foreground">dari 20 SID</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                            {pengajuan.is_arsip ? 'Arsip Periode Lalu' : 'Periode Berjalan'}
                        </span>
                    </div>

                    <div className="flex flex-col justify-center">
                        <Button asChild variant="outline" className="w-full text-xs border-teal-600 text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30 gap-1.5 cursor-pointer">
                            <Link href={`/inovasi-daerah/${pengajuan.id}/indikator`}>
                                <FolderOpen className="h-3.5 w-3.5" />
                                <span>Buka Lembar Kerja 20 Indikator SID</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
