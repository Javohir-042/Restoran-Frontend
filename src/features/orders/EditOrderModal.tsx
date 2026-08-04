import { X } from "lucide-react";
import { useCancelOrderItem } from "./useOrderActions";
import type { IOrderRow } from "./types";
import { useLanguage } from "@/context/LanguageContext";

const ITEM_STATUS_LABELS: Record<string, string> = {
  YANGI: "Yangi",
  TAYYORLANMOQDA: "Tayyorlanmoqda",
  TAYYOR: "Tayyor",
  YETKAZILDI: "Yetkazildi",
};

export const EditOrderModal = ({
  order,
  onClose,
}: {
  order: IOrderRow;
  onClose: () => void;
}) => {
  const cancelItem = useCancelOrderItem();
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#18181b] rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#27272a]">
          <h2 className="text-base font-semibold text-gray-900 dark:text-[#fafafa]">
            {t("Buyurtmani tahrirlash")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-[#fafafa]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-2">
          {order.items.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-[#71717a] text-center py-4">
              Bu buyurtmada hali taom yo'q
            </p>
          ) : (
            order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-[#27272a] last:border-0"
              >
                <div>
                  <p className="text-sm text-gray-900 dark:text-[#fafafa]">
                    {item.menuItem.name} x {item.quantity}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-[#a1a1aa]">
                    {ITEM_STATUS_LABELS[item.status]}
                  </p>
                </div>
                {item.status === "YANGI" && (
                  <button
                    onClick={() => cancelItem.mutate(item.id)}
                    disabled={cancelItem.isPending}
                    className="text-xs text-red-500 hover:underline disabled:opacity-50"
                  >
                    {t("Bekor qilish")}
                  </button>
                )}
              </div>
            ))
          )}
          <p className="text-xs text-gray-400 dark:text-[#71717a] mt-4">
            {t("Yangi taom qo'shish uchun \"Yangi buyurtma qo'shish\" oynasidan shu stolni qayta tanlang — mavjud ochiq hisobga qo'shiladi.")}
          </p>
        </div>
      </div>
    </div>
  );
};
