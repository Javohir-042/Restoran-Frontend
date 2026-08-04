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
    const cartSubtotal = Object.values(cart).reduce((sum, current) => sum + (Number(current.price) * current.quantity), 0);

    const displayedItems = aiResults || menuItems;

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-[120px] lg:pb-0 relative w-full overflow-hidden flex flex-col lg:flex-row">

            {/* LEFT SIDE: Menu content */}
            <div className="flex-1 w-full max-w-md lg:max-w-none mx-auto lg:mx-0 lg:w-[60%] lg:border-r border-gray-100 bg-white min-h-screen lg:overflow-y-auto custom-scrollbar lg:pb-24 shadow-2xl lg:shadow-none">
                <CustomerHeader tableNumber={table?.tableNumber} billStatus={bill?.status} />

                {/* Mobile AI bar (only visible on small screens) */}
                <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-30">
                    <AISearchBar onResult={handleAiResult} />
                </div>

                <div className="px-0 lg:px-8 mt-2 lg:mt-6 space-y-4">
                    {!aiResults && (
                        <CategoryTabs
                            categories={categories}
                            activeCategoryId={activeCategory}
                            onSelect={setActiveCategory}
                        />
                    )}

                    {(orderItems && orderItems.length > 0) && (
                        <div className="space-y-3">
                            <OrderStatusList items={orderItems} />

                            {bill && (
                                <div className="mx-2 lg:mx-0 px-4 py-3 bg-blue-50 border border-blue-100 rounded-2xl space-y-2 shadow-sm">
                                    <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                                        <span>Buyurtmalar qiymati:</span>
                                        <span className="text-gray-800">{new Intl.NumberFormat("uz-UZ").format(bill.subtotal)} so'm</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                                        <span>Xizmat haqi ({bill.serviceFeePercent}%):</span>
                                        <span className="text-gray-800">{new Intl.NumberFormat("uz-UZ").format(Math.round((bill.subtotal * bill.serviceFeePercent) / 100))} so'm</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-black text-blue-800 pt-2 border-t border-blue-200/60">
                                        <span>Jami hisobingiz:</span>
                                        <span>{new Intl.NumberFormat("uz-UZ").format(bill.totalAmount)} so'm</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-2 px-1">
                        {displayedItems.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-2">
                                {displayedItems.map(item => (
                                    <MenuItemCard
                                        key={item.id}
                                        item={item}
                                        quantity={cart[item.id]?.quantity || 0}
                                        onIncrement={() => handleIncrement(item)}
                                        onDecrement={() => handleDecrement(item)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-400 font-medium bg-gray-50 rounded-2xl mx-3">Bu turkumda hozircha taomlar yo'q.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: AI Assistant & Cart Sidebar for Desktop */}
            <div className="hidden lg:flex w-full lg:w-[40%] bg-blue-50/30 flex-col relative">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 pb-40">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full text-blue-600 mb-3 shadow-sm ring-4 ring-blue-50">🤖</div>
                        <h2 className="text-xl font-bold text-gray-900">Virtual Yordamchi</h2>
                        <p className="text-sm text-gray-500 font-medium mt-1 mx-8 leading-relaxed">
                            Qanday taomlar qidiryapsiz? Narxi, dietangiz yoki ta'bini aytsangiz, men ideal tanlovni topaman.
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 relative max-w-sm mx-auto">
                        <AISearchBar onResult={handleAiResult} />
                    </div>

                    {aiReply && (
                        <div className="max-w-sm mx-auto">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] rounded-tr-none p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden transform transition-all duration-500 animate-in slide-in-from-bottom-5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                <h3 className="font-bold text-blue-100 text-xs tracking-wider uppercase mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Ofitsiant Tavsiyasi
                                </h3>
                                <p className="text-sm font-medium leading-relaxed relative z-10 text-blue-50">{aiReply}</p>
                                <button
                                    onClick={() => { setAiReply(null); setAiResults(null); }}
                                    className="mt-5 text-xs font-bold text-white bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl flex items-center gap-1.5 w-max backdrop-blur-sm"
                                >
                                    <ChevronLeft size={14} /> Tozalash
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Cart Wrapper Fixed Desktop */}
                <div className="lg:absolute lg:bottom-0 lg:left-0 lg:right-0 bg-white border-t border-gray-200 z-30">
                    <CartBar
                        itemCount={cartItemsCount}
                        subtotal={cartSubtotal}
                        serviceFeePercent={bill?.serviceFeePercent || null}
                        onSubmit={handleSubmitOrder}
                        isPending={placeOrder.isPending}
                    />
                </div>
            </div>

            {/* Mobile Cart Absolute wrapper (Only shows when lg:hidden anyway) */}
            <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-30">
                <CartBar
                    itemCount={cartItemsCount}
                    subtotal={cartSubtotal}
                    serviceFeePercent={bill?.serviceFeePercent || null}
                    onSubmit={handleSubmitOrder}
                    isPending={placeOrder.isPending}
                />
            </div>

        </div>
    );
};

export default CustomerMenuPage;
