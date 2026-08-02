
import { useQuery } from "@tanstack/react-query";
import API from "@/config/request";
import { useCancelPayment } from "../useCashier";
import { Loader2, RotateCcw } from "lucide-react";

export const PaymentHistoryTab = () => {
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

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;

    if (history.length === 0) {
        return (
            <div className="p-8 text-center text-gray-400">
                <span className="text-4xl">📜</span>
                <p className="mt-2 text-sm font-semibold">Tarix bo'sh yoki topilmadi.</p>
            </div>
        );
    }

    const formatter = new Intl.NumberFormat('uz-UZ', { style: 'decimal' });

    return (
        <div className="flex flex-col gap-3">
            {history.map((p: any) => (
                <div key={p.id} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div>
                        <div className="font-bold text-gray-800 text-lg">{formatter.format(p.amount)} sum</div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-bold text-gray-500">{p.paymentMethod}</span>
                            <span className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleTimeString()}</span>
                        </div>
                    </div>
                    {p.status !== "BEKOR_QILINDI" ? (
                        <button
                            onClick={() => cancelPayment.mutate(p.id)}
                            disabled={cancelPayment.isPending}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg flex items-center gap-1 font-bold text-xs uppercase"
                        >
                            <RotateCcw size={14} />
                            {cancelPayment.isPending ? "..." : "Bekor qilish"}
                        </button>
                    ) : (
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">BEKOR QILINGAN</span>
                    )}
                </div>
            ))}
        </div>
    );
};
