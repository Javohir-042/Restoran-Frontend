export const KITCHEN_API = {
    QUEUE: "/order-item/kitchen-queue",
    START_COOKING: (id: string) => `/order-item/${id}/start-cooking`,
    MARK_READY: (id: string) => `/order-item/${id}/mark-ready`,
};
