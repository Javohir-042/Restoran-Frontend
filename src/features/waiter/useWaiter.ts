import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/config/request";
import { WAITER_API } from "./api.waiter";
import type { IWaiterOrderItem, IBill } from "./types";
import type { IApiResponse, AxiosErrorResponse } from "@/types/types";
import { toast } from "sonner";

const getErrorMsg = (error: AxiosErrorResponse, fallback: string) => {
    const msg = error.response?.data?.error?.message;
    return typeof msg === "string" ? msg : fallback;
};

// Open a new bill for a table
export const useOpenBill = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (tableId: string) => API.post<IApiResponse<IBill>>(WAITER_API.OPEN_BILL, { tableId }).then(res => res.data.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["restaurant-table"] });
            queryClient.invalidateQueries({ queryKey: ["bills", "open"] });
            toast.success("Yangi hisob ochildi");
        },
        onError: (error: AxiosErrorResponse) => {
            toast.error(getErrorMsg(error, "Hisob ochishda xatolik"));
        },
    });
};

// Fetch items for a specific bill
export const useBillOrderItems = (billId: string | null) => {
    return useQuery({
        queryKey: ["bill-items", billId],
        queryFn: () => API.get<IApiResponse<IWaiterOrderItem[]>>(`/order-item/bill/${billId}`).then(res => res.data.data),
        enabled: !!billId,
        refetchInterval: 30000,
    });
};

// Get globally ready items (for notification count / drawer)
export const useReadyItems = () => {
    return useQuery({
        queryKey: ["ready-items"],
        queryFn: () => API.get<IApiResponse<IWaiterOrderItem[]>>(WAITER_API.READY_ITEMS).then(res => res.data.data),
        refetchInterval: 60000,
    });
};

// Mark item as delivered
export const useMarkDelivered = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (itemId: string) => API.patch(WAITER_API.MARK_DELIVERED(itemId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bill-items"] });
            queryClient.invalidateQueries({ queryKey: ["ready-items"] });
            toast.success("Taom yetkazildi");
        },
        onError: (error: AxiosErrorResponse) => {
            toast.error(getErrorMsg(error, "Xatolik yuz berdi"));
        },
    });
};

// Create a new order item for a bill
export const useAddOrderItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { billId: string; items: { menuItemId: string; quantity: number }[] }) =>
            API.post(WAITER_API.CREATE_ORDER, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["bill-items", variables.billId] });
            toast.success("Taom qo'shildi");
        },
        onError: (error: AxiosErrorResponse) => {
            toast.error(getErrorMsg(error, "Taom qo'shishda xatolik"));
        },
    });
};

// Cancel an order item if it was added by mistake (only works if status is YANGI)
export const useCancelOrderItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (itemId: string) => API.delete(WAITER_API.CANCEL_ORDER_ITEM(itemId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bill-items"] });
            queryClient.invalidateQueries({ queryKey: ["bills", "open"] });
            toast.success("Bekor qilindi");
        },
        onError: (error: AxiosErrorResponse) => {
            toast.error(getErrorMsg(error, "Bekor qilishda xatolik (faqat Yangi holatda o'chirish mumkin)"));
        },
    });
};
