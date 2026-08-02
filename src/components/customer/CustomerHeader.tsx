import { useGeneralSettings } from "@/features/settings/useSettings";

export const CustomerHeader = ({ tableNumber, billStatus }: { tableNumber?: number; billStatus?: string }) => {
    const { data: generalData } = useGeneralSettings();
    return (
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-5 py-4 flex items-center justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
            <div>
                <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 tracking-tight">{generalData?.restaurantName || "RESTORAN"}</h1>
                <p className="text-xs font-semibold text-gray-500 mt-0.5 uppercase tracking-wider">{tableNumber ? `Stol ${tableNumber}` : "Yuklanmoqda..."}</p>
            </div>
            {billStatus === "OCHIQ" && (
                <div className="flex items-center gap-1.5 bg-green-50/80 border border-green-200/50 text-green-700 px-3 py-1.5 rounded-full shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[11px] font-bold tracking-wide uppercase">Ochiq hisob</span>
                </div>
            )}
        </div>
    );
};
