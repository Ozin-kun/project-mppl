"use client";

import { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import { Search, Star, MapPin, Calendar, X, User } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import Navbar from "@/Components/NavBar";
import ScrollToTop from "@/Components/ScrollToTop";
import Pagination from "@/Components/Admin/Pagination";
import { Car } from "@/types/car";

interface IndexProps {
    cars: {
        data: Car[];
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
        search?: string;
    };
}

export default function Index({ cars, filters }: IndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [isRestoring, setIsRestoring] = useState(false);
    console.log(cars);
    // Debounced search - auto search setelah user berhenti mengetik
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== (filters.search || "")) {
                router.get(
                    route("cars.index"),
                    {
                        search: searchTerm || undefined,
                        page: 1,
                    },
                    {
                        preserveState: true,
                        preserveScroll: false,
                        replace: true,
                    }
                );
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Restore scroll position
    useEffect(() => {
        const savedScrollPosition = sessionStorage.getItem(
            "carsListScrollPosition"
        );
        if (savedScrollPosition) {
            setIsRestoring(true);
            const scrollPosition = parseInt(savedScrollPosition);

            // Instant scroll, no animation
            window.scrollTo(0, scrollPosition);
            sessionStorage.removeItem("carsListScrollPosition");

            // Hide loading state setelah scroll
            setTimeout(() => {
                setIsRestoring(false);
            }, 100);
        }
    }, []);

    const handlePageChange = (page: number) => {
        router.get(
            route("cars.index"),
            {
                search: searchTerm || undefined,
                page: page,
            },
            {
                preserveState: true,
                preserveScroll: false,
            }
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-800">
            <Navbar />

            {/* Loading overlay saat restoring */}
            {isRestoring && (
                <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="text-white">Loading...</div>
                </div>
            )}

            {/* Hero Section */}
            <div className="relative text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative container mx-auto px-4 py-12">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                            Find Your Perfect Ride
                        </h1>

                        {/* Simple Search Bar */}
                        <div className="max-w-2xl mx-auto mb-8">
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                    <Search className="h-6 w-6 text-zinc-400" />
                                </div>
                                <Input
                                    placeholder="Search by brand, model, or license plate..."
                                    className="pl-14 pr-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-zinc-300 focus:border-amber-400 focus:ring-amber-400/50 rounded-xl text-lg"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />

                                {/* Clear search button */}
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-6 justify-center text-sm">
                            <div className="flex items-center gap-2 text-white/80">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span>Premium Quality</span>
                            </div>

                            <div className="flex items-center gap-2 text-white/80">
                                <Calendar className="h-4 w-4 text-amber-400" />
                                <span>Flexible Booking</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="container mx-auto px-4 py-8">
                {/* Search Results Header */}
                <div className="mb-6">
                    {searchTerm ? (
                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Search Results for "{searchTerm}"
                            </h2>
                            <p className="text-zinc-400">
                                Found {cars.total}{" "}
                                {cars.total === 1 ? "car" : "cars"} matching
                                your search
                            </p>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">
                                All Available Cars
                                <span className="text-amber-400 ml-2">
                                    ({cars.total})
                                </span>
                            </h2>
                            <div className="text-sm text-zinc-400">
                                Showing {cars.from || 0} to {cars.to || 0} of{" "}
                                {cars.total} cars
                            </div>
                        </div>
                    )}
                </div>

                {/* Cars Grid */}
                {cars.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {cars.data.map((car) => (
                            <EnhancedCarCard key={car.id} car={car} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="bg-zinc-800/60 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto border border-zinc-700">
                            <div className="text-zinc-400 text-xl mb-4">
                                {searchTerm
                                    ? "🔍 No cars found"
                                    : "🚗 No cars available"}
                            </div>
                            <p className="text-zinc-500 mb-6">
                                {searchTerm
                                    ? `No cars match "${searchTerm}". Try different keywords.`
                                    : "There are no cars available at the moment."}
                            </p>
                            {searchTerm && (
                                <Button
                                    onClick={() => setSearchTerm("")}
                                    variant="outline"
                                    className="bg-transparent border-zinc-600 text-white hover:bg-zinc-700"
                                >
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {cars.total > 0 && (
                    <div className="mt-8">
                        <Pagination
                            meta={{
                                current_page: cars.current_page,
                                from: cars.from,
                                last_page: cars.last_page,
                                links: cars.links,
                                path: cars.path,
                                per_page: cars.per_page,
                                to: cars.to,
                                total: cars.total,
                            }}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            <ScrollToTop />
        </div>
    );
}

// Enhanced Car Card Component
function EnhancedCarCard({ car }: { car: Car }) {
    const formatRupiah = (amount: number): string => {
        return "Rp " + amount.toLocaleString("id-ID");
    };

    const getImageSrc = (car: Car): string => {
        if (car.image) {
            // Check if it's a URL (internet image)
            if (
                car.image.startsWith("http://") ||
                car.image.startsWith("https://")
            ) {
                return car.image;
            }
            // It's a local storage path
            return `/storage/${car.image}`;
        }

        // No image at all
        return "/images/default-car.jpg";
    };
    const handleViewDetails = () => {
        const currentScrollPosition = window.scrollY;
        sessionStorage.setItem(
            "carsListScrollPosition",
            currentScrollPosition.toString()
        );
        router.visit(route("cars.show", car.id));
    };

    return (
        <Card className="bg-zinc-800/60 backdrop-blur-sm border-zinc-700 hover:border-zinc-600 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 group overflow-hidden">
            <div className="relative overflow-hidden">
                <img
                    src={getImageSrc(car) || "/placeholder-car.svg"}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                    <Badge
                        className={`${
                            car.is_available
                                ? "bg-green-500/90 hover:bg-green-600"
                                : "bg-red-500/90 hover:bg-red-600"
                        } text-white backdrop-blur-sm`}
                    >
                        {car.is_available ? "Available" : "Unavailable"}
                    </Badge>
                </div>
                <div className="absolute bottom-3 left-3">
                    <Badge
                        variant="secondary"
                        className="bg-black/70 text-white border-0 backdrop-blur-sm"
                    >
                        {car.year}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-6 text-white">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                        {car.model}
                    </h3>
                    <p className="text-zinc-400 text-sm">{car.brand}</p>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text">
                            {formatRupiah(parseFloat(car.rental_price_per_day))}
                        </div>
                        <div className="text-sm text-zinc-400">per hari</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <User className="h-5 w-5 text-zinc-400" />
                        <span className="text-zinc-400">{car.seats} Kursi</span>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        className="w-full bg-transparent border-zinc-600 text-white hover:bg-zinc-700 hover:border-zinc-500"
                        onClick={handleViewDetails}
                    >
                        View Details
                    </Button>
                    {car.is_available && (
                        <Link
                            href={route("bookings.create", car.id)}
                            className="flex-1"
                        >
                            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white border-0">
                                Book Now
                            </Button>
                        </Link>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
