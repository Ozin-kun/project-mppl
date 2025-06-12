// Pages/Admin/Bookings.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, Eye, Calendar } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import AdminLayout from "@/Layouts/AdminLayout";
import { Booking } from "@/types/booking";
import { formatDate, formatCurrency } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { useToast } from "@/Hooks/use-toast";
import { BookingDetailsDialog } from "@/Components/Admin/BookingDetailsDialog";
import Pagination from "@/Components/Admin/Pagination";

interface BookingsProps {
    bookings: {
        data: Booking[];
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
    filters: {
        status?: string;
        search?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function AdminBookingsPage({
    bookings,
    filters,
    flash,
}: BookingsProps) {
    console.log(bookings);
    console.log(bookings.links);
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "all");
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
        null
    );
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast({
                title: "Success",
                description: flash.success,
            });
        }

        if (flash?.error) {
            toast({
                title: "Error",
                description: flash.error,
                variant: "destructive",
            });
        }
    }, [flash, toast]);

    const handleSearch = () => {
        router.get(
            route("admin.bookings"),
            {
                search: searchTerm,
                status: statusFilter !== "all" ? statusFilter : undefined,
                page: 1,
            },
            {
                preserveState: true,
            }
        );
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        router.get(
            route("admin.bookings"),
            {
                search: searchTerm,
                status: value !== "all" ? value : undefined,
                page: 1,
            },
            {
                preserveState: true,
            }
        );
    };

    const handleViewDetails = (booking: Booking) => {
        setSelectedBooking(booking);
        setDetailsDialogOpen(true);
    };

    const handleUpdateStatus = (booking: Booking, newStatus: string) => {
        setUpdatingStatus(true);

        router.patch(
            route("admin.bookings.update-status", booking.id),
            {
                status: newStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDetailsDialogOpen(false);
                    setSelectedBooking(null);
                    setUpdatingStatus(false);
                },
                onError: () => {
                    setUpdatingStatus(false);
                    toast({
                        title: "Error",
                        description: "Failed to update booking status.",
                        variant: "destructive",
                    });
                },
            }
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route("admin.bookings"),
            {
                search: searchTerm,
                status: statusFilter !== "all" ? statusFilter : undefined,
                page: page,
            },
            {
                preserveState: true,
            }
        );
    };

    return (
        <AdminLayout>
            <div>
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manajemen Booking</h1>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <Input
                            placeholder="Cari booking, pelanggan, atau mobil..."
                            className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Select
                            value={statusFilter}
                            onValueChange={handleStatusFilterChange}
                        >
                            <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-white">
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua Status
                                </SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">
                                    Confirmed
                                </SelectItem>
                                <SelectItem value="cancelled">
                                    Cancelled
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="rounded-md border border-zinc-700">
                    <Table>
                        <TableHeader className="bg-zinc-800">
                            <TableRow className="border-zinc-700">
                                <TableHead className="text-zinc-300">
                                    ID Booking
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    Pelanggan
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    Mobil
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    Tanggal
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    Total
                                </TableHead>
                                <TableHead className="text-zinc-300">
                                    Status
                                </TableHead>
                                <TableHead className="text-right text-zinc-300">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.data.map((booking) => (
                                <TableRow
                                    key={booking.id}
                                    className="border-zinc-700 hover:bg-zinc-800"
                                >
                                    <TableCell className="font-medium text-white">
                                        #{booking.id}
                                    </TableCell>
                                    <TableCell className="text-white">
                                        <div>
                                            <p className="font-medium">
                                                {booking.user?.name}
                                            </p>
                                            <p className="text-xs text-zinc-400">
                                                {booking.user?.email}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <div className="relative h-10 w-10 overflow-hidden rounded-md">
                                                <img
                                                    src={
                                                        booking.car?.image ||
                                                        "/placeholder-car.svg"
                                                    }
                                                    alt={`${booking.car?.brand} ${booking.car?.model}`}
                                                    className="object-cover absolute w-full h-full"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">
                                                    {booking.car?.brand}{" "}
                                                    {booking.car?.model}
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    {booking.car?.license_plate}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="text-xs text-zinc-500">
                                                {formatDate(booking.start_date)}{" "}
                                                - {formatDate(booking.end_date)}
                                            </p>
                                            <p className="text-xs font-medium">
                                                {booking.total_days || 0} hari
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-amber-500 font-medium">
                                        {formatCurrency(
                                            Number(booking.total_amount)
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={booking.status} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                                            size="sm"
                                            onClick={() =>
                                                handleViewDetails(booking)
                                            }
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {bookings.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center h-24 text-zinc-500"
                                    >
                                        Tidak ada booking yang ditemukan
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <Pagination
                    meta={{
                        current_page: bookings.current_page,
                        from: bookings.from,
                        last_page: bookings.last_page,
                        links: bookings.links,
                        path: bookings.path,
                        per_page: bookings.per_page,
                        to: bookings.to,
                        total: bookings.total,
                    }}
                    onPageChange={handlePageChange}
                />

                {/* Booking Details Dialog */}
                {selectedBooking && (
                    <BookingDetailsDialog
                        booking={selectedBooking}
                        open={detailsDialogOpen}
                        onOpenChange={setDetailsDialogOpen}
                        onUpdateStatus={handleUpdateStatus}
                        isUpdating={updatingStatus}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

// Status Badge Component
function StatusBadge({ status }: { status: Booking["status"] }) {
    const statusConfig = {
        pending: {
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-800",
            borderColor: "border-yellow-300",
            label: "Menunggu",
        },
        confirmed: {
            bgColor: "bg-blue-100",
            textColor: "text-blue-800",
            borderColor: "border-blue-300",
            label: "Terkonfirmasi",
        },
        active: {
            bgColor: "bg-green-100",
            textColor: "text-green-800",
            borderColor: "border-green-300",
            label: "Berlangsung",
        },
        completed: {
            bgColor: "bg-gray-100",
            textColor: "text-gray-800",
            borderColor: "border-gray-300",
            label: "Selesai",
        },
        cancelled: {
            bgColor: "bg-red-100",
            textColor: "text-red-800",
            borderColor: "border-red-300",
            label: "Dibatalkan",
        },
    };

    const config = statusConfig[status] || {
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        borderColor: "border-gray-300",
        label: "Unknown",
    };

    return (
        <span
            className={`inline-flex justify-center items-center px-3 py-1 rounded-full text-xs font-medium border w-24 ${config.bgColor} ${config.textColor} ${config.borderColor}`}
        >
            {config.label}
        </span>
    );
}
