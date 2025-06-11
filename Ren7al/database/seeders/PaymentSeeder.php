<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\Booking;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan ada bookings
        if (Booking::count() === 0) {
            $this->call(BookingSeeder::class);
        }

        // Get all bookings
        $bookings = Booking::all();

        foreach ($bookings as $booking) {
            // Skip cancelled bookings (tidak perlu payment)
            if ($booking->status === 'cancelled') {
                continue;
            }

            // Create payment untuk setiap booking
            $paymentStatus = match($booking->status) {
                'pending' => 'pending',
                'confirmed' => fake()->randomElement(['paid', 'pending']),
                'active' => 'paid', // Active booking harus sudah bayar
                'completed' => 'paid', // Completed booking pasti sudah bayar
                default => 'pending'
            };

            Payment::factory()
                ->forBooking($booking)
                ->state(['payment_status' => $paymentStatus])
                ->create();
        }

        // Create additional payments dengan berbagai status
        Payment::factory(5)->paid()->create();
        Payment::factory(3)->failed()->create();
        Payment::factory(4)->pending()->create();
        
        // Create payments dengan method tertentu
        Payment::factory(3)->bankTransfer()->paid()->create();
        Payment::factory(2)->eWallet()->paid()->create();
        Payment::factory(2)->qris()->paid()->create();

        $this->command->info('Created payments for all bookings');
    }
}