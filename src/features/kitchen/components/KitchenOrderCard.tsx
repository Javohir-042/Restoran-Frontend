// ... keeping imports and parseDate ...
import { useEffect, useState } from "react";
import type { IKitchenOrderItem } from "../types";
import { useMarkReady, useStartCooking } from "../useKitchen";
import { Clock, ChefHat, CheckCircle2 } from "lucide-react";
import { getImageUrl } from "@/lib/get-image-url";

interface Props {
    item: IKitchenOrderItem & { menuItem?: { avatarUrl?: string } };
}

export const KitchenOrderCard = ({ item }: Props) => {
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
    const timeColor = isUrgent ? 'text-red-600' : isWarning ? 'text-orange-500' : 'text-blue-600';
    const bgGlow = isUrgent ? 'shadow-[0_0_15px_rgba(220,38,38,0.15)] ring-1 ring-red-200' : isCooking ? 'shadow-md border-blue-200 bg-blue-50/20' : 'shadow-sm border-gray-100 bg-white';

    return (
        <div className={`flex flex-col justify-between h-[250px] rounded-2xl border p-5 transition-all relative overflow-hidden group hover:scale-[1.01] ${bgGlow}`}>
            {/* Status indicator line */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${isCooking ? 'bg-blue-500' : isUrgent ? 'bg-red-500' : 'bg-gray-200'}`} />

            {/* Top row */}
            <div className="flex justify-between items-start pt-1">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-gray-900 text-white font-black px-2.5 py-1 rounded-md text-sm tracking-widest shrink-0">
                            STOL {item.bill?.table?.tableNumber || item.order?.table?.number || "?"}
                        </span>
                        <span className="text-gray-400 font-bold text-sm tracking-wider">
                            #{item.id.slice(-4).toUpperCase()}
                        </span>
                    </div>
                    <div className={`flex items-center gap-1.5 font-bold text-sm ${timeColor}`}>
                        <Clock size={14} className={isUrgent ? 'animate-pulse' : ''} />
                        <span>Kutyapti: {waitingMinutes} daqiqa</span>
                    </div>
                </div>
                <div className="text-xl font-black text-gray-400 opacity-60 tabular-nums">
                    {formattedTime}
                </div>
            </div>

            {/* Middle row: Item details */}
            <div className="flex-1 flex items-center justify-between py-4">
                <div className="flex items-center gap-3 w-[70%]">
                    {item.menuItem?.avatarUrl && (
                        <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100 shadow-sm hidden sm:block">
                            <img src={getImageUrl(item.menuItem.avatarUrl)!} alt="food" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <h3 className="text-[22px] sm:text-2xl font-black text-gray-800 leading-tight uppercase line-clamp-2">
                        {item.menuItem?.name || item.item?.name}
                    </h3>
                </div>
                <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 w-16 h-16 rounded-2xl shrink-0 shadow-inner border border-blue-100/50">
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
                {startCooking.isPending || markReady.isPending ? "Kuting..." : (
                    isPending ? <><ChefHat size={22} /> Qabul qilish</> : <><CheckCircle2 size={22} /> Tayyor</>
                )}
            </button>
        </div>
    );
};
