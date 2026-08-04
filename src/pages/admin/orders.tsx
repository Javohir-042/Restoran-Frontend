import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Plus,
  ClipboardList,
  Clock,
  UtensilsCrossed,
  CheckCircle,
  Eye,
  Pencil,
  XCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import {
  useOrdersList,
  useRestaurantTables,
  useCancelBill,
} from "@/features/orders/useOrders";
import { useReports } from "@/features/reports/useReports";
import type { IOrderRow } from "@/features/orders/types";
import type { ITopItem } from "@/features/reports/types";
import { useLanguage } from "@/context/LanguageContext";

import { CreateOrderModal } from "@/features/orders/CreateOrderModal";
import { ViewOrderModal } from "@/features/orders/ViewOrderModal";
import { EditOrderModal } from "@/features/orders/EditOrderModal";

/* ── Constants ── */
const PAGE_SIZE = 10;

const STATUS_STYLES: Record<string, string> = {
  Yangi: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
  Tayyorlanmoqda: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
  Tayyor: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Yakunlangan: "bg-gray-100 dark:bg-[#27272a] text-gray-500 dark:text-[#a1a1aa]",
};

/* ── Helpers ── */
const formatSom = (n: number) =>
  new Intl.NumberFormat("uz-UZ").format(n) + " UZS";

const formatTime = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
};

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
);

const StatusBadge = ({ status }: { status: string }) => {
  const { t } = useLanguage();
  return (
    <span
      className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[status] ?? "bg-gray-100 dark:bg-[#27272a] text-gray-500 dark:text-[#a1a1aa]"}`}
    >
      {t(status)}
    </span>
  );
};

/* ── Main Page ── */
export const OrdersPage = () => {
  const { data: allOrders, isLoading } = useOrdersList();
  const { data: tables = [] } = useRestaurantTables();
  const cancelBill = useCancelBill();
  const { todaySummary, topItems: topItemsQuery } = useReports();
  const { t } = useLanguage();

  /* ── Filters ── */
  const [dateFilter, setDateFilter] = useState("");
  const [tableFilter, setTableFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchFilter, setSearchFilter] = useState(initialSearch);

  useEffect(() => {
    const s = searchParams.get("search");
    if (s !== null) {
      setSearchFilter(s);
    }
  }, [searchParams]);

  const [page, setPage] = useState(1);

  /* ── Modals ── */
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState<IOrderRow | null>(null);
  const [editOrder, setEditOrder] = useState<IOrderRow | null>(null);

  /* ── Derived data ── */
  const filtered = useMemo(() => {
    let result = allOrders;

    if (searchFilter) {
      const lower = searchFilter.toLowerCase();
      result = result.filter(o =>
        String(o.bill.id).includes(lower) ||
        (o.bill.table?.tableNumber && String(o.bill.table.tableNumber).includes(lower)) ||
        o.items.some(i => i.menuItem.name.toLowerCase().includes(lower))
      );
    }

    if (dateFilter) {
      result = result.filter((o) => o.bill.createdAt.startsWith(dateFilter));
    }
    if (tableFilter) {
      result = result.filter((o) => o.bill.table?.id === tableFilter);
    }
    if (statusFilter) {
      result = result.filter((o) => o.computedStatus === statusFilter);
    }

    return result;
  }, [allOrders, dateFilter, tableFilter, statusFilter]);

  const stats = useMemo(
    () => ({
      total: allOrders.length,
      pending: allOrders.filter((o) => o.computedStatus === "Yangi").length,
      cooking: allOrders.filter(
        (o) =>
          o.computedStatus === "Tayyorlanmoqda" ||
          o.computedStatus === "Tayyor",
      ).length,
      done: allOrders.filter((o) => o.computedStatus === "Yakunlangan").length,
    }),
    [allOrders],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const topItems: ITopItem[] = topItemsQuery.data ?? [];

  /* ── Reset page on filter change ── */
  const handleDateFilter = (v: string) => {
    setDateFilter(v);
    setPage(1);
  };
  const handleTableFilter = (v: string) => {
    setTableFilter(v);
    setPage(1);
  };
  const handleStatusFilter = (v: string) => {
    setStatusFilter(v);
    setPage(1);
  };
  const handleSearchFilter = (v: string) => {
    setSearchFilter(v);
    setPage(1);
  };

  /* ── Pagination helpers ── */
  const renderPageButtons = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      for (
        let i = Math.max(2, safePage - 1);
        i <= Math.min(totalPages - 1, safePage + 1);
        i++
      )
        pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 sm:pb-10">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#fafafa]">
          {t("Buyurtmalar boshqaruvi")}
        </h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={16} /> {t("Yangi buyurtma qo'shish")}
        </button>
      </div>

      {/* ═══ Stat Cards ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {(
          [
            {
              icon: ClipboardList,
              color: "blue",
              label: "Jami buyurtmalar",
              value: stats.total,
            },
            {
              icon: Clock,
              color: "orange",
              label: "Kutilmoqda",
              value: stats.pending,
            },
            {
              icon: UtensilsCrossed,
              color: "green",
              label: "Tayyorlanmoqda",
              value: stats.cooking,
            },
            {
              icon: CheckCircle,
              color: "gray",
              label: "Yakunlangan",
              value: stats.done,
            },
          ] as const
        ).map((card) => {
          const colorMap: Record<string, { bg: string; text: string }> = {
            blue: { bg: "bg-blue-50", text: "text-blue-600" },
            orange: { bg: "bg-orange-50", text: "text-orange-600" },
            green: { bg: "bg-green-50", text: "text-green-600" },
            gray: { bg: "bg-gray-100", text: "text-gray-500 dark:text-[#a1a1aa]" },
          };
          const c = colorMap[card.color];
          return (
            <div
              key={card.label}
              className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-[#27272a] p-3 sm:p-4 flex items-center gap-3"
            >
              <div
                className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}
              >
                {isLoading ? (
                  <Skeleton className="w-5 h-5" />
                ) : (
                  <card.icon size={18} className={c.text} />
                )}
              </div>
              <div className="min-w-0">
                {isLoading ? (
                  <Skeleton className="h-6 w-10 mb-1" />
                ) : (
                  <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#fafafa]">
                    {card.value}
                  </p>
                )}
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-[#a1a1aa] truncate">
                  {t(card.label)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ Filters ═══ */}
      <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-[#27272a] p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              {t("Sana bo'yicha")}
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => handleDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#18181b] dark:text-[#e4e4e7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all [color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              {t("Stol")}
            </label>
            <select
              value={tableFilter}
              onChange={(e) => handleTableFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-[#27272a] rounded-lg text-sm bg-white dark:bg-[#18181b] dark:text-[#e4e4e7] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
            >
              <option value="">{t("Barchasi")}</option>
              {tables.map((tItem) => (
                <option key={tItem.id} value={tItem.id}>
                  {t("Stol")} {tItem.tableNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              {t("Status")}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-[#27272a] rounded-lg text-sm bg-white dark:bg-[#18181b] dark:text-[#e4e4e7] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
            >
              <option value="">{t("Barcha statuslar")}</option>
              <option value="Yangi">{t("Yangi")}</option>
              <option value="Tayyorlanmoqda">{t("Tayyorlanmoqda")}</option>
              <option value="Tayyor">{t("Tayyor")}</option>
              <option value="Yakunlangan">{t("Yakunlangan")}</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              {t("Qidiruv")}
            </label>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => handleSearchFilter(e.target.value)}
              placeholder={t("Buyurtma, stol yoki taom")}
              className="w-full px-3 py-2 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#18181b] dark:text-[#e4e4e7] placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ═══ Table / Cards / States ═══ */}
      {isLoading ? (
        <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-[#27272a] p-5">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-16 h-5 shrink-0" />
                <Skeleton className="w-12 h-5" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-[#27272a] p-10 text-center">
          <div className="w-14 h-14 bg-gray-50 dark:bg-[#27272a] rounded-full flex items-center justify-center mx-auto mb-3">
            <ClipboardList size={24} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-400 dark:text-[#71717a]">
            {dateFilter || tableFilter || statusFilter || searchFilter
              ? t("Filtrlar bo'yicha buyurtma topilmadi")
              : t("Buyurtmalar topilmadi")}
          </p>
        </div>
      ) : (
        <>
          {/* ── DESKTOP TABLE (md+) ── */}
          <div className="hidden md:block bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-[#27272a] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#27272a] text-left text-xs text-gray-500 dark:text-[#a1a1aa]">
                  <th className="px-4 py-3 font-medium">{t("ID")}</th>
                  <th className="px-4 py-3 font-medium">{t("Stol")}</th>
                  <th className="px-4 py-3 font-medium">{t("Xodim")}</th>
                  <th className="px-4 py-3 font-medium">{t("Taomlar")}</th>
                  <th className="px-4 py-3 font-medium">{t("Umumiy summa")}</th>
                  <th className="px-4 py-3 font-medium">{t("Vaqt")}</th>
                  <th className="px-4 py-3 font-medium">{t("Status")}</th>
                  <th className="px-4 py-3 font-medium text-right">{t("Amallar")}</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((order: IOrderRow, index: number) => {
                  const absoluteIndex = (safePage - 1) * PAGE_SIZE + index;
                  const rowNumber = filtered.length - absoluteIndex;
                  return (
                    <tr
                      key={order.bill.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 dark:hover:bg-[#27272a] dark:bg-[#27272a]/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-blue-600">
                        #{rowNumber}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#a1a1aa]">
                        {order.bill.table
                          ? `${t("Stol")} ${order.bill.table.tableNumber}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-semibold text-blue-600 shrink-0">
                            {order.staffInitials}
                          </div>
                          <span className="text-gray-700 dark:text-[#e4e4e7] truncate max-w-[100px]">
                            {order.staffName}
                          </span>
                        </div>
                      </td>
                      <td
                        className="px-4 py-3 text-gray-600 max-w-[180px] truncate"
                        title={order.itemsLabel}
                      >
                        {order.itemsLabel}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-[#fafafa]">
                        {formatSom(order.bill.totalAmount)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-[#a1a1aa]">
                        {formatTime(order.bill.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.computedStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewOrder(order)}
                            className="p-1.5 text-gray-400 dark:text-[#71717a] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ko'rish"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setEditOrder(order)}
                            className="p-1.5 text-gray-400 dark:text-[#71717a] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Tahrirlash"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            disabled={order.itemsCount > 0}
                            onClick={() => cancelBill.mutate(order.bill.id)}
                            title={
                              order.itemsCount > 0
                                ? "Taomlar bor, bekor qilib bo'lmaydi"
                                : "Bekor qilish"
                            }
                            className="p-1.5 text-gray-400 dark:text-[#71717a] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                          >
                            <XCircle size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── MOBILE CARDS (<md) ── */}
          <div className="md:hidden space-y-3">
            {paginated.map((order: IOrderRow, index: number) => {
              const absoluteIndex = (safePage - 1) * PAGE_SIZE + index;
              const rowNumber = filtered.length - absoluteIndex;
              return (
                <div
                  key={order.bill.id}
                  className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-[#27272a] p-3.5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-600">
                      #{rowNumber}
                    </span>
                    <StatusBadge status={order.computedStatus} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-[#a1a1aa] mb-2">
                    <span>
                      {order.bill.table
                        ? `${t("Stol")} ${order.bill.table.tableNumber}`
                        : "—"}
                    </span>
                    <span>{formatTime(order.bill.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-[#e4e4e7] mb-2 line-clamp-2">
                    {order.itemsLabel}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900 dark:text-[#fafafa]">
                      {formatSom(order.bill.totalAmount)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewOrder(order)}
                        className="p-2 text-gray-400 dark:text-[#71717a] hover:text-blue-600 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => setEditOrder(order)}
                        className="p-2 text-gray-400 dark:text-[#71717a] hover:text-blue-600 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        disabled={order.itemsCount > 0}
                        onClick={() => cancelBill.mutate(order.bill.id)}
                        className="p-2 text-gray-400 dark:text-[#71717a] hover:text-red-600 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a1a1aa]">
                Ko&apos;rsatilmoqda: {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filtered.length)} dan{" "}
                {filtered.length} ta
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={safePage === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-[#27272a] text-gray-600 hover:bg-gray-50 dark:hover:bg-[#27272a] dark:bg-[#27272a] disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Mobile: X / Y */}
                <span className="sm:hidden text-xs px-2 text-gray-500 dark:text-[#a1a1aa]">
                  {safePage} / {totalPages}
                </span>

                {/* Desktop: numbered pages */}
                <div className="hidden sm:flex items-center gap-1">
                  {renderPageButtons().map((p, idx) =>
                    p === "..." ? (
                      <span
                        key={`dots-${idx}`}
                        className="w-7 h-7 flex items-center justify-center text-xs text-gray-400 dark:text-[#71717a]"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === safePage
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                </div>

                <button
                  disabled={safePage === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-[#27272a] text-gray-600 hover:bg-gray-50 dark:hover:bg-[#27272a] dark:bg-[#27272a] disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══ Bottom Section ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ─── Kunlik daromad ─── */}
        <div className="bg-blue-600 rounded-2xl p-5 text-white relative overflow-hidden">
          <TrendingUp
            className="absolute right-4 bottom-4 opacity-20"
            size={64}
          />
          <p className="text-sm text-blue-100 mb-1">{t("Kunlik daromad")}</p>
          {todaySummary.isLoading ? (
            <div className="h-8 w-40 bg-blue-500 animate-pulse rounded-lg" />
          ) : (
            <p className="text-2xl font-bold mb-2">
              {formatSom(todaySummary.data?.totalRevenue ?? 0)}
            </p>
          )}
        </div>

        {/* ─── Eng ko'p buyurtma qilingan ─── */}
        <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-100 dark:border-[#27272a] p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-4">
            {t("Eng ko'p buyurtma qilingan")}
          </h3>
          {topItemsQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : topItems.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-[#71717a]">
              {t("Hozircha ma'lumot yo'q")}
            </p>
          ) : (
            <div className="space-y-3">
              {topItems.slice(0, 2).map((item) => {
                const percent = Math.round(
                  (item.totalQuantity / topItems[0].totalQuantity) * 100,
                );
                return (
                  <div key={item.menuItemId}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 dark:text-[#e4e4e7]">{item.name}</span>
                      <span className="text-gray-500 dark:text-[#a1a1aa]">{percent}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <Link
            to="/admin/reports"
            className="text-xs text-blue-600 font-medium mt-4 inline-flex items-center gap-1 hover:text-blue-700 transition-colors"
          >
            {t("To'liq hisobotni ko'rish")} <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ═══ Modals ═══ */}
      {createOpen && <CreateOrderModal onClose={() => setCreateOpen(false)} />}
      {viewOrder && (
        <ViewOrderModal order={viewOrder} onClose={() => setViewOrder(null)} />
      )}
      {editOrder && (
        <EditOrderModal order={editOrder} onClose={() => setEditOrder(null)} />
      )}
    </div>
  );
};
