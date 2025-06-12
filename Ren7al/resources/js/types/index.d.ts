import { Config } from "ziggy-js";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    roles: string[]; // Array of role names
    permissions: string[]; // Array of permission names
}

export type PaginatedData<T = any> = {
    data: T[];
    links: Record<string, string>;
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};

export interface Car {
    id: number;
    brand: string;
    model: string;
    license_plate: string;
    year: number;
    rental_price_per_day: string;
    description: string | null;
    image: string | null;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}
