export type TUserRole = "SUPER_ADMIN" | "ADMIN" | "KASSIR" | "OFITSIANT" | "OSHPAZ";

export interface IApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

export interface AxiosErrorResponse {
    response?: {
        status: number;
        data: {
            statusCode: number;
            error: {
                message: string | string[];
            };
        };
    };
    message: string;
}