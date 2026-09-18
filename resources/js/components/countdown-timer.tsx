import { AlertTriangle, Clock, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface CountdownData {
    tahapan_nama: string;
    status: 'upcoming' | 'active' | 'closed';
    target_date: string;
    mulai: string;
    selesai: string;
    is_open: boolean;
    periode_tahun: number;
}

interface Props {
    countdown?: CountdownData | null;
    variant?: 'banner' | 'card' | 'compact';
    className?: string;
}

interface TimeRemaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isFinished: boolean;
}

function calculateTimeRemaining(targetDateIso: string): TimeRemaining {
    const target = new Date(targetDateIso).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isFinished: false };
}

export function CountdownTimer({ countdown, variant = 'banner', className = '' }: Props) {
    if (!countdown) {
        return null;
    }

    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
        calculateTimeRemaining(countdown.target_date)
    );

    useEffect(() => {
        setTimeRemaining(calculateTimeRemaining(countdown.target_date));

        const interval = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining(countdown.target_date));
        }, 1000);

        return () => clearInterval(interval);
    }, [countdown.target_date]);

    const isClosed = countdown.status === 'closed' || (countdown.status === 'active' && timeRemaining.isFinished);
    const isUpcoming = countdown.status === 'upcoming' && !timeRemaining.isFinished;
    const isActive = countdown.status === 'active' && !timeRemaining.isFinished;

    // Varian Banner (Cocok dipasang berdampingan dengan badge HeroBanner)
    if (variant === 'banner') {
        if (isClosed) {
            return (
                <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/30 backdrop-blur-md text-xs font-semibold shadow-xs ${className}`}
                    title={`Pengumpulan berkas inovasi telah berakhir pada ${countdown.selesai}`}
                >
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-300 shrink-0" />
                    <span>Pengumpulan Lomba Berakhir</span>
                </div>
            );
        }

        if (isUpcoming) {
            return (
                <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30 backdrop-blur-md text-xs font-semibold shadow-xs ${className}`}
                    title={`Pendaftaran akan dibuka pada ${countdown.mulai}`}
                >
                    <Clock className="h-3.5 w-3.5 text-sky-300 shrink-0" />
                    <span className="hidden sm:inline">Pendaftaran Lomba:</span>
                    <span>Dibuka dlm {timeRemaining.days}h {timeRemaining.hours}j {timeRemaining.minutes}m</span>
                </div>
            );
        }

        // Active State (Sedang Berjalan)
        return (
            <div
                className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/25 text-white border border-white/20 backdrop-blur-md text-xs shadow-xs transition-all ${className}`}
                title={`Batas akhir pengumpulan berkas lomba inovasi: ${countdown.selesai}`}
            >
                {/* Pulsing indicator */}
                <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                </span>

                <span className="font-medium text-emerald-100/90 hidden sm:inline">
                    Batas Pengumpulan:
                </span>

                <div className="flex items-center gap-1 font-mono font-bold tracking-tight text-amber-300 text-xs">
                    <span className="px-1 py-0.5 rounded bg-black/20 text-amber-200">
                        {timeRemaining.days}h
                    </span>
                    <span className="text-white/60">:</span>
                    <span className="px-1 py-0.5 rounded bg-black/20 text-amber-200">
                        {String(timeRemaining.hours).padStart(2, '0')}j
                    </span>
                    <span className="text-white/60">:</span>
                    <span className="px-1 py-0.5 rounded bg-black/20 text-amber-200">
                        {String(timeRemaining.minutes).padStart(2, '0')}m
                    </span>
                    <span className="text-white/60">:</span>
                    <span className="px-1 py-0.5 rounded bg-black/20 text-amber-300 w-6 text-center inline-block">
                        {String(timeRemaining.seconds).padStart(2, '0')}d
                    </span>
                </div>
            </div>
        );
    }

    // Varian Compact / Card
    if (isClosed) {
        return (
            <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-[11px] font-medium ${className}`}>
                <AlertTriangle className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                <span>Pengumpulan Berakhir</span>
            </div>
        );
    }

    if (isUpcoming) {
        return (
            <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-[11px] font-medium ${className}`}>
                <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <span>Buka dlm {timeRemaining.days} hari</span>
            </div>
        );
    }

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200 border border-amber-300 dark:border-amber-800 text-[11px] font-semibold ${className}`}>
            <Sparkles className="h-3 w-3 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span>Sisa {timeRemaining.days}h {timeRemaining.hours}j {timeRemaining.minutes}m</span>
        </div>
    );
}
