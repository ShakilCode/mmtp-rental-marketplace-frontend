import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import AuthLayout from "../../components/auth/AuthLayout";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Update form values
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setError("");
    };

    // Redirect according to the user role
    const redirectUser = (role) => {
        if (role === "admin") {
            navigate("/admin");
        } else if (role === "lender") {
            navigate("/lender");
        } else {
            navigate("/renter");
        }
    };

    // Submit login details
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {
            setLoading(true);

            const response = await login(formData);

            // If email is not verified, send the user to email verification
            if (response.requiresEmailVerification) {
                navigate("/verify-email", {
                    state: {
                        email: formData.email
                    }
                });

                return;
            }

            // If OTP is required, open the OTP page
            if (response.requiresOTP) {
                navigate("/verify-otp", {
                    state: {
                        email: response.email || formData.email,
                        role: response.user?.role || response.role,
                    }   
                });

                return;
            }

            // A trusted device may complete login without another OTP
            if (response.token && response.user) {
                redirectUser(response.user.role);
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Login failed. Please check your details."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Login to continue using MMTP."
        >

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Gmail address
                    </label>

                    <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@gmail.com"
                            required
                            className="w-full pl-11 pr-4 py-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Password
                    </label>

                    <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full pl-11 pr-12 py-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-danger/10 text-danger border border-danger/20 rounded-xl p-3 text-sm">
                        {error}
                    </div>
                )}

                {/* Login button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent hover:bg-accent-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>

            {/* Registration link */}
            <p className="text-center text-sm text-muted mt-6">
                Don't have an account?{" "}

                <Link
                    to="/register"
                    className="text-accent-700 font-semibold hover:underline"
                >
                    Create account
                </Link>
            </p>

        </AuthLayout>
    );
}