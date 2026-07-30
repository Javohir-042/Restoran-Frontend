import { useQuery } from "@tanstack/react-query";
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