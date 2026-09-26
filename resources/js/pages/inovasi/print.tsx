import { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';

import { RantaiVersi, type VersiNode } from '@/components/rantai-versi';

interface PrintProps {
    inovasi: {
        id: number;
        nama_inovasi: string;
        kategori_inovasi?: string;
        nama_inisiator: string;
        jenis_inovasi: string;
        bentuk_inovasi: string;
        tematik: string;
        tahapan: string;
        waktu_ujicoba: string;
        waktu_penerapan: string;
        rancang_bangun: string;
        tujuan: string;
        manfaat: string;
        hasil_inovasi: string;
        urusan_utama: string;
        urusan_wajib: string[];
        status: string;
        estimasi_skor_kematangan: number;
        skor_total_sid: number;
        opd_nama: string;
        periode_nama: string;
        dokumen_list: Array<{
            id: number;
            jenis_dokumen: string;
            nama_file: string;
            nomor_surat: string;
            tanggal_surat: string;
            keterangan: string;
        }>;
    };
    rantaiVersi?: VersiNode;
    tanggalCetak: string;
}

export default function InovasiPrint({ inovasi, rantaiVersi, tanggalCetak }: PrintProps) {
    const dokumenList = (Array.isArray(inovasi.dokumen_list)
        ? inovasi.dokumen_list
        : Object.values(inovasi.dokumen_list || {})) as typeof inovasi.dokumen_list;

    useEffect(() => {
        // Auto trigger print window after render completes
        const timer = setTimeout(() => {
            window.print();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 print:bg-white print:text-black">
            <Head title={`Cetak Profil - ${inovasi.nama_inovasi}`} />
            <style font-sans="true">{`
                @media print {
                    @page {
                        size: A4 portrait;
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
                        padding: 12mm 15mm !important;
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
                        Profil Inovasi: {inovasi.nama_inovasi}
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

            {/* Printable A4 Paper Container */}
            <div className="print-container max-w-[210mm] mx-auto my-6 bg-white p-8 md:p-12 shadow-xl print:shadow-none print:m-0 print:p-6 print:max-w-none rounded-sm font-sans">
                {/* Kop Surat Pemkab Sumbawa */}
                <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center relative">
                    <div className="text-xs uppercase font-bold tracking-widest text-slate-600">PEMERINTAH KABUPATEN SUMBAWA</div>
                    <div className="text-lg md:text-xl font-black uppercase tracking-tight text-slate-900 mt-0.5">
                        DATABASE INOVASI DAERAH KABUPATEN SUMBAWA (INOVA-HUB)
                    </div>
                    <div className="text-xs font-medium text-slate-600 mt-1">
                        Badan Perencanaan Pembangunan, Riset dan Inovasi Daerah (BAPPERIDA)
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                        Jl. Garuda No. 1, Sumbawa Besar, Nusa Tenggara Barat • Email: bapperida@sumbawakab.go.id
                    </div>
                </div>

                {/* Document Title Header */}
                <div className="bg-slate-100 print:bg-slate-50 p-4 rounded-md border border-slate-300 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">DOKUMEN PROFIL RESMI INOVASI DAERAH</span>
                        <h1 className="text-lg font-black text-slate-900 leading-tight mt-0.5">{inovasi.nama_inovasi}</h1>
                        <span className="text-xs text-slate-600 font-medium">OPD Pengusul: {inovasi.opd_nama}</span>
                    </div>
                    <div className="text-right shrink-0">
                        <div className="inline-flex items-center px-2.5 py-1 rounded bg-teal-100 text-teal-800 border border-teal-300 text-xs font-bold uppercase">
                            STATUS: {inovasi.status.replace('_', ' ')}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">{inovasi.periode_nama}</div>
                    </div>
                </div>

                {/* Section 1: Identitas Inovasi */}
                <div className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-700 pb-1 mb-3">
                        1. IDENTITAS & METADATA INOVASI
                    </h2>
                    <table className="w-full text-xs border-collapse">
                        <tbody>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50 w-1/3">Nama Inovasi</td>
                                <td className="py-2 px-3 font-bold text-slate-900">{inovasi.nama_inovasi}</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50">Kategori Inovasi Daerah</td>
                                <td className="py-2 px-3 font-semibold capitalize">{inovasi.kategori_inovasi || 'OPD'}</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50">Nama Inisiator</td>
                                <td className="py-2 px-3">{inovasi.nama_inisiator || '-'}</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50">Jenis / Bentuk Inovasi</td>
                                <td className="py-2 px-3 capitalize">{inovasi.jenis_inovasi} / {inovasi.bentuk_inovasi}</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50">Tematik Inovasi</td>
                                <td className="py-2 px-3 capitalize">{inovasi.tematik}</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50">Tahapan Kesiapan</td>
                                <td className="py-2 px-3 capitalize font-bold text-teal-800">{inovasi.tahapan}</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50">Waktu Uji Coba / Penerapan</td>
                                <td className="py-2 px-3">{inovasi.waktu_ujicoba || '-'} / {inovasi.waktu_penerapan || '-'}</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50">Urusan Utama Pemerintahan</td>
                                <td className="py-2 px-3">{inovasi.urusan_utama || '-'}</td>
                            </tr>
                            <tr className="border-b border-slate-200">
                                <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50">Urusan Wajib Pelayanan Dasar</td>
                                <td className="py-2 px-3">
                                    {inovasi.urusan_wajib && inovasi.urusan_wajib.length > 0 ? inovasi.urusan_wajib.join(', ') : '-'}
                                </td>
                            </tr>
                            <tr>
                                <td className="py-2 px-3 font-semibold text-slate-600 bg-slate-50">Estimasi Skor Kematangan SID</td>
                                <td className="py-2 px-3 font-black text-teal-800 text-sm">{inovasi.estimasi_skor_kematangan} Poin</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Section 2: Rancang Bangun & Narasi Inovasi */}
                <div className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-700 pb-1 mb-3">
                        2. RANCANG BANGUN & POKOK-POKOK INOVASI
                    </h2>
                    <div className="space-y-3 text-xs">
                        <div>
                            <div className="font-bold text-slate-700 mb-1">A. Rancang Bangun & Pokok Perubahan:</div>
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded whitespace-pre-wrap leading-relaxed">
                                {inovasi.rancang_bangun || '-'}
                            </div>
                        </div>
                        <div>
                            <div className="font-bold text-slate-700 mb-1">B. Tujuan Inovasi:</div>
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded whitespace-pre-wrap leading-relaxed">
                                {inovasi.tujuan || '-'}
                            </div>
                        </div>
                        <div>
                            <div className="font-bold text-slate-700 mb-1">C. Manfaat Inovasi:</div>
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded whitespace-pre-wrap leading-relaxed">
                                {inovasi.manfaat || '-'}
                            </div>
                        </div>
                        <div>
                            <div className="font-bold text-slate-700 mb-1">D. Hasil Inovasi Dampak Konkret:</div>
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded whitespace-pre-wrap leading-relaxed">
                                {inovasi.hasil_inovasi || '-'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Lampiran Dokumen Dukung */}
                <div className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-700 pb-1 mb-3">
                        3. DAFTAR DOKUMEN PENDUKUNG TERLAMPIR ({dokumenList.length} File)
                    </h2>
                    <table className="w-full text-xs border-collapse border border-slate-300">
                        <thead>
                            <tr className="bg-slate-200 text-slate-800 font-bold">
                                <th className="py-2 px-2 border border-slate-300 w-8 text-center">No</th>
                                <th className="py-2 px-3 border border-slate-300 text-left">Jenis Dokumen</th>
                                <th className="py-2 px-3 border border-slate-300 text-left">Nama File</th>
                                <th className="py-2 px-3 border border-slate-300 text-left">Nomor / Tgl Surat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dokumenList.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-3 text-center text-slate-500">Belum ada dokumen pendukung diunggah.</td>
                                </tr>
                            ) : (
                                dokumenList.map((doc, idx) => (
                                    <tr key={doc.id} className="border-b border-slate-200">
                                        <td className="py-2 px-2 border border-slate-300 text-center font-semibold">{idx + 1}</td>
                                        <td className="py-2 px-3 border border-slate-300 font-bold capitalize">{doc.jenis_dokumen}</td>
                                        <td className="py-2 px-3 border border-slate-300">{doc.nama_file}</td>
                                        <td className="py-2 px-3 border border-slate-300">{doc.nomor_surat || '-'} ({doc.tanggal_surat || '-'})</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>



                {/* Section 4: Silsilah Versi Inovasi */}
                {rantaiVersi && (
                    <div className="mb-8 print:break-inside-avoid">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 border-b border-teal-700 pb-1 mb-3">
                            4. SILSILAH VERSI & RIWAYAT PENGEMBANGAN INOVASI
                        </h2>
                        <div className="p-4 bg-slate-50 border border-slate-300 rounded">
                            <RantaiVersi tree={rantaiVersi} />
                        </div>
                    </div>
                )}

                {/* Section 5: Signature / Pengesahan Box */}
                <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
                    <div>
                        <div className="font-semibold text-slate-600">Verifikator / Pendamping OPD,</div>
                        <div className="h-16 flex items-end justify-center">
                            <span className="border-b border-dashed border-slate-400 w-44"></span>
                        </div>
                        <div className="font-bold text-slate-900 mt-1">NIP. ........................................</div>
                    </div>
                    <div>
                        <div className="font-semibold text-slate-600">Sumbawa Besar, {tanggalCetak}</div>
                        <div className="font-semibold text-slate-600">Tim Penilai / BAPPERIDA Kab. Sumbawa,</div>
                        <div className="h-16 flex items-end justify-center">
                            <span className="border-b border-dashed border-slate-400 w-44"></span>
                        </div>
                        <div className="font-bold text-slate-900 mt-1">NIP. ........................................</div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center">
                    <span>Dokumen dicetak otomatis via INOVA-HUB Kabupaten Sumbawa pada {tanggalCetak}</span>
                    <span>Halaman 1 dari 1</span>
                </div>
            </div>
        </div>
    );
}

InovasiPrint.layout = (page: React.ReactNode) => page;
