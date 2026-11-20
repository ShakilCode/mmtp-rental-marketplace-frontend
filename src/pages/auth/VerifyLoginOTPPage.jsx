import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../components/auth/AuthLayout";

const VerifyLoginOTPPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { verifyLoginOTP, resendOTP } = useAuth();

    // Get the email and role passed from the login page
    const email = location.state?.email || "";
    const role = location.state?.role || "";

    const [otp, setOtp] = useState("");
    const [trustDevice, setTrustDevice] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [resendTimer, setResendTimer] = useState(60);

    // Only renters and lenders can trust their devices
    const canTrustDevice = role === "renter" || role === "lender";

    // Countdown for OTP resend
    useEffect(() => {
        if (resendTimer <= 0) return;

        const timer = setTimeout(() => {
            setResendTimer((previous) => previous - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [resendTimer]);

    // Redirect to the correct dashboard
    const redirectUser = (userRole) => {
        if (userRole === "admin") {
            navigate("/admin");
        } else if (userRole === "lender") {
            navigate("/lender");
        } else {
            navigate("/renter");
        }
    };

    // Verify login OTP
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!email) {
            setError("Email is missing. Please login again.");
            return;
        }

        if (otp.length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);

            // Admins cannot trust devices
            const shouldTrustDevice =
                canTrustDevice && trustDevice;

            const response = await verifyLoginOTP({
                email,
                otp,
                trustDevice: shouldTrustDevice,
            });

            // Redirect based on the user's role
            const userRole =
                response?.user?.role || role;

            redirectUser(userRole);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Invalid OTP. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (resendTimer > 0 || resending) return;

        setError("");
        setSuccess("");

        try {
            setResending(true);

            await resendOTP({ email });

            setSuccess("A new OTP has been sent to your email.");

            // Start the 60-second cooldown again
            setResendTimer(60);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to resend OTP. Please try again."
            );
        } finally {
            setResending(false);
        }
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md mx-auto">

                {/* Page heading */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-secondary">
                        Verify Your Login
                    </h1>

                    <p className="text-muted mt-3">
                        Enter the 6-digit verification code sent
                        to your email.
                    </p>

                    <p className="text-secondary font-medium mt-2">
                        {email}
                    </p>
                </div>

                {/* OTP form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {/* OTP input */}
                    <div>
                        <label
                            htmlFor="otp"
                            className="block text-sm font-medium text-secondary mb-2"
                        >
                            Verification Code
                        </label>

                        <input
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            placeholder="Enter 6-digit OTP"
                            className="w-full px-4 py-3 text-center text-xl tracking-[0.5em] font-semibold border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                            required
                        />
                    </div>

                    {/* Trust device option - renters and lenders only */}
                    {canTrustDevice && (
                        <div className="p-4 border border-border rounded-xl bg-surface">
                            <label className="flex items-start gap-3 cursor-pointer">

                                <input
                                    type="checkbox"
                                    checked={trustDevice}
                                    onChange={(e) =>
                                        setTrustDevice(e.target.checked)
                                    }
                                    className="mt-1 w-4 h-4 accent-accent cursor-pointer"
                                />

                                <div>
                                    <p className="font-semibold text-secondary">
                                        Trust this device
                                    </p>

                                    <p className="text-sm text-muted mt-1">
                                        Skip OTP on future logins from
                                        this device for the permitted period.
                                    </p>
                                </div>
                            </label>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Success message */}
                    {success && (
                        <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                            {success}
                        </div>
                    )}

                    {/* Verify button */}
                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full py-3 rounded-xl bg-secondary text-white font-semibold hover:bg-secondary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify & Login"}
                    </button>
                </form>

                {/* Resend OTP */}
                <div className="text-center mt-6">
                    <p className="text-sm text-muted">
                        Didn't receive the code?
                    </p>

                    <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resendTimer > 0 || resending}
                        className="mt-2 font-semibold text-accent hover:underline disabled:text-muted disabled:no-underline disabled:cursor-not-allowed"
                    >
                        {resending
                            ? "Sending..."
                            : resendTimer > 0
                                ? `Resend OTP in ${resendTimer}s`
                                : "Resend OTP"}
                    </button>
                </div>

                {/* Return to login */}
                <div className="text-center mt-6">
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-sm text-secondary hover:underline"
                    >
                        Back to Login
                    </button>
                </div>

            </div>
        </AuthLayout>
    );
};

export default VerifyLoginOTPPage;