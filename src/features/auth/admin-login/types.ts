export interface IAdminLoginDto {
    phoneNumber: string;
    password: string;
}

export interface IAdminLoginResponse {
    requires2FA: boolean;
    adminId?: string;
    message?: string;
    accessToken?: string;
    refreshToken?: string;
    role?: "SUPER_ADMIN" | "ADMIN";
}