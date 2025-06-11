<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\User;
use App\Models\Car;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition(): array
    {
        // Ensure we have users and cars
        $user = User::inRandomOrder()->first() ?? User::factory()->create();
        $car = Car::where('is_available', true)->inRandomOrder()->first() ?? Car::factory()->create();
        
        // Generate logical dates (start dari sekarang hingga 6 bulan ke depan)
        $startDate = $this->faker->dateTimeBetween('now', '+6 months');
        $endDate = $this->faker->dateTimeBetween($startDate, $startDate->format('Y-m-d') . ' +14 days');
        
        // Calculate total days
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);
        $totalDays = $start->diffInDays($end);
        
        // Generate realistic daily rate (dalam Rupiah)
        $dailyRate = $this->faker->numberBetween(300000, 1500000); // 300k - 1.5jt
        
        // Calculate pricing (sesuai dengan BookingController logic)
        $subtotal = $dailyRate * $totalDays;
        $taxRate = 0.11; // PPN 11%
        $taxAmount = round($subtotal * $taxRate);
        $totalAmount = $subtotal + $taxAmount;

        return [
            'user_id' => $user->id,
            'car_id' => $car->id,
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'total_days' => $totalDays,
            'daily_rate' => $dailyRate,
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'total_amount' => $totalAmount,
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'active', 'completed', 'cancelled']),
            'notes' => $this->faker->optional(0.3)->sentence(), // 30% chance ada notes
        ];
    }

    /**
     * State untuk booking yang confirmed
     */
    public function confirmed()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'confirmed',
            ];
        });
    }

    /**
     * State untuk booking yang completed (masa lalu)
     */
    public function completed()
    {
        return $this->state(function (array $attributes) {
            $startDate = $this->faker->dateTimeBetween('-6 months', '-1 month');
            $endDate = $this->faker->dateTimeBetween($startDate, $startDate->format('Y-m-d') . ' +7 days');
            
            $start = Carbon::parse($startDate);
            $end = Carbon::parse($endDate);
            $totalDays = $start->diffInDays($end);
            
            $dailyRate = $this->faker->numberBetween(300000, 1500000);
            $subtotal = $dailyRate * $totalDays;
            $taxAmount = round($subtotal * 0.11);
            $totalAmount = $subtotal + $taxAmount;
            
            return [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'total_days' => $totalDays,
                'daily_rate' => $dailyRate,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'status' => 'completed',
            ];
        });
    }

    /**
     * State untuk booking yang upcoming (masa depan)
     */
    public function upcoming()
    {
        return $this->state(function (array $attributes) {
            $startDate = $this->faker->dateTimeBetween('+1 day', '+3 months');
            $endDate = $this->faker->dateTimeBetween($startDate, $startDate->format('Y-m-d') . ' +10 days');
            
            $start = Carbon::parse($startDate);
            $end = Carbon::parse($endDate);
            $totalDays = $start->diffInDays($end);
            
            $dailyRate = $this->faker->numberBetween(300000, 1500000);
            $subtotal = $dailyRate * $totalDays;
            $taxAmount = round($subtotal * 0.11);
            $totalAmount = $subtotal + $taxAmount;
            
            return [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'total_days' => $totalDays,
                'daily_rate' => $dailyRate,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'status' => 'confirmed',
            ];
        });
    }

    /**
     * State untuk booking yang active (sedang berlangsung)
     */
    public function active()
    {
        return $this->state(function (array $attributes) {
            $startDate = $this->faker->dateTimeBetween('-3 days', 'now');
            $endDate = $this->faker->dateTimeBetween('now', '+7 days');
            
            $start = Carbon::parse($startDate);
            $end = Carbon::parse($endDate);
            $totalDays = $start->diffInDays($end);
            
            $dailyRate = $this->faker->numberBetween(300000, 1500000);
            $subtotal = $dailyRate * $totalDays;
            $taxAmount = round($subtotal * 0.11);
            $totalAmount = $subtotal + $taxAmount;
            
            return [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'total_days' => $totalDays,
                'daily_rate' => $dailyRate,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'status' => 'active',
            ];
        });
    }

    /**
     * State untuk booking yang cancelled
     */
    public function cancelled()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'cancelled',
                'notes' => $this->faker->randomElement([
                    'Dibatalkan oleh customer',
                    'Mobil mengalami masalah teknis',
                    'Perubahan rencana perjalanan',
                    'Kondisi cuaca buruk',
                    'Alasan pribadi'
                ]),
            ];
        });
    }

    /**
     * State untuk high value booking (mobil premium)
     */
    

    /**
     * State untuk economy booking (mobil murah)
     */
    
}