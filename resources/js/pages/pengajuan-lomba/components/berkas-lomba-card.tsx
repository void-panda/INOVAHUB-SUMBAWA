import { Award, Download, ExternalLink, Eye, FileText, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PengajuanLomba } from '@/types/models';

export interface DokumenUmumItem {
    id: number;
    nama_asal: string;
    jenis: string;
    mime: string;
    path: string;
    ukuran: number;
}

interface BerkasLombaCardProps {
    pengajuan: PengajuanLomba;
    dokumenUmum?: DokumenUmumItem[];
}

function formatBytes(bytes: number): string {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function BerkasLombaCard({ pengajuan, dokumenUmum = [] }: BerkasLombaCardProps) {
    const inovasi = pengajuan.inovasi;

    return (
        <Card className="border-border bg-card">
            <CardHeader className="p-4 pb-3 border-b border-border">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-teal-600" />
                    Profil Inovasi & Berkas Lomba
                </CardTitle>
                <CardDescription className="text-xs">
                    Informasi lengkap inovasi dan berkas administrasi peserta lomba.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                        <span className="text-muted-foreground block text-[11px]">Nama Inovasi:</span>
                        <span className="font-semibold text-foreground">{inovasi?.nama_inovasi}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground block text-[11px]">Inisiator & OPD:</span>
                        <span className="font-semibold text-foreground">
                            {inovasi?.nama_inisiator} ({inovasi?.opd?.nama ?? 'Publik'})
                        </span>
                    </div>
                    <div>
                        <span className="text-muted-foreground block text-[11px]">Tahapan Inovasi:</span>
                        <span className="capitalize font-semibold text-foreground">{inovasi?.tahapan}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground block text-[11px]">Urusan Utama:</span>
                        <span className="font-semibold text-foreground">{inovasi?.urusan_utama ?? '-'}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground block text-[11px]">Waktu Penerapan:</span>
                        <span className="font-semibold text-foreground">
                            {inovasi?.waktu_penerapan?.slice(0, 10) || '-'}
                        </span>
                    </div>
                    <div>
                        <span className="text-muted-foreground block text-[11px]">Status Penetapan Daerah:</span>
                        {pengajuan.is_inovasi_daerah ? (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-[10px] font-semibold gap-1 inline-flex items-center">
                                <Award className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                <span>Ditetapkan Inovasi Daerah</span>
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="text-[10px] text-muted-foreground font-normal">
                                Peserta Usulan Lomba
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Rancang Bangun */}
                {inovasi?.rancang_bangun && (
                    <div className="pt-3 border-t border-border space-y-1.5">
                        <span className="text-[11px] font-semibold text-foreground block">
                            Rancang Bangun & Pokok Perubahan:
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-md border">
                            {inovasi.rancang_bangun}
                        </p>
                    </div>
                )}

                {/* Berkas Dokumen Pendukung Lomba */}
                <div className="pt-3 border-t border-border space-y-3">
                    <span className="text-xs font-semibold text-foreground block">
                        Berkas Dokumen Pendukung Lomba
                    </span>

                    {/* Video Dokumentasi */}
                    {inovasi?.link_video ? (
                        <div className="p-3 rounded-md border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/20 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-xs font-semibold text-teal-900 dark:text-teal-300">
                                <Video className="h-4 w-4 text-teal-600 shrink-0" />
                                <span>Video Dokumentasi Inovasi</span>
                            </div>
                            <a
                                href={inovasi.link_video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors shrink-0"
                            >
                                <span>Tonton Video</span>
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    ) : (
                        <div className="p-2.5 rounded-md border border-dashed text-xs text-muted-foreground flex items-center gap-2">
                            <Video className="h-3.5 w-3.5 opacity-50" />
                            <span>Tautan video dokumentasi belum dicantumkan.</span>
                        </div>
                    )}

                    {/* Daftar Berkas Umum (Proposal, PPT, Piagam) */}
                    {dokumenUmum && dokumenUmum.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {dokumenUmum.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="p-3 rounded-md border bg-card hover:bg-muted/30 transition-colors flex items-center justify-between gap-2"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <FileText className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                                            <span className="font-semibold text-xs text-foreground truncate block" title={doc.nama_asal}>
                                                {doc.nama_asal}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-2">
                                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 capitalize">
                                                {doc.jenis.replace(/_/g, ' ')}
                                            </Badge>
                                            <span>•</span>
                                            <span>{formatBytes(doc.ukuran)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        <a
                                            href={`/inovasi/dokumen/${doc.id}/preview`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                            title="Pratinjau Dokumen"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                        </a>
                                        <a
                                            href={`/inovasi/dokumen/${doc.id}/download`}
                                            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                            title="Unduh Berkas"
                                        >
                                            <Download className="h-3.5 w-3.5" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-2.5 rounded-md border border-dashed text-xs text-muted-foreground flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 opacity-50" />
                            <span>Belum ada dokumen umum (Proposal/PPT/Piagam) diunggah.</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
