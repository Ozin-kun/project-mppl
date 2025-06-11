<?php

namespace Database\Seeders;

use App\Models\Car;
use Illuminate\Database\Seeder;

class CarSeeder extends Seeder
{
    public function run(): void
    {
        // Economy cars (most popular for rental)
        Car::factory(15)->economy()->create();
        
        // Family cars (7-8 seater)
        Car::factory(12)->family()->create();
        
        // Premium cars
        Car::factory(8)->premium()->create();
        
        // Luxury cars (limited quantity)
        Car::factory(5)->luxury()->create();
        
        // Random mix
        Car::factory(10)->create();

        $this->command->info('Created 50 cars with Indonesian car rental data');
    }
}