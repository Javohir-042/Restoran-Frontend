import { useQuery } from "@tanstack/react-query";
import API from "@/config/request";
import { CUSTOMER_API } from "./api.customer";
import type { ICategory, IMenuItem } from "./types";
import type { IApiResponse } from "@/types/types";

export const useCustomerCategories = () => {
    return useQuery({
        queryKey: ["customer", "categories"],
        queryFn: () =>
            API.get<IApiResponse<ICategory[]>>(CUSTOMER_API.CATEGORIES).then((r) => r.data.data),
    });
};

export const useCustomerMenuItems = (categoryId?: string, search?: string) => {
    return useQuery({
        queryKey: ["customer", "menu-items", categoryId, search],
        queryFn: () =>
            API.get<IApiResponse<IMenuItem[]>>(CUSTOMER_API.MENU_ITEMS, {
                params: { categoryId: categoryId || undefined, search: search || undefined },
            }).then((r) => r.data.data),
    });
};
