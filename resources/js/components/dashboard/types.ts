import type { CountdownData } from '@/components/countdown-timer';

export interface MetricSummary {
    total_inovasi: number;
    siap_kirim_count: number;
    opd_aktif_count: number;
    iid_score: number;
    kategori_iga: {
        label: string;
        color: string;
        bg: string;
        badge: 'default' | 'secondary' | 'outline' | 'destructive';
    };
    yandas_compliant: boolean;
    yandas_count: number;
}

export interface InovasiSummaryItem {
    id: number;
    nama_inovasi: string;
    tahapan: string;
    status: string;
    updated_at: string;
    created_at?: string;
    dokumen_count?: number;
    indikator_filled?: number;
    skor_kematangan?: number | string;
    opd_nama?: string;
    inisiator?: string;
}

export interface RevisiAlertItem {
    id: number;
    inovasi_id: number;
    nama_inovasi: string;
    catatan: string;
    created_at?: string;
}

export interface TopOpdItem {
    id: number;
    kode: string;
    nama: string;
    total_inovasi: number;
    approved_count: number;
    avg_skor: number;
}

export interface AuditLogItem {
    id: number;
    user_nama: string;
    inovasi_nama: string;
    status_sebelum: string;
    status_sesudah: string;
    catatan: string | null;
    created_at: string;
}

export interface TimelineItem {
    id: number;
    nama: string;
    mulai: string;
    selesai: string;
    is_current: boolean;
    is_passed: boolean;
}

export interface DashboardMetrics {
    user_role: string;
    role_data: Record<string, any>;
    periode: { id: number; tahun: string | number; nama?: string } | null;
    countdown?: CountdownData | null;
    summary: MetricSummary;
    status_counts: Record<string, number>;
    tahapan_counts: {
        inisiatif: number;
        ujicoba: number;
        penerapan: number;
    };
    urusan_distribution: { urusan: string; count: number }[];
    top_opd: TopOpdItem[];
    recent_logs: AuditLogItem[];
    recent_inovasi: {
        id: number;
        nama_inovasi: string;
        status: string;
        tahapan: string;
        opd_nama: string;
        created_at: string;
    }[];
    linimasa: TimelineItem[];
    performance?: {
        total_validasi_logs: number;
        revisi_rate: number;
        avg_turnaround_hours: number;
    };
    simulasi_brief?: {
        spd_score: number;
        sid_score: number;
        skor_jumlah_inovasi: number;
        total_skor: number;
    };
}
