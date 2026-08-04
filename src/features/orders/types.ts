export type TBillStatus = "OCHIQ" | "TOLANDI";
export type TOrderItemStatus = "YANGI" | "TAYYORLANMOQDA" | "TAYYOR" | "YETKAZILDI";

export interface ITable {
    id: string;
    tableNumber: number;
    capacity: number;
    status: string;
}

export interface IStaffRef {
    id: string;
    firstName: string;
    lastName: string;
}

export interface IBill {
    id: string;
    status: TBillStatus;
    totalAmount: number;
    table: ITable | null;
    openedByStaff: IStaffRef | null;
    orderItems?: IOrderItem[];
    createdAt: string;
    updatedAt: string;
}

export interface IMenuItemRef {
    id: string;
    name: string;
    price: number;
}

export interface IOrderItem {
    id: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    status: TOrderItemStatus;
    menuItem: IMenuItemRef;
    createdAt: string;
}

/** Composite row used by the Orders page */
export interface IOrderRow {
    bill: IBill;
    items: IOrderItem[];
    itemsCount: number;
    itemsLabel: string;
    staffName: string;
    staffInitials: string;
    computedStatus: string;
}
