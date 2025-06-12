<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_id' => $this->booking_id,
            'amount' => $this->amount,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'transaction_id' => $this->transaction_id,
            'paid_at' => $this->paid_at?->format('Y-m-d H:i:s'), // Format datetime atau null
            'gateway_response' => $this->gateway_response, // Array sudah di-cast
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Include booking relationship when loaded
            'booking' => new BookingResource($this->whenLoaded('booking')),
            
            // Computed properties from helper methods
            'is_paid' => $this->isPaid(),
            'is_pending' => $this->isPending(),
            'can_be_refunded' => $this->canBeRefunded(),
            
            // Additional computed properties
            'status_label' => $this->getStatusLabel(),
            'payment_method_label' => $this->getPaymentMethodLabel(),
        ];
    }
    
    /**
     * Get human-readable status label
     */
    private function getStatusLabel(): string
    {
        return match($this->payment_status) {
            'pending' => 'Menunggu Pembayaran',
            'paid' => 'Sudah Dibayar',
            'failed' => 'Gagal',
            'refunded' => 'Dikembalikan',
            'cancelled' => 'Dibatalkan',
            default => 'Unknown'
        };
    }
    
    /**
     * Get human-readable payment method label
     */
    private function getPaymentMethodLabel(): string
    {
        return match($this->payment_method) {
            'credit_card' => 'Kartu Kredit',
            'bank_transfer' => 'Transfer Bank',
            'e_wallet' => 'E-Wallet',
            'cash' => 'Tunai',
            'pending' => 'Belum Dipilih',
            default => ucfirst(str_replace('_', ' ', $this->payment_method ?? 'Unknown'))
        };
    }
}