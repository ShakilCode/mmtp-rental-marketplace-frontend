import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import VerifyLoginOTPPage from "./pages/auth/VerifyLoginOTPPage";

import RenterDashboard from "./pages/renter/RenterDashboard";
import LenderDashboard from "./pages/lender/LenderDashboard";
import AdminPage from "./pages/admin/AdminPage";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
    return (
        <div className="min-h-screen bg-background text-secondary">

            <Routes>

                {/* Public homepage */}
                <Route path="/" element={<HomePage />} />

                {/* Authentication pages */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/verify-otp" element={<VerifyLoginOTPPage />} />

                {/* Renter dashboard */}
                <Route
                    path="/renter"
                    element={
                        <ProtectedRoute allowedRoles={["renter"]}>
                            <RenterDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Lender dashboard */}
                <Route
                    path="/lender"
                    element={
                        <ProtectedRoute allowedRoles={["lender"]}>
                            <LenderDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Admin panel */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />

                {/* Unknown pages */}
                <Route path="*" element={<HomePage />} />

            </Routes>

        </div>
    );
}

export default App;