import { useMemo, useState } from "react";
import { useReports } from "@/features/reports/useReports";
import type { ReportPeriod } from "@/features/reports/useReports";
import { useStaffList } from "@/features/staff/useStaff";
import { useMenuItemsAdminList } from "@/features/menu-item/useMenuItemAdmin";
import { useOpenBills } from "@/features/bill/useBill";
import { getImageUrl } from "@/lib/get-image-url";
import type { IStaff } from "@/features/staff/types";
import type { ITopItem } from "@/features/reports/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useLanguage } from "@/context/LanguageContext";
import {
  CalendarDays,
  DollarSign,
  Receipt,
  Users,
  BookOpen,
  MoreHorizontal,
  SlidersHorizontal,
} from "lucide-react";

/* ── Helpers ── */
const formatSom = (n: number) =>
  new Intl.NumberFormat("uz-UZ").format(n) + " so'm";

const dayLabel = (isoDate: string) => {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "Day";
  return d.toLocaleDateString("en-US", { weekday: "short" });
};

const roleLabel = (role: string) => {
  const map: Record<string, string> = {
    OFITSIANT: "Ofitsiant",
    OSHPAZ: "Oshpaz",
    KASSIR: "Kassir",
  };
  return map[role] || role;
};

const downloadCSV = (rows: { day: string; total: number }[]) => {
  const header = "Day,Revenue\n";
  const body = rows.map((r) => `${r.day},${r.total}`).join("\n");
  const blob = new Blob([header + body], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "weekly-revenue.csv";
  a.click();
  URL.revokeObjectURL(url);
};

/* ── Skeleton loader ── */
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-100 dark:bg-[#27272a] rounded-lg ${className}`} />
);

/* ── Stat Card ── */
interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  badge?: string;
  badgeBg?: string;
  isLoading?: boolean;
}

const StatCard = ({
  icon,
  iconBg,
  label,
  value,
  badge,
  badgeBg = "bg-gray-50 text-gray-500",
  isLoading,
}: StatCardProps) => (
  <div className="bg-white dark:bg-[#18181b] rounded-xl sm:rounded-2xl border border-gray-100 dark:border-[#27272a] p-3 sm:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors">
    <div className="flex items-center justify-between mb-2 sm:mb-3">
      <div
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center ${iconBg} dark:opacity-80`}
      >
        {icon}
      </div>
      {badge && (
        <span
          className={`text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full ${badgeBg} dark:bg-[#27272a] dark:text-[#d4d4d8]`}
        >
          {badge}
        </span>
      )}
    </div>
    <p className="text-[11px] sm:text-xs text-gray-500 dark:text-[#a1a1aa] mb-0.5 sm:mb-1">{label}</p>
    {isLoading ? (
      <Skeleton className="h-6 sm:h-7 w-20 sm:w-24" />
    ) : (
      <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-[#fafafa] truncate">{value}</p>
    )}
  </div>
);

/* ── Dashboard Component ── */
export const Dashboard = () => {
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>("week");
  const { todaySummary, chartData: chartQuery, topItems } = useReports(reportPeriod);
  const staffList = useStaffList();
  const menuItems = useMenuItemsAdminList();
  const openBills = useOpenBills();
  const { t, language } = useLanguage();

  /* Derived data */
  const activeStaff: IStaff[] = (staffList.data ?? []).filter(
    (s: IStaff) => s.isActive
  );

  const chartData = useMemo(() => {
    const raw = chartQuery.data ?? [];
    const result = [];
    const today = new Date();
    const tzOffsetMsCurrent = today.getTimezoneOffset() * 60000;
    const currentTodayIso = new Date(today.getTime() - tzOffsetMsCurrent).toISOString().slice(0, 10);

    if (reportPeriod === "week" || reportPeriod === "month") {
      const daysCount = reportPeriod === "week" ? 7 : 30;
      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        // Correctly handle local timezone for ISO string extraction
        const tzOffsetMs = d.getTimezoneOffset() * 60000;
        const localTimeMs = d.getTime() - tzOffsetMs;
        const iso = new Date(localTimeMs).toISOString().slice(0, 10);

        let dayText = "";
        if (reportPeriod === "week") {
          dayText = iso === currentTodayIso ? t("Bugun") : dayLabel(iso);
        } else {
          dayText = new Date(localTimeMs).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }

        const found = raw.find((r: any) => {
          if (!r.period) return false;
          const ds = new Date(r.period);
          const localIso = new Date(ds.getTime() - ds.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
          return localIso === iso;
        });
        result.push({
          day: dayText,
          total: found ? found.total : 0,
        });
      }
    } else if (reportPeriod === "year") {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(today);
        d.setMonth(d.getMonth() - i);
        // Ensure accurate local months calculation without timezone shifting error for monthly extraction
        const tzOffsetMs = d.getTimezoneOffset() * 60000;
        const localTimeMs = d.getTime() - tzOffsetMs;
        const isoMonth = new Date(localTimeMs).toISOString().slice(0, 7);

        const found = raw.find((r: any) => {
          if (!r.period) return false;
          const ds = new Date(r.period);
          const localIso = new Date(ds.getTime() - ds.getTimezoneOffset() * 60000).toISOString().slice(0, 7);
          return localIso === isoMonth;
        });
        result.push({
          day: new Date(localTimeMs).toLocaleDateString("en-US", { month: "short" }),
          total: found ? found.total : 0
        });
      }
    }
    return result;
  }, [chartQuery.data, reportPeriod]);
  const topItemsList: ITopItem[] = topItems.data ?? [];
  const allMenuItems = menuItems.data ?? [];

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 sm:pb-10">
      {/* ═══ Page Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-0">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#fafafa]">
            {t("Dashboard Overview")}
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-[#27272a] rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-600 dark:text-[#d4d4d8] shadow-sm self-start sm:self-auto font-medium transition-colors">
          <CalendarDays size={14} className="sm:w-[15px] sm:h-[15px] text-blue-500" />
          {(() => {
            const d = new Date();
            const day = d.getDate();
            const year = d.getFullYear();
            if (language === "uz") {
              const monthsUz = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
              return `${day}-${monthsUz[d.getMonth()]}, ${year}-yil`;
            } else {
              const monthsRu = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
              return `${day} ${monthsRu[d.getMonth()]}, ${year} г.`;
            }
          })()}
        </div>
      </div>

      {/* ═══ 4 Stat Cards ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={
            <DollarSign size={14} className="text-blue-600 sm:w-4 sm:h-4" />
          }
          iconBg="bg-blue-50"
          label={t("Today's Revenue")}
          value={formatSom(todaySummary.data?.totalRevenue ?? 0)}
          isLoading={todaySummary.isLoading}
        />
        <StatCard
          icon={
            <Receipt size={14} className="text-orange-600 sm:w-4 sm:h-4" />
          }
          iconBg="bg-orange-50"
          label={t("Open Bills")}
          value={(openBills.data ?? []).length}
          isLoading={openBills.isLoading}
        />
        <StatCard
          icon={<Users size={14} className="text-green-600 sm:w-4 sm:h-4" />}
          iconBg="bg-green-50"
          label={t("Active Staff")}
          value={activeStaff.length}
          badge={t("Full Shift")}
          badgeBg="bg-green-50 text-green-600"
          isLoading={staffList.isLoading}
        />
        <StatCard
          icon={
            <BookOpen size={14} className="text-purple-600 sm:w-4 sm:h-4" />
          }
          iconBg="bg-purple-50"
          label={t("Menu Items")}
          value={allMenuItems.length}
          badge={t("Stable")}
          badgeBg="bg-purple-50 text-purple-600"
          isLoading={menuItems.isLoading}
        />
      </div>

      {/* ═══ Revenue Chart ═══ */}
      <div className="bg-white dark:bg-[#18181b] rounded-xl sm:rounded-2xl border border-gray-100 dark:border-[#27272a] p-3 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa]">
              {t("Revenue Analysis")}
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
              {t("Performance comparison over time")}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex bg-gray-100 dark:bg-[#27272a] p-1 rounded-lg">
              <button
                onClick={() => setReportPeriod("week")}
                className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-md transition-colors ${reportPeriod === "week" ? "bg-white dark:bg-[#27272a] text-gray-900 dark:text-[#fafafa] shadow-sm font-medium" : "text-gray-500 dark:text-[#a1a1aa] hover:text-gray-700 dark:hover:text-gray-200"}`}
              >
                {t("Week")}
              </button>
              <button
                onClick={() => setReportPeriod("month")}
                className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-md transition-colors ${reportPeriod === "month" ? "bg-white dark:bg-[#27272a] text-gray-900 dark:text-[#fafafa] shadow-sm font-medium" : "text-gray-500 dark:text-[#a1a1aa] hover:text-gray-700 dark:hover:text-gray-200"}`}
              >
                {t("Month")}
              </button>
              <button
                onClick={() => setReportPeriod("year")}
                className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-md transition-colors ${reportPeriod === "year" ? "bg-white dark:bg-[#27272a] text-gray-900 dark:text-[#fafafa] shadow-sm font-medium" : "text-gray-500 dark:text-[#a1a1aa] hover:text-gray-700 dark:hover:text-gray-200"}`}
              >
                {t("Year")}
              </button>
            </div>
            <button
              onClick={() => downloadCSV(chartData)}
              className="text-xs border border-gray-200 dark:border-[#27272a] rounded-lg px-2.5 sm:px-3 py-1.5 text-gray-600 dark:text-[#d4d4d8] hover:bg-gray-50 dark:hover:bg-[#27272a] transition-colors hidden sm:block"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="h-40 sm:h-56">
          {chartQuery.isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-gray-400">
              {t("Mavjud emas")}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="#2563eb"
                      stopOpacity={0.15}
                    />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  interval="preserveStartEnd"
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: 12,
                    padding: "8px 12px",
                  }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value) => [
                    formatSom(Number(value) || 0),
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fill="url(#revGrad)"
                  dot={{
                    r: 3,
                    fill: "#2563eb",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 5,
                    fill: "#2563eb",
                    stroke: "#fff",
                    strokeWidth: 3,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ═══ Bottom Grid — Staff + Top Items ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* ─── Active Staff Directory ─── */}
        <div className="bg-white dark:bg-[#18181b] rounded-xl sm:rounded-2xl border border-gray-100 dark:border-[#27272a] p-3 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa]">
              {t("Active Staff Directory")}
            </h3>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {staffList.isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 sm:w-9 sm:h-9 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-3.5 w-28 mb-1.5" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activeStaff.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">
                {t("Faol xodimlar topilmadi")}
              </p>
            ) : (
              activeStaff.slice(0, 5).map((staff: IStaff) => (
                <div
                  key={staff.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                      {staff.avatarUrl ? (
                        <img
                          src={getImageUrl(staff.avatarUrl)!}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-semibold text-gray-500">
                          {staff.firstName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-[#f4f4f5] truncate">
                        {staff.firstName} {staff.lastName}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-400 dark:text-[#71717a] truncate">
                        {t(roleLabel(staff.role))}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium bg-green-50 text-green-600 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0 whitespace-nowrap">
                    {t("On Duty")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ─── Top Selling Items ─── */}
        <div className="bg-white dark:bg-[#18181b] rounded-xl sm:rounded-2xl border border-gray-100 dark:border-[#27272a] p-3 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none transition-colors">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa]">
              {t(language === "uz" ? "Top sotilgan taomlar" : "Популярные блюда")}
            </h3>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <SlidersHorizontal size={15} />
            </button>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {topItems.isLoading || menuItems.isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-3.5 w-28 mb-1.5" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : topItemsList.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">
                {t("Hozircha ma'lumot yo'q")}
              </p>
            ) : (
              topItemsList.slice(0, 4).map((item: ITopItem) => {
                const fullItem = allMenuItems.find(
                  (m: { id: string }) => m.id === item.menuItemId,
                );
                const unitPrice =
                  item.totalQuantity > 0
                    ? item.totalRevenue / item.totalQuantity
                    : 0;

                return (
                  <div
                    key={item.menuItemId}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                        {fullItem?.avatarUrl ? (
                          <img
                            src={getImageUrl(fullItem.avatarUrl)!}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-sm">🍽️</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-[#f4f4f5] truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400 dark:text-[#71717a] truncate">
                          {item.totalQuantity} {t(language === "uz" ? "ta buyurtma" : "заказов")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-[#f4f4f5]">
                        {formatSom(unitPrice)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};