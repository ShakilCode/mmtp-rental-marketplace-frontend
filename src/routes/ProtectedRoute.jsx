import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, user } = useAuth();

    // Redirect guests to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check whether the user has permission to access this page
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect users to their own dashboard
        if (user.role === "admin") {
            return <Navigate to="/admin" replace />;
        }

        if (user.role === "lender") {
            return <Navigate to="/lender" replace />;
        }

        return <Navigate to="/renter" replace />;
    }

    return children;
}