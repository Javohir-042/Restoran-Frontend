export interface IKitchenOrderItem {
    id: string;
    quantity: number;
    status: "YANGI" | "TAYYORLANMOQDA" | "TAYYOR" | "YETKAZILDI";
    createdAt: string;
    item?: {
        id: string;
        name: string;
        nameRu?: string;
    };
    menuItem?: {
        id: string;
        name: string;
        nameRu?: string;
        avatarUrl?: string; // added to match what gets returned
        category?: {
            id: string;
            name: string;
        }
    };
    order?: {
        id: string;
        table?: {
            id: string;
            number: number;
        };
    };
    bill?: {
        id: string;
        table?: {
            id: string;
            tableNumber: number;
        };
    };
}
