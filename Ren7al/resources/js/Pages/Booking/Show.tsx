import { useState } from "react";
import { router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    ArrowLeft,
    Calendar,
    Car as CarIcon,
    Clock,
    CheckCircle,
    CreditCard,
    AlertCircle,
    Phone,
    Mail,
    MapPin,
    FileText,
    Download,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import Navbar from "@/Components/NavBar";
import { Booking } from "@/types/booking";

interface BookingShowProps {
    booking: Booking;
}

export default function BookingShow({ booking }: BookingShowProps) {
    const [processing, setProcessing] = useState(false);

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
                className={`${config.bg} ${config.text} border-none flex items-center space-x-1`}
            >
                <Icon className="h-3 w-3" />
                <span>{config.label}</span>
            </Badge>
        );
    };

    const handleContinuePayment = () => {
        setProcessing(true);
        router.visit(route("booking.payment", booking.id));
    };

    const handleDownloadReceipt = () => {
        // TODO: Implement receipt download
        window.open(route("booking.receipt", booking.id), "_blank");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Back Button */}
                <div className="mb-6">
                    <Link href={route("bookings.index")}>
                        <Button
                            variant="outline"
                            className="bg-transparent border-zinc-600 text-white hover:bg-zinc-700"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                </div>

                {/* Status-based Header */}
                {booking.status === "confirmed" && (
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                            <CheckCircle className="h-8 w-8 text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Booking Berhasil!
                        </h1>
                        <p className="text-zinc-400">
                            Pembayaran Anda telah dikonfirmasi. Detail booking
                            dapat dilihat di bawah.
                        </p>
                    </div>
                )}

                {booking.status === "pending" && (
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4">
                            <AlertCircle className="h-8 w-8 text-yellow-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Menunggu Pembayaran
                        </h1>
                        <p className="text-zinc-400 mb-4">
                            Booking Anda belum dikonfirmasi. Silakan lanjutkan
                            pembayaran untuk mengkonfirmasi booking.
                        </p>

                        {/* Continue Payment Button */}
                        <Button
                            onClick={handleContinuePayment}
                            disabled={processing}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3"
                        >
                            {processing ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    <span>Memproses...</span>
                                </div>
                            ) : (
                                <>
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Lanjutkan Pembayaran
                                </>
                            )}
                        </Button>

                        {/* <p className="text-xs text-zinc-500 mt-2">
                            Booking akan dibatalkan otomatis jika tidak dibayar
                            dalam 30 menit
                        </p> */}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Booking Details */}
                    <Card className="bg-zinc-800/60 backdrop-blur-sm border-zinc-700">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-white text-xl">
                                    Detail Booking
                                </CardTitle>
                                {getStatusBadge(booking.status)}
                            </div>
                            <p className="text-zinc-400">
                                Booking ID: #{booking.id}
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Calendar className="h-5 w-5 text-amber-400" />
                                <div>
                                    <p className="text-white font-medium">
                                        Periode Sewa
                                    </p>
                                    <p className="text-zinc-400 text-sm">
                                        {new Date(
                                            booking.start_date
                                        ).toLocaleDateString("id-ID")}{" "}
                                        -{" "}
                                        {new Date(
                                            booking.end_date
                                        ).toLocaleDateString("id-ID")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Clock className="h-5 w-5 text-amber-400" />
                                <div>
                                    <p className="text-white font-medium">
                                        Durasi
                                    </p>
                                    <p className="text-zinc-400 text-sm">
                                        {booking.total_days} hari
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <CreditCard className="h-5 w-5 text-amber-400" />
                                <div>
                                    <p className="text-white font-medium">
                                        Status Pembayaran
                                    </p>
                                    <p className="text-zinc-400 text-sm">
                                        {booking.payment?.payment_status ===
                                        "paid"
                                            ? "Lunas"
                                            : "Belum Dibayar"}
                                        {booking.payment?.paid_at && (
                                            <span className="block text-xs text-zinc-500">
                                                Dibayar:{" "}
                                                {new Date(
                                                    booking.payment.paid_at
                                                ).toLocaleString("id-ID")}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-zinc-700/50 rounded-lg p-4">
                                <div className="flex justify-between text-lg">
                                    <span className="font-semibold text-white">
                                        Total Dibayar:
                                    </span>
                                    <span className="font-bold text-amber-400">
                                        {formatRupiah(
                                            Number(booking.total_amount)
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons for Confirmed Booking */}
                            {booking.status === "confirmed" && (
                                <div className="flex space-x-2 pt-4">
                                    <Button
                                        onClick={handleDownloadReceipt}
                                        variant="outline"
                                        className="flex-1 bg-transparent border-zinc-600 text-white hover:bg-zinc-700"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Receipt
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Car Details */}
                    <Card className="bg-zinc-800/60 backdrop-blur-sm border-zinc-700">
                        <CardHeader>
                            <CardTitle className="text-white text-xl flex items-center">
                                <CarIcon className="h-5 w-5 mr-2" />
                                Detail Mobil
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <img
                                    src={
                                        booking.car?.image ||
                                        "/placeholder-car.svg"
                                    }
                                    alt={`${booking.car?.brand} ${booking.car?.model}`}
                                    className="w-full h-48 object-cover rounded-lg"
                                    onError={(e) => {
                                        const target =
                                            e.target as HTMLImageElement;
                                        target.src = "/placeholder-car.svg";
                                    }}
                                />
                            </div>

                            <div className="space-y-3 text-zinc-300">
                                <h3 className="text-xl font-bold text-white">
                                    {booking.car?.brand} {booking.car?.model}
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-zinc-400">
                                            Tahun:
                                        </span>
                                        <p className="font-medium">
                                            {booking.car?.year}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-zinc-400">
                                            Plat Nomor:
                                        </span>
                                        <p className="font-medium">
                                            {booking.car?.license_plate}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-zinc-400">
                                            Kapasitas:
                                        </span>
                                        <p className="font-medium">
                                            {booking.car?.seats} penumpang
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-zinc-400">
                                            Tarif Harian:
                                        </span>
                                        <p className="font-medium text-amber-400">
                                            {formatRupiah(
                                                Number(booking.daily_rate)
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Notes */}
                {booking.notes && (
                    <Card className="bg-zinc-800/60 backdrop-blur-sm border-zinc-700 mt-8">
                        <CardHeader>
                            <CardTitle className="text-white text-xl flex items-center">
                                <FileText className="h-5 w-5 mr-2" />
                                Catatan Khusus
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-zinc-300">{booking.notes}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Price Breakdown */}
                <Card className="bg-zinc-800/60 backdrop-blur-sm border-zinc-700 mt-8">
                    <CardHeader>
                        <CardTitle className="text-white text-xl">
                            Rincian Biaya
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between text-zinc-300">
                                <span>Tarif Harian:</span>
                                <span>
                                    {formatRupiah(Number(booking.daily_rate))}
                                </span>
                            </div>
                            <div className="flex justify-between text-zinc-300">
                                <span>Durasi ({booking.total_days} hari):</span>
                                <span>
                                    {formatRupiah(Number(booking.subtotal))}
                                </span>
                            </div>
                            <div className="flex justify-between text-zinc-300">
                                <span>PPN (12%):</span>
                                <span>
                                    {formatRupiah(Number(booking.tax_amount))}
                                </span>
                            </div>
                            <hr className="border-zinc-600" />
                            <div className="flex justify-between text-xl font-bold">
                                <span className="text-white">Total:</span>
                                <span className="text-amber-400">
                                    {formatRupiah(Number(booking.total_amount))}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Next Steps */}
                {booking.status === "confirmed" && (
                    <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 mt-8">
                        <CardHeader>
                            <CardTitle className="text-white text-xl">
                                Langkah Selanjutnya
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-zinc-300">
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">
                                            Konfirmasi Email
                                        </p>
                                        <p className="text-sm">
                                            Detail booking akan dikirim ke email
                                            Anda dalam beberapa menit
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">
                                            Siapkan Dokumen
                                        </p>
                                        <p className="text-sm">
                                            Bawa KTP/SIM dan dokumen identitas
                                            lainnya saat pengambilan
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                                        3
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">
                                            Hubungi Kami
                                        </p>
                                        <p className="text-sm">
                                            Tim kami akan menghubungi Anda untuk
                                            konfirmasi dan koordinasi
                                            pengambilan
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
