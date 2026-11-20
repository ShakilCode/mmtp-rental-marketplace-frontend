import { createContext, useContext, useState } from "react";
import api from "../api/api";

// Create the authentication context
const AuthContext = createContext(null);

// Provide authentication information to the entire application
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("mmtp_user");

        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("mmtp_token");
    });

    // Save the user and token after successful authentication
    const saveAuth = (data) => {
        if (data.token && data.user) {
            localStorage.setItem("mmtp_token", data.token);
            localStorage.setItem("mmtp_user", JSON.stringify(data.user));

            setToken(data.token);
            setUser(data.user);
        }
    };

    // Register a new user
    const register = async (userData) => {
        const response = await api.post("/users/register", userData);

        return response.data;
    };

    // Login using email and password
    const login = async (loginData) => {
        const response = await api.post("/users/login", loginData);

        // Save authentication if login is completed directly
        if (response.data.token) {
            saveAuth(response.data);
        }

        return response.data;
    };

    // Verify the email OTP
    const verifyEmail = async (verificationData) => {
        const response = await api.post(
            "/users/verify-email",
            verificationData
        );

        // Email verification also completes the first login
        if (response.data.token) {
            saveAuth(response.data);
        }

        return response.data;
    };

    // Verify the login OTP
    const verifyLoginOTP = async (otpData) => {
        const response = await api.post(
            "/users/verify-login-otp",
            otpData
        );

        // Save the authentication after successful OTP verification
        if (response.data.token) {
            saveAuth(response.data);
        }

        return response.data;
    };

    // Resend the OTP
    const resendOTP = async (email) => {
        const response = await api.post("/users/resend-otp", {
            email
        });

        return response.data;
    };

    // Log out the user
    const logout = () => {
        localStorage.removeItem("mmtp_token");
        localStorage.removeItem("mmtp_user");

        setToken(null);
        setUser(null);
    };

    const isAuthenticated = Boolean(token && user);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                register,
                login,
                verifyEmail,
                verifyLoginOTP,
                resendOTP,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Access authentication information from any component
export function useAuth() {
    return useContext(AuthContext);
}