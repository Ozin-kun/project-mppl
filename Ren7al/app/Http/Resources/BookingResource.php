<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
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
        'user_id' => $this->user_id,
        'car_id' => $this->car_id,
        'start_date' => $this->start_date,
        'end_date' => $this->end_date,
        'total_price' => $this->total_price,
        'status' => $this->status,
        'created_at' => $this->created_at,
        'updated_at' => $this->updated_at,
        
        // Muat relasi
        'user' => new UserResource($this->whenLoaded('user')),
        'car' => new CarResource($this->whenLoaded('car')),
        'payment' => new PaymentResource($this->whenLoaded('payment')),
        
        'duration_days' => $this->getDurationDays(),
        'status_label' => $this->getStatusLabel(),
        'can_cancel' => $this->canBeCancelled(),
    ];
}
private function getStatusLabel()
    {
        return match($this->status) {
            'pending' => 'Menunggu Konfirmasi',
            'confirmed' => 'Dikonfirmasi', 
            'cancelled' => 'Dibatalkan',
            default => 'Unknown'
        };
    }
    
    private function canBeCancelled()
    {
        return $this->status === 'pending' && 
               $this->start_date->isAfter(now()->addDay());
    }
}
