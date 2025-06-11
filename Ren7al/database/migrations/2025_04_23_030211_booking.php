<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('car_id')->constrained()->onDelete('cascade');
            
            // Date & Duration
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('total_days');
            
            // Pricing Snapshot (dalam Rupiah)
            $table->decimal('daily_rate', 12, 0);    // Max 999,999,999,999 (milyaran rupiah)
            $table->decimal('subtotal', 14, 0);      // Max 99,999,999,999,999 (ratusan triliun)
            $table->decimal('tax_amount', 12, 0);    // PPN 11%
            $table->decimal('total_amount', 14, 0);  // Total dalam rupiah
            
            // Status & Notes
            $table->enum('status', ['pending', 'confirmed', 'active', 'completed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('bookings');
    }
};

