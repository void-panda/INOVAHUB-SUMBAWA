import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, LogOut, Settings, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';

export function UserMenuHeader() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const getInitials = useInitials();

    if (!auth?.user) {
        return null;
    }

    const user = auth.user;
    const primaryRole = auth.roles?.[0]
        ? auth.roles[0].replace('_', ' ').toUpperCase()
        : 'PENGGUNA';

    const handleLogout = () => {
        router.flushAll();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-9 items-center gap-2 px-1.5 sm:px-2.5 cursor-pointer rounded-full hover:bg-accent focus-visible:ring-1 focus-visible:ring-ring"
                    data-test="header-user-menu-button"
                    aria-label="Menu Akun Pengguna"
                >
                    <div className="hidden text-right sm:block">
                        <p className="text-xs font-semibold leading-tight max-w-[140px] truncate text-foreground">
                            {user.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-none mt-0.5 capitalize">
                            {primaryRole.toLowerCase()}
                        </p>
                    </div>
                    <Avatar className="h-7 w-7 rounded-full border border-border/80 ring-1 ring-background">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-[11px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-60 hidden sm:block" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 rounded-xl p-1 shadow-lg" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-2.5">
                    <div className="flex flex-col space-y-1">
                        <p className="text-xs font-bold text-foreground leading-tight truncate">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                        <div className="pt-1.5 flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60">
                                <Shield className="h-2.5 w-2.5" />
                                {primaryRole}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link
                            className="flex items-center w-full cursor-pointer px-2.5 py-2 text-xs font-medium"
                            href={edit()}
                            prefetch
                        >
                            <Settings className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            <span>Pengaturan Akun & Profil</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link
                        className="flex items-center w-full cursor-pointer px-2.5 py-2 text-xs font-medium text-destructive focus:text-destructive focus:bg-destructive/10"
                        href={logout()}
                        as="button"
                        onClick={handleLogout}
                        data-test="logout-button"
                    >
                        <LogOut className="mr-2 h-3.5 w-3.5" />
                        <span>Keluar / Log out</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
