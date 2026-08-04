import { useLanguage } from "../../context/LanguageContext";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCashierOpenBills, useDailyRevenue } from "../../features/cashier/useCashier";
import { CashierBillsList } from "../../features/cashier/components/CashierBillsList";
import { PaymentPanel } from "../../features/cashier/components/PaymentPanel";
import { PaymentHistoryTab } from "../../features/cashier/components/PaymentHistoryTab";
import type { ICashierBill } from "../../features/cashier/types";
import { Loader2, History, X } from "lucide-react";

export const KassirPage = () => {
    const { t } = useLanguage();
    const { data: openBills = [], isLoading } = useCashierOpenBills();
    const { data: revenueOpt } = useDailyRevenue();
    const totalRevenue = revenueOpt?.totalRevenue || 0;

    const [selectedBill, setSelectedBill] = useState<ICashierBill | null>(null);
    const [isHistoryOpen, setHistoryOpen] = useState(false);

    // Auto-select first bill if none selected or if previously selected bill was paid/closed
    useEffect(() => {
        if (!selectedBill && openBills.length > 0) {
            // We can optionally auto-select, but since it requires clicking to check item delivery status, maybe we just leave it null.
        }

        // If the selected bill disappears from open bills (it was fully paid), clear selection.
        if (selectedBill && !openBills.find(b => b.id === selectedBill.id)) {
            setSelectedBill(null);
        }
    }, [openBills, selectedBill]);

    // Portal for Revenue Indicator
    const portalTarget = document.getElementById("staff-header-actions");
    const headerActions = portalTarget ? createPortal(
        <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-green-50 dark:bg-emerald-500/10 text-green-700 dark:text-emerald-400 px-4 py-1.5 rounded-lg border border-green-200 dark:border-emerald-500/30 shadow-sm backdrop-blur-md">
                <span className="text-xs font-bold uppercase tracking-wider">{t("Bugungi Tushum:")}</span>
                <span className="font-black">
                    {new Intl.NumberFormat('uz-UZ').format(totalRevenue)} UZS
                </span>
            </div>

            <button
                onClick={() => setHistoryOpen(true)}
                className="p-2 bg-gray-50 dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 text-gray-700 dark:text-white rounded-lg flex items-center transition-all border dark:border-white/5 active:scale-95"
                title={t("To'lovlar tarixi")}
            >
                <History size={20} />
            </button>
        </div>,
        portalTarget
    ) : null;

    return (
        <div className="h-full flex flex-col md:flex-row gap-4 p-1 overflow-hidden relative">
            {headerActions}

            {/* Left Column: Waiting Bills */}
            <div className="md:w-5/12 lg:w-1/3 flex flex-col h-full bg-white/80 dark:bg-[#0a0a0f]/60 backdrop-blur-2xl dark:backdrop-blur-2xl rounded-2xl shadow-sm border border-gray-100/50 dark:border-white/5 overflow-hidden transition-colors z-10">
                <div className="p-4 border-0 border-b border-gray-50/50 dark:border-white/5 shrink-0 bg-gray-50/50 dark:bg-white/[0.02]">
                    <h2 className="text-xl font-black rounded-lg uppercase text-gray-800 dark:text-[#fafafa]">
                        {t("Kutayotgan Hisoblar")}
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-[#a1a1aa] font-semibold mt-1 uppercase">{t("Faqat taomlari yetkazilgan stollar")}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-transparent">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-500 dark:text-blue-400" size={32} /></div>
                    ) : (
                        <CashierBillsList
                            bills={openBills}
                            selectedBillId={selectedBill?.id || null}
                            onSelect={setSelectedBill}
                        />
                    )}
                </div>
            </div>

            {/* Right Column: Payment Panel */}
            <div className="md:w-7/12 lg:w-2/3 h-full relative z-10">
                {selectedBill ? (
                    <PaymentPanel
                        bill={selectedBill}
                        onPaymentSuccess={() => {
                            // Automatically handled by hooks.
                        }}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-white/80 dark:bg-[#0a0a0f]/60 backdrop-blur-2xl dark:backdrop-blur-2xl rounded-2xl border border-dashed border-gray-300 dark:border-white/10 text-gray-400 dark:text-[#71717a] font-medium relative overflow-hidden transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-2xl pointer-events-none dark:opacity-100 opacity-50" />
                        <span className="text-6xl mb-4 grayscale opacity-30">💳</span>
                        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 text-center uppercase">{t("CHAP TOMONDAN HISOB TANLANG")}</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-[#a1a1aa] text-center">{t("To'lovni qabul qilish uchun tayyor hisobni tanlang.")}</p>
                    </div>
                )}
            </div>

            {/* History Modal Sliding Drawer */}
            {isHistoryOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 dark:bg-[#050508]/80 dark:backdrop-blur-md z-[90] transition-opacity" onClick={() => setHistoryOpen(false)} />
                    <div className="fixed top-0 right-0 h-full w-[450px] max-w-full bg-white dark:bg-[#0a0a0f] z-[100] shadow-2xl flex flex-col dark:shadow-[-20px_0_50px_rgba(0,0,0,0.8)] border-l dark:border-white/5 transition-transform duration-300 animate-in slide-in-from-right">
                        <div className="p-5 border-0 border-b border-gray-50/50 dark:border-white/10 flex items-center justify-between bg-gray-50/80 dark:bg-white/[0.02]">
                            <h2 className="text-xl font-black uppercase text-gray-800 dark:text-[#fafafa]">{t("To'lovlar Tarixi")}</h2>
                            <button onClick={() => setHistoryOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors border dark:border-transparent dark:hover:border-white/5">
                                <X size={20} strokeWidth={3} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-transparent custom-scrollbar">
                            <PaymentHistoryTab />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
