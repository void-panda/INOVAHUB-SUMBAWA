import type { InertiaLinkProps } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { toUrl } from '@/lib/utils';

export type IsCurrentUrlFn = (
    urlToCheck: NonNullable<InertiaLinkProps['href']>,
    currentUrl?: string,
    startsWith?: boolean,
) => boolean;

export type IsCurrentOrParentUrlFn = (
    urlToCheck: NonNullable<InertiaLinkProps['href']>,
    currentUrl?: string,
) => boolean;

export type WhenCurrentUrlFn = <TIfTrue, TIfFalse = null>(
    urlToCheck: NonNullable<InertiaLinkProps['href']>,
    ifTrue: TIfTrue,
    ifFalse?: TIfFalse,
) => TIfTrue | TIfFalse;

export type UseCurrentUrlReturn = {
    currentUrl: string;
    isCurrentUrl: IsCurrentUrlFn;
    isCurrentOrParentUrl: IsCurrentOrParentUrlFn;
    whenCurrentUrl: WhenCurrentUrlFn;
};

export function useCurrentUrl(): UseCurrentUrlReturn {
    const page = usePage();
    const currentUrlPath = new URL(
        page.url,
        typeof window !== 'undefined'
            ? window.location.origin
            : 'http://localhost',
    ).pathname;

    const isCurrentUrl: IsCurrentUrlFn = (
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        currentUrl?: string,
        startsWith: boolean = false,
    ) => {
        const urlToCompare = currentUrl ?? currentUrlPath;
        const urlString = toUrl(urlToCheck);

        const comparePath = (path: string): boolean =>
            startsWith ? urlToCompare.startsWith(path) : path === urlToCompare;

        if (!urlString.startsWith('http')) {
            return comparePath(urlString);
        }

        try {
            const absoluteUrl = new URL(urlString);

            return comparePath(absoluteUrl.pathname);
        } catch {
            return false;
        }
    };

    const isCurrentOrParentUrl: IsCurrentOrParentUrlFn = (
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        currentUrl?: string,
    ) => {
        const urlToCompare = currentUrl ?? currentUrlPath;
        const urlString = toUrl(urlToCheck);

        let targetPath = urlString;
        if (urlString.startsWith('http')) {
            try {
                targetPath = new URL(urlString).pathname;
            } catch {
                return false;
            }
        }

        // 1. Exact match
        if (urlToCompare === targetPath) {
            return true;
        }

        // 2. Never match root '/' or empty string to everything
        if (targetPath === '/' || targetPath === '') {
            return urlToCompare === '/' || urlToCompare === '';
        }

        // 3. Segment boundary check: urlToCompare must start with targetPath + '/'
        const targetWithSlash = targetPath.endsWith('/') ? targetPath : `${targetPath}/`;
        if (urlToCompare.startsWith(targetWithSlash)) {
            return true;
        }

        // 4. Special route mappings in INOVA-HUB:
        // a. Inovasi Daerah:
        // Sidebar item has href: `${domainPrefix}/inovasi-daerah` (/penilai/inovasi-daerah, /inovator/inovasi-daerah, etc.)
        // But actual subroutes are `/inovasi-daerah/{pengajuan}/indikator/...` or `/inovasi-daerah/print-rekap`
        if (
            targetPath.endsWith('/inovasi-daerah') &&
            (urlToCompare === '/inovasi-daerah' || urlToCompare.startsWith('/inovasi-daerah/'))
        ) {
            return true;
        }

        // b. Inovasi Saya:
        // Sidebar item has href: `/inovator/inovasi`
        // Direct alias routes: `/inovasi/{id}/edit`, `/inovasi/create`
        if (
            targetPath.endsWith('/inovasi') &&
            !targetPath.endsWith('/inovasi-daerah') &&
            (urlToCompare === '/inovasi' ||
                urlToCompare === '/inovasi/create' ||
                (urlToCompare.startsWith('/inovasi/') && !urlToCompare.startsWith('/inovasi-daerah/')))
        ) {
            return true;
        }

        // c. Usulan Lomba Masuk:
        // Sidebar item has href: `/superadmin/pengajuan-lomba`
        // Direct alias routes: `/pengajuan-lomba/{id}`
        if (
            targetPath.endsWith('/pengajuan-lomba') &&
            (urlToCompare === '/pengajuan-lomba' || urlToCompare.startsWith('/pengajuan-lomba/'))
        ) {
            return true;
        }

        return false;
    };

    const whenCurrentUrl: WhenCurrentUrlFn = <TIfTrue, TIfFalse = null>(
        urlToCheck: NonNullable<InertiaLinkProps['href']>,
        ifTrue: TIfTrue,
        ifFalse: TIfFalse = null as TIfFalse,
    ): TIfTrue | TIfFalse => {
        return isCurrentOrParentUrl(urlToCheck) ? ifTrue : ifFalse;
    };

    return {
        currentUrl: currentUrlPath,
        isCurrentUrl,
        isCurrentOrParentUrl,
        whenCurrentUrl,
    };
}
