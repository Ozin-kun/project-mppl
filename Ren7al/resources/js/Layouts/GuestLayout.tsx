import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>

            {/* Logo */}
            <div className="mb-8">
                <Link href="/" className="flex items-center">
                    <span className="text-4xl font-bold">
                        <span className="text-amber-500">REN</span>
                        <span className="text-white">7AL</span>
                    </span>
                </Link>
                <p className="text-zinc-400 text-center text-sm mt-2">
                    Car Rental Service
                </p>
            </div>

            {/* Card Container */}
            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-zinc-800/80 backdrop-blur-sm shadow-2xl overflow-hidden sm:rounded-2xl border border-zinc-700/50">
                <div className="relative z-10">{children}</div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl"></div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
                <p className="text-zinc-500 text-sm">
                    © 2024 REN7AL. All rights reserved.
                </p>
            </div>
        </div>
    );
}
