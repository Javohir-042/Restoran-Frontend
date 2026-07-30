import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/config/request";
import { STAFF_API } from "./api.staff";
import type { IStaff, ICreateStaffDto, IUpdateStaffDto } from "./types";
import type { IApiResponse, AxiosErrorResponse } from "@/types/types";
import { toast } from "sonner";

const getErrorMsg = (error: AxiosErrorResponse, fallback: string) => {
  const msg = error.response?.data?.error?.message;
  return typeof msg === "string" ? msg : fallback;
};

export const useStaffList = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: () =>
      API.get<IApiResponse<IStaff[]>>(STAFF_API.LIST).then((res) => res.data.data),
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { data: ICreateStaffDto; avatar?: File }) => {
      const formData = new FormData();
      formData.append("firstName", payload.data.firstName);
      formData.append("lastName", payload.data.lastName);
      if (payload.data.phoneNumber) formData.append("phoneNumber", payload.data.phoneNumber);
      formData.append("pinCode", payload.data.pinCode);
      formData.append("role", payload.data.role);
      if (payload.avatar) formData.append("avatar", payload.avatar);

      return API.post(STAFF_API.CREATE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Xodim muvaffaqiyatli qo'shildi");
    },
    onError: (error: AxiosErrorResponse) => {
      toast.error(getErrorMsg(error, "Xodim qo'shishda xatolik"));
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateStaffDto }) =>
      API.patch(STAFF_API.BY_ID(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Ma'lumotlar yangilandi");
    },
    onError: (error: AxiosErrorResponse) => {
      toast.error(getErrorMsg(error, "Yangilashda xatolik"));
    },
  });
};

export const useChangePin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newPin }: { id: string; newPin: string }) =>
      API.patch(STAFF_API.CHANGE_PIN(id), { newPin }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("PIN kod yangilandi");
    },
    onError: (error: AxiosErrorResponse) => {
      toast.error(getErrorMsg(error, "PIN o'zgartirishda xatolik"));
    },
  });
};

export const useToggleStaffActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => API.patch(STAFF_API.TOGGLE_ACTIVE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Holat o'zgartirildi");
    },
    onError: (error: AxiosErrorResponse) => {
      toast.error(getErrorMsg(error, "Holatni o'zgartirishda xatolik"));
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => API.delete(STAFF_API.BY_ID(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Xodim o'chirildi");
    },
    onError: (error: AxiosErrorResponse) => {
      toast.error(getErrorMsg(error, "O'chirishda xatolik"));
    },
  });
};

export const useUploadStaffAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("avatar", file);
      return API.patch(STAFF_API.UPLOAD_AVATAR(id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Rasm yuklandi");
    },
    onError: (error: AxiosErrorResponse) => {
      toast.error(getErrorMsg(error, "Rasm yuklashda xatolik"));
    },
  });
};
