import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-primary text-white">

            {/* Navigation Bar */}
            <nav className="flex items-center justify-between px-6 py-5 md:px-12">
                <Link to="/" className="text-2xl font-bold">
                    MMTP
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        to="/products"
                        className="text-gray-300 hover:text-white transition"
                    >
                        Marketplace
                    </Link>

                    <Link
                        to="/login"
                        className="rounded-lg border border-gray-600 px-4 py-2 hover:bg-gray-800 transition"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700 transition"
                    >
                        Register
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">

                <h1 className="mb-6 text-4xl font-bold md:text-6xl">
                    Rent What You Need.
                    <br />
                    <span className="text-blue-500">
                        Share What You Own.
                    </span>
                </h1>

                <p className="mb-8 max-w-2xl text-lg text-gray-400">
                    MMTP connects people who want to rent products with people
                    who have products available for rent. Find affordable rentals
                    or earn money by sharing your belongings.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                    <Link
                        to="/products"
                        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition"
                    >
                        Explore Marketplace
                    </Link>

                    <Link
                        to="/register"
                        className="rounded-lg border border-gray-600 px-6 py-3 font-semibold hover:bg-gray-800 transition"
                    >
                        Become a Lender
                    </Link>
                </div>

            </main>

        </div>
    );
}