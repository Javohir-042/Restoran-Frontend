export type TTableStatus = "BOSH" | "BAND" | "REZERV";

export interface ITable {
    id: string;
    tableNumber: number;
    qrCodeUrl: string | null;
    status: TTableStatus;
    capacity: number;
    section: string | null;
    isVip: boolean;
    reservedAt: string | null;
    reservationGuestName: string | null;
    reservationGuestPhone: string | null;
}

export interface ICreateTableDto {
    tableNumber: number;
    capacity?: number;
    section?: string;
    isVip?: boolean;
}

export interface IBulkCreateTableDto {
    from: number;
    to: number;
}

export interface IReserveTableDto {
    reservedAt: string;
    guestName: string;
    guestPhone?: string;
}