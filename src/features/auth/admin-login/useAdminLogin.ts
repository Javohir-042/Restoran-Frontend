import { useMutation } from "@tanstack/react-query";
import API from "@/config/request";
import { ADMIN_AUTH_API } from "./api.admin-login";
import type { IAdminLoginDto, IAdminLoginResponse } from "./types";
import type { IApiResponse, AxiosErrorResponse } from "@/types/types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const useAdminLogin = () => {
    const { login } = useAuth();

    return useMutation<IApiResponse<IAdminLoginResponse>, AxiosErrorResponse, IAdminLoginDto>({
        mutationFn: (data) =>
            API.post<IApiResponse<IAdminLoginResponse>>(ADMIN_AUTH_API.SIGN_IN, data).then(
                (res) => res.data,
            ),
        onSuccess: (res) => {
            if (!res.data.requires2FA && res.data.accessToken && res.data.role) {
                login(res.data.accessToken, res.data.role, "Admin");
                toast.success("Boshqaruv paneliga xush kelibsiz!");
            }
        },
        onError: (error) => {
            const msg = error.response?.data?.error?.message;
            toast.error(typeof msg === "string" ? msg : "Kirishda xatolik yuz berdi");
        },
    });
};