import { useState } from "react";
import { X } from "lucide-react";
import { useCreateTable, useBulkCreateTables } from "./useTables";
import { useLanguage } from "@/context/LanguageContext";

export const CreateTableModal = ({ onClose }: { onClose: () => void }) => {
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [tableNumber, setTableNumber] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");


  const createTable = useCreateTable();
  const bulkCreate = useBulkCreateTables();
  const { t } = useLanguage();

  const handleSubmit = () => {
    if (mode === "single") {
      const n = Number(tableNumber);
      if (!n || n < 1) return;
      createTable.mutate({ tableNumber: n }, { onSuccess: onClose });
    } else {
      const f = Number(from);
      const t = Number(to);
      if (!f || !t || f > t) return;
      bulkCreate.mutate({ from: f, to: t }, { onSuccess: onClose });
    }
  };

  const isPending = createTable.isPending || bulkCreate.isPending;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#18181b] rounded-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#27272a]">
          <h2 className="text-base font-semibold text-gray-900 dark:text-[#fafafa]">
            {t("Yangi stol qo'shish")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-[#fafafa] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex bg-gray-50 dark:bg-[#202024] p-1 rounded-lg mb-4">
            <button
              onClick={() => setMode("single")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === "single" ? "bg-white dark:bg-[#27272a] shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-[#a1a1aa]"}`}
            >
              {t("Bitta stol")}
            </button>
            <button
              onClick={() => setMode("bulk")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === "bulk" ? "bg-white dark:bg-[#27272a] shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-[#a1a1aa]"}`}
            >
              {t("Bir nechta stol")}
            </button>
          </div>

          {mode === "single" ? (
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-[#a1a1aa]">
                {t("Stol raqami")}
              </label>
              <input
                type="number"
                min={1}
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder={t("Masalan: 5")}
                className="w-full mt-1 px-3 py-2 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#18181b] text-gray-900 dark:text-[#fafafa] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-[#a1a1aa]">{t("Dan")}</label>
                <input
                  type="number"
                  min={1}
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="1"
                  className="w-full mt-1 px-3 py-2 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#18181b] text-gray-900 dark:text-[#fafafa] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-[#a1a1aa]">
                  {t("Gacha")}
                </label>
                <input
                  type="number"
                  min={1}
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="15"
                  className="w-full mt-1 px-3 py-2 border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#18181b] text-gray-900 dark:text-[#fafafa] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-5">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-[#27272a] text-sm text-gray-600 dark:text-[#a1a1aa] hover:bg-gray-50 dark:hover:bg-[#27272a] transition-colors"
            >
              {t("Bekor qilish")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? t("Qo'shilmoqda...") : t("Qo'shish")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
