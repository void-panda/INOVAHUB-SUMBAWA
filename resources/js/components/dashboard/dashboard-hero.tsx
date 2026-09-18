import React from 'react';
import { Link } from '@inertiajs/react';
import { ShieldCheck, Sliders, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CountdownTimer, type CountdownData } from '@/components/countdown-timer';
import { create } from '@/routes/inovasi';

interface DashboardHeroProps {
    userName?: string;
    userRole: string;
    periode?: { id: number; tahun: string | number; nama?: string } | null;
    countdown?: CountdownData | null;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
    userName = 'Pengguna',
    userRole,
    periode,
    countdown,
}) => {
    return (
        <div className="relative overflow-hidden rounded-md border border-primary/20 bg-gradient-to-r from-primary via-primary/95 to-primary/85 p-6 md:p-8 shadow-xs text-primary-foreground">
            {/* Kemang Satange Motif Silhouette */}
            <svg
                className="absolute right-0 top-0 bottom-0 h-full w-auto max-w-[55%] opacity-10 pointer-events-none text-primary-foreground fill-current select-none"
                viewBox="0 0 400 200"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g transform="translate(260, 100) scale(1.15)">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                        <g key={angle} transform={`rotate(${angle})`}>
                            <path d="M0 0 C-10 -30 -25 -50 0 -80 C25 -50 10 -30 0 0" />
                            <circle cx="0" cy="-45" r="4" fill="currentColor" />
                            <path d="M-5 -25 L0 -35 L5 -25 L0 -15 Z" />
                        </g>
                    ))}
                    <circle cx="0" cy="0" r="22" fill="none" stroke="currentColor" strokeWidth="3" />
                    <circle cx="0" cy="0" r="55" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                    <polygon
                        points="0,-85 60,-60 85,0 60,60 0,85 -60,60 -85,0 -60,-60"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                </g>
            </svg>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-primary-foreground/15 text-primary-foreground border-none backdrop-blur-md text-xs font-bold">
                            <Sparkles className="mr-1 h-3.5 w-3.5" />
                            {userRole === 'inovator' && 'Portal Inovator OPD & Masyarakat'}
                            {userRole === 'pendamping' && 'Portal Pendamping & Verifikator OPD'}
                            {userRole === 'pimpinan' && 'Executive Dashboard Pimpinan Daerah'}
                            {userRole === 'tim_penilai' && 'Dashboard Analytics Makro Sumbawa'}
                        </Badge>
                        {periode && (
                            <Badge className="bg-background text-foreground font-extrabold text-xs shadow-2xs border border-border/40">
                                Periode Lomba {periode.tahun ?? '2026'}
                            </Badge>
                        )}
                        {countdown && <CountdownTimer countdown={countdown} variant="banner" />}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary-foreground">
                        Selamat datang, {userName}!
                    </h1>
                    <p className="text-xs md:text-sm text-primary-foreground/80 leading-relaxed">
                        Database Inovasi Daerah Sumbawa yang Lengkap dan Akurat — Quality Assurance Layer IGA 2026.
                    </p>
                </div>

                {/* Action buttons filtered by role */}
                <div className="flex flex-wrap gap-2.5 shrink-0">
                    {userRole === 'inovator' && (
                        <Button
                            asChild
                            className="gap-2 bg-background hover:bg-background/90 text-foreground font-bold shadow-xs"
                        >
                            <Link href={create()}>
                                <Sparkles className="h-4 w-4 text-primary" /> Input Inovasi Baru
                            </Link>
                        </Button>
                    )}
                    {userRole === 'pendamping' && (
                        <Button
                            asChild
                            className="gap-2 bg-background hover:bg-background/90 text-foreground font-bold shadow-xs"
                        >
                            <Link href="/pendamping">
                                <ShieldCheck className="h-4 w-4 text-primary" /> Verifikasi Usulan
                            </Link>
                        </Button>
                    )}
                    {(userRole === 'tim_penilai' || userRole === 'pimpinan') && (
                        <Button
                            asChild
                            className="gap-2 bg-background hover:bg-background/90 text-foreground font-bold shadow-xs"
                        >
                            <Link href="/simulasi">
                                <Sliders className="h-4 w-4 text-primary" /> Simulasi IID & Yandas
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
