import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepItem {
    id: string | number;
    title: string;
    description?: string;
    icon?: React.ReactNode;
}

interface StepWizardProps {
    steps: StepItem[];
    currentStep: number;
    onStepClick?: (stepIndex: number) => void;
    className?: string;
}

export function StepWizard({
    steps,
    currentStep,
    onStepClick,
    className,
}: StepWizardProps) {
    return (
        <div className={cn('w-full py-4', className)}>
            <ol className="flex items-center w-full">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    const isClickable = onStepClick && index <= currentStep;
                    const isLast = index === steps.length - 1;

                    return (
                        <li
                            key={step.id}
                            className={cn(
                                'flex items-center',
                                !isLast ? 'w-full' : 'w-auto'
                            )}
                        >
                            <div className="flex flex-col items-center group relative">
                                <button
                                    type="button"
                                    onClick={() => isClickable && onStepClick(index)}
                                    disabled={!isClickable}
                                    className={cn(
                                        'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                                        isCompleted &&
                                            'border-primary bg-primary text-primary-foreground shadow-sm hover:opacity-90',
                                        isActive &&
                                            'border-primary bg-background text-primary ring-4 ring-primary/20 shadow-md font-bold scale-105',
                                        !isCompleted &&
                                            !isActive &&
                                            'border-muted-foreground/30 bg-muted/40 text-muted-foreground cursor-not-allowed'
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-5 w-5 stroke-[2.5]" />
                                    ) : (
                                        step.icon || <span>{index + 1}</span>
                                    )}
                                </button>

                                <div className="mt-2 text-center hidden md:block max-w-[120px]">
                                    <p
                                        className={cn(
                                            'text-xs font-semibold leading-tight transition-colors',
                                            isActive
                                                ? 'text-primary font-bold'
                                                : isCompleted
                                                ? 'text-foreground'
                                                : 'text-muted-foreground'
                                        )}
                                    >
                                        {step.title}
                                    </p>
                                    {step.description && (
                                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                            {step.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {!isLast && (
                                <div
                                    className={cn(
                                        'h-[2px] w-full mx-2 transition-colors duration-300 relative top-[-10px] md:top-[-18px]',
                                        isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'
                                    )}
                                />
                            )}
                        </li>
                    );
                })}
            </ol>

            {/* Mobile Title View */}
            <div className="mt-3 text-center md:hidden bg-muted/30 p-2.5 rounded-lg border border-border/50">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Langkah {currentStep + 1} dari {steps.length}
                </span>
                <span className="text-sm font-bold text-foreground">
                    {steps[currentStep]?.title}
                </span>
                {steps[currentStep]?.description && (
                    <span className="text-xs text-muted-foreground block mt-0.5">
                        {steps[currentStep]?.description}
                    </span>
                )}
            </div>
        </div>
    );
}
