"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { Toaster } from "@/Components/ui/toaster";

import {
    Car,
    Calendar,
    CreditCard,
    Users,
    Home,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Settings,
    User,
    Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const { url } = usePage();

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const navItems = [
        {
            name: "Dashboard",
            href: "/admin/dashboard",
            icon: Home,
        },
        {
            name: "Manajemen Mobil",
            href: "/admin/cars",
            icon: Car,
        },
        {
            name: "Manajemen Booking",
            href: "/admin/bookings",
            icon: Calendar,
        },
        // {
        //     name: "Manajemen Pembayaran",
        //     href: "/admin/payments",
        //     icon: CreditCard,
        // },
        // {
        //     name: "Role & User Management",
        //     href: "/admin/users",
        //     icon: Users,
        // },
    ];

    return (
        <div className="min-h-screen bg-zinc-900 text-white">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 transition-transform duration-300 ease-in-out lg:translate-x-0",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Sidebar Header */}
                <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-4">
                    <Link href="/admin/dashboard" className="flex items-center">
                        <span className="text-2xl font-bold">
                            <span className="text-amber-500">REN</span>
                            <span className="text-white">7AL</span>
                        </span>
                        <span className="ml-2 text-xs font-medium text-zinc-400">
                            ADMIN
                        </span>
                    </Link>
                    {isMobile && (
                        <button
                            onClick={toggleSidebar}
                            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Sidebar Navigation */}
                <nav className="mt-4 px-2">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                                        url === item.href ||
                                            url.startsWith(`${item.href}/`)
                                            ? "bg-zinc-800 text-white"
                                            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                    )}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Sidebar Footer */}
                <div className="absolute bottom-0 w-full border-t border-zinc-800 p-4">
                    <Link href="/">
                        <Button
                            variant="outline"
                            className="bg-tranparent w-full justify-start border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Kembali ke Website
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={cn(
                    "transition-margin duration-300 ease-in-out",
                    isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
                )}
            >
                {/* Top Navigation */}
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-700 bg-zinc-800 px-4 shadow-sm">
                    <button
                        onClick={toggleSidebar}
                        className="rounded-md p-2 text-zinc-400 hover:bg-zinc-700 lg:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="flex items-center space-x-4">
                        <button className="relative rounded-full p-1 text-zinc-400 hover:bg-zinc-700">
                            <Bell className="h-5 w-5" />
                            <span className="absolute right-0 top-0 flex h-2 w-2 rounded-full bg-red-500"></span>
                        </button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center space-x-2 rounded-md p-1 text-sm font-medium text-zinc-300 hover:bg-zinc-700">
                                    <div className="relative h-8 w-8 rounded-full bg-zinc-700">
                                        <User className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-zinc-300" />
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <div>Admin User</div>
                                        <div className="text-xs text-zinc-400">
                                            Administrator
                                        </div>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-zinc-400" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link
                                        href={route("home")}
                                        // method="post"
                                        as="button"
                                        className="w-full cursor-pointer flex items-center"
                                    >
                                        <Home className="mr-2 h-4 w-4" />
                                        <span>Home</span>
                                    </Link>
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="w-full cursor-pointer flex items-center"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 md:p-6 text-white">{children}</main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
            <Toaster />
        </div>
    );
}
