import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, PartyPopper } from "lucide-react";
import { useTableInfo, useOpenBillForTable } from "@/features/customer/useCustomerTable";
import { useCustomerCategories, useCustomerMenuItems } from "@/features/customer/useCustomerMenu";
import { useOrderItemsByBill, usePlaceOrder } from "@/features/customer/useCustomerOrder";
import type { IMenuItem, ICartLine } from "@/features/customer/types";

import { CustomerHeader } from "@/components/customer/CustomerHeader";
import { AISearchBar } from "@/components/customer/AISearchBar";
import { MenuItemCard } from "@/components/customer/MenuItemCard";
import { OrderStatusList } from "@/components/customer/OrderStatusList";
import { CartBar } from "@/components/customer/CartBar";
import { CategoryTabs } from "@/components/customer/CategoryTabs";

export const CustomerMenuPage = () => {
    const { tableId } = useParams<{ tableId: string }>();
    const { data: table, isLoading: isTableLoading } = useTableInfo(tableId);
    const { data: bill, isLoading: isBillLoading } = useOpenBillForTable(tableId);
    const { data: orderItems } = useOrderItemsByBill(bill?.id ?? null);

    const { data: categories = [] } = useCustomerCategories();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const { data: menuItems = [] } = useCustomerMenuItems(activeCategory || undefined);

    const [cart, setCart] = useState<Record<string, ICartLine>>({});
    const [aiReply, setAiReply] = useState<string | null>(null);
    const [aiResults, setAiResults] = useState<IMenuItem[] | null>(null);

    const placeOrder = usePlaceOrder(tableId!);

    if (isTableLoading || isBillLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><span className="animate-spin w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent"></span></div>;
    }

    if (!table) {
        return <div className="min-h-screen flex items-center justify-center p-6 text-center text-gray-500 font-medium">Stol topilmadi. QR kodni qayta skanerlang.</div>;
    }

    if (bill?.status === "TOLANDI") {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
                    <PartyPopper size={40} />
                </div>
                <h1 className="text-2xl font-black text-gray-900">Rahmat!</h1>
                <p className="text-gray-500 font-medium max-w-xs">Hisobingiz muvaffaqiyatli yopildi. Yaxshi ishtaha, yana kelib turing!</p>
            </div>
        );
    }

    const handleAiResult = (reply: string, items: IMenuItem[]) => {
        setAiReply(reply);
        setAiResults(items);
    };

    const handleIncrement = (item: IMenuItem) => {
        setCart((prev) => {
            const existing = prev[item.id];
            const count = existing ? existing.quantity + 1 : 1;
            return {
                ...prev,
                [item.id]: { menuItemId: item.id, name: item.name, price: item.price, quantity: count },
            };
        });
    };

    const handleDecrement = (item: IMenuItem) => {
        setCart((prev) => {
            const existing = prev[item.id];
            if (!existing) return prev;

            const newCart = { ...prev };
            if (existing.quantity > 1) {
                newCart[item.id] = { ...existing, quantity: existing.quantity - 1 };
            } else {
                delete newCart[item.id];
            }
            return newCart;
        });
    };

    const handleSubmitOrder = () => {
        const items = Object.values(cart);
        if (items.length === 0) return;
        placeOrder.mutate(items, {
            onSuccess: () => {
                setCart({});
            }
        });
    };

    const cartItemsCount = Object.values(cart).reduce((sum, current) => sum + current.quantity, 0);
    const cartSubtotal = Object.values(cart).reduce((sum, current) => sum + (current.price * current.quantity), 0);

    const displayedItems = aiResults || menuItems;

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans pb-[120px] max-w-md mx-auto relative shadow-2xl">
            <CustomerHeader tableNumber={table?.tableNumber} billStatus={bill?.status} />

            <AISearchBar onResult={handleAiResult} />

            {aiReply && (
                <div className="px-4 py-2 mt-1">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <p className="text-sm font-medium leading-relaxed relative z-10">{aiReply}</p>
                        <button
                            onClick={() => { setAiReply(null); setAiResults(null); }}
                            className="mt-4 text-xs font-bold bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-lg flex items-center gap-1.5 w-max"
                        >
                            <ChevronLeft size={14} /> Menyuga qaytish
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="mt-2 space-y-4">
                {!aiResults && (
                    <CategoryTabs
                        categories={categories}
                        activeCategoryId={activeCategory}
                        onSelect={setActiveCategory}
                    />
                )}

                {(orderItems && orderItems.length > 0) && (
                    <OrderStatusList items={orderItems} />
                )}

                <div className="pt-2">
                    {displayedItems.length > 0 ? (
                        displayedItems.map(item => (
                            <MenuItemCard
                                key={item.id}
                                item={item}
                                quantity={cart[item.id]?.quantity || 0}
                                onIncrement={() => handleIncrement(item)}
                                onDecrement={() => handleDecrement(item)}
                            />
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-400 font-medium">Bu turkumda hozircha taomlar yo'q.</div>
                    )}
                </div>
            </div>

            <CartBar
                itemCount={cartItemsCount}
                subtotal={cartSubtotal}
                serviceFeePercent={bill?.serviceFeePercent || null}
                onSubmit={handleSubmitOrder}
                isPending={placeOrder.isPending}
            />
        </div>
    );
};

export default CustomerMenuPage;
