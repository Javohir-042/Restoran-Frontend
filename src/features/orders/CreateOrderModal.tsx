import { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import API from "@/config/request";
import { useCreateOrderFlow } from "./useOrderActions";
import type { ITable } from "./types";

/* ── Helpers ── */
const formatSom = (n: number) =>
    new Intl.NumberFormat("uz-UZ").format(n) + " UZS";

interface MenuItem {
    id: string;
    name: string;
    price: number;
    isAvailable: boolean;
}

export const CreateOrderModal = ({ onClose }: { onClose: () => void }) => {
    const [step, setStep] = useState<"table" | "items">("table");
    const [billId, setBillId] = useState<string | null>(null);
    const [cart, setCart] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);

    const { data: tables = [] } = useQuery<ITable[]>({
        queryKey: ["restaurant-tables"],
        queryFn: () => API.get("/restaurant-table").then((r) => r.data.data),
    });

    const { data: menuItems = [] } = useQuery<MenuItem[]>({
        queryKey: ["menu-items", "admin-all"],
        queryFn: () => API.get("/menu-item/admin/all").then((r) => r.data.data),
    });

    const { openBillAsAdmin, addItems, isLoading: isSubmitting } =
        useCreateOrderFlow();

    const handleSelectTable = async (tableId: string) => {
        try {
            setLoading(true);
            const bill = await openBillAsAdmin(tableId);
            setBillId(bill.id);
            setStep("items");
        } catch {
            /* error handled in hook */
        } finally {
            setLoading(false);
        }
    };

    const updateQty = (menuItemId: string, delta: number) => {
        setCart((prev) => {
            const next = {
                ...prev,
                [menuItemId]: Math.max(0, (prev[menuItemId] ?? 0) + delta),
            };
            if (next[menuItemId] === 0) delete next[menuItemId];
            return next;
        });
    };

    const handleSubmit = async () => {
        if (!billId) return;
        const items = Object.entries(cart).map(([menuItemId, quantity]) => ({
            menuItemId,
            quantity,
        }));
        if (items.length === 0) return;
        try {
            await addItems(billId, items);
            onClose();
        } catch {
            /* error handled in hook */
        }
    };

    const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
        const item = menuItems.find((m) => m.id === id);
        return sum + (item?.price ?? 0) * qty;
    }, 0);

    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <h2 className="text-base font-semibold text-gray-900">
              {step === "table" ? "Stolni tanlang" : "Taomlarni tanlang"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Step 1: Table selection */}
          {step === "table" && (
            <div className="p-5 overflow-y-auto">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {tables.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTable(t.id)}
                    disabled={loading}
                    className={`p-3 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      t.status === "BAND"
                        ? "bg-orange-50 border-orange-100 text-orange-600 hover:bg-orange-100"
                        : "bg-green-50 border-green-100 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    Stol {t.tableNumber}
                    {t.status === "BAND" && (
                      <span className="block text-[9px] mt-0.5 opacity-70">
                        band — qo'shiladi
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {tables.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">
                  Stollar topilmadi
                </p>
              )}
            </div>
          )}

          {/* Step 2: Menu items */}
          {step === "items" && (
            <>
              <div className="p-5 overflow-y-auto flex-1 space-y-3">
                {menuItems
                  .filter((m) => m.isAvailable)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div className="min-w-0 mr-3">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatSom(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          disabled={!cart[item.id]}
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-300 disabled:opacity-30 transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium tabular-nums">
                          {cart[item.id] ?? 0}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                {menuItems.filter((m) => m.isAvailable).length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8">
                    Menyu bo&apos;sh
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-gray-100 shrink-0">
                {totalPrice > 0 && (
                  <p className="text-xs text-gray-500 mb-2">
                    Jami:{" "}
                    <span className="font-semibold text-gray-900">
                      {formatSom(totalPrice)}
                    </span>
                  </p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(cart).length === 0 || isSubmitting}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Saqlanmoqda..." : "Buyurtmani saqlash"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
};
