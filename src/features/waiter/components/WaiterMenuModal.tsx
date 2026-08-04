import { useState, useMemo } from "react";
import { useCustomerCategories } from "../../customer/useCustomer";
import { useCustomerMenuItems } from "../../customer/useCustomer";
import { useAddOrderItem } from "../useWaiter";
import { Plus, Minus, Loader2, X, ShoppingBag } from "lucide-react";
import type { ICartItem } from "../../customer/types"; // using customer type as shared shape
import { getImageUrl } from "@/lib/get-image-url";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
    billId: string;
    onClose: () => void;
}

export const WaiterMenuModal = ({ billId, onClose }: Props) => {
    const { t } = useLanguage();
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
        <div className="fixed inset-0 bg-white/50 dark:bg-[#050508]/90 dark:backdrop-blur-xl z-50 flex flex-col animate-in fade-in duration-200">
            <div className="w-full h-full flex flex-col relative shadow-2xl overflow-hidden bg-white dark:bg-transparent">

                {/* Ambient glow for dark mode */}
                <div className="hidden dark:block absolute top-[10%] left-[20%] w-[50%] h-[50%] bg-blue-600/10 blur-[130px] rounded-full mix-blend-screen pointer-events-none" />
                <div className="hidden dark:block absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

                {/* Header */}
                <div className="bg-white/95 dark:bg-[#0a0a0f]/60 dark:backdrop-blur-xl p-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between shrink-0 shadow-sm z-10 transition-colors">
                    <div>
                        <h3 className="text-2xl font-black uppercase text-gray-900 dark:text-[#fafafa] tracking-tight dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{t("Menyu")}</h3>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mt-1">{t("Stolga taom qo'shish")}</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-[#a1a1aa] hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors border dark:border-white/5 shadow-sm">
                        <X size={24} strokeWidth={3} />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row relative">
                    {/* Left side: Categories & Menu */}
                    <div className="flex-1 flex flex-col h-full bg-white dark:bg-transparent relative transition-colors">
                        {catLoading ? (
                            <div className="py-4 px-5 text-gray-400 dark:text-[#71717a] font-medium">{t("Turkumlar yuklanmoqda...")}</div>
                        ) : (
                            <div className="px-5 py-3 border-b border-gray-100 dark:border-white/10 bg-white/95 dark:bg-[#0a0a0f]/40 dark:backdrop-blur-md sticky top-0 z-10 transition-colors">
                                <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
                                    {categories.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => setSelectedCategoryId(c.id)}
                                            className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${selectedCategoryId === c.id ? 'bg-blue-600 dark:bg-blue-600/20 text-white border-blue-600 dark:border-blue-500/50 shadow-md shadow-blue-200 dark:shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-gray-50 dark:bg-white/[0.02] text-gray-600 dark:text-[#a1a1aa] border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                                        >
                                            {c.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-gray-50/50 dark:bg-transparent">
                            {menuLoading ? (
                                <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-gray-300 dark:text-gray-600 w-10 h-10" /></div>
                            ) : menuItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-[#71717a]">
                                    <span className="text-5xl opacity-40 grayscale mb-3">🍲</span>
                                    {t("Bu bo'lim bo'sh")}
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
                                                className={`relative flex rounded-2xl shadow-sm border p-3 gap-3 transition-all duration-300 overflow-hidden ${!isAvailable ? 'opacity-50 grayscale cursor-not-allowed border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.01]' : 'cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-400/50 bg-white dark:bg-white/[0.03] dark:hover:bg-white/[0.06] backdrop-blur-sm ' + (qty > 0 ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-500/10 ring-1 ring-blue-500 dark:ring-blue-400/50' : 'border-gray-100 dark:border-white/10')}`}
                                            >
                                                {/* Badge for quantity */}
                                                {qty > 0 && (
                                                    <div className="absolute top-2 right-2 bg-blue-600 dark:bg-blue-500 text-white text-xs font-black w-7 h-7 rounded-full flex items-center justify-center shadow-lg dark:shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-in zoom-in border border-white/20">
                                                        {qty}
                                                    </div>
                                                )}

                                                {/* Image */}
                                                <div className="w-24 h-24 shrink-0 bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden shadow-inner border dark:border-white/5 flex items-center justify-center relative group">
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors z-10" />
                                                    {item.avatarUrl ? (
                                                        <img src={getImageUrl(item.avatarUrl)!} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <span className="text-3xl text-gray-300 dark:text-gray-600">🍲</span>
                                                    )}
                                                </div>

                                                <div className="flex-1 flex flex-col justify-between py-1 pr-2">
                                                    <div className="pr-5">
                                                        <h4 className="font-bold text-gray-900 dark:text-[#fafafa] leading-tight line-clamp-2">{item.name}</h4>

                                                        <p className="text-[11px] text-gray-400 dark:text-[#71717a] mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                                                    </div>

                                                    <div className="flex justify-between items-end mt-2">
                                                        <span className="font-black text-blue-600 dark:text-blue-400 text-lg">
                                                            {formatUz(item.price)} <span className="text-[10px] uppercase text-blue-400 dark:text-blue-500">UZS</span>
                                                        </span>

                                                        {!isAvailable && (
                                                            <span className="text-[10px] font-bold text-red-500 uppercase px-2 bg-red-50 dark:bg-red-500/10 py-1 rounded">Tugagan</span>
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
                    <div className="bg-white/95 dark:bg-[#0a0a0f]/60 dark:backdrop-blur-2xl border-t md:border-t-0 md:border-l border-gray-200 dark:border-white/5 p-5 w-full md:w-96 lg:w-[450px] flex flex-col shrink-0 transition-colors z-20 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] dark:shadow-[-20px_0_50px_-20px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3 mb-5 text-gray-800 dark:text-[#fafafa]">
                            <div className="p-2 bg-blue-50 dark:bg-blue-500/20 rounded-xl">
                                <ShoppingBag className="text-blue-600 dark:text-blue-400" size={24} />
                            </div>
                            <h3 className="font-black text-xl uppercase tracking-tight">{t("Savat")}</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar lg:-mx-2 lg:px-2">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-[#71717a] text-center px-4">
                                    <div className="mb-4 opacity-50 bg-gray-100 dark:bg-white/5 p-6 rounded-full"><ShoppingBag size={48} strokeWidth={1.5} /></div>
                                    <p className="text-base font-medium">{t("Hozircha hech narsa qo'shilmadi")}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 pb-4">
                                    {cart.map(c => (
                                        <div key={c.id} className="flex flex-col text-sm p-4 bg-white dark:bg-white/[0.03] shadow-sm rounded-2xl border border-gray-100 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all">
                                            <div className="font-bold text-gray-900 dark:text-[#fafafa] leading-tight mb-3 pr-2 text-base">
                                                {c.name}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="font-black text-blue-600 dark:text-blue-400 text-lg dark:drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                                                    {formatUz(Number(c.price) * c.cartQuantity)} <span className="text-xs text-blue-400 dark:text-blue-500 uppercase">UZS</span>
                                                </div>
                                                <div className="flex items-center bg-gray-50 dark:bg-black/40 rounded-full border border-gray-200 dark:border-white/10 shadow-inner p-1">
                                                    <button onClick={() => handleUpdateCart(c, -1)} className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-[#a1a1aa] hover:text-red-600 dark:hover:text-white hover:bg-red-50 dark:hover:bg-red-500/50 rounded-full transition-colors active:scale-90">
                                                        <Minus size={16} strokeWidth={3} />
                                                    </button>
                                                    <span className="font-black text-base w-8 text-center text-gray-800 dark:text-[#fafafa]">{c.cartQuantity}</span>
                                                    <button onClick={() => handleUpdateCart(c, 1)} className="w-8 h-8 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:text-white hover:bg-blue-100 dark:hover:bg-blue-500/50 rounded-full transition-colors active:scale-90">
                                                        <Plus size={16} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 dark:bg-white/[0.02] p-5 rounded-2xl border border-gray-200 dark:border-white/10 mb-5 relative overflow-hidden">
                            {/* Inner subtle glow */}
                            <div className="hidden dark:block absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px]" />
                            <div className="flex justify-between items-center text-sm font-bold text-gray-500 dark:text-[#a1a1aa] mb-2">
                                <span>{t("Taomlar soni:")}</span>
                                <span className="bg-white dark:bg-black/30 px-3 py-1 rounded-full border dark:border-white/5">{totalQty} {t("ta")}</span>
                            </div>
                            <div className="flex justify-between items-center text-xl font-black text-blue-900 dark:text-blue-400 border-t border-gray-200 dark:border-white/10 pt-3 mt-3">
                                <span>{t("JAMI:")}</span>
                                <span className="dark:drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">{formatUz(totalAmount)} <span className="text-sm text-blue-500">UZS</span></span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || isSubmitting}
                            className={`w-full py-4 px-6 text-center font-black uppercase tracking-wider rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group ${cart.length === 0
                                ? 'bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-[#52525b] cursor-not-allowed border dark:border-white/5'
                                : 'bg-blue-600 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 hover:bg-blue-700 dark:hover:from-blue-500 dark:hover:to-indigo-500 text-white shadow-[0_6px_0_0_rgb(29,78,216)] dark:shadow-[0_0_30px_rgba(79,70,229,0.5)] dark:border dark:border-white/10 active:translate-y-1 active:shadow-none dark:active:shadow-[0_0_15px_rgba(79,70,229,0.5)]'
                                }`}
                        >
                            {/* Hover light beam for active button */}
                            {cart.length > 0 && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />}

                            {isSubmitting ? (
                                <><Loader2 className="animate-spin" size={24} /> {t("Kuting...")}</>
                            ) : (
                                <><span>{t("Oshpazga Yuborish")}</span> <span className="text-xl leading-none group-hover:translate-x-1 transition-transform">→</span></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
