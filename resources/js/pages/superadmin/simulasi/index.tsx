import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    Award,
    Building2,
    Calculator,
    CheckCircle2,
    FileSpreadsheet,
    Search,
    ShieldCheck,
    Sliders,
} from 'lucide-react';
import { useState } from 'react';
import { HeroBanner } from '@/components/hero-banner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { BreadcrumbItem } from '@/types';

interface InovasiSimulasi {
    id: number;
    nama_inovasi: string;
    tahapan: string;
    status: string;
    nama_inisiator: string;
    opd_nama: string;
    urusan_utama: string | null;
    urusan_wajib: string | null;
    estimasi_skor_kematangan: number;
    skor_sid_calculated: number;
}

interface OpdRank {
    id: number;
    kode: string;
    nama: string;
    total_inovasi: number;
    approved_count: number;
    avg_skor: number;
}

interface YandasStatus {
    items: Record<string, boolean>;
    fulfilled_count: number;
    total_required: number;
    is_compliant: boolean;
}

interface SimulasiData {
    periode: { id: number; tahun: string; nama: string } | null;
    spd_score: number;
    sid_score: number;
    skor_jumlah_inovasi: number;
    total_sid: number;
    total_skor: number;
    iid_score: number;
    kategori_iga: {
        label: string;
        color: string;
        bg: string;
        badge: 'default' | 'secondary' | 'outline' | 'destructive';
    };
    yandas: YandasStatus;
    opd_ranking: OpdRank[];
    inovasi_list: InovasiSimulasi[];
}

interface Props {
    simulasi: SimulasiData;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Simulasi IID & Yandas', href: '/superadmin/simulasi' },
];

export default function SimulasiIndex({ simulasi }: Props) {
    const [searchOpd, setSearchOpd] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState<Record<number, boolean>>(() => {
        const initial: Record<number, boolean> = {};
        simulasi.inovasi_list.forEach((item) => {
            const isEligible = ['disetujui', 'disahkan_opd', 'review_internal', 'siap_kirim', 'terkirim'].includes(item.status);
            initial[item.id] = isEligible;
        });
        return initial;
    });

    const toggleSimulasiInovasi = (id: number) => {
        setSelectedStatuses((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Recalculate What-If Simulation Realtime Scores
    const simulatedInovasi = simulasi.inovasi_list.filter((item) => selectedStatuses[item.id]);
    const simulatedN = simulatedInovasi.length;

    // Check simulated Yandas compliance
    const simulatedYandasMap: Record<string, boolean> = {};
    Object.keys(simulasi.yandas.items).forEach((yandasKey) => {
        simulatedYandasMap[yandasKey] = simulatedInovasi.some((item) => {
            if (!item.urusan_wajib) return false;
            try {
                const parsed = JSON.parse(item.urusan_wajib);
                return Array.isArray(parsed) && parsed.includes(yandasKey);
            } catch {
                return false;
            }
        });
    });

    const simulatedYandasCount = Object.values(simulatedYandasMap).filter(Boolean).length;
    const isSimulatedYandasCompliant = simulatedYandasCount >= 5;

    // Simulated SID calculation
    const rawSidSum = simulatedInovasi.reduce((sum, item) => sum + item.skor_sid_calculated, 0);
    const divisor = Math.max(12, simulatedN);
    const simulatedSidRataRata = divisor > 0 ? rawSidSum / divisor : 0;
    const simulatedSkorJumlahInovasi = isSimulatedYandasCompliant ? Math.min(simulatedN, 200) * 0.38 : 0;
    const simulatedTotalSid = Math.min(187.0, simulatedSidRataRata + simulatedSkorJumlahInovasi);

    const simulatedTotalSkor = Math.min(250.0, simulasi.spd_score + simulatedTotalSid);
    const simulatedIidScore = Number(((simulatedTotalSkor / 250.0) * 100.0).toFixed(2));

    const getKategoriLabel = (score: number) => {
        if (score >= 65.01) return { label: 'Sangat Inovatif', bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' };
        if (score >= 40.01) return { label: 'Inovatif', bg: 'bg-blue-500/10 text-blue-600 border-blue-500/30' };
        if (score >= 0.01) return { label: 'Kurang Inovatif', bg: 'bg-amber-500/10 text-amber-600 border-amber-500/30' };
        return { label: 'Tidak Dapat Dinilai', bg: 'bg-rose-500/10 text-rose-600 border-rose-500/30' };
    };

    const simulatedKat = getKategoriLabel(simulatedIidScore);

    const filteredOpd = simulasi.opd_ranking.filter(
        (opd) =>
            opd.nama.toLowerCase().includes(searchOpd.toLowerCase()) ||
            opd.kode.toLowerCase().includes(searchOpd.toLowerCase())
    );

    return (
        <>
            <Head title="Simulasi IID & Kepatuhan Yandas - BAPPERIDA" />

            <div className="flex flex-col space-y-6 p-4 md:p-6 max-w-7xl mx-auto w-full pb-16">
                {/* Header Title Banner */}
                <HeroBanner
                    badgeIcon={Sliders}
                    badgeText={`What-If Analysis • Periode ${simulasi.periode?.nama || 'Tahun Berjalan'}`}
                    title="Simulasi Indeks Inovasi Daerah & Kepatuhan Yandas"
                    description="Uji coba skenario dampak penambahan inovasi terhadap total skor IID Sumbawa dan verifikasi pemenuhan 5 dari 6 urusan wajib pelayanan dasar."
                    variant="teal"
                >
                    <div className="flex items-center gap-3">
                        <Link href="/superadmin/rekapitulasi-nilai">
                            <Button variant="outline" size="sm" className="gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 rounded-md h-10">
                                <FileSpreadsheet className="h-4 w-4" /> Rekapitulasi Juri
                            </Button>
                        </Link>
                        <Link href="/superadmin/inovasi-daerah">
                            <Button size="sm" className="gap-2 bg-background hover:bg-background/90 text-foreground font-bold shadow-xs rounded-md h-10 px-4">
                                <Building2 className="h-4 w-4 text-primary" /> Inovasi Daerah
                            </Button>
                        </Link>
                    </div>
                </HeroBanner>

                {/* Score KPI Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Simulated IID Score Card */}
                    <Card className="border-primary/40 bg-gradient-to-br from-card to-primary/5 shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Award className="h-24 w-24 text-primary" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Estimasi Indeks Inovasi Daerah (IID)
                            </CardDescription>
                            <CardTitle className="text-4xl font-black text-primary tracking-tight">
                                {simulatedIidScore.toFixed(2)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-1">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${simulatedKat.bg}`}>
                                    Predikat: {simulatedKat.label}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Score Card */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Akumulasi Total Skor (Max 250)
                            </CardDescription>
                            <CardTitle className="text-3xl font-black text-foreground">
                                {simulatedTotalSkor.toFixed(2)} <span className="text-xs text-muted-foreground font-normal">/ 250</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground flex items-center justify-between border-t pt-2 mt-1">
                                <span>SPD: <strong>{simulasi.spd_score.toFixed(2)}</strong></span>
                                <span>SID: <strong>{simulatedTotalSid.toFixed(2)}</strong></span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SID & Rate Score Card */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Rata-Rata SID & Bonus Inovasi
                            </CardDescription>
                            <CardTitle className="text-3xl font-bold text-primary">
                                {simulatedTotalSid.toFixed(2)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground border-t pt-2 mt-1 space-y-0.5">
                                <div className="flex justify-between">
                                    <span>Rata-Rata ({simulatedN} Inovasi):</span>
                                    <strong className="text-foreground">{simulatedSidRataRata.toFixed(2)}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>Bonus Jumlah Inovasi:</span>
                                    <strong className="text-foreground">{simulatedSkorJumlahInovasi.toFixed(2)}</strong>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Yandas Compliance KPI Card */}
                    <Card className={`shadow-sm border-2 ${isSimulatedYandasCompliant ? 'border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-rose-500/50 bg-rose-50/20 dark:bg-rose-950/10'}`}>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Status Kepatuhan Yandas
                            </CardDescription>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                {isSimulatedYandasCompliant ? (
                                    <>
                                        <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                                        <span className="text-emerald-700 dark:text-emerald-400">Patuh ({simulatedYandasCount}/6)</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="h-6 w-6 text-rose-600 shrink-0" />
                                        <span className="text-rose-700 dark:text-rose-400">Belum Patuh ({simulatedYandasCount}/6)</span>
                                    </>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground mt-1">
                                {isSimulatedYandasCompliant
                                    ? 'Memenuhi syarat minimal 5 dari 6 urusan wajib pelayanan dasar.'
                                    : 'Butuh minimal 5 dari 6 urusan wajib pelayanan dasar untuk mendapat bonus skor.'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* 6 Urusan Wajib Pelayanan Dasar (Yandas) Tracker Cards */}
                <Card className="border shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    Cek Kepatuhan 6 Urusan Wajib Pelayanan Dasar (Yandas)
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Sesuai Pedoman IGA, minimal 5 dari 6 urusan wajib pelayanan dasar harus terwakili oleh data inovasi.
                                </CardDescription>
                            </div>
                            <Badge variant={isSimulatedYandasCompliant ? 'default' : 'destructive'} className="font-bold text-xs shrink-0 self-start sm:self-center">
                                {isSimulatedYandasCompliant ? 'Kepatuhan Terpenuhi (≥ 5 Urusan)' : 'Belum Memenuhi Ambang (< 5 Urusan)'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.entries(simulatedYandasMap).map(([yandasName, isFulfilled], idx) => (
                                <div
                                    key={yandasName}
                                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                                        isFulfilled
                                            ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20'
                                            : 'border-rose-300 dark:border-rose-900 bg-rose-50/30 dark:bg-rose-950/10 opacity-80'
                                    }`}
                                >
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                                            Urusan #{idx + 1}
                                        </span>
                                        <span className="font-semibold text-xs leading-snug text-foreground block mt-0.5">
                                            {yandasName}
                                        </span>
                                    </div>

                                    {isFulfilled ? (
                                        <Badge className="bg-emerald-600 text-white text-[10px] shrink-0 font-bold gap-1">
                                            <CheckCircle2 className="h-3 w-3" /> Terwakili
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="border-rose-500 text-rose-600 text-[10px] shrink-0 font-bold gap-1">
                                            <AlertCircle className="h-3 w-3" /> Belum ada
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Interactive What-If Simulation Section */}
                <Card className="border shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Sliders className="h-5 w-5 text-primary" />
                                    Simulasi What-If: Dampak Inovasi Terhadap Skor IID
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Aktifkan/nonaktifkan inovasi di bawah untuk mensimulasikan dampak perubahan terhadap total skor IID Kabupaten.
                                </CardDescription>
                            </div>
                            <div className="text-xs text-muted-foreground bg-muted p-2 rounded-lg font-medium shrink-0">
                                Inovasi Terpilih: <strong className="text-foreground">{simulatedN}</strong> dari {simulasi.inovasi_list.length}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead className="bg-muted/40 border-y text-muted-foreground uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="p-3 text-center w-12">Simulasi</th>
                                        <th className="p-3">Nama Inovasi</th>
                                        <th className="p-3">Pengusul / OPD</th>
                                        <th className="p-3">Tahapan</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Skor SID</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {simulasi.inovasi_list.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                Belum ada data inovasi yang dapat disimulasikan.
                                            </td>
                                        </tr>
                                    ) : (
                                        simulasi.inovasi_list.map((item) => {
                                            const isChecked = Boolean(selectedStatuses[item.id]);

                                            return (
                                                <tr
                                                    key={item.id}
                                                    className={`hover:bg-muted/30 transition-colors ${
                                                        isChecked ? 'bg-background' : 'bg-muted/20 opacity-60'
                                                    }`}
                                                >
                                                    <td className="p-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => toggleSimulasiInovasi(item.id)}
                                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                                        />
                                                    </td>
                                                    <td className="p-3 font-semibold text-foreground max-w-xs truncate">
                                                        {item.nama_inovasi}
                                                    </td>
                                                    <td className="p-3 text-muted-foreground truncate max-w-[180px]">
                                                        {item.opd_nama}
                                                    </td>
                                                    <td className="p-3 capitalize">{item.tahapan}</td>
                                                    <td className="p-3">
                                                        <Badge variant="outline" className="text-[10px] uppercase font-mono">
                                                            {item.status.replace('_', ' ')}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 text-right font-bold text-primary">
                                                        {item.skor_sid_calculated.toFixed(2)}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* OPD Innovation Leaderboard Table */}
                <Card className="border shadow-sm">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-emerald-600" />
                                    Peringkat Kinerja Inovasi per OPD
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Daftar Perangkat Daerah Kabupaten Sumbawa diurutkan berdasarkan jumlah inovasi terverifikasi & skor kematangan.
                                </CardDescription>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari OPD..."
                                    value={searchOpd}
                                    onChange={(e) => setSearchOpd(e.target.value)}
                                    className="pl-8 text-xs h-9"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead className="bg-muted/40 border-y text-muted-foreground uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="p-3 text-center w-12">Rank</th>
                                        <th className="p-3">Kode</th>
                                        <th className="p-3">Nama Perangkat Daerah (OPD)</th>
                                        <th className="p-3 text-center">Total Inovasi</th>
                                        <th className="p-3 text-center">Disetujui / Sah</th>
                                        <th className="p-3 text-right">Rata-Rata Skor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredOpd.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                Tidak ada Perangkat Daerah yang ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOpd.map((opd, idx) => (
                                            <tr key={opd.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="p-3 text-center font-bold">
                                                    {idx < 3 ? (
                                                        <Badge className="bg-amber-500 text-white font-black text-xs h-6 w-6 rounded-full p-0 flex items-center justify-center mx-auto">
                                                            {idx + 1}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">{idx + 1}</span>
                                                    )}
                                                </td>
                                                <td className="p-3 font-mono text-muted-foreground">{opd.kode}</td>
                                                <td className="p-3 font-semibold text-foreground">{opd.nama}</td>
                                                <td className="p-3 text-center font-medium">{opd.total_inovasi}</td>
                                                <td className="p-3 text-center">
                                                    <Badge variant="secondary" className="font-bold">
                                                        {opd.approved_count}
                                                    </Badge>
                                                </td>
                                                <td className="p-3 text-right font-bold text-emerald-600">
                                                    {opd.avg_skor.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SimulasiIndex.layout = {
    breadcrumbs,
};
