export interface ICustomerTable {
    id: string;
    tableNumber: number;
    status: "BOSH" | "BAND" | "REZERV";
}

export interface ICustomerCategory {
    id: string;
    name: string;
    nameRu: string;
    avatarUrl: string | null;
}

export interface ICustomerMenuItem {
    id: string;
    name: string;
    nameRu: string;
    description: string | null;
    price: number;
    avatarUrl: string | null;
    isAvailable: boolean;
    categoryId: string;
}

export interface ICustomerBill {
    id: string;
    tableId: string;
    status: "OCHIQ" | "TOLANDI";
    serviceFeePercent: number;
    subtotal: number;
    totalAmount: number;
}

export type TOrderItemStatus = "YANGI" | "TAYYORLANMOQDA" | "TAYYOR" | "YETKAZILDI";

export interface ICustomerOrderItem {
    id: string;
    quantity: number;
    priceAtOrder: number;
    status: TOrderItemStatus;
    menuItem: { id: string; name: string; avatarUrl: string | null };
    createdAt: string;
}

export interface ICartItem {
    id: string;
    name: string;
    price: number | string;
    cartQuantity: number;
    avatarUrl?: string | null;
}

export interface ICartLine {
    menuItemId: string;
    name: string;
    price: number | string;
    quantity: number;
    avatarUrl?: string | null;
}

// ALIASES for backward compatibility with existing components
export type ICategory = ICustomerCategory;
export type IMenuItem = ICustomerMenuItem;
export type ITableInfo = ICustomerTable;
export type IBillInfo = ICustomerBill;
export type IOrderItem = ICustomerOrderItem;
