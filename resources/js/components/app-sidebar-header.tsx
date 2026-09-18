import { Breadcrumbs } from '@/components/breadcrumbs';
import { NotificationDropdown } from '@/components/notification-dropdown';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenuHeader } from '@/components/user-menu-header';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 sm:px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 min-w-0">
                <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <ThemeToggle />
                <NotificationDropdown />
                <div className="h-4 w-px bg-border/80 mx-1 hidden sm:block" />
                <UserMenuHeader />
            </div>
        </header>
    );
}
