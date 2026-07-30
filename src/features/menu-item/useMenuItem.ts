import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/config/request";
import { MENU_ITEM_API } from "./api.menu-item";
import type { IMenuItem, ICreateMenuItemDto, IUpdateMenuItemDto } from "./types";
import type { IApiResponse, AxiosErrorResponse } from "@/types/types";
import { toast } from "sonner";

const getErrorMsg = (error: AxiosErrorResponse, fallback: string) => {
    const msg = error.response?.data?.error?.message;
    return typeof msg === "string" ? msg : fallback;
};

export const useMenuItemsAdminList = () => {
    return useQuery({
        queryKey: ["menu-item", "admin-all"],
        queryFn: () =>
            API.get<IApiResponse<IMenuItem[]>>(MENU_ITEM_API.LIST_ADMIN).then((res) => res.data.data),
    });
};

export const useCreateMenuItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { data: ICreateMenuItemDto; avatar?: File }) => {
            const formData = new FormData();
            formData.append("name", payload.data.name);
            formData.append("nameRu", payload.data.nameRu);
            if (payload.data.description) formData.append("description", payload.data.description);
            formData.append("price", String(payload.data.price));
            formData.append("categoryId", payload.data.categoryId);
            if (payload.avatar) formData.append("avatar", payload.avatar);

            return API.post(MENU_ITEM_API.CREATE, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menu-item"] });
            toast.success("Taom qo'shildi");
        },
        onError: (error: AxiosErrorResponse) => toast.error(getErrorMsg(error, "Taom qo'shishda xatolik")),
    });
};

export const useUpdateMenuItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: IUpdateMenuItemDto }) =>
            API.patch(MENU_ITEM_API.BY_ID(id), data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menu-item"] });
            toast.success("Taom yangilandi");
        },
        onError: (error: AxiosErrorResponse) => toast.error(getErrorMsg(error, "Yangilashda xatolik")),
    });
};

export const useToggleMenuItemAvailability = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => API.patch(MENU_ITEM_API.TOGGLE_AVAILABILITY(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menu-item"] });
            toast.success("Holat o'zgartirildi");
        },
        onError: (error: AxiosErrorResponse) => toast.error(getErrorMsg(error, "Xatolik")),
    });
};

export const useDeleteMenuItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => API.delete(MENU_ITEM_API.BY_ID(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menu-item"] });
            toast.success("Taom o'chirildi");
        },
        onError: (error: AxiosErrorResponse) => toast.error(getErrorMsg(error, "O'chirishda xatolik")),
    });
};


export const useUploadMenuItemAvatar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, file }: { id: string; file: File }) => {
            const formData = new FormData();
            formData.append("avatar", file);
            return API.patch(MENU_ITEM_API.UPLOAD_AVATAR(id), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menu-item"] });
            toast.success("Rasm yuklandi");
        },
        onError: (error: AxiosErrorResponse) => toast.error(getErrorMsg(error, "Rasm yuklashda xatolik")),
    });
};