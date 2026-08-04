import { useState } from "react";
import {
  Plus,
  LayoutGrid,
  DoorClosed,
  CheckCircle2,
  CalendarClock,
  QrCode,
  Trash2,
  Eye,
} from "lucide-react";
import {
  useTables,
  useDeleteTable,
  useCancelReservation,
  useMarkArrived,
} from "@/features/restaurant-table/useTables";
import { useOrdersList } from "@/features/orders/useOrders";
import { CreateTableModal } from "@/features/restaurant-table/CreateTableModal";
import { QrModal } from "@/features/restaurant-table/QrModal";
import { ReserveTableModal } from "@/features/restaurant-table/ReserveTableModal";
import { ViewOrderModal } from "@/features/orders/ViewOrderModal";
import type { ITable } from "@/features/restaurant-table/types";
import type { IOrderRow } from "@/features/orders/types";
import { useLanguage } from "@/context/LanguageContext";

const formatSom = (n: number) =>
  new Intl.NumberFormat("uz-UZ").format(n) + " so'm";

const minutesSince = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
};

const formatReservedAt = (iso: string) =>
  new Date(iso).toLocaleString("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
);

export const TablesPage = () => {
  const { data: tables = [], isLoading } = useTables();
  const { data: orders = [] } = useOrdersList();
  const deleteTable = useDeleteTable();
  const cancelReservation = useCancelReservation();
  const markArrived = useMarkArrived();
  const { t } = useLanguage();

  const [createOpen, setCreateOpen] = useState(false);
  const [qrTable, setQrTable] = useState<ITable | null>(null);
  const [reserveTableTarget, setReserveTableTarget] = useState<ITable | null>(
    null,
  );
  const [viewOrder, setViewOrder] = useState<IOrderRow | null>(null);

  const bandCount = tables.filter((t) => t.status === "BAND").length;
  const boshCount = tables.filter((t) => t.status === "BOSH").length;
  const rezervCount = tables.filter((t) => t.status === "REZERV").length;

  const getOpenOrderForTable = (tableId: string) =>
    orders.find(
      (o) => o.bill.table?.id === tableId && o.bill.status === "OCHIQ",
    );

  const confirmDelete = (table: ITable) => {
    if (window.confirm(`Stol ${table.tableNumber}ni o'chirasizmi?`)) {
      deleteTable.mutate(table.id);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#fafafa]">
          {t("Stollar boshqaruvi")}
        </h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={16} /> {t("Yangi stol")}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-[#27272a] p-3 sm:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
            <LayoutGrid size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-6 w-8 mb-1" />
            ) : (
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#fafafa]">
                {tables.length}
              </p>
            )}
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-[#a1a1aa]">{t("Jami stollar")}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-[#27272a] p-3 sm:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
            <DoorClosed size={18} className="text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-6 w-8 mb-1" />
            ) : (
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#fafafa]">
                {bandCount}
              </p>
            )}
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-[#a1a1aa]">{t("Band stollar")}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-[#27272a] p-3 sm:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-6 w-8 mb-1" />
            ) : (
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#fafafa]">
                {boshCount}
              </p>
            )}
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-[#a1a1aa]">
              {t("Bo'sh stollar")}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-[#27272a] p-3 sm:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
            <CalendarClock size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-6 w-8 mb-1" />
            ) : (
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#fafafa]">
                {rezervCount}
              </p>
            )}
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-[#a1a1aa]">
              {t("Rezerv qilingan")}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-gray-900 dark:text-[#fafafa]">{t("Stollar ro'yxati")}</h2>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))
          : tables.map((table) => {
            const isBand = table.status === "BAND";
            const isRezerv = table.status === "REZERV";
            const openOrder = isBand
              ? getOpenOrderForTable(table.id)
              : undefined;

            const cardBorder = isBand
              ? "border-orange-100 dark:border-orange-500/20"
              : isRezerv
                ? "border-blue-100 dark:border-blue-500/20"
                : "border-green-100 dark:border-green-500/20";
            const badgeStyle = isBand
              ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
              : isRezerv
                ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400";
            const badgeLabel = isBand
              ? t("BAND")
              : isRezerv
                ? t("REZERV")
                : t("BO'SH");
            const iconBg = isBand
              ? "bg-orange-500 dark:bg-orange-500/90 text-white"
              : isRezerv
                ? "bg-blue-500 dark:bg-blue-500/90 text-white"
                : "bg-green-500 dark:bg-green-500/90 text-white";
            const iconLabel = table.isVip
              ? `V${table.tableNumber}`
              : String(table.tableNumber).padStart(2, "0");

            return (
              <div
                key={table.id}
                className={`bg-white dark:bg-[#18181b] rounded-xl border p-4 flex flex-col ${cardBorder}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${iconBg}`}
                  >
                    {iconLabel}
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeStyle}`}
                  >
                    {badgeLabel}
                  </span>
                </div>

                <p className="text-sm font-semibold text-gray-900 dark:text-[#fafafa] mb-1">
                  {table.isVip
                    ? `VIP ${table.tableNumber}`
                    : `${t("Stol")} ${table.tableNumber}`}
                </p>
                <p className="text-xs text-gray-400 dark:text-[#71717a] mb-2">
                  {table.capacity} {t("kishilik")}
                  {table.section ? ` • ${table.section}` : ""}
                </p>

                {isBand && openOrder && (
                  <div className="text-xs text-gray-500 dark:text-[#a1a1aa] space-y-0.5 mb-3">
                    <p>
                      {minutesSince(openOrder.bill.createdAt)} {t("daqiqadan beri")}
                    </p>
                    <p className="font-medium text-gray-700 dark:text-[#f4f4f5]">
                      {formatSom(openOrder.bill.totalAmount)}
                    </p>
                  </div>
                )}

                {isRezerv && (
                  <div className="text-xs space-y-0.5 mb-3">
                    {table.reservedAt && (
                      <p className="text-blue-600 font-medium">
                        {formatReservedAt(table.reservedAt)}
                      </p>
                    )}
                    {table.reservationGuestName && (
                      <p className="text-gray-600">
                        {table.reservationGuestName}
                      </p>
                    )}
                  </div>
                )}

                {!isBand && !isRezerv && (
                  <p className="text-xs text-gray-400 dark:text-[#71717a] italic mb-3">
                    {t("Hozircha bo'sh...")}
                  </p>
                )}

                <div className="mt-auto pt-3 border-t border-gray-50 dark:border-[#27272a] flex items-center justify-between">
                  {isBand && (
                    <>
                      <button
                        onClick={() => setQrTable(table)}
                        className="flex flex-col items-center gap-0.5 text-gray-400 dark:text-[#71717a] hover:text-blue-600 transition-colors"
                        title="QR kodni ko'rish"
                      >
                        <QrCode size={16} />
                        <span className="text-[9px]">QR</span>
                      </button>
                      <button
                        onClick={() => {
                          if (openOrder) setViewOrder(openOrder);
                        }}
                        className="flex flex-col items-center gap-0.5 text-gray-400 dark:text-[#71717a] hover:text-blue-600 transition-colors"
                        title="Buyurtmani ko'rish"
                      >
                        <Eye size={16} />
                        <span className="text-[9px]">{t("Hisob")}</span>
                      </button>
                    </>
                  )}

                  {isRezerv && (
                    <>
                      <button
                        onClick={() => markArrived.mutate(table.id)}
                        disabled={markArrived.isPending}
                        className="text-xs text-green-600 font-medium hover:underline disabled:opacity-50"
                      >
                        {t("Keldi")}
                      </button>
                      <button
                        onClick={() => cancelReservation.mutate(table.id)}
                        disabled={cancelReservation.isPending}
                        className="text-xs text-red-500 font-medium hover:underline disabled:opacity-50"
                      >
                        {t("Bekor")}
                      </button>
                    </>
                  )}

                  {!isBand && !isRezerv && (
                    <>
                      <button
                        onClick={() => setQrTable(table)}
                        className="flex flex-col items-center gap-0.5 text-gray-400 dark:text-[#71717a] hover:text-blue-600 transition-colors"
                        title="QR kodni ko'rish"
                      >
                        <QrCode size={16} />
                        <span className="text-[9px]">QR</span>
                      </button>
                      <button
                        onClick={() => setReserveTableTarget(table)}
                        className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
                      >
                        {t("Rezerv qilish")}
                      </button>
                      <button
                        onClick={() => confirmDelete(table)}
                        className="text-gray-400 dark:text-[#71717a] hover:text-red-600"
                        title="O'chirish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

        {/* Add-new card */}
        <button
          onClick={() => setCreateOpen(true)}
          className="rounded-xl border-2 border-dashed border-gray-200 dark:border-[#27272a] flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-[#71717a] hover:border-blue-300 hover:text-blue-500 transition-colors min-h-[160px]"
        >
          <Plus size={22} />
          <span className="text-xs font-medium">{t("Stol qo'shish")}</span>
        </button>
      </div>

      {createOpen && <CreateTableModal onClose={() => setCreateOpen(false)} />}
      {qrTable && <QrModal table={qrTable} onClose={() => setQrTable(null)} />}
      {reserveTableTarget && (
        <ReserveTableModal
          table={reserveTableTarget}
          onClose={() => setReserveTableTarget(null)}
        />
      )}
      {viewOrder && (
        <ViewOrderModal order={viewOrder} onClose={() => setViewOrder(null)} />
      )}
    </div>
  );
};
