<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode OTP Verifikasi Superadmin INOVA-HUB</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f1f5f9;
            color: #1e293b;
            margin: 0;
            padding: 32px 16px;
        }
        .container {
            max-width: 560px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
        }
        .header {
            background: linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #065f46 100%);
            padding: 32px 24px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.025em;
        }
        .header p {
            margin: 6px 0 0;
            font-size: 13px;
            color: #ccfbf1;
            font-weight: 500;
        }
        .content {
            padding: 32px 28px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #0f172a;
        }
        .text {
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
            margin-bottom: 24px;
        }
        .otp-box {
            background: #f0fdfa;
            border: 2px dashed #14b8a6;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin: 28px 0;
        }
        .otp-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-weight: 700;
            color: #0f766e;
            margin-bottom: 8px;
        }
        .otp-code {
            font-size: 38px;
            font-weight: 800;
            letter-spacing: 0.35em;
            color: #0f766e;
            font-family: 'Courier New', Courier, monospace;
        }
        .expiry-note {
            font-size: 12px;
            color: #64748b;
            margin-top: 8px;
        }
        .warning-box {
            background-color: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 14px 16px;
            border-radius: 6px;
            margin-top: 24px;
            font-size: 12px;
            color: #92400e;
            line-height: 1.5;
        }
        .footer {
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 20px 24px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>INOVA-HUB SUMBAWA</h1>
            <p>Sistem Repositori & Pembinaan Inovasi Daerah Kab. Sumbawa</p>
        </div>
        <div class="content">
            <div class="greeting">Halo, {{ $nama }}</div>
            <p class="text">
                Permintaan pembuatan akun <strong>Superadmin (BAPPERIDA)</strong> telah diinisiasi melalui terminal aplikasi (CLI).
                Gunakan Kode OTP di bawah ini untuk memverifikasi dan menyelesaikan pendaftaran akun Anda:
            </p>

            <div class="otp-box">
                <div class="otp-label">Kode Verifikasi OTP Superadmin</div>
                <div class="otp-code">{{ $otp }}</div>
                <div class="expiry-note">Berlaku selama 10 menit ke depan</div>
            </div>

            <div class="warning-box">
                <strong>PENTING:</strong> Jangan berikan kode ini kepada siapa pun. Tim Pengelola INOVA-HUB tidak pernah meminta kode OTP rahasia Anda. Jika Anda tidak merasa melakukan proses ini, abaikan email ini.
            </div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Badan Perencanaan Pembangunan, Riset dan Inovasi Daerah (BAPPERIDA)<br>
            Pemerintah Kabupaten Sumbawa, Nusa Tenggara Barat
        </div>
    </div>
</body>
</html>
