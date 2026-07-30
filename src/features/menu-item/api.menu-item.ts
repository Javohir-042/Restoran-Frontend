export const MENU_ITEM_API = {
    LIST_ADMIN: "/menu-item/admin/all",
    CREATE: "/menu-item",
    BY_ID: (id: string) => `/menu-item/${id}`,
    TOGGLE_AVAILABILITY: (id: string) => `/menu-item/${id}/toggle-availability`,
    UPLOAD_AVATAR: (id: string) => `/menu-item/${id}/upload-avatar`,
};