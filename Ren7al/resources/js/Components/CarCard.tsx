import { Link } from "@inertiajs/react";
import { Calendar } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Car } from "@/types/car";

// Interface for Car data structure based on your Laravel migration

interface CarCardProps {
    car: Car;
}

export function CarCard({ car }: CarCardProps) {
    // Get default image if car image is null
    const getCarImage = (car: Car) => {
        return car.image || "/placeholder.svg?height=600&width=800";
    };

    return (
        <div className="relative rounded-xl overflow-hidden bg-zinc-800 transition-transform duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl">
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={getCarImage(car) || "/placeholder.svg"}
                    alt={`${car.brand} ${car.model}`}
                    className="object-cover transition-transform h-full w-full absolute duration-500 hover:scale-105"
                />
                {!car.is_available && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">
                            Not Available
                        </span>
                    </div>
                )}
                <div className="absolute top-4 right-4">
                    <Badge className="bg-zinc-900 bg-opacity-80 text-white">
                        {car.brand}
                    </Badge>
                </div>
            </div>

            <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {car.brand} {car.model}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-300">
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-amber-500 mr-1" />
                            <span>{car.year}</span>
                        </div>
                        <div className="flex items-center">
                            <Badge
                                variant="outline"
                                className="text-zinc-400 border-zinc-600"
                            >
                                {car.license_plate}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="mt-4 md:mt-0 flex items-center gap-4">
                    <div className="text-right">
                        <span className="text-amber-500 text-2xl font-bold">
                            ${car.rental_price_per_day}
                        </span>
                        <span className="text-xs text-zinc-400 block">
                            /day
                        </span>
                    </div>
                    <Link href={`/cars/${car.id}`}>
                        <Button variant="default" disabled={!car.is_available}>
                            {car.is_available ? "Details" : "Unavailable"}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
