import { useLanguage } from "../../../context/LanguageContext";
import { useState, useEffect } from "react";
import type { ICashierBill } from "../types";
import { useBillDeliveryStatus, useCreatePayment, usePaymentSummary } from "../useCashier";

interface Props {
    bill: ICashierBill;
    onPaymentSuccess: () => void;
}

export const PaymentPanel = ({ bill, onPaymentSuccess }: Props) => {
    const { t } = useLanguage();
    const { data: items = [] } = useBillDeliveryStatus(bill.id);
    const { data: summary } = usePaymentSummary(bill.id);
    const createPayment = useCreatePayment();

    const totalToPay = summary?.remaining ?? parseFloat(bill.totalAmount || "0") ?? 0;
    const [amountStr, setAmountStr] = useState(String(totalToPay));
    const [method, setMethod] = useState<"NAQD" | "UZCARD" | "HUMO">("NAQD");

    // Reset default amount when bill changes or summary updates
    useEffect(() => {
        setAmountStr(String(totalToPay));
    }, [totalToPay, bill.id]);

    const handlePay = () => {
        const val = parseFloat(amountStr);
        if (isNaN(val) || val <= 0) return;

        createPayment.mutate(
            { billId: bill.id, amount: val, paymentMethod: method },
            {
                onSuccess: () => {
                    if (val >= totalToPay) {
                        // Fully paid - auto close will happen on backend, just trigger parent reset
                        onPaymentSuccess();
                    }
                }
            }
        );
    };

    const formatter = new Intl.NumberFormat('uz-UZ', { style: 'decimal' });

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#0a0a0f]/60 dark:backdrop-blur-2xl rounded-2xl shadow-sm border border-gray-100/50 dark:border-white/5 overflow-hidden transition-colors">
            {/* Header */}
            <div className="p-5 border-b border-gray-50 dark:border-white/5 flex items-center justify-between bg-blue-50/30 dark:bg-blue-500/10 transition-colors">
                <h3 className="text-2xl font-black text-gray-900 dark:text-[#fafafa] tracking-tight">{t("Stol")} {bill.table?.tableNumber || "?"}</h3>
                <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full">{summary && summary.totalPaid > 0 ? t("QISMAN TO'LANGAN") : t("YANGI")}</span>
            </div>

            <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x-0 border-transparent dark:border-white/5 overflow-hidden">
                {/* Items List */}
                <div className="md:w-1/2 flex flex-col bg-gray-50/30 dark:bg-black/20 transition-colors">
                    <div className="p-4 border-b border-gray-50 dark:border-white/5 bg-white dark:bg-white/[0.03]">
                        <h4 className="font-bold text-gray-500 dark:text-[#a1a1aa] uppercase tracking-widest text-xs">{t("Buyurtmalar")}</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <div className="flex flex-col gap-3">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-start text-sm pb-2 border-b border-gray-50 dark:border-white/5 last:border-0">
                                    <div className="font-semibold text-gray-800 dark:text-[#fafafa] pr-2">
                                        <span className="text-gray-400 dark:text-[#71717a] mr-2">{item.quantity}x</span>
                                        {item.menuItem?.name || "Noma'lum"}
                                    </div>
                                    <div className="font-bold text-gray-600 dark:text-[#a1a1aa]">
                                        {formatter.format(parseInt(item.priceAtOrder) * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Payment Actions */}
                <div className="md:w-1/2 bg-white dark:bg-black/40 flex flex-col p-6 overflow-y-auto relative">
                    {/* Inner subtle glow */}
                    <div className="hidden dark:block absolute top-[20%] left-[20%] w-32 h-32 bg-indigo-500/10 blur-[60px] pointer-events-none" />

                    {/* Summary Math */}
                    <div className="bg-gray-50 dark:bg-white/[0.03] p-5 rounded-2xl border border-gray-100/50 dark:border-white/10 mb-6 relative z-10 shadow-inner">
                        <div className="flex justify-between text-sm font-semibold text-gray-500 dark:text-[#a1a1aa] mb-2">
                            <span>{t("Taomlar yig'indisi:")}</span>
                            <span>{formatter.format(parseInt(bill.subtotal))}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold text-gray-500 dark:text-[#a1a1aa] mb-2">
                            <span>{t("Xizmat haqi")} {bill.serviceFeePercent ? `(${bill.serviceFeePercent}%)` : ''}:</span>
                            <span>{formatter.format(parseInt(bill.totalAmount) - parseInt(bill.subtotal))}</span>
                        </div>
                        <div className="flex justify-between text-lg font-black text-gray-900 dark:text-blue-400 border-t border-0 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] dark:border-white/10 pt-4 mt-4 relative">
                            <span className="uppercase text-sm tracking-wider flex items-center">{t("JAMI:")}</span>
                            <span className="dark:drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]">{formatter.format(parseInt(bill.totalAmount))} UZS</span>
                        </div>
                    </div>

                    {summary && summary.totalPaid > 0 && (
                        <div className="mb-4 bg-green-50 dark:bg-emerald-500/10 p-3 rounded-xl border border-green-100 dark:border-emerald-500/20 flex justify-between items-center text-green-700 dark:text-emerald-400 font-bold">
                            <span>{t("To'langan summa:")}</span>
                            <span className="text-lg">{formatter.format(summary.totalPaid)}</span>
                        </div>
                    )}

                    {totalToPay > 0 ? (
                        <>
                            <div className="mb-5">
                                <label className="block text-xs font-bold text-gray-400 dark:text-[#a1a1aa] uppercase tracking-wider mb-2">{t("To'lov shakli")}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(["NAQD", "UZCARD", "HUMO"] as const).map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setMethod(m)}
                                            className={`py-3 rounded-xl font-black text-sm transition-all border-2 ${method === m ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 shadow-sm' : 'border-gray-200 dark:border-white/5 bg-white dark:bg-white/[0.02] text-gray-500 dark:text-[#a1a1aa] hover:border-blue-300 dark:hover:border-blue-500/30'}`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8 relative z-10">
                                <label className="block text-xs font-bold text-gray-400 dark:text-[#a1a1aa] uppercase tracking-wider mb-2">{t("Qabul qilinadigan summa")}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amountStr}
                                        onChange={e => setAmountStr(e.target.value)}
                                        className="w-full text-3xl font-black text-gray-900 dark:text-[#fafafa] bg-gray-50 dark:bg-white/[0.05] border-2 border-0 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] dark:border-white/10 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-500/20 rounded-2xl p-4 transition-all outline-none pr-16 shadow-inner"
                                        min="0"
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#a1a1aa] font-bold">UZS</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePay}
                                disabled={createPayment.isPending}
                                className="w-full mt-auto py-5 relative overflow-hidden group bg-blue-600 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 hover:bg-blue-700 dark:hover:from-blue-500 dark:hover:to-indigo-500 active:bg-blue-800 text-white font-black text-xl uppercase tracking-widest rounded-2xl shadow-[0_4px_0_0_rgb(29,78,216)] dark:shadow-[0_0_25px_rgba(79,70,229,0.5)] active:shadow-none dark:active:shadow-none active:translate-y-1 transition-all border dark:border-white/10"
                            >
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
                                <div className="relative z-10 flex items-center justify-center gap-2">{createPayment.isPending ? t("Kuting...") : t("QABUL QILISH")}</div>
                            </button>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col justify-center items-center text-green-600 dark:text-emerald-400 bg-green-50 dark:bg-emerald-500/10 rounded-xl p-6 border-2 border-green-200 dark:border-emerald-500/20 border-dashed backdrop-blur-sm">
                            <span className="text-5xl mb-4">✅</span>
                            <h3 className="font-black text-2xl uppercase tracking-tight text-center">{t("To'liq to'langan")}</h3>
                            <p className="font-semibold text-center mt-2 opacity-80">{t("Hisob yopilgan yoki yopilmoqda")}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
