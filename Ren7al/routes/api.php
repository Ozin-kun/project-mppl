<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\WebhookController;

Route::post('/api/stripe/webhook', [WebhookController::class, 'stripeWebhook'])->name('stripe.webhook');
