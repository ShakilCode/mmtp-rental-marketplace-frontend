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
    FaUserFriends
} from "react-icons/fa";

import { NavLink, Routes, Route } from "react-router-dom";

export default function AdminPage() {

    // Sidebar navigation links
    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: <FaTachometerAlt />
        },
        {
            name: "Admin Profile",
            path: "/admin/admin-profile",
            icon: <FaUserCircle />
        },
        {
            name: "View Admins",
            path: "/admin/admins",
            icon: <FaUsers />
        },
        {
            name: "Create Admin",
            path: "/admin/admins/create",
            icon: <FaUserPlus />
        },
        {
            name: "All Users",
            path: "/admin/users",
            icon: <FaUsers />
        },
        {
            name: "Lenders",
            path: "/admin/users/lenders",
            icon: <FaUserTie />
        },
        {
            name: "Renters",
            path: "/admin/users/renters",
            icon: <FaUserFriends />
        },
        {
            name: "All Products",
            path: "/admin/products",
            icon: <FaBoxOpen />
        },
        {
            name: "Pending Products",
            path: "/admin/products/pending",
            icon: <FaClock />
        },
        {
            name: "Approved Products",
            path: "/admin/products/approved",
            icon: <FaCheckCircle />
        },
        {
            name: "Rejected Products",
            path: "/admin/products/rejected",
            icon: <FaTimesCircle />
        },
        {
            name: "Analytics",
            path: "/admin/analytics",
            icon: <FaChartBar />
        },
        {
            name: "Activity Logs",
            path: "/admin/activity-logs",
            icon: <FaHistory />
        },
        {
            name: "Reports",
            path: "/admin/reports",
            icon: <FaFileAlt />
        },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: <FaCog />
        }
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">

            {/* Admin sidebar */}
            <aside className="w-full md:w-72 bg-secondary text-white flex flex-col shrink-0">

                <div className="p-6 border-b border-white/10">

                    <h1 className="text-2xl font-bold">
                        MMTP Admin
                    </h1>

                    <p className="text-primary-200 text-sm mt-1">
                        Administration Panel
                    </p>

                </div>

                {/* Navigation links */}
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

            {/* Admin content */}
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">

                <div className="bg-surface min-h-[calc(100vh-3rem)] rounded-2xl border border-border p-5 sm:p-8 shadow-sm">

                    <Routes>

                        {/* Dashboard */}
                        <Route
                            index
                            element={<h1 className="text-2xl font-bold">Admin Dashboard</h1>}
                        />

                        {/* Admin profile */}
                        <Route
                            path="admin-profile"
                            element={<h1 className="text-2xl font-bold">Admin Profile</h1>}
                        />

                        {/* Admin management */}
                        <Route
                            path="admins"
                            element={<h1 className="text-2xl font-bold">View Admins</h1>}
                        />

                        <Route
                            path="admins/create"
                            element={<h1 className="text-2xl font-bold">Create Admin</h1>}
                        />

                        <Route
                            path="admins/:adminId/activity"
                            element={<h1 className="text-2xl font-bold">Individual Admin Activity</h1>}
                        />

                        {/* User management */}
                        <Route
                            path="users"
                            element={<h1 className="text-2xl font-bold">All Users</h1>}
                        />

                        <Route
                            path="users/lenders"
                            element={<h1 className="text-2xl font-bold">Lenders</h1>}
                        />

                        <Route
                            path="users/renters"
                            element={<h1 className="text-2xl font-bold">Renters</h1>}
                        />

                        <Route
                            path="users/:userId"
                            element={<h1 className="text-2xl font-bold">User Details</h1>}
                        />

                        <Route
                            path="users/:userId/activity"
                            element={<h1 className="text-2xl font-bold">User Activity</h1>}
                        />

                        <Route
                            path="users/:userId/sessions"
                            element={<h1 className="text-2xl font-bold">User Sessions</h1>}
                        />

                        {/* Product management */}
                        <Route
                            path="products"
                            element={<h1 className="text-2xl font-bold">All Products</h1>}
                        />

                        <Route
                            path="products/pending"
                            element={<h1 className="text-2xl font-bold">Pending Products</h1>}
                        />

                        <Route
                            path="products/approved"
                            element={<h1 className="text-2xl font-bold">Approved Products</h1>}
                        />

                        <Route
                            path="products/rejected"
                            element={<h1 className="text-2xl font-bold">Rejected Products</h1>}
                        />

                        <Route
                            path="products/:productId/reviews"
                            element={<h1 className="text-2xl font-bold">Product Reviews</h1>}
                        />

                        {/* Analytics */}
                        <Route
                            path="analytics"
                            element={<h1 className="text-2xl font-bold">Marketplace Analytics</h1>}
                        />

                        {/* Activity logs */}
                        <Route
                            path="activity-logs"
                            element={<h1 className="text-2xl font-bold">Activity Logs</h1>}
                        />

                        {/* Reports */}
                        <Route
                            path="reports"
                            element={<h1 className="text-2xl font-bold">Reports</h1>}
                        />

                        <Route
                            path="reports/:reportId"
                            element={<h1 className="text-2xl font-bold">Report Details</h1>}
                        />

                        {/* Settings */}
                        <Route
                            path="settings"
                            element={<h1 className="text-2xl font-bold">Admin Settings</h1>}
                        />

                    </Routes>

                </div>

            </main>

        </div>
    );
}