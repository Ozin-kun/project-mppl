<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('brand');
            $table->string('model');
            $table->unsignedTinyInteger('seats')->default(5);

            $table->string('license_plate')->unique();
            $table->integer('year');
            $table->decimal('rental_price_per_day', 8, 2);
            $table->text('description')->nullable();
            $table->string('image')->nullable(); // image file path or URL
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('cars');
    }
};

