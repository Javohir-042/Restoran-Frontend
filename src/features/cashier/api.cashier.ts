export const CASHIER_API = {
    OPEN_BILLS: "/bill/open",
    BILL_ITEMS: (billId: string) => `/order-item/bill/${billId}`,
    PAYMENT: "/payment",
    PAYMENT_SUMMARY: (billId: string) => `/payment/bill/${billId}/summary`,
    CANCEL_PAYMENT: (paymentId: string) => `/payment/${paymentId}/cancel`,
    DAILY_REVENUE: "/reports/summary", // Expected to accept ?from=bugun&to=bugun
};
