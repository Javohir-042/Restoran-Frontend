import { useLanguage } from "../../../context/LanguageContext";

import { useQuery } from "@tanstack/react-query";
import API from "@/config/request";
import { useCancelPayment } from "../useCashier";
import { Loader2, RotateCcw } from "lucide-react";

export const PaymentHistoryTab = () => {
    const { t } = useLanguage();
    const getLocalISOString = (date: Date) => {
        const tzOffset = date.getTimezoneOffset() * 60000;
        return (new Date(date.getTime() - tzOffset)).toISOString().slice(0, -1);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fromStr = getLocalISOString(today);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const toStr = getLocalISOString(endOfDay);

    const { data: history = [], isLoading } = useQuery({
        queryKey: ["cashier", "payment-history", fromStr],
        queryFn: () => API.get(`/payment/history?from=${fromStr}&to=${toStr}`).then(res => res.data?.data || []).catch(() => []),
    });

    const cancelPayment = useCancelPayment();

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-gray-400 dark:text-[#71717a]" /></div>;

    if (history.length === 0) {
        return (
            <div className="p-8 text-center text-gray-400 dark:text-[#71717a]">
                <span className="text-4xl opacity-50 grayscale">📜</span>
                <p className="mt-4 text-sm font-semibold">{t("Tarix bo'sh yoki topilmadi.")}</p>
            </div>
        );
    }

    const formatter = new Intl.NumberFormat('uz-UZ', { style: 'decimal' });

    return (
        <div className="flex flex-col gap-4 relative">
            {/* Background ambient lighting for the list */}
            <div className="hidden dark:block absolute top-[10%] left-[-20%] w-[50%] h-[50%] bg-blue-600/10 blur-[80px] rounded-full pointer-events-none -z-10" />

            {history.map((p: any) => (
                <div key={p.id} className="relative group flex justify-between items-center p-5 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-gray-50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] dark:border-slate-700/50 rounded-2xl shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:dark:bg-slate-800/60 transition-all duration-300 overflow-hidden z-10 hover:-translate-y-0.5 hover:shadow-lg dark:hover:border-blue-500/30">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10 transform translate-x-[-100%] group-hover:translate-x-0 duration-700" />

                    <div>
                        <div className="font-black text-gray-800 dark:text-slate-100 text-xl tracking-tight dark:drop-shadow-[0_0_8px_rgba(241,245,249,0.3)]">
                            {formatter.format(p.amount)} <span className="text-sm text-gray-500 dark:text-blue-400 font-bold uppercase">UZS</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="bg-gray-100 dark:bg-blue-500/10 px-2.5 py-1 rounded-md border dark:border-blue-500/20 text-[10px] font-black text-gray-500 dark:text-blue-300 tracking-wider uppercase shadow-inner">
                                {p.paymentMethod}
                            </span>
                            <span className="text-xs font-semibold text-gray-400 dark:text-slate-400 flex items-center gap-1 opacity-80">
                                🕒 {new Date(p.createdAt).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>

                    {p.status !== "BEKOR_QILINDI" ? (
                        <button
                            onClick={() => cancelPayment.mutate(p.id)}
                            disabled={cancelPayment.isPending}
                            className="p-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-transparent dark:hover:border-red-500/30 rounded-xl flex items-center gap-1.5 font-bold text-[11px] uppercase transition-all shadow-sm active:scale-95"
                        >
                            <RotateCcw size={14} className={cancelPayment.isPending ? "animate-spin" : ""} />
                            {cancelPayment.isPending ? "..." : t("Bekor qilish")}
                        </button>
                    ) : (
                        <span className="text-[10px] font-black text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border dark:border-red-900/50 px-2 py-1.5 rounded-lg shadow-inner">
                            BEKOR QILINGAN
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};
