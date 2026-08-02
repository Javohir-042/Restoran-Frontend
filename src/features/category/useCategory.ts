import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/config/request";
import { CATEGORY_API } from "./api.category";
import type { ICategory } from "./types";
import type { IApiResponse } from "@/types/types";

export const useCategoriesAdminList = () => {
    return useQuery({
        queryKey: ["category", "admin-all"],
        queryFn: () =>
            API.get<IApiResponse<ICategory[]>>(CATEGORY_API.LIST_ADMIN).then((res) => res.data.data),
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { name: string; nameRu: string }) =>
            API.post<IApiResponse<ICategory>>(CATEGORY_API.CREATE, data).then((res) => res.data.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["category", "admin-all"] });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name: string; nameRu: string } }) =>
            API.put<IApiResponse<ICategory>>(CATEGORY_API.BY_ID(id), data).then((res) => res.data.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["category", "admin-all"] });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            API.delete<IApiResponse<null>>(CATEGORY_API.BY_ID(id)).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["category", "admin-all"] });
        },
    });
};