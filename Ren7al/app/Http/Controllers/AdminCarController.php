<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Car;
use App\Http\Resources\CarResource;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class AdminCarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $search = $request->input('search');
    
    $query = Car::query();
    
    // Apply search filter server-side
    if ($search) {
        $query->where(function($q) use ($search) {
            $q->where('brand', 'like', "%{$search}%")
              ->orWhere('model', 'like', "%{$search}%")
              ->orWhere('license_plate', 'like', "%{$search}%")
              ->orWhere('year', 'like', "%{$search}%");
        });
    }
    
    // Apply any other filters you need
    
    $cars = $query->orderBy('created_at', 'desc')
                  ->paginate(10)
                  ->withQueryString();
    
    return Inertia::render("Admin/Cars", [
        'cars' => $cars,
        'filters' => [
            'search' => $search,
        ],
        'flash' => [
            'success' => session('success'),
            'error' => session('error'),
        ],
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    
/**
 * Show the form for creating a new resource.
 */
    public function create()
    {
        return Inertia::render('Admin/AddCar', [
            'car' => new Car(),
        ]);
    }

/**
 * Store a newly created resource in storage.
 */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'license_plate' => 'required|string|max:20|unique:cars,license_plate',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'seats' => 'required|integer|min:1|max:50',
            'rental_price_per_day' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_available' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('cars', 'public');
            $validated['image'] = $imagePath;
        }

        // Set default availability if not provided
        if (!isset($validated['is_available'])) {
            $validated['is_available'] = true;
        }

        // Create the car
        Car::create($validated);

        // Return a response
        return redirect()->route('admin.cars')->with('success', 'Mobil berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    
// AdminCarController.php

// ... (use statements dan method index, create, store) ...

/**
 * Show the form for editing the specified resource.
 */
public function edit(Car $car) // Route model binding
{
    return Inertia::render('Admin/EditCar', [ // Buat halaman Edit.tsx
        'car' => new CarResource($car), // Kirim data mobil yang akan diedit
    ]);
}

/**
 * Update the specified resource in storage.
 */
public function update(Request $request, Car $car) // Route model binding
{
    $validated = $request->validate([
        'brand' => 'required|string|max:255',
        'model' => 'required|string|max:255',
        // Validasi license_plate unik, tapi abaikan mobil saat ini
        'license_plate' => 'required|string|max:20|unique:cars,license_plate,' . $car->id,
        'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
        'seats' => 'required|integer|min:1|max:50',
        'rental_price_per_day' => 'required|numeric|min:0',
        'description' => 'nullable|string',
        'is_available' => 'boolean',
        // Image bisa nullable karena mungkin tidak diubah
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    // Handle image update
    if ($request->hasFile('image')) {
        // Hapus gambar lama jika ada dan gambar baru diupload
        if ($car->image) {
            Storage::disk('public')->delete($car->image);
        }
        $imagePath = $request->file('image')->store('cars', 'public');
        $validated['image'] = $imagePath;
    } else {
        // Jika tidak ada gambar baru, jangan ubah field image
        unset($validated['image']);
    }

    $car->update($validated);

    return redirect()->route('admin.cars')->with('success', 'Mobil berhasil diperbarui.');
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Car $car)
    {
        try {
            // Check if car has associated bookings
            $hasBookings = $car->bookings()->exists();
            
            if ($hasBookings) {
                return redirect()->route('admin.cars')
                    ->with('error', 'Mobil ini tidak dapat dihapus karena memiliki booking terkait.');
            }
            
            // Delete associated image if exists
            if ($car->image) {
                Storage::disk('public')->delete($car->image);
            }
            
            $carInfo = $car->brand . ' ' . $car->model;
            $car->delete();
            
            return redirect()->route('admin.cars')
                ->with('success', "Mobil {$carInfo} berhasil dihapus.");
            
        } catch (\Exception $e) {
            Log::error('Error deleting car: ' . $e->getMessage());
            return redirect()->route('admin.cars')
                ->with('error', 'Terjadi kesalahan saat menghapus mobil.');
        }
    }
}
