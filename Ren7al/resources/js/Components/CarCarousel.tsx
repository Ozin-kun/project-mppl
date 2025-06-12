"use client";

import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
    ChevronLeft,
    ChevronRight,
    Users,
    Star,
    Briefcase,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import { useCarousel } from "@/Hooks/UseCarousel";
import { CarouselDots } from "@/Components/CarouselDots";

interface Car {
    id: string;
    name: string;
    image: string;
    price: number;
    seats: number;
    rating: number;
    transmission: string;
    bags: number;
}

const cars: Car[] = [
    {
        id: "aston-martin-dbx",
        name: "Aston Martin DBX",
        image: "/placeholder.svg?height=600&width=800",
        price: 500,
        seats: 4,
        rating: 5,
        transmission: "Auto",
        bags: 2,
    },
    {
        id: "bentley-bentayga",
        name: "Bentley Bentayga",
        image: "/placeholder.svg?height=600&width=800",
        price: 600,
        seats: 5,
        rating: 5,
        transmission: "Auto",
        bags: 3,
    },
    {
        id: "lamborghini-urus",
        name: "Lamborghini Urus",
        image: "/placeholder.svg?height=600&width=800",
        price: 700,
        seats: 4,
        rating: 5,
        transmission: "Auto",
        bags: 2,
    },
];

export default function CarCarousel() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isHovering, setIsHovering] = useState(false);

    // First, get the isMobile state separately
    const [isMobile, setIsMobile] = useState(false);

    // Set up the mobile detection
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    // Then use the carousel hook
    const {
        activeIndex,
        containerRef,
        nextSlide,
        prevSlide,
        goToSlide,
        touchHandlers,
        isDragging,
        isAnimating,
    } = useCarousel({
        itemCount: cars.length,
    });

    return (
        <section className="bg-zinc-900 py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-center mb-12 text-4xl md:text-5xl font-bold">
                    <span className="text-white">Luxury</span>{" "}
                    <span className="text-amber-500">Car Fleet</span>
                </h2>

                <div
                    className="relative overflow-hidden"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <div
                        ref={containerRef}
                        className={cn(
                            "flex transition-transform duration-300 ease-out",
                            isMobile && "cursor-grab",
                            isDragging && "cursor-grabbing"
                        )}
                        style={{ touchAction: "pan-y" }}
                        {...touchHandlers}
                    >
                        {cars.map((car, index) => (
                            <div key={car.id} className="w-full flex-shrink-0">
                                <div className="relative rounded-xl overflow-hidden mx-auto max-w-4xl group">
                                    <div
                                        className="relative aspect-[16/9] overflow-hidden"
                                        onMouseEnter={() =>
                                            setHoveredIndex(index)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredIndex(null)
                                        }
                                    >
                                        <img
                                            src={
                                                car.image || "/placeholder.svg"
                                            }
                                            alt={car.name}
                                            // fill
                                            className={cn(
                                                "absolute w-full h-full object-cover transition-transform duration-500",
                                                hoveredIndex === index &&
                                                    "scale-110"
                                            )}
                                        />

                                        {/* Navigation Arrows */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                prevSlide();
                                            }}
                                            className={cn(
                                                "absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 text-zinc-900 transition-opacity duration-300 z-10",
                                                isHovering
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                            aria-label="Previous car"
                                            disabled={isAnimating}
                                        >
                                            <ChevronLeft className="h-6 w-6" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                nextSlide();
                                            }}
                                            className={cn(
                                                "absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 text-zinc-900 transition-opacity duration-300 z-10",
                                                isHovering
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                            aria-label="Next car"
                                            disabled={isAnimating}
                                        >
                                            <ChevronRight className="h-6 w-6" />
                                        </button>
                                    </div>

                                    {/* Car Details */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 bg-opacity-90 p-4 md:p-6 text-white">
                                        <div className="flex justify-between items-start mb-2 md:mb-4">
                                            <h3 className="text-xl md:text-2xl font-bold">
                                                {car.name}
                                            </h3>
                                            <div className="text-right">
                                                <span className="text-amber-500 text-xl md:text-3xl font-bold">
                                                    ${car.price}
                                                </span>
                                                <span className="text-xs md:text-sm text-zinc-400 block">
                                                    /day
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                                            <div className="flex items-center">
                                                <Users className="h-3 w-3 md:h-4 md:w-4 text-amber-500 mr-1" />
                                                <span>{car.seats}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Star className="h-3 w-3 md:h-4 md:w-4 text-amber-500 mr-1 fill-amber-500" />
                                                <span>{car.rating}</span>
                                            </div>
                                            <div>
                                                <span className="text-zinc-400">
                                                    {car.transmission}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <Briefcase className="h-3 w-3 md:h-4 md:w-4 text-amber-500 mr-1" />
                                                <span>{car.bags} Bags</span>
                                            </div>

                                            <div className="ml-auto">
                                                <Link href={`/cars/${car.id}`}>
                                                    <Button className="bg-amber-500 hover:bg-amber-600 text-zinc-900 text-xs md:text-sm py-1 px-3 md:py-2 md:px-4">
                                                        Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dots Indicator */}
                    <CarouselDots
                        count={cars.length}
                        activeIndex={
                            activeIndex >= 0 && activeIndex < cars.length
                                ? activeIndex
                                : 0
                        }
                        onClick={goToSlide}
                    />
                </div>
            </div>
        </section>
    );
}
