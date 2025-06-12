import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Mail, Lock, LogIn } from "lucide-react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Header */}
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-white mb-2">
                    Selamat Datang Kembali
                </h1>
                <p className="text-zinc-400 text-sm">
                    Masuk ke akun REN7AL Anda
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
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
                            className="block w-full pl-10 pr-3 py-3 bg-zinc-700/50 border border-zinc-600/50 rounded-lg text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                            autoComplete="username"
                            isFocused={true}
                            placeholder="masukkan email anda"
                            onChange={(e) => setData("email", e.target.value)}
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
                            autoComplete="current-password"
                            placeholder="masukkan password anda"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                    </div>
                    <InputError
                        message={errors.password}
                        className="mt-2 text-red-400"
                    />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    "remember",
                                    (e.target.checked || false) as false
                                )
                            }
                            className="rounded border-zinc-600 bg-zinc-700/50 text-amber-500 focus:ring-amber-500/50"
                        />
                        <span className="ms-2 text-sm text-zinc-300">
                            Ingat saya
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm text-amber-400 hover:text-amber-300 transition-colors underline"
                        >
                            Lupa password?
                        </Link>
                    )}
                </div>

                {/* Submit Button */}
                <div>
                    <PrimaryButton
                        className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={processing}
                    >
                        {processing ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Memproses...
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <LogIn className="h-4 w-4 mr-2" />
                                Masuk
                            </div>
                        )}
                    </PrimaryButton>
                </div>

                {/* Register Link */}
                <div className="text-center pt-4 border-t border-zinc-700/50">
                    <p className="text-sm text-zinc-400">
                        Belum punya akun?{" "}
                        <Link
                            href={route("register")}
                            className="text-amber-400 hover:text-amber-300 font-medium transition-colors underline"
                        >
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
