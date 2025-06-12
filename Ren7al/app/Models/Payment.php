<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'amount',
        'payment_method',
        'payment_status',
        'transaction_id',
        'paid_at',
        'gateway_response',
    ];

    protected $casts = [
        'amount' => 'decimal:0',
        'paid_at' => 'datetime',
        'gateway_response' => 'array',
    ];

    // Relations
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function getFormattedAmountAttribute()
    {
        return 'Rp ' . number_format($this->amount, 0, ',', '.');
    }
    
    // Helper methods untuk PaymentResource
    public function isPaid()
    {
        return $this->payment_status === 'paid';
    }
    
    public function isPending()
    {
        return $this->payment_status === 'pending';
    }
    
    public function canBeRefunded()
    {
        return $this->payment_status === 'paid' && 
               $this->booking && 
               $this->booking->status !== 'completed';
    }
    
    public function isFailed()
    {
        return $this->payment_status === 'failed';
    }
    
    public function isRefunded()
    {
        return $this->payment_status === 'refunded';
    }
    
    public function isCancelled()
    {
        return $this->payment_status === 'cancelled';
    }
    
    public function getStatusLabelAttribute()
    {
        return match($this->payment_status) {
            'pending' => 'Menunggu Pembayaran',
            'paid' => 'Lunas',
            'failed' => 'Gagal',
            'refunded' => 'Dikembalikan',
            'cancelled' => 'Dibatalkan',
            default => 'Unknown'
        };
    }

    public function getPaymentMethodLabelAttribute()
    {
        return match($this->payment_method) {
            'bank_transfer' => 'Transfer Bank',
            'e_wallet' => 'E-Wallet',
            'credit_card' => 'Kartu Kredit',
            'virtual_account' => 'Virtual Account',
            'qris' => 'QRIS',
            'cash' => 'Tunai',
            default => ucfirst(str_replace('_', ' ', $this->payment_method))
        };
    }
    // Scopes
    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }
    
    public function scopePending($query)
    {
        return $query->where('payment_status', 'pending');
    }
    
    public function scopeRefundable($query)
    {
        return $query->where('payment_status', 'paid')
                    ->whereHas('booking', function($q) {
                        $q->where('status', '!=', 'completed');
                    });
    }
}