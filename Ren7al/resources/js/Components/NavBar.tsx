"use client";

import type React from "react";
import { usePage } from "@inertiajs/react";

import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";

import {
    ChevronDown,
    Phone,
    ShoppingCart,
    User,
    ChevronRight,
    ArrowLeft,
    Settings,
    LogOut,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { route } from "ziggy-js";

export default function Navbar() {
    const { auth } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Check if we're on mobile
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                isMenuOpen &&
                !target.closest("nav") &&
                !target.closest("button")
            ) {
                setIsMenuOpen(false);
                setActiveSubmenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    // Prevent body scroll when menu is open on mobile
    useEffect(() => {
        if (isMobile) {
            if (isMenuOpen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen, isMobile]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (isMenuOpen) {
            setActiveSubmenu(null);
        }
    };

    const openSubmenu = (submenu: string) => {
        if (isMobile) {
            setActiveSubmenu(submenu);
        }
    };

    const goBackToMainMenu = () => {
        setActiveSubmenu(null);
    };

    const url = route().current();

    return (
        <header className="sticky top-0 z-40 w-full bg-zinc-900">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center z-50">
                        <span className="text-2xl font-bold">
                            <span className="text-amber-500">REN</span>
                            <span className="text-white">7AL</span>
                        </span>
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden rounded-md p-2 text-amber-500 hover:bg-zinc-700 focus:outline-none z-50"
                        onClick={toggleMenu}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={
                                    isMenuOpen
                                        ? "M6 18L18 6M6 6l12 12"
                                        : "M4 6h16M4 12h16M4 18h16"
                                }
                            />
                        </svg>
                    </button>

                    {/* Desktop Navigation */}
                    <nav
                        className={cn(
                            "fixed md:relative top-0 right-0 bottom-0 w-64 md:w-auto md:top-0 md:flex bg-zinc-900 md:bg-transparent transition-transform duration-300 ease-in-out z-40",
                            isMenuOpen
                                ? "translate-x-0"
                                : "translate-x-full md:translate-x-0"
                        )}
                    >
                        {/* Mobile Submenu: Cars */}
                        {isMobile && activeSubmenu === "cars" ? (
                            <ul className="flex flex-col h-full py-20 px-4">
                                <li className="mb-6">
                                    <button
                                        onClick={goBackToMainMenu}
                                        className="flex items-center text-white hover:text-amber-500"
                                    ></button>
                                </li>
                                <MobileMenuItem href="/cars/grid">
                                    Car Grid
                                </MobileMenuItem>
                                <MobileMenuItem href="/cars/listing">
                                    Car Listing
                                </MobileMenuItem>
                                <MobileMenuItem href="/cars/types">
                                    Car Types
                                </MobileMenuItem>
                                <MobileMenuItem href="/cars/details">
                                    Car Details
                                </MobileMenuItem>
                            </ul>
                        ) : /* Mobile Submenu: Services */
                        isMobile && activeSubmenu === "services" ? (
                            <ul className="flex flex-col h-full py-20 px-4">
                                <li className="mb-6">
                                    <button
                                        onClick={goBackToMainMenu}
                                        className="flex items-center text-white hover:text-amber-500"
                                    >
                                        <ArrowLeft className="mr-2 h-5 w-5" />
                                    </button>
                                </li>
                                <MobileMenuItem href="/services/rental">
                                    Car Rental
                                </MobileMenuItem>
                                <MobileMenuItem href="/services/chauffeur">
                                    Chauffeur Services
                                </MobileMenuItem>
                                <MobileMenuItem href="/services/airport">
                                    Airport Transfer
                                </MobileMenuItem>
                                <MobileMenuItem href="/services/wedding">
                                    Wedding Transport
                                </MobileMenuItem>
                            </ul>
                        ) : /* Mobile Submenu: Blog */
                        isMobile && activeSubmenu === "blog" ? (
                            <ul className="flex flex-col h-full py-20 px-4">
                                <li className="mb-6">
                                    <button
                                        onClick={goBackToMainMenu}
                                        className="flex items-center text-white hover:text-amber-500"
                                    >
                                        <ArrowLeft className="mr-2 h-5 w-5" />
                                    </button>
                                </li>
                                <MobileMenuItem href="/blog/latest">
                                    Latest Posts
                                </MobileMenuItem>
                                <MobileMenuItem href="/blog/popular">
                                    Popular Posts
                                </MobileMenuItem>
                                <MobileMenuItem href="/blog/categories">
                                    Categories
                                </MobileMenuItem>
                                <MobileMenuItem href="/blog/authors">
                                    Authors
                                </MobileMenuItem>
                            </ul>
                        ) : (
                            /* Main Menu (Mobile and Desktop) */
                            <ul
                                className={cn(
                                    "flex flex-col md:flex-row md:items-center justify-start md:gap-1 lg:gap-14",
                                    isMobile
                                        ? "h-full py-20 px-4"
                                        : "p-4 md:p-0"
                                )}
                            >
                                <NavItem href="/" active={url === "home"}>
                                    Home
                                </NavItem>

                                <NavItem
                                    href="/cars"
                                    active={url?.startsWith("cars") ?? false}
                                    // hasDropdown
                                >
                                    Cars
                                </NavItem>

                                <NavItem
                                    href="/bookings"
                                    active={url?.startsWith("booking") ?? false}
                                >
                                    Bookings
                                </NavItem>
                            </ul>
                        )}
                    </nav>

                    {/* Right side actions */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-6">
                        {/* Cart */}
                        {/* <Link
                            href="/cart"
                            className="text-white hover:text-amber-500"
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </Link> */}

                        {/* Divider */}
                        <div className="h-6 w-px bg-zinc-600"></div>

                        {/* Login */}
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="flex items-center space-x-2 rounded-md p-1 text-sm font-medium text-zinc-300 hover:bg-zinc-700">
                                        <div className="relative h-8 w-8 rounded-full bg-zinc-700">
                                            <User className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-zinc-300" />
                                        </div>
                                        <div className="hidden md:block text-left">
                                            <div>{auth.user.name}</div>
                                            {/* <div className="text-xs text-zinc-400">
                                                {auth.user.roles.includes(
                                                    "admin"
                                                )
                                                    ? "Administrator"
                                                    : "Regular User"}
                                            </div> */}
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-zinc-400" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                >
                                    <DropdownMenuLabel>
                                        My Account
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {auth.user.roles.includes("admin") && (
                                        <DropdownMenuItem>
                                            <Link
                                                href={route("admin.dashboard")}
                                                className="w-full cursor-pointer flex items-center"
                                            >
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

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
                        ) : (
                            // Navbar Item for Guests or Unauthenticated Users
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-white hover:text-amber-500 hover:bg-transparent"
                                    >
                                        <User className="h-5 w-5 mr-2" />
                                        <span className="hidden sm:inline">
                                            Login
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                >
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={route("login")}
                                            className="w-full cursor-pointer"
                                        >
                                            Login
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={route("register")}
                                            className="w-full cursor-pointer"
                                        >
                                            Register
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* Divider */}
                        <div className="h-6 w-px bg-zinc-600"></div>

                        {/* Phone */}
                        <div className="flex items-center">
                            <div className="mr-3 rounded-full border border-amber-500 p-2">
                                <Phone className="h-5 w-5 text-amber-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-zinc-400">
                                    Need help?
                                </span>
                                <span className="text-sm font-medium text-white">
                                    +6289 3939 3939
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile menu */}
            {isMenuOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={toggleMenu}
                />
            )}
        </header>
    );
}

interface NavItemProps {
    href: string;
    children: React.ReactNode;
    active?: boolean;
    hasDropdown?: boolean;
    onClick?: () => void;
}

function NavItem({
    href,
    children,
    active,
    hasDropdown,
    onClick,
}: NavItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (hasDropdown && !isMobile) {
        return (
            <li className="py-2 md:py-0 relative group">
                <button
                    className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium transition-colors w-full justify-between md:justify-start",
                        active
                            ? "text-amber-500"
                            : "text-white hover:text-amber-500"
                    )}
                    onClick={onClick}
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                >
                    {children}
                    <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {isOpen && (
                    <div
                        className="absolute left-0 mt-1 w-56 rounded-none bg-zinc-900 py-2 shadow-lg"
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                    >
                        {children === "Pages" ? (
                            <>
                                <DropdownItem href="/team">Team</DropdownItem>
                                <DropdownItem href="/image-gallery" hasSubmenu>
                                    Image Gallery
                                </DropdownItem>
                                <DropdownItem href="/video-gallery">
                                    Video Gallery
                                </DropdownItem>
                                <DropdownItem href="/pricing">
                                    Pricing Plan
                                </DropdownItem>
                                <DropdownItem href="/faq">FAQ</DropdownItem>
                                <DropdownItem href="/testimonials">
                                    Testimonials
                                </DropdownItem>
                                <DropdownItem href="/team-details">
                                    Team Details
                                </DropdownItem>
                                <DropdownItem href="/404">
                                    404 Page
                                </DropdownItem>
                            </>
                        ) : children === "Services" ? (
                            <>
                                <DropdownItem href="/services/car-rental">
                                    Car Rental
                                </DropdownItem>
                                <DropdownItem href="/services/chauffeur">
                                    Chauffeur Services
                                </DropdownItem>
                                <DropdownItem href="/services/airport">
                                    Airport Transfer
                                </DropdownItem>
                                <DropdownItem href="/services/wedding">
                                    Wedding Transport
                                </DropdownItem>
                                <DropdownItem href="/services/corporate">
                                    Corporate Travel
                                </DropdownItem>
                            </>
                        ) : children === "Cars" ? (
                            <>
                                <DropdownItem href="/cars/grid">
                                    Car Grid
                                </DropdownItem>
                                <DropdownItem href="/cars/listing">
                                    Car Listing
                                </DropdownItem>
                                <DropdownItem href="/cars/types">
                                    Car Types
                                </DropdownItem>
                                <DropdownItem href="/cars/details">
                                    Car Details
                                </DropdownItem>
                            </>
                        ) : children === "Blog" ? (
                            <>
                                <DropdownItem href="/blog/latest">
                                    Latest Posts
                                </DropdownItem>
                                <DropdownItem href="/blog/popular">
                                    Popular Posts
                                </DropdownItem>
                                <DropdownItem href="/blog/categories">
                                    Categories
                                </DropdownItem>
                                <DropdownItem href="/blog/authors">
                                    Authors
                                </DropdownItem>
                            </>
                        ) : null}
                    </div>
                )}
            </li>
        );
    }

    // Mobile version with dropdown or regular nav item
    return (
        <li className="py-2 md:py-0">
            {hasDropdown && isMobile ? (
                <button
                    className={cn(
                        "flex items-center justify-between w-full px-3 py-2 text-sm font-medium transition-colors",
                        active
                            ? "text-amber-500"
                            : "text-white hover:text-amber-500"
                    )}
                    onClick={onClick}
                >
                    <span>{children}</span>
                    <ChevronRight className="h-4 w-4" />
                </button>
            ) : (
                <Link
                    href={href}
                    className={cn(
                        "block px-3 py-2 text-sm font-medium transition-colors",
                        active
                            ? "text-amber-500"
                            : "text-white hover:text-amber-500"
                    )}
                >
                    {children}
                </Link>
            )}
        </li>
    );
}

interface DropdownItemProps {
    href: string;
    children: React.ReactNode;
    hasSubmenu?: boolean;
}

function DropdownItem({ href, children, hasSubmenu }: DropdownItemProps) {
    return (
        <Link
            href={href}
            className="flex items-center justify-between px-4 py-2 text-sm text-white hover:text-amber-500"
        >
            {children}
            {hasSubmenu && <ChevronRight className="h-4 w-4" />}
        </Link>
    );
}

interface MobileMenuItemProps {
    href: string;
    children: React.ReactNode;
}

function MobileMenuItem({ href, children }: MobileMenuItemProps) {
    return (
        <li className="py-2">
            <Link
                href={href}
                className="block px-3 py-2 text-sm font-medium text-white hover:text-amber-500"
            >
                {children}
            </Link>
        </li>
    );
}
