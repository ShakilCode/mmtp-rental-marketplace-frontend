import { Link } from "react-router-dom";
import {
    FaSearch,
    FaUserCircle,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

export default function RenterDashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6">

            <div className="max-w-7xl mx-auto">

                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Renter Dashboard
                        </h1>

                        <p className="text-muted mt-2">
                            Welcome, {user?.firstName}!
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="bg-red-600 text-white px-5 py-3 rounded-xl"
                    >
                        Logout
                    </button>

                </div>

                <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">

                    <h2 className="text-xl font-semibold">
                        Welcome to MMTP
                    </h2>

                    <p className="text-muted mt-2">
                        Discover products available for rental.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

                        <Link
                            to="/products"
                            className="border border-border rounded-2xl p-6 hover:shadow-md transition"
                        >

                            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-xl">
                                <FaSearch />
                            </div>

                            <h3 className="font-semibold text-lg mt-4">
                                Browse Products
                            </h3>

                            <p className="text-muted mt-2">
                                Search, filter and discover products available in your area.
                            </p>

                        </Link>

                        <Link
                            to="/renter"
                            className="border border-border rounded-2xl p-6 hover:shadow-md transition"
                        >

                            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-xl">
                                <FaUserCircle />
                            </div>

                            <h3 className="font-semibold text-lg mt-4">
                                My Account
                            </h3>

                            <p className="text-muted mt-2">
                                Your account information and renter dashboard.
                            </p>

                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}