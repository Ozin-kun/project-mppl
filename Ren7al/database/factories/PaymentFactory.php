<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        // Get existing booking atau create new one
        $booking = Booking::inRandomOrder()->first() ?? Booking::factory()->create();
        
        // Payment status
        $paymentStatus = $this->faker->randomElement(['pending', 'paid', 'failed', 'refunded', 'cancelled']);
        
        // Payment method options untuk Indonesia
        $paymentMethod = $this->faker->randomElement([
            'bank_transfer', 
            'e_wallet', 
            'credit_card', 
            'virtual_account',
            'qris',
            'cash'
        ]);
        
        // Amount harus sama dengan booking total_amount
        $amount = $booking->total_amount;
        
        // Transaction ID dan paid_at logic
        $transactionId = null;
        $paidAt = null;
        $gatewayResponse = null;
        
        if ($paymentStatus !== 'pending') {
            $transactionId = 'TXN' . now()->format('YmdHis') . $this->faker->randomNumber(6);
            
            if ($paymentStatus === 'paid') {
                $paidAt = $this->faker->dateTimeBetween($booking->created_at ?? '-1 month', 'now');
                $gatewayResponse = [
                    'gateway' => $this->faker->randomElement(['midtrans', 'xendit', 'doku']),
                    'status' => 'success',
                    'message' => 'Payment processed successfully',
                    'transaction_time' => $paidAt->format('c'),
                    'reference_id' => $transactionId,
                ];
            } else {
                $gatewayResponse = [
                    'gateway' => $this->faker->randomElement(['midtrans', 'xendit', 'doku']),
                    'status' => 'failed',
                    'message' => $this->faker->randomElement([
                        'Insufficient balance',
                        'Payment declined by bank',
                        'Invalid card number',
                        'Transaction timeout'
                    ]),
                    'transaction_time' => now()->toISOString(),
                    'error_code' => $this->faker->randomElement(['4001', '4002', '4003', '5001']),
                ];
            }
        }

        return [
            'booking_id' => $booking->id,
            'amount' => $amount, // PERBAIKAN: Pastikan amount tidak null dan sesuai booking
            'payment_method' => $paymentMethod,
            'payment_status' => $paymentStatus,
            'transaction_id' => $transactionId,
            'paid_at' => $paidAt,
            'gateway_response' => $gatewayResponse,
        ];
    }

    /**
     * State untuk payment yang successful
     */
    public function paid()
    {
        return $this->state(function (array $attributes) {
            $paidAt = $this->faker->dateTimeBetween('-1 month', 'now');
            
            return [
                'payment_status' => 'paid',
                'transaction_id' => 'TXN' . now()->format('YmdHis') . $this->faker->randomNumber(6),
                'paid_at' => $paidAt,
                'gateway_response' => [
                    'gateway' => $this->faker->randomElement(['midtrans', 'xendit', 'doku']),
                    'status' => 'success',
                    'message' => 'Payment processed successfully',
                    'transaction_time' => $paidAt->format('c'),
                    'payment_type' => $this->faker->randomElement(['bank_transfer', 'credit_card', 'e_wallet']),
                ],
            ];
        });
    }

    /**
     * State untuk payment yang pending
     */
    public function pending()
    {
        return $this->state(function (array $attributes) {
            return [
                'payment_status' => 'pending',
                'transaction_id' => null,
                'paid_at' => null,
                'gateway_response' => null,
            ];
        });
    }

    /**
     * State untuk payment yang failed
     */
    public function failed()
    {
        return $this->state(function (array $attributes) {
            return [
                'payment_status' => 'failed',
                'transaction_id' => 'TXN' . now()->format('YmdHis') . $this->faker->randomNumber(6),
                'paid_at' => null,
                'gateway_response' => [
                    'gateway' => $this->faker->randomElement(['midtrans', 'xendit', 'doku']),
                    'status' => 'failed',
                    'message' => $this->faker->randomElement([
                        'Insufficient balance',
                        'Payment declined by bank',
                        'Invalid card details',
                        'Transaction timeout',
                        'Network error'
                    ]),
                    'error_code' => $this->faker->randomElement(['4001', '4002', '4003', '5001', '5002']),
                    'transaction_time' => now()->toISOString(),
                ],
            ];
        });
    }

    /**
     * State untuk specific payment method
     */
    public function bankTransfer()
    {
        return $this->state(function (array $attributes) {
            return [
                'payment_method' => 'bank_transfer',
                'gateway_response' => [
                    'gateway' => 'midtrans',
                    'va_number' => $this->faker->numerify('############'),
                    'bank' => $this->faker->randomElement(['BCA', 'BNI', 'BRI', 'Mandiri']),
                ],
            ];
        });
    }

    public function eWallet()
    {
        return $this->state(function (array $attributes) {
            return [
                'payment_method' => 'e_wallet',
                'gateway_response' => [
                    'gateway' => 'xendit',
                    'ewallet_type' => $this->faker->randomElement(['GOPAY', 'OVO', 'DANA', 'SHOPEEPAY']),
                ],
            ];
        });
    }

    public function qris()
    {
        return $this->state(function (array $attributes) {
            return [
                'payment_method' => 'qris',
                'gateway_response' => [
                    'gateway' => 'midtrans',
                    'qr_string' => $this->faker->sha256(),
                ],
            ];
        });
    }

    /**
     * State untuk amount tertentu
     */
    public function withAmount($amount)
    {
        return $this->state(function (array $attributes) use ($amount) {
            return [
                'amount' => $amount,
            ];
        });
    }

    /**
     * State untuk booking tertentu
     */
    public function forBooking(Booking $booking)
    {
        return $this->state(function (array $attributes) use ($booking) {
            return [
                'booking_id' => $booking->id,
                'amount' => $booking->total_amount, // Ambil amount dari booking
            ];
        });
    }
}