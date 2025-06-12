import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-zinc-900 text-zinc-50 hover:bg-zinc-800",
                secondary:
                    "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
                destructive:
                    "border-transparent bg-red-500 text-white hover:bg-red-600",
                outline: "text-zinc-50 border-zinc-700",
                amber: "border-transparent bg-amber-500 text-zinc-900 hover:bg-amber-600",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
