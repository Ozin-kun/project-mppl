import { User } from "./user";
import { Car } from "./car";
import { Payment } from "./payment";

export interface Booking {
    id: number;
    user_id: number;
    car_id: number;
    start_date: string;
    end_date: string;
    total_days: number;
    daily_rate: string;
    subtotal: string;
    tax_amount: string;
    total_amount: string;
    status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
    notes: string | null;
    created_at: string;
    updated_at: string;
    car: Car;
    user?: User;
    payment?: Payment;
}
