# Domain — Glosarium & Model Penilaian Inovasi Daerah (INOVA-HUB)

Sumber kebenaran skors: **`TOR_DINOLA_Sumbawa.md` §8** + tabel indikator/bobot
di dokumen ini (data master `indikator_spd`/`indikator_sid`). Jangan membuat
model skor sendiri.

## Glosarium

| Istilah | Arti |
| --- | --- |
| **Inovasi Daerah** | Program/kegiatan pemerintah daerah yang mengandung pembaharuan & memberi manfaat |
| **SPD** | Satuan Pemerintahan Daerah — indikator kondisi penyelenggaraan pemerintahan |
| **SID** | Satuan Inovasi Daerah — indikator kematangan/dampak inovasi |
| **Bobot** | Kontribusi skor tiap indikator (data master, dari PDF) |
| **Parameter (tier) P1/P2/P3** | Ambang tingkat nilai indikator 1–3; **data master** diperbarui tiap tahun |
| **IID** | Indeks Inovasi Daerah — skala 0–100 dari total skor |
| **Urusan Wajib Yandas** | 6 urusan wajib pelayanan dasar (lihat §Urusan) |
| **Verifikasi** | Penilaian kesesuaian dokumen oleh Pendamping: `Disetujui` atau `Revisi` |
| **Arsip** | Inovasi periode non-aktif (read-only; data tidak pernah dihapus) |
| **Ajukan Kembali** | Salin inovasi arsip sebagai draft baru + kolom wajib Penjelasan Pengembangan |

## Role (TOR §3 → 4 role)

- **`inovator`** — OPD & masyarakat: input profil, unggah dokumen, ajukan validasi, revisi.
- **`pendamping`** — Pendamping Inovasi + Verifikator OPD: verifikasi, catatan revisi, pengesahan OPD.
- **`tim_penilai`** — Tim Penilai Internal + Admin Bappeda: skoring, kelola master, ekspor.
- **`pimpinan`** — Pimpinan Daerah: dashboard read-only.

## Alur status (8 langkah, TOR §5)

`draft → diajukan → divalidasi → revisi|disetujui → disahkan_opd → review_internal → siap_kirim → terkirim`

Transisi hanya ke depan; revisi kembali ke inovator. Semua transisi tercatat di `validasi_log`.

## Model penilaian (TOR §8 — formula inti)

### a. Skor SPD
SPD = Σ (Skor Indikator ke-i), i = 1 s.d. 15.
Skor tiap indikator = **Tier Tercapai (1/2/3) × Bobot**.
**Maksimum SPD = 63 poin (25,20%).**

### b. Skor SID
SID = [ Σ (Skor Indikator SID per inovasi) / **MAX(12, n)** ] + **Skor Jumlah Inovasi**,
dengan n = jumlah inovasi yang dilaporkan.
**Maksimum SID = 187 poin (74,80%).**

### c. Skor Jumlah Inovasi
Skor Jumlah Inovasi = **MIN(n, 200) × 0,38** jika urusan wajib yandas yang
dikirimkan ≥ 5 urusan; **0** jika < 5. **Maksimum = 76 poin.**

### d. Indeks Inovasi Daerah (IID)
IID = (Skor Total / 250) × 100; Skor Total = SPD + SID; Maksimum total = 250.

| Kategori | Rentang IID |
| --- | --- |
| Sangat Inovatif | 65,01 – 100,00 |
| Inovatif | 40,01 – 65,00 |
| Kurang Inovatif | 0,01 – 40,00 |
| Tidak Dapat Dinilai | 0 |

### Fitur khusus INOVA-HUB (TOR §7.1)

- Skor dihitung otomatis & diperbarui tiap kali Pendamping menyetujui perubahan data.
- **Simulasi what-if**: dampak tambah/hapus/ubah status inovasi terhadap skor total kabupaten.
- **Cek kepatuhan**: validasi minimal 5 dari 6 urusan wajib yandas (indikator visual hijau/merah).
- **Bobot & parameter P1/P2/P3 = data master** (`indikator_spd`/`indikator_sid`), dapat diperbarui `tim_penilai` tiap tahun mengikuti pedoman IGA — **tanpa hardcode**.

## Urusan Wajib Pelayanan Dasar (6 urusan yandas)

Urusan wajib yang berkaitan dengan pelayanan dasar (UU 23/2014) yang dipantau
kelengkapan inovasi daerahnya:

| # | Urusan wajib yandas |
| --- | --- |
| 1 | Pendidikan |
| 2 | Kesehatan |
| 3 | Pekerjaan Umum & Penataan Ruang |
| 4 | Perumahan Rakyat & Kawasan Permukiman |
| 5 | Ketenteraman, Ketertiban Umum & Pelindungan Masyarakat |
| 6 | Sosial |

> Ambang kepatuhan: inovasi berstatus siap-kirim harus mewakili **≥ 5 dari 6** urusan.

## Indikator SPD (15) & bobot dasar

| # | Indikator | Bobot dasar |
| --- | --- | --- |
| 1 | Visi dan Misi | 1 |
| 2 | APBD tepat waktu & mandatory spending | 2 |
| 3 | Kualitas peningkatan perizinan | 1 |
| 4 | Jumlah pendapatan perkapita | 1 |
| 5 | Penurunan tingkat pengangguran terbuka | 1,5 |
| 6 | Jumlah peningkatan investasi | 1,5 |
| 7 | Jumlah peningkatan PAD | 1,5 |
| 8 | Opini BPK | 1,5 |
| 9 | Nilai capaian Lakip | 1 |
| 10 | Penurunan Angka Kemiskinan | 1,5 |
| 11 | Nilai IPM | 1,5 |
| 12 | Penghargaan bagi inovator | 2 |
| 13 | Jumlah Rekomendasi Kebijakan | 2 |
| 14 | RIPJ PID | 1 |
| 15 | Fasilitasi atas HAKI | 1 |

Σ bobot SPD = 21 → maks tier 3 → **63** ✓

## Indikator SID (20 + Jumlah Inovasi) & bobot

| # | Indikator | Bobot dasar |
| --- | --- | --- |
| 1 | Regulasi Inovasi Daerah | 3 |
| 2 | Ketersediaan & peran SDM | 2 |
| 3 | Dukungan anggaran | 2 |
| 4 | Alat Kerja | 2 |
| 5 | Bimtek inovasi | 1 |
| 6 | Inovasi Perangkat Daerah dalam RKPD | 2 |
| 7 | Keterlibatan aktor inovasi | 1 |
| 8 | Pelaksana inovasi daerah | 1 |
| 9 | Jejaring inovasi | 1 |
| 10 | Sosialisasi Inovasi Daerah | 1 |
| 11 | Pedoman teknis | 1 |
| 12 | Kemudahan informasi layanan | 1 |
| 13 | Kemudahan proses inovasi | 2 |
| 14 | Penyelesaian layanan pengaduan | 1 |
| 15 | Layanan Terintegrasi | 2 |
| 16 | Replikasi | 3 |
| 17 | Kecepatan penciptaan inovasi | 2 |
| 18 | Kemanfaatan inovasi | 3 |
| 19 | Monitoring dan Evaluasi Inovasi Daerah | 2 |
| 20 | Video inovasi daerah | 4 |
| 21 | Jumlah Inovasi Daerah | 0,38 (per inovasi, maks 76) |

Σ bobot SID (1–20) = 37 → maks tier 3 → 111; + Jumlah Inovasi maks 76 → **187** ✓

## Catatan implementasi

- Seed `indikator_spd`/`indikator_sid` dari tabel di atas; nilai P1/P2/P3 diisi
  `tim_penilai` via UI data master saat Phase 5.
- Hitung SPD untuk inovasi `siap_kirim`/`terkirim`; SID diakumulasi per inovasi lalu
  dirata-rata `MAX(12, n)`.
- Jumlah Inovasi & kepatuhan urusan = turun dari data kabupaten (status siap-kirim).