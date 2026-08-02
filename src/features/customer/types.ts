export interface ITableInfo {
    id: string;
    tableNumber: number;
    status: "BOSH" | "BAND" | "REZERV";
}

export interface ICategory {
    id: string;
    name: string;
    nameRu: string;
    avatarUrl: string | null;
}

export interface IMenuItem {
    id: string;
    name: string;
    nameRu: string;
    description: string | null;
    price: number;
    avatarUrl: string | null;
    isAvailable: boolean;
    categoryId: string;
}

export interface IBillInfo {
    id: string;
    tableId: string;
    status: "OCHIQ" | "TOLANDI";
    serviceFeePercent: number;
    subtotal: number;
    totalAmount: number;
}

export type TOrderItemStatus = "YANGI" | "TAYYORLANMOQDA" | "TAYYOR" | "YETKAZILDI";

export interface IOrderItem {
    id: string;
    quantity: number;
    priceAtOrder: number;
    status: TOrderItemStatus;
    menuItem: { id: string; name: string; avatarUrl: string | null };
    createdAt: string;
}

export interface ICartLine {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
}
