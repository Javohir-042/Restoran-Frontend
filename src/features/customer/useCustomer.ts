import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/config/request";
import { CUSTOMER_API } from "./api.customer";
import type { ICustomerTable, ICustomerCategory, ICustomerMenuItem, ICustomerBill, ICustomerOrderItem } from "./types";
import type { IApiResponse } from "@/types/types";
import { toast } from "sonner";

// 1. Table Info
export const useCustomerTable = (tableId: string | undefined) => {
    return useQuery({
        queryKey: ["customer", "table", tableId],
        queryFn: () => API.get<IApiResponse<ICustomerTable>>(CUSTOMER_API.TABLE(tableId!)).then(res => res.data.data),
        enabled: !!tableId,
        retry: false
    });
};

// 2. Active Bill for Table (Assuming endpoint exists or we fetch open bills and filter)
export const useCustomerActiveBill = (tableId: string | undefined) => {
    return useQuery({
        queryKey: ["customer", "bill", tableId],
        queryFn: () => API.get<IApiResponse<ICustomerBill>>(CUSTOMER_API.ACTIVE_BILL(tableId!)).then(res => res.data.data)
            // Catch 404 meaning no active bill exists
            .catch((err) => {
                if (err.response?.status === 404) return null;
                throw err;
            }),
        enabled: !!tableId,
    });
};

// 3. Categories
export const useCustomerCategories = () => {
    return useQuery({
        queryKey: ["customer", "categories"],
        queryFn: () => API.get<IApiResponse<ICustomerCategory[]>>(CUSTOMER_API.CATEGORIES).then(res => res.data.data),
    });
};

// 4. Menu Items by Category
export const useCustomerMenuItems = (categoryId: string | null) => {
    return useQuery({
        queryKey: ["customer", "menu-items"],
        queryFn: () => API.get<IApiResponse<ICustomerMenuItem[]>>(CUSTOMER_API.MENU_ITEMS).then(res => res.data.data),
        select: (data) => categoryId ? data.filter(item => item.categoryId === categoryId) : data
    });
};

// 5. Open Bill
export const useCustomerOpenBill = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (tableId: string) => API.post<IApiResponse<ICustomerBill>>(CUSTOMER_API.OPEN_BILL, { tableId }).then(res => res.data.data),
        onSuccess: (_, tableId) => {
            queryClient.invalidateQueries({ queryKey: ["customer", "bill", tableId] });
        }
    });
};

// 6. Submit Order Items
export const useCustomerSubmitOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { billId: string; items: { menuItemId: string; quantity: number }[] }) =>
            API.post(CUSTOMER_API.ORDER_ITEMS, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["customer", "order-items", variables.billId] });
            toast.success("Buyurtma qabul qilindi!");
        },
        onError: () => {
            toast.error("Buyurtma berishda xatolik yuz berdi");
        }
    });
};

// 7. Poll Order Items Status (GET /order-item/bill/:billId)
export const useCustomerOrderItems = (billId: string | null | undefined) => {
    return useQuery({
        queryKey: ["customer", "order-items", billId],
        queryFn: () => API.get<IApiResponse<ICustomerOrderItem[]>>(CUSTOMER_API.BILL_ORDERS(billId!)).then(res => res.data.data),
        enabled: !!billId,
        refetchInterval: 5000,
    });
};

// 8. AI Assistant
export const useCustomerAiAssistant = () => {
    return useMutation({
        mutationFn: (query: string) => API.post<IApiResponse<ICustomerMenuItem[]>>(CUSTOMER_API.AI_ASK, { query }).then(res => res.data.data)
    });
};
