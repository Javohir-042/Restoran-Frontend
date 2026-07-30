import { useQuery } from "@tanstack/react-query";
import API from "@/config/request";

export const useOpenBills = () => {
  return useQuery({
    queryKey: ["bills", "open"],
    queryFn: async () => {
      const { data } = await API.get("/bill/open");
      return data.data || [];
    },
  });
};