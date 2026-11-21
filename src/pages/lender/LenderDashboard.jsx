import { Link } from "react-router-dom";
import {
    FaBoxOpen,
    FaPlus,
    FaClipboardList,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

export default function LenderDashboard() {
    const { user, logout } = useAuth();

    const actions = [
        {
            title: "My Products",
            description: "View and manage all your rental listings.",
            icon: <FaBoxOpen />,
            path: "/lender/products",
        },
        {
            title: "Add Product",
            description: "Submit a new product for admin approval.",
            icon: <FaPlus />,
            path: "/lender/products/add",
        },
    ];

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6">

            <div className="max-w-7xl mx-auto">

                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Lender Dashboard
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
                        Manage your rental business
                    </h2>

                    <p className="text-muted mt-2">
                        Add products, manage listings and monitor product approvals.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

                        {actions.map((action) => (
                            <Link
                                key={action.path}
                                to={action.path}
                                className="border border-border rounded-2xl p-6 hover:shadow-md transition"
                            >

                                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-xl">
                                    {action.icon}
                                </div>

                                <h3 className="font-semibold text-lg mt-4">
                                    {action.title}
                                </h3>

                                <p className="text-muted mt-2">
                                    {action.description}
                                </p>

                            </Link>
                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}