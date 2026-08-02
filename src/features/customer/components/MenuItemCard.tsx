
import type { ICartItem } from "../types";
import { Plus, Minus } from "lucide-react";

import { getImageUrl } from "@/lib/get-image-url";

interface Props {
    item: any;
    cartItem?: ICartItem;
    onUpdateQuantity: (item: any, delta: number) => void;
}

export const MenuItemCard = ({ item, cartItem, onUpdateQuantity }: Props) => {
    const qty = cartItem?.cartQuantity || 0;
    const isAvailable = item.isAvailable !== false; // handle explicitly false

    return (
        <div className={`flex gap-3 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm mb-3 ${!isAvailable ? 'opacity-50 grayscale' : ''}`}>
            {/* Image Placeholder */}
            <div className="w-24 h-24 shrink-0 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                {item.avatarUrl ? (
                    <img src={getImageUrl(item.avatarUrl)!} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-gray-300 text-3xl">🍲</div>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                    <h3 className="font-bold text-gray-900 leading-tight">{item.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                </div>

                <div className="flex justify-between items-end mt-2">
                    <span className="font-black text-blue-600">
                        {parseInt(item.price).toLocaleString()} <span className="text-[10px] uppercase">UZS</span>
                    </span>

                    {isAvailable ? (
                        <div className="flex items-center gap-3 bg-gray-50 rounded-full border border-gray-200">
                            {qty > 0 ? (
                                <>
                                    <button onClick={() => onUpdateQuantity(item, -1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors">
                                        <Minus size={16} />
                                    </button>
                                    <span className="font-bold text-sm w-4 text-center">{qty}</span>
                                </>
                            ) : (
                                <div className="w-8" />
                            )}
                            <button onClick={() => onUpdateQuantity(item, 1)} className="w-8 h-8 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>
                    ) : (
                        <span className="text-xs font-bold text-red-500 uppercase tracking-widest px-2">Tugagan</span>
                    )}
                </div>
            </div>
        </div>
    );
};
