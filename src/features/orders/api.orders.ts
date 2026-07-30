export const ORDERS_API = {
    BILLS_ALL: "/bill",
    BILL_CANCEL: (id: string) => `/bill/${id}/cancel`,
    ORDER_ITEMS_BY_BILL: (billId: string) => `/order-item/bill/${billId}`,
    TABLES: "/restaurant-table",
};
