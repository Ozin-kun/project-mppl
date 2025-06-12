"use client";

import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import {
    ArrowLeft,
    Star,
    MapPin,
    Calendar,
    Users,
    Fuel,
    Settings,
    Share2,
    Heart,
    ShieldCheck,
    Clock,
    User,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import Navbar from "@/Components/NavBar";
import ScrollToTop from "@/Components/ScrollToTop";
import { Car } from "@/types/car";
import { formatCurrency } from "@/lib/utils";
import UpcomingBookingsDialog from "@/Components/UpcomingBookingDialog";

interface CarShowProps {
    car: { data: Car };
    isAvailable: boolean;
    upcomingBookings: number;
    upcomingBookingDetails: Array<{
        id: number;
        start_date_formatted: string;
        end_date_formatted: string;
        start_date_short: string;
        end_date_short: string;
    }>;
}

export default function CarShowPage({
    car,
    isAvailable,
    upcomingBookings,
    upcomingBookingDetails,
}: CarShowProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [selectedImage, setSelectedImage] = useState(car.data.image);
    console.log("Car data:", car);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleBookNow = () => {
        if (isAvailable) {
            router.visit(route("bookings.create", car.data.id));
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${car.data.brand} ${car.data.model}`,
                    text: `Check out this ${car.data.brand} ${car.data.model} for rent!`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Error sharing:", err);
            }
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800">
            <Navbar />

            <div className="container mx-auto px-4 pb-12">
                {/* Back Button */}
                <div className="mb-5">
                    <Link href={route("cars.index")}>
                        <Button
                            variant="outline"
                            className="bg-transparent border-zinc-600 text-white hover:bg-zinc-700"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Cars
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Single Card - Car Images, Booking & Details */}
                    <Card className="bg-zinc-800/60 backdrop-blur-sm border-zinc-700 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                            {/* Left Column - Car Image */}
                            <div className="lg:col-span-2">
                                <div className="relative mb-4">
                                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-zinc-700">
                                        <img
                                            src={
                                                selectedImage ||
                                                "/placeholder-car.svg"
                                            }
                                            alt={`${car.data.brand} ${car.data.model}`}
                                            className="w-full h-full object-cover object-center"
                                            onError={(e) => {
                                                const target =
                                                    e.target as HTMLImageElement;
                                                target.src =
                                                    "/placeholder-car.svg";
                                            }}
                                        />
                                    </div>
                                    <div className="absolute top-4 right-4 flex space-x-2">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="bg-black/50 backdrop-blur-sm border-0 hover:bg-black/70"
                                            onClick={() => setIsLiked(!isLiked)}
                                        >
                                            <Heart
                                                className={`h-4 w-4 ${
                                                    isLiked
                                                        ? "fill-red-500 text-red-500"
                                                        : "text-white"
                                                }`}
                                            />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="bg-black/50 backdrop-blur-sm border-0 hover:bg-black/70"
                                            onClick={handleShare}
                                        >
                                            <Share2 className="h-4 w-4 text-white" />
                                        </Button>
                                    </div>
                                    {/* <div className="absolute bottom-4 left-4">
                                        <Badge
                                            className={`${
                                                isAvailable
                                                    ? "bg-green-500/90"
                                                    : "bg-red-500/90"
                                            } text-white backdrop-blur-sm`}
                                        >
                                            {isAvailable
                                                ? "Available"
                                                : "Not Available"}
                                        </Badge>
                                    </div> */}
                                </div>

                                {/* Image Thumbnails */}
                                {/* {carImages.length > 1 && (
                                    <div className="flex space-x-2 overflow-x-auto">
                                        {carImages.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setSelectedImage(image)
                                                }
                                                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                                    selectedImage === image
                                                        ? "border-amber-500"
                                                        : "border-zinc-600 hover:border-zinc-500"
                                                }`}
                                            >
                                                <img
                                                    src={
                                                        image ||
                                                        "/placeholder-car.data.svg"
                                                    }
                                                    alt={`${car.data.brand} ${
                                                        car.data.model
                                                    } view ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )} */}
                            </div>

                            {/* Right Column - Booking Information */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Car Title & Price */}
                                <div className="text-center lg:text-left">
                                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 min-h-[4rem] lg:min-h-[4.5rem] leading-8 lg:leading-9 flex items-start justify-center lg:justify-start">
                                        {car.data.brand} {car.data.model}
                                    </h1>
                                    <div className="flex flex-wrap items-center justify-center lg:justify-start space-x-4 text-zinc-400 text-sm mb-4">
                                        <span>{car.data.year}</span>
                                        <span>•</span>
                                        <span>{car.data.license_plate}</span>
                                        {/* <span>•</span> */}
                                        {/* <div className="flex items-center">
                                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                                            <span>4.0 (15 reviews)</span>
                                        </div> */}
                                    </div>
                                    <div className="text-center lg:text-left mb-6">
                                        <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text">
                                            {formatCurrency(
                                                Number(
                                                    car.data
                                                        .rental_price_per_day
                                                )
                                            )}
                                        </div>
                                        <div className="text-zinc-400 text-sm">
                                            per day
                                        </div>
                                    </div>
                                </div>
                                {/* Booking Information */}
                                <div className=" space-y-4">
                                    <h3 className="text-lg font-semibold text-white">
                                        Book This Car
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-zinc-400">
                                                Daily Rate
                                            </span>
                                            <span className="font-semibold text-white">
                                                {formatCurrency(
                                                    Number(
                                                        car.data
                                                            .rental_price_per_day
                                                    )
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-zinc-400">
                                                Status
                                            </span>
                                            <Badge
                                                className={
                                                    isAvailable
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                }
                                            >
                                                {isAvailable
                                                    ? "Available"
                                                    : "Not Available"}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {isAvailable ? (
                                            <Button
                                                onClick={handleBookNow}
                                                className="w-full bg-amber-600 hover:bg-amber-700 text-white border-0"
                                                size="lg"
                                            >
                                                Book Now
                                            </Button>
                                        ) : (
                                            <Button
                                                disabled
                                                className="w-full"
                                                size="lg"
                                            >
                                                Not Available
                                            </Button>
                                        )}

                                        <Button
                                            variant="outline"
                                            className="w-full bg-transparent border-zinc-600 text-white hover:bg-zinc-700"
                                            size="lg"
                                        >
                                            Contact Owner
                                        </Button>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-xs text-zinc-500">
                                            By booking, you agree to our{" "}
                                            <Link
                                                href="#"
                                                className="text-amber-400 hover:underline"
                                            >
                                                Terms & Conditions
                                            </Link>
                                        </p>
                                    </div>
                                </div>

                                <UpcomingBookingsDialog
                                    upcomingBookings={upcomingBookings}
                                    upcomingBookingDetails={
                                        upcomingBookingDetails
                                    }
                                    variant="default"
                                />
                            </div>
                        </div>

                        {/* Bottom Section - Car Features & Description */}
                        <div className="border-t border-zinc-700 p-6 space-y-6">
                            {/* Car Features */}
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-4">
                                    Features & Specifications
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="flex items-center space-x-2 text-zinc-300">
                                        <Users className="h-5 w-5 text-amber-400" />
                                        <span>{car.data.seats || 5} Seats</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-zinc-300">
                                        <Settings className="h-5 w-5 text-amber-400" />
                                        <span>Automatic</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-zinc-300">
                                        <Fuel className="h-5 w-5 text-amber-400" />
                                        <span>Gasoline</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-zinc-300">
                                        <ShieldCheck className="h-5 w-5 text-amber-400" />
                                        <span>Insured</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-3">
                                    Description
                                </h3>
                                <p className="text-zinc-300 leading-relaxed">
                                    {car.data.description ||
                                        `Experience luxury and performance with this premium ${car.data.brand} ${car.data.model}. Perfect for business trips, special occasions, or when you simply want to travel in style and comfort. This vehicle offers excellent fuel efficiency, modern safety features, and a comfortable interior that will make your journey memorable.`}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <ScrollToTop />
        </div>
    );
}
