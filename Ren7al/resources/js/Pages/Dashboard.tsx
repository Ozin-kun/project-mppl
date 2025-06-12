import Navbar from "@/Components/NavBar";
import CarCarousel from "@/Components/CarCarousel";
import CarTypes from "@/Components/CarTypes";
import Testimonials from "@/Components/Testimonials";
import CTASection from "@/Components/CTASection";
import BookingForm from "@/Components/BookingForm";
import ContactSection from "@/Components/ContactSection";
import ScrollToTop from "@/Components/ScrollToTop";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";

export default function Welcome() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative w-full min-h-[80vh] bg-zinc-800">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/car1.jpg?height=1080&width=1920"
                            alt="Luxury car background"
                            className="absolute w-full h-full object-cover opacity-70"
                            loading="eager"
                        />
                    </div>

                    {/* Content */}
                    <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col justify-center h-full pt-20 pb-16">
                        <div className="max-w-3xl">
                            {/* <div className="flex items-center mb-4">
                                <div className="h-1 w-6 bg-amber-500 mr-3"></div>
                                <span className="text-amber-500 uppercase text-sm tracking-wider">
                                    Premium
                                </span>
                            </div> */}

                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                                Rental Car
                            </h1>

                            <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
                                <div>
                                    <h2 className="text-xl md:text-2xl text-white mb-2">
                                        Honda Mobilio
                                    </h2>
                                    <div className="flex items-center">
                                        <span className="text-3xl md:text-4xl font-bold text-amber-500">
                                            IDR 420.000
                                        </span>
                                        <span className="text-white text-sm ml-2">
                                            / DAY
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Link href="/cars">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="bg-transparent text-white border-white hover:bg-white hover:text-zinc-900"
                                    >
                                        View Cars
                                    </Button>
                                </Link>
                                <Link href="/cars">
                                    <Button
                                        size="lg"
                                        className="bg-amber-500 text-zinc-900 hover:bg-amber-600"
                                    >
                                        Rent Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Car Carousel Section */}
                {/* <CarCarousel /> */}

                {/* Car Types Section */}
                {/* <CarTypes /> */}

                {/* Testimonials Section */}
                {/* <Testimonials /> */}

                {/* CTA Section */}
                {/* <CTASection /> */}

                {/* Booking Form Section */}
                {/* <BookingForm /> */}

                {/* Contact Section */}
                <ContactSection />
            </main>

            {/* Scroll to Top Button */}
            <ScrollToTop />
        </div>
    );
}
