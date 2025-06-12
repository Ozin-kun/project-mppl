import { Search } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { router } from "@inertiajs/react";
import { useState, useCallback } from "react";
import { debounce } from "lodash"; // Install lodash if not already: npm install lodash

interface SearchBoxProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    routeName: string;
}

export default function SearchBox({
    value,
    onChange,
    placeholder = "Search...",
    routeName,
}: SearchBoxProps) {
    const [localValue, setLocalValue] = useState(value);

    // Debounced server-side search
    const debouncedSearch = useCallback(
        debounce((searchValue: string) => {
            router.get(
                route(routeName),
                { search: searchValue, page: 1 },
                { preserveState: true, preserveScroll: true }
            );
        }, 500),
        [routeName]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        onChange(newValue); // Update parent component state
        debouncedSearch(newValue); // Trigger server-side search after debounce
    };

    return (
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
                type="text"
                placeholder={placeholder}
                value={localValue}
                onChange={handleInputChange}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
            />
        </div>
    );
}
