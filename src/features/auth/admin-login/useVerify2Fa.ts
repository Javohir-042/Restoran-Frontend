import { useMutation } from "@tanstack/react-query";
import API from "@/config/request";
import type { IApiResponse, AxiosErrorResponse } from "@/types/types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import type { IAdminLoginResponse } from "./types";

export const useVerify2Fa = () => {
    const { login } = useAuth();

    return useMutation<IApiResponse<IAdminLoginResponse>, AxiosErrorResponse, { adminId: string; otp: string }>({
        mutationFn: (data) =>
            API.post<IApiResponse<IAdminLoginResponse>>("/auth/admin/verify-2fa", data).then((res) => res.data),
        onSuccess: (res) => {
            login(res.data.accessToken!, res.data.role!, "Admin");
            toast.success("Boshqaruv paneliga xush kelibsiz!");
        },
        onError: (error) => {
            const msg = error.response?.data?.error?.message;
            toast.error(typeof msg === "string" ? msg : "Kod noto'g'ri");
        },
    });
};