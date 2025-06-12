import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        path: string;
        per_page: number;
        to: number | null;
        total: number;
    };
    onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
    return (
        <div className="flex items-center justify-between py-4">
            <div className="text-sm text-zinc-500">
                Showing {meta.from || 0} to {meta.to || 0} of {meta.total}{" "}
                entries
            </div>

            <div className="flex space-x-1">
                {/* Previous Page */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(meta.current_page - 1)}
                    disabled={meta.current_page <= 1}
                    className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page Numbers */}
                {meta.links.slice(1, -1).map((link, i) => (
                    <Button
                        key={i}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                            if (link.url) onPageChange(Number(link.label));
                        }}
                        disabled={!link.url || link.active}
                        className={
                            link.active
                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                : "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                        }
                    >
                        {link.label}
                    </Button>
                ))}

                {/* Next Page */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(meta.current_page + 1)}
                    disabled={meta.current_page >= meta.last_page}
                    className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
