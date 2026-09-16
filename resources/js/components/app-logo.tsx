import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md shadow-2xs">
                <AppLogoIcon className="size-5 text-primary-foreground" />
            </div>
            <div className="grid flex-1 text-left">
                <span className="truncate leading-none font-bold text-sm tracking-tight text-foreground flex items-center gap-1">
                    INOVA-HUB
                </span>
                <span className="truncate text-[10px] text-muted-foreground font-medium leading-tight mt-0.5">
                    Kabupaten Sumbawa
                </span>
            </div>
        </div>
    );
}
