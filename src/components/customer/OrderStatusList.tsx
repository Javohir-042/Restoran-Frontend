import type { IOrderItem } from "@/features/customer/types";
import { Utensils, CheckCircle2, Clock, CheckCheck } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    YANGI: { label: "Qabul qilindi", color: "text-blue-600 bg-blue-50 border-blue-100", icon: CheckCircle2 },
    TAYYORLANMOQDA: { label: "Tayyorlanmoqda", color: "text-orange-600 bg-orange-50 border-orange-100", icon: Clock },
    TAYYOR: { label: "Tayyor", color: "text-emerald-700 bg-emerald-50 border-emerald-100", icon: CheckCheck },
    YETKAZILDI: { label: "Yetkazildi", color: "text-gray-500 bg-gray-50 border-gray-200", icon: Utensils },
};

export const OrderStatusList = ({ items }: { items: IOrderItem[] }) => {
    if (items.length === 0) return null;

    return (
        <div className="px-4 py-4 mt-2">
            <div className="flex items-center gap-2 mb-3 px-1">
                <Utensils className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-gray-800">Mening buyurtmalarim</h3>
            </div>
            <div className="space-y-2.5">
                {items.map((item) => {
                    const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.YANGI;
                    const Icon = config.icon;
                    return (
                        <div key={item.id} className="flex items-center justify-between bg-white border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] rounded-xl px-4 py-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                    <span className="text-sm font-bold text-gray-700">{item.quantity}x</span>
                                </div>
                                <span className="text-sm font-bold text-gray-800 tracking-tight">{item.menuItem.name}</span>
                            </div>
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${config.color}`}>
                                <Icon className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{config.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
