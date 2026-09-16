import { GitBranch, Calendar, Tag, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface VersiNode {
    id: number;
    nama_inovasi: string;
    tahun: number;
    nama_periode: string;
    status: string;
    penjelasan_pengembangan?: string | null;
    created_at: string;
    is_current: boolean;
    children?: VersiNode[];
}

interface RantaiVersiProps {
    tree: VersiNode;
    className?: string;
}

export function RantaiVersi({ tree, className = '' }: RantaiVersiProps) {
    const renderNode = (node: VersiNode, depth = 0) => {
        const isCurrent = node.is_current;

        return (
            <div key={node.id} className="relative pl-6 pb-6 last:pb-0">
                {/* Vertical line indicator */}
                <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 to-muted last:hidden" />

                {/* Node icon / bullet */}
                <div
                    className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCurrent
                            ? 'bg-primary border-primary text-primary-foreground shadow-md ring-4 ring-primary/20 scale-110'
                            : 'bg-background border-muted-foreground/40 text-muted-foreground'
                    }`}
                >
                    {isCurrent ? (
                        <Sparkles className="h-3 w-3 animate-pulse" />
                    ) : (
                        <CheckCircle2 className="h-3 w-3" />
                    )}
                </div>

                {/* Card details */}
                <div
                    className={`rounded-xl border p-4 transition-all ${
                        isCurrent
                            ? 'bg-card border-primary/40 shadow-sm ring-1 ring-primary/20'
                            : 'bg-muted/30 border-border/60 hover:bg-muted/50'
                    }`}
                >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={isCurrent ? 'default' : 'outline'}
                                className={isCurrent ? 'bg-primary font-bold' : 'font-mono text-xs'}
                            >
                                <Calendar className="h-3 w-3 mr-1" />
                                {node.tahun} ({node.nama_periode})
                            </Badge>
                            {isCurrent && (
                                <Badge variant="secondary" className="text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                    Versi Aktif Saat Ini
                                </Badge>
                            )}
                        </div>
                        <Badge variant="outline" className="capitalize text-xs font-mono">
                            <Tag className="h-3 w-3 mr-1" />
                            {node.status}
                        </Badge>
                    </div>

                    <h4 className="font-bold text-foreground text-base tracking-tight flex items-center gap-2">
                        {node.nama_inovasi}
                    </h4>

                    {node.penjelasan_pengembangan && (
                        <div className="mt-2.5 pt-2.5 border-t border-border/50 text-xs text-muted-foreground bg-background/60 p-2.5 rounded-lg border">
                            <span className="font-semibold text-foreground flex items-center gap-1 mb-1">
                                <FileText className="h-3.5 w-3.5 text-primary" />
                                Catatan / Penjelasan Pengembangan:
                            </span>
                            <p className="whitespace-pre-line leading-relaxed">
                                {node.penjelasan_pengembangan}
                            </p>
                        </div>
                    )}

                    <div className="mt-2 text-[11px] text-muted-foreground/80 flex items-center justify-between">
                        <span>ID Inovasi: #{node.id}</span>
                        <span>Dibuat: {node.created_at}</span>
                    </div>

                    {/* Children nodes (recursive) */}
                    {node.children && node.children.length > 0 && (
                        <div className="mt-4 pt-2">
                            {node.children.map((child) => renderNode(child, depth + 1))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center gap-2 pb-2 border-b">
                <GitBranch className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg text-foreground">
                    Silsilah Versi & Riwayat Pengembangan Inovasi
                </h3>
            </div>

            <div className="pt-2">
                {renderNode(tree)}
            </div>
        </div>
    );
}
