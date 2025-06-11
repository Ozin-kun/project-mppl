<?php

namespace Database\Factories;

use App\Models\Car;
use Illuminate\Database\Eloquent\Factories\Factory;

class CarFactory extends Factory
{
    protected $model = Car::class;

    public function definition(): array
    {
        // Data mobil dengan harga tetap
        $carData = $this->getRandomCarWithFixedPrice();
        
        return [
            'brand' => $carData['brand'],
            'model' => $carData['model'],
            'license_plate' => $this->generateIndonesianLicensePlate(),
            'year' => $this->faker->numberBetween(2018, 2024),
            'seats' => $carData['seats'],
            'rental_price_per_day' => $carData['price'], // Harga tetap
            'description' => $this->generateCarDescription($carData),
            'image' => $this->getCarImage($carData['brand'], $carData['model']),
            'is_available' => $this->faker->boolean(85), // 85% chance available
        ];
    }

    /**
     * Data mobil dengan harga tetap
     */
    private function getRandomCarWithFixedPrice(): array
    {
        $cars = [
            // ECONOMY SEGMENT (250k - 400k)
            [
                'brand' => 'Toyota',
                'model' => 'Agya',
                'seats' => 5,
                'category' => 'Economy',
                'price' => 300000, // 300k per day
            ],
            [
                'brand' => 'Daihatsu',
                'model' => 'Ayla',
                'seats' => 5,
                'category' => 'Economy',
                'price' => 280000, // 280k per day
            ],
            [
                'brand' => 'Honda',
                'model' => 'Brio',
                'seats' => 5,
                'category' => 'Economy',
                'price' => 320000, // 320k per day
            ],
            [
                'brand' => 'Suzuki',
                'model' => 'Karimun Wagon R',
                'seats' => 5,
                'category' => 'Economy',
                'price' => 270000, // 270k per day
            ],

            // COMPACT MPV SEGMENT (350k - 450k)
            [
                'brand' => 'Toyota',
                'model' => 'Calya',
                'seats' => 7,
                'category' => 'Compact MPV',
                'price' => 350000, // 350k per day
            ],
            [
                'brand' => 'Daihatsu',
                'model' => 'Sigra',
                'seats' => 7,
                'category' => 'Compact MPV',
                'price' => 340000, // 340k per day
            ],

            // FAMILY MPV SEGMENT (400k - 550k)
            [
                'brand' => 'Toyota',
                'model' => 'Avanza',
                'seats' => 7,
                'category' => 'Family MPV',
                'price' => 400000, // 400k per day
            ],
            [
                'brand' => 'Daihatsu',
                'model' => 'Xenia',
                'seats' => 7,
                'category' => 'Family MPV',
                'price' => 380000, // 380k per day
            ],
            [
                'brand' => 'Honda',
                'model' => 'Mobilio',
                'seats' => 7,
                'category' => 'Family MPV',
                'price' => 420000, // 420k per day
            ],
            [
                'brand' => 'Suzuki',
                'model' => 'Ertiga',
                'seats' => 7,
                'category' => 'Family MPV',
                'price' => 450000, // 450k per day
            ],
            [
                'brand' => 'Mitsubishi',
                'model' => 'Xpander',
                'seats' => 7,
                'category' => 'Family MPV',
                'price' => 480000, // 480k per day
            ],

            // SEDAN SEGMENT (450k - 600k)
            [
                'brand' => 'Toyota',
                'model' => 'Vios',
                'seats' => 5,
                'category' => 'Sedan',
                'price' => 480000, // 480k per day
            ],
            [
                'brand' => 'Honda',
                'model' => 'City',
                'seats' => 5,
                'category' => 'Sedan',
                'price' => 500000, // 500k per day
            ],
            [
                'brand' => 'Nissan',
                'model' => 'Almera',
                'seats' => 5,
                'category' => 'Sedan',
                'price' => 450000, // 450k per day
            ],

            // SUV SEGMENT (500k - 700k)
            [
                'brand' => 'Toyota',
                'model' => 'Rush',
                'seats' => 7,
                'category' => 'SUV',
                'price' => 550000, // 550k per day
            ],
            [
                'brand' => 'Daihatsu',
                'model' => 'Terios',
                'seats' => 7,
                'category' => 'SUV',
                'price' => 520000, // 520k per day
            ],
            [
                'brand' => 'Honda',
                'model' => 'BR-V',
                'seats' => 7,
                'category' => 'SUV',
                'price' => 580000, // 580k per day
            ],
            [
                'brand' => 'Suzuki',
                'model' => 'XL7',
                'seats' => 7,
                'category' => 'SUV',
                'price' => 560000, // 560k per day
            ],

            // PREMIUM SEGMENT (700k - 1.2jt)
            [
                'brand' => 'Toyota',
                'model' => 'Innova',
                'seats' => 8,
                'category' => 'Premium MPV',
                'price' => 750000, // 750k per day
            ],
            [
                'brand' => 'Toyota',
                'model' => 'Innova Reborn',
                'seats' => 8,
                'category' => 'Premium MPV',
                'price' => 850000, // 850k per day
            ],
            [
                'brand' => 'Toyota',
                'model' => 'Fortuner',
                'seats' => 7,
                'category' => 'Premium SUV',
                'price' => 900000, // 900k per day
            ],
            [
                'brand' => 'Honda',
                'model' => 'CR-V',
                'seats' => 7,
                'category' => 'Premium SUV',
                'price' => 850000, // 850k per day
            ],
            [
                'brand' => 'Mitsubishi',
                'model' => 'Pajero Sport',
                'seats' => 7,
                'category' => 'Premium SUV',
                'price' => 950000, // 950k per day
            ],
            [
                'brand' => 'Isuzu',
                'model' => 'MU-X',
                'seats' => 7,
                'category' => 'Premium SUV',
                'price' => 880000, // 880k per day
            ],

            // LUXURY SEGMENT (1.2jt - 2.5jt)
            [
                'brand' => 'Toyota',
                'model' => 'Alphard',
                'seats' => 8,
                'category' => 'Luxury MPV',
                'price' => 2000000, // 2jt per day
            ],
            [
                'brand' => 'Toyota',
                'model' => 'Vellfire',
                'seats' => 8,
                'category' => 'Luxury MPV',
                'price' => 2200000, // 2.2jt per day
            ],
            [
                'brand' => 'Honda',
                'model' => 'Odyssey',
                'seats' => 8,
                'category' => 'Luxury MPV',
                'price' => 1800000, // 1.8jt per day
            ],
            [
                'brand' => 'Toyota',
                'model' => 'Camry',
                'seats' => 5,
                'category' => 'Luxury Sedan',
                'price' => 1200000, // 1.2jt per day
            ],
            [
                'brand' => 'Honda',
                'model' => 'Accord',
                'seats' => 5,
                'category' => 'Luxury Sedan',
                'price' => 1300000, // 1.3jt per day
            ],
            [
                'brand' => 'BMW',
                'model' => '320i',
                'seats' => 5,
                'category' => 'Luxury Sedan',
                'price' => 1500000, // 1.5jt per day
            ],
            [
                'brand' => 'Mercedes-Benz',
                'model' => 'C-Class',
                'seats' => 5,
                'category' => 'Luxury Sedan',
                'price' => 1600000, // 1.6jt per day
            ],
            [
                'brand' => 'BMW',
                'model' => 'X3',
                'seats' => 5,
                'category' => 'Luxury SUV',
                'price' => 1800000, // 1.8jt per day
            ],
            [
                'brand' => 'Mercedes-Benz',
                'model' => 'GLA',
                'seats' => 5,
                'category' => 'Luxury SUV',
                'price' => 1700000, // 1.7jt per day
            ],
        ];

        return $this->faker->randomElement($cars);
    }

    /**
     * Generate Indonesian license plate format
     */
    private function generateIndonesianLicensePlate(): string
    {
        $regions = [
            'B',   // Jakarta
            'D',   // Bandung
            'F',   // Bogor
            'L',   // Surabaya
            'N',   // Malang
            'AA',  // Yogyakarta
            'AB',  // Sleman
            'AD',  // Solo
            'AG',  // Kediri
            'H',   // Semarang
            'A',   // Banten
            'BG',  // Palembang
            'BE',  // Lampung
            'DK',  // Bali
        ];

        $region = $this->faker->randomElement($regions);
        $number = $this->faker->numberBetween(1000, 9999);
        $letters = strtoupper($this->faker->lexify('???'));

        return "{$region} {$number} {$letters}";
    }

    /**
     * Generate car description
     */
    private function generateCarDescription(array $carData): string
    {
        $features = [
            'AC dingin', 'Audio system', 'Power steering', 'Central lock',
            'Electric window', 'Airbag', 'ABS', 'Bluetooth', 'USB charging port',
            'Comfortable seats', 'Spacious interior', 'Fuel efficient'
        ];

        $selectedFeatures = $this->faker->randomElements($features, 4);
        
        $description = "{$carData['brand']} {$carData['model']} {$carData['category']} dengan kapasitas {$carData['seats']} penumpang. ";
        $description .= "Kondisi prima dan terawat. ";
        $description .= "Dilengkapi dengan " . implode(', ', $selectedFeatures) . ". ";
        $description .= "Cocok untuk perjalanan keluarga, bisnis, atau wisata.";

        return $description;
    }

    /**
     * Get car image
     */
    private function getCarImage(string $brand, string $model): string
    {
        $imageId = crc32($brand . $model) % 1000 + 400; // Consistent image per model
        return "https://picsum.photos/800/600?random={$imageId}";
    }

    /**
     * State untuk economy cars dengan harga tetap
     */
    public function economy()
    {
        return $this->state(function (array $attributes) {
            $economyCars = [
                ['brand' => 'Toyota', 'model' => 'Agya', 'seats' => 5, 'price' => 300000],
                ['brand' => 'Daihatsu', 'model' => 'Ayla', 'seats' => 5, 'price' => 280000],
                ['brand' => 'Honda', 'model' => 'Brio', 'seats' => 5, 'price' => 320000],
                ['brand' => 'Suzuki', 'model' => 'Karimun Wagon R', 'seats' => 5, 'price' => 270000],
            ];

            $car = $this->faker->randomElement($economyCars);

            return [
                'brand' => $car['brand'],
                'model' => $car['model'],
                'seats' => $car['seats'],
                'rental_price_per_day' => $car['price'],
            ];
        });
    }

    /**
     * State untuk family cars dengan harga tetap
     */
    public function family()
    {
        return $this->state(function (array $attributes) {
            $familyCars = [
                ['brand' => 'Toyota', 'model' => 'Avanza', 'seats' => 7, 'price' => 400000],
                ['brand' => 'Daihatsu', 'model' => 'Xenia', 'seats' => 7, 'price' => 380000],
                ['brand' => 'Honda', 'model' => 'Mobilio', 'seats' => 7, 'price' => 420000],
                ['brand' => 'Suzuki', 'model' => 'Ertiga', 'seats' => 7, 'price' => 450000],
                ['brand' => 'Mitsubishi', 'model' => 'Xpander', 'seats' => 7, 'price' => 480000],
            ];

            $car = $this->faker->randomElement($familyCars);

            return [
                'brand' => $car['brand'],
                'model' => $car['model'],
                'seats' => $car['seats'],
                'rental_price_per_day' => $car['price'],
            ];
        });
    }

    /**
     * State untuk premium cars dengan harga tetap
     */
    public function premium()
    {
        return $this->state(function (array $attributes) {
            $premiumCars = [
                ['brand' => 'Toyota', 'model' => 'Innova', 'seats' => 8, 'price' => 750000],
                ['brand' => 'Toyota', 'model' => 'Fortuner', 'seats' => 7, 'price' => 900000],
                ['brand' => 'Honda', 'model' => 'CR-V', 'seats' => 7, 'price' => 850000],
                ['brand' => 'Mitsubishi', 'model' => 'Pajero Sport', 'seats' => 7, 'price' => 950000],
            ];

            $car = $this->faker->randomElement($premiumCars);

            return [
                'brand' => $car['brand'],
                'model' => $car['model'],
                'seats' => $car['seats'],
                'rental_price_per_day' => $car['price'],
            ];
        });
    }

    /**
     * State untuk luxury cars dengan harga tetap
     */
    public function luxury()
    {
        return $this->state(function (array $attributes) {
            $luxuryCars = [
                ['brand' => 'Toyota', 'model' => 'Alphard', 'seats' => 8, 'price' => 2000000],
                ['brand' => 'BMW', 'model' => '320i', 'seats' => 5, 'price' => 1500000],
                ['brand' => 'Mercedes-Benz', 'model' => 'C-Class', 'seats' => 5, 'price' => 1600000],
                ['brand' => 'Toyota', 'model' => 'Camry', 'seats' => 5, 'price' => 1200000],
            ];

            $car = $this->faker->randomElement($luxuryCars);

            return [
                'brand' => $car['brand'],
                'model' => $car['model'],
                'seats' => $car['seats'],
                'rental_price_per_day' => $car['price'],
                'is_available' => true, // Luxury cars biasanya selalu ready
            ];
        });
    }
}