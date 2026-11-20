import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";

import AuthLayout from "../../components/auth/AuthLayout";
import { useAuth } from "../../context/AuthContext";

export default function VerifyEmailPage() {
    const { verifyEmail, resendOTP } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const [countdown, setCountdown] = useState(60);

    // Start the resend countdown
    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setTimeout(() => {
            setCountdown((previous) => previous - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    // Verify the email OTP
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (otp.length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);

            const response = await verifyEmail({
                email,
                otp
            });

            // Registration verification completes the first login
            const role = response.user?.role || "renter";

            if (role === "admin") {
                navigate("/admin");
            } else if (role === "lender") {
                navigate("/lender");
            } else {
                navigate("/renter");
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "OTP verification failed."
            );
        } finally {
            setLoading(false);
        }
    };

    // Request another email OTP
    const handleResend = async () => {
        setError("");
        setSuccess("");

        try {
            setResendLoading(true);

            const response = await resendOTP(email);

            setSuccess(response.message || "A new OTP has been sent.");
            setCountdown(60);
            setOtp("");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to resend OTP."
            );
        } finally {
            setResendLoading(false);
        }
    };

    // Prevent opening the verification page without an email
    if (!email) {
        return (
            <AuthLayout
                title="Email verification"
                subtitle="Verify your email address."
            >
                <div className="text-center space-y-4">
                    <p className="text-danger">
                        Email address is missing.
                    </p>

                    <Link
                        to="/register"
                        className="text-accent-700 font-semibold"
                    >
                        Go to registration
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Verify your email"
            subtitle="Enter the OTP sent to your Gmail address."
        >

            <div className="flex justify-center mb-6">

                <div className="w-16 h-16 bg-primary-100 text-accent rounded-2xl flex items-center justify-center text-2xl">
                    <FaEnvelope />
                </div>

            </div>

            <p className="text-center text-muted text-sm mb-6">
                We sent a verification code to
                <br />

                <span className="font-semibold text-secondary">
                    {email}
                </span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* OTP input */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Verification code
                    </label>

                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="000000"
                        required
                        className="w-full text-center text-2xl tracking-[0.5em] font-bold px-4 py-4 border border-border rounded-xl outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                    />
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-danger/10 text-danger border border-danger/20 rounded-xl p-3 text-sm">
                        {error}
                    </div>
                )}

                {/* Success message */}
                {success && (
                    <div className="bg-success/10 text-success border border-success/20 rounded-xl p-3 text-sm">
                        {success}
                    </div>
                )}

                {/* Verify button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent hover:bg-accent-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
                >
                    {loading ? "Verifying..." : "Verify email"}
                </button>

            </form>

            {/* Resend OTP */}
            <div className="text-center mt-6 text-sm">

                {countdown > 0 ? (
                    <p className="text-muted">
                        Resend OTP in {countdown} seconds
                    </p>
                ) : (
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendLoading}
                        className="text-accent-700 font-semibold hover:underline disabled:opacity-60"
                    >
                        {resendLoading ? "Sending..." : "Resend OTP"}
                    </button>
                )}

            </div>

            <p className="text-center text-sm text-muted mt-6">
                Wrong email?{" "}

                <Link
                    to="/register"
                    className="text-accent-700 font-semibold hover:underline"
                >
                    Register again
                </Link>
            </p>

        </AuthLayout>
    );
}