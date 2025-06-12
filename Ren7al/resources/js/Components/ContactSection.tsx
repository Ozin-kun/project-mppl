import { Link } from "@inertiajs/react";
import {
    Phone,
    Mail,
    MapPin,
    ArrowRight,
    Facebook,
    Twitter,
} from "lucide-react";
import { Button } from "@/Components/ui/button";

// const quickLinks = [
//     { name: "About", url: "/about" },
//     { name: "Cars", url: "/cars" },
//     { name: "Car Types", url: "/car-types" },
//     { name: "FAQ", url: "/faq" },
//     { name: "Contact", url: "/contact" },
// ];

export default function ContactSection() {
    return (
        <section className="bg-zinc-900 py-12 md:py-16 border-t border-zinc-800">
            <div className="container mx-auto px-4 md:px-6">
                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="flex items-center p-6 bg-zinc-800 rounded-lg">
                        <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center mr-4">
                            <Phone className="h-6 w-6 text-zinc-900" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium mb-1">
                                Call us
                            </h3>
                            <p className="text-zinc-300">+6289 3939 3939</p>
                        </div>
                    </div>

                    <div className="flex items-center p-6 bg-zinc-800 rounded-lg">
                        <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center mr-4">
                            <Mail className="h-6 w-6 text-zinc-900" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium mb-1">
                                Write to us
                            </h3>
                            <p className="text-zinc-300">
                                info@makangratis.com
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center p-6 bg-zinc-800 rounded-lg">
                        <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center mr-4">
                            <MapPin className="h-6 w-6 text-zinc-900" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium mb-1">
                                Address
                            </h3>
                            <p className="text-zinc-300">
                                Kidul Sawah, Pluto, Milky Way
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Company Info */}
                    <div>
                        <Link href="/" className="inline-block mb-6">
                            <span className="text-3xl font-bold">
                                <span className="text-amber-500">REN</span>
                                <span className="text-white">7AL</span>
                            </span>
                        </Link>
                        <p className="text-zinc-400 mb-6">
                            Rent a car imperdiet sapien porttito the bibenum
                            ellentesue the commodo erat nesuen.
                        </p>
                        <div className="flex space-x-4">
                            <Link
                                href="#"
                                className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-amber-500 hover:border-amber-500"
                            >
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#"
                                className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-amber-500 hover:border-amber-500"
                            >
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#"
                                className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-amber-500 hover:border-amber-500"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    {/* <div>
                        <h3 className="text-white text-xl font-bold mb-6">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li
                                    key={link.name}
                                    className="flex items-center"
                                >
                                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                                    <Link
                                        href={link.url}
                                        className="text-zinc-400 hover:text-amber-500"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div> */}

                    {/* Subscribe */}
                    {/* <div>
                        <h3 className="text-white text-xl font-bold mb-6">
                            Subscribe
                        </h3>
                        <p className="text-zinc-400 mb-6">
                            Want to be notified about our services. Just sign up
                            and we'll send you a notification by email.
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-l-full focus:outline-none focus:border-amber-500"
                            />
                            <Button className="bg-amber-500 hover:bg-amber-600 text-zinc-900 rounded-l-none rounded-r-full">
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </div> */}
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-zinc-800 text-center text-zinc-500">
                    <p>© 2025 REN7AL. All rights reserved.</p>
                </div>
            </div>
        </section>
    );
}
