import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import VerifyLoginOTPPage from "./pages/auth/VerifyLoginOTPPage";

import PublicProductsPage from "./pages/products/PublicProductsPage";
import ProductDetailsPage from "./pages/products/ProductDetailsPage";

import RenterDashboard from "./pages/renter/RenterDashboard";

import LenderDashboard from "./pages/lender/LenderDashboard";
import MyProductsPage from "./pages/lender/MyProductsPage";
import AddProductPage from "./pages/lender/AddProductPage";
import EditProductPage from "./pages/lender/EditProductPage";
import LenderProductDetailsPage from "./pages/lender/LenderProductDetailsPage";

import AdminPage from "./pages/admin/AdminPage";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
    return (
        <div className="min-h-screen bg-background text-secondary">

            <Routes>

                {/* Public homepage */}
                <Route
                    path="/"
                    element={<HomePage />}
                />

                {/* Public marketplace */}
                <Route
                    path="/products"
                    element={<PublicProductsPage />}
                />

                <Route
                    path="/products/:productId"
                    element={<ProductDetailsPage />}
                />

                {/* Authentication */}
                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="/verify-email"
                    element={<VerifyEmailPage />}
                />

                <Route
                    path="/verify-otp"
                    element={<VerifyLoginOTPPage />}
                />

                {/* Renter */}
                <Route
                    path="/renter"
                    element={
                        <ProtectedRoute allowedRoles={["renter"]}>
                            <RenterDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Lender */}
                <Route
                    path="/lender"
                    element={
                        <ProtectedRoute allowedRoles={["lender"]}>
                            <LenderDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/lender/products"
                    element={
                        <ProtectedRoute allowedRoles={["lender"]}>
                            <MyProductsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/lender/products/add"
                    element={
                        <ProtectedRoute allowedRoles={["lender"]}>
                            <AddProductPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/lender/products/:productId"
                    element={
                        <ProtectedRoute allowedRoles={["lender"]}>
                            <LenderProductDetailsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/lender/products/:productId/edit"
                    element={
                        <ProtectedRoute allowedRoles={["lender"]}>
                            <EditProductPage />
                        </ProtectedRoute>
                    }
                />

                {/* Admin */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />

                {/* Unknown route */}
                <Route
                    path="*"
                    element={<HomePage />}
                />

            </Routes>

        </div>
    );
}

export default App;