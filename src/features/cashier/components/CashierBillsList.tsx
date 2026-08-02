
import type { ICashierBill } from "../types";
import { useBillDeliveryStatus } from "../useCashier";
import { Loader2, CheckCircle2, Clock } from "lucide-react";

interface Props {
    bills: ICashierBill[];
    selectedBillId: string | null;
    onSelect: (bill: ICashierBill) => void;
}

const BillCard = ({ bill, isSelected, onSelect }: { bill: ICashierBill, isSelected: boolean, onSelect: () => void }) => {
    const { data: items = [], isLoading } = useBillDeliveryStatus(bill.id);

    // Check if there's at least one item and ALL are YETKAZILDI
    const isReadyForPayment = items.length > 0 && items.every(item => item.status === "YETKAZILDI");

    return (
        <button
            onClick={() => {
                if (isReadyForPayment) onSelect();
            }}
            disabled={!isReadyForPayment}
            className={`
                flex flex-col p-4 w-full text-left rounded-xl transition-all duration-200 border-2 shadow-sm
                ${isSelected && isReadyForPayment ? 'border-green-500 bg-green-50 scale-[1.02]' : ''}
                ${!isSelected && isReadyForPayment ? 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md' : ''}
                ${!isReadyForPayment ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed grayscale' : ''}
            `}
        >
            <div className="flex justify-between items-center w-full mb-3">
                <span className="text-xl font-black text-gray-800">
                    STOL {bill.table?.tableNumber || "?"}
                </span>
                <span className="text-lg font-bold text-gray-900">
                    {parseInt(bill.totalAmount).toLocaleString()} so'm
                </span>
            </div>

            <div className="pt-3 border-t border-gray-100 w-full flex items-center gap-2">
                {isLoading ? (
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold uppercase">
                        <Loader2 size={16} className="animate-spin" /> tekshirilmoqda
                    </div>
                ) : isReadyForPayment ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-bold uppercase tracking-wide">
                        <CheckCircle2 size={18} /> Barcha taomlar yetkazildi
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-bold uppercase tracking-wide">
                        <Clock size={16} /> Hali tayyor emas
                    </div>
                )}
            </div>
        </button>
    );
};

export const CashierBillsList = ({ bills, selectedBillId, onSelect }: Props) => {
    if (bills.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <span className="text-5xl mb-4">💳</span>
                <p className="font-bold text-lg">Ochiq hisoblar yo'q</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {bills.map(b => (
                <BillCard
                    key={b.id}
                    bill={b}
                    isSelected={selectedBillId === b.id}
                    onSelect={() => onSelect(b)}
                />
            ))}
        </div>
    );
};
