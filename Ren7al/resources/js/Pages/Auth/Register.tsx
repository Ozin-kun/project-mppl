import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { User, Mail, Lock, UserPlus } from "lucide-react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            {/* Header */}
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-white mb-2">
                    Bergabung dengan REN7AL
                </h1>
                <p className="text-zinc-400 text-sm">
                    Buat akun baru untuk mulai menyewa mobil
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                {/* Name Field */}
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="Nama Lengkap"
                        className="text-zinc-200 font-medium"
                    />
                    <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-zinc-400" />
                        </div>
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="block w-full pl-10 pr-3 py-3 bg-zinc-700/50 border border-zinc-600/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                            autoComplete="name"
                            isFocused={true}
                            placeholder="John Doe"
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                    </div>
                    <InputError
                        message={errors.name}
                        className="mt-2 text-red-400"
                    />
                </div>

                {/* Email Field */}
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email Address"
                        className="text-zinc-200 font-medium"
                    />
                    <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-zinc-400" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full pl-10 pr-3 py-3 bg-zinc-700/50 border border-zinc-600/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                            autoComplete="username"
                            placeholder="john@example.com"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                    </div>
                    <InputError
                        message={errors.email}
                        className="mt-2 text-red-400"
                    />
                </div>

                {/* Password Field */}
                <div>
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="text-zinc-200 font-medium"
                    />
                    <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-zinc-400" />
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full pl-10 pr-3 py-3 bg-zinc-700/50 border border-zinc-600/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />
                    </div>
                    <InputError
                        message={errors.password}
                        className="mt-2 text-red-400"
                    />
                </div>

                {/* Confirm Password Field */}
                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Password"
                        className="text-zinc-200 font-medium"
                    />
                    <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-zinc-400" />
                        </div>
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full pl-10 pr-3 py-3 bg-zinc-700/50 border border-zinc-600/50 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                        />
                    </div>
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 text-red-400"
                    />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <PrimaryButton
                        className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={processing}
                    >
                        {processing ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Membuat akun...
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Daftar Sekarang
                            </div>
                        )}
                    </PrimaryButton>
                </div>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-zinc-700/50">
                    <p className="text-sm text-zinc-400">
                        Sudah punya akun?{" "}
                        <Link
                            href={route("login")}
                            className="text-amber-400 hover:text-amber-300 font-medium transition-colors underline"
                        >
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
