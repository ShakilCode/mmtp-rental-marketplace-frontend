import { useAuth } from "../../context/AuthContext";

export default function RenterDashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-background p-6">

            <div className="max-w-6xl mx-auto">

                <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">

                    <h1 className="text-3xl font-bold text-secondary">
                        Renter Dashboard
                    </h1>

                    <p className="text-muted mt-3">
                        Welcome, {user?.firstName}!
                    </p>

                    <p className="mt-4">
                        Your renter dashboard will be developed here.
                    </p>

                    <button
                        onClick={logout}
                        className="mt-6 bg-danger text-white px-5 py-2 rounded-xl"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
}