import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import API from "@/config/request";
import type { IOrderRow } from "./types";

const formatSom = (n: number) =>
  new Intl.NumberFormat("uz-UZ").format(n) + " UZS";

const ITEM_STATUS_LABELS: Record<string, string> = {
  YANGI: "Yangi",
  TAYYORLANMOQDA: "Tayyorlanmoqda",
  TAYYOR: "Tayyor",
  YETKAZILDI: "Yetkazildi",
};

const ITEM_STATUS_STYLES: Record<string, string> = {
  YANGI: "bg-orange-50 text-orange-600",
  TAYYORLANMOQDA: "bg-green-50 text-green-600",
  TAYYOR: "bg-blue-50 text-blue-600",
  YETKAZILDI: "bg-gray-100 text-gray-500",
};

export const ViewOrderModal = ({
  order,
  onClose,
}: {
  order: IOrderRow;
  onClose: () => void;
}) => {
  const { data: paymentSummary } = useQuery({
    queryKey: ["payment-summary", order.bill.id],
    queryFn: () =>
      API.get(`/payment/bill/${order.bill.id}/summary`).then(
        (r) => r.data.data,
      ),
    enabled: order.bill.status === "TOLANDI",
  });

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-gray-900">
            Buyurtma #{order.bill.id.slice(0, 6).toUpperCase()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Stol</span>
              <span className="font-medium text-gray-900">
                {order.bill.table
                  ? `Stol ${order.bill.table.tableNumber}`
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Xodim</span>
              <span className="font-medium text-gray-900">
                {order.staffName}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Holat</span>
              <span className="font-medium text-gray-900">
                {order.bill.status}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-2">
            <p className="text-xs font-medium text-gray-500 mb-2">Taomlar</p>
            {order.items.length === 0 ? (
              <p className="text-sm text-gray-400">Taom qo'shilmagan</p>
            ) : (
              order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-700">
                    {item.menuItem.name} x {item.quantity}
                  </span>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${ITEM_STATUS_STYLES[item.status]}`}
                  >
                    {ITEM_STATUS_LABELS[item.status]}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Jami</span>
              <span className="font-semibold text-gray-900">
                {formatSom(order.bill.totalAmount)}
              </span>
            </div>
          </div>

          {paymentSummary && (
            <div className="bg-green-50 rounded-lg p-3 text-sm text-green-700">
              To'liq to'langan: {formatSom(paymentSummary.paidAmount)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
