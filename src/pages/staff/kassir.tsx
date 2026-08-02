import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCashierOpenBills, useDailyRevenue } from "../../features/cashier/useCashier";
import { CashierBillsList } from "../../features/cashier/components/CashierBillsList";
import { PaymentPanel } from "../../features/cashier/components/PaymentPanel";
import { PaymentHistoryTab } from "../../features/cashier/components/PaymentHistoryTab";
import type { ICashierBill } from "../../features/cashier/types";
import { Loader2, History, X } from "lucide-react";

export const KassirPage = () => {
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
            <div className="hidden sm:flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-lg border border-green-200">
                <span className="text-xs font-bold uppercase tracking-wider">Bugungi Tushum:</span>
                <span className="font-black">
                    {new Intl.NumberFormat('uz-UZ').format(totalRevenue)} UZS
                </span>
            </div>

            <button
                onClick={() => setHistoryOpen(true)}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center transition-colors"
                title="To'lovlar tarixi"
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
            <div className="md:w-5/12 lg:w-1/3 flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 shrink-0 bg-gray-50/50">
                    <h2 className="text-xl font-black rounded-lg uppercase text-gray-800">
                        Kutayotgan Hisoblar
                    </h2>
                    <p className="text-xs text-gray-400 font-semibold mt-1 uppercase">faqat taomlari yetkazilgan stollar</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
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
            <div className="md:w-7/12 lg:w-2/3 h-full">
                {selectedBill ? (
                    <PaymentPanel
                        bill={selectedBill}
                        onPaymentSuccess={() => {
                            // Can optionally keep it selected and wait for API to drop it, or force clear.
                            // The useEffect will catch the drop and clear it safely.
                        }}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400 font-medium">
                        <span className="text-6xl mb-4 grayscale opacity-30">💳</span>
                        <h3 className="text-xl font-bold text-gray-600">CHAP TOMONDAN HISOB TANLANG</h3>
                        <p className="mt-2 text-sm text-gray-500">To'lovni qabul qilish uchun tayyor hisobni tanlang.</p>
                    </div>
                )}
            </div>

            {/* History Modal Sliding Drawer */}
            {isHistoryOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-[90] transition-opacity" onClick={() => setHistoryOpen(false)} />
                    <div className="fixed top-0 right-0 h-full w-[400px] max-w-full bg-white z-[100] shadow-2xl flex flex-col">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
                            <h2 className="text-xl font-black uppercase text-gray-800">To'lovlar Tarixi</h2>
                            <button onClick={() => setHistoryOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full">
                                <X size={20} strokeWidth={3} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 custom-scrollbar">
                            <PaymentHistoryTab />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
