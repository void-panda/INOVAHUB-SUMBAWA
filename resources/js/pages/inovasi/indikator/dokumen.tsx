import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Clock,
    Download,
    Eye,
    FileText,
    FolderPlus,
    Info,
    MessageSquare,
    Plus,
    Trash2,
    UploadCloud,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { HeroBanner } from '@/components/hero-banner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type DokumenItem = {
    id: number;
    inovasi_id: number;
    pengajuan_lomba_id?: number | null;
    indikator_sid_id: number | null;
    nomor_surat?: string | null;
    tanggal_surat?: string | null;
    tentang?: string | null;
    jenis: string;
    path: string;
    nama_asal: string;
    mime: string;
    ukuran: number;
    created_at: string;
};

type IndikatorInfo = {
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

type PengajuanInfo = {
    id: number;
    inovasi_id: number;
    nama_inovasi: string;
    status: string;
    is_arsip?: boolean;
};

type Props = {
    pengajuan: PengajuanInfo;
    indikator: IndikatorInfo;
    dokumenList: DokumenItem[];
    kelengkapan: { parameter: string | null; catatan: string | null } | null;
    skor?: {
        komentar_pendamping?: string | null;
        status_validasi?: 'belum_divalidasi' | 'valid' | 'perlu_revisi' | string | null;
        komentar_at?: string | null;
        updated_at?: string | null;
        pendamping?: { name: string } | null;
    } | null;
};

function formatBytes(bytes: number): string {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDateTime(dateStr?: string | null): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';
    const d = date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    const t = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).replace('.', ':');
    return `${d}, ${t}`;
}

export default function IndikatorDokumenPage({
    pengajuan,
    indikator,
    dokumenList,
    kelengkapan,
    skor,
}: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);

    const [nomorSurat, setNomorSurat] = useState('');
    const [tanggalSurat, setTanggalSurat] = useState('');
    const [tentang, setTentang] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<DokumenItem | null>(null);

    const isLocked = pengajuan.status !== 'dalam_pendampingan' || Boolean(pengajuan.is_arsip);

    const openUploadModal = () => {
        setSelectedFiles([]);
        setNomorSurat('');
        setTanggalSurat(new Date().toISOString().slice(0, 10));
        setTentang('');
        setUploadError(null);
        setUploadModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setSelectedFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFiles.length === 0) {
            setUploadError('Silakan pilih minimal 1 file dokumen.');
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append('dokumen[]', file);
        });

        if (nomorSurat.trim()) formData.append('nomor_surat', nomorSurat.trim());
        if (tanggalSurat) formData.append('tanggal_surat', tanggalSurat);
        if (tentang.trim()) formData.append('tentang', tentang.trim());

        router.post(
            `/pengajuan-lomba/${pengajuan.id}/indikator/${indikator.id}/dokumen`,
            formData,
            {
                forceFormData: true,
                onSuccess: () => {
                    setUploadModalOpen(false);
                    setSelectedFiles([]);
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0] as string;
                    setUploadError(firstError || 'Gagal mengunggah dokumen.');
                },
                onFinish: () => setIsUploading(false),
            }
        );
    };

    const handleDelete = () => {
        if (!deleteTarget) return;

        router.delete(
            `/pengajuan-lomba/${pengajuan.id}/indikator/dokumen/${deleteTarget.id}`,
            {
                onSuccess: () => setDeleteTarget(null),
            }
        );
    };

    return (
        <>
            <Head title={`Dokumen Bukti: ${indikator.kode} - ${pengajuan.nama_inovasi}`} />

            <div className="flex flex-col space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
                {/* Header Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 text-xs w-fit">
                        <Link href={`/pengajuan-lomba/${pengajuan.id}/indikator`}>
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Kembali ke 20 Indikator SID</span>
                        </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                        {!isLocked && (
                            <Button
                                size="sm"
                                onClick={openUploadModal}
                                className="h-8 gap-1.5 text-xs bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Upload Dokumen Baru</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Hero Banner Sumbawa */}
                <HeroBanner
                    title={`Berkas Bukti Dukung: ${indikator.kode} - ${indikator.nama}`}
                    subtitle={`Inovasi: ${pengajuan.nama_inovasi}. Unggah surat keputusan, regulasi, foto, atau dokumentasi teknis pendukung.`}
                    badgeText="Dokumen Pembuktian Mutu"
                />

                {/* Info & Komentar Pendamping (Jika ada) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Petunjuk Bukti */}
                    <Card className="border-border bg-card">
                        <CardContent className="p-4 space-y-2">
                            <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                <Info className="h-4 w-4 text-teal-600" />
                                <span>Petunjuk Teknis Bukti Dukung IGA</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {indikator.informasi || 'Pastikan dokumen yang diunggah berupa SK, laporan, atau regulasi bertanda tangan resmi serta cap stempel basah atau TTE terverifikasi.'}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Catatan Pendamping */}
                    <Card className="border-border bg-card">
                        <CardContent className="p-4 space-y-2">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                    <MessageSquare className="h-4 w-4 text-amber-600" />
                                    <span>Catatan Review Pendamping</span>
                                </div>
                                {skor?.status_validasi === 'valid' && (
                                    <Badge
                                        variant="outline"
                                        className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 text-[10px] gap-1 font-semibold"
                                    >
                                        <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                        <span>Valid</span>
                                    </Badge>
                                )}
                                {skor?.status_validasi === 'perlu_revisi' && (
                                    <Badge
                                        variant="outline"
                                        className="bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800 text-[10px] gap-1 font-semibold"
                                    >
                                        <AlertCircle className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                                        <span>Perlu Revisi</span>
                                    </Badge>
                                )}
                                {(!skor?.status_validasi || skor?.status_validasi === 'belum_divalidasi') && (
                                    <Badge
                                        variant="outline"
                                        className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 text-[10px] gap-1 font-semibold"
                                    >
                                        <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                        <span>Belum Divalidasi</span>
                                    </Badge>
                                )}
                            </div>
                            {skor?.komentar_pendamping ? (
                                <div className="text-xs text-foreground bg-amber-50/70 dark:bg-amber-950/30 p-2.5 rounded border border-amber-200 dark:border-amber-800 leading-relaxed">
                                    {skor.komentar_pendamping}
                                    <div className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1.5 flex-wrap">
                                        <span>Oleh: {skor.pendamping?.name ?? 'Pendamping Inovasi'}</span>
                                        {(skor.komentar_at || skor.updated_at) && (
                                            <>
                                                <span>•</span>
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{formatDateTime(skor.komentar_at || skor.updated_at)}</span>
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground italic">
                                    Belum ada catatan khusus dari pendamping untuk indikator ini.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Tabel Dokumen Dukung */}
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="w-[50px] text-center font-semibold">NO</TableHead>
                                <TableHead className="min-w-[200px] font-semibold">NAMA FILE / BERKAS</TableHead>
                                <TableHead className="min-w-[180px] font-semibold">NOMOR & TGL SURAT</TableHead>
                                <TableHead className="min-w-[200px] font-semibold">TENTANG / PERIHAL</TableHead>
                                <TableHead className="w-[100px] text-center font-semibold">UKURAN</TableHead>
                                <TableHead className="w-[140px] text-right font-semibold">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dokumenList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <FileText className="h-8 w-8 text-muted-foreground/50" />
                                            <span>Belum ada dokumen bukti yang diunggah untuk indikator ini.</span>
                                            {!isLocked && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={openUploadModal}
                                                    className="mt-1 h-7 text-xs"
                                                >
                                                    Upload Dokumen Sekarang
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                dokumenList.map((doc, idx) => (
                                    <TableRow key={doc.id} className="hover:bg-muted/30">
                                        <TableCell className="text-center font-mono text-xs text-muted-foreground">
                                            {idx + 1}
                                        </TableCell>

                                        <TableCell className="space-y-0.5">
                                            <div className="font-semibold text-xs text-foreground flex items-center gap-2">
                                                <FileText className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                                                <span>{doc.nama_asal}</span>
                                            </div>
                                            <div className="text-[10px] text-muted-foreground">
                                                Diupload pada: {doc.created_at?.slice(0, 10) || '-'}
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-xs">
                                            <div className="font-medium text-foreground">
                                                {doc.nomor_surat || '-'}
                                            </div>
                                            <div className="text-[11px] text-muted-foreground">
                                                {doc.tanggal_surat || '-'}
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-xs text-muted-foreground leading-relaxed">
                                            {doc.tentang || '-'}
                                        </TableCell>

                                        <TableCell className="text-center font-mono text-xs text-muted-foreground">
                                            {formatBytes(doc.ukuran)}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                    className="h-7 px-2 text-xs gap-1"
                                                    title="Pratinjau File"
                                                >
                                                    <a
                                                        href={`/inovasi/dokumen/${doc.id}/preview`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        <span className="hidden lg:inline">Lihat</span>
                                                    </a>
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    className="h-7 px-2 text-xs"
                                                    title="Unduh File"
                                                >
                                                    <a href={`/inovasi/dokumen/${doc.id}/download`}>
                                                        <Download className="h-3.5 w-3.5 text-muted-foreground" />
                                                    </a>
                                                </Button>

                                                {!isLocked && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setDeleteTarget(doc)}
                                                        className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                                                        title="Hapus File"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal Upload Dokumen Baru */}
            <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleUploadSubmit}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-foreground text-base">
                                <UploadCloud className="h-5 w-5 text-teal-600" />
                                Upload Dokumen Bukti: {indikator.kode}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Masukkan kelengkapan data surat/dokumen dan unggah berkas pendukung resmi.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-3 py-3">
                            {uploadError && (
                                <div className="p-2.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                                    {uploadError}
                                </div>
                            )}

                            <div>
                                <Label htmlFor="nomorSurat" className="text-xs font-semibold">
                                    Nomor Surat / Dokumen
                                </Label>
                                <Input
                                    id="nomorSurat"
                                    placeholder="Contoh: 050/123/Bappeda/2026"
                                    value={nomorSurat}
                                    onChange={(e) => setNomorSurat(e.target.value)}
                                    className="h-8 text-xs mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="tanggalSurat" className="text-xs font-semibold">
                                    Tanggal Surat
                                </Label>
                                <Input
                                    id="tanggalSurat"
                                    type="date"
                                    value={tanggalSurat}
                                    onChange={(e) => setTanggalSurat(e.target.value)}
                                    className="h-8 text-xs mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="tentang" className="text-xs font-semibold">
                                    Tentang / Perihal
                                </Label>
                                <Input
                                    id="tentang"
                                    placeholder="Contoh: SK Penetapan Tim Inovasi Pelayanan"
                                    value={tentang}
                                    onChange={(e) => setTentang(e.target.value)}
                                    className="h-8 text-xs mt-1"
                                />
                            </div>

                            {/* Drag & Drop File Zone */}
                            <div>
                                <Label className="text-xs font-semibold">Berkas Dokumen (PDF, DOCX, JPG, PNG)</Label>
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                    }}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`mt-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                                        isDragging
                                            ? 'border-teal-600 bg-teal-50/30'
                                            : 'border-border hover:border-teal-500'
                                    }`}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        multiple
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
                                    />
                                    <UploadCloud className="h-6 w-6 text-muted-foreground mx-auto mb-1.5" />
                                    <p className="text-xs font-medium text-foreground">
                                        Klik atau seret file ke area ini
                                    </p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                        Maksimal 20 MB per berkas
                                    </p>
                                </div>

                                {selectedFiles.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        <p className="text-[11px] font-semibold text-foreground">File Terpilih:</p>
                                        <div className="space-y-1 max-h-24 overflow-y-auto">
                                            {selectedFiles.map((file, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center justify-between text-xs bg-muted p-1.5 rounded"
                                                >
                                                    <span className="truncate max-w-[280px]">{file.name}</span>
                                                    <span className="text-muted-foreground text-[10px]">
                                                        {formatBytes(file.size)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setUploadModalOpen(false)}
                                disabled={isUploading}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                className="bg-teal-600 hover:bg-teal-700 text-white"
                                disabled={isUploading}
                            >
                                {isUploading ? 'Mengunggah...' : 'Upload Dokumen'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Alert Dialog Konfirmasi Hapus Dokumen */}
            <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Dokumen Bukti?</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs">
                            Dokumen <strong>{deleteTarget?.nama_asal}</strong> akan dihapus permanen dari sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel size="sm">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            size="sm"
                            onClick={handleDelete}
                            className="bg-destructive hover:bg-destructive/90 text-white"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
