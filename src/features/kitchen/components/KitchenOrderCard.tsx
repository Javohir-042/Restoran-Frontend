import { useEffect, useState } from "react";
import type { IKitchenOrderItem } from "../types";
import { useMarkReady, useStartCooking } from "../useKitchen";
import { Clock, ChefHat, CheckCircle2 } from "lucide-react";
import { getImageUrl } from "@/lib/get-image-url";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
    item: IKitchenOrderItem & { menuItem?: { avatarUrl?: string } };
}

export const KitchenOrderCard = ({ item }: Props) => {
    const { t } = useLanguage();

    const parseDate = (d: string) => {
        if (!d) return new Date();
        if (d.includes('T')) return new Date(d);
        const [datePart, timePart] = d.split(', ');
        if (!datePart || !timePart) return new Date();
        const [day, month, year] = datePart.split('/');
        return new Date(`${year}-${month}-${day}T${timePart}`);
    };

    const [waitingMinutes, setWaitingMinutes] = useState(0);

    useEffect(() => {
        const orderDate = parseDate(item.createdAt);
        const calculateDiff = () => {
            const diffMs = Date.now() - orderDate.getTime();
            setWaitingMinutes(Math.max(0, Math.floor(diffMs / 60000)));
        };
        calculateDiff();
        const interval = setInterval(calculateDiff, 10000);
        return () => clearInterval(interval);
    }, [item.createdAt]);

    const startCooking = useStartCooking();
    const markReady = useMarkReady();

    const isPending = item.status === "YANGI";
    const isCooking = item.status === "TAYYORLANMOQDA";

    const handleAction = () => {
        if (isPending) startCooking.mutate(item.id);
        else if (isCooking) markReady.mutate(item.id);
    };

    if (!isPending && !isCooking) return null;

    const formattedTime = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit'
    }).format(parseDate(item.createdAt));

    // Time-based coloring
    const isUrgent = waitingMinutes >= 20;
    const isWarning = waitingMinutes >= 10 && waitingMinutes < 20;
    const timeColor = isUrgent ? 'text-red-600 dark:text-red-400' : isWarning ? 'text-orange-500 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400';
    const bgGlow = isUrgent ? 'shadow-[0_8px_30px_rgba(220,38,38,0.15)] ring-1 ring-red-200 dark:ring-red-500/30 bg-white dark:bg-rose-950/40 dark:backdrop-blur-xl'
        : isCooking ? 'shadow-[0_8px_30px_rgba(59,130,246,0.15)] border border-blue-200 dark:border-blue-500/30 bg-blue-50/20 dark:bg-blue-900/20 dark:backdrop-blur-xl'
            : 'shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-white/10 bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl hover:dark:border-white/20 hover:dark:bg-white/[0.06]';

    return (
        <div className={`flex flex-col justify-between h-[250px] rounded-3xl p-5 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 ${bgGlow}`}>
            {/* Status indicator line */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${isCooking ? 'bg-blue-500 dark:bg-blue-400 dark:shadow-[0_0_15px_rgba(96,165,250,0.6)]' : isUrgent ? 'bg-red-500 dark:bg-red-500 dark:shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-gray-200 dark:bg-white/10'}`} />

            {/* Top row */}
            <div className="flex justify-between items-start pt-1">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-gray-900 dark:bg-white/10 text-white dark:text-gray-200 font-extrabold px-3 py-1.5 rounded-lg text-xs tracking-widest shrink-0 shadow-sm dark:shadow-none border dark:border-white/5">
                            {t("STOL")} {item.bill?.table?.tableNumber || item.order?.table?.number || "?"}
                        </span>
                        <span className="text-gray-400 dark:text-[#a1a1aa] font-bold text-sm tracking-wider bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md border border-transparent dark:border-white/5">
                            #{item.id.slice(-4).toUpperCase()}
                        </span>
                    </div>
                    <div className={`flex items-center gap-1.5 font-bold text-sm ${timeColor} dark:opacity-90`}>
                        <Clock size={16} strokeWidth={2.5} className={isUrgent ? 'animate-pulse' : ''} />
                        <span>{t("Kutyapti:")} {waitingMinutes} {t("daqiqa")}</span>
                    </div>
                </div>
                <div className="text-xl font-black text-gray-400 dark:text-[#71717a] opacity-60 tabular-nums bg-gray-50 dark:bg-white/5 px-3 py-1 rounded-lg border border-transparent dark:border-white/5">
                    {formattedTime}
                </div>
            </div>

            {/* Middle row: Item details */}
            <div className="flex-1 flex items-center justify-between py-4">
                <div className="flex items-center gap-4 w-[75%]">
                    {item.menuItem?.avatarUrl && (
                        <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-white/5 overflow-hidden shrink-0 border border-gray-100 dark:border-white/10 shadow-sm hidden sm:block p-0.5">
                            <img src={getImageUrl(item.menuItem.avatarUrl)!} alt="food" className="w-full h-full object-cover rounded-lg" />
                        </div>
                    )}
                    <h3 className="text-[22px] sm:text-2xl font-black text-gray-800 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-white/70 leading-tight uppercase line-clamp-2 drop-shadow-sm">
                        {item.menuItem?.name || item.item?.name}
                    </h3>
                </div>
                <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 w-16 h-16 rounded-2xl shrink-0 shadow-inner dark:shadow-[inset_0_2px_10px_rgba(59,130,246,0.2)] border border-blue-100/50 dark:border-blue-400/30 transform group-hover:scale-105 transition-transform">
                    <span className="text-xs font-bold leading-none mb-0.5">X</span>
                    <span className="text-3xl font-black leading-none">{item.quantity}</span>
                </div>
            </div>

            {/* Bottom row: Action Button */}
            <button
                onClick={handleAction}
                disabled={startCooking.isPending || markReady.isPending}
                className={`
                    w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-lg uppercase tracking-wider transition-all
                    active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
                    ${isPending
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-1'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-[0_4px_0_0_rgb(21,128,61)] active:shadow-none active:translate-y-1'
                    }
                `}
            >
                {startCooking.isPending || markReady.isPending ? t("Kuting...") : (
                    isPending ? <><ChefHat size={22} /> {t("Qabul qilish")}</> : <><CheckCircle2 size={22} /> {t("Tayyor")}</>
                )}
            </button>
        </div>
    );
};
