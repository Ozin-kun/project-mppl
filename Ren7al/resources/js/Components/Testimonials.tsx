"use client";

import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCarousel } from "@/Hooks/UseCarousel";
import { CarouselDots } from "@/Components/CarouselDots";
import { useState, useEffect } from "react";

interface Testimonial {
    id: string;
    content: string;
    author: {
        name: string;
        role: string;
        avatar: string;
    };
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        id: "1",
        content:
            "Came in for walk-in inspection and oil change. Brown is delight to deal with. He took my car right in, and completed work in a short time. Highly recommend the shop.",
        author: {
            name: "Dan Martin",
            role: "Customer",
            avatar: "/placeholder.svg?height=80&width=80",
        },
        rating: 5,
    },
    {
        id: "2",
        content:
            "Came in for walk-in inspection and oil change. Brown is delight to deal with. He took my car right in, and completed work in a short time. Highly recommend the shop.",
        author: {
            name: "Emily Martin",
            role: "Customer",
            avatar: "/placeholder.svg?height=80&width=80",
        },
        rating: 5,
    },
    {
        id: "3",
        content:
            "Came in for walk-in inspection and oil change. Brown is delight to deal with. He took my car right in, and completed work in a short time. Highly recommend the shop.",
        author: {
            name: "Olivia Brown",
            role: "Customer",
            avatar: "/placeholder.svg?height=80&width=80",
        },
        rating: 5,
    },
    // Adding a couple more for better carousel demonstration
    {
        id: "4",
        content:
            "Fantastic service and very professional staff. Would definitely recommend to anyone looking for reliable car maintenance.",
        author: {
            name: "James Wilson",
            role: "Customer",
            avatar: "/placeholder.svg?height=80&width=80",
        },
        rating: 5,
    },
    {
        id: "5",
        content:
            "Best luxury car rental in the city. Their fleet is impeccable and the customer service is outstanding.",
        author: {
            name: "Sophia Garcia",
            role: "Customer",
            avatar: "/placeholder.svg?height=80&width=80",
        },
        rating: 5,
    },
];

export default function Testimonials() {
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
        itemCount: testimonials.length,
        visibleItems: isMobile ? 1 : 3,
    });

    return (
        <section className="bg-zinc-900 py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <span className="text-amber-500 uppercase text-sm tracking-wider">
                        TESTIMONIALS
                    </span>
                    <h2 className="text-center mt-2 text-4xl md:text-5xl font-bold text-white">
                        What Clients Say
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
                                aria-label="Previous testimonial"
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
                                aria-label="Next testimonial"
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
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className={cn(
                                    "bg-zinc-800 rounded-lg p-6 md:p-8 relative",
                                    isMobile
                                        ? "w-full flex-shrink-0 px-2"
                                        : "w-1/3 flex-shrink-0 px-2"
                                )}
                            >
                                {/* Stars */}
                                <div className="flex mb-4 justify-end">
                                    {Array.from({
                                        length: testimonial.rating,
                                    }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-4 w-4 md:h-5 md:w-5 text-amber-500 fill-amber-500"
                                        />
                                    ))}
                                </div>

                                {/* Quote mark */}
                                <div className="text-amber-500 text-5xl md:text-6xl font-serif leading-none mb-3 md:mb-4">
                                    "
                                </div>

                                {/* Content */}
                                <p className="text-zinc-300 text-sm md:text-base mb-6 md:mb-8">
                                    {testimonial.content}
                                </p>

                                {/* Author */}
                                <div className="flex items-center mt-4 md:mt-6">
                                    <img
                                        src={
                                            testimonial.author.avatar ||
                                            "/placeholder.svg"
                                        }
                                        alt={testimonial.author.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                    />
                                    <div className="ml-3 md:ml-4">
                                        <h4 className="text-white text-sm md:text-base font-medium">
                                            {testimonial.author.name}
                                        </h4>
                                        <p className="text-zinc-400 text-xs md:text-sm">
                                            {testimonial.author.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dots indicator - only show on mobile */}
                    {isMobile && (
                        <CarouselDots
                            count={testimonials.length}
                            activeIndex={
                                activeIndex >= 0 &&
                                activeIndex < testimonials.length
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
