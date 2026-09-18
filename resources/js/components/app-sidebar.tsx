import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Calculator,
    CalendarDays,
    LayoutGrid,
    ListChecks,
    ShieldCheck,
    Sliders,
    Trophy,
    UserCheck,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavGroup, NavMain } from '@/components/nav-main';
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
import type { Auth, NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Panduan & Helpdesk',
        href: '/panduan',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const permissions = auth?.permissions || [];

    const navGroups: NavGroup[] = [
        {
            title: 'Menu Utama',
            items: [
                {
                    title: 'Dashboard',
                    href: dashboard(),
                    icon: LayoutGrid,
                },
                {
                    title: 'Inovasi Daerah',
                    href: '/inovasi-daerah',
                    icon: Award,
                },
            ],
        },
    ];

    // Grup Partisipasi & Lomba (Role Inovator OPD & Masyarakat)
    if (permissions.includes('input-inovasi')) {
        navGroups.push({
            title: 'Partisipasi & Lomba',
            items: [
                {
                    title: 'Inovasi Saya',
                    href: '/inovasi',
                    icon: ListChecks,
                },
                {
                    title: 'Pengajuan Lomba',
                    href: '/pengajuan-lomba',
                    icon: Trophy,
                },
            ],
        });
    }

    // Grup Verifikasi & Penilaian (Role Pendamping & Tim Penilai)
    const verifikasiItems: NavItem[] = [];
    if (permissions.includes('validate-inovasi')) {
        verifikasiItems.push({
            title: 'Antrean Validasi',
            href: '/pendamping/inovasi',
            icon: ShieldCheck,
        });
    }
    if (permissions.includes('assign-pendamping')) {
        verifikasiItems.push({
            title: 'Penugasan Pendamping',
            href: '/penugasan-pendamping',
            icon: UserCheck,
        });
    }
    if (permissions.includes('scoring-spd') || permissions.includes('scoring-sid')) {
        verifikasiItems.push({
            title: 'Penilaian SPD & SID',
            href: '/penilai/skoring',
            icon: Calculator,
        });
    }

    if (verifikasiItems.length > 0) {
        navGroups.push({
            title: 'Verifikasi & Penilaian',
            items: verifikasiItems,
        });
    }

    // Grup Administrasi Sistem & Master Data (Role Admin Bappeda / Tim Penilai)
    if (permissions.includes('manage-master-data')) {
        navGroups.push({
            title: 'Administrasi',
            items: [
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
            ],
        });
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
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
            </SidebarFooter>
        </Sidebar>
    );
}
