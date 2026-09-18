import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx')
        ).then((module: any) => {
            const page = module.default;
            const isNoLayout = page.layout === null || page.layout === false || name === 'welcome' || name.includes('print');
            const layoutProps = typeof page.layout === 'object' && page.layout !== null && !Array.isArray(page.layout) ? page.layout : {};

            if (isNoLayout) {
                page.layout = (pageEl: React.ReactNode) => pageEl;
            } else if (name.startsWith('auth/')) {
                page.layout = (pageEl: React.ReactNode) => <AuthLayout {...layoutProps}>{pageEl}</AuthLayout>;
            } else if (name.startsWith('settings/')) {
                page.layout = (pageEl: React.ReactNode) => (
                    <AppLayout {...layoutProps}>
                        <SettingsLayout>{pageEl}</SettingsLayout>
                    </AppLayout>
                );
            } else if (typeof page.layout === 'function') {
                // Keep custom layout function if explicitly defined as a function
            } else {
                page.layout = (pageEl: React.ReactNode) => <AppLayout {...layoutProps}>{pageEl}</AppLayout>;
            }
            return module;
        }),
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
