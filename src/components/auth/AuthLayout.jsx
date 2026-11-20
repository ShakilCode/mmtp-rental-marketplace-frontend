import { Link } from "react-router-dom";
import { FaBoxOpen, FaShieldAlt } from "react-icons/fa";

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">

            <div className="w-full max-w-6xl min-h-[650px] bg-surface rounded-3xl shadow-xl border border-border overflow-hidden grid grid-cols-1 lg:grid-cols-2">

                {/* Left side - Marketplace branding */}
                <div className="hidden lg:flex flex-col justify-between bg-secondary text-white p-12 relative overflow-hidden">

                    {/* Decorative background circles */}
                    <div className="absolute w-80 h-80 bg-accent opacity-20 rounded-full -top-20 -right-20"></div>

                    <div className="absolute w-64 h-64 bg-accent opacity-10 rounded-full -bottom-20 -left-20"></div>

                    <div className="relative z-10">

                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white text-2xl">
                                <FaBoxOpen />
                            </div>

                            <span className="text-2xl font-bold">
                                MMTP
                            </span>
                        </Link>

                    </div>

                    <div className="relative z-10 max-w-md">

                        <h1 className="text-4xl font-bold leading-tight mb-6">
                            Rent what you need.
                            <br />
                            Share what you have.
                        </h1>

                        <p className="text-primary-200 text-lg leading-8">
                            Discover a smarter way to rent and share products
                            with people in your community.
                        </p>

                        <div className="mt-10 flex items-center gap-3 text-primary-200">

                            <FaShieldAlt className="text-accent text-xl" />

                            <span>
                                Secure accounts with email verification
                            </span>

                        </div>

                    </div>

                    <div className="relative z-10 text-sm text-primary-200">
                        © {new Date().getFullYear()} MMTP. All rights reserved.
                    </div>

                </div>

                {/* Right side - Authentication form */}
                <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">

                    <div className="w-full max-w-md">

                        {/* Mobile logo */}
                        <Link
                            to="/"
                            className="flex items-center gap-2 mb-8 lg:hidden"
                        >
                            <FaBoxOpen className="text-accent text-3xl" />

                            <span className="text-2xl font-bold text-secondary">
                                MMTP
                            </span>
                        </Link>

                        <div className="mb-8">

                            <h2 className="text-3xl font-bold text-secondary">
                                {title}
                            </h2>

                            <p className="text-muted mt-2">
                                {subtitle}
                            </p>

                        </div>

                        {children}

                    </div>

                </div>

            </div>

        </div>
    );
}