import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/config/request";
import { CASHIER_API } from "./api.cashier";
import type { ICashierBill, ICashierOrderItem, IPaymentSummary } from "./types";
import type { IApiResponse, AxiosErrorResponse } from "@/types/types";
import { toast } from "sonner";

const getErrorMsg = (error: AxiosErrorResponse, fallback: string) => {
    const msg = error.response?.data?.error?.message;
    return typeof msg === "string" ? msg : fallback;
};

// Helper to avoid UTC truncation in Postgres 'timestamp without time zone'
const getLocalISOString = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return (new Date(date.getTime() - tzOffset)).toISOString().slice(0, -1);
};

// 1. Fetch Today's Revenue
export const useDailyRevenue = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fromStr = getLocalISOString(today);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const toStr = getLocalISOString(endOfDay);

    return useQuery({
        queryKey: ["reports", "revenue", "today"],
        queryFn: () => API.get<IApiResponse<{ totalRevenue: number }>>(`${CASHIER_API.DAILY_REVENUE}?from=${fromStr}&to=${toStr}`).then(res => res.data.data),
        refetchInterval: 60000,
    });
};

// 2. Fetch Open Bills
export const useCashierOpenBills = () => {
    return useQuery({
        queryKey: ["cashier", "open-bills"],
        queryFn: () => API.get<IApiResponse<ICashierBill[]>>(CASHIER_API.OPEN_BILLS).then(res => res.data.data),
        refetchInterval: 30000,
    });
};

// 3. Fetch Items for a specific bill to check if they are all delivered
export const useBillDeliveryStatus = (billId: string | null) => {
    return useQuery({
        queryKey: ["cashier", "bill-items", billId],
        queryFn: () => API.get<IApiResponse<ICashierOrderItem[]>>(CASHIER_API.BILL_ITEMS(billId!)).then(res => res.data.data),
        enabled: !!billId,
        refetchInterval: 15000,
    });
};

// 4. Fetch Payment Summary (Paid vs Remaining)
export const usePaymentSummary = (billId: string | null) => {
    return useQuery({
        queryKey: ["cashier", "payment-summary", billId],
        queryFn: () => API.get<IApiResponse<IPaymentSummary>>(CASHIER_API.PAYMENT_SUMMARY(billId!)).then(res => res.data.data),
        enabled: !!billId,
    });
};

// 5. Create Payment
export const useCreatePayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { billId: string; amount: number; paymentMethod: "NAQD" | "UZCARD" | "HUMO" }) =>
            API.post(CASHIER_API.PAYMENT, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["cashier", "payment-summary", variables.billId] });
            queryClient.invalidateQueries({ queryKey: ["cashier", "open-bills"] });
            queryClient.invalidateQueries({ queryKey: ["reports", "revenue", "today"] });
            queryClient.invalidateQueries({ queryKey: ["cashier", "payment-history"] });
            toast.success("To'lov qabul qilindi");
        },
        onError: (error: AxiosErrorResponse) => {
            toast.error(getErrorMsg(error, "To'lovda xatolik yuz berdi"));
        },
    });
};

// 6. Cancel Payment
export const useCancelPayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (paymentId: string) => API.patch(CASHIER_API.CANCEL_PAYMENT(paymentId), { reason: "Xato to'lov" }),
        onSuccess: () => {
            // Need to invalidate everything since we cancelled
            queryClient.invalidateQueries({ queryKey: ["cashier", "payment-summary"] });
            queryClient.invalidateQueries({ queryKey: ["cashier", "payment-history"] });
            queryClient.invalidateQueries({ queryKey: ["reports", "revenue", "today"] });
            queryClient.invalidateQueries({ queryKey: ["cashier", "open-bills"] });
            toast.success("To'lov bekor qilindi");
        },
        onError: (error: AxiosErrorResponse) => {
            toast.error(getErrorMsg(error, "Bekor qilishda xatolik"));
        },
    });
};
