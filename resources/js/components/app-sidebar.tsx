import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Building2,
    Calculator,
    CalendarDays,
    FileText,
    LayoutGrid,
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
    const isInovator = roles.includes('inovator') || (!isBapperida && !isTimPenilai && !isPendamping && !isPimpinan);

    // Tentukan prefix domain untuk menu Inovasi Daerah
    const domainPrefix = isBapperida
        ? '/superadmin'
        : isTimPenilai
          ? '/penilai'
          : isPendamping
            ? '/pendamping'
            : isPimpinan
              ? '/pimpinan'
              : '/inovator';

    // 1. Menu Utama (Dashboard & Inovasi Daerah untuk semua role, Simulasi IID khusus BAPPERIDA & Pimpinan)
    const mainItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Inovasi Daerah',
            href: `${domainPrefix}/inovasi-daerah`,
            icon: Award,
        },
    ];

    // Simulasi IID Eksklusif hanya untuk BAPPERIDA dan Pimpinan Daerah
    if (isBapperida) {
        mainItems.push({
            title: 'Simulasi Indeks (IID)',
            href: '/superadmin/simulasi',
            icon: Calculator,
        });
    } else if (isPimpinan) {
        mainItems.push({
            title: 'Simulasi Indeks (IID)',
            href: '/pimpinan/simulasi',
            icon: Calculator,
        });
    }

    const navGroups: NavGroup[] = [
        {
            title: 'Menu Utama',
            items: mainItems,
        },
    ];

    // 2. Grup Partisipasi & Lomba (Khusus Role Inovator OPD & Masyarakat)
    if (isInovator) {
        navGroups.push({
            title: 'Partisipasi & Lomba',
            items: [
                {
                    title: 'Inovasi Saya',
                    href: '/inovator/inovasi',
                    icon: Trophy,
                },
            ],
        });
    }

    // 3. Grup Khusus BAPPERIDA (Penyelenggaraan Lomba & Pembinaan)
    if (isBapperida) {
        navGroups.push({
            title: 'Penyelenggaraan Lomba & Pembinaan',
            items: [
                {
                    title: 'Usulan Lomba Masuk',
                    href: '/superadmin/pengajuan-lomba',
                    icon: FileText,
                },
                {
                    title: 'Direktori Peserta',
                    href: '/superadmin/peserta-lomba',
                    icon: Users,
                },
                {
                    title: 'Rekapitulasi Hasil Juri',
                    href: '/superadmin/rekapitulasi-nilai',
                    icon: Trophy,
                },
                {
                    title: 'Penugasan Pendamping',
                    href: '/superadmin/penugasan-pendamping',
                    icon: UserCheck,
                },
            ],
        });
    }

    // 4. Grup Penjurian untuk Tim Penilai (Juri Independen)
    if (isTimPenilai) {
        navGroups.push({
            title: 'Penjurian Lomba',
            items: [
                {
                    title: 'Penilaian Lomba Inovasi',
                    href: '/penilai/skoring',
                    icon: Trophy,
                },
            ],
        });
    }

    // 5. Grup Verifikasi & Pendampingan untuk Pendamping Inovasi
    if (isPendamping) {
        navGroups.push({
            title: 'Verifikasi & Pendampingan',
            items: [
                {
                    title: 'Antrean Validasi',
                    href: '/pendamping/validasi',
                    icon: ShieldCheck,
                },
            ],
        });
    }

    // 6. Grup Administrasi Sistem & Master Data (Khusus Superadmin BAPPERIDA)
    if (isBapperida || permissions.includes('manage-master-data')) {
        navGroups.push({
            title: 'Administrasi & Master Data',
            items: [
                {
                    title: 'Periode Lomba',
                    href: '/superadmin/periode',
                    icon: CalendarDays,
                },
                {
                    title: 'Master Indikator',
                    href: '/superadmin/indikator',
                    icon: Sliders,
                },
                {
                    title: 'Master Perangkat Daerah',
                    href: '/superadmin/opd',
                    icon: Building2,
                },
                {
                    title: 'Kelola Pengguna',
                    href: '/superadmin/users',
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
