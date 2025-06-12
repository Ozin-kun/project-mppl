"use client";

import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/Components/ui/button";

const carBrands = [
    { name: "Ferrari", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Lamborghini", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Rolls Royce", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Porsche", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Land Rover", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Mini", logo: "/placeholder.svg?height=60&width=120" },
];

export default function CTASection() {
    return (
        <section className="relative bg-zinc-900 py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative z-10 text-center mb-8">
                    <span className="text-amber-500 uppercase text-sm tracking-wider">
                        RENT YOUR CAR
                    </span>
                    <h2 className="text-center mt-2 mb-4 text-4xl md:text-5xl font-bold text-white">
                        Interested in Renting?
                    </h2>
                    <p className="text-zinc-300 max-w-2xl mx-auto">
                        Don't hesitate and send us a message.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 relative z-10">
                    <Link href="https://wa.me/1234567890">
                        <Button className="bg-amber-500 hover:bg-amber-600 text-zinc-900 px-8 py-6 text-lg rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                            </svg>
                            WhatsApp
                        </Button>
                    </Link>
                    <Link href="/rent">
                        <Button
                            variant="outline"
                            className="bg-transparent border-white text-white hover:bg-white hover:text-zinc-900 px-8 py-6 text-lg rounded-full"
                        >
                            Rent Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                {/* Car brands */}
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 relative z-10">
                    {carBrands.map((brand) => (
                        <div
                            key={brand.name}
                            className="w-16 h-16 md:w-20 md:h-20"
                        >
                            <img
                                src={brand.logo || "/placeholder.svg"}
                                alt={brand.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    ))}
                </div>

                {/* Background car image */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <img
                        src="/placeholder.svg?height=800&width=1600"
                        alt="Luxury car"
                        className="absolute w-full h-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
}
