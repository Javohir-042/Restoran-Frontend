export interface ICashierBill {
    id: string;
    status: string;
    subtotal: string;
    totalAmount: string;
    serviceFeePercent: string;
    table?: {
        id: string;
        tableNumber: number;
    };
}

export interface ICashierOrderItem {
    id: string;
    status: "YANGI" | "TAYYORLANMOQDA" | "TAYYOR" | "YETKAZILDI";
    quantity: number;
    priceAtOrder: string;
    menuItem: {
        id: string;
        name: string;
    };
}

export interface IPaymentSummary {
    totalBilled: number;
    totalPaid: number;
    remaining: number;
}
