<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand',
        'model',
        'license_plate',
        'year',
        'rental_price_per_day',
        'description',
        'image',
        'is_available',
        'seats',
    ];

    protected $casts = [
        'rental_price_per_day' => 'decimal:0', // Rupiah tanpa desimal
        'is_available' => 'boolean',
        'seats' => 'integer',
        'year' => 'integer',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function getFormattedRentalPriceAttribute()
    {
        return 'Rp ' . number_format($this->rental_price_per_day, 0, ',', '.');
    }


    public function getTotalEarningsAttribute()
    {
        return $this->bookings()
                    ->whereHas('payment', function($q) {
                        $q->where('payment_status', 'paid');
                    })
                    ->sum('total_amount');
    }

    public function getBookingCountAttribute()
    {
        return $this->bookings()->where('status', '!=', 'cancelled')->count();
    }

    public function isCurrentlyBooked()
    {
        return $this->bookings()
                    ->active()
                    ->exists();
    }
}

