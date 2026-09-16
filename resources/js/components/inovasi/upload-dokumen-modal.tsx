import { useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { FileText, Link2, PlusCircle, UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

interface UploadDokumenModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    inovasiId: number;
}

function formatBytes(bytes: number): string {
    if (!bytes || bytes === 0) return 'Tautan Link';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadDokumenModal({ open, onOpenChange, inovasiId }: UploadDokumenModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [uploadJenis, setUploadJenis] = useState<string>('proposal');
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [namaVideo, setNamaVideo] = useState<string>('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            setSelectedFiles((prev) => [...prev, ...droppedFiles]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...files]);
        }
    };

    const removeSelectedFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploadError(null);
        setUploading(true);

        const formData = new FormData();
        formData.append('jenis', uploadJenis);

        if (uploadJenis === 'video') {
            if (!videoUrl.trim()) {
                setUploadError('URL link video wajib diisi.');
                setUploading(false);
                return;
            }
            formData.append('url', videoUrl);
            if (namaVideo.trim()) formData.append('nama_video', namaVideo);
        } else {
            if (selectedFiles.length === 0) {
                setUploadError('Silakan pilih atau seret berkas file terlebih dahulu.');
                setUploading(false);
                return;
            }
            selectedFiles.forEach((file) => {
                formData.append('dokumen[]', file);
            });
        }

        router.post(`/inovasi/${inovasiId}/dokumen`, formData, {
            onFinish: () => setUploading(false),
            onSuccess: () => {
                onOpenChange(false);
                setSelectedFiles([]);
                setVideoUrl('');
                setNamaVideo('');
            },
            onError: (errs) => {
                const msg = Object.values(errs)[0];
                if (typeof msg === 'string') setUploadError(msg);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-foreground font-bold">
                            <PlusCircle className="h-5 w-5 text-primary" />
                            Unggah Dokumen Pendukung Profil
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Unggah berkas dokumen pendukung profil inovasi (Proposal / Piagam Penghargaan) atau tautkan link video dokumentasi.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Jenis Dokumen Profil</Label>
                            <Select value={uploadJenis} onValueChange={(val) => { setUploadJenis(val); setUploadError(null); }}>
                                <SelectTrigger className="w-full text-xs bg-background">
                                    <SelectValue placeholder="Pilih Jenis Dokumen Profil" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="proposal">1. Proposal / Dokumen Rancang Bangun</SelectItem>
                                    <SelectItem value="penghargaan">2. Sertifikat / Piagam Penghargaan</SelectItem>
                                    <SelectItem value="video">3. Video Dokumentasi (Link YouTube / Drive)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {uploadJenis === 'video' ? (
                            <div className="space-y-3 p-3.5 border rounded-md bg-muted/20">
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold flex items-center gap-1">
                                        <Link2 className="h-3.5 w-3.5 text-primary" /> Tautan Link Video (Google Drive / Cloud Storage / YouTube)
                                    </Label>
                                    <Input
                                        type="url"
                                        placeholder="https://drive.google.com/file/d/... atau https://youtu.be/..."
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        className="text-xs bg-background"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold">Nama / Judul Video (Opsional)</Label>
                                    <Input
                                        type="text"
                                        placeholder="Contoh: Video Dokumentasi Penerapan Inovasi Sumbawa 2026"
                                        value={namaVideo}
                                        onChange={(e) => setNamaVideo(e.target.value)}
                                        className="text-xs bg-background"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Label className="text-xs font-semibold">Berkas Dokumen (Drag & Drop atau Klik Browse)</Label>
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-all ${
                                        isDragging
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40'
                                    }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                    <UploadCloud className="h-10 w-10 text-primary mx-auto mb-2 opacity-80" />
                                    <div className="text-xs font-semibold text-foreground">
                                        Tarik & lepas berkas ke sini, atau <span className="text-primary underline">klik untuk mencari berkas</span>
                                    </div>
                                    <div className="text-[11px] text-muted-foreground mt-1">
                                        Dukungan PDF, DOCX, JPG, PNG (Max 20MB per berkas)
                                    </div>
                                </div>

                                {selectedFiles.length > 0 && (
                                    <div className="space-y-1.5 pt-2">
                                        <Label className="text-[11px] font-bold text-muted-foreground uppercase">
                                            File Terpilih ({selectedFiles.length})
                                        </Label>
                                        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                                            {selectedFiles.map((file, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-2 rounded-md border bg-card text-xs">
                                                    <div className="flex items-center gap-2 truncate">
                                                        <FileText className="h-4 w-4 text-primary shrink-0" />
                                                        <span className="truncate font-medium">{file.name}</span>
                                                        <span className="text-[10px] text-muted-foreground shrink-0">({formatBytes(file.size)})</span>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                                                        onClick={(e) => { e.stopPropagation(); removeSelectedFile(idx); }}
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {uploadError && (
                            <p className="text-xs font-semibold text-destructive">{uploadError}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={uploading} className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold gap-1.5">
                            {uploading ? <Spinner /> : <PlusCircle className="h-4 w-4" />}
                            {uploadJenis === 'video' ? 'Simpan Link Video' : 'Unggah Dokumen'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
