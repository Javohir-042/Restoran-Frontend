
import type { ICustomerOrderItem } from "../types";
import { Loader2 } from "lucide-react";

interface Props {
    items: ICustomerOrderItem[];
    isLoading: boolean;
}

export const OrderTracker = ({ items, isLoading }: Props) => {
    if (isLoading) {
        return <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;
    }

    if (items.length === 0) {
        return (
            <div className="py-10 text-center text-gray-400">
                <span className="text-4xl">🕒</span>
                <p className="mt-4 font-medium">Siz hali hech narsa buyurtma qilmadingiz.</p>
            </div>
        );
    }

    // Check if the bill is entirely finished (all are 'YETKAZILDI')
    const allDelivered = items.every(i => i.status === "YETKAZILDI");
    const totalAmount = items.reduce((acc, curr) => acc + (parseInt(curr.priceAtOrder) * curr.quantity), 0);

    return (
        <div className="flex flex-col gap-3 pb-24">
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm mb-2 px-1">Buyurtmalar tarixi</h3>

            {items.map(item => {
                let statusColor = "bg-gray-100 text-gray-500";
                switch (item.status) {
                    case "YANGI": statusColor = "bg-gray-200 text-gray-700"; break;
                    case "TAYYORLANMOQDA": statusColor = "bg-orange-100 text-orange-700 font-bold border border-orange-200"; break;
                    case "TAYYOR": statusColor = "bg-green-100 text-green-700 font-bold border border-green-300"; break;
                    case "YETKAZILDI": statusColor = "bg-gray-50 text-gray-400 line-through"; break;
                }

                return (
                    <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div>
                            <div className="font-bold text-gray-900 text-sm">
                                <span className="text-gray-400 font-medium mr-2">{item.quantity}x</span>
                                {item.menuItem?.name || "Noma'lum"}
                            </div>
                        </div>
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md ${statusColor}`}>
                            {item.status}
                        </span>
                    </div>
                )
            })}

            {allDelivered && items.length > 0 && (
                <div className="mt-8 bg-blue-50 border-2 border-blue-100 rounded-2xl p-6 text-center shadow-inner">
                    <span className="text-4xl">🧾</span>
                    <h4 className="font-black text-xl text-blue-900 mt-3 mb-1">To'lov vaqti keldi!</h4>
                    <p className="text-sm text-blue-700 font-medium leading-tight mb-4">Iltimos, to'lovni kassir yoki ofitsiantga amalga oshiring.</p>
                    <div className="font-bold text-xs uppercase tracking-wider text-blue-500 mb-1">Jami Summa</div>
                    <div className="font-black text-3xl text-blue-800">{new Intl.NumberFormat('uz-UZ').format(totalAmount)} <span className="text-sm">UZS</span></div>
                </div>
            )}
        </div>
    );
};
