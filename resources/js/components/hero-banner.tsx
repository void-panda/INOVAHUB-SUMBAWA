import React from 'react';
import { Badge } from '@/components/ui/badge';

interface HeroBannerProps {
    badgeIcon?: React.ElementType;
    badgeText: string;
    title: string;
    description: string;
    variant?: string; // Maintained for API compatibility, all use uniform teal motif banner
    children?: React.ReactNode;
    childrenClassName?: string;
    extraContent?: React.ReactNode;
}

const KemangSatangeMotif = () => (
    <svg
        className="absolute right-0 top-0 bottom-0 h-full w-auto max-w-[55%] opacity-10 pointer-events-none text-primary-foreground fill-current select-none"
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Main Kemang Satange 8-petaled floral star motif */}
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
            <polygon points="0,-85 60,-60 85,0 60,60 0,85 -60,60 -85,0 -60,-60" fill="none" stroke="currentColor" strokeWidth="2" />
        </g>
        {/* Complementary secondary motifs */}
        <g transform="translate(370, 35) scale(0.65)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <g key={angle} transform={`rotate(${angle})`}>
                    <path d="M0 0 C-10 -30 -25 -50 0 -80 C25 -50 10 -30 0 0" />
                </g>
            ))}
            <circle cx="0" cy="0" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
        </g>
        <g transform="translate(370, 165) scale(0.65)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <g key={angle} transform={`rotate(${angle})`}>
                    <path d="M0 0 C-10 -30 -25 -50 0 -80 C25 -50 10 -30 0 0" />
                </g>
            ))}
            <circle cx="0" cy="0" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
        </g>
    </svg>
);

export function HeroBanner({
    badgeIcon: BadgeIcon,
    badgeText,
    title,
    description,
    children,
    childrenClassName,
    extraContent,
}: HeroBannerProps) {
    return (
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary via-primary/95 to-primary/85 p-6 md:p-8 text-primary-foreground shadow-xs">
            {/* Motif Kemang Satange Background Silhouette Overlay */}
            <KemangSatangeMotif />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground border-none backdrop-blur-md text-xs font-semibold px-3 py-1 flex items-center gap-1.5">
                            {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5 text-amber-300 shrink-0" />}
                            <span>{badgeText}</span>
                        </Badge>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary-foreground">
                        {title}
                    </h1>
                    <p className="text-xs md:text-sm text-primary-foreground/85 leading-relaxed">
                        {description}
                    </p>
                    {extraContent && (
                        <div className="pt-1">
                            {extraContent}
                        </div>
                    )}
                </div>

                {children && (
                    <div className={childrenClassName ?? "flex items-center gap-3 shrink-0 flex-wrap"}>
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
