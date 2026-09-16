import { Head, Link, router } from '@inertiajs/react';
import { Bell, Check, CheckCheck, Filter, Inbox, MailOpen } from 'lucide-react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem, Notifikasi } from '@/types';

interface PaginatedNotifikasi {
    data: Notifikasi[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    notifikasi: PaginatedNotifikasi;
    filter: string;
    unreadCount: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Notifikasi',
        href: '/notifikasi',
    },
];

export default function NotifikasiIndex({ notifikasi, filter, unreadCount }: Props) {
    const handleNotificationClick = (item: Notifikasi) => {
        const targetUrl = item.target_url || item.link || '/notifikasi';
        if (!item.dibaca_at) {
            router.post(
                `/notifikasi/${item.id}/baca`,
                { redirect: false },
                { preserveScroll: true, preserveState: true }
            );
        }
        router.visit(targetUrl);
    };

    const handleMarkAsReadOnly = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        router.post(
            `/notifikasi/${id}/baca`,
            { redirect: false },
            { preserveScroll: true }
        );
    };

    const handleMarkAllAsRead = () => {
        router.post(
            '/notifikasi/baca-semua',
            {},
            { preserveScroll: true }
        );
    };

    const handleFilterChange = (newFilter: string) => {
        router.get(
            '/notifikasi',
            { filter: newFilter },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <>
            <Head title="Riwayat Notifikasi" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Header Hero Banner */}
                <HeroBanner
                    badgeIcon={Bell}
                    badgeText="Activity & Notification Center"
                    title="Riwayat Notifikasi Internal"
                    description="Pantau pemberitahuan perubahan status validasi 8 langkah, catatan revisi pendamping, dan pengesahan OPD secara real-time."
                >
                    {unreadCount > 0 && (
                        <Button
                            onClick={handleMarkAllAsRead}
                            className="gap-2 bg-background text-foreground hover:bg-background/90 shadow-xs cursor-pointer"
                        >
                            <CheckCheck className="h-4 w-4 text-primary" />
                            Tandai Semua Dibaca ({unreadCount})
                        </Button>
                    )}
                </HeroBanner>

                <Card>
                    <CardHeader className="pb-3 border-b">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <CardTitle className="text-base font-semibold">
                                Daftar Notifikasi ({notifikasi.total})
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <div className="flex rounded-lg border bg-muted/40 p-1 text-xs">
                                    <button
                                        onClick={() => handleFilterChange('all')}
                                        className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                                            filter === 'all'
                                                ? 'bg-background font-semibold shadow-xs'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Semua
                                    </button>
                                    <button
                                        onClick={() => handleFilterChange('unread')}
                                        className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                                            filter === 'unread'
                                                ? 'bg-background font-semibold shadow-xs'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Belum Dibaca {unreadCount > 0 && `(${unreadCount})`}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {notifikasi.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                                <Inbox className="mb-3 h-12 w-12 opacity-30" />
                                <h3 className="text-sm font-semibold">Tidak ada notifikasi</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {filter === 'unread'
                                        ? 'Semua notifikasi sudah dibaca.'
                                        : 'Belum ada riwayat notifikasi untuk akun Anda.'}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {notifikasi.data.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleNotificationClick(item)}
                                        className={`p-4 transition-colors flex items-start justify-between gap-4 cursor-pointer hover:bg-muted/50 ${
                                            !item.dibaca_at
                                                ? 'bg-primary/5 dark:bg-primary/10'
                                                : 'opacity-80'
                                        }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-0.5">
                                                {!item.dibaca_at ? (
                                                    <span className="flex h-3 w-3 rounded-full bg-primary" />
                                                ) : (
                                                    <MailOpen className="h-4 w-4 text-muted-foreground opacity-50" />
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="capitalize text-xs font-medium">
                                                        {item.tipe.replace('_', ' ')}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                            weekday: 'long',
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-foreground leading-relaxed font-medium">
                                                    {item.pesan}
                                                </p>
                                            </div>
                                        </div>

                                        {!item.dibaca_at && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => handleMarkAsReadOnly(e, item.id)}
                                                className="shrink-0 text-xs h-8 text-muted-foreground hover:text-foreground cursor-pointer"
                                                title="Tandai dibaca saja"
                                            >
                                                <Check className="h-4 w-4 mr-1" />
                                                Tandai dibaca
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination Links */}
                {notifikasi.links.length > 3 && (
                    <div className="flex items-center justify-center space-x-1 py-2">
                        {notifikasi.links.map((link, key) => (
                            link.url ? (
                                <Link
                                    key={key}
                                    href={link.url}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted hover:bg-accent text-foreground'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={key}
                                    className="px-3 py-1.5 rounded-md text-xs text-muted-foreground opacity-50"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

NotifikasiIndex.layout = {
    breadcrumbs,
};
