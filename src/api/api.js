import axios from "axios";

// Connect the frontend to our backend API
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Add the JWT token to protected requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("mmtp_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;