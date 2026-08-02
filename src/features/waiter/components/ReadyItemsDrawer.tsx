import React from "react";
import { X, Bell } from "lucide-react";
import type { IWaiterOrderItem } from "../types";
import { useMarkDelivered } from "../useWaiter";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    readyItems: IWaiterOrderItem[];
}

export const ReadyItemsDrawer = ({ isOpen, onClose, readyItems }: Props) => {
    const markDeliveredM = useMarkDelivered();

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-[90] transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-[360px] max-w-full bg-white z-[100] shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-green-50/50">
                    <div className="flex items-center gap-3 text-green-700">
                        <Bell className="animate-bounce" size={24} />
                        <h2 className="text-xl font-black">TAYYOR TAOMLAR</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 bg-gray-50 flex flex-col gap-3">
                    {readyItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 px-4 text-center">
                            <span className="text-5xl mb-4 grayscale opacity-40">🔔</span>
                            <p className="font-medium text-lg">Hozircha tayyor taomlar yo'q</p>
                        </div>
                    ) : (
                        readyItems.map(item => (
                            <div key={item.id} className="p-4 bg-white rounded-xl shadow-sm border border-green-200 ring-2 ring-green-100">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg leading-tight uppercase tracking-tight">STOL {item.bill?.table?.tableNumber || "?"}</h4>
                                        <p className="text-gray-600 font-medium text-sm mt-1">{item.menuItem?.name}</p>
                                    </div>
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-black">TAYYOR</span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => markDeliveredM.mutate(item.id)}
                                        disabled={markDeliveredM.isPending}
                                        className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold uppercase rounded-lg shadow-sm transition-colors text-sm"
                                    >
                                        OLIB BORISH
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};
