<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'car_id', 'start_date', 'end_date', 'total_days',
        'daily_rate', 'subtotal', 'tax_amount', 'total_amount',
        'status', 'notes'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'total_days' => 'integer',
        'daily_rate' => 'decimal:0', // Ubah ke 0 untuk Rupiah
        'subtotal' => 'decimal:0',   // Ubah ke 0 untuk Rupiah
        'tax_amount' => 'decimal:0', // Ubah ke 0 untuk Rupiah
        'total_amount' => 'decimal:0', // Ubah ke 0 untuk Rupiah
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    // Payment relationships
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // Helper methods untuk payment
    public function isPaid()
    {
        return $this->payment && $this->payment->isPaid();
    }

    public function getPaymentStatusAttribute()
    {
        if (!$this->payment) {
            return 'unpaid';
        }
        
        return $this->payment->payment_status;
    }

    public function getPaymentMethodAttribute()
    {
        return $this->payment ? $this->payment->payment_method : null;
    }

    // Format currency helpers
    public function getFormattedDailyRateAttribute()
    {
        return 'Rp ' . number_format($this->daily_rate, 0, ',', '.');
    }

    public function getFormattedSubtotalAttribute()
    {
        return 'Rp ' . number_format($this->subtotal, 0, ',', '.');
    }

    public function getFormattedTaxAmountAttribute()
    {
        return 'Rp ' . number_format($this->tax_amount, 0, ',', '.');
    }

    public function getFormattedTotalAmountAttribute()
    {
        return 'Rp ' . number_format($this->total_amount, 0, ',', '.');
    }

    // Business Logic
    public function validatePricing(): bool
    {
        $expectedSubtotal = $this->daily_rate * $this->total_days;
        $expectedTotal = $expectedSubtotal + $this->tax_amount;
        
        return abs($this->subtotal - $expectedSubtotal) < 1 && 
               abs($this->total_amount - $expectedTotal) < 1;
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending', 'confirmed']) && 
               $this->start_date->isFuture() &&
               (!$this->payment || !$this->payment->isPaid());
    }

    public function canBeRefunded(): bool
    {
        return $this->payment && 
               $this->payment->isPaid() && 
               in_array($this->status, ['confirmed', 'cancelled']) &&
               $this->start_date->isFuture();
    }

    public function isActive(): bool
    {
        return $this->status === 'confirmed' && 
               $this->start_date->isPast() && 
               $this->end_date->isFuture() &&
               $this->isPaid();
    }

    public function isUpcoming(): bool
    {
        return $this->status === 'confirmed' && 
               $this->start_date->isFuture() &&
               $this->isPaid();
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed' || 
               ($this->end_date->isPast() && $this->isPaid());
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'confirmed')
                    ->where('start_date', '<=', now())
                    ->where('end_date', '>=', now())
                    ->whereHas('payment', function($q) {
                        $q->where('payment_status', 'paid');
                    });
    }

    public function scopeUpcoming($query)
    {
        return $query->where('status', 'confirmed')
                    ->where('start_date', '>', now())
                    ->whereHas('payment', function($q) {
                        $q->where('payment_status', 'paid');
                    });
    }

    public function scopePaid($query)
    {
        return $query->whereHas('payment', function($q) {
            $q->where('payment_status', 'paid');
        });
    }

    public function scopeUnpaid($query)
    {
        return $query->whereDoesntHave('payment')
                    ->orWhereHas('payment', function($q) {
                        $q->where('payment_status', '!=', 'paid');
                    });
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeRefundable($query)
    {
        return $query->whereHas('payment', function($q) {
            $q->where('payment_status', 'paid');
        })->where('start_date', '>', now())
          ->whereIn('status', ['confirmed', 'cancelled']);
    }
}