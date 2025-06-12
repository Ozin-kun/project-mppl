<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Car;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            // Cars
            'totalCars' => Car::count(),
            'availableCars' => Car::where('is_available', true)->count(),
            
            // Bookings
            'totalBookings' => Booking::count(),
            'todayBookings' => Booking::whereDate('created_at', today())->count(),
            
            // Revenue
            'totalRevenue' => Payment::where('payment_status', 'paid')->sum('amount'),
            'monthlyRevenue' => Payment::where('payment_status', 'paid')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('amount'),
            
            // Users & Payments
            'totalUsers' => User::where('email', '!=', 'admin@carrental.com')->count(),
            'pendingPayments' => Payment::where('payment_status', 'pending')->count(),
        ];

        $recentBookings = Booking::with(['user', 'car', 'payment'])
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'user_name' => $booking->user->name,
                    'car_name' => "{$booking->car->brand} {$booking->car->model}",
                    'status' => $booking->status,
                    'total_amount' => $booking->total_amount,
                    'created_at' => $booking->created_at->toISOString(),
                ];
            });

        // Weekly data for chart (last 4 weeks)
        $weeklyData = collect();
        for ($i = 3; $i >= 0; $i--) {
            $startOfWeek = Carbon::now()->subWeeks($i)->startOfWeek();
            $endOfWeek = Carbon::now()->subWeeks($i)->endOfWeek();
            
            $weekBookings = Booking::whereBetween('created_at', [$startOfWeek, $endOfWeek])->count();
            $weekRevenue = Payment::where('payment_status', 'paid')
                ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
                ->sum('amount');
            
            $weeklyData->push([
                'week' => $startOfWeek->format('d M'),
                'bookings' => $weekBookings,
                'revenue' => (int) $weekRevenue,
            ]);
        }

        return Inertia::render('Admin/AdminDashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
            'weeklyData' => $weeklyData,
        ]);
    }
}