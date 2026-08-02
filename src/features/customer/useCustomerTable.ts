import { useQuery } from "@tanstack/react-query";
import API from "@/config/request";
import { CUSTOMER_API } from "./api.customer";
import type { ITableInfo, IBillInfo } from "./types";
import type { IApiResponse } from "@/types/types";

export const useTableInfo = (tableId: string | undefined) => {
    return useQuery({
        queryKey: ["customer", "table", tableId],
        queryFn: () =>
            API.get<IApiResponse<ITableInfo>>(CUSTOMER_API.TABLE(tableId!)).then((r) => r.data.data),
        enabled: !!tableId,
    });
};

export const useOpenBillForTable = (tableId: string | undefined) => {
    return useQuery({
        queryKey: ["customer", "bill", tableId],
        queryFn: () =>
            API.get<IApiResponse<IBillInfo>>(CUSTOMER_API.BILL_BY_TABLE(tableId!))
                .then((r) => r.data.data)
                .catch(() => null),
        enabled: !!tableId,
        retry: false,
    });
};
