export const CUSTOMER_API = {
    TABLE: (id: string) => `/restaurant-table/${id}`,
    BILL_BY_TABLE: (tableId: string) => `/bill/table/${tableId}`,
    CATEGORIES: "/category",
    MENU_ITEMS: "/menu-item",
    OPEN_BILL: "/bill/open-by-customer",
    ADD_ORDER_ITEMS: "/order-item/customer",
    ORDER_ITEMS_BY_BILL: (billId: string) => `/order-item/bill/${billId}`,
    PAYMENT_SUMMARY: (billId: string) => `/payment/bill/${billId}/summary`,
    AI_ASK: "/ai-assistant/ask",
};
