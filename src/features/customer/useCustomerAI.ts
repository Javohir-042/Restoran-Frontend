import { useMutation } from "@tanstack/react-query";
import API from "@/config/request";
import { CUSTOMER_API } from "./api.customer";
import type { IMenuItem } from "./types";
import type { IApiResponse } from "@/types/types";

interface IAiResponse {
    reply: string;
    items: IMenuItem[];
}

export const useAskAI = () => {
    return useMutation({
        mutationFn: (message: string) =>
            API.post<IApiResponse<IAiResponse>>(CUSTOMER_API.AI_ASK, { message }).then(
                (r) => r.data.data,
            ),
    });
};
