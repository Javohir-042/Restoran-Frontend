import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
    useCustomerTable,
    useCustomerCategories,
    useCustomerMenuItems,
    useCustomerActiveBill,
    useCustomerSubmitOrder,
    useCustomerOrderItems,
    useCustomerOpenBill,
    useCustomerAiAssistant
} from "../../features/customer/useCustomer";
import { MenuItemCard } from "../../features/customer/components/MenuItemCard";
import { CartPanel } from "../../features/customer/components/CartPanel";
import { OrderTracker } from "../../features/customer/components/OrderTracker";
import type { ICartItem } from "../../features/customer/types";
import { Loader2, Bot } from "lucide-react";

export const CustomerPage = () => {
    const { tableId } = useParams();

    // Core Data Fetching
    const { data: table, isLoading: tableLoading } = useCustomerTable(tableId);
    const { data: bill } = useCustomerActiveBill(tableId);
    const { data: categories = [] } = useCustomerCategories();

    // State
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [cart, setCart] = useState<ICartItem[]>([]);
    const [activeTab, setActiveTab] = useState<"MENU" | "ORDERS">("MENU");
    const [searchQuery, setSearchQuery] = useState("");

    // Setup Category Default
    useMemo(() => {
        if (!selectedCategoryId && categories.length > 0) {
            setSelectedCategoryId(categories[0].id);
        }
    }, [categories, selectedCategoryId]);

    const { data: menuItems = [], isLoading: menuLoading } = useCustomerMenuItems(selectedCategoryId);
    const { data: orderItems = [], isLoading: ordersLoading } = useCustomerOrderItems(bill?.id);

    const openBillM = useCustomerOpenBill();
    const submitOrderM = useCustomerSubmitOrder();
    const aiAssistantM = useCustomerAiAssistant();

    if (tableLoading) return <div className="h-screen w-full flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;

    if (!table) return (
        <div className="h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
            <span className="text-6xl mb-4">🍽️</span>
            <h1 className="text-2xl font-black text-gray-900">Stol Topilmadi</h1>
            <p className="text-gray-500 mt-2">Iltimos, QR kodni qayta skanerlang.</p>
        </div>
    );

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
        let currentBillId = bill?.id;

        // Open bill if none exists
        if (!currentBillId) {
            try {
                const newBill = await openBillM.mutateAsync(table.id);
                currentBillId = newBill.id;
            } catch {
                return;
            }
        }

        // Submit order items
        if (currentBillId) {
            submitOrderM.mutate({
                billId: currentBillId,
                items: cart.map(c => ({ menuItemId: c.id, quantity: c.cartQuantity }))
            }, {
                onSuccess: () => {
                    setCart([]);
                    setActiveTab("ORDERS");
                }
            });
        }
    };

    const handleAiSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        aiAssistantM.mutate(searchQuery);
    };

    const displayItems = aiAssistantM.isSuccess && aiAssistantM.data ? aiAssistantM.data : menuItems;
    const isAiMode = aiAssistantM.isSuccess && aiAssistantM.data;

    return (
        <div className="min-h-screen bg-gray-50 max-w-xl mx-auto flex flex-col relative font-sans">
            {/* Header Sticky */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 px-5 pt-6 pb-4 border-b border-gray-100 shadow-sm">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Menyu</h1>
                        <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mt-1">Stol {table.tableNumber}</p>
                    </div>
                    {bill && <div className="bg-blue-100 text-blue-700 font-bold text-xs px-3 py-1.5 rounded-full ring-2 ring-white">Ochiq hisob</div>}
                </div>

                {/* AI Search Bar */}
                <form onSubmit={handleAiSearch} className="relative mt-2">
                    <input
                        type="text"
                        placeholder="Nima yesam bo'ladi? AI dan so'rang..."
                        value={searchQuery}
                        onChange={e => {
                            setSearchQuery(e.target.value);
                            if (e.target.value === "") aiAssistantM.reset();
                        }}
                        className="w-full bg-gray-100/80 border-none rounded-xl py-3 pl-11 pr-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                    />
                    <Bot size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                    {aiAssistantM.isPending && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" />}
                </form>

                {/* Main Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl mt-4">
                    <button
                        onClick={() => setActiveTab("MENU")}
                        className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === "MENU" ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                    >
                        Taomlar
                    </button>
                    <button
                        onClick={() => setActiveTab("ORDERS")}
                        className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 ${activeTab === "ORDERS" ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                    >
                        Buyurtmam {orderItems.length > 0 && <span className="bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px]">{orderItems.length}</span>}
                    </button>
                </div>
            </div>

            <div className="p-4">
                {activeTab === "MENU" ? (
                    <>
                        {/* Categories (Horizontal Scroll) */}
                        {!isAiMode && (
                            <div className="flex overflow-x-auto gap-2 no-scrollbar mb-5 -mx-4 px-4 pb-2">
                                {categories.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => setSelectedCategoryId(c.id)}
                                        className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all border ${selectedCategoryId === c.id ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                    >
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {isAiMode && (
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-bold text-gray-700 text-sm">AI Tavsiyalari</h3>
                                <button onClick={() => { setSearchQuery(""); aiAssistantM.reset(); }} className="text-xs text-blue-500 font-bold uppercase">Tozalash</button>
                            </div>
                        )}

                        {/* Menu Items */}
                        {menuLoading && !isAiMode ? (
                            <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-gray-300" /></div>
                        ) : (
                            <div className="pb-24">
                                {displayItems.length === 0 && (
                                    <div className="text-center py-10 text-gray-400 font-medium">Bu bo'limda taomlar yo'q</div>
                                )}
                                {displayItems.map(item => (
                                    <MenuItemCard
                                        key={item.id}
                                        item={item}
                                        cartItem={cart.find(c => c.id === item.id)}
                                        onUpdateQuantity={handleUpdateCart}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <OrderTracker items={orderItems} isLoading={ordersLoading} />
                )}
            </div>

            {/* Cart Fixed Footer */}
            {activeTab === "MENU" && cart.length > 0 && (
                <CartPanel
                    cartItems={cart}
                    onCheckout={handleCheckout}
                    isSubmitting={openBillM.isPending || submitOrderM.isPending}
                />
            )}
        </div>
    );
};
