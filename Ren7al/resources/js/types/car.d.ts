export interface Car {
    id: number;
    brand: string;
    model: string;
    seats: number;
    license_plate: string;
    year: number;
    rental_price_per_day: string;
    description: string | null;
    image: string | null;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}
