import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/config/request";
import type { IApiResponse, AxiosErrorResponse } from "@/types/types";
import type {
  IMenuItem,
  ICreateMenuItemDto,
  IUpdateMenuItemDto,
} from "./types";
import { toast } from "sonner";

const getErrorMsg = (error: AxiosErrorResponse, fallback: string) => {
  const msg = error.response?.data?.error?.message;
  return typeof msg === "string" ? msg : fallback;
};

// 1. Admin uchun barcha taomlar
export const useMenuItemsAdminList = () => {
  return useQuery({
    queryKey: ["menu-items", "admin"],
    queryFn: async () => {
      const { data } = await API.get<IApiResponse<IMenuItem[]>>("/menu-item/admin/all");
      return data.data || [];
    },
  });
};

// 2. Oddiy taomlar (Mijoz uchun)
export const useMenuItems = () => {
  return useQuery({
    queryKey: ["menu-items", "public"],
    queryFn: async () => {
      const { data } = await API.get<IApiResponse<IMenuItem[]>>("/menu-item");
      return data.data || [];
    },
  });
};

// 3. Taom qo'shish
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
      avatar,
    }: {
      data: ICreateMenuItemDto;
      avatar?: File;
    }) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
      if (avatar) {
        formData.append("avatar", avatar);
      }
      const res = await API.post<IApiResponse<null>>("/menu-item", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items", "admin"] });
      toast.success("Taom muvaffaqiyatli qo'shildi");
    },
    onError: (error: AxiosErrorResponse) =>
      toast.error(getErrorMsg(error, "Xatolik yuz berdi")),
  });
};

// 4. Taomni tahrirlash (faqat matnlar)
export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IUpdateMenuItemDto }) => {
      const res = await API.patch<IApiResponse<null>>(`/menu-item/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items", "admin"] });
      toast.success("Taom ma'lumotlari yangilandi");
    },
    onError: (error: AxiosErrorResponse) =>
      toast.error(getErrorMsg(error, "Xatolik yuz berdi")),
  });
};

// 5. Taom rasmini yuklash
export const useUploadMenuItemAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await API.patch<IApiResponse<null>>(
        `/menu-item/${id}/upload-avatar`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items", "admin"] });
      toast.success("Rasm yuklandi");
    },
    onError: (error: AxiosErrorResponse) =>
      toast.error(getErrorMsg(error, "Xatolik yuz berdi")),
  });
};

// 6. Taom holatini o'zgartirish
export const useToggleMenuItemAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await API.patch<IApiResponse<null>>(
        `/menu-item/${id}/toggle-availability`,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items", "admin"] });
      toast.success("Taom holati o'zgardi");
    },
    onError: (error: AxiosErrorResponse) =>
      toast.error(getErrorMsg(error, "Xatolik yuz berdi")),
  });
};

// 7. Taomni o'chirish
export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await API.delete<IApiResponse<null>>(`/menu-item/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items", "admin"] });
      toast.success("Taom o'chirildi");
    },
    onError: (error: AxiosErrorResponse) =>
      toast.error(getErrorMsg(error, "Xatolik yuz berdi")),
  });
};