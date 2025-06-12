"use client";

import { cn } from "@/lib/utils";

interface CarouselDotsProps {
    count: number;
    activeIndex: number;
    onClick: (index: number) => void;
    className?: string;
}

export function CarouselDots({
    count,
    activeIndex,
    onClick,
    className,
}: CarouselDotsProps) {
    return (
        <div className={cn("flex justify-center mt-6", className)}>
            {Array.from({ length: count }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => onClick(index)}
                    className={cn(
                        "h-2 w-2 mx-1 rounded-full transition-all duration-300",
                        index === activeIndex
                            ? "bg-amber-500 w-6"
                            : "bg-zinc-600 hover:bg-zinc-400"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    );
}
