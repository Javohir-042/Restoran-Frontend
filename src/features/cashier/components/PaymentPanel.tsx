import { useState, useEffect } from "react";
import type { ICashierBill } from "../types";
import { useBillDeliveryStatus, useCreatePayment, usePaymentSummary } from "../useCashier";

interface Props {
    bill: ICashierBill;
    onPaymentSuccess: () => void;
}

export const PaymentPanel = ({ bill, onPaymentSuccess }: Props) => {
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
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-blue-50/30">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">STOL {bill.table?.tableNumber || "?"}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{summary && summary.totalPaid > 0 ? 'QISMAN TO\'LANGAN' : 'YANGI'}</span>
            </div>

            <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x border-gray-100 overflow-hidden">
                {/* Items List */}
                <div className="md:w-1/2 flex flex-col bg-gray-50/50">
                    <div className="p-4 border-b border-gray-100 bg-white">
                        <h4 className="font-bold text-gray-500 uppercase tracking-widest text-xs">Buyurtmalar</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <div className="flex flex-col gap-3">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-start text-sm">
                                    <div className="font-semibold text-gray-800 pr-2">
                                        <span className="text-gray-400 mr-2">{item.quantity}x</span>
                                        {item.menuItem?.name || "Noma'lum"}
                                    </div>
                                    <div className="font-bold text-gray-600">
                                        {formatter.format(parseInt(item.priceAtOrder) * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Payment Actions */}
                <div className="md:w-1/2 bg-white flex flex-col p-5 overflow-y-auto">
                    {/* Summary Math */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                        <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
                            <span>Taomlar yig'indisi:</span>
                            <span>{formatter.format(parseInt(bill.subtotal))}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold text-gray-500 mb-2">
                            <span>Xizmat haqi {bill.serviceFeePercent ? `(${bill.serviceFeePercent}%)` : ''}:</span>
                            <span>{formatter.format(parseInt(bill.totalAmount) - parseInt(bill.subtotal))}</span>
                        </div>
                        <div className="flex justify-between text-lg font-black text-gray-900 border-t border-gray-200 pt-3 mt-3">
                            <span>JAMI:</span>
                            <span>{formatter.format(parseInt(bill.totalAmount))} UZS</span>
                        </div>
                    </div>

                    {summary && summary.totalPaid > 0 && (
                        <div className="mb-4 bg-green-50 p-3 rounded-xl border border-green-100 flex justify-between items-center text-green-700 font-bold">
                            <span>To'langan summa:</span>
                            <span className="text-lg">{formatter.format(summary.totalPaid)}</span>
                        </div>
                    )}

                    {totalToPay > 0 ? (
                        <>
                            <div className="mb-5">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">To'lov shakli</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(["NAQD", "UZCARD", "HUMO"] as const).map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setMethod(m)}
                                            className={`py-3 rounded-lg font-black text-sm transition-colors border-2 ${method === m ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-500 hover:border-blue-300'}`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Qabul Qilinadigan Summa</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amountStr}
                                        onChange={e => setAmountStr(e.target.value)}
                                        className="w-full text-3xl font-black text-gray-900 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl p-4 transition-all outline-none"
                                        min="0"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">UZS</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePay}
                                disabled={createPayment.isPending}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-xl uppercase tracking-wider rounded-xl shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-1 transition-all"
                            >
                                {createPayment.isPending ? "KUTING..." : "QABUL QILISH"}
                            </button>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col justify-center items-center text-green-600 bg-green-50 rounded-xl p-6 border-2 border-green-200 border-dashed">
                            <span className="text-5xl mb-4">✅</span>
                            <h3 className="font-black text-2xl uppercase tracking-tight text-center">To'liq to'langan</h3>
                            <p className="font-semibold text-center mt-2 opacity-80">Hisob yopilgan yoki yopilmoqda</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
