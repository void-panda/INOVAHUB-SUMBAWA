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
    const roles = auth?.roles || [];
    const isBapperida = roles.includes('bapperida');
    const isTimPenilai = roles.includes('tim_penilai');
    const isPendamping = roles.includes('pendamping');
    const isPimpinan = roles.includes('pimpinan');

    const canAccessSimulasi =
        isBapperida ||
        isTimPenilai ||
        isPimpinan ||
        permissions.includes('view-scoring') ||
        permissions.includes('manage-master-data');

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
                ...(canAccessSimulasi
                    ? [
                          {
                              title: 'Simulasi Indeks (IID)',
                              href: '/simulasi',
                              icon: Calculator,
                          },
                      ]
                    : []),
            ],
        },
    ];

    // Grup Partisipasi & Lomba (Khusus Role Inovator OPD & Masyarakat, disembunyikan dari Superadmin BAPPERIDA)
    if (permissions.includes('input-inovasi') && !isBapperida && !isPimpinan) {
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

    // Grup Verifikasi & Penilaian (Pendamping & Tim Penilai / Bapperida)
    const verifikasiItems: NavItem[] = [];

    // Antrean Validasi khusus untuk Pendamping Inovasi lapangan
    if (permissions.includes('validate-inovasi') && (isPendamping || (!isBapperida && !isTimPenilai))) {
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
            title: isTimPenilai ? 'Penilaian Lomba Inovasi' : 'Penilaian Inovasi (SID)',
            href: '/penilai/skoring',
            icon: Trophy,
        });
    }

    if (permissions.includes('manage-master-data')) {
        verifikasiItems.push({
            title: 'Peserta Lomba',
            href: '/penilai/peserta-lomba',
            icon: Users,
        });
    }

    if (verifikasiItems.length > 0) {
        navGroups.push({
            title: isTimPenilai ? 'Penjurian Lomba' : 'Verifikasi & Penilaian',
            items: verifikasiItems,
        });
    }

    // Grup Administrasi Sistem & Master Data (Role Admin Bappeda / Superadmin)
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
