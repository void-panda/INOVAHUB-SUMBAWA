<?php

namespace App\Mail;

use App\Models\PengajuanLomba;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InovasiDiperiksaMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $inovator,
        public User $pendamping,
        public PengajuanLomba $pengajuan,
        public string $tanggalPemeriksaan,
        public string $actionUrl
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Pemeriksaan Indikator Inovasi: {$this->pengajuan->inovasi->nama_inovasi}",
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->buildHtml(),
        );
    }

    private function buildHtml(): string
    {
        $namaInovasi = htmlspecialchars($this->pengajuan->inovasi->nama_inovasi, ENT_QUOTES, 'UTF-8');
        $namaInovator = htmlspecialchars($this->inovator->name, ENT_QUOTES, 'UTF-8');
        $namaPendamping = htmlspecialchars($this->pendamping->name, ENT_QUOTES, 'UTF-8');
        $tanggal = htmlspecialchars($this->tanggalPemeriksaan, ENT_QUOTES, 'UTF-8');
        $actionUrl = htmlspecialchars($this->actionUrl, ENT_QUOTES, 'UTF-8');

        return <<<HTML
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pemeriksaan Indikator Inovasi</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b;">
    <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
        <!-- Header INOVA-HUB Teal Banner -->
        <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #064e3b 100%); padding: 32px 28px; text-align: center; color: #ffffff;">
            <div style="font-size: 20px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">INOVA-HUB</div>
            <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">Pemerintah Kabupaten Sumbawa</div>
        </div>

        <!-- Content Area -->
        <div style="padding: 32px 28px;">
            <p style="font-size: 15px; margin-top: 0; line-height: 1.6;">
                Halo <strong>{$namaInovator}</strong>,
            </p>

            <div style="background-color: #f0fdfa; border-left: 4px solid #0d9488; padding: 16px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #134e4a;">
                    Inovasi Anda <strong>"{$namaInovasi}"</strong> telah diperiksa oleh Pendamping Inovasi (<strong>{$namaPendamping}</strong>) pada tanggal <strong>{$tanggal}</strong>. Silahkan cek akun Anda untuk melihat catatan review indikator.
                </p>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
                Silakan masuk ke aplikasi INOVA-HUB untuk meninjau lembar kerja 20 Indikator SID, memeriksa kelengkapan bukti dukung, dan menindaklanjuti rekomendasi pendamping.
            </p>

            <div style="text-align: center; margin: 32px 0;">
                <a href="{$actionUrl}" style="display: inline-block; background-color: #0d9488; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 8px; box-shadow: 0 2px 4px rgba(13, 148, 136, 0.3);">
                    Buka Lembar Indikator Inovasi
                </a>
            </div>

            <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-bottom: 0;">
                Jika tombol di atas tidak dapat diklik, salin dan tempel tautan berikut di peramban Anda:<br>
                <a href="{$actionUrl}" style="color: #0d9488; word-break: break-all;">{$actionUrl}</a>
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px 28px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
            <p style="margin: 0;">
                Badan Perencanaan Pembangunan, Riset dan Inovasi Daerah (BAPPERIDA)<br>
                Kabupaten Sumbawa — Nusa Tenggara Barat
            </p>
            <p style="margin: 6px 0 0 0; font-size: 11px; color: #94a3b8;">
                Email ini dikirim otomatis oleh sistem INOVA-HUB. Mohon tidak membalas langsung ke alamat ini.
            </p>
        </div>
    </div>
</body>
</html>
HTML;
    }
}
