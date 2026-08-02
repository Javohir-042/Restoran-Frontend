import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/config/request";
import type { IApiResponse, AxiosErrorResponse } from "@/types/types";
import { toast } from "sonner";

const getErrorMsg = (error: AxiosErrorResponse, fallback: string) => {
    const msg = error.response?.data?.error?.message;
    return typeof msg === "string" ? msg : fallback;
};

/* ── Xizmat haqi ── */
export const useServiceFee = () => {
    return useQuery({
        queryKey: ["settings", "service-fee"],
        queryFn: () =>
            API.get<IApiResponse<{ serviceFeePercent: number; autoApplyServiceFee: boolean }>>(
                "/settings/service-fee",
            ).then((res) => res.data.data),
    });
};

export const useUpdateServiceFee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { percent: number; autoApply?: boolean }) =>
            API.patch("/settings/service-fee", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings", "service-fee"] });
            toast.success("Xizmat haqi sozlamalari yangilandi");
        },
        onError: (error: AxiosErrorResponse) => toast.error(getErrorMsg(error, "Xatolik")),
    });
};

/* ── Umumiy ── */
export const useGeneralSettings = () => {
    return useQuery({
        queryKey: ["settings", "general"],
        queryFn: () =>
            API.get<IApiResponse<{
                restaurantName: string | null;
                contactPhone: string | null;
                address: string | null;
                currency: string;
                latitude: number | null;
                longitude: number | null;
            }>>("/settings/general").then((res) => res.data.data),
    });
};

export const useUpdateGeneralSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            restaurantName?: string;
            contactPhone?: string;
            address?: string;
            currency?: string;
            latitude?: number;
            longitude?: number;
        }) => API.patch("/settings/general", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings", "general"] });
            toast.success("Umumiy sozlamalar yangilandi");
        },
        onError: (error: AxiosErrorResponse) => toast.error(getErrorMsg(error, "Xatolik")),
    });
};

/* ── Bildirishnomalar ── */
export const useNotificationSettings = () => {
    return useQuery({
        queryKey: ["settings", "notifications"],
        queryFn: () =>
            API.get<IApiResponse<{
                notifyNewOrder: boolean;
                notifyKitchenReady: boolean;
                notifyLowInventory: boolean;
            }>>("/settings/notifications").then((res) => res.data.data),
    });
};

export const useUpdateNotificationSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            notifyNewOrder?: boolean;
            notifyKitchenReady?: boolean;
            notifyLowInventory?: boolean;
        }) => API.patch("/settings/notifications", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings", "notifications"] });
            toast.success("Bildirishnoma sozlamalari saqlandi");
        },
        onError: (error: AxiosErrorResponse) => toast.error(getErrorMsg(error, "Xatolik")),
    });
};

/* ── 2FA (avvalgi javobda yozilgan) ── */
export const useToggle2FA = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => API.patch("/admins/me/toggle-2fa"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "me"] });
            toast.success("2FA holati o'zgartirildi");
        },
        onError: (error: AxiosErrorResponse) => toast.error(getErrorMsg(error, "Xatolik")),
    });
};
