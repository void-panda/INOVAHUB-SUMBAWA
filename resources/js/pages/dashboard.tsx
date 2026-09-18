import { useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
    DashboardHero,
    InovatorDashboard,
    PendampingDashboard,
    PenilaiDashboard,
    PimpinanDashboard,
    RecentLogsCard,
    STATUS_COLORS,
    STATUS_LABELS,
    StatusPipelineCard,
    type DashboardMetrics,
    type MetricSummary,
} from '@/components/dashboard';
import { dashboard } from '@/routes';
import type { Auth, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

const DEFAULT_SUMMARY: MetricSummary = {
    total_inovasi: 0,
    siap_kirim_count: 0,
    opd_aktif_count: 0,
    iid_score: 0,
    kategori_iga: {
        label: 'Tidak Dapat Dinilai',
        color: 'rose',
        bg: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
        badge: 'destructive',
    },
    yandas_compliant: false,
    yandas_count: 0,
};

const DEFAULT_TAHAPAN_COUNTS = { inisiatif: 0, ujicoba: 0, penerapan: 0 };
const DEFAULT_SIMULASI_BRIEF = { spd_score: 0, sid_score: 0, skor_jumlah_inovasi: 0, total_skor: 0 };
const SECTOR_COLORS = ['bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];

interface Props {
    metrics?: DashboardMetrics;
}

export default function Dashboard({ metrics }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth.user;
    const userRole = metrics?.user_role ?? 'inovator';
    const roleData = metrics?.role_data ?? {};

    const summary = metrics?.summary ?? DEFAULT_SUMMARY;
    const statusCounts = metrics?.status_counts ?? {};
    const tahapanCounts = metrics?.tahapan_counts ?? DEFAULT_TAHAPAN_COUNTS;
    const urusanDistribution = metrics?.urusan_distribution ?? [];
    const topOpd = metrics?.top_opd ?? [];
    const recentLogs = metrics?.recent_logs ?? [];
    const linimasa = metrics?.linimasa ?? [];
    const simulasiBrief = metrics?.simulasi_brief ?? DEFAULT_SIMULASI_BRIEF;

    // Memoized Chart Data Transformations
    const urusanChartData = useMemo(() => {
        return urusanDistribution.map((item, idx) => ({
            name: item.urusan.length > 15 ? item.urusan.substring(0, 15) + '...' : item.urusan,
            value: item.count,
            color: SECTOR_COLORS[idx % SECTOR_COLORS.length],
        }));
    }, [urusanDistribution]);

    const tahapanDonutItems = useMemo(() => {
        return [
            { label: 'Penerapan (Siap IGA)', value: tahapanCounts.penerapan, color: '#10b981' },
            { label: 'Uji Coba Lapangan', value: tahapanCounts.ujicoba, color: '#3b82f6' },
            { label: 'Inisiatif Baru', value: tahapanCounts.inisiatif, color: '#f59e0b' },
        ];
    }, [tahapanCounts.penerapan, tahapanCounts.ujicoba, tahapanCounts.inisiatif]);

    const statusDonutItems = useMemo(() => {
        return Object.entries(statusCounts).map(([key, count]) => ({
            label: STATUS_LABELS[key] ?? key,
            value: count,
            color: STATUS_COLORS[key] ?? '#64748b',
        }));
    }, [statusCounts]);

    return (
        <>
            <Head title={`Dashboard Analytics - ${userRole.toUpperCase()}`} />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full pb-16">
                {/* 1. Header Hero Banner */}
                <DashboardHero
                    userName={user?.name}
                    userRole={userRole}
                    periode={metrics?.periode}
                    countdown={metrics?.countdown}
                />

                {/* 2. Role-Specific Dashboards */}
                {userRole === 'inovator' && (
                    <InovatorDashboard roleData={roleData} linimasa={linimasa} />
                )}

                {userRole === 'pendamping' && (
                    <PendampingDashboard roleData={roleData} />
                )}

                {userRole === 'pimpinan' && (
                    <PimpinanDashboard
                        summary={summary}
                        urusanChartData={urusanChartData}
                        tahapanDonutItems={tahapanDonutItems}
                    />
                )}

                {userRole === 'tim_penilai' && (
                    <PenilaiDashboard
                        summary={summary}
                        simulasiBrief={simulasiBrief}
                        urusanChartData={urusanChartData}
                        statusDonutItems={statusDonutItems}
                        topOpd={topOpd}
                    />
                )}

                {/* 3. Monitoring 8 Status Steps Indicator Bar (Visible to Pimpinan & Tim Penilai) */}
                {(userRole === 'tim_penilai' || userRole === 'pimpinan') && (
                    <StatusPipelineCard statusCounts={statusCounts} />
                )}

                {/* 4. Recent Audit Trail Log (All Roles View filtered by scope) */}
                <RecentLogsCard logs={recentLogs} />
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs,
};
