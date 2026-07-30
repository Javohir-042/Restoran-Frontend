import { useReports } from "@/features/reports/useReports";
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
    <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
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
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center ${iconBg}`}
            >
                {icon}
            </div>
            {badge && (
                <span
                    className={`text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full ${badgeBg}`}
                >
                    {badge}
                </span>
            )}
        </div>
        <p className="text-[11px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">{label}</p>
        {isLoading ? (
            <Skeleton className="h-6 sm:h-7 w-20 sm:w-24" />
        ) : (
            <p className="text-base sm:text-xl font-bold text-gray-900 truncate">{value}</p>
        )}
    </div>
);

/* ── Dashboard Component ── */
export const Dashboard = () => {
    const { todaySummary, weeklyRevenue, topItems } = useReports();
    const staffList = useStaffList();
    const menuItems = useMenuItemsAdminList();
    const openBills = useOpenBills();

    /* Derived data */
    const activeStaff: IStaff[] = (staffList.data ?? []).filter(
        (s: IStaff) => s.isActive
    );
    const chartData = (weeklyRevenue.data ?? []).map(
        (row: { period: string; total: number }) => ({
            day: dayLabel(row.period),
            total: row.total,
        })
    );
    const topItemsList: ITopItem[] = topItems.data ?? [];
    const allMenuItems = menuItems.data ?? [];

    return (
      <div className="space-y-4 sm:space-y-6 pb-6 sm:pb-10">
        {/* ═══ Page Header ═══ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-0">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Real-time performance and operational metrics for tonight's
              service.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-600 shadow-sm self-start sm:self-auto">
            <CalendarDays size={14} className="sm:w-[15px] sm:h-[15px]" />
            {new Date().toLocaleDateString("uz-UZ", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        {/* ═══ 4 Stat Cards ═══ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={
              <DollarSign size={14} className="text-blue-600 sm:w-4 sm:h-4" />
            }
            iconBg="bg-blue-50"
            label="Today's Revenue"
            value={formatSom(todaySummary.data?.totalRevenue ?? 0)}
            isLoading={todaySummary.isLoading}
          />
          <StatCard
            icon={
              <Receipt size={14} className="text-orange-600 sm:w-4 sm:h-4" />
            }
            iconBg="bg-orange-50"
            label="Open Bills"
            value={(openBills.data ?? []).length}
            isLoading={openBills.isLoading}
          />
          <StatCard
            icon={<Users size={14} className="text-green-600 sm:w-4 sm:h-4" />}
            iconBg="bg-green-50"
            label="Active Staff"
            value={activeStaff.length}
            badge="Full Shift"
            badgeBg="bg-green-50 text-green-600"
            isLoading={staffList.isLoading}
          />
          <StatCard
            icon={
              <BookOpen size={14} className="text-purple-600 sm:w-4 sm:h-4" />
            }
            iconBg="bg-purple-50"
            label="Menu Items"
            value={allMenuItems.length}
            badge="Stable"
            badgeBg="bg-purple-50 text-purple-600"
            isLoading={menuItems.isLoading}
          />
        </div>

        {/* ═══ Weekly Revenue Chart ═══ */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Weekly Revenue Analysis
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                Performance comparison over the last 7 days
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => downloadCSV(chartData)}
                className="text-xs border border-gray-200 rounded-lg px-2.5 sm:px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors flex-1 sm:flex-none"
              >
                Export CSV
              </button>
              <button className="text-xs bg-blue-600 text-white rounded-lg px-2.5 sm:px-3 py-1.5 hover:bg-blue-700 transition-colors flex-1 sm:flex-none">
                View Report
              </button>
            </div>
          </div>

          <div className="h-40 sm:h-56">
            {weeklyRevenue.isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">
                Ma'lumot mavjud emas
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
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Active Staff Directory
              </h3>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
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
                  Faol xodimlar topilmadi
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
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {staff.firstName} {staff.lastName}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                          {roleLabel(staff.role)}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium bg-green-50 text-green-600 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0 whitespace-nowrap">
                      On Duty
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ─── Top Selling Items ─── */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Top Selling Items
              </h3>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
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
                  Hozircha ma'lumot yo'q
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
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                            {item.totalQuantity} orders tonight
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">
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