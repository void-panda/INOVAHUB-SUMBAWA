import type { User } from './auth';

export type StatusInovasiType =
    | 'draft'
    | 'diajukan'
    | 'divalidasi'
    | 'revisi'
    | 'disetujui'
    | 'disahkan_opd'
    | 'review_internal'
    | 'siap_kirim'
    | 'terkirim';

export type StatusPengajuanType =
    | 'dalam_pendampingan'
    | 'disahkan_opd'
    | 'review_internal'
    | 'siap_kirim'
    | 'terkirim';

export type TahapanInovasiType = 'inisiatif' | 'ujicoba' | 'penerapan';

export type JenisInovasiType = 'pelayanan_publik' | 'tata_kelola' | 'lainnya';

export type BentukInovasiType = 'inovasi_daerah' | 'inovasi_masyarakat';

export interface Opd {
    id: number;
    nama: string;
    kode: string;
    singkatan?: string | null;
    alamat?: string | null;
    telepon?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface PeriodeLomba {
    id: number;
    tahun: number;
    nama: string;
    aktif: boolean;
    tanggal_mulai?: string | null;
    tanggal_selesai?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface InovasiDokumen {
    id: number;
    inovasi_id: number;
    pengajuan_lomba_id?: number | null;
    indikator_sid_id?: number | null;
    nomor_surat?: string | null;
    tanggal_surat?: string | null;
    tentang?: string | null;
    jenis: string;
    path: string;
    nama_asal: string;
    mime: string;
    ukuran: number;
    created_at?: string;
    updated_at?: string;
}

export interface ValidasiLog {
    id: number;
    inovasi_id?: number | null;
    pengajuan_lomba_id?: number | null;
    user_id: number;
    status_sebelum: string | null;
    status_sesudah: string;
    catatan: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
}

export interface SkorPengajuan {
    id: number;
    pengajuan_lomba_id: number;
    indikator_id: number;
    tier: number;
    skor: number;
    catatan?: string | null;
    komentar_pendamping?: string | null;
    pendamping_id?: number | null;
    komentar_at?: string | null;
    pendamping?: User;
}

export interface KelengkapanIndikator {
    id: number;
    pengajuan_lomba_id: number;
    indikator_sid_id: number;
    parameter: string | null;
    catatan?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface PengajuanLomba {
    id: number;
    inovasi_id: number;
    periode_lomba_id?: number | null;
    user_id: number;
    is_inovasi_daerah: boolean;
    status: StatusPengajuanType;
    is_arsip: boolean;
    penjelasan_pengembangan?: string | null;
    pengajuan_asal_id?: number | null;
    estimasi_skor_kematangan?: number | null;
    created_at?: string;
    updated_at?: string;
    inovasi?: Inovasi;
    periode_lomba?: PeriodeLomba | null;
    user?: User;
    skor_pengajuan?: SkorPengajuan[];
    kelengkapan_indikator?: KelengkapanIndikator[];
    dokumen?: InovasiDokumen[];
    penilaian_juri?: Array<{
        id: number;
        pengajuan_lomba_id: number;
        juri_user_id: number;
        nilai: number;
        catatan?: string | null;
        created_at?: string;
        updated_at?: string;
    }>;
}

export interface Inovasi {
    id: number;
    user_id: number;
    opd_id: number | null;
    is_inovasi_daerah: boolean;
    nama_inovasi: string;
    tahapan: TahapanInovasiType;
    inisiator?: string | null;
    bentuk_inovasi?: string | null;
    jenis_inovasi?: string | null;
    klasifikasi?: string | null;
    tematik?: string | null;
    kriteria_inovasi?: string | null;
    nama_inisiator: string;
    koordinat: string;
    lokasi?: string | null;
    urusan_utama: string | null;
    urusan_wajib: string | null;
    waktu_uji_coba: string | null;
    waktu_penerapan: string;
    waktu_pengembangan: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    opd?: Opd | null;
    dokumen?: InovasiDokumen[];
    pengajuan_lomba?: PengajuanLomba[];
    validasi_logs?: ValidasiLog[];
    status?: string;
}

export interface PenugasanPendamping {
    id: number;
    pendamping_id: number;
    opd_id: number | null;
    inovator_id: number | null;
    periode_lomba_id: number;
    created_at?: string;
    updated_at?: string;
    pendamping?: User;
    opd?: Opd | null;
    inovator?: User | null;
    periode_lomba?: PeriodeLomba;
}

export interface Notifikasi {
    id: number;
    user_id: number;
    tipe: string;
    pesan: string;
    link?: string | null;
    target_url?: string;
    dibaca_at: string | null;
    created_at: string;
    updated_at: string;
}
