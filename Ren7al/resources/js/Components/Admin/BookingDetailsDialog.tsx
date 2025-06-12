import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Booking } from "@/types/booking";

interface BookingDetailsDialogProps {
    booking: Booking;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdateStatus: (booking: Booking, status: string) => void;
    isUpdating: boolean;
}

export function BookingDetailsDialog({
    booking,
    open,
    onOpenChange,
    onUpdateStatus,
    isUpdating,
}: BookingDetailsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl bg-zinc-800 text-white border-zinc-700">
                <DialogHeader>
                    <DialogTitle>Detail Booking #{booking.id}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Dibuat pada {formatDate(booking.created_at)}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div>
                        <h3 className="font-semibold mb-3">
                            Informasi Pelanggan
                        </h3>
                        <div className="space-y-2">
                            <p>
                                <span className="text-zinc-400">Nama:</span>{" "}
                                {booking.user?.name}
                            </p>
                            <p>
                                <span className="text-zinc-400">Email:</span>{" "}
                                {booking.user?.email}
                            </p>
                        </div>
                    </div>

                    {/* Car Info */}
                    <div>
                        <h3 className="font-semibold mb-3">Informasi Mobil</h3>
                        <div className="space-y-2">
                            <p>
                                <span className="text-zinc-400">Mobil:</span>{" "}
                                {booking.car?.brand} {booking.car?.model}
                            </p>
                            <p>
                                <span className="text-zinc-400">
                                    Plat Nomor:
                                </span>{" "}
                                {booking.car?.license_plate}
                            </p>
                        </div>
                    </div>

                    {/* Booking Info */}
                    <div>
                        <h3 className="font-semibold mb-3">Detail Booking</h3>
                        <div className="space-y-2">
                            <p>
                                <span className="text-zinc-400">
                                    Tanggal Mulai:
                                </span>{" "}
                                {formatDate(booking.start_date)}
                            </p>
                            <p>
                                <span className="text-zinc-400">
                                    Tanggal Selesai:
                                </span>{" "}
                                {formatDate(booking.end_date)}
                            </p>
                            <p>
                                <span className="text-zinc-400">Durasi:</span>{" "}
                                {booking.total_days} hari
                            </p>
                            <p>
                                <span className="text-zinc-400">
                                    Total Harga:
                                </span>{" "}
                                {formatCurrency(Number(booking.total_amount))}
                            </p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                        <h3 className="font-semibold mb-3">
                            Informasi Pembayaran
                        </h3>
                        <div className="space-y-2">
                            <p>
                                <span className="text-zinc-400">Jumlah:</span>{" "}
                                {formatCurrency(booking.payment?.amount || 0)}
                            </p>
                            <p>
                                <span className="text-zinc-400">Metode:</span>{" "}
                                {booking.payment?.payment_method ||
                                    "Belum dipilih"}
                            </p>
                            <p>
                                <span className="text-zinc-400">Status:</span>{" "}
                                {booking.payment?.payment_status || "Pending"}
                            </p>
                            {booking.payment?.paid_at && (
                                <p>
                                    <span className="text-zinc-400">
                                        Dibayar pada:
                                    </span>{" "}
                                    {formatDate(booking.payment.paid_at)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
                    <div className="flex flex-1 space-x-2">
                        {booking.status === "pending" && (
                            <>
                                <Button
                                    className="flex-1"
                                    variant="default"
                                    onClick={() =>
                                        onUpdateStatus(booking, "confirmed")
                                    }
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "Updating..." : "Konfirmasi"}
                                </Button>
                                <Button
                                    className="flex-1"
                                    variant="destructive"
                                    onClick={() =>
                                        onUpdateStatus(booking, "cancelled")
                                    }
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "Updating..." : "Batalkan"}
                                </Button>
                            </>
                        )}

                        {booking.status === "confirmed" && (
                            <Button
                                className="flex-1"
                                variant="destructive"
                                onClick={() =>
                                    onUpdateStatus(booking, "cancelled")
                                }
                                disabled={isUpdating}
                            >
                                {isUpdating
                                    ? "Updating..."
                                    : "Batalkan Booking"}
                            </Button>
                        )}
                    </div>

                    <Button
                        variant="outline"
                        className="bg-zinc-700 text-white hover:bg-zinc-600"
                        onClick={() => onOpenChange(false)}
                        disabled={isUpdating}
                    >
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
