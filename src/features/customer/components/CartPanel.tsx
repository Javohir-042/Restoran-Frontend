import type { ICartItem } from "../types";

interface Props {
    cartItems: ICartItem[];
    onCheckout: () => void;
    isSubmitting: boolean;
}

export const CartPanel = ({ cartItems, onCheckout, isSubmitting }: Props) => {
    if (cartItems.length === 0) return null;

    const totalQuantity = cartItems.reduce((acc, item) => acc + item.cartQuantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + Number(item.price) * item.cartQuantity, 0);

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-white via-white to-white/90 border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50">
            <div className="max-w-md mx-auto">
                <button
                    onClick={onCheckout}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-between p-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl shadow-xl transition-all"
                >
                    <div className="flex flex-col items-start">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-80">{totalQuantity} ta taom</span>
                        <span className="font-black text-xl">{totalPrice.toLocaleString()} UZS</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold uppercase">
                        {isSubmitting ? "Kuting..." : "Buyurtma berish"}
                        {!isSubmitting && <span className="text-xl leading-none">→</span>}
                    </div>
                </button>
            </div>
        </div>
    );
};
