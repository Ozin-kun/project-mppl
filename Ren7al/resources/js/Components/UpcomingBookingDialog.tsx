// Components/UpcomingBookingsDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Calendar, Clock } from "lucide-react";

interface UpcomingBooking {
    id: number;
    start_date_formatted: string;
    end_date_formatted: string;
    start_date_short: string;
    end_date_short: string;
}

interface UpcomingBookingsDialogProps {
    upcomingBookings: number;
    upcomingBookingDetails: UpcomingBooking[];
    variant?: "default" | "compact";
}

export default function UpcomingBookingsDialog({
    upcomingBookings,
    upcomingBookingDetails,
    variant = "default",
}: UpcomingBookingsDialogProps) {
    // Don't render if no upcoming bookings
    if (upcomingBookings === 0) {
        return null;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="w-full p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-colors">
                    <div className="flex items-center text-amber-400">
                        <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">
                            This car has {upcomingBookings} upcoming booking
                            {upcomingBookings > 1 ? "s" : ""}
                            <span className="ml-2 text-xs text-amber-300">
                                (Click to view dates)
                            </span>
                        </span>
                    </div>
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md bg-zinc-800 border-zinc-700">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-amber-400" />
                        Upcoming Bookings
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {upcomingBookingDetails.map((booking, index) => (
                        <div
                            key={booking.id}
                            className="flex items-center justify-between p-3 bg-zinc-700/30 rounded-lg border border-zinc-600"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-amber-400 text-xs font-semibold">
                                        {index + 1}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-white font-medium text-sm">
                                        {booking.start_date_formatted} -{" "}
                                        {booking.end_date_formatted}
                                    </div>
                                    {variant === "default" && (
                                        <div className="text-zinc-400 text-xs">
                                            Booking #{booking.id}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {upcomingBookingDetails.length === 0 && (
                    <div className="text-center py-6">
                        <Calendar className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
                        <p className="text-zinc-400 text-sm">
                            No upcoming bookings
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
