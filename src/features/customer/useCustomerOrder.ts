import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/config/request";
import { CUSTOMER_API } from "./api.customer";
import type { IOrderItem, ICartLine } from "./types";
import type { IApiResponse } from "@/types/types";
import { toast } from "sonner";

export const useOrderItemsByBill = (billId: string | null) => {
    return useQuery({
        queryKey: ["customer", "order-items", billId],
        queryFn: () =>
            API.get<IApiResponse<IOrderItem[]>>(CUSTOMER_API.ORDER_ITEMS_BY_BILL(billId!)).then(
                (r) => r.data.data,
            ),
        enabled: !!billId,
        refetchInterval: 5000,
    });
};

export const usePlaceOrder = (tableId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cart: ICartLine[]) => {
            let billId: string;
            try {
                const existing = await API.get(CUSTOMER_API.BILL_BY_TABLE(tableId));
                billId = existing.data.data.id;
            } catch {
                const opened = await API.post(CUSTOMER_API.OPEN_BILL, { tableId });
                billId = opened.data.data.id;
            }

            const items = cart.map((c) => ({ menuItemId: c.menuItemId, quantity: c.quantity }));
            await API.post(CUSTOMER_API.ADD_ORDER_ITEMS, { billId, items });

            return billId;
        },
        onSuccess: (billId) => {
            queryClient.invalidateQueries({ queryKey: ["customer", "bill"] });
            queryClient.invalidateQueries({ queryKey: ["customer", "order-items", billId] });
            toast.success("Buyurtmangiz qabul qilindi!");
        },
        onError: () => {
            toast.error("Buyurtma berishda xatolik yuz berdi, qaytadan urinib ko'ring");
        },
    });
};
