import { useBillOrderItems, useMarkDelivered, useOpenBill, useCancelOrderItem } from "../useWaiter";
import { useOpenBills } from "../../bill/useBill";
import type { ITable } from "../../restaurant-table/types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
    table: ITable;
    onAddItemClick: (billId: string) => void;
}

export const ActiveBill = ({ table, onAddItemClick }: Props) => {
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
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-blue-50/50">
                <h3 className="text-xl font-black text-gray-800">
                    STOL {table.tableNumber < 10 ? `0${table.tableNumber}` : table.tableNumber}
                </h3>
                {activeBill && (
                    <div className="text-sm font-bold text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
                        Total: {calculatedTotal.toLocaleString()} UZS
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
                {!activeBill ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-4">
                        <div className="text-gray-400 mb-4 opacity-50 text-6xl">🍽️</div>
                        <h4 className="text-xl font-bold text-gray-700 mb-2">Stol bo'sh</h4>
                        <p className="text-sm text-gray-500 mb-6">Mijozlar kelishganda yangi hisob ochishingiz mumkin.</p>
                        <button
                            onClick={handleOpenBill}
                            disabled={openBillM.isPending}
                            className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-xl shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-1 transition-all uppercase tracking-wide"
                        >
                            {openBillM.isPending ? "Ochilyapti..." : "Buyurtma Boshlash"}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {isLoading && <div className="text-center py-4 text-gray-400">Yuklanmoqda...</div>}
                        {!isLoading && items.length === 0 && (
                            <div className="text-center py-10 text-gray-400 font-medium">Hali taom qo'shilmagan</div>
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
                                <div key={item.id} className={`p-4 rounded-xl border flex flex-col transition-opacity ${isYetkazildi ? 'opacity-50 grayscale bg-gray-100' : 'bg-white shadow-sm'} ${isTayyor ? 'border-green-400 ring-1 ring-green-400' : 'border-gray-200'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">{item.menuItem?.name || "Noma'lum"}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm font-semibold text-gray-500">{parseInt(item.priceAtOrder).toLocaleString()} UZS</span>
                                                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">x{item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${isYangi ? 'bg-gray-200 text-gray-600' : isTayyorlanmoqda ? 'bg-yellow-100 text-yellow-700' : isTayyor ? 'bg-green-100 text-green-700' : 'bg-transparent text-gray-400 border border-gray-300'}`}>
                                                {item.status}
                                            </div>
                                            {isYangi && (
                                                <button
                                                    onClick={() => {
                                                        if (confirm("Ushbu taomni bekormoqchimisiz?")) {
                                                            cancelOrderItemM.mutate(item.id);
                                                        }
                                                    }}
                                                    disabled={cancelOrderItemM.isPending}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
                                                    title="Bekor qilish"
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
                                            className="mt-3 w-full py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-black text-sm uppercase rounded-lg shadow-sm transition-colors"
                                        >
                                            {markDeliveredM.isPending ? "Kuting..." : "OLIB BORISH"}
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
                <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                    <button
                        onClick={() => onAddItemClick(activeBill.id)}
                        className="w-full py-4 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-base uppercase rounded-xl transition-colors border border-blue-200 border-dashed"
                    >
                        <Plus size={20} strokeWidth={3} />
                        Yana taom qo'shish
                    </button>
                </div>
            )}
        </div>
    );
};
