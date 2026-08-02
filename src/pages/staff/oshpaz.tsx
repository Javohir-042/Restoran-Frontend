import { useKitchenQueue } from "../../features/kitchen/useKitchen";
import { useKitchenSocket } from "../../features/kitchen/useKitchenSocket";
import { KitchenOrderCard } from "../../features/kitchen/components/KitchenOrderCard";
import { CheckCircle2, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";

export const OshpazPage = () => {
    const { userName } = useAuth();
    const { data: queueItems = [], isLoading, isError } = useKitchenQueue();
    const { isConnected } = useKitchenSocket(); // Automates websocket connection & sound

    const isDrink = (item: any) => {
        const catName = (item.menuItem?.category?.name || "").toLowerCase();
        const itemName = (item.menuItem?.name || item.item?.name || "").toLowerCase();
        const drinkKeywords = ["ichimlik", "ichki", " पेय", "drink", "napitk", "bar"];
        const itemKeywords = ["cola", "fanta", "sprite", "pepsi", "suv", "choy", "kofe", "coffee", "lola", "sharbat", "sok"];

        return drinkKeywords.some(kw => catName.includes(kw)) || itemKeywords.some(kw => itemName.includes(kw));
    };

    // Filter relevant statuses and ONLY cookable items
    const activeItems = queueItems.filter(i => (i.status === "YANGI" || i.status === "TAYYORLANMOQDA") && !isDrink(i));

    return (
        <div className="h-full flex flex-col">
            {/* Oshpaz Page Header specific to role */}
            <div className="flex items-center justify-between mb-6 shrink-0 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none">
                        Buyurtmalar Navbati
                    </h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">Oshpaz: {userName || "Noma'lum"}</p>
                </div>

                {/* Connection Status Indicator */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold transition-colors ${isConnected ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                    {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
                    {isConnected ? "ULANGAN" : "UZILGAN"}
                </div>
            </div>

            {/* Queue Grid or Empty State */}
            <div className="flex-1 overflow-y-auto min-h-0 relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : isError ? (
                    <div className="absolute inset-0 flex items-center justify-center text-red-500 font-medium bg-white rounded-xl">
                        Ulanishda xatolik yuz berdi. Iltimos sahifani yangilang.
                    </div>
                ) : activeItems.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={56} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Hozircha yangi buyurtma yo'q</h3>
                        <p className="text-gray-500 font-medium">Barcha taomlar tayyorlangan yoki hali buyurtma tushmagan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                        {activeItems.map(item => (
                            <KitchenOrderCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
