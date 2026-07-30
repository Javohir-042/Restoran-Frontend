import { useQuery } from "@tanstack/react-query";
import API from "@/config/request";

const toISO = (d: Date) => d.toISOString().slice(0, 10);

export const useReports = () => {
  const today = toISO(new Date());
  const weekAgo = toISO(new Date(Date.now() - 6 * 86_400_000));

  const todaySummary = useQuery({
    queryKey: ["reports", "summary", today],
    queryFn: async () => {
      const { data } = await API.get(
        `/reports/summary?from=${today}&to=${today}`
      );
      return data.data || { totalRevenue: 0, totalBills: 0, averageCheck: 0 };
    },
  });

  const weeklyRevenue = useQuery({
    queryKey: ["reports", "revenue", "daily", weekAgo, today],
    queryFn: async () => {
      const { data } = await API.get(
        `/reports/revenue/daily?from=${weekAgo}&to=${today}`
      );
      return data.data || [];
    },
  });

  const topItems = useQuery({
    queryKey: ["reports", "top-items"],
    queryFn: async () => {
      const { data } = await API.get("/reports/top-items?limit=4");
      return data.data || [];
    },
  });

  return { todaySummary, weeklyRevenue, topItems };
};