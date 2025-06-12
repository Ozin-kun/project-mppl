"use client";

import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";

interface Location {
    id: string;
    name: string;
}

interface CarTypeOption {
    id: string;
    name: string;
}

const locations: Location[] = [
    { id: "abu-dhabi", name: "Abu Dhabi" },
    { id: "alain", name: "Alain" },
    { id: "dubai", name: "Dubai" },
    { id: "sharjah", name: "Sharjah" },
];

const carTypes: CarTypeOption[] = [
    { id: "economy", name: "Economy" },
    { id: "compact", name: "Compact" },
    { id: "luxury", name: "Luxury" },
    { id: "suv", name: "SUV" },
    { id: "sport", name: "Sport" },
];

export default function BookingForm() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (dropdown: string) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    return (
        <section className="relative bg-zinc-900 py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative z-10 text-center mb-8">
                    <span className="text-amber-500 uppercase text-sm tracking-wider">
                        RENT YOUR CAR
                    </span>
                    <h2 className="text-center mt-2 mb-4 text-4xl md:text-5xl font-bold text-white">
                        Book Auto
                    </h2>
                </div>

                <div className="relative z-10 bg-zinc-800/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Car Type Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown("carType")}
                                className="w-full flex items-center justify-between bg-zinc-900 text-white p-4 rounded-lg"
                            >
                                <span>Choose Car Type</span>
                                <ChevronDown
                                    className={cn(
                                        "h-5 w-5 transition-transform",
                                        openDropdown === "carType" &&
                                            "transform rotate-180"
                                    )}
                                />
                            </button>
                            {openDropdown === "carType" && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 rounded-lg shadow-lg z-20">
                                    {carTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            className="w-full text-left p-3 text-white hover:bg-zinc-800"
                                            onClick={() =>
                                                setOpenDropdown(null)
                                            }
                                        >
                                            {type.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pick Up Location */}
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown("pickupLocation")}
                                className="w-full flex items-center justify-between bg-zinc-900 text-white p-4 rounded-lg"
                            >
                                <span>Pick Up Location</span>
                                <ChevronDown
                                    className={cn(
                                        "h-5 w-5 transition-transform",
                                        openDropdown === "pickupLocation" &&
                                            "transform rotate-180"
                                    )}
                                />
                            </button>
                            {openDropdown === "pickupLocation" && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 rounded-lg shadow-lg z-20">
                                    {locations.map((location) => (
                                        <button
                                            key={location.id}
                                            className="w-full text-left p-3 text-white hover:bg-zinc-800"
                                            onClick={() =>
                                                setOpenDropdown(null)
                                            }
                                        >
                                            {location.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pick Up Date */}
                        <div className="relative">
                            <button className="w-full flex items-center justify-between bg-zinc-900 text-white p-4 rounded-lg">
                                <span>Pick Up Date</span>
                                <Calendar className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Drop Off Location */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    toggleDropdown("dropoffLocation")
                                }
                                className="w-full flex items-center justify-between bg-zinc-900 text-white p-4 rounded-lg"
                            >
                                <span>Drop Off Location</span>
                                <ChevronDown
                                    className={cn(
                                        "h-5 w-5 transition-transform",
                                        openDropdown === "dropoffLocation" &&
                                            "transform rotate-180"
                                    )}
                                />
                            </button>
                            {openDropdown === "dropoffLocation" && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 rounded-lg shadow-lg z-20">
                                    {locations.map((location) => (
                                        <button
                                            key={location.id}
                                            className="w-full text-left p-3 text-white hover:bg-zinc-800"
                                            onClick={() =>
                                                setOpenDropdown(null)
                                            }
                                        >
                                            {location.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Return Date */}
                        <div className="relative">
                            <button className="w-full flex items-center justify-between bg-zinc-900 text-white p-4 rounded-lg">
                                <span>Return Date</span>
                                <Calendar className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-center">
                        <Button className="bg-amber-500 hover:bg-amber-600 text-zinc-900 px-8 py-6 text-lg rounded-full">
                            Rent Now
                        </Button>
                    </div>
                </div>

                {/* Background car image */}
                <div className="absolute inset-0 z-0 opacity-30">
                    <div className="w-full h-full bg-gradient-to-b from-transparent to-zinc-900"></div>
                </div>
            </div>
        </section>
    );
}
