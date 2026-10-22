import { Route } from "react-router-dom";

export default function AdminPage() {
    return (
        <div className="w-full h-full border-4 flex">
            <div className="w-[300px] h-full flex flex-col text-white text-xl">
                <h1 className="text-3xl font-bold p-5 border-b-4 border-white">Admin Panel</h1>
            </div>

            <div className="w-[calc(100%-300px)] h-full border-4 rounded-[20px] bg-primary p-4">
                <Routes>
                    {/* Dashboard */}
                    <Route index element={<h1>Admin Dashboard</h1>} />

                    {/* Admin Profile */}
                    <Route path="/admin/admin-profile" element={<h1>Admin Profile</h1>} />

                    {/* Admin Management */}
                    <Route path="/admin/admins" element={<h1>View Admins</h1>} />
                    <Route path="/admin/admins/create" element={<h1>Create Admin</h1>} />
                    <Route path="/admin/admins/:adminId/activity" element={<h1>Individual Admin Activity</h1>} />

                    {/* User Management */}
                    <Route path="/admin/users" element={<h1>All Users</h1>} />
                    <Route path="/admin/users/lenders" element={<h1>Lenders</h1>} />
                    <Route path="/admin/users/renters" element={<h1>Renters</h1>} />
                    <Route path="/admin/users/:userId" element={<h1>User Details</h1>} />
                    <Route path="/admin/users/:userId/activity" element={<h1>User Activity</h1>} />
                    <Route path="/admin/users/:userId/sessions" element={<h1>User Sessions</h1>} />

                    {/* Product Management */}
                    <Route path="/admin/products" element={<h1>All Products</h1>} />
                    <Route path="/admin/products/pending" element={<h1>Pending Products</h1>} />
                    <Route path="/admin/products/approved" element={<h1>Approved Products</h1>} />
                    <Route path="/admin/products/rejected" element={<h1>Rejected Products</h1>} />

                    {/* Individual Product's Reviews */}
                    <Route path="/admin/products/:productId/reviews" element={<h1>Product Reviews</h1>}/>

                    {/* Marketplace Analytics */}
                    <Route path="/admin/analytics" element={<h1>Marketplace Analytics</h1>} />

                    {/* Activity Logs */}
                    <Route path="/admin/activity-logs" element={<h1>Admin Activity Logs</h1>} />

                    {/* Reports */}
                    <Route path="/admin/reports" element={<h1>Reports</h1>} />
                    <Route path="/admin/reports/:reportId" element={<h1>Report Details</h1>} />

                    {/* Settings */}
                    <Route path="/admin/settings" element={<h1>Admin Settings</h1>} />

                </Routes>
            </div>
        </div>
    )
}