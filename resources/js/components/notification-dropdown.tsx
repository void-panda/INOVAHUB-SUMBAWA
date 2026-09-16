import { Link, router, usePage } from '@inertiajs/react';
import { Bell, CheckCheck, Inbox } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Auth, Notifikasi } from '@/types';

export function NotificationDropdown() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const unreadCount = auth.unreadNotificationsCount || 0;
    const recentNotifications: Notifikasi[] = auth.recentNotifications || [];

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

    const handleMarkAllAsRead = () => {
        router.post(
            '/notifikasi/baca-semua',
            {},
            { preserveScroll: true }
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 cursor-pointer"
                    aria-label="Notifikasi"
                >
                    <Bell className="h-5 w-5 opacity-80 hover:opacity-100" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 sm:w-96" align="end">
                <DropdownMenuLabel className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm">Notifikasi</span>
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="px-1.5 py-0.5 text-[10px]">
                                {unreadCount} baru
                            </Badge>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <CheckCheck className="mr-1 h-3.5 w-3.5" />
                            Tandai semua dibaca
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {recentNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                        <Inbox className="mb-2 h-8 w-8 opacity-40" />
                        <p className="text-xs">Belum ada notifikasi</p>
                    </div>
                ) : (
                    <div className="max-h-[300px] overflow-y-auto">
                        {recentNotifications.map((item) => (
                            <DropdownMenuItem
                                key={item.id}
                                onClick={() => handleNotificationClick(item)}
                                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                                    !item.dibaca_at
                                        ? 'bg-accent/40 font-medium'
                                        : 'opacity-75'
                                }`}
                            >
                                <div className="flex w-full items-center justify-between gap-2">
                                    <span className="text-xs font-semibold capitalize text-primary">
                                        {item.tipe.replace('_', ' ')}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <p className="text-xs leading-relaxed text-foreground line-clamp-2">
                                    {item.pesan}
                                </p>
                            </DropdownMenuItem>
                        ))}
                    </div>
                )}

                <DropdownMenuSeparator />
                <div className="p-1 text-center">
                    <Link
                        href="/notifikasi"
                        className="block w-full py-1.5 text-center text-xs font-medium text-primary hover:underline"
                    >
                        Lihat Semua Notifikasi
                    </Link>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
