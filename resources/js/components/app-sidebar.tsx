import { Link, usePage } from '@inertiajs/react';
import { Award, BookOpen, Calculator, CalendarDays, LayoutGrid, ListChecks, ShieldCheck, Sliders, SquarePen, UserCheck, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { create, index } from '@/routes/inovasi';
import type { NavItem, Auth } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Panduan & Helpdesk',
        href: '/panduan',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const permissions = auth.permissions || [];

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    if (permissions.includes('input-inovasi')) {
        mainNavItems.push(
            {
                title: 'Inovasi Saya',
                href: '/inovasi',
                icon: ListChecks,
            },
            {
                title: 'Inovasi Daerah',
                href: '/inovasi-daerah',
                icon: Award,
            },
            {
                title: 'Input Inovasi Baru',
                href: create(),
                icon: SquarePen,
            },
        );
    } else {
        mainNavItems.push({
            title: 'Inovasi Daerah',
            href: '/inovasi-daerah',
            icon: Award,
        });
    }

    if (permissions.includes('validate-inovasi')) {
        mainNavItems.push({
            title: 'Antrean Validasi',
            href: '/pendamping/inovasi',
            icon: ShieldCheck,
        });
    }

    if (permissions.includes('assign-pendamping')) {
        mainNavItems.push({
            title: 'Penugasan Pendamping',
            href: '/penugasan-pendamping',
            icon: UserCheck,
        });
    }

    if (permissions.includes('scoring-spd') || permissions.includes('scoring-sid')) {
        mainNavItems.push({
            title: 'Penilaian SPD & SID',
            href: '/penilai/skoring',
            icon: Calculator,
        });
    }

    if (permissions.includes('manage-master-data')) {
        mainNavItems.push(
            {
                title: 'Periode Lomba',
                href: '/penilai/periode',
                icon: CalendarDays,
            },
            {
                title: 'Master Indikator',
                href: '/penilai/indikator',
                icon: Sliders,
            },
            {
                title: 'Kelola Pengguna',
                href: '/penilai/users',
                icon: Users,
            },
        );
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
