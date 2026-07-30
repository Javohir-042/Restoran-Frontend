import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/config/request";
import { TABLE_API } from "./api.table";
import type { IApiResponse, AxiosErrorResponse } from "@/types/types";
import { toast } from "sonner";
import type { ITable, ICreateTableDto, IBulkCreateTableDto, IReserveTableDto } from "./types";

const getErrorMsg = (error: AxiosErrorResponse, fallback: string) => {
    const msg = error.response?.data?.error?.message;
    return typeof msg === "string" ? msg : fallback;
};

export const useTables = () => {
    return useQuery({
        queryKey: ["restaurant-table"],
        queryFn: () =>
            API.get<IApiResponse<ITable[]>>(TABLE_API.LIST).then((res) => res.data.data),
    });
};

export const useCreateTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ICreateTableDto) => API.post(TABLE_API.CREATE, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["restaurant-table"] });
            toast.success("Stol qo'shildi");
        },
        onError: (error: AxiosErrorResponse) => {
            toast.error(getErrorMsg(error, "Stol qo'shishda xatolik"));
        },
    });
};

export const useBulkCreateTables = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IBulkCreateTableDto) => API.post(TABLE_API.BULK_CREATE, data),
        onSuccess: (res: any) => {
            queryClient.invalidateQueries({ queryKey: ["restaurant-table"] });
            toast.success(res.data?.data?.message ?? "Stollar qo'shildi");
        },
        onError: (error: AxiosErrorResponse) => {
            toast.error(getErrorMsg(error, "Stollarni qo'shishda xatolik"));
        },
    });
};

export const useDeleteTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => API.delete(TABLE_API.BY_ID(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["restaurant-table"] });
            toast.success("Stol o'chirildi");
        },
        onError: (error: AxiosErrorResponse) => {
            toast.error(getErrorMsg(error, "Faqat bo'sh stolni o'chirish mumkin"));
        },
    });
};



export const useReserveTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: IReserveTableDto }) =>
            API.patch(TABLE_API.RESERVE(id), data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["restaurant-table"] });
            toast.success("Stol rezerv qilindi");
        },
        onError: (error: AxiosErrorResponse) => toast.error(getErrorMsg(error, "Rezervatsiyada xatolik")),
    });
};

export const useCancelReservation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => API.patch(TABLE_API.CANCEL_RESERVATION(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["restaurant-table"] });
            toast.success("Rezervatsiya bekor qilindi");
        },
        onError: (error: AxiosErrorResponse) => toast.error(getErrorMsg(error, "Bekor qilishda xatolik")),
    });
};

export const useMarkArrived = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => API.patch(TABLE_API.ARRIVED(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["restaurant-table"] });
            toast.success("Mehmon keldi — stol band qilindi");
        },
        onError: (error: AxiosErrorResponse) => toast.error(getErrorMsg(error, "Xatolik")),
    });
};