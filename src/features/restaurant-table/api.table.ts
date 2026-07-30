export const TABLE_API = {
    LIST: "/restaurant-table",
    CREATE: "/restaurant-table",
    BULK_CREATE: "/restaurant-table/bulk",
    BY_ID: (id: string) => `/restaurant-table/${id}`,
    QR_IMAGE: (id: string) => `/restaurant-table/${id}/qr-image`,
    RESERVE: (id: string) => `/restaurant-table/${id}/reserve`,
    CANCEL_RESERVATION: (id: string) => `/restaurant-table/${id}/cancel-reservation`,
    ARRIVED: (id: string) => `/restaurant-table/${id}/arrived`,
};