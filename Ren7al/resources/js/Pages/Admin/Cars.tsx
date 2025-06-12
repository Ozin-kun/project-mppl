"use client";

import { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import AdminLayout from "@/Layouts/AdminLayout";
import CarTable from "@/Components/Admin/CarTable";
import { Car } from "@/types/car";
import { useToast } from "@/Hooks/use-toast";

interface CarsGridProps {
    cars: {
        // Objek 'cars' ini adalah objek paginator dari Laravel
        data: Car[];
        current_page: number;
        from: number | null; // 'from' bisa null jika tidak ada data
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        path: string;
        per_page: number;
        to: number | null; // 'to' bisa null jika tidak ada data
        total: number;
        // Anda mungkin juga memiliki next_page_url, prev_page_url, dll.
    };
    filters: {
        search: string; // Untuk menyimpan nilai filter pencarian
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function AdminCarsPage({ cars, filters, flash }: CarsGridProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    console.log(cars.links);

    const handleDeleteClick = (car: Car) => {
        setSelectedCar(car);
        setDeleteDialogOpen(true);
    };

    useEffect(() => {
        if (flash?.success) {
            toast({
                title: "Success",
                description: flash.success,
            });
        }

        if (flash?.error) {
            toast({
                title: "Error",
                description: flash.error,
                variant: "destructive",
            });
        }
    }, [flash, toast]);

    const handleDeleteConfirm = () => {
        if (selectedCar && !isDeleting) {
            setIsDeleting(true);

            router.delete(route("admin.cars.destroy", selectedCar.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setSelectedCar(null);
                    setIsDeleting(false);
                    // Flash message ditangani oleh useEffect
                },
                onError: (errors) => {
                    setIsDeleting(false);
                    setDeleteDialogOpen(false);

                    if (errors.delete) {
                        toast({
                            title: "Cannot Delete Car",
                            description: errors.delete,
                            variant: "destructive",
                        });
                    } else {
                        toast({
                            title: "Error",
                            description:
                                "There was an error deleting the car. Please try again.",
                            variant: "destructive",
                        });
                    }
                },
                onFinish: () => {
                    setIsDeleting(false);
                },
            });
        }
    };

    return (
        <AdminLayout>
            <div>
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manajemen Mobil</h1>
                    <Link href={route("admin.cars.create")}>
                        <Button variant="default">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Mobil
                        </Button>
                    </Link>
                </div>

                <CarTable
                    cars={cars}
                    filters={filters}
                    onDeleteClick={handleDeleteClick}
                />

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <DialogContent className="bg-zinc-800 text-white border-zinc-700">
                        <DialogHeader>
                            <DialogTitle>Konfirmasi Hapus Mobil</DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                Apakah Anda yakin ingin menghapus{" "}
                                {selectedCar?.brand} {selectedCar?.model}?
                                Tindakan ini tidak dapat dibatalkan.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex space-x-2 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteDialogOpen(false)}
                                className="bg-transparent border-zinc-600"
                            >
                                Batal
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteConfirm}
                            >
                                Hapus Mobil
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
