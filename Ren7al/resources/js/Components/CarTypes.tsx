"use client";

import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCarousel } from "@/Hooks/UseCarousel";
import { CarouselDots } from "@/Components/CarouselDots";

interface CarType {
    id: string;
    name: string;
    image: string;
    url: string;
}

const carTypes: CarType[] = [
    {
        id: "small-cars",
        name: "Small Cars",
        image: "/placeholder.svg?height=600&width=800",
        url: "/cars/small",
    },
    {
        id: "sport-cars",
        name: "Sport Cars",
        image: "/placeholder.svg?height=600&width=800",
        url: "/cars/sport",
    },
    {
        id: "convertible",
        name: "Convertible",
        image: "/placeholder.svg?height=600&width=800",
        url: "/cars/convertible",
    },
    // Adding more items for better carousel demonstration
    {
        id: "suv",
        name: "SUV",
        image: "/placeholder.svg?height=600&width=800",
        url: "/cars/suv",
    },
    {
        id: "luxury",
        name: "Luxury",
        image: "/placeholder.svg?height=600&width=800",
        url: "/cars/luxury",
    },
];

export default function CarTypes() {
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

    // Then use the carousel hook with the isMobile state
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
        itemCount: carTypes.length,
        visibleItems: isMobile ? 1 : 3,
    });

    return (
        <section className="bg-zinc-900 py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-8">
                    <span className="text-amber-500 uppercase text-sm tracking-wider">
                        CATEGORIES
                    </span>
                    <h2 className="text-center mt-2 mb-12 text-4xl md:text-5xl font-bold">
                        <span className="text-white">Rental</span>{" "}
                        <span className="text-amber-500">Car Types</span>
                    </h2>
                </div>

                <div
                    className="relative overflow-hidden"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {/* Navigation arrows - visible on hover for desktop */}
                    {!isMobile && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevSlide();
                                }}
                                className={cn(
                                    "absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 text-zinc-900 transition-opacity duration-300",
                                    isHovering ? "opacity-100" : "opacity-0"
                                )}
                                aria-label="Previous car type"
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
                                    "absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 text-zinc-900 transition-opacity duration-300",
                                    isHovering ? "opacity-100" : "opacity-0"
                                )}
                                aria-label="Next car type"
                                disabled={isAnimating}
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}

                    <div
                        ref={containerRef}
                        className={cn(
                            "flex transition-transform duration-300 ease-out",
                            isMobile ? "flex-nowrap" : "flex-nowrap",
                            (isMobile || !isMobile) && "cursor-grab",
                            isDragging && "cursor-grabbing"
                        )}
                        style={{ touchAction: "pan-y" }}
                        {...touchHandlers}
                    >
                        {carTypes.map((type, index) => (
                            <div
                                key={type.id}
                                className={cn(
                                    "relative rounded-xl overflow-hidden group",
                                    isMobile
                                        ? "w-full flex-shrink-0 px-2"
                                        : "w-1/3 flex-shrink-0 px-2"
                                )}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={type.image || "/placeholder.svg"}
                                        alt={type.name}
                                        className={cn(
                                            "absolute w-full h-full object-cover transition-transform duration-500",
                                            hoveredIndex === index &&
                                                "scale-110"
                                        )}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    <h3 className="absolute bottom-8 left-8 text-2xl font-bold text-white">
                                        {type.name}
                                    </h3>
                                    <Link href={type.url}>
                                        <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-zinc-900 transition-transform duration-300 hover:scale-110">
                                            <ArrowUpRight className="h-5 w-5" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dots indicator - only show on mobile */}
                    {isMobile && (
                        <CarouselDots
                            count={carTypes.length}
                            activeIndex={
                                activeIndex >= 0 &&
                                activeIndex < carTypes.length
                                    ? activeIndex
                                    : 0
                            }
                            onClick={goToSlide}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
