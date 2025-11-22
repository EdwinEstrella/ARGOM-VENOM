import { DottedSurface } from "@/components/ui/dotted-surface";
import { cn } from '@/lib/utils';

interface DottedBackgroundProps {
    children?: React.ReactNode;
    className?: string;
}

export function DottedBackground({ children, className }: DottedBackgroundProps) {
    return (
        <DottedSurface className={cn("size-full", className)}>
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    aria-hidden="true"
                    className={cn(
                        'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
                        'bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_50%)]',
                        'blur-[30px]',
                    )}
                />
                {children}
            </div>
        </DottedSurface>
    );
}