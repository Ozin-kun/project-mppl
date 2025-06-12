<?php

use App\Http\Controllers\AdminDashboardController; // Ensure this controller exists in the specified namespace
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminBookingController;


Route::middleware(['auth', "role:admin"])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    // Route::redirect("/admin", "/admin/dashboard");
    Route::get('/users', function () {
        return Inertia::render('Admin/Users');
    })->name('admin.users');

    Route::get('/cars', [\App\Http\Controllers\AdminCarController::class, 'index'])->name('admin.cars');
    Route::get('/cars/create', [\App\Http\Controllers\AdminCarController::class, 'create'])->name('admin.cars.create');
    Route::post('/cars', [\App\Http\Controllers\AdminCarController::class, 'store'])->name('admin.cars.store');
    Route::get('/bookings', [\App\Http\Controllers\AdminBookingController::class, 'index'])->name('admin.bookings');
    Route::get('/bookings/{booking}', [AdminBookingController::class, 'show'])->name('admin.bookings.show');
    Route::patch('/bookings/{booking}/status', [AdminBookingController::class, 'updateStatus'])->name('admin.bookings.update-status');
    Route::get('/cars/{car}/edit', [\App\Http\Controllers\AdminCarController::class, 'edit'])->name('admin.cars.edit'); // Route untuk halaman edit
    Route::put('/cars/{car}', [\App\Http\Controllers\AdminCarController::class, 'update'])->name('admin.cars.update');
    Route::delete('/cars/{car}', [\App\Http\Controllers\AdminCarController::class, 'destroy'])->name('admin.cars.destroy');
    // Route::get('/bookings', function () {
    //     return Inertia::render('Admin/Bookings');
    // })->name('admin.bookings');
    // Route::get('/payments', function () {
    //     return Inertia::render('Admin/Payments');
    // })->name('admin.payments');
});

Route::middleware(["auth","verified","role:admin"])->group(function () {
    Route::redirect("/admin", "/admin/dashboard");
});