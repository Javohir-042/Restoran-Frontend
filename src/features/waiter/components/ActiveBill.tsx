import { useBillOrderItems, useMarkDelivered, useOpenBill, useCancelOrderItem } from "../useWaiter";
import { useOpenBills } from "../../bill/useBill";
import type { ITable } from "../../restaurant-table/types";
import { Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
    table: ITable;
    onAddItemClick: (billId: string) => void;
}

export const ActiveBill = ({ table, onAddItemClick }: Props) => {
    const { t } = useLanguage();
    const { data: openBills = [] } = useOpenBills();

    // Find active bill for this table (support both tableId and table.id depending on API shape)
    const activeBill = openBills.find((b: any) => {
        const tId = b.tableId || b.table?.id;
        return tId === table.id && b.status === "OCHIQ";
    });


    const { data: items = [], isLoading } = useBillOrderItems(activeBill?.id || null);

    const calculatedTotal = items.reduce((acc, currentItem: any) => acc + (Number(currentItem.priceAtOrder) * Number(currentItem.quantity)), 0);

    // Mutations
    const openBillM = useOpenBill();
    const markDeliveredM = useMarkDelivered();
    const cancelOrderItemM = useCancelOrderItem();

    const handleOpenBill = async () => {
        try {
            const newBill = await openBillM.mutateAsync(table.id);
            if (newBill && newBill.id) {
                onAddItemClick(newBill.id);
            }
        } catch (e) {
            // error handled by hook
        }
    };

    if (!table) return null;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0a0a0f]/60 dark:backdrop-blur-2xl rounded-2xl shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/5 overflow-hidden transition-all">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-blue-50/50 dark:bg-white/[0.02]">
                <h3 className="text-xl font-black text-gray-800 dark:text-[#fafafa]">
                    {t("STOL")} {table.tableNumber < 10 ? `0${table.tableNumber}` : table.tableNumber}
                </h3>
                {activeBill && (
                    <div className="text-sm font-bold text-gray-500 dark:text-[#a1a1aa] bg-white dark:bg-white/5 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 dark:border-white/10">
                        Total: {calculatedTotal.toLocaleString()} UZS
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30 dark:bg-transparent">
                {!activeBill ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-4">
                        <div className="text-gray-400 mb-4 opacity-50 text-6xl">🍽️</div>
                        <h4 className="text-xl font-bold text-gray-700 dark:text-[#fafafa] mb-2">{t("Stol bo'sh")}</h4>
                        <p className="text-sm text-gray-500 dark:text-[#a1a1aa] mb-6">{t("Mijozlar kelishganda yangi hisob ochishingiz mumkin.")}</p>
                        <button
                            onClick={handleOpenBill}
                            disabled={openBillM.isPending}
                            className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-xl shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-1 transition-all uppercase tracking-wide"
                        >
                            {openBillM.isPending ? t("Ochilyapti...") : t("Buyurtma Boshlash")}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {isLoading && <div className="text-center py-4 text-gray-400 dark:text-[#a1a1aa]">{t("Yuklanmoqda...")}</div>}
                        {!isLoading && items.length === 0 && (
                            <div className="text-center py-10 text-gray-400 dark:text-[#71717a] font-medium">{t("Hali taom qo'shilmagan")}</div>
                        )}
                        {items.map(item => {
                            const isYangi = item.status === "YANGI";
                            const isTayyorlanmoqda = item.status === "TAYYORLANMOQDA";
                            const isTayyor = item.status === "TAYYOR";
                            const isYetkazildi = item.status === "YETKAZILDI";

                            const catName = (item.menuItem?.category?.name || "").toLowerCase();
                            const itemNameStr = (item.menuItem?.name || "").toLowerCase();
                            const drinkKeywords = ["ichimlik", "ichki", " पेय", "drink", "napitk", "bar"];
                            const itemKeywords = ["cola", "fanta", "sprite", "pepsi", "suv", "choy", "kofe", "coffee", "lola", "sharbat", "sok"];
                            const isDrink = drinkKeywords.some(kw => catName.includes(kw)) || itemKeywords.some(kw => itemNameStr.includes(kw));

                            return (
                                <div key={item.id} className={`p-4 rounded-xl border flex flex-col transition-opacity ${isYetkazildi ? 'opacity-50 grayscale bg-gray-100 dark:bg-white/5' : 'bg-white dark:bg-white/5 shadow-sm'} ${isTayyor ? 'border-green-400 dark:border-emerald-500/50 ring-1 ring-green-400 dark:ring-emerald-500/50' : 'border-gray-200 dark:border-white/10'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{item.menuItem?.name || t("Noma'lum")}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm font-semibold text-gray-500 dark:text-[#a1a1aa]">{parseInt(item.priceAtOrder).toLocaleString()} UZS</span>
                                                <span className="text-xs font-black text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/20 px-2 py-0.5 rounded-full">x{item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${isYangi ? 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300' : isTayyorlanmoqda ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' : isTayyor ? 'bg-green-100 dark:bg-emerald-500/20 text-green-700 dark:text-emerald-400' : 'bg-transparent text-gray-400 border border-gray-300 dark:border-gray-600'}`}>
                                                {t(item.status)}
                                            </div>
                                            {isYangi && (
                                                <button
                                                    onClick={() => {
                                                        if (confirm(t("Ushbu taomni bekormoqchimisiz?"))) {
                                                            cancelOrderItemM.mutate(item.id);
                                                        }
                                                    }}
                                                    disabled={cancelOrderItemM.isPending}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors focus:outline-none"
                                                    title={t("Bekor qilish")}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {(isTayyor || (isDrink && isYangi)) && (
                                        <button
                                            onClick={() => markDeliveredM.mutate(item.id)}
                                            disabled={markDeliveredM.isPending}
                                            className="mt-3 w-full py-3 bg-green-500 dark:bg-emerald-600 hover:bg-green-600 dark:hover:bg-emerald-500 text-white font-black text-sm uppercase rounded-lg shadow-sm transition-colors"
                                        >
                                            {markDeliveredM.isPending ? t("Kuting...") : t("OLIB BORISH")}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer / Actions */}
            {activeBill && (
                <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.02] shrink-0">
                    <button
                        onClick={() => onAddItemClick(activeBill.id)}
                        className="w-full py-4 flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-black text-base uppercase rounded-xl transition-colors border border-blue-200 dark:border-blue-500/30 border-dashed"
                    >
                        <Plus size={20} strokeWidth={3} />
                        {t("Yana taom qo'shish")}
                    </button>
                </div>
            )}
        </div>
    );
};
