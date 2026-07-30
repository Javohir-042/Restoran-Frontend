import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

API.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            const publicPaths = ["/login"];
            const isPublicPage = publicPaths.some((path) =>
                window.location.pathname.startsWith(path),
            );

            if (!isPublicPage) {
                Cookies.remove("token");
                localStorage.removeItem("userRole");
                localStorage.removeItem("userName");
                toast.error("Sessiya tugadi", {
                    description: "Iltimos, qaytadan kiring.",
                });
                window.location.href = "/login";
            }
        }

        if (status === 403) {
            toast.error("Ruxsat yo'q", {
                description: "Hisobingiz bloklangan yoki bu amalga ruxsatingiz yo'q.",
            });
        }

        return Promise.reject(error);
    },
);

export default API;