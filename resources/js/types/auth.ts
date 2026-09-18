import type { Notifikasi, Opd } from './models';

export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    opd_id?: number | null;
    nama_pemda?: string | null;
    opd?: Opd | null;
    no_whatsapp?: string | null;
    pekerjaan?: string | null;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
};

export type Auth = {
    user: User;
    roles?: string[];
    permissions?: string[];
    unreadNotificationsCount?: number;
    recentNotifications?: Notifikasi[];
};

export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
