import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaEye,
    FaEyeSlash,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaLock
} from "react-icons/fa";

import AuthLayout from "../../components/auth/AuthLayout";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // Check the password requirements
    const passwordRequirements = [
        {
            label: "At least 8 characters",
            valid: formData.password.length >= 8
        },
        {
            label: "One uppercase letter",
            valid: /[A-Z]/.test(formData.password)
        },
        {
            label: "One lowercase letter",
            valid: /[a-z]/.test(formData.password)
        },
        {
            label: "One number",
            valid: /\d/.test(formData.password)
        },
        {
            label: "One special character",
            valid: /[^A-Za-z0-9]/.test(formData.password)
        }
    ];

    // Submit the registration form
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        // Check that the passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Check password requirements
        const invalidPassword = passwordRequirements.some(
            (requirement) => !requirement.valid
        );

        if (invalidPassword) {
            setError("Please meet all password requirements.");
            return;
        }

        // Only Gmail addresses are accepted
        if (!formData.email.toLowerCase().endsWith("@gmail.com")) {
            setError("Please use a Gmail address.");
            return;
        }

        try {
            setLoading(true);

            // Send registration data to the backend
            const response = await register(formData);

            // Navigate to email verification
            navigate("/verify-email", {
                state: {
                    email: formData.email,
                    message: response.message
                }
            });

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Join MMTP and start renting or sharing products."
        >

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* First name and last name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            First name
                        </label>

                        <div className="relative">
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First name"
                                required
                                className="w-full pl-11 pr-4 py-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Last name
                        </label>

                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last name"
                            required
                            className="w-full px-4 py-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        />
                    </div>

                </div>

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

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Phone number
                    </label>

                    <div className="relative">
                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="07XXXXXXXX"
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
                            placeholder="Create a password"
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

                    {/* Password requirements */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">

                        {passwordRequirements.map((requirement, index) => (
                            <p
                                key={index}
                                className={
                                    requirement.valid
                                        ? "text-success"
                                        : "text-muted"
                                }
                            >
                                {requirement.valid ? "✓" : "○"}{" "}
                                {requirement.label}
                            </p>
                        ))}

                    </div>
                </div>

                {/* Confirm password */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Confirm password
                    </label>

                    <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />

                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                            className="w-full pl-11 pr-12 py-3 border border-border rounded-xl outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                {/* Display backend or validation errors */}
                {error && (
                    <div className="bg-danger/10 text-danger border border-danger/20 rounded-xl p-3 text-sm">
                        {error}
                    </div>
                )}

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent hover:bg-accent-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? "Creating account..." : "Create account"}
                </button>

            </form>

            {/* Login link */}
            <p className="text-center text-sm text-muted mt-6">
                Already have an account?{" "}

                <Link
                    to="/login"
                    className="text-accent-700 font-semibold hover:underline"
                >
                    Login
                </Link>
            </p>

        </AuthLayout>
    );
}