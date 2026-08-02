export interface IWaiterOrderItem {
    id: string;
    quantity: number;
    priceAtOrder: string;
    status: "YANGI" | "TAYYORLANMOQDA" | "TAYYOR" | "YETKAZILDI";
    createdAt: string;
    menuItem: {
        id: string;
        name: string;
        nameRu?: string;
        price: string;
        category?: {
            id: string;
            name: string;
        }
    };
    bill: {
        id: string;
        table?: {
            id: string;
            tableNumber: number;
        };
    };
}

export interface IBill {
    id: string;
    status: string;
    subtotal: string;
    totalAmount: string;
    tableId: string;
}
