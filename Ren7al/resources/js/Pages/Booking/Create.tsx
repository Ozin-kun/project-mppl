// Pages/Booking/Create.tsx - Updated version
"use client";

import { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import UpcomingBookingsDialog from "@/Components/UpcomingBookingDialog";
import { Textarea } from "@/Components/ui/textarea";
import {
    ArrowLeft,
    CreditCard,
    Clock,
    Calendar,
    X,
    AlertTriangle,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import Navbar from "@/Components/NavBar";
import { Car } from "@/types/car";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

interface BookingCreateProps {
    car: Car;
    unavailableDates: string[];
    upcomingBookings: number;
    upcomingBookingDetails: Array<{
        id: number;
        start_date_formatted: string;
        end_date_formatted: string;
        start_date_short: string;
        end_date_short: string;
    }>;
}

export default function BookingCreate({
    car,
    upcomingBookingDetails,
    upcomingBookings,
}: BookingCreateProps) {
    const [totalDays, setTotalDays] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [hasConflict, setHasConflict] = useState(false);
    const [conflictingBookings, setConflictingBookings] = useState<any[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        car_id: car.id,
        start_date: "",
        end_date: "",
        notes: "",
    });

    const formatRupiah = (amount: number): string => {
        return "Rp " + amount.toLocaleString("id-ID");
    };

    const checkDateConflicts = (startDate: string, endDate: string) => {
        if (!startDate || !endDate) {
            setHasConflict(false);
            setConflictingBookings([]);
            return false;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const conflicts = upcomingBookingDetails.filter((booking) => {
            const bookingStart = new Date(
                booking.start_date_formatted.split(" ").reverse().join("-")
            );
            const bookingEnd = new Date(
                booking.end_date_formatted.split(" ").reverse().join("-")
            );
            return start <= bookingEnd && end >= bookingStart;
        });

        setHasConflict(conflicts.length > 0);
        setConflictingBookings(conflicts);
        return conflicts.length > 0;
    };

    const calculateTotal = (startDate: string, endDate: string) => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (end > start) {
                // Check for conflicts first
                const hasConflicts = checkDateConflicts(startDate, endDate);

                if (hasConflicts) {
                    // Reset calculations if there's a conflict
                    setTotalDays(0);
                    setSubtotal(0);
                    setTaxAmount(0);
                    setTotalAmount(0);
                    return;
                }

                // Calculate if no conflicts
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                const dailyRate =
                    typeof car.rental_price_per_day === "string"
                        ? parseFloat(
                              car.rental_price_per_day.replace(/[^0-9.-]+/g, "")
                          )
                        : car.rental_price_per_day;

                const sub = dailyRate * days;
                const tax = Math.round(sub * 0.12);
                const total = sub + tax;

                setTotalDays(days);
                setSubtotal(sub);
                setTaxAmount(tax);
                setTotalAmount(total);
            } else {
                setTotalDays(0);
                setSubtotal(0);
                setTaxAmount(0);
                setTotalAmount(0);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Final check before submission
        if (hasConflict || totalDays === 0) {
            return; // Silently prevent submission
        }

        post(route("bookings.store"));
    };

    // Can proceed only if no conflicts and valid calculation
    const canProceed =
        data.start_date && data.end_date && totalDays > 0 && !hasConflict;

    const today = new Date().toISOString().split("T")[0];

    const getTomorrowDate = (startDate: string) => {
        if (!startDate) return today;
        const date = new Date(startDate);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split("T")[0];
    };
    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        onClick={() => {
                            if (window.history.length > 1) {
                                window.history.back();
                            } else {
                                router.visit(route("cars.index"));
                            }
                        }}
                        variant="outline"
                        className="bg-transparent border-zinc-600 text-white hover:bg-zinc-700"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </div>

                <h1 className="text-3xl font-bold text-white mb-8 text-center">
                    Book Your Car
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Car Info Card */}
                    <Card className="bg-zinc-800/60 backdrop-blur-sm border-zinc-700">
                        <CardHeader>
                            <CardTitle className="text-white text-xl">
                                {car.brand} {car.model}
                            </CardTitle>
                            <p className="text-zinc-400">{car.year}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="relative mb-6">
                                <img
                                    src={car.image || "/placeholder-car.svg"}
                                    alt={`${car.brand} ${car.model}`}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                <div className="absolute top-3 right-3">
                                    <span className="bg-green-500/90 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                        Available
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 text-zinc-300">
                                <div className="flex justify-between">
                                    <span>License Plate:</span>
                                    <span className="font-medium">
                                        {car.license_plate}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Seats:</span>
                                    <span className="font-medium">
                                        {car.seats} passengers
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Daily Rate:</span>
                                    <span className="font-bold text-amber-400">
                                        {formatRupiah(
                                            typeof car.rental_price_per_day ===
                                                "string"
                                                ? parseFloat(
                                                      car.rental_price_per_day.replace(
                                                          /[^0-9.-]+/g,
                                                          ""
                                                      )
                                                  )
                                                : car.rental_price_per_day
                                        )}
                                    </span>
                                </div>
                            </div>

                            {car.description && (
                                <div className="mt-4 p-4 bg-zinc-700/50 rounded-lg">
                                    <h4 className="text-white font-medium mb-2">
                                        Description
                                    </h4>
                                    <p className="text-zinc-300 text-sm">
                                        {car.description}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Booking Form */}
                    <Card className="bg-zinc-800/60 backdrop-blur-sm border-zinc-700">
                        <CardHeader>
                            <CardTitle className="text-white text-xl">
                                Booking Details
                            </CardTitle>
                            <UpcomingBookingsDialog
                                upcomingBookings={upcomingBookings}
                                upcomingBookingDetails={upcomingBookingDetails}
                                variant="default"
                            />
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Date Range */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Start Date */}
                                    <div>
                                        <Label
                                            htmlFor="start_date"
                                            className="text-white text-sm font-medium"
                                        >
                                            Tanggal Ambil
                                        </Label>
                                        <Input
                                            type="date"
                                            id="start_date"
                                            className={`mt-1 bg-zinc-700 border-zinc-600 text-white focus:border-amber-500 focus:ring-amber-500 ${
                                                hasConflict &&
                                                data.start_date &&
                                                data.end_date
                                                    ? "border-red-500 ring-red-500"
                                                    : ""
                                            }`}
                                            value={data.start_date}
                                            min={today}
                                            onChange={(e) => {
                                                setData(
                                                    "start_date",
                                                    e.target.value
                                                );
                                                calculateTotal(
                                                    e.target.value,
                                                    data.end_date
                                                );
                                            }}
                                        />
                                        {errors.start_date && (
                                            <p className="text-red-400 text-sm mt-1">
                                                {errors.start_date}
                                            </p>
                                        )}
                                    </div>

                                    {/* End Date */}
                                    <div>
                                        <Label
                                            htmlFor="end_date"
                                            className="text-white text-sm font-medium"
                                        >
                                            Tanggal Kembali
                                        </Label>
                                        <Input
                                            type="date"
                                            id="end_date"
                                            className={`mt-1 bg-zinc-700 border-zinc-600 text-white focus:border-amber-500 focus:ring-amber-500 ${
                                                hasConflict &&
                                                data.start_date &&
                                                data.end_date
                                                    ? "border-red-500 ring-red-500"
                                                    : ""
                                            }`}
                                            value={data.end_date}
                                            min={getTomorrowDate(
                                                data.start_date
                                            )}
                                            onChange={(e) => {
                                                setData(
                                                    "end_date",
                                                    e.target.value
                                                );
                                                calculateTotal(
                                                    data.start_date,
                                                    e.target.value
                                                );
                                            }}
                                        />
                                        {errors.end_date && (
                                            <p className="text-red-400 text-sm mt-1">
                                                {errors.end_date}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Conflict Warning */}
                                {hasConflict &&
                                    data.start_date &&
                                    data.end_date && (
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                            <div className="flex items-start space-x-3">
                                                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <h4 className="text-red-400 font-medium mb-2">
                                                        Date Conflict Detected
                                                    </h4>
                                                    <p className="text-red-300 text-sm mb-3">
                                                        Selected dates overlap
                                                        with existing bookings.
                                                        Please choose different
                                                        dates.
                                                    </p>

                                                    {/* Show conflicting bookings */}
                                                    {conflictingBookings.length >
                                                        0 && (
                                                        <div className="space-y-2">
                                                            <p className="text-red-200 text-xs font-medium">
                                                                Conflicting
                                                                bookings:
                                                            </p>
                                                            {conflictingBookings.map(
                                                                (booking) => (
                                                                    <div
                                                                        key={
                                                                            booking.id
                                                                        }
                                                                        className="text-red-200 text-xs bg-red-500/20 rounded px-2 py-1"
                                                                    >
                                                                        {
                                                                            booking.start_date_formatted
                                                                        }{" "}
                                                                        -{" "}
                                                                        {
                                                                            booking.end_date_formatted
                                                                        }
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    )}

                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setData(
                                                                "start_date",
                                                                ""
                                                            );
                                                            setData(
                                                                "end_date",
                                                                ""
                                                            );
                                                            setHasConflict(
                                                                false
                                                            );
                                                            setConflictingBookings(
                                                                []
                                                            );
                                                            setTotalDays(0);
                                                            setSubtotal(0);
                                                            setTaxAmount(0);
                                                            setTotalAmount(0);
                                                        }}
                                                        className="mt-3 bg-red-600 hover:bg-red-700 text-white border-red-600"
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Clear Dates
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                {/* Notes */}
                                <div>
                                    <Label
                                        htmlFor="notes"
                                        className="text-white text-sm font-medium"
                                    >
                                        Catatan Khusus (Opsional)
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        className="mt-1 bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-amber-500 focus:ring-amber-500"
                                        placeholder="Permintaan khusus atau catatan..."
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                    />
                                </div>

                                {/* Booking Summary - Only show if valid dates and no conflicts */}
                                {totalDays > 0 && !hasConflict && (
                                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-4 rounded-lg">
                                        <h3 className="text-white font-semibold mb-3">
                                            Ringkasan Booking
                                        </h3>
                                        <div className="space-y-2 text-zinc-300">
                                            <div className="flex justify-between">
                                                <span>Periode Sewa:</span>
                                                <span className="font-medium">
                                                    {totalDays} hari
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Tarif Harian:</span>
                                                <span className="font-medium">
                                                    {formatRupiah(
                                                        typeof car.rental_price_per_day ===
                                                            "string"
                                                            ? parseFloat(
                                                                  car.rental_price_per_day.replace(
                                                                      /[^0-9.-]+/g,
                                                                      ""
                                                                  )
                                                              )
                                                            : car.rental_price_per_day
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Subtotal:</span>
                                                <span className="font-medium">
                                                    {formatRupiah(subtotal)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>PPN (12%):</span>
                                                <span>
                                                    {formatRupiah(taxAmount)}
                                                </span>
                                            </div>
                                            <hr className="border-zinc-600" />
                                            <div className="flex justify-between text-lg">
                                                <span className="font-semibold text-white">
                                                    Total Bayar:
                                                </span>
                                                <span className="font-bold text-amber-400">
                                                    {formatRupiah(totalAmount)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !data.start_date ||
                                        !data.end_date ||
                                        totalDays === 0 ||
                                        hasConflict
                                    }
                                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <CreditCard className="h-5 w-5" />
                                            <span>
                                                {hasConflict
                                                    ? "Resolve Date Conflicts First"
                                                    : !data.start_date ||
                                                      !data.end_date
                                                    ? "Select Dates to Continue"
                                                    : totalDays === 0
                                                    ? "Select Valid Date Range"
                                                    : `Proceed to Payment ${formatRupiah(
                                                          totalAmount
                                                      )}`}
                                            </span>
                                        </div>
                                    )}
                                </Button>

                                {/* Help text */}
                                {hasConflict && (
                                    <p className="text-red-400 text-sm text-center">
                                        Please select different dates to
                                        continue with your booking.
                                    </p>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Payment Flow Info */}
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-4 text-zinc-400 text-sm">
                        <div className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-1">
                            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                1
                            </div>
                            <span className="text-xs sm:text-sm">
                                Select Dates
                            </span>
                        </div>
                        <div className="w-6 h-px bg-zinc-600"></div>
                        <div className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-1">
                            <div className="w-6 h-6 bg-zinc-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                2
                            </div>
                            <span className="text-xs sm:text-sm">Payment</span>
                        </div>
                        <div className="w-6 h-px bg-zinc-600"></div>
                        <div className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-1">
                            <div className="w-6 h-6 bg-zinc-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                3
                            </div>
                            <span className="text-xs sm:text-sm">
                                Confirmation
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
