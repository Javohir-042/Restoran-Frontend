import { useState } from "react";
import { X } from "lucide-react";
import { useReserveTable } from "./useTables";
import type { ITable } from "./types";
import { useLanguage } from "@/context/LanguageContext";

export const ReserveTableModal = ({
  table,
  onClose,
}: {
  table: ITable;
  onClose: () => void;
}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const reserveTable = useReserveTable();
  const { t } = useLanguage();

  const handleSubmit = () => {
    if (!date || !time || !guestName) return;
    const reservedAt = new Date(`${date}T${time}`).toISOString();
    reserveTable.mutate(
      {
        id: table.id,
        data: { reservedAt, guestName, guestPhone: guestPhone || undefined },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#18181b] rounded-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#27272a]">
          <h2 className="text-base font-semibold text-gray-900 dark:text-[#fafafa]">
            {t("Stol")} {table.tableNumber}{t("ni rezerv qilish")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-[#fafafa]"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-[#a1a1aa]">{t("Sana")}</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#18181b] text-gray-900 dark:text-[#fafafa] rounded-lg text-sm [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-[#a1a1aa]">{t("Vaqt")}</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#18181b] text-gray-900 dark:text-[#fafafa] rounded-lg text-sm [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-[#a1a1aa]">
              {t("Mehmon ismi")}
            </label>
            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Abdullaev A."
              className="w-full mt-1 px-3 py-2 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#18181b] text-gray-900 dark:text-[#fafafa] rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-[#a1a1aa]">
              {t("Telefon raqami (ixtiyoriy)")}
            </label>
            <input
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="+998901234567"
              className="w-full mt-1 px-3 py-2 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#18181b] text-gray-900 dark:text-[#fafafa] rounded-lg text-sm"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-[#27272a] text-sm text-gray-600 dark:text-[#a1a1aa] hover:bg-gray-50 dark:hover:bg-[#27272a] transition-colors"
            >
              {t("Bekor qilish")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={reserveTable.isPending}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {reserveTable.isPending ? t("Saqlanmoqda...") : t("Rezerv qilish")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
