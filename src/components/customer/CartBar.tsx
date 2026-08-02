const formatSom = (n: number) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";

export const CartBar = ({
    itemCount,
    subtotal,
    serviceFeePercent,
    onSubmit,
    isPending,
}: {
    itemCount: number;
    subtotal: number;
    serviceFeePercent: number | null;
    onSubmit: () => void;
    isPending: boolean;
}) => {
    if (itemCount === 0) return null;

    const serviceFee = serviceFeePercent ? Math.round((subtotal * serviceFeePercent) / 100) : 0;
    const total = subtotal + serviceFee;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 px-4 py-4 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] rounded-t-3xl">
            <div className="max-w-md mx-auto space-y-3">
                <div className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
                    <div className="flex justify-between text-xs font-semibold text-gray-500">
                        <span>Tanlangan taomlar ({itemCount})</span>
                        <span className="text-gray-800">{formatSom(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-gray-500">
                        <span>Xizmat haqi {serviceFeePercent ? `(${serviceFeePercent}%)` : ""}</span>
                        <span className="text-gray-800">{serviceFeePercent ? formatSom(serviceFee) : "Keyin qo'shiladi"}</span>
                    </div>
                </div>

                <button
                    onClick={onSubmit}
                    disabled={isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-xl text-sm flex items-center justify-between px-5 disabled:opacity-70 active:scale-[0.98] transition-transform shadow-lg shadow-blue-500/25"
                >
                    <span>{isPending ? "Buyurtma yuborilmoqda..." : "Buyurtmani tasdiqlash"}</span>
                    <span className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm shadow-sm">{formatSom(total)}</span>
                </button>
            </div>
        </div>
    );
};
