import { useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InovasiRekapItem {
    id: number;
    nama_inovasi: string;
    nama_inisiator: string;
    opd_nama: string;
    urusan_utama: string;
    tahapan: string;
    status: string;
    estimasi_skor_kematangan: number;
    filled_indikator: number;
    dokumen_count: number;
    waktu_penerapan: string;
}

interface PeriodeInfo {
    id: number;
    tahun: string | number;
    nama: string;
}

interface SummaryData {
    total_inovasi: number;
    total_siap_iga: number;
    avg_skor: number;
}

interface PrintRekapProps {
    inovasiList: InovasiRekapItem[];
    periode?: PeriodeInfo | null;
    summary: SummaryData;
    tanggalCetak: string;
}

const statusLabels: Record<string, string> = {
    draft: 'Draft',
    diajukan: 'Diajukan',
    divalidasi: 'Divalidasi',
    revisi: 'Revisi',
    disetujui: 'Disetujui',
    disahkan_opd: 'Disahkan OPD',
    review_internal: 'Review Internal',
    siap_kirim: 'Siap Kirim',
    terkirim: 'Terkirim',
};

export default function InovasiPrintRekap({
    inovasiList = [],
    periode,
    summary,
    tanggalCetak,
}: PrintRekapProps) {
    useEffect(() => {
        // Auto trigger print window after render completes
        const timer = setTimeout(() => {
            window.print();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const periodeNama = useMemo(() => {
        return periode?.nama || `Periode ${periode?.tahun || new Date().getFullYear()}`;
    }, [periode?.nama, periode?.tahun]);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 print:bg-white print:text-black">
            <Head title={`Rekapitulasi Inovasi Daerah - ${periodeNama}`} />
            <style font-sans="true">{`
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 0 !important;
                    }
                    html, body {
                        background-color: #ffffff !important;
                        color: #000000 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .print-container {
                        padding: 10mm 12mm !important;
                        margin: 0 !important;
                        width: 100% !important;
                        max-width: none !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    header, nav, aside, [role="navigation"], .print\\:hidden {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Screen Top Action Toolbar (Hidden during print) */}
            <div className="print:hidden sticky top-0 z-50 bg-slate-900 text-white py-3 px-4 shadow-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.history.back()}
                        className="text-slate-300 hover:text-white hover:bg-slate-800 gap-1.5"
                    >
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </Button>
                    <span className="text-sm font-semibold truncate max-w-md">
                        Rekapitulasi Inovasi Daerah ({periodeNama})
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => window.print()}
                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold gap-2 shadow-sm cursor-pointer"
                    >
                        <Printer className="h-4 w-4" /> Cetak / Simpan ke PDF
                    </Button>
                </div>
            </div>

            {/* Printable A4 Landscape Paper Container */}
            <div className="print-container max-w-[297mm] mx-auto my-6 bg-white p-6 md:p-10 shadow-xl print:shadow-none print:m-0 print:p-6 print:max-w-none rounded-sm font-sans">
                {/* Kop Surat Pemkab Sumbawa */}
                <div className="border-b-4 border-double border-slate-900 pb-3 mb-4 text-center relative">
                    <div className="text-xs uppercase font-bold tracking-widest text-slate-700">
                        PEMERINTAH KABUPATEN SUMBAWA
                    </div>
                    <div className="text-lg md:text-xl font-black uppercase tracking-tight text-slate-900 mt-0.5">
                        BADAN PERENCANAAN PEMBANGUNAN, RISET DAN INOVASI DAERAH
                    </div>
                    <div className="text-xs font-semibold text-slate-700 mt-0.5">
                        SISTEM REPOSITORI & PEMBINAAN INOVASI DAERAH (INOVA-HUB)
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                        Jl. Garuda No. 1, Sumbawa Besar, Nusa Tenggara Barat • Email: bapperida@sumbawakab.go.id
                    </div>
                </div>

                {/* Document Title Header & Summary KPIs */}
                <div className="mb-4">
                    <div className="text-center mb-3">
                        <h1 className="text-base font-black uppercase text-slate-900 tracking-tight">
                            REKAPITULASI DATA PORTOFOLIO INOVASI DAERAH
                        </h1>
                        <span className="text-xs font-medium text-slate-600 block">
                            {periodeNama} — KABUPATEN SUMBAWA
                        </span>
                    </div>

                    {/* Ringkasan Eksekutif Badges */}
                    <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-300 rounded-md text-center text-xs">
                        <div className="border-r border-slate-200 last:border-r-0">
                            <div className="text-[10px] text-slate-500 font-medium">TOTAL INOVASI DAERAH</div>
                            <div className="text-lg font-black text-slate-900 mt-0.5">
                                {summary.total_inovasi} <span className="text-xs font-normal text-slate-600">Inovasi</span>
                            </div>
                        </div>
                        <div className="border-r border-slate-200 last:border-r-0">
                            <div className="text-[10px] text-slate-500 font-medium">STATUS SIAP KIRIM / IGA</div>
                            <div className="text-lg font-black text-teal-800 mt-0.5">
                                {summary.total_siap_iga} <span className="text-xs font-normal text-slate-600">Inovasi</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-500 font-medium">RATA-RATA SKOR KEMATANGAN SID</div>
                            <div className="text-lg font-black text-emerald-700 mt-0.5">
                                {summary.avg_skor} <span className="text-xs font-normal text-slate-600">Poin</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabel Rekapitulasi Inovasi Daerah */}
                <div className="mb-6">
                    <table className="w-full text-xs border-collapse border border-slate-300">
                        <thead>
                            <tr className="bg-slate-200 text-slate-900 font-bold">
                                <th className="py-2 px-2 border border-slate-300 w-8 text-center">No</th>
                                <th className="py-2 px-3 border border-slate-300 text-left">Nama Inovasi</th>
                                <th className="py-2 px-3 border border-slate-300 text-left">Inisiator & OPD</th>
                                <th className="py-2 px-3 border border-slate-300 text-left">Urusan Pemerintahan</th>
                                <th className="py-2 px-2 border border-slate-300 text-center w-24">Tahapan</th>
                                <th className="py-2 px-2 border border-slate-300 text-center w-24">20 Indikator</th>
                                <th className="py-2 px-2 border border-slate-300 text-center w-24">Skor SID</th>
                                <th className="py-2 px-2 border border-slate-300 text-center w-28">Status Alur</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inovasiList.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-6 text-center text-slate-500 italic">
                                        Tidak ada data inovasi daerah pada periode ini.
                                    </td>
                                </tr>
                            ) : (
                                inovasiList.map((item, idx) => {
                                    const statusText = statusLabels[item.status] || item.status.replace('_', ' ');
                                    return (
                                        <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                                            <td className="py-2 px-2 border border-slate-300 text-center font-semibold">
                                                {idx + 1}
                                            </td>
                                            <td className="py-2 px-3 border border-slate-300">
                                                <div className="font-bold text-slate-900 leading-tight">
                                                    {item.nama_inovasi}
                                                </div>
                                                <div className="text-[10px] text-slate-500 mt-0.5">
                                                    Diterapkan: {item.waktu_penerapan} • {item.dokumen_count} Dokumen Dukung
                                                </div>
                                            </td>
                                            <td className="py-2 px-3 border border-slate-300">
                                                <div className="font-semibold text-slate-800">{item.opd_nama}</div>
                                                <div className="text-[10px] text-slate-500">{item.nama_inisiator}</div>
                                            </td>
                                            <td className="py-2 px-3 border border-slate-300 text-slate-700">
                                                {item.urusan_utama}
                                            </td>
                                            <td className="py-2 px-2 border border-slate-300 text-center capitalize font-medium">
                                                {item.tahapan}
                                            </td>
                                            <td className="py-2 px-2 border border-slate-300 text-center font-semibold">
                                                <span className={item.filled_indikator >= 20 ? 'text-teal-700 font-bold' : 'text-slate-700'}>
                                                    {item.filled_indikator} / 20
                                                </span>
                                            </td>
                                            <td className="py-2 px-2 border border-slate-300 text-center font-black text-slate-900">
                                                {item.estimasi_skor_kematangan.toFixed(2)}
                                            </td>
                                            <td className="py-2 px-2 border border-slate-300 text-center">
                                                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 border border-slate-300 text-slate-800">
                                                    {statusText}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Section Signature / Pengesahan */}
                <div className="pt-4 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs print:break-inside-avoid">
                    <div>
                        <div className="font-semibold text-slate-600">Mengetahui,</div>
                        <div className="font-bold text-slate-800">Kepala BAPPERIDA Kab. Sumbawa</div>
                        <div className="h-20 flex items-end justify-center">
                            <span className="border-b border-dashed border-slate-400 w-52"></span>
                        </div>
                        <div className="font-bold text-slate-900 mt-1">NIP. ........................................</div>
                    </div>
                    <div>
                        <div className="font-semibold text-slate-600">Sumbawa Besar, {tanggalCetak}</div>
                        <div className="font-bold text-slate-800">Tim Penilai / BAPPERIDA Kab. Sumbawa</div>
                        <div className="h-20 flex items-end justify-center">
                            <span className="border-b border-dashed border-slate-400 w-52"></span>
                        </div>
                        <div className="font-bold text-slate-900 mt-1">NIP. ........................................</div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-6 pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center print:break-inside-avoid">
                    <span>Dicetak otomatis via INOVA-HUB Kabupaten Sumbawa pada {tanggalCetak}</span>
                    <span>Dokumen Rekapitulasi Portofolio Inovasi Daerah</span>
                </div>
            </div>
        </div>
    );
}

InovasiPrintRekap.layout = (page: React.ReactNode) => page;
