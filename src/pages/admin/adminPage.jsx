import {
    FaBoxOpen,
    FaChartBar,
    FaCheckCircle,
    FaClock,
    FaCog,
    FaFileAlt,
    FaHistory,
    FaTachometerAlt,
    FaTimesCircle,
    FaUserCircle,
    FaUserPlus,
    FaUsers,
    FaUserTie,
    FaUserFriends,
    FaBan,
} from "react-icons/fa";

import { NavLink, Routes, Route } from "react-router-dom";

import AllProductsPage from "./AllProductsPage";
import PendingProductsPage from "./PendingProductsPage";
import AdminProductDetailsPage from "./AdminProductDetailsPage";

export default function AdminPage() {

    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: <FaTachometerAlt />,
        },
        {
            name: "Admin Profile",
            path: "/admin/admin-profile",
            icon: <FaUserCircle />,
        },
        {
            name: "View Admins",
            path: "/admin/admins",
            icon: <FaUsers />,
        },
        {
            name: "Create Admin",
            path: "/admin/admins/create",
            icon: <FaUserPlus />,
        },
        {
            name: "All Users",
            path: "/admin/users",
            icon: <FaUsers />,
        },
        {
            name: "Lenders",
            path: "/admin/users/lenders",
            icon: <FaUserTie />,
        },
        {
            name: "Renters",
            path: "/admin/users/renters",
            icon: <FaUserFriends />,
        },
        {
            name: "All Products",
            path: "/admin/products",
            icon: <FaBoxOpen />,
        },
        {
            name: "Pending Products",
            path: "/admin/products/pending",
            icon: <FaClock />,
        },
        {
            name: "Approved Products",
            path: "/admin/products/approved",
            icon: <FaCheckCircle />,
        },
        {
            name: "Rejected Products",
            path: "/admin/products/rejected",
            icon: <FaTimesCircle />,
        },
        {
            name: "Suspended Products",
            path: "/admin/products/suspended",
            icon: <FaBan />,
        },
        {
            name: "Analytics",
            path: "/admin/analytics",
            icon: <FaChartBar />,
        },
        {
            name: "Activity Logs",
            path: "/admin/activity-logs",
            icon: <FaHistory />,
        },
        {
            name: "Reports",
            path: "/admin/reports",
            icon: <FaFileAlt />,
        },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: <FaCog />,
        },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">

            {/* Sidebar */}
            <aside className="w-full md:w-72 bg-secondary text-white flex flex-col shrink-0">

                <div className="p-6 border-b border-white/10">

                    <h1 className="text-2xl font-bold">
                        MMTP Admin
                    </h1>

                    <p className="text-primary-200 text-sm mt-1">
                        Administration Panel
                    </p>

                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">

                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/admin"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                                    isActive
                                        ? "bg-accent text-white"
                                        : "text-primary-100 hover:bg-white/10"
                                }`
                            }
                        >

                            <span className="text-lg">
                                {item.icon}
                            </span>

                            <span className="text-sm font-medium">
                                {item.name}
                            </span>

                        </NavLink>
                    ))}

                </nav>

            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">

                <div className="bg-surface min-h-[calc(100vh-3rem)] rounded-2xl border border-border p-5 sm:p-8 shadow-sm">

                    <Routes>

                        {/* Dashboard */}
                        <Route
                            index
                            element={
                                <div>
                                    <h1 className="text-2xl font-bold">
                                        Admin Dashboard
                                    </h1>

                                    <p className="text-muted mt-3">
                                        Welcome to the MMTP administration panel.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">

                                        <NavLink
                                            to="/admin/products"
                                            className="border border-border p-5 rounded-xl hover:shadow-sm"
                                        >
                                            <h2 className="font-semibold">
                                                Product management
                                            </h2>

                                            <p className="text-muted mt-2 text-sm">
                                                Manage listings and review product submissions.
                                            </p>
                                        </NavLink>

                                        <NavLink
                                            to="/admin/products/pending"
                                            className="border border-border p-5 rounded-xl hover:shadow-sm"
                                        >
                                            <h2 className="font-semibold">
                                                Pending reviews
                                            </h2>

                                            <p className="text-muted mt-2 text-sm">
                                                Review new products and proposed changes.
                                            </p>
                                        </NavLink>

                                    </div>
                                </div>
                            }
                        />

                        {/* Admin profile */}
                        <Route
                            path="admin-profile"
                            element={
                                <h1 className="text-2xl font-bold">
                                    Admin Profile
                                </h1>
                            }
                        />

                        {/* Admin management */}
                        <Route
                            path="admins"
                            element={
                                <h1 className="text-2xl font-bold">
                                    View Admins
                                </h1>
                            }
                        />

                        <Route
                            path="admins/create"
                            element={
                                <h1 className="text-2xl font-bold">
                                    Create Admin
                                </h1>
                            }
                        />

                        <Route
                            path="admins/:adminId/activity"
                            element={
                                <h1 className="text-2xl font-bold">
                                    Individual Admin Activity
                                </h1>
                            }
                        />

                        {/* User management */}
                        <Route
                            path="users"
                            element={
                                <h1 className="text-2xl font-bold">
                                    All Users
                                </h1>
                            }
                        />

                        <Route
                            path="users/lenders"
                            element={
                                <h1 className="text-2xl font-bold">
                                    Lenders
                                </h1>
                            }
                        />

                        <Route
                            path="users/renters"
                            element={
                                <h1 className="text-2xl font-bold">
                                    Renters
                                </h1>
                            }
                        />

                        <Route
                            path="users/:userId"
                            element={
                                <h1 className="text-2xl font-bold">
                                    User Details
                                </h1>
                            }
                        />

                        <Route
                            path="users/:userId/activity"
                            element={
                                <h1 className="text-2xl font-bold">
                                    User Activity
                                </h1>
                            }
                        />

                        <Route
                            path="users/:userId/sessions"
                            element={
                                <h1 className="text-2xl font-bold">
                                    User Sessions
                                </h1>
                            }
                        />

                        {/* Product management */}
                        <Route
                            path="products"
                            element={<AllProductsPage />}
                        />

                        <Route
                            path="products/pending"
                            element={<PendingProductsPage />}
                        />

                        <Route
                            path="products/approved"
                            element={<AllProductsPage initialStatus="approved" />}
                        />

                        <Route
                            path="products/rejected"
                            element={<AllProductsPage initialStatus="rejected" />}
                        />

                        <Route
                            path="products/suspended"
                            element={<AllProductsPage initialStatus="suspended" />}
                        />

                        <Route
                            path="products/:productId"
                            element={<AdminProductDetailsPage />}
                        />

                        {/* Analytics */}
                        <Route
                            path="analytics"
                            element={
                                <h1 className="text-2xl font-bold">
                                    Marketplace Analytics
                                </h1>
                            }
                        />

                        {/* Activity logs */}
                        <Route
                            path="activity-logs"
                            element={
                                <h1 className="text-2xl font-bold">
                                    Activity Logs
                                </h1>
                            }
                        />

                        {/* Reports */}
                        <Route
                            path="reports"
                            element={
                                <h1 className="text-2xl font-bold">
                                    Reports
                                </h1>
                            }
                        />

                        <Route
                            path="reports/:reportId"
                            element={
                                <h1 className="text-2xl font-bold">
                                    Report Details
                                </h1>
                            }
                        />

                        {/* Settings */}
                        <Route
                            path="settings"
                            element={
                                <h1 className="text-2xl font-bold">
                                    Admin Settings
                                </h1>
                            }
                        />

                    </Routes>

                </div>

            </main>

        </div>
    );
}