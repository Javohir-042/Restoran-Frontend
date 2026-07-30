import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/config/request";
import { toast } from "sonner";
import type { AxiosErrorResponse } from "@/types/types";

const getErrorMsg = (error: AxiosErrorResponse, fallback: string) => {
    const msg = error.response?.data?.error?.message;
    return typeof msg === "string" ? msg : fallback;
};

/* ── Open bill + add items flow ── */
export const useCreateOrderFlow = () => {
    const queryClient = useQueryClient();

    const openBillAsAdmin = async (tableId: string) => {
        const res = await API.post("/bill/open", { tableId });
        return res.data.data;
    };

    const addItemsMutation = useMutation({
        mutationFn: ({
            billId,
            items,
        }: {
            billId: string;
            items: { menuItemId: string; quantity: number }[];
        }) => API.post("/order-item", { billId, items }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills"] });
            queryClient.invalidateQueries({ queryKey: ["orders-with-items"] });
            toast.success("Buyurtma qo'shildi");
        },
        onError: (error: AxiosErrorResponse) => {
            toast.error(getErrorMsg(error, "Buyurtma qo'shishda xatolik"));
        },
    });

    const addItems = (
        billId: string,
        items: { menuItemId: string; quantity: number }[]
    ) => addItemsMutation.mutateAsync({ billId, items });

    return { openBillAsAdmin, addItems, isLoading: addItemsMutation.isPending };
};

/* ── Cancel single order item ── */
export const useCancelOrderItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (itemId: string) =>
            API.delete(`/order-item/${itemId}/cancel`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills"] });
            queryClient.invalidateQueries({ queryKey: ["orders-with-items"] });
            toast.success("Taom bekor qilindi");
        },
        onError: (error: AxiosErrorResponse) => {
            toast.error(
                getErrorMsg(error, 'Faqat "Yangi" holatidagi taomni bekor qilish mumkin')
            );
        },
    });
};
