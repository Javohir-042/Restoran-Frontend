import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell, Loader2 } from "lucide-react";
import { useTables } from "../../features/restaurant-table/useTables";
import { useReadyItems } from "../../features/waiter/useWaiter";
import { useWaiterSocket } from "../../features/waiter/useWaiterSocket";
import { TablesGrid } from "../../features/waiter/components/TablesGrid";
import { ActiveBill } from "../../features/waiter/components/ActiveBill";
import { ReadyItemsDrawer } from "../../features/waiter/components/ReadyItemsDrawer";
import { WaiterMenuModal } from "../../features/waiter/components/WaiterMenuModal";
import type { ITable } from "../../features/restaurant-table/types";
import { useLanguage } from "../../context/LanguageContext";

export const OfitsiantPage = () => {
    const { t } = useLanguage();
    const { data: tables = [], isLoading: tablesLoading } = useTables();
    const { data: readyItems = [] } = useReadyItems();
    const { isConnected } = useWaiterSocket();
    const [selectedTable, setSelectedTable] = useState<ITable | null>(null);
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    // Add Item Modal State
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [targetBillId, setTargetBillId] = useState<string | null>(null);

    // Initial select first table if none selected
    useEffect(() => {
        if (!selectedTable && tables.length > 0) {
            setSelectedTable(tables[0]);
        }
    }, [tables, selectedTable]);

    const handleOpenMenu = (billId: string) => {
        setTargetBillId(billId);
        setMenuOpen(true);
    };

    // Portal actions (Notification Bell)
    const portalTarget = document.getElementById("staff-header-actions");
    const headerActions = portalTarget ? createPortal(
        <button
            onClick={() => setDrawerOpen(true)}
            className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors mx-2"
        >
            <Bell size={24} className={readyItems.length > 0 ? "animate-pulse stroke-blue-600" : ""} />
            {readyItems.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {readyItems.length}
                </span>
            )}
        </button>,
        portalTarget
    ) : null;

    if (tablesLoading) {
        return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
    }

    return (
        <div className="h-full flex flex-col md:flex-row gap-4 p-1 overflow-hidden relative pt-2">
            {headerActions}

            {/* Left Column: Tables Grid */}
            <div className="md:w-1/2 lg:w-3/5 flex flex-col h-full bg-white dark:bg-[#0a0a0f]/60 dark:backdrop-blur-2xl rounded-2xl shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/5 overflow-hidden transition-all">
                <div className="p-5 border-b border-gray-100 dark:border-white/5 shrink-0 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
                    <h2 className="text-xl font-black rounded-lg uppercase text-gray-800 dark:text-[#fafafa]">
                        {t("STOLLAR")}
                    </h2>
                    {isConnected ? (
                        <span className="text-xs font-bold text-green-700 dark:text-emerald-400 bg-green-100 dark:bg-emerald-500/10 px-3 py-1.5 rounded-md border border-transparent dark:border-emerald-500/20 shadow-inner">
                            {t("LIVE")}
                        </span>
                    ) : (
                        <span className="text-xs font-bold text-gray-500 dark:text-[#a1a1aa] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-md">
                            {t("OFFLINE")}
                        </span>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <TablesGrid
                        tables={tables}
                        selectedTableId={selectedTable?.id || null}
                        onSelect={setSelectedTable}
                    />
                </div>
            </div>

            {/* Right Column: Active Bill */}
            <div className="md:w-1/2 lg:w-2/5 h-full hidden md:block">
                {selectedTable ? (
                    <ActiveBill
                        table={selectedTable}
                        onAddItemClick={handleOpenMenu}
                    />
                ) : (
                    <div className="h-full flex items-center justify-center bg-white dark:bg-[#0a0a0f]/40 dark:backdrop-blur-md rounded-2xl border border-dashed border-gray-300 dark:border-white/10 text-gray-400 dark:text-[#71717a] font-medium shadow-sm transition-all text-center px-4">
                        {t("CHAP TOMONDAN STOL TANLANG")}
                    </div>
                )}
            </div>

            {/* Mobile popup for right column (simplified responsive behavior) */}
            <div className="md:hidden">
                {/* For mobile, you might render ActiveBill in a full screen sliding modal when a table is clicked, but the prompt says 'ikki ustunli (planshet uchun)', so we prioritize tablet layout. */}
            </div>

            <ReadyItemsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                readyItems={readyItems}
            />

            {isMenuOpen && targetBillId && (
                <WaiterMenuModal
                    billId={targetBillId}
                    onClose={() => setMenuOpen(false)}
                />
            )}
        </div>
    );
};


