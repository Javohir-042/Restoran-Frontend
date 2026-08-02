import React from "react";
import type { ITable } from "../../../restaurant-table/types";

interface Props {
    tables: ITable[];
    selectedTableId: string | null;
    onSelect: (table: ITable) => void;
}

export const TablesGrid = ({ tables, selectedTableId, onSelect }: Props) => {

    // Sort tables by number ascending
    const sortedTables = [...tables].sort((a, b) => a.tableNumber - b.tableNumber);

    const getStatusStyles = (status: string, isSelected: boolean) => {
        let base = "";
        let border = isSelected ? "ring-4 ring-blue-500 shadow-xl scale-[1.02]" : "ring-1 ring-gray-200 shadow-sm hover:scale-[1.01]";

        switch (status) {
            case "BO_SH":
                base = "bg-green-50 text-green-700";
                break;
            case "BAND":
                base = "bg-orange-50 text-orange-700";
                break;
            case "REZERV":
                base = "bg-blue-50 text-blue-700";
                break;
            default:
                base = "bg-gray-50 text-gray-700";
        }
        return `${base} ${border}`;
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "BO_SH": return "BO'SH";
            case "BAND": return "BAND";
            case "REZERV": return "REZERV";
            default: return status;
        }
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-1">
            {sortedTables.map(t => (
                <button
                    key={t.id}
                    onClick={() => onSelect(t)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 min-h-[140px] ${getStatusStyles(t.status || "BO_SH", selectedTableId === t.id)}`}
                >
                    <span className="text-4xl font-black mb-2 opacity-90">{t.tableNumber < 10 ? `0${t.tableNumber}` : t.tableNumber}</span>
                    <span className="px-3 py-1 rounded-full bg-white/60 text-sm font-bold tracking-widest uppercase">
                        {getStatusText(t.status || "BO_SH")}
                    </span>
                </button>
            ))}
        </div>
    );
};
