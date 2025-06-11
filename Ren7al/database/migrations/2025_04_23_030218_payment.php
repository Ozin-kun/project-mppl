<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2); // Increased precision
            $table->string('payment_method'); // credit_card, bank_transfer, etc.
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded', 'cancelled'])->default('pending');
            $table->string('transaction_id')->nullable(); // From payment gateway
            $table->timestamp('paid_at')->nullable(); // When payment completed
            $table->json('gateway_response')->nullable(); // Store gateway response
            $table->timestamps();
            
            // Add indexes for frequently queried columns
            $table->index('payment_status'); // Fast lookup by status
            $table->index('payment_method'); // Fast lookup by method
            $table->index('transaction_id'); // Fast lookup by transaction
            $table->index('paid_at'); // Fast lookup by payment date
            
            // Composite index for common combined queries
            $table->index(['payment_status', 'payment_method']); // Query by status AND method
        });
    }

    public function down(): void {
        Schema::dropIfExists('payments');
    }
};