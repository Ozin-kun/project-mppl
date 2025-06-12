<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\BookingResource;
use Illuminate\Support\Facades\Log;

class AdminBookingController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->input('status');
        $search = $request->input('search');
        
        $query = Booking::with(['user', 'car', 'payment']);
        
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->whereHas('user', function($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%")
                             ->orWhere('email', 'like', "%{$search}%");
                })->orWhereHas('car', function($carQuery) use ($search) {
                    $carQuery->where('brand', 'like', "%{$search}%")
                            ->orWhere('model', 'like', "%{$search}%")
                            ->orWhere('license_plate', 'like', "%{$search}%");
                })->orWhere('id', 'like', "%{$search}%");
            });
        }
        
        // Use paginate() instead of simplePaginate() to get proper links array
        $bookings = $query->orderBy('created_at', 'desc')
                         ->paginate(15)
                         ->withQueryString();
        
        return Inertia::render('Admin/Bookings', [
            'bookings' => $bookings, // Send the whole paginator object like cars
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            // Add flash messages like in AdminCarController
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }
    
    public function show(Booking $booking)
    {
        return Inertia::render('Admin/Bookings/Show', [
            'booking' => new BookingResource($booking->load(['user', 'car', 'payment']))
        ]);
    }
    
    public function updateStatus(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);
        
        $oldStatus = $booking->status;
        $booking->update(['status' => $validated['status']]);
        
        // Handle status changes
        if ($validated['status'] === 'confirmed' && $oldStatus === 'pending') {
            $this->handleBookingConfirmation($booking);
        } elseif ($validated['status'] === 'cancelled') {
            $this->handleBookingCancellation($booking);
        }
        
        // Redirect with flash message like in cars controller
        return redirect()->route('admin.bookings')
            ->with('success', 'Status booking berhasil diperbarui.');
    }
    
    private function handleBookingConfirmation(Booking $booking)
    {
        // Update payment status if payment exists
        if ($booking->payment) {
            $booking->payment->update([
                'payment_status' => 'confirmed',
                'paid_at' => now()
            ]);
        }
        
        // Send confirmation email
        // Mail::to($booking->user->email)->send(new BookingConfirmed($booking));
        
        // Log activity
        Log::info("Booking {$booking->id} confirmed by admin");
    }
    
    private function handleBookingCancellation(Booking $booking)
    {
        // Update payment status if payment exists
        if ($booking->payment) {
            $booking->payment->update(['payment_status' => 'refunded']);
        }
        
        // Process refund if payment was made
        // $this->processRefund($booking);
        
        // Send cancellation email
        // Mail::to($booking->user->email)->send(new BookingCancelled($booking));
        
        Log::info("Booking {$booking->id} cancelled by admin");
    }
}