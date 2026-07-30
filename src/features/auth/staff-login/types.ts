export interface IStaffLoginDto {
    pinCode: string;
}

export interface IStaffLoginResponse {
    accessToken: string;
    role: "KASSIR" | "OFITSIANT" | "OSHPAZ";
    firstName: string;
}