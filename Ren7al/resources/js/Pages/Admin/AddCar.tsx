"use client";

import { useState, FormEvent } from "react";
import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Upload, X, Check } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import { Card, CardContent } from "@/Components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import { useToast } from "@/Hooks/use-toast";

export default function AddCarPage() {
    const { toast } = useToast();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const currentYear = new Date().getFullYear();

    // Initialize form with Inertia useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        brand: "",
        model: "",
        license_plate: "",
        seats: 5,
        year: currentYear,
        rental_price_per_day: 0,
        description: "",
        is_available: true as boolean,
        image: null as File | null,
    });

    // Handle image upload
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/gif",
            ];
            if (!validTypes.includes(file.type)) {
                toast({
                    title: "Invalid file type",
                    description:
                        "Please upload a JPEG, PNG, JPG, or GIF image.",
                    variant: "destructive",
                });
                return;
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast({
                    title: "File too large",
                    description: "Image size should be less than 2MB.",
                    variant: "destructive",
                });
                return;
            }

            // Set the file in the form data
            setData("image", file);

            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove image preview
    const removeImage = () => {
        setImagePreview(null);
        setData("image", null);
        // Reset the file input
        const fileInput = document.getElementById(
            "car-image"
        ) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleSwitchChange = (checked: boolean) => {
        setData("is_available", checked);
    };

    // Handle form submission
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post(route("admin.cars.store"), {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: `${data.brand} ${data.model} has been added to your fleet.`,
                });
                reset();
                setImagePreview(null);
            },
            onError: () => {
                toast({
                    title: "Error",
                    description:
                        "There was an error adding the car. Please check the form for errors.",
                    variant: "destructive",
                });
            },
        });
    };

    return (
        <AdminLayout>
            <div>
                <div className="mb-6 flex items-center">
                    <Link href="/admin/cars">
                        <Button
                            variant="outline"
                            size="sm"
                            className="mr-4 bg-transparent"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Tambah Mobil Baru</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <Card className="bg-zinc-800 border-zinc-700 text-white">
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="mb-4 text-xl font-semibold text-amber-500">
                                                Informasi Dasar
                                            </h2>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="brand">
                                                        Brand
                                                    </Label>
                                                    <Input
                                                        id="brand"
                                                        placeholder="e.g. Lamborghini"
                                                        className={`bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 ${
                                                            errors.brand
                                                                ? "border-red-500"
                                                                : ""
                                                        }`}
                                                        value={data.brand}
                                                        onChange={(e) =>
                                                            setData(
                                                                "brand",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    {errors.brand && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {errors.brand}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="model">
                                                        Model
                                                    </Label>
                                                    <Input
                                                        id="model"
                                                        placeholder="e.g. Urus"
                                                        className={`bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 ${
                                                            errors.model
                                                                ? "border-red-500"
                                                                : ""
                                                        }`}
                                                        value={data.model}
                                                        onChange={(e) =>
                                                            setData(
                                                                "model",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    {errors.model && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {errors.model}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="license_plate">
                                                        License Plate
                                                    </Label>
                                                    <Input
                                                        id="license_plate"
                                                        placeholder="e.g. AB-123-CD"
                                                        className={`bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 ${
                                                            errors.license_plate
                                                                ? "border-red-500"
                                                                : ""
                                                        }`}
                                                        value={
                                                            data.license_plate
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "license_plate",
                                                                e.target.value.toUpperCase()
                                                            )
                                                        }
                                                    />
                                                    <p className="text-zinc-400 text-xs">
                                                        Must be unique and
                                                        contain only uppercase
                                                        letters, numbers, and
                                                        hyphens.
                                                    </p>
                                                    {errors.license_plate && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {
                                                                errors.license_plate
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="year">
                                                        Year
                                                    </Label>
                                                    <Input
                                                        id="year"
                                                        type="number"
                                                        min={1900}
                                                        max={currentYear + 1}
                                                        className={`bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 ${
                                                            errors.year
                                                                ? "border-red-500"
                                                                : ""
                                                        }`}
                                                        value={data.year}
                                                        onChange={(e) =>
                                                            setData(
                                                                "year",
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                    />
                                                    {errors.year && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {errors.year}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="seats">
                                                        Number of Seats
                                                    </Label>
                                                    <Input
                                                        id="seats"
                                                        type="number"
                                                        min={1}
                                                        max={50}
                                                        className={`bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 ${
                                                            errors.seats
                                                                ? "border-red-500"
                                                                : ""
                                                        }`}
                                                        value={data.seats}
                                                        onChange={(e) =>
                                                            setData(
                                                                "seats",
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                    />
                                                    {errors.seats && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {errors.seats}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-zinc-400">
                                                        Enter the number of
                                                        passenger seats (1-50)
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="rental_price_per_day">
                                                        Rental Price per Day ($)
                                                    </Label>
                                                    <Input
                                                        id="rental_price_per_day"
                                                        type="number"
                                                        min={0}
                                                        step={0.01}
                                                        className={`bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 ${
                                                            errors.rental_price_per_day
                                                                ? "border-red-500"
                                                                : ""
                                                        }`}
                                                        value={
                                                            data.rental_price_per_day
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "rental_price_per_day",
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                    />
                                                    {errors.rental_price_per_day && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {
                                                                errors.rental_price_per_day
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-row items-center justify-between rounded-lg border border-zinc-700 p-3 shadow-sm">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor="is_available">
                                                            Available for Rent
                                                        </Label>
                                                        <p className="text-zinc-400 text-xs">
                                                            Make this car
                                                            available for
                                                            booking
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        id="is_available"
                                                        checked={
                                                            data.is_available
                                                        }
                                                        onCheckedChange={
                                                            handleSwitchChange
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h2 className="mb-4 text-xl font-semibold text-amber-500">
                                                Description
                                            </h2>
                                            <div className="space-y-2">
                                                <Label htmlFor="description">
                                                    Car Description
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    placeholder="Enter a detailed description of the car..."
                                                    className={`bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 min-h-32 ${
                                                        errors.description
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    value={
                                                        data.description || ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "description",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <p className="text-zinc-400 text-xs">
                                                    Provide details about the
                                                    car's features, performance,
                                                    and condition.
                                                </p>
                                                {errors.description && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {errors.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Image Upload */}
                            <Card className="bg-zinc-800 border-zinc-700 text-white">
                                <CardContent className="p-6">
                                    <h2 className="mb-4 text-xl font-semibold text-amber-500">
                                        Car Image
                                    </h2>
                                    {imagePreview ? (
                                        <div className="relative rounded-lg overflow-hidden mb-4">
                                            <img
                                                src={imagePreview}
                                                alt="Car preview"
                                                width={400}
                                                height={300}
                                                className="w-full h-auto object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={removeImage}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-600 bg-zinc-800 p-6 text-center">
                                            <Upload className="mb-2 h-8 w-8 text-zinc-400" />
                                            <p className="mb-2 text-sm font-medium text-zinc-300">
                                                Drag & drop or click to upload
                                            </p>
                                            <p className="text-xs text-zinc-400">
                                                PNG, JPG, JPEG, or GIF (max.
                                                2MB)
                                            </p>
                                            <Label
                                                htmlFor="car-image"
                                                className="mt-4 cursor-pointer rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-amber-600"
                                            >
                                                Upload Image
                                            </Label>
                                            <Input
                                                id="car-image"
                                                type="file"
                                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                            {errors.image && (
                                                <p className="text-red-500 text-xs mt-2">
                                                    {errors.image}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Save Actions */}
                            <Card className="bg-zinc-800 border-zinc-700 text-white">
                                <CardContent className="p-6">
                                    <h2 className="mb-4 text-xl font-semibold text-amber-500">
                                        Actions
                                    </h2>
                                    <div className="space-y-3">
                                        <Button
                                            type="submit"
                                            variant="default"
                                            className="w-full"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <span className="animate-spin mr-2">
                                                        ⏳
                                                    </span>{" "}
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="mr-2 h-4 w-4" />{" "}
                                                    Save Car
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full bg-transparent"
                                            onClick={() => {
                                                reset();
                                                setImagePreview(null);
                                            }}
                                            disabled={processing}
                                        >
                                            Reset Form
                                        </Button>
                                        <Link href="/admin/cars">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                className="w-full"
                                                disabled={processing}
                                            >
                                                Cancel
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
