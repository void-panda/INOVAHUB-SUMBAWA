import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';

export function ThemeToggle() {
    const { appearance, resolvedAppearance, updateAppearance } = useAppearance();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 cursor-pointer text-muted-foreground hover:text-foreground"
                    aria-label="Pilih Mode Tema"
                >
                    {resolvedAppearance === 'dark' ? (
                        <Moon className="h-4 w-4 transition-transform text-teal-400" />
                    ) : (
                        <Sun className="h-4 w-4 transition-transform text-amber-500" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 text-xs">
                <DropdownMenuItem
                    onClick={() => updateAppearance('light')}
                    className={`cursor-pointer ${appearance === 'light' ? 'font-semibold text-teal-600 dark:text-teal-400' : ''}`}
                >
                    <Sun className="mr-2 h-3.5 w-3.5 text-amber-500" />
                    <span>Terang</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateAppearance('dark')}
                    className={`cursor-pointer ${appearance === 'dark' ? 'font-semibold text-teal-600 dark:text-teal-400' : ''}`}
                >
                    <Moon className="mr-2 h-3.5 w-3.5 text-teal-400" />
                    <span>Gelap</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateAppearance('system')}
                    className={`cursor-pointer ${appearance === 'system' ? 'font-semibold text-teal-600 dark:text-teal-400' : ''}`}
                >
                    <Monitor className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <span>Sistem</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
