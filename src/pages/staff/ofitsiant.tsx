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

export const OfitsiantPage = () => {
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
        <div className="h-full flex flex-col md:flex-row gap-4 p-1 overflow-hidden relative">
            {headerActions}

            {/* Left Column: Tables Grid */}
            <div className="md:w-1/2 lg:w-3/5 flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 shrink-0 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-black rounded-lg uppercase text-gray-800">
                        STOLLAR
                    </h2>
                    {isConnected ? (
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">LIVE</span>
                    ) : (
                        <span className="text-xs font-bold text-gray-500 border px-2 py-1 rounded">OFFLINE</span>
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
                    <div className="h-full flex items-center justify-center bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400 font-medium">
                        CHAP TOMONDAN STOL TANLANG
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


