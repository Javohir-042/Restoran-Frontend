export type TStaffRole = "KASSIR" | "OFITSIANT" | "OSHPAZ";

export interface IStaff {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    avatarUrl: string | null;
    role: TStaffRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateStaffDto {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    pinCode: string;
    role: TStaffRole;
}

export interface IUpdateStaffDto {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    role?: TStaffRole;
}