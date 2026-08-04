import type { ITable } from "../../restaurant-table/types";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
    tables: ITable[];
    selectedTableId: string | null;
    onSelect: (table: ITable) => void;
}

export const TablesGrid = ({ tables, selectedTableId, onSelect }: Props) => {
    const { t } = useLanguage();

    // Sort tables by number ascending
    const sortedTables = [...tables].sort((a, b) => a.tableNumber - b.tableNumber);

    const getStatusStyles = (status: string, isSelected: boolean) => {
        let base = "";
        let border = isSelected ? "ring-4 ring-blue-500 shadow-xl scale-[1.02] dark:ring-blue-500/80 dark:shadow-[0_4px_20px_rgba(59,130,246,0.3)]" : "ring-1 ring-gray-200 dark:ring-white/5 shadow-sm hover:scale-[1.01] hover:dark:bg-white/[0.04]";

        switch (status) {
            case "BO_SH":
                base = "bg-green-50 text-green-700 dark:bg-emerald-500/10 dark:text-emerald-400";
                break;
            case "BAND":
                base = "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
                break;
            case "REZERV":
                base = "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
                break;
            default:
                base = "bg-gray-50 text-gray-700 dark:bg-white/5 dark:text-[#a1a1aa]";
        }
        return `${base} ${border}`;
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "BO_SH": return t("BO'SH");
            case "BAND": return t("BAND");
            case "REZERV": return t("REZERV");
            default: return status;
        }
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-1">
            {sortedTables.map(t => (
                <button
                    key={t.id}
                    onClick={() => onSelect(t)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 min-h-[140px] dark:backdrop-blur-xl ${getStatusStyles(t.status || "BO_SH", selectedTableId === t.id)}`}
                >
                    <span className="text-4xl font-black mb-2 opacity-90">{t.tableNumber < 10 ? `0${t.tableNumber}` : t.tableNumber}</span>
                    <span className="px-3 py-1 rounded-full bg-white/60 dark:bg-black/20 text-sm font-bold tracking-widest uppercase">
                        {getStatusText(t.status || "BO_SH")}
                    </span>
                </button>
            ))}
        </div>
    );
};
