import { useState, useMemo } from "react";
import { useCustomerCategories } from "../../customer/useCustomer";
import { useCustomerMenuItems } from "../../customer/useCustomer";
import { useAddOrderItem } from "../useWaiter";
import { Plus, Minus, Loader2, X, ShoppingBag } from "lucide-react";
import type { ICartItem } from "../../customer/types"; // using customer type as shared shape

import { getImageUrl } from "@/lib/get-image-url";

interface Props {
    billId: string;
    onClose: () => void;
}

export const WaiterMenuModal = ({ billId, onClose }: Props) => {
    const { data: categories = [], isLoading: catLoading } = useCustomerCategories();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [cart, setCart] = useState<ICartItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Default category
    useMemo(() => {
        if (!selectedCategoryId && categories.length > 0) {
            setSelectedCategoryId(categories[0].id);
        }
    }, [categories, selectedCategoryId]);

    const { data: menuItems = [], isLoading: menuLoading } = useCustomerMenuItems(selectedCategoryId);
    const addItemM = useAddOrderItem();

    const handleUpdateCart = (item: any, delta: number) => {
        setCart(prev => {
            const ext = prev.find(i => i.id === item.id);
            if (ext) {
                const nw = ext.cartQuantity + delta;
                if (nw <= 0) return prev.filter(i => i.id !== item.id);
                return prev.map(i => i.id === item.id ? { ...ext, cartQuantity: nw } : i);
            } else if (delta > 0) {
                return [...prev, { ...item, cartQuantity: delta }];
            }
            return prev;
        });
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsSubmitting(true);
        try {
            await addItemM.mutateAsync({
                billId,
                items: cart.map(c => ({
                    menuItemId: c.id,
                    quantity: c.cartQuantity
                }))
            });
            onClose(); // Close on success
        } catch (e) {
            console.error("Order submission failed: ", e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatUz = (num: string | number) => new Intl.NumberFormat('uz-UZ').format(Number(num));
    const totalQty = cart.reduce((acc, c) => acc + c.cartQuantity, 0);
    const totalAmount = cart.reduce((acc, c) => acc + (Number(c.price) * c.cartQuantity), 0);

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in fade-in duration-200">
            <div className="bg-white w-full h-full flex flex-col relative">

                {/* Header */}
                <div className="bg-white p-5 border-b border-gray-100 flex items-center justify-between shrink-0 shadow-sm z-10">
                    <div>
                        <h3 className="text-2xl font-black uppercase text-gray-900 tracking-tight">Menyu</h3>
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-1">Stolga taom qo'shish</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={24} strokeWidth={3} />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row relative">
                    {/* Left side: Categories & Menu */}
                    <div className="flex-1 flex flex-col h-full bg-white relative">
                        {catLoading ? (
                            <div className="py-4 px-5 text-gray-400 font-medium">Turkumlar yuklanmoqda...</div>
                        ) : (
                            <div className="px-5 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
                                <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
                                    {categories.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => setSelectedCategoryId(c.id)}
                                            className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${selectedCategoryId === c.id ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                                        >
                                            {c.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-gray-50/50">
                            {menuLoading ? (
                                <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-gray-300 w-10 h-10" /></div>
                            ) : menuItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <span className="text-5xl opacity-40 grayscale mb-3">🍲</span>
                                    Bu bo'lim bo'sh
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {menuItems.map(item => {
                                        const cItem = cart.find(c => c.id === item.id);
                                        const qty = cItem?.cartQuantity || 0;
                                        const isAvailable = item.isAvailable !== false;

                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => isAvailable && handleUpdateCart(item, 1)}
                                                className={`relative flex bg-white rounded-2xl shadow-sm border p-3 gap-3 transition-all overflow-hidden ${!isAvailable ? 'opacity-50 grayscale cursor-not-allowed border-gray-100' : 'cursor-pointer hover:shadow-md hover:border-blue-300 ' + (qty > 0 ? 'border-blue-500 bg-blue-50/10 ring-1 ring-blue-500' : 'border-gray-100')}`}
                                            >
                                                {/* Badge for quantity */}
                                                {qty > 0 && (
                                                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                                                        {qty}
                                                    </div>
                                                )}

                                                {/* Image */}
                                                <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-xl overflow-hidden shadow-sm flex items-center justify-center relative">
                                                    {item.avatarUrl ? (
                                                        <img src={getImageUrl(item.avatarUrl)!} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-3xl text-gray-300">🍲</span>
                                                    )}
                                                </div>

                                                <div className="flex-1 flex flex-col justify-between py-1 pr-2">
                                                    <div className="pr-5">
                                                        <h4 className="font-bold text-gray-900 leading-tight line-clamp-2">{item.name}</h4>
                                                        <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                                                    </div>

                                                    <div className="flex justify-between items-end mt-2">
                                                        <span className="font-black text-blue-600 text-lg">
                                                            {formatUz(item.price)} <span className="text-[10px] uppercase text-blue-400">UZS</span>
                                                        </span>

                                                        {!isAvailable && (
                                                            <span className="text-[10px] font-bold text-red-500 uppercase px-2 bg-red-50 py-1 rounded">Tugagan</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right side: Fixed Cart summary on large screens, or sticky at bottom on small */}
                    <div className="bg-white border-t md:border-t-0 md:border-l border-gray-200 p-5 w-full md:w-96 lg:w-[450px] flex flex-col shrink-0">
                        <div className="flex items-center gap-2 mb-4 text-gray-800">
                            <ShoppingBag className="text-blue-500" />
                            <h3 className="font-black text-lg uppercase tracking-tight">Savat</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar lg:-mx-2 lg:px-2">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center px-4">
                                    <div className="mb-2 opacity-50"><ShoppingBag size={48} strokeWidth={1} /></div>
                                    <p className="text-sm font-medium">Hozircha hech narsa qo'shilmadi</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 pb-4">
                                    {cart.map(c => (
                                        <div key={c.id} className="flex flex-col text-sm p-3 bg-white shadow-sm rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                                            <div className="font-bold text-gray-800 leading-tight mb-2 pr-2">
                                                {c.name}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="font-black text-blue-600">
                                                    {formatUz(Number(c.price) * c.cartQuantity)} <span className="text-[10px] text-blue-400 uppercase">UZS</span>
                                                </div>
                                                <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 shadow-sm p-0.5">
                                                    <button onClick={() => handleUpdateCart(c, -1)} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors active:scale-95">
                                                        <Minus size={14} strokeWidth={3} />
                                                    </button>
                                                    <span className="font-black text-sm w-6 text-center text-gray-800">{c.cartQuantity}</span>
                                                    <button onClick={() => handleUpdateCart(c, 1)} className="w-7 h-7 flex items-center justify-center text-blue-600 hover:bg-blue-100 rounded-full transition-colors active:scale-95">
                                                        <Plus size={14} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                            <div className="flex justify-between items-center text-sm font-bold text-gray-500 mb-1">
                                <span>Taomlar soni:</span>
                                <span>{totalQty} ta</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-black text-blue-900 border-t border-gray-200 pt-2 mt-2">
                                <span>JAMI:</span>
                                <span>{formatUz(totalAmount)} <span className="text-xs text-blue-500">UZS</span></span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || isSubmitting}
                            className={`w-full py-4 text-center font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${cart.length === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-[0_4px_0_0_rgb(29,78,216)] active:shadow-none active:translate-y-1'
                                }`}
                        >
                            {isSubmitting ? (
                                <><Loader2 className="animate-spin" size={20} /> Kuting...</>
                            ) : (
                                <><span>Oshpazga Yuborish</span> <span className="text-lg leading-none">→</span></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
