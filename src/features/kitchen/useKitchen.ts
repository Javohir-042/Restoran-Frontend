import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/config/request";
import { KITCHEN_API } from "./api.kitchen";
import type { IKitchenOrderItem } from "./types";
import type { IApiResponse, AxiosErrorResponse } from "@/types/types";
import { toast } from "sonner";

const getErrorMsg = (error: AxiosErrorResponse, fallback: string) => {
    const msg = error.response?.data?.error?.message;
    return typeof msg === "string" ? msg : fallback;
};

export const useKitchenQueue = () => {
    return useQuery({
        queryKey: ["kitchen-queue"],
        queryFn: () =>
            API.get<IApiResponse<IKitchenOrderItem[]>>(KITCHEN_API.QUEUE).then(
                (res) => res.data.data
            ),
        refetchInterval: 60000, // Optional: fallback polling every 1m just in case
    });
};

export const useStartCooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => API.patch(KITCHEN_API.START_COOKING(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kitchen-queue"] });
            toast.success("Taom tayyorlashlandi boshlandi");
        },
        onError: (error: AxiosErrorResponse) => {
            toast.error(getErrorMsg(error, "Xatolik yuz berdi"));
        },
    });
};

export const useMarkReady = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => API.patch(KITCHEN_API.MARK_READY(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kitchen-queue"] });
            toast.success("Taom tayyor bo'ldi");
        },
        onError: (error: AxiosErrorResponse) => {
            toast.error(getErrorMsg(error, "Xatolik yuz berdi"));
        },
    });
};
