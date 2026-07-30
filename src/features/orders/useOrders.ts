import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/config/request";
import { ORDERS_API } from "./api.orders";
import type { IBill, IOrderItem, IOrderRow, ITable } from "./types";
import type { IApiResponse, AxiosErrorResponse } from "@/types/types";
import { toast } from "sonner";

/* ── Status computation ── */
export function computeOrderStatus(bill: IBill, items: IOrderItem[]): string {
    if (bill.status === "TOLANDI") return "Yakunlangan";
    if (items.length === 0) return "Yangi";
    if (items.every((i) => i.status === "YETKAZILDI")) return "Tayyor";
    if (
        items.some(
            (i) => i.status === "TAYYORLANMOQDA" || i.status === "TAYYOR"
        )
    )
        return "Tayyorlanmoqda";
    return "Yangi";
}

/* ── Fetch all orders (bills + items) ── */
export const useOrdersList = () => {
    const billsQuery = useQuery({
        queryKey: ["bills", "all"],
        queryFn: () =>
            API.get<IApiResponse<IBill[]>>(ORDERS_API.BILLS_ALL).then(
                (r) => r.data.data
            ),
    });

    const bills = billsQuery.data ?? [];

    const ordersQuery = useQuery({
        queryKey: ["orders-with-items", bills.map((b) => b.id)],
        queryFn: async (): Promise<IOrderRow[]> => {
            return Promise.all(
                bills.map(async (bill) => {
                    const items = await API.get<IApiResponse<IOrderItem[]>>(
                        ORDERS_API.ORDER_ITEMS_BY_BILL(bill.id)
                    ).then((r) => r.data.data);

                    const staffName = bill.openedByStaff
                        ? `${bill.openedByStaff.firstName} ${bill.openedByStaff.lastName}`
                        : "Mijoz";

                    const staffInitials = bill.openedByStaff
                        ? bill.openedByStaff.firstName.charAt(0) +
                        bill.openedByStaff.lastName.charAt(0)
                        : "M";

                    return {
                        bill,
                        items,
                        itemsCount: items.length,
                        itemsLabel:
                            items
                                .map((i) => `${i.menuItem.name} (${i.quantity})`)
                                .join(", ") || "Taom yo'q",
                        staffName,
                        staffInitials,
                        computedStatus: computeOrderStatus(bill, items),
                    };
                })
            );
        },
        enabled: bills.length > 0,
    });

    return {
        data: ordersQuery.data ?? [],
        isLoading: billsQuery.isLoading || ordersQuery.isLoading,
        isError: billsQuery.isError || ordersQuery.isError,
    };
};

/* ── Fetch restaurant tables ── */
export const useRestaurantTables = () => {
    return useQuery({
        queryKey: ["restaurant-tables"],
        queryFn: () =>
            API.get<IApiResponse<ITable[]>>(ORDERS_API.TABLES).then(
                (r) => r.data.data
            ),
    });
};

/* ── Cancel empty bill ── */
export const useCancelBill = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            API.delete(ORDERS_API.BILL_CANCEL(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills"] });
            queryClient.invalidateQueries({ queryKey: ["orders-with-items"] });
            toast.success("Buyurtma bekor qilindi");
        },
        onError: (error: AxiosErrorResponse) => {
            const msg = error.response?.data?.error?.message;
            toast.error(
                typeof msg === "string" ? msg : "Bekor qilishda xatolik"
            );
        },
    });
};
