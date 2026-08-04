import { useQuery } from "@tanstack/react-query";
import API from "@/config/request";

const toISO = (d: Date) => {
  const tzOffsetMs = d.getTimezoneOffset() * 60000;
  const localTimeMs = d.getTime() - tzOffsetMs;
  return new Date(localTimeMs).toISOString().slice(0, 10);
};

export type ReportPeriod = "week" | "month" | "year";

export const useReports = (period: ReportPeriod = "week") => {
  const today = toISO(new Date());

  const todaySummary = useQuery({
    queryKey: ["reports", "summary", today],
    queryFn: async () => {
      const { data } = await API.get(
        `/reports/summary?from=${today}&to=${today}`
      );
      return data.data || { totalRevenue: 0, totalBills: 0, averageCheck: 0 };
    },
  });

  const chartQuery = useQuery({
    queryKey: ["reports", "chart", period, today],
    queryFn: async () => {
      if (period === "week") {
        const weekAgo = toISO(new Date(Date.now() - 6 * 86_400_000));
        const { data } = await API.get(`/reports/revenue/daily?from=${weekAgo}&to=${today}`);
        return data.data || [];
      } else if (period === "month") {
        const monthAgo = toISO(new Date(Date.now() - 29 * 86_400_000));
        const { data } = await API.get(`/reports/revenue/daily?from=${monthAgo}&to=${today}`);
        return data.data || [];
      } else {
        const lastYear = new Date();
        lastYear.setMonth(lastYear.getMonth() - 11);
        lastYear.setDate(1);
        const yearAgo = toISO(lastYear);
        const { data } = await API.get(`/reports/revenue/monthly?from=${yearAgo}&to=${today}`);
        return data.data || [];
      }
    },
  });

  const topItems = useQuery({
    queryKey: ["reports", "top-items"],
    queryFn: async () => {
      const { data } = await API.get("/reports/top-items?limit=4");
      return data.data || [];
    },
  });

  return { todaySummary, chartData: chartQuery, topItems };
};