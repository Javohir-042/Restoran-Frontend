import { useMutation } from "@tanstack/react-query";
import API from "@/config/request";
import { STAFF_AUTH_API } from "./api.staff-login";
import type { IStaffLoginDto, IStaffLoginResponse } from "./types";
import type { IApiResponse, AxiosErrorResponse } from "@/types/types";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const useStaffLogin = () => {
    const { login } = useAuth();

    return useMutation<IApiResponse<IStaffLoginResponse>, AxiosErrorResponse, IStaffLoginDto>({
        mutationFn: (data) =>
            API.post<IApiResponse<IStaffLoginResponse>>(STAFF_AUTH_API.SIGN_IN, data).then(
                (res) => res.data,
            ),
        onSuccess: (res) => {
            login(res.data.accessToken, res.data.role, res.data.firstName);
            toast.success(`Xush kelibsiz, ${res.data.firstName}!`);
        },
        onError: (error) => {
            const msg = error.response?.data?.error?.message;
            toast.error(typeof msg === "string" ? msg : "PIN kod noto'g'ri");
        },
    });
};