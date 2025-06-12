<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Models\Payment;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Illuminate\Support\Facades\Log;


class BookingController extends Controller
{
    public function create(Car $car)
    {
        // Check if car is available
        if (!$car->is_available) {
            return redirect()->route('cars.show', $car->id)
                ->with('error', 'This car is not available for booking.');
        }
        
        // Get unavailable dates (simple)
        $unavailableDates = Booking::where('car_id', $car->id)
            ->whereIn('status', ['confirmed', 'active'])
            ->get()
            ->flatMap(function ($booking) {
                $start = Carbon::parse($booking->start_date);
                $end = Carbon::parse($booking->end_date);
                $dates = [];
                
                for ($date = $start; $date <= $end; $date->addDay()) {
                    $dates[] = $date->format('Y-m-d');
                }
                
                return $dates;
            })
            ->unique()
            ->values();
        
        return Inertia::render('Booking/Create', [
            'car' => $car,
            
            'upcomingBookings' => $car->bookings->count(),
            'upcomingBookingDetails' => $car->bookings->map(function($booking) {
                return [
                    'id' => $booking->id,
                    'start_date_formatted' => $booking->start_date->format('d M Y'),
                    'end_date_formatted' => $booking->end_date->format('d M Y'),
                    'start_date_short' => $booking->start_date->format('M j'),
                    'end_date_short' => $booking->end_date->format('M j'),
                ];
            }),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }
    
    

    public function store(Request $request)
    {
        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'start_date' => 'required|date|after:today',
            'end_date' => 'required|date|after:start_date',
            'notes' => 'nullable|string|max:500',
        ]);
        
        $car = Car::findOrFail($validated['car_id']);
        
        // Check availability
        $conflictingBookings = Booking::where('car_id', $car->id)
            ->whereIn('status', ['confirmed', 'active'])
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_date', [$validated['start_date'], $validated['end_date']])
                    ->orWhereBetween('end_date', [$validated['start_date'], $validated['end_date']])
                    ->orWhere(function ($q) use ($validated) {
                        $q->where('start_date', '<=', $validated['start_date'])
                            ->where('end_date', '>=', $validated['end_date']);
                    });
            })
            ->exists();
        
        if ($conflictingBookings) {
            return back()->withErrors(['dates' => 'Selected dates are not available.'])->withInput();
        }
        
        // Calculate pricing - SNAPSHOT saat booking
        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);
        $totalDays = $startDate->diffInDays($endDate);
        
        // Get current rates (akan disimpan sebagai historical snapshot)
        $dailyRate = $car->rental_price_per_day;
        $taxRate = config('booking.tax_rate', 0.12); // 10% default, bisa diubah di config
        
        // Calculate amounts
        $subtotal = $dailyRate * $totalDays;
        $taxAmount = round($subtotal * $taxRate);
        $totalAmount = $subtotal + $taxAmount;
        
        // Create booking dengan pricing snapshot
        $booking = Booking::create([
            'user_id' => Auth::id(),
            'car_id' => $validated['car_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_days' => $totalDays,        // SNAPSHOT: days calculation
            'daily_rate' => $dailyRate,        // SNAPSHOT: current car price
            'subtotal' => $subtotal,           // SNAPSHOT: calculated subtotal
            'tax_amount' => $taxAmount,        // SNAPSHOT: tax berdasarkan rate saat ini
            'total_amount' => $totalAmount,    // SNAPSHOT: final amount
            'status' => 'pending',
            'notes' => $validated['notes'],
        ]);

        Payment::create([
            'booking_id' => $booking->id,
            'amount' => $totalAmount,
            'payment_method' => 'stripe',
            'payment_status' => 'pending',
        ]);
        
        // Validation (optional, untuk development)
        // if (!$booking->validatePricing()) {
        //     \Log::warning('Booking pricing validation failed', $booking->toArray());
        // }
        
        // return redirect()->route('bookings.show', $booking->id)
        //     ->with('success', 'Booking confirmed successfully!');
        return redirect()->route('booking.payment', $booking->id);
    }

    public function payment(Booking $booking)
    {
        // Make sure user owns this booking
        if ($booking->user_id !== Auth::id()) {
            abort(403);
        }

        // Check if already paid
        if ($booking->payment && $booking->payment->payment_status === 'paid') {
            return redirect()->route('bookings.show', $booking->id)
                ->with('info', 'This booking has already been paid.');
        }

        return Inertia::render('Booking/Payment', [
            'booking' => $booking->load(['car', 'payment']),
        ]);
    }

//     public function processPayment(Request $request, Booking $booking)
// {
//     // Make sure user owns this booking
//     if ($booking->user_id !== Auth::id()) {
//         if ($request->expectsJson()) {
//             return response()->json(['error' => 'Unauthorized'], 403);
//         }
//         abort(403);
//     }

//     // Check if already paid
//     if ($booking->payment && $booking->payment->payment_status === 'paid') {
//         if ($request->expectsJson()) {
//             return response()->json(['error' => 'Booking already paid'], 400);
//         }
//         return back()->withErrors(['status' => 'Booking already paid']);
//     }

//     try {
//         // Set Stripe API key
//         Stripe::setApiKey(config('stripe.secret'));

//         // Create Stripe Checkout Session
//         $checkoutSession = Session::create([
//             'payment_method_types' => ['card'],
//             'line_items' => [
//                 [
//                     'price_data' => [
//                         'currency' => 'idr',
//                         'product_data' => [
//                             'name' => "Rental {$booking->car->brand} {$booking->car->model}",
//                             'description' => "Rental period: {$booking->total_days} days ({$booking->start_date->format('d M Y')} - {$booking->end_date->format('d M Y')})",
//                             'images' => $booking->car->image ? [$booking->car->image] : [],
//                             'metadata' => [
//                                 'booking_id' => $booking->id,
//                                 'car_id' => $booking->car->id,
//                             ],
//                         ],
//                         'unit_amount' => $booking->total_amount * 100, // Convert to cents
//                     ],
//                     'quantity' => 1,
//                 ],
//             ],
//             'mode' => 'payment',
//             'success_url' => route('booking.payment.success', $booking->id) . '?session_id={CHECKOUT_SESSION_ID}',
//             'cancel_url' => route('booking.payment.cancel', $booking->id),
//             'metadata' => [
//                 'booking_id' => $booking->id,
//                 'user_id' => $booking->user_id,
//                 'car_id' => $booking->car_id,
//             ],
//             'customer_email' => $booking->user->email,
//             'expires_at' => now()->addMinutes(30)->timestamp, // 30 minutes expiry
//         ]);

//         // Update payment with session ID
//         $booking->payment->update([
//             'transaction_id' => $checkoutSession->id,
//             'gateway_response' => [
//                 'stripe_session_id' => $checkoutSession->id,
//                 'session_url' => $checkoutSession->url,
//             ],
//         ]);

//         // Return JSON response for AJAX requests
//         if ($request->expectsJson()) {
//             return response()->json([
//                 'success' => true,
//                 'checkout_url' => $checkoutSession->url,
//                 'session_id' => $checkoutSession->id,
//             ]);
//         }

//         // For non-AJAX requests (fallback)
//         return redirect($checkoutSession->url);

//     } catch (\Exception $e) {
//         Log::error('Stripe payment creation failed: ' . $e->getMessage());

//         if ($request->expectsJson()) {
//             return response()->json([
//                 'success' => false,
//                 'error' => 'Payment processing failed. Please try again.',
//                 'message' => config('app.debug') ? $e->getMessage() : 'Internal server error',
//             ], 500);
//         }

//         return back()->withErrors(['payment' => 'Payment processing failed. Please try again.']);
//     }
// }

// app/Http/Controllers/BookingController.php
public function processPayment(Request $request, Booking $booking)
{
    // Make sure user owns this booking
    if ($booking->user_id !== Auth::id()) {
        abort(403);
    }

    // Check if already paid
    if ($booking->payment && $booking->payment->payment_status === 'paid') {
        return redirect()->route('bookings.show', $booking->id)
            ->with('info', 'This booking has already been paid.');
    }

    try {
        // Set Stripe API key
        Stripe::setApiKey(config('stripe.secret'));

        // Load car relationship
        $booking->load('car', 'user');

        // Create Stripe Checkout Session
        $checkoutSession = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => 'idr',
                        'product_data' => [
                            'name' => "Rental {$booking->car->brand} {$booking->car->model}",
                            'description' => "Rental period: {$booking->total_days} days ({$booking->start_date->format('d M Y')} - {$booking->end_date->format('d M Y')})",
                            'images' => $booking->car->image ? [$booking->car->image] : [],
                            'metadata' => [
                                'booking_id' => $booking->id,
                                'car_id' => $booking->car->id,
                            ],
                        ],
                        'unit_amount' => $booking->total_amount * 100, // Convert to cents
                    ],
                    'quantity' => 1,
                ],
            ],
            'mode' => 'payment',
            'success_url' => route('booking.payment.success', $booking->id) . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('booking.payment.cancel', $booking->id),
            'metadata' => [
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'car_id' => $booking->car_id,
            ],
            'customer_email' => $booking->user->email,
            'expires_at' => now()->addMinutes(30)->timestamp,
        ]);

        // Update payment with session ID
        $booking->payment->update([
            'transaction_id' => $checkoutSession->id,
            'gateway_response' => [
                'stripe_session_id' => $checkoutSession->id,
                'session_url' => $checkoutSession->url,
            ],
        ]);

        // ALWAYS redirect to Stripe (no JSON response)
        return redirect($checkoutSession->url);

    } catch (\Exception $e) {
        Log::error('Stripe payment creation failed: ' . $e->getMessage());

        return redirect()->route('booking.payment', $booking->id)
            ->with('error', 'Payment processing failed. Please try again.');
    }
}

public function paymentSuccess(Request $request, Booking $booking)
{
    $sessionId = $request->get('session_id');
    
    if (!$sessionId) {
        return redirect()->route('booking.payment', $booking->id)
            ->with('error', 'Invalid payment session.');
    }

    
    return redirect()->route('bookings.show', $booking->id)
        ->with('success', 'Payment submitted! Please wait for confirmation.');
}

    public function paymentCancel(Booking $booking)
    {
        return redirect()->route('booking.payment', $booking->id)
            ->with('info', 'Payment was cancelled. You can try again when ready.');
    }

    
    public function show(Booking $booking)
    {
        // Make sure user can only see their own booking
        if ($booking->user_id !== Auth::id()) {
            abort(403);
        }
        
        return Inertia::render('Booking/Show', [
            'booking' => $booking->load(['car', 'user']),
        ]);
    }
    
    public function index(Request $request)
    {
        $query = Auth::user()->bookings()
            ->with(['car', 'payment'])
            ->orderBy('created_at', 'desc');
    
        // Add search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('car', function ($q) use ($search) {
                $q->where('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('license_plate', 'like', "%{$search}%");
            });
        }
    
        // Add status filter
        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }
    
        // Paginate with proper meta data
        $bookings = $query->paginate(10)->withQueryString();
    
        return Inertia::render('Booking/Index', [
            'bookings' => $bookings,
            'filters' => [
                'search' => $request->input('search'),
                'status' => $request->input('status', 'all'),
            ],
        ]);
    }
    
    public function cancel(Booking $booking)
    {
        if ($booking->user_id !== Auth::id()) {
            abort(403);
        }
        
        if ($booking->status === 'active') {
            return back()->withErrors(['status' => 'Cannot cancel active rental.']);
        }
        
        $booking->update(['status' => 'cancelled']);
        
        return back()->with('success', 'Booking cancelled successfully.');
    }
}