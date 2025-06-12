// Pages/Booking/Index.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import {
    ArrowLeft,
    Calendar,
    Car as CarIcon,
    Clock,
    CheckCircle,
    AlertCircle,
    CreditCard,
    Search,
    Filter,
    Eye,
    X,
} from "lucide-react";
import { Link, router } from "@inertiajs/react";
import Navbar from "@/Components/NavBar";
import { Booking } from "@/types/booking";
import Pagination from "@/Components/Admin/Pagination"; // Import pagination

interface BookingIndexProps {
    bookings: {
        data: Booking[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        path: string;
    };
}

export default function BookingIndex({ bookings }: BookingIndexProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [processing, setProcessing] = useState<number | null>(null);

    const formatRupiah = (amount: number): string => {
        return "Rp " + amount.toLocaleString("id-ID");
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: {
                bg: "bg-yellow-500/20",
                text: "text-yellow-400",
                label: "Menunggu Pembayaran",
                icon: AlertCircle,
            },
            confirmed: {
                bg: "bg-green-500/20",
                text: "text-green-400",
                label: "Dikonfirmasi",
                icon: CheckCircle,
            },
            active: {
                bg: "bg-blue-500/20",
                text: "text-blue-400",
                label: "Sedang Berlangsung",
                icon: Clock,
            },
            completed: {
                bg: "bg-gray-500/20",
                text: "text-gray-300",
                label: "Selesai",
                icon: CheckCircle,
            },
            cancelled: {
                bg: "bg-red-500/20",
                text: "text-red-400",
                label: "Dibatalkan",
                icon: AlertCircle,
            },
        };

        const config =
            statusConfig[status as keyof typeof statusConfig] ||
            statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge
                className={`${config.bg} ${config.text} border-none flex items-center space-x-1 min-w-[160px] justify-center`}
            >
                <Icon className="h-3 w-3" />
                <span>{config.label}</span>
            </Badge>
        );
    };

    const handleContinuePayment = (bookingId: number) => {
        router.visit(route("booking.payment", bookingId));
    };

    const handleCancelBooking = async (bookingId: number) => {
        if (
            !confirm(
                "Are you sure you want to cancel this booking? This action cannot be undone."
            )
        ) {
            return;
        }

        setProcessing(bookingId);

        try {
            await new Promise<void>((resolve, reject) => {
                router.patch(
                    route("bookings.cancel", bookingId),
                    {},
                    {
                        onSuccess: () => {
                            resolve();
                        },
                        onError: (errors) => {
                            console.error("Cancellation failed:", errors);
                            alert(
                                "Failed to cancel booking. Please try again."
                            );
                            reject(new Error("Cancellation failed"));
                        },
                        onFinish: () => {
                            setProcessing(null);
                        },
                    }
                );
            });
        } catch (error) {
            console.error("Cancel booking error:", error);
        }
    };

    // ✅ Add pagination handler
    const handlePageChange = (page: number) => {
        router.get(
            route("bookings.index"),
            {
                page: page,
                search: searchTerm || undefined,
                status: statusFilter !== "all" ? statusFilter : undefined,
            },
            {
                preserveState: true,
                preserveScroll: false,
            }
        );
    };

    // Filter bookings (client-side for current page only)
    const filteredBookings = bookings.data.filter((booking) => {
        const matchesSearch =
            booking.car?.brand
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            booking.car?.model
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            booking.car?.license_plate
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link href={route("home")}>
                            <Button
                                variant="outline"
                                className="bg-transparent border-zinc-600 text-white hover:bg-zinc-700"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold text-white text-center sm:text-left">
                            My Bookings
                        </h1>
                    </div>

                    <div className="text-zinc-400 text-center lg:text-right">
                        Total: {bookings.total} bookings
                    </div>
                </div>

                {/* Filters */}
                <Card className="bg-zinc-800/60 backdrop-blur-sm border-zinc-700 mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                                    <Input
                                        placeholder="Search by car brand, model, or license plate..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-10 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-amber-500 focus:ring-amber-500"
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="md:w-48">
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:border-amber-500 focus:ring-amber-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">
                                        Menunggu Pembayaran
                                    </option>
                                    <option value="confirmed">
                                        Dikonfirmasi
                                    </option>
                                    <option value="active">
                                        Sedang Berlangsung
                                    </option>
                                    <option value="completed">Selesai</option>
                                    <option value="cancelled">
                                        Dibatalkan
                                    </option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Booking List */}
                {filteredBookings.length === 0 ? (
                    <Card className="bg-zinc-800/60 backdrop-blur-sm border-zinc-700">
                        <CardContent className="p-12 text-center">
                            <CarIcon className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">
                                No Bookings Found
                            </h3>
                            <p className="text-zinc-400 mb-6">
                                {searchTerm || statusFilter !== "all"
                                    ? "No bookings match your search criteria."
                                    : "You haven't made any bookings yet."}
                            </p>
                            <Link href={route("home")}>
                                <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                                    Browse Cars
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {filteredBookings.map((booking) => (
                            <Card
                                key={booking.id}
                                className="bg-zinc-800/60 backdrop-blur-sm border-zinc-700 hover:border-zinc-600 transition-colors"
                            >
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Car Image */}
                                        <div className="lg:w-48 flex-shrink-0">
                                            <img
                                                src={
                                                    booking.car?.image ||
                                                    "/placeholder-car.svg"
                                                }
                                                alt={`${booking.car?.brand} ${booking.car?.model}`}
                                                className="w-full h-32 lg:h-36 object-cover rounded-lg"
                                                onError={(e) => {
                                                    const target =
                                                        e.target as HTMLImageElement;
                                                    target.src =
                                                        "/placeholder-car.svg";
                                                }}
                                            />
                                        </div>

                                        {/* Booking Details */}
                                        <div className="flex-1 space-y-4">
                                            {/* Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-white">
                                                        {booking.car?.brand}{" "}
                                                        {booking.car?.model}
                                                    </h3>
                                                    <p className="text-zinc-400 text-sm">
                                                        Booking #{booking.id} •{" "}
                                                        {
                                                            booking.car
                                                                ?.license_plate
                                                        }
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    {getStatusBadge(
                                                        booking.status
                                                    )}
                                                </div>
                                            </div>

                                            {/* Booking Info */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4 text-amber-400" />
                                                    <div>
                                                        <p className="text-zinc-400">
                                                            Check-in
                                                        </p>
                                                        <p className="text-white font-medium">
                                                            {new Date(
                                                                booking.start_date
                                                            ).toLocaleDateString(
                                                                "id-ID"
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4 text-amber-400" />
                                                    <div>
                                                        <p className="text-zinc-400">
                                                            Check-out
                                                        </p>
                                                        <p className="text-white font-medium">
                                                            {new Date(
                                                                booking.end_date
                                                            ).toLocaleDateString(
                                                                "id-ID"
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-4 w-4 text-amber-400" />
                                                    <div>
                                                        <p className="text-zinc-400">
                                                            Duration
                                                        </p>
                                                        <p className="text-white font-medium">
                                                            {booking.total_days}{" "}
                                                            days
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <CreditCard className="h-4 w-4 text-amber-400" />
                                                    <div>
                                                        <p className="text-zinc-400">
                                                            Total
                                                        </p>
                                                        <p className="text-white font-medium">
                                                            {formatRupiah(
                                                                Number(
                                                                    booking.total_amount
                                                                )
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Status */}
                                            {booking.payment && (
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <div
                                                        className={`w-2 h-2 rounded-full ${
                                                            booking.payment
                                                                .payment_status ===
                                                            "paid"
                                                                ? "bg-green-500"
                                                                : booking
                                                                      .payment
                                                                      .payment_status ===
                                                                  "pending"
                                                                ? "bg-yellow-500"
                                                                : "bg-red-500"
                                                        }`}
                                                    ></div>
                                                    <span className="text-zinc-400">
                                                        Payment:
                                                    </span>
                                                    <span
                                                        className={`font-medium ${
                                                            booking.payment
                                                                .payment_status ===
                                                            "paid"
                                                                ? "text-green-400"
                                                                : booking
                                                                      .payment
                                                                      .payment_status ===
                                                                  "pending"
                                                                ? "text-yellow-400"
                                                                : "text-red-400"
                                                        }`}
                                                    >
                                                        {booking.payment
                                                            .payment_status ===
                                                        "paid"
                                                            ? "Paid"
                                                            : booking.payment
                                                                  .payment_status ===
                                                              "pending"
                                                            ? "Pending"
                                                            : "Failed"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions - Grid Layout */}
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-700 lg:border-t-0 lg:pt-0 lg:w-48 lg:flex lg:flex-col lg:ml-4">
                                            {/* Mobile: Cancel and View Details in one row with equal width */}
                                            <div className="flex gap-3 col-span-2 sm:hidden">
                                                {/* Cancel Button (if pending) */}
                                                {(booking.status ===
                                                    "pending" ||
                                                    booking.status ===
                                                        "confirmed") && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleCancelBooking(
                                                                booking.id
                                                            )
                                                        }
                                                        disabled={
                                                            processing ===
                                                            booking.id
                                                        }
                                                        className="flex-1 bg-transparent border-red-600 text-red-400 hover:bg-red-600 hover:text-white disabled:opacity-50"
                                                    >
                                                        {processing ===
                                                        booking.id ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                                                                Cancelling...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <X className="h-4 w-4 mr-2" />
                                                                Cancel
                                                            </>
                                                        )}
                                                    </Button>
                                                )}

                                                {/* View Details Button */}
                                                <Link
                                                    href={route(
                                                        "bookings.show",
                                                        booking.id
                                                    )}
                                                    className="flex-1"
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full bg-transparent border-zinc-600 text-white hover:bg-zinc-700 font-medium"
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>

                                            {/* Continue Payment (Mobile - Full width) */}
                                            <div className="col-span-2 sm:hidden">
                                                {booking.status === "pending" &&
                                                    booking.payment
                                                        ?.payment_status ===
                                                        "pending" && (
                                                        <Button
                                                            onClick={() =>
                                                                handleContinuePayment(
                                                                    booking.id
                                                                )
                                                            }
                                                            size="sm"
                                                            className="w-full bg-gradient-to-r from-amber-600 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white"
                                                        >
                                                            Continue Payment
                                                        </Button>
                                                    )}
                                            </div>

                                            {/* Desktop/Tablet Layout - Hidden on mobile */}
                                            <div className="hidden sm:flex sm:col-span-3 lg:flex-col lg:gap-3">
                                                {/* Left Side - Cancel (if pending) */}
                                                <div className="flex justify-start lg:justify-center">
                                                    {(booking.status ===
                                                        "pending" ||
                                                        booking.status ===
                                                            "confirmed") && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleCancelBooking(
                                                                    booking.id
                                                                )
                                                            }
                                                            disabled={
                                                                processing ===
                                                                booking.id
                                                            }
                                                            className="w-full sm:w-auto lg:min-w-[140px] bg-transparent border-red-600 text-red-400 hover:bg-red-600 hover:text-white disabled:opacity-50"
                                                        >
                                                            {processing ===
                                                            booking.id ? (
                                                                <>
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                                                                    Cancelling...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <X className="h-4 w-4 mr-2" />
                                                                    Cancel
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>

                                                {/* Center - View Details */}
                                                <div className="flex justify-center">
                                                    <Link
                                                        href={route(
                                                            "bookings.show",
                                                            booking.id
                                                        )}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full sm:w-auto lg:min-w-[140px] bg-transparent border-zinc-600 text-white hover:bg-zinc-700 font-medium"
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </div>

                                                {/* Right Side - Continue Payment (if pending) */}
                                                <div className="flex justify-end lg:justify-center">
                                                    {booking.status ===
                                                        "pending" &&
                                                        booking.payment
                                                            ?.payment_status ===
                                                            "pending" && (
                                                            <Button
                                                                onClick={() =>
                                                                    handleContinuePayment(
                                                                        booking.id
                                                                    )
                                                                }
                                                                size="sm"
                                                                className="w-full sm:w-auto lg:min-w-[140px] bg-gradient-to-r from-amber-600 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white"
                                                            >
                                                                Continue Payment
                                                            </Button>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* ✅ Add Pagination Component */}
                {bookings.last_page > 1 && (
                    <div className="mt-8">
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
                    </div>
                )}
            </div>
        </div>
    );
}
