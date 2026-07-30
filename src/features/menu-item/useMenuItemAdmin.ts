import { useQuery } from "@tanstack/react-query";
import API from "@/config/request";

export const useMenuItemsAdminList = () => {
  return useQuery({
    queryKey: ["menu-items", "admin"],
    queryFn: async () => {
      const { data } = await API.get("/menu-item/admin/all");
      return data.data || [];
    },
  });
};