import { getImageUrl } from "@/lib/get-image-url";
import type { IMenuItem } from "@/features/customer/types";

const formatSom = (n: number) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";

export const MenuItemCard = ({
    item,
    quantity,
    onIncrement,
    onDecrement,
}: {
    item: IMenuItem;
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
}) => (
    <div className={`flex gap-4 p-4 mb-3 mx-4 bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-gray-100 ${!item.isAvailable ? "opacity-50" : ""}`}>
        <div className="w-24 h-24 rounded-xl bg-gray-50 shrink-0 overflow-hidden border border-gray-100 relative">
            {item.avatarUrl ? (
                <img src={getImageUrl(item.avatarUrl)} className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" alt={item.name} />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-medium">Rasm yo'q</div>
            )}
        </div>
        <div className="flex flex-col flex-1 min-w-0 justify-between py-1">
            <div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h3>
                {item.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">{item.description}</p>
                )}
            </div>
            <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-bold text-blue-600">{formatSom(item.price)}</span>
                {!item.isAvailable ? (
                    <span className="text-[11px] bg-red-50 text-red-600 px-2 py-1 rounded-md font-bold uppercase tracking-wider">Tugagan</span>
                ) : quantity === 0 ? (
                    <button
                        onClick={onIncrement}
                        className="text-xs border-2 border-blue-100 bg-blue-50/50 hover:bg-blue-100/50 text-blue-600 font-bold rounded-lg px-4 py-1.5 transition-colors active:scale-95"
                    >
                        Qo'shish
                    </button>
                ) : (
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200/60">
                        <button onClick={onDecrement} className="w-7 h-7 rounded-md bg-white hover:bg-gray-100 border-none shadow-sm flex items-center justify-center text-sm font-bold text-gray-600 transition-colors">-</button>
                        <span className="text-sm w-4 text-center font-bold text-gray-800">{quantity}</span>
                        <button onClick={onIncrement} className="w-7 h-7 rounded-md bg-blue-600 text-white shadow-sm shadow-blue-200 flex items-center justify-center text-sm font-bold active:scale-95 transition-transform">+</button>
                    </div>
                )}
            </div>
        </div>
    </div>
);
