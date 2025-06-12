// Pages/Booking/Payment.tsx - Simplified version
"use client";

import { useState } from "react";
import { router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
    ArrowLeft,
    CreditCard,
    Shield,
    Clock,
    Car as CarIcon,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import Navbar from "@/Components/NavBar";
import { Booking } from "@/types/booking";

interface PaymentPageProps {
    booking: Booking;
}

export default function PaymentPage({ booking }: PaymentPageProps) {
    const [processing, setProcessing] = useState(false);

    const formatRupiah = (amount: number): string => {
        return "Rp " + amount.toLocaleString("id-ID");
    };

    // Simplified payment handler - Direct form submission
    const handlePayment = () => {
        setProcessing(true);

        // Create form and submit to Laravel
        const form = document.createElement("form");
        form.method = "POST";
        form.action = route("booking.payment.process", booking.id);

        // Add CSRF token
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");
        if (csrfToken) {
            const csrfInput = document.createElement("input");
            csrfInput.type = "hidden";
            csrfInput.name = "_token";
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
        }

        // Add to page and submit
        document.body.appendChild(form);
        form.submit();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        variant="outline"
                        className="bg-transparent border-zinc-600 text-white hover:bg-zinc-700"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </div>

                <h1 className="text-3xl font-bold text-white mb-8 text-center">
                    Complete Your Payment
                </h1>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-4 text-sm">
                        <div className="flex flex-col items-center space-y-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                ✓
                            </div>
                            <span className="text-green-400 font-medium text-xs sm:text-sm">
                                <span className="hidden sm:inline">
                                    Booking Details
                                </span>
                                <span className="sm:hidden">Details</span>
                            </span>
                        </div>
                        <div className="w-8 sm:w-12 h-px bg-amber-500 mt-[-10px]"></div>
                        <div className="flex flex-col items-center space-y-2">
                            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                                2
                            </div>
                            <span className="text-amber-400 font-medium text-xs sm:text-sm">
                                Payment
                            </span>
                        </div>
                        <div className="w-8 sm:w-12 h-px bg-zinc-600 mt-[-10px]"></div>
                        <div className="flex flex-col items-center space-y-2">
                            <div className="w-8 h-8 bg-zinc-600 rounded-full flex items-center justify-center text-white font-bold">
                                3
                            </div>
                            <span className="text-zinc-400 text-xs sm:text-sm">
                                <span className="hidden sm:inline">
                                    Confirmation
                                </span>
                                <span className="sm:hidden">Confirm</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Booking Summary */}
                    <Card className="bg-zinc-800/60 backdrop-blur-sm border-zinc-700">
                        <CardHeader>
                            <CardTitle className="text-white text-xl flex items-center">
                                <CarIcon className="h-5 w-5 mr-2" />
                                Booking Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Car Info */}
                            <div className="flex items-center space-x-4 p-4 bg-zinc-700/50 rounded-lg">
                                <img
                                    src={
                                        booking.car?.image ||
                                        "/placeholder-car.svg"
                                    }
                                    alt={`${booking.car?.brand || "Unknown"} ${
                                        booking.car?.model || "Car"
                                    }`}
                                    className="w-20 h-16 object-cover rounded-lg"
                                    onError={(e) => {
                                        const target =
                                            e.target as HTMLImageElement;
                                        target.src = "/placeholder-car.svg";
                                    }}
                                />
                                <div>
                                    <h3 className="text-white font-semibold text-lg">
                                        {booking.car?.brand || "Unknown"}{" "}
                                        {booking.car?.model || "Car"}
                                    </h3>
                                    <p className="text-zinc-400 text-sm">
                                        {booking.car?.year || "N/A"} •{" "}
                                        {booking.car?.seats || "N/A"} seats •{" "}
                                        {booking.car?.license_plate || "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Rental Details */}
                            <div className="space-y-3 text-zinc-300">
                                <div className="flex justify-between py-2 border-b border-zinc-700">
                                    <span>Periode Sewa:</span>
                                    <span className="font-medium">
                                        {booking.total_days} hari
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-zinc-700">
                                    <span>Tanggal Ambil:</span>
                                    <span className="font-medium">
                                        {new Date(
                                            booking.start_date
                                        ).toLocaleDateString("id-ID", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-zinc-700">
                                    <span>Tanggal Kembali:</span>
                                    <span className="font-medium">
                                        {new Date(
                                            booking.end_date
                                        ).toLocaleDateString("id-ID", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4 space-y-2">
                                <h4 className="text-white font-semibold mb-3">
                                    Rincian Biaya
                                </h4>
                                <div className="flex justify-between text-zinc-300">
                                    <span>Tarif Harian:</span>
                                    <span>
                                        {formatRupiah(
                                            Number(booking.daily_rate)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-zinc-300">
                                    <span>
                                        Subtotal ({booking.total_days} hari):
                                    </span>
                                    <span>
                                        {formatRupiah(Number(booking.subtotal))}
                                    </span>
                                </div>
                                <div className="flex justify-between text-zinc-300">
                                    <span>PPN (12%):</span>
                                    <span>
                                        {formatRupiah(
                                            Number(booking.tax_amount)
                                        )}
                                    </span>
                                </div>
                                <hr className="border-zinc-600" />
                                <div className="flex justify-between text-xl font-bold text-amber-400">
                                    <span>Total Bayar:</span>
                                    <span>
                                        {formatRupiah(
                                            Number(booking.total_amount)
                                        )}
                                    </span>
                                </div>
                            </div>

                            {booking.notes && (
                                <div className="bg-zinc-700/30 rounded-lg p-4">
                                    <h4 className="text-white font-medium mb-2">
                                        Catatan Khusus:
                                    </h4>
                                    <p className="text-zinc-300 text-sm">
                                        {booking.notes}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Section */}
                    <Card className="bg-zinc-800/60 backdrop-blur-sm border-zinc-700">
                        <CardHeader>
                            <CardTitle className="text-white text-xl flex items-center">
                                <CreditCard className="h-5 w-5 mr-2" />
                                Metode Pembayaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Payment Info */}
                            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Shield className="h-5 w-5 text-blue-400" />
                                    <span className="text-white font-medium">
                                        Pembayaran Aman dengan Stripe
                                    </span>
                                </div>
                                <ul className="text-zinc-300 text-sm space-y-1">
                                    <li>
                                        • Semua kartu kredit dan debit diterima
                                    </li>
                                    <li>
                                        • Keamanan tingkat bank dan enkripsi
                                    </li>
                                    <li>
                                        • Informasi pembayaran tidak disimpan di
                                        server kami
                                    </li>
                                    <li>
                                        • Konfirmasi instan setelah pembayaran
                                        berhasil
                                    </li>
                                </ul>
                            </div>

                            {/* Accepted Cards */}
                            <div className="bg-zinc-700/30 rounded-lg p-4">
                                <h4 className="text-white font-medium mb-3">
                                    Kartu yang Diterima:
                                </h4>
                                <div className="flex space-x-2">
                                    <div className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">
                                        VISA
                                    </div>
                                    <div className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">
                                        MASTER
                                    </div>
                                    <div className="bg-blue-800 text-white px-3 py-1 rounded text-xs font-bold">
                                        AMEX
                                    </div>
                                    <div className="bg-orange-600 text-white px-3 py-1 rounded text-xs font-bold">
                                        DISCOVER
                                    </div>
                                </div>
                            </div>

                            {/* Session Expiry Warning */}
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                                <div className="flex items-center space-x-2 text-yellow-400">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                        Sesi pembayaran berakhir dalam 30 menit
                                    </span>
                                </div>
                                {/* <p className="text-yellow-300 text-xs mt-1">
                                    Booking akan dibatalkan otomatis jika tidak
                                    dibayar dalam waktu tersebut
                                </p> */}
                            </div>

                            {/* Payment Button */}
                            <Button
                                onClick={handlePayment}
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold h-14 text-lg"
                            >
                                {processing ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        <span>Memproses...</span>
                                    </div>
                                ) : (
                                    <>
                                        <CreditCard className="h-5 w-5 mr-2" />
                                        Bayar{" "}
                                        {formatRupiah(
                                            Number(booking.total_amount)
                                        )}
                                    </>
                                )}
                            </Button>

                            {/* Security Notice */}
                            <div className="text-xs text-zinc-400 text-center space-y-1">
                                <p>
                                    Dengan melanjutkan pembayaran, Anda
                                    menyetujui{" "}
                                    <Link
                                        href="/terms"
                                        className="text-amber-400 hover:underline"
                                    >
                                        Syarat & Ketentuan
                                    </Link>{" "}
                                    dan{" "}
                                    <Link
                                        href="/privacy"
                                        className="text-amber-400 hover:underline"
                                    >
                                        Kebijakan Privasi
                                    </Link>
                                </p>
                                <p className="flex items-center justify-center space-x-1">
                                    <Shield className="h-3 w-3" />
                                    <span>
                                        Pembayaran diproses secara aman oleh
                                        Stripe
                                    </span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
