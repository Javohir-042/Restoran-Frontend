import { useKitchenQueue } from "../../features/kitchen/useKitchen";
import { useKitchenSocket } from "../../features/kitchen/useKitchenSocket";
import { KitchenOrderCard } from "../../features/kitchen/components/KitchenOrderCard";
import { CheckCircle2, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { useLanguage } from "../../context/LanguageContext";

export const OshpazPage = () => {
    const { userName } = useAuth();
    const { t } = useLanguage();
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
        <div className="h-full flex flex-col pt-2">
            {/* Oshpaz Page Header specific to role */}
            <div className="flex items-center justify-between mb-8 shrink-0 bg-white dark:bg-[#0a0a0f]/60 dark:backdrop-blur-2xl p-5 rounded-2xl shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/5 transition-all">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-[#fafafa] tracking-tight uppercase leading-none">
                        {t("Buyurtmalar Navbati")}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-[#a1a1aa] font-medium mt-1">
                        {t("Oshpaz:")} {userName || t("Noma'lum")}
                    </p>
                </div>

                {/* Connection Status Indicator */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold shadow-inner transition-all ${isConnected ? "bg-green-50 dark:bg-emerald-500/10 text-green-700 dark:text-emerald-400 border-green-200 dark:border-emerald-500/20" : "bg-red-50 dark:bg-rose-500/10 text-red-600 dark:text-rose-400 border-red-200 dark:border-rose-500/20"}`}>
                    {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
                    {isConnected ? t("ULANGAN") : t("UZILGAN")}
                </div>
            </div>

            {/* Queue Grid or Empty State */}
            <div className="flex-1 overflow-y-auto min-h-0 relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : isError ? (
                    <div className="absolute inset-0 flex items-center justify-center text-red-500 font-medium bg-white dark:bg-[#18181b] border border-gray-100 dark:border-[#27272a] rounded-xl transition-colors">
                        {t("Ulanishda xatolik yuz berdi. Iltimos sahifani yangilang.")}
                    </div>
                ) : activeItems.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0f]/40 dark:backdrop-blur-md rounded-2xl shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/5 transition-all">
                        <div className="w-24 h-24 bg-green-50 dark:bg-emerald-500/10 text-green-500 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-inner dark:shadow-[inset_0_2px_10px_rgba(16,185,129,0.2)] border dark:border-emerald-500/20">
                            <CheckCircle2 size={56} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-[#fafafa] mb-2">{t("Hozircha yangi buyurtma yo'q")}</h3>
                        <p className="text-gray-500 dark:text-[#a1a1aa] font-medium">{t("Barcha taomlar tayyorlangan yoki hali buyurtma tushmagan.")}</p>
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
