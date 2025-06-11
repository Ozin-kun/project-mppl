<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarResource extends JsonResource
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
            'brand' => $this->brand,
            'model' => $this->model,
            'seats' => $this->seats,
            'license_plate' => $this->license_plate,
            'year' => $this->year,
            'rental_price_per_day' => $this->rental_price_per_day,
            'description' => $this->description,
            'image' => $this->image ? $this->image : null,
            'is_available' => $this->is_available,
            'created_at' => $this->created_at->toDateString(),
            'updated_at' => $this->updated_at->toDateString(),
        ];
    }
}
