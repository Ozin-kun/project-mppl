import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import {
    Car,
    Calendar,
    CreditCard,
    Users,
    TrendingUp,
    TrendingDown,
    Activity,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";

interface Stats {
    totalCars: number;
    availableCars: number;
    totalBookings: number;
    todayBookings: number;
    totalRevenue: number;
    monthlyRevenue: number;
    totalUsers: number;
    pendingPayments: number;
}

interface Booking {
    id: number;
    user_name: string;
    car_name: string;
    status: string;
    total_amount: number;
    created_at: string;
}

interface WeeklyData {
    week: string;
    bookings: number;
    revenue: number;
}

interface AdminDashboardProps {
    stats: Stats;
    recentBookings: Booking[];
    weeklyData: WeeklyData[];
}

export default function AdminDashboard({
    stats,
    recentBookings,
    weeklyData,
}: AdminDashboardProps) {
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const statCards = [
        {
            title: "Total Mobil",
            value: stats.totalCars,
            subtitle: `${stats.availableCars} tersedia`,

            color: "from-blue-500 to-blue-600",
        },
        {
            title: "Total Booking",
            value: stats.totalBookings,
            subtitle: `${stats.todayBookings} hari ini`,

            color: "from-emerald-500 to-emerald-600",
        },
        {
            title: "Total Revenue",
            value: formatRupiah(stats.totalRevenue),
            subtitle: `${formatRupiah(stats.monthlyRevenue)} bulan ini`,

            color: "from-amber-500 to-amber-600",
        },
        {
            title: "Total Users",
            value: stats.totalUsers,
            subtitle: `${stats.pendingPayments} pending payment`,

            color: "from-purple-500 to-purple-600",
        },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Dashboard Admin
                        </h1>
                        <p className="text-zinc-400 mt-1">
                            Selamat datang kembali! Berikut ringkasan aktivitas
                            sistem.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-zinc-400">
                        <Activity className="h-4 w-4" />
                        <span>
                            Last updated:{" "}
                            {new Date().toLocaleTimeString("id-ID")}
                        </span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden rounded-xl bg-zinc-800 border border-zinc-700 p-6 transition-all hover:bg-zinc-750 hover:border-zinc-600"
                        >
                            {/* Background Gradient */}
                            <div
                                className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.color} opacity-10 rounded-full -mr-10 -mt-10`}
                            ></div>

                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-zinc-400 text-sm font-medium">
                                        {card.title}
                                    </p>
                                    <p className="text-2xl font-bold text-white mt-1">
                                        {card.value}
                                    </p>
                                    <p className="text-zinc-500 text-xs mt-1">
                                        {card.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Weekly Chart - 2/3 width */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl bg-zinc-800 border border-zinc-700 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">
                                        Laporan Mingguan
                                    </h3>
                                    <p className="text-zinc-400 text-sm">
                                        Booking dan revenue 4 minggu terakhir
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                                        <span className="text-zinc-400">
                                            Bookings
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                                        <span className="text-zinc-400">
                                            Revenue
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={weeklyData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#374151"
                                        />
                                        <XAxis
                                            dataKey="week"
                                            stroke="#9CA3AF"
                                            fontSize={12}
                                        />
                                        <YAxis stroke="#9CA3AF" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#1F2937",
                                                border: "1px solid #374151",
                                                borderRadius: "8px",
                                                color: "#F9FAFB",
                                            }}
                                            formatter={(value, name) => [
                                                name === "revenue"
                                                    ? formatRupiah(
                                                          Number(value)
                                                      )
                                                    : value,
                                                name === "revenue"
                                                    ? "Revenue"
                                                    : "Bookings",
                                            ]}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="bookings"
                                            stroke="#F59E0B"
                                            strokeWidth={3}
                                            dot={{
                                                fill: "#F59E0B",
                                                strokeWidth: 2,
                                                r: 4,
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10B981"
                                            strokeWidth={3}
                                            dot={{
                                                fill: "#10B981",
                                                strokeWidth: 2,
                                                r: 4,
                                            }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity - 1/3 width */}
                    <div className="lg:col-span-1">
                        <div className="rounded-xl bg-zinc-800 border border-zinc-700 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-white">
                                    Aktivitas Terbaru
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {recentBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between p-4 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-600 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`w-3 h-3 rounded-full ${
                                                    booking.status ===
                                                    "confirmed"
                                                        ? "bg-emerald-500"
                                                        : booking.status ===
                                                          "pending"
                                                        ? "bg-amber-500"
                                                        : "bg-red-500"
                                                }`}
                                            ></div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-white truncate">
                                                    {booking.car_name}
                                                </p>
                                                <p className="text-sm text-zinc-400 truncate">
                                                    by {booking.user_name}
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    {new Date(
                                                        booking.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-2 ">
                                <button className="w-full text-center text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors">
                                    Lihat Semua Booking →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
