import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// lib/utils.ts

// Format tanggal ke format yang lebih ramah
export function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
}

// Format nilai mata uang
export function formatCurrency(amount: number): string {
    return "Rp " + amount.toLocaleString("id-ID");
}

// Hitung durasi dalam hari antara dua tanggal
export function calculateDurationInDays(
    startDate: Date,
    endDate: Date
): number {
    const differenceInTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24)); // Convert to days
}
