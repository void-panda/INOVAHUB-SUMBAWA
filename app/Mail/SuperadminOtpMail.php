<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SuperadminOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $nama,
        public string $otp
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "[INOVA-HUB Sumbawa] Kode OTP Verifikasi Akun Superadmin ({$this->otp})",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.superadmin-otp',
            with: [
                'nama' => $this->nama,
                'otp' => $this->otp,
            ],
        );
    }
}
