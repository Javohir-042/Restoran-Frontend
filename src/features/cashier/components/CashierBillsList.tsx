import { useLanguage } from "../../../context/LanguageContext";

import type { ICashierBill } from "../types";
import { CheckCircle2, Clock } from "lucide-react";

interface Props {
    bills: ICashierBill[];
    selectedBillId: string | null;
    onSelect: (bill: ICashierBill) => void;
}

const BillCard = ({ bill, isSelected, onSelect }: { bill: ICashierBill, isSelected: boolean, onSelect: () => void }) => {
    const { t } = useLanguage();
    const items = bill.orderItems || [];

    // Check if there's at least one item and ALL are YETKAZILDI
    const isReadyForPayment = items.length > 0 && items.every(item => item.status === "YETKAZILDI");

    return (
        <button
            onClick={() => {
                if (isReadyForPayment) onSelect();
            }}
            disabled={!isReadyForPayment}
            className={`
                flex flex-col p-4 w-full text-left rounded-xl transition-all duration-300 border-2 shadow-sm
                ${isSelected && isReadyForPayment ? 'border-green-500 dark:border-emerald-500/80 bg-green-50 dark:bg-emerald-500/10 scale-[1.02] shadow-[0_4px_15px_rgba(16,185,129,0.3)]' : ''}
                ${!isSelected && isReadyForPayment ? 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] dark:hover:bg-white/[0.06] hover:border-green-300 hover:shadow-md' : ''}
                ${!isReadyForPayment ? 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/40 opacity-50 cursor-not-allowed grayscale' : ''}
            `}
        >
            <div className="flex justify-between items-center w-full mb-3">
                <span className={`text-xl font-black ${isSelected ? 'text-green-800 dark:text-emerald-400 drop-shadow-sm' : 'text-gray-800 dark:text-gray-200'}`}>
                    {t("Stol").toUpperCase()} {bill.table?.tableNumber || "?"}
                </span>
                <span className={`text-lg font-bold ${isSelected ? 'text-green-900 dark:text-emerald-200' : 'text-gray-900 dark:text-gray-300'}`}>
                    {parseInt(bill.totalAmount).toLocaleString()} {t('UZS')}
                </span>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-white/10 w-full flex items-center gap-2">
                {isReadyForPayment ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-wide">
                        <CheckCircle2 size={18} /> {t("Barcha taomlar yetkazildi")}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-[#a1a1aa] text-sm font-bold uppercase tracking-wide">
                        <Clock size={16} /> {t("Hali tayyor emas")}
                    </div>
                )}
            </div>
        </button>
    );
};

export const CashierBillsList = ({ bills, selectedBillId, onSelect }: Props) => {
    const { t } = useLanguage();
    if (bills.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400 dark:text-[#71717a]">
                <span className="text-5xl mb-4">💳</span>
                <p className="font-bold text-lg">{t("Ochiq hisoblar yo'q")}</p>
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
