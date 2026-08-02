export const WAITER_API = {
    OPEN_BILL: "/bill/open",
    BILL_BY_ID: (id: string) => `/bill/${id}`,
    BILL_BY_TABLE: (tableId: string) => `/bill/table/${tableId}`,
    READY_ITEMS: "/order-item/ready-for-delivery",
    MARK_DELIVERED: (id: string) => `/order-item/${id}/mark-delivered`,
    CANCEL_ORDER_ITEM: (id: string) => `/order-item/${id}/cancel`,
    CREATE_ORDER: "/order-item"
};
