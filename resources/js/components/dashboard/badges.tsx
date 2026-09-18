import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const STATUS_LABELS: Record<string, string> = {
    draft: 'Draft',
    diajukan: 'Diajukan',
    divalidasi: 'Divalidasi',
    revisi: 'Revisi',
    disetujui: 'Disetujui',
    disahkan_opd: 'Disahkan OPD',
    review_internal: 'Review Internal',
    siap_kirim: 'Siap Kirim',
    terkirim: 'Terkirim',
};

export const STATUS_COLORS: Record<string, string> = {
    draft: '#94a3b8',
    diajukan: '#3b82f6',
    divalidasi: '#6366f1',
    revisi: '#f59e0b',
    disetujui: '#10b981',
    disahkan_opd: '#14b8a6',
    review_internal: '#8b5cf6',
    siap_kirim: '#059669',
    terkirim: '#0284c7',
};

interface TahapanBadgeProps {
    tahapan: string;
    className?: string;
}

export const TahapanBadge: React.FC<TahapanBadgeProps> = ({ tahapan, className }) => {
    switch (tahapan) {
        case 'penerapan':
            return (
                <Badge className={`bg-primary text-primary-foreground text-[10px] font-semibold ${className ?? ''}`}>
                    Penerapan (Siap IGA)
                </Badge>
            );
        case 'ujicoba':
            return (
                <Badge
                    variant="outline"
                    className={`text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950/30 text-[10px] ${className ?? ''}`}
                >
                    Uji Coba
                </Badge>
            );
        case 'inisiatif':
        default:
            return (
                <Badge variant="secondary" className={`text-muted-foreground text-[10px] ${className ?? ''}`}>
                    Inisiatif
                </Badge>
            );
    }
};

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
    switch (status) {
        case 'draft':
            return <Badge variant="secondary" className={`text-[10px] ${className ?? ''}`}>Draft</Badge>;
        case 'diajukan':
            return (
                <Badge
                    variant="outline"
                    className={`text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950/30 text-[10px] ${className ?? ''}`}
                >
                    Diajukan
                </Badge>
            );
        case 'divalidasi':
            return (
                <Badge
                    variant="outline"
                    className={`text-indigo-600 border-indigo-300 bg-indigo-50 dark:bg-indigo-950/30 text-[10px] ${className ?? ''}`}
                >
                    Divalidasi
                </Badge>
            );
        case 'revisi':
            return (
                <Badge variant="destructive" className={`text-[10px] font-bold gap-1 ${className ?? ''}`}>
                    <AlertCircle className="h-3 w-3" /> Perlu Revisi
                </Badge>
            );
        case 'disetujui':
            return (
                <Badge
                    variant="outline"
                    className={`text-primary border-primary/40 bg-primary/10 text-[10px] font-semibold ${className ?? ''}`}
                >
                    Disetujui
                </Badge>
            );
        case 'disahkan_opd':
            return (
                <Badge
                    variant="outline"
                    className={`text-primary border-primary/40 bg-primary/10 text-[10px] font-semibold ${className ?? ''}`}
                >
                    Disahkan OPD
                </Badge>
            );
        case 'review_internal':
            return (
                <Badge
                    variant="outline"
                    className={`text-purple-600 border-purple-300 bg-purple-50 dark:bg-purple-950/30 text-[10px] ${className ?? ''}`}
                >
                    Review Internal
                </Badge>
            );
        case 'siap_kirim':
            return <Badge className={`bg-primary text-primary-foreground text-[10px] font-bold ${className ?? ''}`}>Siap Kirim</Badge>;
        case 'terkirim':
            return <Badge className={`bg-primary text-primary-foreground text-[10px] font-bold ${className ?? ''}`}>Terkirim</Badge>;
        default:
            return (
                <Badge variant="outline" className={`text-[10px] capitalize ${className ?? ''}`}>
                    {status.replace('_', ' ')}
                </Badge>
            );
    }
};
